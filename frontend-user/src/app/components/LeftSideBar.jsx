import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import useSidebarStore from "@/store/sidebarStore";
import userStore from "@/store/userStore";
import Link from "next/link";

const LeftSideBar = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebarStore();
  const { user } = userStore();
  const userPlaceholder = user?.username
    ?.split(" ")
    .map((name) => name[0])
    .join("");

  return (
    <aside
      className={`fixed top-14 left-0 h-full w-72 transform transition-transform duration-200 ease-in-out md:translate-x-0 flex flex-col z-50 md:z-0 ${
        isSidebarOpen ? "translate-x-0 shadow-lg  " : " -translate-x-full"
      } ${isSidebarOpen ? "md:hidden" : ""} md:bg-transparent md:shadow-none`}
    >
      <div className="flex flex-col h-full overflow-y-auto bg-[#f0fcff] p-4">
        {/* navigation menu yaha pr */}

        <nav className="space-y-4 flex-grow">
          <Link
            href={`/user-profile/${user?._id}`}
            onClick={() => isSidebarOpen && toggleSidebar()}
            className="flex items-center space-x-2 cursor-pointer pb-2"
          >
            <Avatar className="h-9 w-9 ml-4 mt-2">
              {user?.profilePicture ? (
                <AvatarImage src={user?.profilePicture} alt={user?.username} />
              ) : (
                <AvatarFallback>{userPlaceholder}</AvatarFallback>
              )}
            </Avatar>
            <p className="text-sm font-medium leading-none">{user?.username}</p>
          </Link>
          <Link
            href="/friends-list"
            onClick={() => isSidebarOpen && toggleSidebar()}
            className="block w-full"
          >
            <Button variant="ghost" className="w-full justify-start">
              <img
                src="/images/friend_sidebar.png"
                alt="friend"
                className="mr-2"
              />
              Bạn bè
            </Button>
          </Link>
          <Link
            href="/groups"
            onClick={() => isSidebarOpen && toggleSidebar()}
            className="block w-full"
          >
            <Button variant="ghost" className="w-full justify-start">
              <img
                src="/images/group_sidebar.png"
                alt="group"
                className="mr-2"
              />
              Nhóm
            </Button>
          </Link>
          <Link
            href="/saved"
            onClick={() => isSidebarOpen && toggleSidebar()}
            className="block w-full"
          >
            <Button variant="ghost" className="w-full justify-start">
              <img
                src="/images/save_sidebar.png"  
                alt="saved"
                className="mr-4"
              />
              Đã lưu
            </Button>
          </Link>
          <Link
            href="/video-conferencing"
            onClick={() => isSidebarOpen && toggleSidebar()}
            className="block w-full"
          >
            <Button variant="ghost" className="w-full justify-start">
              <img
                src="/images/video_sidebar.png"
                alt="video"
                className="mr-2"
              />
              Cuộc họp
            </Button>
          </Link>
          <Link
            href="/calendar"
            onClick={() => isSidebarOpen && toggleSidebar()}
            className="block w-full"
          >
            <Button variant="ghost" className="w-full justify-start">
              <img
                src="/images/calendar_sidebar.png"
                alt="calendar"
                className="mr-3"
              />
              Lịch
            </Button>
          </Link>
          <Link
            href="/document"
            onClick={() => isSidebarOpen && toggleSidebar()}
            className="block w-full"
          >
            <Button variant="ghost" className="w-full justify-start">
              <img
                src="/images/document_sidebar.png"
                alt="document"
                className="mr-3"
              />
              Tài liệu
            </Button>
          </Link>
          <Link
            href="/pomodoro"
            onClick={() => isSidebarOpen && toggleSidebar()}
            className="block w-full"
          >
            <Button variant="ghost" className="w-full justify-start">
              <img
                src="/images/pomodoro_sidebar.png"
                alt="pomodoro"
                className="-ml-2 mr-2"
              />
              Chế độ Pomodoro
            </Button>
          </Link>
          <Link
            href="/quiz"
            onClick={() => isSidebarOpen && toggleSidebar()}
            className="block w-full"
          >
            <Button variant="ghost" className="full justify-start">
              <img
                src="/images/game_sidebar.png"
                alt="quiz"
                className="-ml-2 mr-2"
              />
              Củng cố kiến thức
            </Button>
          </Link>
          <Link
            href="/study-plant"
            onClick={() => isSidebarOpen && toggleSidebar()}
            className="block w-full"
          >
            <Button variant="ghost" className="full justify-start">
              <img
                src="images/plant_sidebar.png"
                alt="quiz"
                className="-ml-2 mr-2"
              />
              Cây học tập
            </Button>
          </Link>
        </nav>
      </div>
    </aside>
  );
};

export default LeftSideBar;
