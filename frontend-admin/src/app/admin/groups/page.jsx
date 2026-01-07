"use client";
import Sidebar from "@/app/components/sidebar/Sidebar";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { deleteGroup, getAllGroups } from "@/service/group.service";
import { Files, KeySquare, Users } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaSearch } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

function DeleteGroup({ handleDelete }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="px-2 py-1 text-sm md:text-base cursor-pointer hover:bg-red-700 text-white bg-red-500 rounded-[25px] overflow-hidden">
          <MdDelete className="w-10 h-10" />
          Xóa nhóm
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-lg md:text-2xl">
            Xóa nhóm
          </DialogTitle>
          <DialogDescription className="mt-4 text-center text-sm md:text-base">
            Nhóm bị xóa sẽ không thể khôi phục lại được. Xóa nhóm cũng đồng
            nghĩa xóa toàn bộ bài viết trong nhóm. Bạn có chắc chắn muốn tiếp
            tục xóa?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-4 items-center justify-end">
          <Button
            className={"bg-red-500 hover:bg-red-700 cursor-pointer text-white"}
            onClick={() => {
              handleDelete();
              setOpen(false);
            }}
          >
            Xóa nhóm
          </Button>
          <DialogClose asChild>
            <Button className={"bg-gray-100 hover:bg-gray-300 cursor-pointer"}>
              Hủy
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const GroupCard = ({ group, handleDelete }) => {
  const PRIVACY_CLASS = {
    public: {
      border: "border-green-500",
      bg: "bg-green-500/20",
      text: "text-green-500",
    },
    private: {
      border: "border-violet-500",
      bg: "bg-violet-500/20",
      text: "text-violet-500",
    },
  };
  return (
    <div className="col-span-1 flex bg-white rounded-lg my-2 relative drop-shadow-lg mx-3 md:mx-6 p-4 gap-6">
      <div className="flex items-center space-x-3 mb-3">
        <img
          src={group?.coverPhotoUrl || ""}
          alt="Group Cover"
          className="w-[250px] h-[250px] rounded-lg object-cover"
        />
      </div>
      <div className="flex flex-col space-y-2 flex-1 p-2">
        <h1 className="text-lg font-semibold text-blue-700">{group?.name}</h1>
        <span
          className={`self-start inline-flex px-2 py-1 rounded-lg text-sm border ${
            PRIVACY_CLASS[group.privacySetting].border
          } ${PRIVACY_CLASS[group.privacySetting].bg} ${
            PRIVACY_CLASS[group.privacySetting].text
          }`}
        >
          {group.privacySetting === "public"
            ? "Nhóm công khai"
            : "Nhóm riêng tư"}
        </span>
        <p className="text-sm italic">        
          {group?.description}
        </p>
        <div className="flex items-center gap-4">
        <Button className="shadow-none flex gap-2 items-center justify-center" title="Số lượng thành viên">
          <Users />
          <p>{group?.members?.length || 0}</p>
        </Button>
        <Button className="shadow-none flex gap-2 items-center justify-center" title="Số lượng bài viết">
          <Files />
          <p>{group?.posts?.length || 0}</p>
        </Button>
        <Button className="shadow-none flex gap-2 items-center justify-center" title="Người thành lập nhóm">
          <KeySquare />
          <p>{group?.createdBy?.username}</p>
        </Button>
        </div>
        <div className="flex justify-end items-end flex-1">
          <DeleteGroup handleDelete={() => handleDelete(group?._id)} />
        </div>
      </div>
    </div>
  );
};

const GroupsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGroups, setFilterGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [groupList, setGroupList] = useState([]);
  const [privacy, setPrivacy] = useState("all");
  const handleSearch = () => {
    const keyword = searchQuery?.toLowerCase?.() || "";

    const filterGroup = groupList.filter((g) => {
      if (privacy !== "all" && g.privacySetting !== privacy) {
        return false;
      }
      if (!keyword) return true;
      return (
        g?._id?.toString() === searchQuery ||
        g?.name?.toLowerCase().includes(keyword) ||
        g?.description?.toLowerCase().includes(keyword) ||
        g?.createdBy?.username?.toLowerCase().includes(keyword)
      );
    });
    if (keyword && filterGroup.length < 1) {
      toast.error("Không tìm thấy kết quả");
    }
    setFilterGroups(filterGroup);
  };

  useEffect(() => {
    handleSearch();
  }, [privacy, searchQuery]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const result = await getAllGroups();
      setGroupList(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchGroups();
  }, []);

  const handleDelete = async (groupId) => {
    await deleteGroup(groupId);
    await fetchGroups();
    toast.success("Xóa nhóm thành công.");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  return (
    <div className="flex flex-row w-full min-h-screen bg-[#F4F7FE]">
      <Sidebar />
      <div className="flex w-full flex-col py-6 md:ml-52 overflow-y-auto">
        <div className="flex justify-between items-center mb-6 px-6">
          <h1 className="text-2xl font-semibold text-[#333]">Quản lý nhóm</h1>
        </div>
        <div className="flex h-[10px] items-center mb-10 py-3 px-3 md:px-6 justify-between">
          <div className="flex w-3/5 items-center gap-2 justify-start">
            <Input
              type="text"
              placeholder="Tìm kiếm"
              className="w-xl border px-4 py-2 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 border-gray-300 italic"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              className="w-14 md:w-24 h-10 cursor-pointer md:ml-2 px-6 py-2 bg-[#086280] text-white rounded-lg hover:bg-gray-700 transition duration-200"
              onClick={() => {
                handleSearch();
              }}
            >
              <FaSearch className="w-6 h-6" />
              Tìm
            </Button>
          </div>
          <div className="flex w-1/5 md:w-2/5 items-center justify-end md:gap-2 relative">
            Trạng thái nhóm:
            <RadioGroup
              value={privacy}
              onValueChange={setPrivacy}
              className="flex items-center gap-4"
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value="all" id="r1" />
                <Label htmlFor="r1">Tất cả</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="public" id="r2" />
                <Label htmlFor="r2">Công khai</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="private" id="r3" />
                <Label htmlFor="r3">Riêng tư</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2">
          {groupList && filterGroups.length > 0
            ? filterGroups.map((group) => {
                return (
                  <GroupCard
                    key={group?._id}
                    group={group}
                    handleDelete={handleDelete}
                  />
                );
              })
            : groupList.map((group) => {
                return (
                  <GroupCard
                    key={group?._id}
                    group={group}
                    handleDelete={handleDelete}
                  />
                );
              })}
        </div>
      </div>
    </div>
  );
};

export default GroupsPage;
