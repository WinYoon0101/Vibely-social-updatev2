'use client';
import { motion } from 'framer-motion';
import { Download, RefreshCw, Share2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AchievementCapture = ({ capturedImage, onRetake, onClose, onShare }) => {

    const handleDownload = () => {
        if (capturedImage) {
            const link = document.createElement('a');
            link.download = 'thanh-tich.png';
            link.href = capturedImage;
            link.click();
            toast.success('Đã tải ảnh thành công!');
        }
    };

    return (
        <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="card relative w-full max-w-xl mx-auto"
        >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden p-6">
                <p className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-[#4ACFEF] to-[#476EFF] text-transparent bg-clip-text animate-gradient">
                    Ảnh thành tích của bạn
                </p>

                <div className="relative w-full flex justify-center items-center mb-8">
                    <div className="polaroid">
                        <img src={capturedImage} alt="Ảnh thành tích" />
                    </div>
                </div>

                <div className="flex justify-center space-x-4">
                    <button
                        onClick={onRetake}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full flex items-center"
                    >
                        <RefreshCw className="w-5 h-5 mr-2" /> Chụp lại
                    </button>
                    <button
                        onClick={() => onShare(capturedImage)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full flex items-center"
                    >
                        <Share2 className="w-5 h-5 mr-2" /> Chia sẻ
                    </button>
                    <button
                        onClick={handleDownload}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full flex items-center"
                    >
                        <Download className="w-5 h-5 mr-2" /> Lưu ảnh
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default AchievementCapture; 