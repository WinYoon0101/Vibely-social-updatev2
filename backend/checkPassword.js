const bcrypt = require('bcryptjs');

const inputPassword = "Nhatphuong";
const storedHash = "$2b$10$LW9fINNhed5BcAzz/4y7xe.rkDVOHfQBnodsKG89yHMcaJybvTiUu";

const checkPassword = async () => {
    try {
        console.log("Mật khẩu nhập:", inputPassword);
        console.log("Mật khẩu hash:", storedHash);

        // Kiểm tra mật khẩu
        const match = await bcrypt.compare(inputPassword, storedHash);

        if (match) {
            console.log("✅ Mật khẩu chính xác!");
        } else {
            console.log("❌ Mật khẩu không chính xác!");
        }
    } catch (error) {
        console.error("Lỗi khi kiểm tra mật khẩu:", error);
    }
};

checkPassword();