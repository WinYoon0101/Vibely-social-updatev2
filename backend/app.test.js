require('dotenv').config();
const mongoose = require('mongoose');
const request = require('supertest');
const path = require('path');
const jwt = require('jsonwebtoken');
const fs = require('fs');
// Nhớ kiểm tra file index.js trước khi test api
// Nhớ xóa Test Level và Test Subject bên CSDL khi test xong để tránh lỗi cho lần test sau
// Thêm dòng code:verificationCode vào json trả về khi test. Lưu ý: CHỈ KHI TEST MỚI CHỈNH!!!
let app;
let token, userId;
const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: '123456',
    gender: 'male',
    dateOfBirth: '2000-01-01'
};
const newPassword = "newPassword"
let postId, commentId, replyId, storyId;
let createdChatId; let conversationId;
let levelId, subjectId, documentId;
let forgotCode; let inquiryId; let quizId;
let scheduleId;

beforeAll(async () => {
  app = await require('./index'); // 👈 Chờ connectDb xong
}, 15000);

afterAll(async () => {
  await mongoose.connection.close();
}, 10000);

describe('Test API', () => {
// AUTH API
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send(testUser);

    expect(res.statusCode).toBe(201);
  }, 15000);

  it('should login and return a token', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('token');
    token = res.body.data.token;
  }, 15000);

  it('should change password', async () => {
    const res = await request(app)
      .post('/auth/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ oldPassword: testUser.password, newPassword: newPassword })

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toMatch('Đổi mật khẩu thành công');
  }, 10000);

  it('should log out', async () => {
    const res = await request(app)
      .get('/auth/logout')

    expect(res.statusCode).toBe(200);
  }, 15000);

  it('should login with new password', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: testUser.email, password: newPassword });

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('token');
    token = res.body.data.token;
    const decoded = jwt.decode(token);
    userId = decoded.userId;
  }, 15000);

