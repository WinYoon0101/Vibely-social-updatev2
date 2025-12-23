const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFileToCloudinary = (file) => {
  const options = {
    resource_type: file.mimetype.startsWith("video") ? "video" : "image",
  };

  return new Promise((resolve, reject) => {
    const uploadCallback = (error, result) => {
      // 🔥 XOÁ FILE LOCAL SAU KHI UPLOAD
      fs.unlink(file.path, (err) => {
        if (err) console.error("Lỗi xoá file local:", err);
      });

      if (error) return reject(error);
      resolve(result);
    };

    if (file.mimetype.startsWith("video")) {
      cloudinary.uploader.upload_large(file.path, options, uploadCallback);
    } else {
      cloudinary.uploader.upload(file.path, options, uploadCallback);
    }
  });
};
// Multer sẽ lưu file vào thư mục uploads/ trước khi tiếp tục xử lý
const multerMiddleware = multer({ dest: "uploads/" });

module.exports = { multerMiddleware, uploadFileToCloudinary };
