import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeftIcon, ImageIcon, PenLine, XIcon } from "lucide-react";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { useUserGroupsStore } from "@/store/userGroupsStore";
import toast from "react-hot-toast";
import { usePostStore } from "@/store/usePostStore";

function EditGroupDialog({ groupInfo, setInfo }) {
  const { editGroup } = useUserGroupsStore();
  const [open, setOpen] = useState(false);
  const {fetchPosts} = usePostStore()
  const [name, setName] = useState(groupInfo.name);
  const [nameError, setNameError] = useState(false);
  const [desc, setDesc] = useState(groupInfo.description || "");
  const [descError, setDescError] = useState(false);
  const [privacy, setPrivacy] = useState(groupInfo.privacySetting === "private");

  //-------
  const [filePreview, setFilePreview] = useState(
    groupInfo.coverPhotoUrl || null
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFilePreview(URL.createObjectURL(file));
  };

  const handleNameChange = (e) => {
    if (e.target.value.length <= 60) {
      setName(e.target.value);
      return;
    }
    setNameError(true);
    setTimeout(() => {
      setNameError(false);
    }, 3000);
  };

  const handleDescChange = (e) => {
    if (e.target.value.length <= 200) {
      setDesc(e.target.value);
      return;
    }
    setDescError(true);
    setTimeout(() => {
      setDescError(false);
    }, 3000);
  };

  const handleEditGroup = async () => {
    if (name.trim() === "") {
      toast.error("Tên nhóm không được để trống");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("desc", desc);
      formData.append("privacy", privacy);
      if (selectedFile) {
        formData.append("media", selectedFile);
      }
      if(!selectedFile && !filePreview){
        formData.append("deletePhoto", true);
      }
      const edited = await editGroup(groupInfo._id, formData);
      toast.success("Cập nhật thông tin nhóm thành công");
      setInfo(edited)
      await fetchPosts();
      setOpen(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex mt-4 font-semibold cursor-pointer bg-[#086280] hover:bg-[#086280]/70 text-white">
          <PenLine className="w-4 h-4 mr-2" />
          Chỉnh sửa thông tin nhóm
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[min(600px,80vh)] flex flex-col gap-0 py-4 sm:max-w-md">
        <DialogHeader>
          <ScrollArea className="flex max-h-full flex-col overflow-hidden">
            <DialogTitle className="p-2 text-center w-full">
              Chỉnh sửa thông tin nhóm
            </DialogTitle>
            <DialogDescription asChild>
              <div className="flex flex-col gap-2">
                <Label className="flex flex-col">
                  <h2 className="mb-2">Tên nhóm</h2>
                  <Input
                    value={name}
                    onChange={handleNameChange}
                    placeholder="Tên nhóm"
                    className={`w-full ${
                      nameError ? "text-red-500" : "text-muted-foreground"
                    }`}
                  />
                  <p
                    className={`${
                      nameError ? "text-red-500" : "text-muted-foreground"
                    } text-end text-xs`}
                  >
                    {name.length}/60
                  </p>
                </Label>
                <Label className="flex flex-col">
                  <h2 className="mb-2">Mô tả nhóm:</h2>
                  <Textarea
                    value={desc}
                    onChange={handleDescChange}
                    placeholder="Mô tả nhóm"
                    className={`w-full ${
                      descError ? "text-red-500" : "text-muted-foreground"
                    }`}
                  />
                  <p
                    className={`${
                      descError ? "text-red-500" : "text-muted-foreground"
                    } text-end text-xs`}
                  >
                    {desc.length}/200
                  </p>
                </Label>
                <Label className="flex flex-col gap-2">
                  <h2 className="mb-2">Ảnh bìa nhóm:</h2>
                </Label>
                {/*Ảnh/ video vừa thêm vào (nếu có)*/}
                {filePreview ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative w-full bg-gray-100 flex justify-center rounded-md mb-2"
                  >
                    <img
                      src={filePreview}
                      alt="Preview"
                      className="max-h-[300px] rounded-md "
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                      onClick={() => {
                        setFilePreview(null);
                        setSelectedFile(null);
                      }}
                    >
                      <XIcon className="h-5 w-5 text-gray-500" />
                    </Button>
                  </motion.div>
                ) : (
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2 mb-2"
                    onClick={() => {
                      fileInputRef.current.click();
                    }}
                  >
                    <ImageIcon className="h-5 w-5 text-green-500" />
                    <span>Ảnh/Video</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden input-new-file"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                    />
                  </Button>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <Label>Chế độ riêng tư</Label>
                  <Switch checked={privacy} onCheckedChange={setPrivacy} />
                </div>
              </div>
            </DialogDescription>
          </ScrollArea>
        </DialogHeader>
        <DialogFooter className="flex-row items-center justify-end border-t p-2">
          <DialogClose asChild>
            <Button variant="outline" className="hover:bg-gray-300">
              <ChevronLeftIcon />
              Hủy
            </Button>
          </DialogClose>
          <Button
            className="flex gap-2 bg-blue-500 text-white hover:bg-blue-800"
            onClick={handleEditGroup}
            disabled={loading}
            type="button"
          >
            <PenLine />
            {loading ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditGroupDialog;
