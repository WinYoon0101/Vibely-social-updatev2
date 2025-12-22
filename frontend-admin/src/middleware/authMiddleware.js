import { checkAdminAuth } from "@/service/authAdmin.service";
import { redirect } from "next/navigation";

export const requireAuth = async () => {
    try {
        // Kiểm tra nếu đang ở trang login thì không cần check auth
        if (window.location.pathname === '/admin-login') {
            return;
        }

        // Kiểm tra trạng thái xác thực của admin
        const { isAuthenticated } = await checkAdminAuth();
        if (!isAuthenticated) {
            redirect("/admin-login");
        }
    } catch (error) {
        console.error("Lỗi kiểm tra đăng nhập:", error);
        redirect("/admin-login");
    }
}; 