import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import useSidebarStore from "@/store/sidebarStore";
import userStore from "@/store/userStore";
import { useRouter } from "next/navigation";

const LeftSideBar = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebarStore()
  const router = useRouter();
  const { user } = userStore();
  const userPlaceholder = user?.username
    ?.split(" ")
    .map((name) => name[0])
    .join("");

  const handleNavigation = (path, item) => {
    router.push(path);
    if (isSidebarOpen) {
      toggleSidebar()
    }
  };
  return (
    <aside


      className={`fixed top-14 left-0 h-full w-72 transform transition-transform duration-200 ease-in-out md:translate-x-0 flex flex-col z-50 md:z-0 ${isSidebarOpen
        ? "translate-x-0 shadow-lg  "
        : " -translate-x-full"


        } ${isSidebarOpen ? "md:hidden" : ""} md:bg-transparent md:shadow-none`}
    >
      <div className="flex flex-col h-full overflow-y-auto bg-[#f0fcff] p-4">
        {/* navigation menu yaha pr */}

        <nav className="space-y-6 flex-grow">
          <div className="flex items-center space-x-2 cursor-pointer pb-2 " onClick={() => handleNavigation(`/user-profile/${user?._id}`)}>
            <Avatar className="h-9 w-9 ml-4 mt-2">

              {user?.profilePicture ? (
                <AvatarImage
                  src={user?.profilePicture}
                  alt={user?.username}
                />
              ) : (
                <AvatarFallback>
                  {userPlaceholder}
                </AvatarFallback>
              )}
            </Avatar>
            <p className="text-sm font-medium leading-none">{user?.username}</p>
          </div>

          <Button
            variant="ghost"
            className="full justify-start"
            onClick={() => handleNavigation("/friends-list")}
          >
            <img src="/images/friend_sidebar.png" alt="friend" className="mr-2" />
            Bạn bè
          </Button>
          <br></br>
          <Button
            variant="ghost"
            className="full justify-start"
            onClick={() => handleNavigation("/saved")}
          >
            <img src="/images/save_sidebar.png" alt="saved" className="mr-4" />
            Đã lưu
          </Button>
          <br></br>
          <Button
            variant="ghost"
            className="full justify-start"
            onClick={() => handleNavigation("/video-feed")}
          >
            <img src="/images/video_sidebar.png" alt="video" className="mr-2" />
            Video
          </Button>
          <br></br>
          <Button
            variant="ghost"
            className="full justify-start"
            onClick={() => handleNavigation("/calendar")}
          >
            <img src="/images/calendar_sidebar.png" alt="calendar" className="mr-3" />
            Lịch
          </Button>
          <br></br>
          <Button
            variant="ghost"
            className="full justify-start"
            onClick={() => handleNavigation("/document")}
          >
            <img src="/images/document_sidebar.png" alt="document" className="mr-3" />
            Tài liệu
          </Button>
          <Button
            variant="ghost"
            className="full justify-start"
            onClick={() => handleNavigation("/pomodoro")}
          >
            <img src="/images/pomodoro_sidebar.png" alt="pomodoro" className="-ml-2 mr-2" />
            Chế độ Pomodoro
          </Button>
          <Button
            variant="ghost"
            className="full justify-start"

            onClick={() => handleNavigation("/quiz")}
          >
            <img src="/images/game_sidebar.png" alt="quiz" className="-ml-2 mr-2" />
            Củng cố kiến thức
          </Button>
          <Button
            variant="ghost"
            className="full justify-start"

            onClick={() => handleNavigation("/study-plant")}
          >
            <img src="images/plant_sidebar.png" alt="quiz" className="-ml-2 mr-2" />
            Cây học tập
          </Button>

        </nav>

      </div>
    </aside>
  )
}

export default LeftSideBar