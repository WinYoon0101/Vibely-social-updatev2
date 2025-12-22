'use client'
import Loader from "@/lib/Loader";
import { checkUserAuth, logout } from "@/service/auth.service";
import userStore from "@/store/userStore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Header from "./components/Header";
import { io } from "socket.io-client";

export default function AuthWrapper({ children }) {
    const { setUser, clearUser, user } = userStore();
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const socketRef = useRef(null);
    const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8081';

    const publicPages = ["/user-login", "/forgot-password", "/reset-password"];
    // const isPublicPage = publicPages.includes(pathname);
    const isPublicPage = publicPages.some((publicPath) => pathname.startsWith(publicPath));

    // Hàm kết nối socket
    const connectSocket = (userId) => {
        if (userId && !socketRef.current) {
            socketRef.current = io(API_URL);
            window.socket = socketRef.current;

            // Thêm user vào danh sách online
            socketRef.current.emit("addUser", userId);

            // Lắng nghe sự kiện getUsers để cập nhật danh sách online users
            socketRef.current.on("getUsers", (users) => {
            });
        }
    };

    // Hàm ngắt kết nối socket
    const disconnectSocket = () => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
            window.socket = null;
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const result = await checkUserAuth();
                if (result.isAuthenticated) {
                    setUser(result?.user);
                    setIsAuthenticated(true);

                    // Kết nối socket khi đăng nhập thành công
                    connectSocket(result.user._id);
                } else {
                    await handleLogout();
                }
            } catch (error) {
                console.error("Đăng nhập thất bại", error);
                await handleLogout();
            } finally {
                setLoading(false);
            }
        };

        const handleLogout = async () => {
            clearUser();
            setIsAuthenticated(false);

            // Ngắt kết nối socket khi đăng xuất
            disconnectSocket();

            try {
                await logout();
            } catch (error) {
                console.log("Đăng xuất thất bại. Vui lòng thử lại sau", error);
            }
            if (!isPublicPage) {
                router.push("/user-login");
            }
        };

        if (!isPublicPage) {
            checkAuth();
        } else {
            setLoading(false);
        }

        // Cleanup function
        return () => {
            disconnectSocket();
        };
    }, [isPublicPage, router, setUser, clearUser]);

    // Kết nối lại socket nếu user thay đổi
    useEffect(() => {
        if (user?._id && !socketRef.current) {
            connectSocket(user._id);
        }
    }, [user]);

    if (loading) {
        return <Loader />;
    }

    return (
        <>
            {isAuthenticated && !isPublicPage && <Header />}
            {children}
        </>
    );
}
