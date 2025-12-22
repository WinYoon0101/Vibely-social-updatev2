const Admin = require("../model/Admin");
const { uploadFileToCloudinary } = require("../config/cloudinary");
const response = require("../utils/responseHandler");

// Lấy thông tin admin dựa trên ID
const getAdminInfo = async (req, res) => {
    try {
        const adminId = req.params.id;
        const admin = await Admin.findById(adminId).select("-password"); // Lấy thông tin admin mà không có mật khẩu

        if (!admin) {
            return res.status(404).json({ message: "Admin không tồn tại" });
        }

        return res.status(200).json({ admin });
    } catch (error) {
        console.error("Lỗi khi lấy thông tin admin:", error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};

// Cập nhật thông tin admin
const updateAdminInfo = async (req, res) => {
    try {
        const adminId = req.params.id;
        const updatedData = req.body;

        const updatedAdmin = await Admin.findByIdAndUpdate(
            adminId,
            updatedData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedAdmin) {
            return res.status(404).json({ success: false, message: "Admin không tồn tại" });
        }

        res.status(200).json({ success: true, message: "Cập nhật thành công", data: updatedAdmin });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Xử lý upload ảnh đại diện
const uploadProfilePicture = async (req, res) => {
    try {
        const adminId = req.admin._id;
        const file = req.file;

        if (!file) {
            return response(res, 400, "Vui lòng chọn ảnh.");
        }

        // Upload ảnh lên Cloudinary
        const uploadResult = await uploadFileToCloudinary(file);
        if (!uploadResult || !uploadResult.secure_url) {
            return response(res, 400, "Lỗi khi tải ảnh lên.");
        }

        // Cập nhật đường dẫn ảnh vào profile
        await Admin.findByIdAndUpdate(adminId, { profilePicture: uploadResult.secure_url });

        return response(res, 200, "Ảnh đại diện đã được cập nhật.", { profilePicture: uploadResult.secure_url });
    } catch (error) {
        console.error("Lỗi khi cập nhật ảnh đại diện:", error);
        return response(res, 500, "Lỗi máy chủ.");
    }
};


module.exports = { getAdminInfo, updateAdminInfo, uploadProfilePicture };