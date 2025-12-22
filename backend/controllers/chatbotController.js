const Chatbot = require('../model/Chatbot');
const UserChatbot = require('../model/UserChatbot');
const axios = require('axios');
const OpenAI = require('openai');
require('dotenv').config();
const UserBio = require('../model/UserBio');
const LearningGoal = require('../model/LearningGoal');
const { LearningTree } = require('../model/LearningTree');
const { Achievement } = require('../model/Achievement');
const Schedule = require('../model/Schedule');
const Post = require('../model/Post');
const Story = require('../model/Story');

// Cấu hình OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Tạo hội thoại mới
const createChat = async (req, res) => {
    const userId = req.user.userId;
    const { text, answer } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "Bạn cần đăng nhập" });
    }

    if (!text) {
        return res.status(400).json({ message: "Bạn cần nhập nội dung câu hỏi" });
    }

    try {
        // Tạo hội thoại mới
        const newChat = new Chatbot({
            user: userId,
            history: [
                {
                    role: 'user',
                    parts: [{ text }],
                },
                {
                    role: 'model',
                    parts: [{ text: answer }],
                },
            ],
        });

        // Lưu hội thoại
        const savedChat = await newChat.save();
        // Kiểm tra nếu bản ghi userChatbot đã tồn tại
        const userChatbot = await UserChatbot.findOne({ user: userId });

        if (!userChatbot) {
            const newUserChatbot = new UserChatbot({
                user: userId,
                chats: [
                    {
                        _id: savedChat._id,
                        title: text.substring(0, 40),
                    }
                ]
            });
            await newUserChatbot.save();
        }
        else {
            await UserChatbot.updateOne(
                { user: userId },
                {
                    $push: {
                        chats: {
                            _id: savedChat._id,
                            title: text.substring(0, 40),
                        }
                    }
                }
            );
        }

        return res.status(201).json(savedChat);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Lấy danh sách hội thoại
const getChats = async (req, res) => {
    const userId = req.user.userId;

    try {
        const userChatbot = await UserChatbot.findOne({ user: userId });
        console.log(userChatbot);
        if (!userChatbot || !userChatbot.chats || userChatbot.chats.length === 0) {
            return res.status(200).json({ message: "Không có hội thoại nào" });
        }
        res.status(200).send(userChatbot.chats);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách hội thoại: ", error);
        res.status(500).send("Lỗi khi lấy danh sách hội thoại");
    }

};

// Lấy hội thoại theo id
const getChatItem = async (req, res) => {
    const userId = req.user.userId;
    console.log(userId);
    console.log(req.params.chatId);
    try {
        const chat = await Chatbot.findOne({ _id: req.params.chatId, user: userId });
        console.log(chat);
        res.status(200).send(chat);
    }
    catch (error) {
        console.log("Lỗi khi lấy hội thoại: ", error);
        res.status(500).send("Lỗi khi lấy hội thoại");
    }
}

// Gửi câu hỏi mới vào hội thoại
const putQuestion = async (req, res) => {
    const userId = req.user.userId;
    console.log(req.body);
    const { question, answer, img } = req.body;

    const newItems = [
        ...(question
            ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }]
            : []),
        { role: "model", parts: [{ text: answer }] },
    ];

    try {
        const updatedChat = await Chatbot.updateOne(
            { _id: req.params.chatId, user: userId },
            {
                $push: {
                    history: {
                        $each: newItems,
                    },
                },
            }
        );
        res.status(200).send(updatedChat);
    } catch (err) {
        console.log(err);
        res.status(500).send("Lỗi khi gửi câu hỏi");
    }
}

