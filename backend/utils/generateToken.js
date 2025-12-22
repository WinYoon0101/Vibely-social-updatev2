// Tạo JWT token (JSON Web Token) để xác thực người dùng trong hệ thống RESTful API
const jwt = require('jsonwebtoken');
const generateToken = (user) => {
    return jwt.sign({
        userId: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
    }, process.env.JWT_SECRET, {
        expiresIn: '90d',
    });
}
module.exports = { generateToken };