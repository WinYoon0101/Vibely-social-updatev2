"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
const UserProfile = ({ user, friends }) => {
  if (!user) return null;
  const calculateAge = (dob) => {
    if (!dob) return "N/A"; // Tránh lỗi nếu không có dữ liệu

    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Nếu chưa đến sinh nhật năm nay, trừ đi 1 tuổi
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col items-center">
        <div className="relative mb-4 h-40 w-40 rounded-full overflow-hidden border-4 border-yellow-400">
          <Avatar className="w-full h-full">
            {user?.profilePicture ? (
              <AvatarImage
                src={user?.profilePicture}
                alt={user?.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <AvatarImage
                src="/images/avatar.png"
                alt={user?.username}
                className="w-full h-full object-cover"
              />
            )}
          </Avatar>
          <div className="absolute top-0 right-0 bg-[#086280] text-white text-xs rounded-full px-2 py-1">
            {user.id}
          </div>
        </div>

        {/* User Name */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {user.username}
        </h2>

        {/* Contact Icons */}
        {/* <div className="flex space-x-3 mb-6">
          <div className="p-2 bg-gray-100 rounded-full">
            <Image
              src="/images/users/school.png"
              alt="Graduation"
              width={24}
              height={24}
            />
          </div>
          <div className="p-2 bg-gray-100 rounded-full">
            <Image
              src="/images/users/tel.png"
              alt="Phone"
              width={24}
              height={24}
            />
          </div>
          <div className="p-2 bg-gray-100 rounded-full">
            <Image
              src="/images/users/email.png"
              alt="Mail"
              width={24}
              height={24}
            />
          </div>
        </div> */}

        {/* User Bio */}
        <div className="w-full mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Email:</h3>
          <p className="text-gray-600 text-sm">{user.email}</p>
        </div>

        {/* User Details */}
        <div className="w-full grid grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">Tuổi</h3>
            <p className="text-gray-600">{calculateAge(user?.dateOfBirth)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">
              Giới tính
            </h3>
            <p className="text-gray-600">{user.gender}</p>
          </div>
        </div>

        {/* Friends */}
        <div className="w-full mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Bạn bè</h3>

          {friends?.length > 0 ? (
            <div className="flex -space-x-2">
              {friends.map((friend, i) => (
                <div
                  key={friend._id || i}
                  className="h-8 w-8 rounded-full overflow-hidden border-2 border-white"
                >
                  <Avatar>
                    {friend.profilePicture ? (
                      <AvatarImage
                        src={friend.profilePicture}
                        alt={friend.username}
                      />
                    ) : (
                      <AvatarFallback className="bg-gray-300">
                        {friend.username
                          ?.split(" ")
                          .map((name) => name[0])
                          .join("")}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Không có bạn bè</p>
          )}
        </div>

        {/* Followers/Following */}
        <div className="w-full grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">
              Người theo dõi
            </h3>
            <p className="text-gray-600">{user?.followerCount ?? 0}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">
              Đang theo dõi
            </h3>
            <p className="text-gray-600">{user?.followingCount ?? 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
