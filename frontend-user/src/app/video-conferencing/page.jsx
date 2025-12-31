"use client";

import userStore from "@/store/userStore";
import MeetingTypeList from "../components/meeting/MeetingTypeList";


const Home = () => {
        // const user = userStore((state) => state.user);
    // console.log("User in Home page:", user);

  const now = new Date();
  const time = now.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const date = new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'full',
  }).format(now);

  return (
    <section className="flex size-full flex-col gap-5 text-white">
      <div className="h-[303px] w-full rounded-[20px] bg-[url('/images/hero-background.png')] bg-cover bg-center">
        <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11">
         
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-extrabold lg:text-7xl">
              {time}
            </h1>
            <p className="text-lg font-medium text-[#ECF0FF] lg:text-2xl">
              {date}
            </p>
          </div>
        </div>
      </div>

      <MeetingTypeList />
    </section>
  );
};

export default Home;
