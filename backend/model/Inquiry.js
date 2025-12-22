const mongoose = require("mongoose");

const InquirySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: ["Chưa phản hồi", "Đã phản hồi"], default: "Chưa phản hồi" },
    response: { type: String, trim: true },
  },
  { timestamps: true }
);

const Inquiry = mongoose.model("Inquiry", InquirySchema);
module.exports = Inquiry;
