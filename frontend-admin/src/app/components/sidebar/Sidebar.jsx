"use client"
import { Button } from "@/components/ui/button";
import useSidebarStore from "@/store/sidebarStore";
import userStore from "@/store/userStore";
import { usePathname, useRouter } from "next/navigation";
import React from 'react';
import { logoutAdmin } from "@/service/authAdmin.service";
import { toast } from "react-hot-toast";
import { Menu } from "lucide-react";

const SidebarItem = ({ path, icon, label, onClick }) => {
    const router = useRouter();
    const pathname = usePathname();
    const { isSidebarOpen, toggleSidebar } = useSidebarStore();

    const isActive = pathname === path;

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            router.push(path);
            if (isSidebarOpen) {
                toggleSidebar();
            }
        }
    };

    return (
        <Button
            variant="ghost"
            className={`w-full justify-start mb-3 cursor-pointer flex items-center text-[15px] ${isActive ? "text-[#086280]" : "text-[#A3AED0]"}`
            }
            onClick={handleClick}
        >
            <img
                src={icon}
                alt={label}
                className={`mr-3 w-5 h-6 ${isActive ? "filter brightness-0 invert-[30%]" : ""}`}
            />
            <span>{label}</span>
        </Button>
    );
};

const Sidebar = () => {
    const { isSidebarOpen, toggleSidebar } = useSidebarStore();
    const { user } = userStore();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logoutAdmin();
            localStorage.removeItem("adminToken");
            userStore.setState({ user: null });
            router.push("/admin-login");
        } catch (error) {
            console.error("Lỗi đăng xuất:", error);
            toast.error("Có lỗi xảy ra khi đăng xuất");
        }
    };

    const menuItems = [
        { path: "/admin/dashboard", icon: "/svg/dashboard_admin.svg", label: "Dashboard" },
        { path: "/admin/users", icon: "/svg/user_admin.svg", label: "Người dùng" },
        { path: "/admin/posts", icon: "/svg/post_admin.svg", label: "Bài viết" },
        { path: "/admin/documents", icon: "/svg/document_admin.svg", label: "Tài liệu" },
        { path: "/admin/inquiry", icon: "/svg/support_admin.svg", label: "Hỗ trợ" },
        { path: "/admin/settings", icon: "/svg/settings_admin.svg", label: "Cài đặt" },
        { path: "/admin/account", icon: "/svg/account_admin.svg", label: "Tài khoản" },
        { path: "/admin/quiz", icon: "/svg/quiz.png", label: "Quiz" },
        { path: "/admin-login", icon: "/svg/logout_admin.svg", label: "Đăng xuất", onClick: handleLogout },
    ];

    return (
        <div>
            <Button className="fixed top-3 right-3 z-[60] p-3 text-[#086280] rounded-lg hover:bg-[#086280] hover:text-white hover:cursor-pointer md:hidden" onClick={toggleSidebar}>
                <Menu className="w-16 h-16" />
            </Button>
            <aside
                className={`fixed left-0 h-full w-52 p-4 transform transition-transform duration-200 ease-in-out md:translate-x-0 flex flex-col z-50 md:z-0 ${isSidebarOpen ? "translate-x-0 bg-white shadow-lg " : "-translate-x-full"
                    } ${isSidebarOpen ? "md:hidden" : ""} md:bg-white md:shadow-none`}
            >
                <div className="flex flex-col h-full overflow-y-auto">
                    {/* Logo */}
                    <div className="flex flex-col items-center mb-4">
                        <img src="/logo.png" alt="Vibely Logo" className="w-36" />
                    </div>
                    <hr className="border-t border-gray-100 mb-6" />

                    {/* Navigation */}
                    <nav className="space-y-3 flex-grow">
                        {menuItems.map((item) => (
                            <SidebarItem key={item.path} {...item} />
                        ))}
                    </nav>

                    {/* Footer Image */}
                    <div className="mt-auto flex flex-col items-center pb-4">
                        <img src="/images/end_sidebar.png" alt="Vibely Logo" className="w-42" />
                    </div>
                </div>
            </aside>
        </div>

    );
};

export default Sidebar;