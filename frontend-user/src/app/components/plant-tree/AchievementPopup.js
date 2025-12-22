'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { toPng } from 'html-to-image';
import { Camera } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import AchievementCapture from './AchievementCapture';
import './AchievementPopup.css';

const AchievementPopup = ({ isOpen, onClose, achievements, onShare }) => {
    const [showCameraView, setShowCameraView] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const achievementRef = useRef(null);
    const flashRef = useRef(null);
    const confettiContainerRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            // Tạo confetti
            const createConfetti = () => {
                const colors = ['#f0f', '#0ff', '#ff0', '#f00', '#0f0', '#00f'];
                const container = confettiContainerRef.current;

                for (let i = 0; i < 100; i++) {
                    const confetti = document.createElement('div');
                    confetti.className = 'confetti';
                    confetti.style.left = Math.random() * 100 + '%';
                    confetti.style.top = -10 + 'px';
                    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                    confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
                    confetti.style.animationDelay = (Math.random() * 2) + 's';
                    container.appendChild(confetti);

                    setTimeout(() => {
                        confetti.remove();
                    }, 5000);
                }
            };

            createConfetti();
        }
    }, [isOpen]);

    const handleCapture = () => {
        // Hiệu ứng flash
        if (flashRef.current) {
            flashRef.current.style.opacity = 0.9;
            setTimeout(() => {
                flashRef.current.style.opacity = 0;
            }, 300);
        }

        // Phát âm thanh chụp ảnh
        try {
            const shutterSound = new Audio('/sounds/camera-shutter.mp3');
            shutterSound.play().catch(err => {
                console.log('Không thể phát âm thanh chụp ảnh:', err);
            });
        } catch (error) {
            console.log('Lỗi khi tạo âm thanh chụp ảnh:', error);
        }

        // Tạo hiệu ứng confetti cho camera
        const createCameraConfetti = () => {
            const colors = ['#f0f', '#0ff', '#ff0', '#f00', '#0f0', '#00f'];
            const container = confettiContainerRef.current;

            for (let i = 0; i < 100; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti-fall';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.top = -10 + 'px';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
                confetti.style.animationDelay = (Math.random() * 2) + 's';
                container.appendChild(confetti);

                setTimeout(() => {
                    confetti.remove();
                }, 5000);
            }
        };

        createCameraConfetti();

        // Chụp màn hình sau khi flash và confetti đã hoàn thành
        setTimeout(() => {
            if (achievementRef.current) {
                // Tạo một div mới để chứa nội dung 
                const captureContainer = document.createElement('div');
                captureContainer.style.position = 'fixed';
                captureContainer.style.top = '0';
                captureContainer.style.left = '0';
                captureContainer.style.width = '100%';
                captureContainer.style.height = '100%';
                captureContainer.style.backgroundColor = 'white';
                captureContainer.style.zIndex = '9999';
                captureContainer.style.display = 'flex';
                captureContainer.style.justifyContent = 'center';
                captureContainer.style.alignItems = 'center';
                captureContainer.style.padding = '20px';

                // Tạo nội dung thành tích
                const achievementContent = document.createElement('div');
                achievementContent.style.width = '400px';
                achievementContent.style.backgroundColor = '#fef3c7';
                achievementContent.style.borderRadius = '16px';
                achievementContent.style.padding = '32px';
                achievementContent.style.textAlign = 'center';
                achievementContent.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';

                // Huy hiệu thành tích
                const badge = document.createElement('div');
                badge.style.width = '96px';
                badge.style.height = '96px';
                badge.style.backgroundColor = 'white';
                badge.style.borderRadius = '50%';
                badge.style.margin = '0 auto 24px';
                badge.style.display = 'flex';
                badge.style.justifyContent = 'center';
                badge.style.alignItems = 'center';
                badge.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';

                const badgeImg = document.createElement('img');
                badgeImg.src = achievements[0].details.image;
                badgeImg.alt = achievements[0].details.title;
                badgeImg.style.width = '80px';
                badgeImg.style.height = '80px';
                badgeImg.style.objectFit = 'contain';
                badge.appendChild(badgeImg);

                // Tiêu đề
                const title = document.createElement('h1');
                title.textContent = 'Chúc mừng!';
                title.style.fontSize = '36px';
                title.style.fontWeight = 'bold';
                title.style.color = '#111827';
                title.style.marginBottom = '8px';

                // Nội dung phụ
                const subtitle = document.createElement('p');
                subtitle.textContent = 'Bạn đã đạt được thành tích mới';
                subtitle.style.fontSize = '20px';
                subtitle.style.color = '#374151';
                subtitle.style.marginBottom = '24px';

                // Chi tiết thành tích
                const achievementDetails = document.createElement('div');
                achievementDetails.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                achievementDetails.style.borderRadius = '12px';
                achievementDetails.style.padding = '16px';
                achievementDetails.style.marginBottom = '24px';

                const achievementTitle = document.createElement('p');
                achievementTitle.textContent = `${achievements[0].details.icon} ${achievements[0].details.title}`;
                achievementTitle.style.fontSize = '30px';
                achievementTitle.style.fontWeight = 'bold';
                achievementTitle.style.color = '#d97706';
                achievementTitle.style.marginBottom = '4px';

                const achievementDesc = document.createElement('p');
                achievementDesc.textContent = achievements[0].details.description;
                achievementDesc.style.color = '#374151';

                achievementDetails.appendChild(achievementTitle);
                achievementDetails.appendChild(achievementDesc);

                // Thêm tất cả các phần tử vào nội dung thành tích
                achievementContent.appendChild(badge);
                achievementContent.appendChild(title);
                achievementContent.appendChild(subtitle);
                achievementContent.appendChild(achievementDetails);

                captureContainer.appendChild(achievementContent);
                document.body.appendChild(captureContainer);

                // Chụp ảnh từ nội dung thành tích
                toPng(captureContainer, {
                    backgroundColor: 'white',
                    quality: 1.0,
                    pixelRatio: 2,
                    style: {
                        transform: 'scale(1)',
                        transformOrigin: 'top left'
                    }
                })
                    .then(dataUrl => {
                        setCapturedImage(dataUrl);
                        setShowCameraView(true);
                        document.body.removeChild(captureContainer);
                    })
                    .catch(error => {
                        toast.error('Không thể chụp ảnh. Vui lòng thử lại.');
                        document.body.removeChild(captureContainer);
                    });
            }
        }, 100);
    };

    const handleRetake = () => {
        setShowCameraView(false);
        setCapturedImage(null);
    };

    // Kiểm tra điều kiện sau khi đã gọi tất cả các hooks
    if (!achievements || achievements.length === 0) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    {/* Flash effect */}
                    <div ref={flashRef} className="camera-flash"></div>

                    {/* Confetti container */}
                    <div ref={confettiContainerRef} id="confetti-container" className="absolute inset-0 overflow-hidden pointer-events-none"></div>

                    {!showCameraView ? (
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            className="card relative max-w-md w-full"
                        >
                            <div ref={achievementRef} className="shine bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-200 rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-105">
                                <div className="p-8 text-center">
                                    {/* Ribbon */}
                                    <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-8 bg-red-600 transform rotate-45 translate-y-12 translate-x-8 shadow-lg">
                                            <div className="absolute top-0 left-0 w-8 h-8 bg-red-700 -translate-x-8"></div>
                                            <div className="absolute top-0 right-0 w-8 h-8 bg-red-700 translate-x-8"></div>
                                        </div>
                                    </div>

                                    {/* Badge */}
                                    <div className="badge bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
                                        <img
                                            src={achievements[0].details.image}
                                            alt={achievements[0].details.title}
                                            className="w-20 h-20 object-contain"
                                        />
                                    </div>

                                    {/* Title */}
                                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Chúc mừng!</h1>
                                    <p className="text-xl text-gray-700 mb-6">Bạn đã đạt được thành tích mới</p>

                                    {/* Achievement */}
                                    <div className="bg-white bg-opacity-80 rounded-xl p-4 mb-6">
                                        <p className="text-3xl font-bold text-yellow-600 mb-1">
                                            {achievements[0].details.icon} {achievements[0].details.title}
                                        </p>
                                        <p className="text-gray-700">{achievements[0].details.description}</p>
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex gap-4 justify-center">
                                        <button
                                            onClick={onClose}
                                            className="bg-gradient-to-r from-[#4ACFEF] to-[#476EFF] text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
                                        >
                                            Tiếp tục hành trình
                                        </button>
                                        <button
                                            onClick={handleCapture}
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                                        >
                                            <Camera className="w-5 h-5 mr-2" /> Chụp ảnh
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <AchievementCapture
                            capturedImage={capturedImage}
                            onRetake={handleRetake}
                            onClose={onClose}
                            onShare={onShare}
                        />
                    )}
                </div>
            )}
        </AnimatePresence>
    );
};

export default AchievementPopup; 