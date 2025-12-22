"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Menu } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import LeftSideBar from "../components/LeftSideBar";

const HelpCenter = () => {
    const [selectedContent, setSelectedContent] = useState(null);
    const [activeQuestion, setActiveQuestion] = useState(null);
    const [question1, setQuestion1] = useState(false);
    const [question2, setQuestion2] = useState(false);
    const [question3, setQuestion3] = useState(false);
    const [question4, setQuestion4] = useState(false);
    const [addFriend_question1, setAddFriendQuestion1] = useState(false);
    const [loginQuestion1, setLoginQuestion1] = useState(false);
    const [loginQuestion2, setLoginQuestion2] = useState(false);
    const [loginQuestion3, setLoginQuestion3] = useState(false);

    const handleShowContent = (content) => {
        if (!window.matchMedia("(min-width: 768px)").matches) {
            toggleSideBar(false)
        }
        setSelectedContent(content);
        setActiveQuestion(null); // Reset câu hỏi mở rộng khi chuyển nội dung
    };

    const toggleQuestion = (question) => {
        setActiveQuestion(activeQuestion === question ? null : question);
    };
    const [sideBarOpen, setSibeBarOpen] = useState(true)
    const toggleSideBar = () => setSibeBarOpen(!sideBarOpen)
    return (
        <div className="flex items-center p-2 md:p-10">
            <div className="md:hidden">
            <LeftSideBar/>
            </div>
            <div className="max-w-7xl w-full flex gap-2 md:gap-5 lg:gap-10">
                    <Button className="fixed top-16 left-2 md:hidden z-20" onClick={()=>toggleSideBar()}>
                        <Menu className="w-5 h-5"/>
                    </Button>
                {/* Sidebar */}
                <div className={`fixed md:static w-[95%] lg:w-1/4 bg-white p-4 shadow-md md:ml-10 mt-20 h-[600px] ${sideBarOpen?"translate-x-0":"-translate-x-full"} transform transition-transform duration-300`}>
                    <p className="text-xl font-bold mb-6 flex items-center gap-2 mt-6 md:ml-6">
                        <Image
                            src="/images/helpcenter_vibely.png"
                            alt="Sách hướng dẫn"
                            width={24}
                            height={24}
                        />
                        Sử dụng Vibely
                    </p>
                    <ul className="mb-6 space-y-4">
                        <li
                            className="flex items-center gap-2 ml-4 md:ml-10 cursor-pointer"
                            onClick={() => handleShowContent("createAccount")}
                        >
                            <Image
                                src="/images/helpcenter_taotk.png"
                                alt="Tạo tài khoản"
                                width={20}
                                height={20}
                            />
                            Cách tạo tài khoản
                        </li>
                        <li className="flex items-center gap-2 ml-4 md:ml-10 cursor-pointer"
                            onClick={() => handleShowContent("addFriend")}
                        >
                            <Image
                                src="/images/helpcenter_ketban.png"
                                alt="Kết bạn"
                                width={20}
                                height={20}
                            />
                            Kết bạn
                        </li>
                    </ul>

                    <p className="text-xl font-bold mb-6 flex items-center gap-2 md:ml-6">
                        <Image
                            src="/images/helpcenter_qltk.png"
                            alt="Quản lý tài khoản"
                            width={24}
                            height={24}
                        />
                        Quản lý tài khoản
                    </p>
                    <ul className="space-y-4">
                        <li
                            className="flex items-center gap-2 ml-4 md:ml-10 cursor-pointer"
                            onClick={() => handleShowContent("loginPassword")}
                        >
                            <Image
                                src="/images/helpcenter_key.png"
                                alt="Đăng nhập & mật khẩu"
                                width={20}
                                height={20}
                            />
                            Đăng nhập và mật khẩu
                        </li>
                    </ul>
                </div>

                {/* Nội dung chính */}
                <div className="w-full lg:w-3/4 flex mt-20 md:ml-20">
                    {selectedContent === "createAccount" && (
                        <div className="w-full rounded-lg p-6">
                            <p className="text-2xl font-bold text-black mb-4">Cách tạo tài khoản</p>
                            <h3 className="text-lg font-bold text-black mb-4">Xác nhận tài khoản</h3>
                            <div className="space-y-4">
                                <div className="border rounded-lg p-4 shadow-sm bg-white ">
                                    <button
                                        className="w-full flex justify-between text-left font-semibold"
                                        onClick={() => {
                                            toggleQuestion("question1"); // Gọi hàm toggle
                                            setQuestion1(!question1); // Đảo trạng thái question1
                                        }}
                                    >
                                        Tạo tài khoản Vibely?
                                        {question1 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </button>

                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: activeQuestion === "question1" ? "auto" : 0, opacity: activeQuestion === "question1" ? 1 : 0 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="mt-2 p-4 border-t text-gray-600">
                                            <ol className="list-decimal pl-4">
                                                <li>Truy cập vào Vibely và chọn Đăng ký.</li>
                                                <li>Nhập tên người dùng, email, mật khẩu, ngày sinh và giới tính của bạn.</li>
                                                <li>Nhấn vào Đăng ký.</li>
                                                <li>Để hoàn tất quá trình tạo tài khoản, bạn cần xác nhận email hoặc số điện thoại di động của mình.</li>
                                            </ol>
                                        </div>
                                    </motion.div>
                                </div>

                                <div className="border rounded-lg p-4 shadow-sm bg-white">
                                    <button
                                        className="w-full flex justify-between text-left font-semibold"
                                        onClick={() => {
                                            toggleQuestion("question2"); // Gọi hàm toggle
                                            setQuestion2(!question2); // Đảo trạng thái question1
                                        }}
                                    >
                                        Tại sao lại yêu cầu tôi thêm email của mình?
                                        {question2 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </button>
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: activeQuestion === "question2" ? "auto" : 0, opacity: activeQuestion === "question2" ? 1 : 0 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="mt-2 p-4 border-t text-gray-600">
                                            <p className="font-bold">Chúng tôi có thể sử dụng email của bạn cho các mục đích như:</p>
                                            <ol className="list-decimal pl-4">
                                                <li>Giúp bạn đăng nhập. Nếu quên mật khẩu, bạn cần địa chỉ email đã cập nhật để đặt lại.</li>
                                                <li>Giữ an toàn cho tài khoản của bạn bằng cách chọn các tính năng như cảnh báo qua email.</li>
                                            </ol>
                                        </div>
                                    </motion.div>
                                </div>

                                <h3 className="text-lg font-bold text-black">Xác nhận tài khoản</h3>
                                {/* Câu hỏi 3 */}
                                <div className="border rounded-lg p-4 shadow-sm bg-white">
                                    <button
                                        className="w-full flex justify-between text-left font-semibold"
                                        onClick={() => {
                                            toggleQuestion("question3"); // Gọi hàm toggle
                                            setQuestion3(!question3); // Đảo trạng thái question1
                                        }}
                                    >
                                        Hoàn tất quá trình tạo tài khoản Vibely và xác nhận email
                                        {question3 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </button>
                                    
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: activeQuestion === "question3" ? "auto" : 0, opacity: activeQuestion === "question3" ? 1 : 0 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="mt-2 p-4 border-t text-gray-600">
                                            <p className=" font-bold">
                                                Để hoàn tất đăng ký, hãy xác nhận email của bạn:
                                            </p>
                                            <p>
                                                - Để xác nhận, hãy nhấp vào liên kết trong email để xác nhận tài khoản.
                                            </p>
                                            <p>
                                                Lưu ý: Hãy xác nhận email sớm để sử dụng tài khoản. Tài khoản chưa xác nhận có thể bị xóa sau một năm không hoạt động.
                                            </p>
                                        </div>
                                    </motion.div>
                                </div>

                                <div className="border rounded-lg p-4 shadow-sm bg-white">
                                    <button
                                        className="w-full flex justify-between text-left font-semibold"
                                        onClick={() => {
                                            toggleQuestion("question4"); // Gọi hàm toggle
                                            setQuestion4(!question4); // Đảo trạng thái question1
                                        }}
                                    >
                                        Tìm email xác nhận đăng ký Vibely
                                        {question4 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </button>
                                    
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: activeQuestion === "question4" ? "auto" : 0, opacity: activeQuestion === "question4" ? 1 : 0 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="mt-2 p-4 border-t text-gray-600">
                                            <p className="font-bold">Nếu bạn tạo tài khoản Vibely bằng email, chúng tôi sẽ gửi liên kết xác nhận đến email đó. Nếu bạn không tìm thấy email xác nhận:</p>
                                            <ol className="list-decimal pl-4">
                                                <li>Hãy kiểm tra thư mục thư rác. Nếu bạn dùng Gmail, hãy kiểm tra email thuộc hạng mục Xã hội.</li>
                                                <li>Đảm bảo rằng bạn đã nhập đúng email. Nếu nhập sai email, bạn có thể thay đổi và gửi lại email.</li>
                                            </ol>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedContent === "addFriend" && (
                        <div className="w-full rounded-lg p-6">
                            <p className="text-2xl font-bold text-black mb-4">Kết bạn</p>
                            <h3 className="text-lg font-bold text-black mb-4">Thêm bạn bè</h3>
                            <div className="space-y-4">
                                <div className="border rounded-lg p-4 shadow-sm bg-white">
                                    <button
                                        className="w-full flex justify-between text-left font-semibold"
                                        onClick={() => {
                                            toggleQuestion("addFriend_question1")
                                            setAddFriendQuestion1(!addFriend_question1); // Đảo trạng thái question1
                                        }}
                                    >
                                        Tìm và thêm bạn bè trên Vibely
                                        {addFriend_question1 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </button>
                                    
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: activeQuestion === "addFriend_question1" ? "auto" : 0, opacity: activeQuestion === "addFriend_question1" ? 1 : 0 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="mt-2 p-4 border-t text-gray-600">
                                            <ol className="list-decimal pl-4">
                                                <li>Nhấp vào thanh tìm kiếm ở trên cùng bên trái trang bất kỳ trên Vibely.</li>
                                                <li>Nhập tên bạn bè vào thanh tìm kiếm và nhấp vào icon tìm kiếm.</li>
                                                <li>Để gửi lời mời kết bạn đến ai đó, hãy nhấp vào ... bên cạnh ảnh đại diện của họ. Một số người có thể không có nút ... bên cạnh ảnh đại diện, tùy vào cài đặt quyền riêng tư của họ.</li>
                                            </ol>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedContent === "loginPassword" && (
                        <div className="w-full rounded-lg p-6">
                            <p className="text-2xl font-bold text-black mb-4">Đăng nhập và mật khẩu</p>
                            <h3 className="text-lg font-bold text-black mb-4">Đăng nhập tài khoản</h3>
                            <div className="space-y-4">
                                <div className="border rounded-lg p-4 shadow-sm bg-white">
                                    <button
                                        className="w-full flex justify-between text-left font-semibold"
                                        onClick={() => {
                                            toggleQuestion("loginQuestion1");
                                            setLoginQuestion1(!loginQuestion1);
                                        }}
                                    >
                                        Đăng nhập tài khoản Vibely?
                                        {loginQuestion1 ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                                    </button>

                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: activeQuestion === "loginQuestion1" ? "auto" : 0, opacity: activeQuestion === "loginQuestion1" ? 1 : 0 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="mt-2 p-4 border-t text-gray-600">
                                            <ol className="list-decimal pl-4">
                                                <li>Truy cập vào Vibely.</li>
                                                <li>Nhập các nội dung: email, mật khẩu.</li>
                                                <li>Nhấn vào Đăng nhập.</li>
                                            </ol>
                                        </div>
                                    </motion.div>
                                </div>

                                <div className="border rounded-lg p-4 shadow-sm bg-white ">
                                    <button
                                        className="w-full flex justify-between text-left font-semibold"
                                        onClick={() => {
                                            toggleQuestion("loginQuestion2");
                                            setLoginQuestion2(!loginQuestion2);
                                        }}
                                    >
                                        Đăng xuất khỏi Vibely?
                                        {loginQuestion2 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </button>
                                    
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: activeQuestion === "loginQuestion2" ? "auto" : 0, opacity: activeQuestion === "loginQuestion2" ? 1 : 0 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="mt-2 p-4 border-t text-gray-600">
                                            <ol className="list-decimal pl-4">
                                                <li>Nhấp vào ảnh đại diện của bạn ở trên cùng bên phải Facebook.</li>
                                                <li>Nhấp vào Đăng xuất ở cuối menu đang hiển thị.</li>
                                            </ol>
                                        </div>
                                    </motion.div>
                                </div>

                                <h3 className="text-lg font-bold text-black">Đổi mật khẩu tài khoản</h3>
                                <div className="border rounded-lg p-4 shadow-sm bg-white">
                                    <button
                                        className="w-full flex justify-between text-left font-semibold"
                                        onClick={() => {
                                            toggleQuestion("loginQuestion3");
                                            setLoginQuestion3(!loginQuestion3);
                                        }}
                                    >
                                        Đổi mật khẩu Vibely
                                        {loginQuestion3 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </button>
                                    
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: activeQuestion === "loginQuestion3" ? "auto" : 0, opacity: activeQuestion === "loginQuestion3" ? 1 : 0 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="mt-2 p-4 border-t text-gray-600">
                                            <p className="font-bold">Nếu bạn quên mật khẩu và không thể đăng nhập</p>
                                            <ol className="list-decimal pl-4">
                                                <li>Nhấp vào Quên mật khẩu? ở cuối màn hình đăng nhập.</li>
                                                <li>Nhập email của bạn, rồi nhấp vào Tiếp tục.</li>
                                                <li>Làm theo gợi ý.</li>
                                                <li>Để hoàn tất quá trình tạo tài khoản, bạn cần xác nhận email hoặc số điện thoại di động của mình.</li>
                                            </ol>
                                            <p className=" font-bold">Nếu bạn đã đăng nhập và muốn đổi mật khẩu (bổ sung sau)</p>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    )}
                    {selectedContent === null && (
                        <Image
                            src="/images/helpcenter.png"
                            alt="Support Girl"
                            width={500}
                            height={500}
                            className="mx-auto"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default HelpCenter;