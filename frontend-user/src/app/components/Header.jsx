"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { logout } from "@/service/auth.service";
import { getAllUsers } from "@/service/user.service";
import useSidebarStore from "@/store/sidebarStore";
import userStore from "@/store/userStore";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
  ChevronRight,
  Menu,
  MessageCircle,
  Search
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { SettingsMenu } from './SettingsMenu';
import axios from "axios";
import { getAllGroups } from "@/service/group.service";
import NotificationPopover from "./Notification/NotificationPopover";

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [userList, setUserList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [filterUsers, setFilterUsers] = useState([]);
  const [filterGroups, setFilterGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const scrollPositionRef = useRef(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastMessage, setLastMessage] = useState(null);
  const [showMessagePreview, setShowMessagePreview] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8081';

  const handleBackToMainMenu = () => {
    setIsSettingsOpen(false);
  };

  const navItems = [
    { icon: "/images/home_navbar.svg", path: "/" },
    { icon: "/images/video_navbar.svg", path: "/video-conferencing" },
    { icon: "/images/document_navbar.svg", path: "/document" },
    { icon: "/images/group_navbar.svg", path: "/groups" },
    { icon: "/images/game_navbar.svg", path: "/quiz" },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const users = await getAllUsers();
        const groups = await getAllGroups()
        setUserList(users);
        setGroupList(groups);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filterUser = userList.filter((user) => {
        return user.username.toLowerCase().includes(searchQuery.toLowerCase());
      })
      const filterGroup = groupList.filter((group) => {
        return group.name.toLowerCase().includes(searchQuery.toLowerCase());
      })
      setFilterGroups(filterGroup);
      setFilterUsers(filterUser);
      setIsSearchOpen(true);
    } else {
      setFilterUsers([]);
      setFilterGroups([])
      setIsSearchOpen(false);
    }
  }, [searchQuery, userList, groupList]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsSearchOpen(false);
  };

  const handleSearchClose = (e) => {
    if (!searchRef.current?.contains(e.target)) {
      setIsSearchOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleSearchClose);
    return () => {
      document.removeEventListener("click", handleSearchClose);
    };
  });

  const { toggleSidebar } = useSidebarStore();
  const router = useRouter();
  if (router.pathname === "/forgot-password") return null;
  const { user, clearUser } = userStore();

  const userPlaceholder = user?.username
    ?.split(" ")
    .map((name) => name[0])
    .join("");

  const handleLogout = async () => {
    try {
      await logout();

      clearUser();
      localStorage.removeItem("isGuest");
      localStorage.removeItem("token");

      if (pathname !== "/user-login") {
        router.push("/user-login");
      }

      toast.success("Đăng xuất thành công");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      toast.error("Đăng xuất thất bại");
    }
  };

  const handleScroll = () => {
    if (dropdownRef.current) {
      scrollPositionRef.current = dropdownRef.current.scrollTop;
    }
  };

  useEffect(() => {
    if (dropdownRef.current && isDropdownOpen) {
      dropdownRef.current.scrollTop = scrollPositionRef.current;
    }
  }, [isDropdownOpen, isSettingsOpen]);

  // Lấy số tin nhắn chưa đọc
  useEffect(() => {
    const fetchUnreadMessages = async () => {
      if (!user?._id) return;

      try {
        const response = await axios.get(`${API_URL}/message/unread/${user._id}`);
        setUnreadCount(response.data.total);
      } catch (error) {
        console.error("Lỗi khi lấy số tin nhắn chưa đọc:", error);
      }
    };

    fetchUnreadMessages();

    // Lắng nghe tin nhắn mới từ socket
    if (window.socket) {
      window.socket.on("getMessage", (data) => {
        if (data.senderId !== user?._id) {
          setUnreadCount(prev => prev + 1);
          setLastMessage(data);
          setShowMessagePreview(true);

          // Tự động ẩn preview sau 5 giây
          setTimeout(() => {
            setShowMessagePreview(false);
          }, 5000);
        }
      });
    }

    return () => {
      if (window.socket) {
        window.socket.off("getMessage");
      }
    };
  }, [user]);

  return (
    <header className="bg-background_header text-foreground shadow-md h-14 fixed top-0 left-0 z-50 w-full">
      <div className="mx-auto flex justify-between items-center h-full px-4">
        {/* Logo và Tìm kiếm */}
        <div className="flex items-center gap-2">
          <Link href="/">
            <Image
              src="/images/vibely_logo.png"
              alt="logo"
              width={60}
              height={60}
              className="-ml-2 cursor-pointer"
              priority
            />
          </Link>
          <div className="relative -ml-2" ref={searchRef}>
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <Search
                  className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-800"
                  size={20}
                />
                <Input
                  type="text"
                  placeholder="Tìm kiếm"
                  className="pl-10 w-40 lg:w-64 h-10 bg-search_bar rounded-full border-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchOpen(true)}
                />
              </div>
              {isSearchOpen && (
                <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg mt-1 z-50">
                  <div className="p-2">
                    <p className="font-semibold text-sm ml-2">Người dùng</p>
                    {filterUsers.length > 0 ? (
                      filterUsers.map((user) => (
                        <Link
                          href={`/user-profile/${user._id}`}
                          className="flex items-center space-x-8 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer"
                          key={user._id}
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery("");
                          }}
                        >
                          <Search className="absolute text-sm text-gray-400" />
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              {user?.profilePicture ? (
                                <AvatarImage
                                  src={user?.profilePicture}
                                  alt={user?.username}
                                />
                              ) : (
                                <AvatarFallback className="bg-gray-400">
                                  {user?.username
                                    ?.split(" ")
                                    .map((name) => name[0])
                                    .join("")}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <span>{user?.username}</span>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="p-2 text-gray-500">
                        Không tìm thấy người dùng
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                  <p className="font-semibold text-sm ml-2">Nhóm</p>
                    {filterGroups.length > 0 ? (
                      filterGroups.map((group) => (
                        <Link
                          href={`/groups/${group._id}`}
                          className="flex items-center space-x-8 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer"
                          key={group._id}
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery("");
                          }}
                        >
                          <Search className="absolute text-sm text-gray-400" />
                          <div className="flex items-center gap-2">
                              {group?.coverPhotoUrl ? (
                                <img
                                  src={group?.coverPhotoUrl}
                                  alt={group?.name}
                                  className="h-8 w-8 rounded-md object-cover"
                                />
                              ) : (
                                <div className="bg-gray-200 h-8 w-8 rounded-md object-cover">
                                  {group?.name
                                    ?.split(" ")
                                    .map((name) => name[0])
                                    .join("")}
                                </div>
                              )}
                            <span>{group?.name}</span>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="p-2 text-gray-500">
                        Không tìm thấy nhóm
                      </div>
                    )}
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Thanh điều hướng */}
        <nav className="hidden md:flex justify-around w-[40%] max-w-md lg:ml-[-100px] -translate-x-1/5 flex-wrap gap-x-[clamp(1rem,2.5vw,80px)]">
          {navItems.map(({ icon, path }) => (
            <Link key={path} href={path} className="flex items-center">
              <img
                src={icon}
                alt="nav-icon"
                className={`transition-all duration-200 ${pathname === path
                  ? ""
                  : "brightness-0 invert-[70%] hover:invert-[40%] hover:sepia-[50%] hover:saturate-[300%] hover:hue-rotate-[160deg]"
                  }`}
              />
            </Link>
          ))}
        </nav>

        {/* Profile cá nhân */}
        <div className="flex space-x-2 md:space-x-4 items-center">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-600 cursor-pointer"
            onClick={toggleSidebar}
          >
            <Menu />
          </Button>

          <Link href="/messenger" className="hidden md:block">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600 cursor-pointer pl-1 relative"
            >
              <MessageCircle size={22} className="min-w-[22px] min-h-[22px]" />
            </Button>
          </Link>
          <NotificationPopover/>
          <DropdownMenu onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full shadow-lg profile-button"
              >
                <Avatar>
                  {user?.profilePicture ? (
                    <AvatarImage
                      src={user?.profilePicture}
                      alt={user?.username}
                    />
                  ) : (
                    <AvatarFallback>{userPlaceholder}</AvatarFallback>
                  )}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              ref={dropdownRef}
              onScroll={handleScroll}
              className="w-64 z-50 bg-white shadow-lg rounded-lg border border-gray-200"
              align="end"
              sideOffset={5}
              style={{
                maxHeight: 'calc(100vh - 60px)',
                overflowY: 'auto',
              }}
            >
              {isSettingsOpen ? (
                <SettingsMenu onBack={handleBackToMainMenu} />
              ) : (
                <>
                  <DropdownMenuItem asChild
                    className="font-normal cursor-pointer"
                  >
                    <Link href={`/user-profile/${user?._id}`}>
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            {user?.profilePicture ? (
                              <AvatarImage
                                src={user?.profilePicture}
                                alt={user?.username}
                              />
                            ) : (
                              <AvatarFallback>{userPlaceholder}</AvatarFallback>
                            )}
                          </Avatar>
                          <div className="ml-2">
                            <p className="text-sm font-medium leading-none">
                              {user?.username}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>                    
                  </DropdownMenuItem>
                  <div className="bg-gray-200 h-px my-2"></div>
                  <DropdownMenuItem
                    className="cursor-pointer mb-2"
                    onSelect={(event) => {
                      event.preventDefault();
                      setIsSettingsOpen(true);
                    }}
                  >
                    <img
                      src="/images/setting_dropdown.png"
                      alt="setting"
                      className="mr-0"
                    />
                    <span className="ml-2 font-semibold">Cài đặt</span>
                    <ChevronRight className="absolute right-2 text-[#54C8FD]" />
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer mb-3">
                    <Link href="/help-center">
                      <>
                        <img
                          src="/images/help_dropdown.png"
                          alt="help"
                          className="mr-0"
                        />
                        <span className="ml-2 font-semibold help-center-dropdown">
                          Trung tâm trợ giúp
                        </span>
                      </>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer mb-3">
                    <Link href="/support">
                      <>
                        <img
                          src="/images/faqs_dropdown.png"
                          alt="support"
                          className="mr-0"
                        />
                        <span className="ml-2 font-semibold">
                          Hộp thư hỗ trợ
                        </span>
                      </>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer mb-3">
                    <Link href="/about-us">
                      <>
                        <img
                          src="/images/about_dropdown.png"
                          alt="faqs"
                          className="mr-0"
                        />
                        <span className="ml-1 font-semibold">
                          Về chúng tôi
                        </span>
                      </>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer mb-3"
                    onClick={handleLogout}
                  >
                    <img
                      src="/images/logout_dropdown.png"
                      alt="logout"
                      className="mr-0"
                    />
                    <span className="ml-2 font-semibold">Đăng xuất</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Message Preview */}
          {showMessagePreview && lastMessage && (
            <div className="fixed top-16 right-4 bg-white shadow-lg rounded-lg p-4 max-w-sm z-50 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Tin nhắn mới</h3>
                <button
                  onClick={() => setShowMessagePreview(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              <p className="text-sm text-gray-600 truncate">{lastMessage.text}</p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
