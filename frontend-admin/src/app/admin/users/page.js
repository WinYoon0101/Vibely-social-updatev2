"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  deleteUser,
  getAllFriends,
  getAllUsers,
  searchUsers,
} from "@/service/userAdmin.service";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import Sidebar from "../../components/sidebar/Sidebar";
import DeleteInquiryPopup from "../../components/users/DeleteInquiryPopup";
import UserProfile from "../../components/users/UserProfile";

const UsersPage = () => {
  // State để theo dõi người dùng được chọn
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [usersList, setUsersList] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State cho popup xóa
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Fetch users khi component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Hàm lấy danh sách users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const users = await getAllUsers();
      console.log("Danh sách người dùng:", users);
      setUsersList(users);
      if (users.length > 0) {
        setSelectedUser(users[0]);
        fetchFriends(users[0]._id);
      }
    } catch (error) {
      setError("Không thể tải danh sách người dùng");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm lấy danh sách bạn bè của người dùng
  const fetchFriends = async (userId) => {
    try {
      const friends = await getAllFriends(userId);
      setFriendsList(friends);
    } catch (error) {
      setError("Không thể tải danh sách bạn bè");
    }
  };

  // Xử lý khi click vào người dùng
  const handleUserClick = (user) => {
    scrollToTop()
    setSelectedUser(user);
    fetchFriends(user._id);
  };

  // Xử lý khi tìm kiếm
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchUsers();
      return;
    }

    try {
      setLoading(true);
      const results = await searchUsers(searchQuery);
      setUsersList(results);
      if (results.length > 0) {
        setSelectedUser(results[0]);
        fetchFriends(results[0]._id);
      } else {
        setSelectedUser(null);
        setFriendsList([]);
      }
    } catch (error) {
      setError("Không thể tìm kiếm người dùng");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Mở popup xác nhận xóa
  const openDeletePopup = (user, e) => {
    e.stopPropagation(); // Ngăn không cho click vào hàng kích hoạt handleUserClick
    setUserToDelete(user);
    setIsDeletePopupOpen(true);
  };

  // Đóng popup xác nhận xóa
  const closeDeletePopup = () => {
    setIsDeletePopupOpen(false);
    setUserToDelete(null);
  };

  // Xử lý khi xác nhận xóa người dùng
  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete._id);
        // Cập nhật danh sách sau khi xóa
        const updatedUsers = usersList.filter(
          (user) => user._id !== userToDelete._id
        );
        setUsersList(updatedUsers);

        // Nếu người dùng đang được chọn là người dùng bị xóa, chọn người dùng khác
        if (selectedUser && selectedUser._id === userToDelete._id) {
          // setSelectedUser(updatedUsers.length > 0 ? updatedUsers[0] : null);
          if (updatedUsers.length > 0) {
            setSelectedUser(updatedUsers[0]);
            fetchFriends(updatedUsers[0]._id);
          } else {
            setSelectedUser(null);
            setFriendsList([]);
          }
        }

        closeDeletePopup();
      } catch (error) {
        setError("Không thể xóa người dùng");
        console.error(error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex w-full flex-row min-h-screen bg-[#F4F7FE]">
        <div className="w-1/5 flex-shrink-0">
          <Sidebar />
        </div>
        <div className="w-4/5 ml-[-40px] flex items-center justify-center">
          <div className="text-xl">Đang tải...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex w-full flex-row min-h-screen bg-[#F4F7FE]">
        <div className="w-1/5 flex-shrink-0">
          <Sidebar />
        </div>
        <div className="w-4/5 ml-[-40px] flex items-center justify-center">
          <div className="text-xl text-red-500">{error}</div>
        </div>
      </div>
    );
  }
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // hoặc 'auto' nếu bạn không muốn hiệu ứng mượt
    });
  };
  return (
    <div className="flex w-full flex-row min-h-screen bg-[#F4F7FE]">
      {/* Sidebar */}
      <Sidebar />
      {/* Main Container */}
      <div className="w-full md:ml-52 py-6 overflow-y-auto flex flex-col">
        {/* Header Row */}
        <div className="flex justify-between items-center mb-6 px-6">
          <h1 className="text-2xl font-semibold text-[#333]">Quản lý người dùng</h1>
            <div className="flex items-center space-x-4"></div>
        </div>

        {/* Content Area */}
        <div className="py-6 px-6 overflow-y-auto flex">
          {/* User List Section */}
          <div className="w-full xl:w-4/5 md:pr-6">
          {/* User Profile Section */}
          <div className="xl:hidden mb-5">
            <UserProfile user={selectedUser} friends={friendsList}/>
          </div>
            {/* Search Bar */}
            <div className="mb-6 w-full">
              <form onSubmit={handleSearch} className="flex">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    className="w-full border px-4 py-2 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 border-gray-300 italic"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="w-24 h-10 cursor-pointer ml-2 px-6 py-2 bg-[#086280] text-white rounded-lg hover:bg-gray-700 transition duration-200"
                >
                  <div className="flex items-center">
                    <FiSearch className="mr-1" />
                    <span>Tìm</span>
                  </div>
                </button>
              </form>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-2 xl:px-4 py-1 xl:py-3 text-gray-600 font-medium">ID</th>
                    <th className="px-2 xl:px-4 py-1 xl:py-3 text-gray-600 font-medium">
                      USERNAME
                    </th>
                    <th className="px-4 py-3 text-gray-600 font-medium hidden lg:table-cell">
                      EMAIL
                    </th>
                    <th className="px-4 py-3 text-gray-600 font-medium hidden lg:table-cell">
                      NGÀY THAM GIA
                    </th>

                    <th className="px-2 xl:px-4 py-1 xl:py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {usersList.map((user) => (
                    <tr
                      key={user._id}
                      className={`hover:bg-gray-50 cursor-pointer ${selectedUser && selectedUser._id === user._id
                        ? "bg-blue-50"
                        : ""
                        }`}
                      onClick={() => handleUserClick(user)}
                    >
                      <td className="px-2 xl:px-4 py-1 xl:py-3 text-gray-800 text-xs md:text-sm xl:text-base max-w-[230px]">{user._id}</td>
                      <td className="px-2 xl:px-4 py-1 xl:py-3 text-xs md:text-sm xl:text-base max-w-[250px]">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full overflow-hidden mr-3">
                            {/* <Image 
                                                            src={user.avatar || '/images/default-avatar.png'} 
                                                            alt={user.username} 
                                                            width={32} 
                                                            height={32} 
                                                            className="h-full w-full object-cover" 
                                                        /> */}
                            <Avatar>
                              {user?.profilePicture ? (
                                <AvatarImage
                                  src={user?.profilePicture}
                                  alt={user?.username}
                                />
                              ) : (
                                <AvatarFallback className="bg-gray-300">
                                  {user?.username
                                    ?.split(" ")
                                    .map((name) => name[0])
                                    .join("")}
                                </AvatarFallback>

                              )}
                            </Avatar>
                          </div>
                          <span>{user.username}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 font-medium hidden lg:table-cell max-w-[200px] truncate">{user.email}</td>
                      <td className="px-4 py-3 text-gray-600 font-medium hidden lg:table-cell max-w-[100px]">
                        {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                      
                      <td className="px-4 py-3 text-right">
                        <button
                          className="text-red-400 hover:text-red-600 transition-colors duration-200 cursor-pointer"
                          onClick={(e) => openDeletePopup(user, e)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* User Profile Section */}
          <div className="hidden xl:block xl:w-1/4 mr-5">
            <UserProfile user={selectedUser} friends={friendsList}/>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Popup */}
      <DeleteInquiryPopup
        isOpen={isDeletePopupOpen}
        onClose={closeDeletePopup}
        onConfirm={handleConfirmDelete}
        userName={userToDelete ? userToDelete.username : ""}
      />
    </div>
  );
};

export default UsersPage;
