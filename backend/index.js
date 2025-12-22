const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const { connect } = require('mongoose');
const connectDb = require('./config/db');
const http = require('http');
const { Server } = require('socket.io');
const authRoute = require('./routes/authRoute');
const postRoute = require('./routes/postRoute');
const swaggerUi = require('swagger-ui-express');
const conversationRoute = require('./routes/conversationRoute');
const messageRoute = require('./routes/messageRoute');
const Quotation = require('./model/Quotation');
const userRoute = require('./routes/userRoute');
const passport = require('./controllers/googleController');
const scheduleRoute = require('./routes/scheduleRoute');
const chatbotRoute = require('./routes/chatbotRoute');
const documentRoute = require('./routes/documentRoute');
const inquiryRoute = require('./routes/inquiryRoute');
const adminAuthRoute = require('./routes/adminAuthRoute');
const adminDashboardRoute = require('./routes/adminDashboardRoute');
const adminPostRoute = require('./routes/adminPostRoute')
const adminUserRoute = require('./routes/adminUserRoute')
const adminInformationRoute = require('./routes/adminInformationRoute');
const adminInquiryRoute = require('./routes/adminInquiryRoute');
const adminDocumentRoute = require('./routes/adminDocumentRoute');
const adminQuizRoute = require('./routes/adminQuizRoute');
const forgotPasswordRoute = require('./routes/forgotPassword');
const quizRoute = require('./routes/quizRoute');
const learningTreeRoute = require('./routes/learningTreeRoute');
const learningGoalRoute = require('./routes/learningGoalRoute');


const YAML = require('yamljs');

const swaggerDocument = YAML.load(path.join(__dirname, 'API/swagger.yaml'));

const options = {
    explorer: true,
    swaggerOptions: {
        persistAuthorization: true
    }
};

const app = express();
app.use(express.json());
app.use(cookieParser());


const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = [
            "http://localhost:3000",
            "http://localhost:3001",
            "http://localhost:3002",
            "http://localhost:3003",
            "https://vibely-study-social-web.onrender.com",
            "https://vibely-study-social-web-user.vercel.app",
            "https://vibely-study-social-web-admin.vercel.app",
            "https://vibelyadmin.netlify.app",
            "https://vibelyuser.netlify.app",
            "https://vibely-study-social-web-user.vercel.app"
        ];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'), false);
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

connectDb();
app.use(passport.initialize())
//API Route
app.use('/auth', authRoute);
app.use('/users', postRoute);
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerDocument, options));
app.use('/conversation', conversationRoute);
app.use('/message', messageRoute);
app.use('/users', userRoute);
app.use('/schedules', scheduleRoute);
app.use('/chatbot', chatbotRoute);
app.use("/documents", documentRoute);
app.use('/inquiry', inquiryRoute);
app.use('/quizzes', quizRoute);
app.use('/admin/auth', adminAuthRoute);
app.use('/admin', adminDashboardRoute);
app.use('/admin', adminInformationRoute);
app.use('/admin/posts', adminPostRoute);
app.use('/admin/users', adminUserRoute);
app.use('/admin/inquiry', adminInquiryRoute);
app.use('/admin/documents', adminDocumentRoute);
app.use('/admin/quiz', adminQuizRoute);
app.use('/forgot-password', forgotPasswordRoute);
app.use('/learning-trees', learningTreeRoute);
app.use('/learning-goals', learningGoalRoute);


// API lấy danh ngôn ngẫu nhiên
app.get('/quotations/random', async (req, res) => {
    try {
        const count = await Quotation.countDocuments();
        if (count === 0) {
            return res.status(404).json({ message: "Không có danh ngôn nào!" });
        }
        const randomIndex = Math.floor(Math.random() * count);
        const randomQuote = await Quotation.findOne().skip(randomIndex);
        res.json(randomQuote);
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy danh ngôn", error });
    }
});

// Quản lý lỗi
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Lỗi' });
});

const PORT = process.env.PORT || 8081;

// Tạo HTTP server từ Express app
const server = http.createServer(app);

// Khởi tạo Socket.io
const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:3000",
            "http://localhost:3001",
            "http://localhost:3002",
            "http://localhost:3003",
            "https://vibely-study-social-web.onrender.com",
            "https://vibely-study-social-web-user.vercel.app",
            "https://vibelyadmin.netlify.app",
            "https://vibelyuser.netlify.app",
            "https://vibely-study-social-web-admin.vercel.app"
        ],
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Lưu io vào app để có thể sử dụng ở các route khác
app.set('io', io);

// Socket.io logic
let users = [];

const addUser = (userId, socketId) => {
    if (!users.some((user) => user.userId === userId)) {
        users.push({ userId, socketId });
    }
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
    socket.on("addUser", (userId) => {
        // Xóa người dùng cũ nếu đã tồn tại
        users = users.filter(user => user.userId !== userId);
        // Thêm người dùng mới
        addUser(userId, socket.id);
        // Gửi danh sách người dùng online cho tất cả các client
        io.emit("getUsers", users);
    });

    // Xử lý yêu cầu cập nhật danh sách online users
    socket.on("requestOnlineUsers", () => {
        // Gửi danh sách người dùng online cho client yêu cầu
        socket.emit("getUsers", users);
    });

    socket.on("sendMessage", ({ senderId, receiverId, text, messageId, profilePicture }) => {
        const user = getUser(receiverId);
        if (user) {
            io.to(user.socketId).emit("getMessage", {
                senderId,
                text,
                messageId,
                profilePicture
            });
        }
    });

    socket.on("disconnect", () => {
        removeUser(socket.id);
        io.emit("getUsers", users);
    });
});

// Khởi động server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`📜 API Docs available at http://localhost:${PORT}/api-docs`);
    console.log(`🔌 Socket.io server is running on port ${PORT}`);
});

/*    //FOR TEST API - chỉ mở đoạn này và cmt các đoạn trên nếu test API
module.exports = (async () => {
    await connectDb(); // Chờ kết nối DB xong
    return app;
})();
*/