//POST API
  it('should get all posts', async () => {
    const res = await request(app)
      .get('/users/posts')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  }, 10000);

  it('should get a specific posts', async () => {
    const postId = '67f1f3619770f384e8308e15'; // id bài viết của bạn P
    const res = await request(app)
      .get(`/users/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  }, 10000);

  it('should get posts from specific account', async () => {
    const id = '67eb68f2b6eaf959905512e3';  // id của HacThienCau :))
    const res = await request(app)
      .get(`/users/posts/user/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  }, 10000);

  it('should create new post', async () => {
    const res = await request(app)
      .post('/users/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: "Test API" });

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty('_id');
    postId = res.body.data._id;
  }, 15000);

  it('should edit the post', async () => {
    const res = await request(app)
      .put(`/users/posts/edit/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: "Edited content", flag: 0 });

    expect(res.statusCode).toBe(201);
  }, 15000);

  it('should react to the post', async () => {
    const res = await request(app)
      .post(`/users/posts/reacts/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ type: "haha" });

    expect(res.statusCode).toBe(200);
  }, 15000);

  it('should comment to the post', async () => {
    const res = await request(app)
      .post(`/users/posts/comments/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ text: "Test comment" });

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty('comments');
    expect(Array.isArray(res.body.data.comments)).toBe(true);

    const comments = res.body.data.comments;
    commentId = comments[comments.length - 1]._id; // lấy comment cuối cùng

    expect(commentId).toBeDefined();
  }, 15000);

  it('should like the comment', async () => {
    const res = await request(app)
      .post(`/users/posts/reactComment/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ commentId });

    expect(res.statusCode).toBe(201);
  }, 15000);

  it('should reply to the comment', async () => {
    const res = await request(app)
      .post(`/users/posts/reply/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ commentId, replyText: "Test reply" });

      expect(res.statusCode).toBe(201);
      expect(res.body.data).toHaveProperty('comments');  
      const comments = res.body.data.comments;
      const targetComment = comments.find(c => c._id === commentId);  
      expect(targetComment).toBeDefined();
      expect(Array.isArray(targetComment.replies)).toBe(true);
  
      const replies = targetComment.replies;
      const newReply = replies[replies.length - 1];
      replyId = newReply._id;
  
      expect(replyId).toBeDefined();
  }, 15000);

  it('should delete the reply i have just created', async () => {
    const res = await request(app)
      .delete(`/users/posts/deleteReply/${postId}/${commentId}/${replyId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  }, 10000);

  it('should delete the comment i have just created', async () => {
    const res = await request(app)
      .delete(`/users/posts/deleteComment/${postId}/${commentId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  }, 10000);

  it('should share the post', async () => {
    const res = await request(app)
      .post(`/users/posts/share/${postId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(200);
  }, 15000);

  it('should delete the post i have just created', async () => {
    const res = await request(app)
      .delete(`/users/posts/deletePost/${postId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  }, 10000);
//STORY API
    it('should get all stories', async () => {
    const res = await request(app)
      .get('/users/story')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  }, 10000);

  it('should create a new story with an image', async () => {
    const filePath = path.join(__dirname, 'uploads/sample.png');

    const res = await request(app)
        .post('/users/story') // hoặc đường dẫn API thực tế
        .set('Authorization', `Bearer ${token}`)
        .attach('media', filePath); // tên field phải trùng với tên trong `multer.single('file')`

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty('mediaUrl');
    expect(res.body.data.mediaType).toBe('image');
    expect(res.body.data).toHaveProperty('_id');
    storyId = res.body.data._id;
    });

    it('should react to the story', async () => {
    const res = await request(app)
      .post(`/users/story/reacts/${storyId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ type: "tym" });

    expect(res.statusCode).toBe(200);
  }, 15000);

  it('should delete the story i have just created', async () => {
    const res = await request(app)
      .delete(`/users/posts/deleteStory/${storyId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  }, 10000);

// CHATBOT API??  
  it('should create a new chat', async () => {
    const res = await request(app)
        .post('/chats/')
        .set('Authorization', `Bearer ${token}`)
        .send({
            text: 'Bạn khỏe không?',
            answer: 'Tôi rất khỏe, cảm ơn bạn!'
        });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    createdChatId = res.body._id;
});

it('should get chat list (owned)', async () => {
    const res = await request(app)
        .get('/chats/')
        .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
});

it('should get a specific chat (owned)', async () => {
    const res = await request(app)
        .get(`/chats/${createdChatId}`)
        .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
});

// Test thêm câu hỏi vào hội thoại
it('should add a new question to chat', async () => {
    const res = await request(app)
        .put(`/chats/${createdChatId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
            question: 'Bạn có thể giúp tôi học không?',
            answer: 'Tất nhiên rồi!',
            img: null
        });

    expect(res.statusCode).toEqual(200);
    expect(res.body.modifiedCount).toBeGreaterThan(0);
});
// CONVERSATION API
it('should create a new conversation', async () => {
    const id = '67eb68f2b6eaf959905512e3';  // id của HacThienCau :))
    const res = await request(app)
        .post('/conversation/')
        .set('Authorization', `Bearer ${token}`)
        .send({
            senderId: userId, receiverId: id  
        });

    expect(res.statusCode).toEqual(200);
});

it('should get conversation list of 1 person', async () => {
    const res = await request(app)
        .get(`/conversation/${userId}`)
        .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
});

it('should get conversation between 2 people', async () => {
    const id = '67eb68f2b6eaf959905512e3';  // id của HacThienCau :))
    const res = await request(app)
        .get(`/conversation/find/${userId}/${id}`)
        .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id');
    conversationId = res.body._id;
});
// DOCUMENT API
it('should get levels', async () => {
    const res = await request(app)
        .get('/documents/levels')

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
});

it('should get subjects by levelId', async () => {
    const levelId = "67d153e331cf980c7adf85a1" // id của level Đại Học
    const res = await request(app)
        .get(`/documents/subjects/${levelId}`)

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
});
it('should create a new level', async () => {
    const res = await request(app)
        .post('/documents/levels')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: "Test Level" });

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty('_id');
    levelId = res.body.data._id;
});

it('should create a new subject', async () => {
    const res = await request(app)
        .post('/documents/subjects')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: "Test Subject", levelId });

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty('_id');
    subjectId = res.body.data._id;
});

it('should save a document', async () => {
    const id = "67d1b73b93d210c701c66448" // id của đề thi ck csdl :)))
    const res = await request(app)
        .post('/documents/save')
        .set('Authorization', `Bearer ${token}`)
        .send({ documentId : id });

    expect(res.statusCode).toBe(200);
});

it('should get documents by filter', async () => {
    const res = await request(app)
        .get('/documents/')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
            query: null,
            level: "Tiểu Học",
            subject: "Toán"
         });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
});

it('should create a new document', async () => {
    const res = await request(app)
        .post('/documents/')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
            level: levelId,
            subject: subjectId,
            
                title: "Test Document",
                pages: 0,
                fileType : "pdf",
                fileUrl: "https://drive.google.com/file/d/1btv5eurHfz81YXztvxBf74n_iw4udRhx/view…"
            
         });

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty('_id');
    documentId = res.body.data._id;
});

