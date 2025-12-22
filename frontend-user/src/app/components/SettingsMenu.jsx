"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { deleteAccount } from "@/service/auth.service";
import userStore from "@/store/userStore";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export const SettingsMenu = ({ onBack }) => {
  const [popupDeleteOpen, setPopupDeleteOpen] = useState(false);
  const popupRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setPopupDeleteOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const { clearUser } = userStore();
  const router = useRouter();
  const handleDeleteAccount = async () => {
    try {
      const result = await deleteAccount();
      if (result?.status === "success") {
        clearUser();
        if (router.pathname !== "/user-login") {
          router.push("/user-login");
        }
        toast.success("Xóa tài khoản thành công");
      } else {
        toast.error("Xóa tài khoản thất bại, vui lòng thử lại");
      }
    } catch (error) {
      console.error("Lỗi khi xóa tài khoản:", error);
      toast.error("Xóa tài khoản thất bại");
    }
  };
  return (
    <>
      <DropdownMenuItem
        className="cursor-pointer flex items-center mb-2"
        onSelect={(event) => {
          event.preventDefault();
          onBack();
        }}
      >
        <ChevronLeft className="mr-2 mt-2 text-[#54C8FD]" />
      </DropdownMenuItem>
      <DropdownMenuItem
        className="cursor-pointer mb-2"
        onSelect={(event) => {
          event.preventDefault();
          router.push("/change_password");
        }}
      >
        <img
          src="/images/change_password_dropdown.png"
          alt="help"
          className="mr-0"
        />
        <span className="font-semibold ml-2">Đổi mật khẩu</span>
      </DropdownMenuItem>
      <DropdownMenuItem
        className="cursor-pointer mb-2"
        onSelect={(event) => {
          event.preventDefault();
          setPopupDeleteOpen(true);
        }}
      >
        <img src="/images/delete_dropdown.png" alt="help" className="mr-0" />

        <span className="font-semibold ml-2">Xóa tài khoản</span>
      </DropdownMenuItem>
      {popupDeleteOpen && (
        <div className="fixed top-0 right-0 flex justify-center items-center w-screen h-screen translate-x-4 -translate-y-12 bg-black bg-opacity-80 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg" ref={popupRef}>
            <h2 className="text-lg font-bold mb-4">
              Bạn có chắc chắn muốn xóa?
            </h2>
            <p className="text-md mb-4">
              Hành động này không thể hoàn tác và tài khoản của bạn sẽ bị xóa
              bỏ.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setPopupDeleteOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  setPopupDeleteOpen(false);
                  handleDeleteAccount();
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
