const Schedule = require("../model/Schedule");
const response = require("../utils/responseHandler");
const mongoose = require('mongoose');

// Tạo lịch trình mới
const createSchedule = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { subject, startTime, endTime, categoryColor } = req.body;

        if (!subject || !startTime || !endTime) {
            return response(res, 400, "Thiếu thông tin lịch trình");
        }

        const newSchedule = new Schedule({
            user: userId,
            subject,
            startTime,
            endTime,
            categoryColor: categoryColor || "#0000FF"
        });

        await newSchedule.save();
        return response(res, 201, "Lịch trình đã được tạo", newSchedule);
    } catch (error) {
        console.error("Lỗi khi tạo lịch:", error);
        return response(res, 500, "Lỗi máy chủ", error.message);
    }
};

// Lấy danh sách lịch trình của người dùng
const getUserSchedules = async (req, res) => {
    try {
        const userId = req.user.userId;
        const schedules = await Schedule.find({ user: userId }).sort({ startTime: 1 });

        return response(res, 200, "Lấy danh sách lịch trình thành công", schedules);
    } catch (error) {
        return response(res, 500, "Lỗi máy chủ nội bộ", error.message);
    }
};

// Cập nhật lịch trình
const updateSchedule = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { subject, startTime, endTime, categoryColor } = req.body;
        const { scheduleId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(scheduleId)) {
            return response(res, 400, "ID lịch trình không hợp lệ");
        }

        if (startTime && isNaN(Date.parse(startTime))) {
            return response(res, 400, "startTime không hợp lệ");
        }
        if (endTime && isNaN(Date.parse(endTime))) {
            return response(res, 400, "endTime không hợp lệ");
        }

        const updatedSchedule = await Schedule.findOneAndUpdate(
            { _id: scheduleId, user: userId },
            {
                $set: {
                    subject: subject ?? undefined,
                    startTime: startTime ?? undefined,
                    endTime: endTime ?? undefined,
                    categoryColor: categoryColor ?? undefined,
                },
            },
            { new: true, runValidators: true }
        );

        if (!updatedSchedule) {
            return response(res, 404, "Lịch trình không tồn tại hoặc bạn không có quyền chỉnh sửa");
        }

        return response(res, 200, "Cập nhật lịch trình thành công", updatedSchedule);
    } catch (error) {
        return response(res, 500, "Lỗi máy chủ nội bộ", error.message);
    }
};

// Xóa lịch trình
const deleteSchedule = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { scheduleId } = req.params;

        const schedule = await Schedule.findOneAndDelete({ _id: scheduleId, user: userId });
        if (!schedule) {
            return response(res, 404, "Lịch trình không tồn tại hoặc bạn không có quyền xóa");
        }

        return response(res, 200, "Xóa lịch trình thành công");
    } catch (error) {
        return response(res, 500, "Lỗi máy chủ nội bộ", error.message);
    }
};

// Lấy chi tiết một lịch trình
const getScheduleById = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { scheduleId } = req.params;

        const schedule = await Schedule.findOne({ _id: scheduleId, user: userId });
        if (!schedule) {
            return response(res, 404, "Không tìm thấy lịch trình");
        }

        return response(res, 200, "Lấy chi tiết lịch trình thành công", schedule);
    } catch (error) {
        return response(res, 500, "Lỗi máy chủ nội bộ", error.message);
    }
};
// Lấy tất cả lịch trình của một người dùng cụ thể
const getScheduleByIdUser = async (req, res) => {
    try {
        const schedule = await Schedule.find({ user: req.params.id })
        if (!schedule) {
            return res.status(404).json({ message: "Lịch trình không tồn tại" });
        }
        res.json(schedule);
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy lịch trình", error: error.message });
    }
};

module.exports = {
    createSchedule,
    getUserSchedules,
    updateSchedule,
    deleteSchedule,
    getScheduleById,
    getScheduleByIdUser
};
