"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createOrUpdateUserBio, updateUserCoverPhoto, updateUserProfile } from "@/service/user.service";
import { userFriendStore } from "@/store/userFriendsStore";
import userStore from "@/store/userStore";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Check, Pencil, PenLine, Save, SquarePlus, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

const ProfileHeader = ({
  id,
  profileData,
  isOwner,
  setProfileData,
  fetchProfile,
}) => {
  const [isEditProfileModel, setIsEditProfileModel] = useState(false);
  const [isEditCoverModel, setIsEditCoverModel] = useState(false);
  const [isEditingField, setIsEditingField] = useState(null);
  const [profile, setProfile] = useState({
    workplace: profileData?.bio?.workplace,
    liveIn: profileData?.bio?.liveIn,
    hometown: profileData?.bio?.hometown,
    education: profileData?.bio?.education,
  });

  const { fetchMutualFriends, mutualFriends } = userFriendStore();
  useEffect(() => {
    if (id) {
      fetchMutualFriends(id);
    }
  }, [id, fetchMutualFriends]);

  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [coverPhotoFile, setCoverPhotoFile] = useState(null);

  const [coverPhotoPreview, setCoverPhotoPreview] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setUser } = userStore();

  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      username: profileData?.username,
      dateOfBirth: profileData?.dateOfBirth?.split("T")[0],
      gender: profileData?.gender,
    },
  });

  const profileImageInputRef = useRef();
  const coverImageInputRef = useRef();


  const onSubmitProfile = async (data) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("dateOfBirth", data.dateOfBirth);
      formData.append("gender", data.gender);

      if (profilePictureFile) {
        formData.append("profilePicture", profilePictureFile);
      }

      // Gửi API cập nhật hồ sơ cá nhân
      const updateProfile = await updateUserProfile(id, formData);

      // Nếu có ảnh bìa, cập nhật ảnh bìa
      if (coverPhotoFile) {
        const coverFormData = new FormData();
        coverFormData.append("coverPicture", coverPhotoFile);
        const updateCover = await updateUserCoverPhoto(id, coverFormData);
        updateProfile.coverPicture = updateCover.coverPicture;
      }

      // **Gửi API cập nhật Bio**
      const bioData = {
        liveIn: data.liveIn,
        workplace: data.workplace,
        education: data.education,
        hometown: data.hometown,
      };
      const updatedBio = await createOrUpdateUserBio(id, bioData);

      // Cập nhật dữ liệu mới vào state
      setProfileData({ ...profileData, ...updateProfile, bio: updatedBio });
      setIsEditProfileModel(false);
      setProfilePicturePreview(null);
      setCoverPhotoFile(null);
      setUser(updateProfile);
      await fetchProfile();
    } catch (error) {
      console.error("Lỗi khi cập nhật trang cá nhân", error);
    } finally {
      setLoading(false);
    }
  };


  const onSubmitCoverPhoto = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      if (coverPhotoFile) {
        formData.append("coverPicture", coverPhotoFile);
      }
      const updateProfile = await updateUserCoverPhoto(id, formData);
      setProfileData({ ...profileData, coverPicture: updateProfile.coverPicture });
      setIsEditCoverModel(false);
      setCoverPhotoFile(null);
    } catch (error) {
      console.error("Lỗi khi cập nhật ảnh bìa", error);
    } finally {
      setLoading(false);
    }
  };




  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file);

      const previewUrl = URL.createObjectURL(file);
      setProfilePicturePreview(previewUrl);
    }
  };

  const handleCoverPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverPhotoFile(file);

      const previewUrl = URL.createObjectURL(file);
      setCoverPhotoPreview(previewUrl);
    }
  };

  const handleEdit = (field) => {
    setIsEditingField(field);
  };

  const handleCancel = () => {
    setIsEditingField(null);
  };

  // const handleSave = (field, value) => {
  //   setProfile((prev) => ({ ...prev, [field]: value }));
  //   setIsEditingField(null);
  // };

  const handleSave = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setValue(field, value); //  Đồng bộ với react-hook-form
    setIsEditingField(null);
  };
  return (
    <div className="relative">
      {/* Ảnh bìa trang cá nhân */}
      <div className="relative h-64 md:h-80 bg-gray-300 overflow-hidden ">
        <img
          src={profileData?.coverPicture}
          alt="cover"
          className="w-full h-full object-cover"
        />

        {isOwner && (
          <Button
            className="absolute bottom-4 right-4 flex items-center"
            variant="secondary"
            size="sm"
            onClick={() => setIsEditCoverModel(true)}
          >
            <Camera className=" mr-0 md:mr-2 h-4 w-4" />
            <span className="hidden md:block">Chỉnh sửa ảnh bìa</span>
          </Button>
        )}
      </div>
      {/* profile section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end md:space-x-5 ">
          <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-700">
            <AvatarImage
              src={profileData?.profilePicture}
              alt={profileData.username}
            />
            <AvatarFallback className="dark:bg-gray-400">
              {profileData?.username
                ?.split(" ")
                .map((name) => name[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="mt-4 mdLmt-0 text-center md:text-left flex-grow">
            <h1 className="text-3xl font-bold">{profileData?.username}</h1>
            <p className="text-gray-400 font-semibold">
              {mutualFriends.length} người bạn
            </p>
          </div>
          {isOwner && (
            <div className="flex flex-col">
              <Button
                className="mt-4 md:mt-1 font-semibold cursor-pointer edit-profile"
                onClick={() => setIsEditProfileModel(true)}
              >
                <PenLine className="w-4 h-4 mr-2" />
                Chỉnh sửa trang cá nhân
              </Button>
            </div>
          )}
        </div>
      </div>
      {/* edit profile model */}
      <AnimatePresence>
        {isEditProfileModel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className=" bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto hidden-scrollbar"
            >
              <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-1">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Chỉnh sửa trang cá nhân
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditProfileModel(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <form
                className="space-y-4"
                onSubmit={handleSubmit(onSubmitProfile)}
              >
                {/* Ảnh đại diện */}
                <div className="flex flex-col">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="imageProfile" className="font-bold">
                      Ảnh đại diện
                    </Label>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={profileImageInputRef}
                      onChange={handleProfilePictureChange}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-[#086280] hover:text-gray-500"
                      onClick={() => profileImageInputRef.current?.click()}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex justify-center">
                    <Avatar className="w-24 h-24 border-4 border-white dark:border-gray-700">
                      <AvatarImage
                        src={
                          profilePicturePreview || profileData?.profilePicture
                        }
                        alt={profileData?.username}
                      />
                      <AvatarFallback className="bg-gray-400">
                        {profileData?.username
                          ?.split(" ")
                          .map((name) => name[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                {/* Ảnh bìa */}
                <div className="flex flex-col">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="imageCover" className="font-bold">
                      Ảnh bìa
                    </Label>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={coverImageInputRef}
                      onChange={handleCoverPhotoChange}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-[#086280] hover:text-gray-500"
                      onClick={() => coverImageInputRef.current?.click()}

                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex justify-center rounded-lg overflow-hidden">
                    <img
                      src={coverPhotoPreview || profileData?.coverPicture || "/images/BG.png"}
                      alt="Ảnh bìa"
                      className="w-3/4 h-35 object-cover rounded-lg"
                    />
                  </div>
                </div>
                {/* Công việc */}
                <ProfileField
                  label="Công việc"
                  field="workplace"
                  value={profile.workplace}
                  isEditingField={isEditingField}
                  onEdit={handleEdit}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />

                {/* Tỉnh/Thành phố hiện tại */}
                <ProfileField
                  label="Tỉnh/Thành phố hiện tại"
                  field="liveIn"
                  value={profile.liveIn}
                  isEditingField={isEditingField}
                  onEdit={handleEdit}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />

                {/* Quê quán */}
                <ProfileField
                  label="Quê quán"
                  field="hometown"
                  value={profile.hometown}
                  isEditingField={isEditingField}
                  onEdit={handleEdit}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />

                {/* Học vấn */}
                <ProfileField
                  label="Học vấn"
                  field="education"
                  value={profile.education}
                  isEditingField={isEditingField}
                  onEdit={handleEdit}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />

                {/* Ngàu sinh */}

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    {...register("dateOfBirth")}
                    className="border-none shadow-none text-gray-700"
                  />
                </div>

                {/* Giới tính */}
                <div className="space-y-2">
                  <Label htmlFor="gender">Giới tính</Label>
                  <Select
                    onValueChange={(value) => setValue("gender", value)}
                    defaultValue={profileData?.gender}
                  >
                    <SelectTrigger className="border-none bg-white shadow-none focus:ring-0">
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                    <SelectContent className="bg-white shadow-lg border border-gray-200">
                      <SelectItem value="male">Nam</SelectItem>
                      <SelectItem value="female">Nữ</SelectItem>
                      <SelectItem value="other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-400 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "Đang lưu" : "Lưu thay đổi"}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* edit cover model */}
      <AnimatePresence>
        {isEditCoverModel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className=" bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Chỉnh sửa ảnh bìa
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditCoverModel(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <form className="space-y-4">
                <div className="flex flex-col items-center mb-4">
                  {coverPhotoPreview && (
                    <img
                      src={coverPhotoPreview}
                      alt="cover-photo"
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                  )}
                  <input type="file" accept="image/*" className="hidden" ref={coverImageInputRef} onChange={handleCoverPhotoChange} />
                  <Button type="button" variant="outline" size="sm" onClick={() => coverImageInputRef.current?.click()}>
                    <Upload className="h-4 w-4 mr-2" />
                    Tải ảnh lên
                  </Button>
                </div>

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-400 text-white"
                  onClick={onSubmitCoverPhoto}
                  disabled={!coverPhotoFile}
                  type="button"
                >
                  <Save className="w-4 h-4 mr-2" /> {loading ? "Đang lưu" : "Lưu ảnh bìa mới"}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* Component cho từng trường hồ sơ */
const ProfileField = ({
  label,
  field,
  value,
  isEditingField,
  onEdit,
  onSave,
  onCancel,
}) => {
  const [inputValue, setInputValue] = useState(value);

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between items-center">
        <Label className="font-bold">{label}</Label>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={`${isEditingField === field
            ? "text-gray-500"
            : "text-[#086280] hover:text-gray-500"
            }`}
          onClick={() => onEdit(field)}
        >
          <Pencil className="w-4 h-4" />
        </Button>
      </div>

      {isEditingField === field ? (
        <div className="flex items-center space-x-2 border p-2 rounded-md">
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full border-none focus:ring-0"
          />
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-red-500"
            onClick={onCancel}
          >
            <X className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-green-500"
            onClick={() => onSave(field, inputValue)}
          >
            <Check className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <p className={`text-gray-700  ${!value && "italic text-gray-400"}`}>
          {value || `Chưa thêm ${label.toLowerCase()}`}
        </p>
      )}
    </div>
  );
};

export default ProfileHeader;
