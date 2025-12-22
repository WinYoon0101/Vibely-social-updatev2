"use client";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { AnimatePresence, motion } from 'framer-motion'
import { Clock, MessageCircle, ThumbsUp, X} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { PiShareFatBold } from "react-icons/pi"
import { FaXTwitter } from "react-icons/fa6";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { AiOutlineCopy } from "react-icons/ai";
import { QRCodeCanvas } from "qrcode.react";
import VideoComments from './VideoComments'
import { formatedDate } from '@/lib/utils'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import userStore from '@/store/userStore'
// code tương tự như post (khác cách hiển thị 1 xíu)
const VideoCard = ({post, onReact, onComment, onShare, onDelete, onEdit}) => {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [showReactionChooser, setShowReactionChooser] = useState(false)
  const [isChoosing, setIsChoosing] = useState(false)
  const totalReact = post?.reactionStats?.like+post?.reactionStats?.love+post?.reactionStats?.haha+post?.reactionStats?.wow+post?.reactionStats?.sad+post?.reactionStats?.angry
  const totalComment =
  (post.comments?.length || 0) +
  post.comments.reduce((total, cmt) => total + (cmt.replies?.length || 0), 0);
  const commentInputRef = useRef(null)
  const router= useRouter()

const {user} = userStore()
const [reaction,setReaction] = useState(null) 

  const userPostPlaceholder = post?.user?.username?.split(" ").map((name) => name[0]).join(""); // tên người đăng bài viết tắt

  //Các biến và hàm cho Lấy top cảm xúc
  const [topReactions, setTopReactions] = useState([]);
  const [reactionUserGroups, setReactionUserGroups] = useState({}); // Lưu danh sách user theo từng reaction
  const [currentReactionDetail, setCurrentReaction] = useState("like");
  useEffect(() => {
    setReaction(post?.reactions?.find(react=>react?.user?._id == user?._id)?post?.reactions?.find(react=>react?.user?._id == user?._id).type:null)
    //đảm bảo object hợp lệ
      if (!post?.reactionStats || typeof post?.reactionStats !== "object") {
      setTopReactions([]);
      setReactionUserGroups({});
      return;
  }
  const reactionGroups = post.reactions.reduce((acc, react) => {
    if (!acc[react.type]) {
        acc[react.type] = [];
    }
    acc[react.type].push(react.user);
    return acc;
}, {});
    // cập nhật danh sách top reactions
    const sortedReactions = Object.entries(reactionGroups)
        .sort((a, b) => b[1].length - a[1].length) // Sắp xếp theo số lượng user
        .slice(0, 3); // Lấy top 3 reactions
        setTopReactions(sortedReactions.map(([reaction]) => reaction));
        setReactionUserGroups(reactionGroups);
}, [post?.reactionStats]); // Chạy lại khi reactionStats thay đổi

  const handleUserProfile = ()  => {
    router.push(`/user-profile/${post?.user?._id}`)
  }
  //Các biến và hàm cho Chia Sẻ Bài Viết
  const generateSharedLink = () => {
    return `http://localhost:3000/posts/${post?._id}`; //sau khi deploy thì đổi lại + tạo trang bài viết đi!!!!
  };
  const handleShare = (platform) => {
    const url = generateSharedLink();
    let shareUrl;
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "x":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}`;
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        setIsShareDialogOpen(false);
        onShare()
        return;
      default:
        return;
    }
    window.open(shareUrl, "_blank");
    onShare()
    setIsShareDialogOpen(false);
  };

  const handleReaction = (reaction) => {
    setIsChoosing(false)  //đã chọn được 'cảm xúc'
    onReact(reaction);
    setShowReactionChooser(false); // Ẩn thanh reaction sau khi chọn
  };

  const [reactDetailOpen, setReactDetailOpen] = useState(false)
  const handleReactionDetail =()=>{
    setReactDetailOpen(true);
  }
  const InteractInfo = ({className}) =>{  //dòng thể hiện các thông tin như số lượt react, số lượt cmt, số lượt chia sẻ
    return(
      <div className={`flex ml-2 text-gray-500 ${className}`}>
            <Button
              variant="ghost"
              size="sm"
              className="font-normal text-[14px] hover:underline px-2"
              onClick={()=>{handleReactionDetail()}}>
              {
               topReactions.map((reaction)=>(
                <Image src={`/${reaction}.png`} alt={`${reaction}`}  width={18} height={18} key={reaction}/>
                ))
              }
              &nbsp;
              {
              totalReact > 0 && (
              totalReact>1000000?totalReact/1000000+"M":  //Nếu tổng lượt react >1tr thì hiển thị kiểu 1M, 2M,...
              totalReact>1000?totalReact/1000+"k":totalReact  //Nếu tổng lượt react >1000 thì hiển thị kiểu 1k, 2k,...
              )}
            </Button>   
            <div className='flex'>
            <Button
              variant="ghost"
              size="sm"
              className="font-normal text-[14px] hover:underline px-2"
              onClick={() => setShowComments(!showComments)}
            >
              {
              totalComment > 0 && (  
                totalComment>1000000?totalComment/1000000+" triệu":  //Nếu tổng lượt react >1tr thì hiển thị kiểu 1 triệu, 2 triệu,...
                totalComment>1000?totalComment/1000+" ngàn":totalComment  //Nếu tổng lượt react >1000 thì hiển thị kiểu 1 ngàn, 2 ngàn,...
              +" bình luận")}
             </Button>
             <Button
              variant="ghost"
              size="sm"
              className="font-normal text-[14px] hover:underline px-2"
            >
              {
              post?.shareCount > 0 && (  
                post?.shareCount>1000000?post?.shareCount/1000000+" triệu":  //Nếu tổng lượt react >1tr thì hiển thị kiểu 1 triệu, 2 triệu,...
                post?.shareCount>1000?post?.shareCount/1000+" ngàn":post?.shareCount  //Nếu tổng lượt react >1000 thì hiển thị kiểu 1 ngàn, 2 ngàn,...
              +" lượt chia sẻ")}
            </Button>
          </div>  
          </div>
)}

  const ReactionChosser = () =>{  //bảng chọn reaction
    return(
      <div className={"absolute bottom-10 bg-white flex shadow gap-1 transition-all opacity-100 scale-100 translate-y-0 rounded-2xl"}
            onMouseEnter={()=>setIsChoosing(true)}  //đang chọn
            onMouseLeave={() =>setTimeout(() => setIsChoosing(false), 500)}
            >
            <motion.button whileHover={{ scale: 2 }}  //phóng to biểu tượng lên
            className="px-2 py-2" onClick={()=>{
              handleReaction('like')
            }}>
              <Image src={"/like.gif"} alt="like" width={30} height={30} unoptimized/>
            </motion.button>
            <motion.button whileHover={{ scale: 2 }}
            className="px-2 py-2" onClick={()=>{
              handleReaction('love')
            }}>
            <Image src={"/love.gif"} alt="love"  width={30} height={30} unoptimized/>
            </motion.button>
            <motion.button whileHover={{ scale: 2 }}
            className="px-2 py-2" onClick={()=>{
              handleReaction('haha')
            }}>
            <Image src={"/haha.gif"} alt="haha"  width={30} height={30} unoptimized/>
            </motion.button>
            <motion.button whileHover={{ scale: 2 }}
            className="px-2 py-2" onClick={()=>{
              handleReaction('wow')
            }}>
              <Image src={"/wow.gif"} alt="wow"  width={30} height={30} unoptimized/>
            </motion.button>
            <motion.button whileHover={{ scale: 2 }}
            className="px-2 py-2" onClick={()=>{
              handleReaction('sad')
            }}>
            <Image src={"/sad.gif"} alt="sad"  width={30} height={30} unoptimized/>
            </motion.button>
            <motion.button whileHover={{ scale: 2 }}
            className="px-2 py-2" onClick={()=>{
              handleReaction('angry')
            }}>
            <Image src={"/angry.gif"} alt="angry"  width={30} height={30} unoptimized/>
            </motion.button>
      </div>
    )
  }
  const ReactionDetail = () => {  //bảng chi tiết những người dùng đã react, phân loại theo cảm xúc
    return(
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
          <div className="bg-white p-6 h-96 rounded-lg shadow-lg flex flex-col">
            <div className='flex items-center justify-between gap-40 pb-5'>
              <div className='flex gap-10 h-10 justify-center items-center'>
              <motion.button whileHover={{ scale: 1.2 }}  //phóng to biểu tượng lên
            className={`px-2 py-2 ${currentReactionDetail==="like"?"border-b-2 border-[#086280]":""} `} 
            onClick={()=>{
              setCurrentReaction("like")
            }}>
              <Image src={"/like.png"} alt="like" width={30} height={30} unoptimized/>
            </motion.button>
            <motion.button whileHover={{ scale: 1.2 }} 
            className={`px-2 py-2 ${currentReactionDetail==="love"?"border-b-2 border-[#086280]":""} `} 
            onClick={()=>{
              setCurrentReaction("love")
            }}>
            <Image src={"/love.png"} alt="love"  width={30} height={30} unoptimized/>
            </motion.button>
            <motion.button whileHover={{ scale: 1.2 }}
            className={`px-2 py-2 ${currentReactionDetail==="haha"?"border-b-2 border-[#086280]":""} `} 
            onClick={()=>{
              setCurrentReaction("haha")
            }}>
            <Image src={"/haha.png"} alt="haha"  width={30} height={30} unoptimized/>
            </motion.button>
            <motion.button whileHover={{ scale: 1.2 }}
            className={`px-2 py-2 ${currentReactionDetail==="wow"?"border-b-2 border-[#086280]":""} `}  
            onClick={()=>{
              setCurrentReaction("wow")
            }}>
              <Image src={"/wow.png"} alt="wow"  width={30} height={30} unoptimized/>
            </motion.button>
            <motion.button whileHover={{ scale: 1.2 }}
            className={`px-2 py-2 ${currentReactionDetail==="sad"?"border-b-2 border-[#086280]":""} `} 
             onClick={()=>{
              setCurrentReaction("sad")
            }}>
            <Image src={"/sad.png"} alt="sad"  width={30} height={30} unoptimized/>
            </motion.button>
            <motion.button whileHover={{ scale: 1.2 }}
            className={`px-2 py-2 ${currentReactionDetail==="angry"?"border-b-2 border-[#086280]":""} `} 
            onClick={()=>{
              setCurrentReaction("angry")
            }}>
            <Image src={"/angry.png"} alt="angry"  width={30} height={30} unoptimized/>
            </motion.button>
              </div>
              <Button variant="ghost" className="hover:bg-gray-200" onClick={()=>{
                setReactDetailOpen(false)
                setCurrentReaction("like")
                }}>
              <X style={{ width: "20px", height: "20px" }}/>
              </Button>
            </div>
              {reactionUserGroups?.[currentReactionDetail]?.map((user,index)=>{
                return(
                  <div key={index} className="flex items-center space-x-2 cursor-pointer mb-2 " onClick={() => router.push(`/user-profile/${user?._id}`)}>
            <Avatar className="h-10 w-10 ml-2">
              {user?.profilePicture ? (
                <AvatarImage
                  src={user?.profilePicture}
                  alt={user?.username}
                />
              ) : (
                <AvatarFallback>
                  {user?.username?.split(" ").map((name) => name[0]).join("")}
                </AvatarFallback>
              )}
            </Avatar>
            <p className="text-sm font-medium leading-none">{user?.username}</p>
          </div>
)})}
      </div>
    </div>
    )
  }
  const InteractButton = () =>{ // các nút react, cmt, share
    return(
      <div className="flex">
            <Button
              onMouseEnter={()=>setShowReactionChooser(true)} //mở bảng để mukbang cảm xúc :))
              onMouseLeave={() =>setTimeout(() => setShowReactionChooser(false), 500)}
              variant="ghost"
              className={`flex-1 hover:bg-gray-100 text-gray-500 hover:text-gray-500 text-[15px] h-8 
                ${reaction=="like"?'text-blue-600'
                  :reaction=="love"?"text-red-600"
                  :reaction=="haha"||reaction=="sad"||reaction=="wow"?"text-yellow-400"
                  :reaction=="angry"?"text-orange-500":""}
              `}
            >
              {reaction=="like"? <Image src={"/like.png"} alt="haha"  width={24} height={24}/> 
              :reaction=="love"? <Image src={"/love.png"} alt="haha"  width={24} height={24}/> 
              :reaction=="haha"? <Image src={"/haha.png"} alt="haha"  width={24} height={24}/> 
              :reaction=="wow"? <Image src={"/wow.png"} alt="haha"  width={24} height={24}/> 
              :reaction=="sad"? <Image src={"/sad.png"} alt="haha"  width={24} height={24}/> 
              :reaction=="angry"? <Image src={"/angry.png"} alt="haha"  width={24} height={24}/> 
              : <ThumbsUp style={{ width: "20px", height: "20px" }} /> }
              {reaction=="love"?"Yêu thích"
              :reaction=="haha"?"Haha"
              :reaction=="wow"?"Wow"
              :reaction=="sad"?"Buồn"
              :reaction=="angry"?"Phẫn nộ"
              :"Thích"}
            </Button>
            {(showReactionChooser||isChoosing) && ( //nếu đang để chuột ở nút mở bảng chọn hoặc trong bảng chọn thì bảng chọn sẽ luôn hiện tránh tình trạng chưa chọn xong đã bị ẩn
            <ReactionChosser />
            )}
            <Button
              variant="ghost"
              className={`flex-1 hover:bg-gray-100 text-gray-500 hover:text-gray-500 text-[15px] h-8 px-2`}
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle style={{ width: "20px", height: "20px" }} /> Bình luận
            </Button>
            <Dialog
              open={isShareDialogOpen}
              onOpenChange={setIsShareDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex-1 hover:bg-gray-100 text-gray-500 hover:text-gray-500 text-[15px] h-8 px-2"
                >
                  <PiShareFatBold style={{ width: "20px", height: "20px" }} /> Chia sẻ
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Chia sẻ bài viết này</DialogTitle>
                  <DialogDescription>
                    Chọn cách bạn muốn chia sẻ bài viết này
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-around my-[10px]">
                  <Button
                    className="hover:bg-gray-200 flex-col justify-between"
                    variant="ghost"
                    size="bigIcon"
                    onClick={() => handleShare("facebook")}
                  >
                    <FaFacebook style={{ width: "40px", height: "40px",color: "#1877F2" }} />
                    Facebook
                  </Button>
                  <Button 
                    className="hover:bg-gray-200 flex-col justify-between"
                    variant="ghost"
                    size="bigIcon"
                    onClick={() => handleShare("x")}
                  >
                    <FaXTwitter style={{ width: "40px", height: "40px",color: "#000000" }} />
                    X
                  </Button>
                  <Button 
                    className="hover:bg-gray-200 flex-col justify-between"
                    variant="ghost"
                    size="bigIcon"
                    onClick={() => handleShare("linkedin")}
                  >
                    <FaLinkedin  style={{ width: "40px", height: "40px",color: "#0088CC" }}/>
                    LinkedIn
                  </Button>
                  <Button 
                    className="hover:bg-gray-200 flex-col justify-between"
                    variant="ghost"
                    size="bigIcon"
                    onClick={() => handleShare("copy")}
                  >
                    <AiOutlineCopy style={{ width: "40px", height: "40px",color: "#000000" }} />
                    Sao chép liên kết
                  </Button>
                </div>
                <div>
                  <div className='flex justify-center items-center'>

                    <QRCodeCanvas value={generateSharedLink()} size={200} />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>   
    )
  }
  return (
    <motion.div
      key={post?._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden mb-4 border border-gray-200"
    >
      <div>
        <div className="flex items-center justify-between my-3 px-3 ">
          <div className="flex items-center gap-2">
            <Avatar>
              {post?.user?.profilePicture ? (
                <AvatarImage
                  src={post?.user?.profilePicture}
                  alt={post?.user?.username}
                />
              ) : (
                <AvatarFallback>{userPostPlaceholder}</AvatarFallback>
              )}
            </Avatar>
            <div>
              <p className="font-semibold hover:cursor-pointer" onClick={handleUserProfile}>{post?.user?.username}</p>
            </div>
          </div>
          <div className="flex items-center text-gray-500">
            <Clock className="h-3 w-3 mr-1" />
            <span className="text-xs">{formatedDate(post?.createdAt)}</span>
          </div>
        </div>
        <div className="relative aspect-video bg-black mb-2">
          {post?.mediaUrl && (
            <video controls className="w-full h-[500px] rounded-lg mb-4">
              <source src={post?.mediaUrl} type="video/mp4" />
              Trình duyệt của bạn không hỗ trợ thẻ video
            </video>
          )}
        </div>
          {/*Bảng hiện danh sách các người dùng đã bày tỏ cảm xúc*/}
           {reactDetailOpen && currentReactionDetail && (
            <ReactionDetail />
          )}
          <div className="md:flex justify-between px-2 mb-2 items-center relative">
            <InteractInfo className={"md:hidden justify-between"} />
            <InteractButton />
            <InteractInfo className="hidden md:inline-flex"/>
          </div>
          <Separator className="border-b border-gray-300"/>
          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <VideoComments
                  post={post}
                  onComment={onComment}
                  commentInputRef={commentInputRef}
                />
              </motion.div>
            )}
          </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default VideoCard