it('should get document by id', async () => {
    const id = documentId
    const res = await request(app)
        .get(`/documents/${id}`)
        .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(200);
});

it('should update the document', async () => {
    const id = documentId
    const res = await request(app)
        .put(`/documents/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ 
            level: levelId,
            subject: subjectId,
            
                title: "Updated Test Document",
                pages: 20,
                fileType : "pdf",
                fileUrl: "https://drive.google.com/file/d/1btv5eurHfz81YXztvxBf74n_iw4udRhx/view…"
            
         });

    expect(res.statusCode).toBe(200);
});

it('should delete the document i have just created', async () => {
    const id = documentId
    const res = await request(app)
        .delete(`/documents/${id}`)
        .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(200);
});

// MESSAGE API
it('should get messages by conversationId', async () => {
  const res = await request(app)
      .get(`/message/${conversationId}`)

  expect(res.statusCode).toBe(200);
});

it('should add a message', async () => {
  const res = await request(app)
      .post(`/message`)
      .send({
        conversationId: conversationId,
        sender: userId,
        text: 'Hello, this is a test message!'
    });

  expect(res.statusCode).toBe(200);
});

// FORGOT PASSWORD API
it('should send email', async () => {
  const res = await request(app)
      .post(`/forgot-password/send-code`)
      .send({
        email: testUser.email
    });

  expect(res.statusCode).toBe(200);
  expect(res.body).toHaveProperty('code');
  forgotCode = res.body.code;
});

it('should verify code', async () => {
  const res = await request(app)
      .post(`/forgot-password/verify-code`)
      .send({
        email: testUser.email,
        code: forgotCode
    });

  expect(res.statusCode).toBe(200);
});

it('should reset password', async () => {
  const res = await request(app)
      .post(`/forgot-password/reset-password`)
      .send({
        email: testUser.email,
        code: forgotCode,
        newPassword
    });

  expect(res.statusCode).toBe(200);
});

// INQUIRY API
it('should create a new inquiry', async () => {
  const res = await request(app)
    .post('/inquiry/')
    .set('Authorization', `Bearer ${token}`)
    .send({ 
      message : "Test message inquiry"
     });

  expect(res.statusCode).toBe(201);
  expect(res.body.data).toHaveProperty('_id');
  inquiryId = res.body.data._id;
}, 15000);

it('should get inquiries', async () => {
  const res = await request(app)
    .get('/inquiry/')
    .set('Authorization', `Bearer ${token}`)
    .send({ 
      query: testUser.email,
      status: "Chưa phản hồi"
     });

  expect(res.statusCode).toBe(200);
}, 15000);

it('should update the inquiry', async () => {
  const res = await request(app)
    .put(`/inquiry/${inquiryId}`)
    .set('Authorization', `Bearer ${token}`)
    .send({ 
      response: "Test response",
      status: "Đã phản hồi"
     });

  expect(res.statusCode).toBe(200);
}, 15000);

it('should delete the inquiry', async () => {
  const res = await request(app)
    .delete(`/inquiry/${inquiryId}`)
    .set('Authorization', `Bearer ${token}`)
    .send({ 
      response: "Test response",
      status: "Đã phản hồi"
     });

  expect(res.statusCode).toBe(200);
}, 15000);

//QUIZ API
it('should get quizzes', async () => {
  const res = await request(app)
    .get('/quizzes/')
    .set('Authorization', `Bearer ${token}`)

  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body.data)).toBe(true);
}, 15000);

it('should create a new quiz', async () => {
  const res = await request(app)
    .post("/quizzes/")
    .set("Authorization", `Bearer ${token}`)
    .send({
      icon: "faComputer",
      quizTitle: "Tin học lớp 12",
      quizQuestions: [
        {
          mainQuestion: "Cơ sở dữ liệu (CSDL) là gì?",
          choices: [
            "Tập hợp các bảng tính được lưu trữ riêng lẻ",
            "Tập hợp các dữ liệu có liên quan được tổ chức theo cấu trúc",
            "Một phần mềm dùng để soạn thảo văn bản",
            "Một hệ thống điều hành máy tính",
          ],
          correctAnswer: 1,
          answeredResult: -1,
          statistics: {
            totalAttempts: 0,
            correctAttempts: 0,
            incorrectAttempts: 0,
          },
        },
        {
          mainQuestion:
            "Trong mô hình CSDL quan hệ, dữ liệu được lưu trữ dưới dạng gì?",
          choices: [
            "Danh sách liên kết",
            "Tập tin văn bản",
            "Bảng (table)",
            "Đồ thị",
          ],
          correctAnswer: 2,
          answeredResult: -1,
          statistics: {
            totalAttempts: 0,
            correctAttempts: 0,
            incorrectAttempts: 0,
          },
        },
        {
          mainQuestion: "Trong hệ quản trị cơ sở dữ liệu, SQL là gì?",
          choices: [
            "Một phần mềm thiết kế web",
            "Ngôn ngữ truy vấn có cấu trúc",
            "Một loại virus máy tính",
            "Một phần cứng dùng để lưu trữ dữ liệu",
          ],
          correctAnswer: 1,
          answeredResult: -1,
          statistics: {
            totalAttempts: 0,
            correctAttempts: 0,
            incorrectAttempts: 0,
          },
        },
      ],
    });
  expect(res.statusCode).toBe(201);
  expect(res.body.data).toHaveProperty('_id');
  quizId = res.body.data._id;
}, 15000);

it('should get the quiz by id', async () => {
  const res = await request(app)
    .get(`/quizzes/${quizId}`)
    .set('Authorization', `Bearer ${token}`)

  expect(res.statusCode).toBe(200);
}, 15000);

it('should update the quiz', async () => {
  const res = await request(app)
    .put(`/quizzes/${quizId}`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      updatedQuiz:{
        icon: "fabook",
        quizTitle: "updated quiz",
        quizQuestions:[
          {
            mainQuestion: "Test question 1",
            choices: [
              "a1",
              "a2",
              "a3",
              "a4",
            ],
            correctAnswer: 1,
            answeredResult: -1,
            statistics: {
              totalAttempts: 0,
              correctAttempts: 0,
              incorrectAttempts: 0,
            },
          },
        ]
      }
    })

  expect(res.statusCode).toBe(200);
}, 15000);

it('should delete the quiz', async () => {
  const res = await request(app)
    .delete(`/quizzes/${quizId}`)
    .set('Authorization', `Bearer ${token}`)

  expect(res.statusCode).toBe(200);
}, 15000);

// SCHEDULE API
it('should create a new schedule', async () => {
  const res = await request(app)
    .post("/schedules/")
    .set("Authorization", `Bearer ${token}`)
    .send({
      subject:"Test schedule",
      startTime:new Date(),
      endTime: new Date(Date.now() + 60 * 60 * 1000),
      categoryColor:"#f71949"
    });
  expect(res.statusCode).toBe(201);
  expect(res.body.data).toHaveProperty('_id');
  scheduleId = res.body.data._id;
}, 15000);

it('should get user schedules', async () => {
  const res = await request(app)
    .get("/schedules/")
    .set("Authorization", `Bearer ${token}`)

  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body.data)).toBe(true);
}, 15000);

it('should get schedule by id', async () => {
  const res = await request(app)
    .get(`/schedules/${scheduleId}`)
    .set("Authorization", `Bearer ${token}`)
    
  expect(res.statusCode).toBe(200);
}, 15000);

it('should get schedules from userId', async () => {
  const id = "67c11abcbe6cc97c28b1261a" // id của P
  const res = await request(app)
    .get(`/schedules/user/${id}`)
    .set("Authorization", `Bearer ${token}`)
    
    expect(Array.isArray(res.body)).toBe(true);

}, 15000);

it('should edit the schedule', async () => {
  const res = await request(app)
    .put(`/schedules/${scheduleId}`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      subject:"Updated schedule",
      startTime:new Date(),
      endTime: new Date(Date.now() + 120 * 60 * 1000),
      categoryColor:"#000000"
    })
    
  expect(res.statusCode).toBe(200);
}, 15000);

it('should delete the schedule', async () => {
  const res = await request(app)
    .delete(`/schedules/${scheduleId}`)
    .set("Authorization", `Bearer ${token}`)
    
  expect(res.statusCode).toBe(200);
}, 15000);

// USER API
it('should follow an user', async () => {
  const res = await request(app)
    .post(`/users/follow`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      userIdToFollow: "67eb68f2b6eaf959905512e3"  //id của HacThienCau
    })
    
  expect(res.statusCode).toBe(200);
}, 15000);

it('should unfollow an user', async () => {
  const res = await request(app)
    .post(`/users/unfollow`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      userIdToUnfollow: "67eb68f2b6eaf959905512e3"  //id của HacThienCau
    })
    
  expect(res.statusCode).toBe(200);
}, 15000);

it('should remove friend request', async () => {
  const res = await request(app)
    .post(`/users/friend-request/remove`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      requestSenderId: "67eb68f2b6eaf959905512e3"  //id của HacThienCau
    })
    
  expect(res.statusCode).toBe(404);
  expect(res.body.message).toBe('Không tìm thấy yêu cầu kết bạn');  //phải có lời mời kết bạn từ người kia :'(
}, 15000);

it('should get all requests', async () => {
  const res = await request(app)
    .get(`/users/friend-request`)
    .set("Authorization", `Bearer ${token}`)
    
  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body.data)).toBe(true);
}, 15000);

it('should get all users to request', async () => {
  const res = await request(app)
    .get(`/users/user-to-request`)
    .set("Authorization", `Bearer ${token}`)
    
  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body.data)).toBe(true);
}, 15000);

it('should get all friends of an user', async () => {
  const res = await request(app)
    .get(`/users/mutual-friends/${userId}`)
    .set("Authorization", `Bearer ${token}`)
    
  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body.data)).toBe(true);
}, 15000);

it('should get all users', async () => {
  const res = await request(app)
    .get(`/users/`)
    .set("Authorization", `Bearer ${token}`)
    
  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body.data)).toBe(true);
}, 15000);

it('should get user info', async () => {
  const res = await request(app)
    .get(`/users/profile/${userId}`)
    .set("Authorization", `Bearer ${token}`)
    
  expect(res.statusCode).toBe(200);
  expect(res.body.data).toHaveProperty("profile")
}, 15000);

it('should check if user logged in', async () => {
  const res = await request(app)
    .get(`/users/check-auth`)
    .set("Authorization", `Bearer ${token}`)
    
  expect(res.statusCode).toBe(201);
}, 15000);

it('should create bio', async () => {
  const res = await request(app)
    .put(`/users/bio/${userId}`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      bioText: "Test bio",
      liveIn: null,
      workplace: null,
      education: null,
      hometown: null
    })
    
  expect(res.statusCode).toBe(201);
}, 15000);

it('should edit bio', async () => {
  const res = await request(app)
    .put(`/users/bio/${userId}`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      bioText: "Updated bio",
      liveIn: "HCMC",
      workplace: "UIT",
      education: "UIT",
      hometown: "HCMC"
    })
    
  expect(res.statusCode).toBe(201);
}, 15000);

it('should edit profile', async () => {
  const res = await request(app)
    .put(`/users/profile/${userId}`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      username: "HacThienCau",
      gender: "female",
      dateOfBirth: '2004-06-28'
    })
    
  expect(res.statusCode).toBe(200);
}, 15000);

it('should edit cover picture', async () => {
  const filePath = path.join(__dirname, 'uploads/sample.png');
  const res = await request(app)
    .put(`/users/profile/cover-picture/${userId}`)
    .set("Authorization", `Bearer ${token}`)
    .attach('coverPicture', filePath);
    
  expect(res.statusCode).toBe(200);
}, 15000);

it('should get users info', async () => {
  const res = await request(app)
    .post(`/users/get-users`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      userIds:[
        "67c2c63ddb49e23170d5e3f7","67c4fdc08014cf4f8bb70cd4", "67eb68f2b6eaf959905512e3"
      ]
    })
    
  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body.data)).toBe(true);
}, 15000);

it('should get user saved documents', async () => {
  const res = await request(app)
    .get(`/users/saved`)
    .set("Authorization", `Bearer ${token}`)
    
  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body.data)).toBe(true);
}, 15000);

it('should get a specific saved documents', async () => {
  const id = "67d1b73b93d210c701c66448" // id của đề thi ck csdl :)))
  const res = await request(app)
    .get(`/users/saved/${id}`)
    .set("Authorization", `Bearer ${token}`)
    
  expect(res.statusCode).toBe(200);
}, 15000);

it('should get a specific saved documents', async () => {
  const id = "67d1b73b93d210c701c66448" // id của đề thi ck csdl :)))
  const res = await request(app)
    .delete(`/users/saved/${id}`)
    .set("Authorization", `Bearer ${token}`)
    
  expect(res.statusCode).toBe(200);
}, 15000);

// The last API  
  it('should delete account', async () => {
    const res = await request(app)
      .delete('/auth/deleteAccount')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  }, 10000);
});