// Thêm hàm xử lý streaming response
const streamChatbotResponse = async (req, res) => {
    const userId = req.user.userId;
    const { text, chatId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "Bạn cần đăng nhập" });
    }

    if (!text) {
        return res.status(400).json({ message: "Bạn cần nhập nội dung câu hỏi" });
    }

    try {
        // Thiết lập headers cho streaming response
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Transfer-Encoding', 'chunked');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('X-Accel-Buffering', 'no');

        // Gọi API từ chatbot backend
        const chatbotBackendUrl = process.env.CHATBOT_BACKEND_URL || 'http://localhost:8082';
        const response = await fetch(`${chatbotBackendUrl}/chatbot/${chatId || ''}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': req.headers.authorization
            },
            body: JSON.stringify({
                text,
                userId,
                chatId
            })
        });

        if (!response.ok) {
            throw new Error(`Chatbot backend responded with status: ${response.status}`);
        }

        // Stream response từ chatbot backend
        const reader = response.body.getReader();
        const encoder = new TextEncoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            // Gửi dữ liệu về client
            res.write(value);
        }

        res.end();
    } catch (error) {
        console.error("Lỗi khi xử lý streaming response:", error);
        res.status(500).send("Lỗi khi xử lý câu trả lời từ chatbot");
    }
};

// Xóa lịch sử chat của người dùng
const deleteChatHistory = async (req, res) => {
    try {
        const userId = req.user.userId;
        await Chatbot.deleteMany({ user: userId });
        res.json({ message: 'Xóa lịch sử chat thành công' });
    } catch (error) {
        res.status(500).json({
            message: 'Có lỗi xảy ra khi xóa lịch sử chat',
            error: error.message
        });
    }
};

// Lấy lịch sử chat của người dùng
const getChatHistory = async (req, res) => {
    try {
        const userId = req.user.userId;
        const chatHistory = await Chatbot.find({ user: userId })
            .sort({ createdAt: 1 })
            .limit(10);

        const formattedHistory = chatHistory.map(chat => ({
            history: chat.history.map(msg => ({
                role: msg.role,
                parts: msg.parts
            }))
        }));

        res.json({
            history: formattedHistory,
            message: 'Lấy lịch sử chat thành công'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Có lỗi xảy ra khi lấy lịch sử chat',
            error: error.message
        });
    }
};

// Xử lý tin nhắn từ người dùng
const handleMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user.userId;

        if (!message || message.trim() === '') {
            return res.status(400).json({ message: 'Tin nhắn không được để trống' });
        }

        // Lấy thông tin người dùng để cá nhân hóa
        const [userBio, learningGoals, learningTree, achievements, schedules, posts, stories] = await Promise.all([
            UserBio.findOne({ user: userId }),
            LearningGoal.find({ user_id: userId }),
            LearningTree.findOne({ user_id: userId }),
            Achievement.find({ user_id: userId }),
            Schedule.find({ user: userId }),
            Post.find({ user: userId }).limit(5),
            Story.find({ user: userId }).limit(5)
        ]);

        // Tạo context cho chatbot
        const userContext = `
        Thông tin người dùng:
        - Bio: ${userBio?.bioText || 'Chưa có'}
        - Nơi sống: ${userBio?.liveIn || 'Chưa có'}
        - Nơi làm việc: ${userBio?.workplace || 'Chưa có'}
        - Học vấn: ${userBio?.education || 'Chưa có'}
        
        Mục tiêu học tập:
        ${learningGoals.map(goal => `- ${goal.title} (${goal.is_completed ? 'Đã hoàn thành' : 'Chưa hoàn thành'})`).join('\n')}
        
        Cây học tập:
        - Loại cây: ${learningTree?.tree_type || 'Chưa có'}
        - Giai đoạn: ${learningTree?.growth_stage || 0}
        - Số mục tiêu đã hoàn thành: ${learningTree?.completed_goals_count || 0}
        
        Thành tựu:
        ${achievements.map(achievement => `- ${achievement.type}: ${achievement.goals_completed} mục tiêu`).join('\n')}
        
        Lịch học:
        ${schedules.map(schedule => `- ${schedule.subject}: ${new Date(schedule.startTime).toLocaleString()} - ${new Date(schedule.endTime).toLocaleString()}`).join('\n')}
        
        Bài viết gần đây:
        ${posts.map(post => `- ${post.content?.substring(0, 50)}...`).join('\n')}
        
        Story gần đây:
        ${stories.map(story => `- ${story.mediaType}: ${story.mediaUrl}`).join('\n')}
        `;

        // Tạo prompt cho chatbot với context
        const prompt = `Bạn là một trợ lý học tập thông minh của Vibely. 
        Dựa vào thông tin người dùng sau đây, hãy đưa ra câu trả lời phù hợp và cá nhân hóa:
        
        ${userContext}
        
        Người dùng: ${message}
        Trợ lý:`;


        // Gọi API của OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `Bạn là một trợ lý học tập thông minh của Vibely. 
                    Dựa vào thông tin người dùng sau đây, hãy đưa ra câu trả lời phù hợp và cá nhân hóa:
                    ${userContext}`
                },
                {
                    role: "user",
                    content: message
                }
            ],
            max_tokens: 500,
            temperature: 0.7,
        });


        const response = completion.choices[0].message.content;

        const newChat = new Chatbot({
            user: userId,
            history: [
                {
                    role: 'user',
                    parts: [{ text: message }]
                },
                {
                    role: 'model',
                    parts: [{ text: response }]
                }
            ]
        });

        await newChat.save();

        res.json({
            message: response,
            timestamp: new Date()
        });

    } catch (error) {
        res.status(500).json({
            message: 'Có lỗi xảy ra khi xử lý tin nhắn',
            error: error.message
        });
    }
};

module.exports = {
    createChat,
    getChats,
    getChatItem,
    putQuestion,
    streamChatbotResponse,
    handleMessage,
    getChatHistory,
    deleteChatHistory
};