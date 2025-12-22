"use client";
import { Button } from "@/components/ui/button";
import { usePostStore } from "@/store/usePostStore";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import StoryCard from "./StoryCard";


const StorySection = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const containerRef = useRef();
  const {stories, fetchStories, handleReactStory, handleDeleteStory} = usePostStore()
  useEffect(()=>{
    fetchStories()  //tải các story
  },[fetchStories])
 
  // các hàm hỗ trợ lướt ngang cho các story
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const updateMaxScroll = () => {
        setMaxScroll(container.scrollWidth - container.offsetWidth);
        setScrollPosition(container.scrollLeft);
      };
      updateMaxScroll();
      window.addEventListener("resize", updateMaxScroll);
      return () => window.removeEventListener("resize", updateMaxScroll);
    }
  }, [stories]);
  const scroll = (direction) => {
    const container = containerRef.current;
    if (container) {
      const scrollAmount = direction === "left" ? -200 : 200;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };
  const handleScroll = () => {
    const container = containerRef.current;
    if (container) {
      setScrollPosition(container.scrollLeft);
    }
  };

  return (
    <div className='relative'>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className='flex space-x-2 overflow-x-hidden py-4 md:py-0'
        style={{scrollbarWidth: "none", msOverflowStyle: "none"}}
      >
       <motion.div
          className=" flex space-x-2"
          drag="x"
          dragConstraints={{
            right: 0,
            left:
              -((stories.length + 1) * 200) +
              containerRef.current?.offsetWidth,
          }}
        >
          <StoryCard isAddStory={true}/>  {/*Card Thêm tin */}
           {/*Danh sách các story*/}
          {stories?.map((story) => (
            <StoryCard story={story} key={story._id} 
            onReact={async(reactType) => {
              await handleReactStory(story?._id, reactType) 
              await fetchStories()// tải lại danh sách
            }}
            onDelete={async()=>{
              await handleDeleteStory(story?._id)
              await fetchStories()
            }} />
          ))}
        </motion.div>
        {/*Nút scroll trái  */}
        {scrollPosition > 0 && (
          <Button
            size="icon"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white 
            rounded-full shadow-lg transition-opacity duration-300 ease-in-out border border-[#000]/50 hover:bg-gray-200"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}

        {/*Nút scroll phải */}

        {scrollPosition < maxScroll && (
          <Button
            size="icon"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white
            rounded-full shadow-lg transition-opacity duration-300 ease-in-out border border-[#000]/50 hover:bg-gray-200"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );

}
export default StorySection;
