'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/* ====== DATA ====== */
export const sidebarLinks = [
  {
    imgURL: '/icons/Home.svg',
    route: '/video-conferencing',
    label: 'Tổng quan',
  },
  {
    imgURL: '/icons/upcoming.svg',
    route: '/video-conferencing/upcoming',
    label: 'Sắp tới',
  },
  {
    imgURL: '/icons/previous.svg',
    route: '/video-conferencing/previous',
    label: 'Trước đây',
  },
  {
    imgURL: '/icons/Video.svg',
    route: '/video-conferencing/recordings',
    label: 'Bản ghi',
  },
  {
    imgURL: '/icons/add-personal.svg',
    route: '/video-conferencing/personal-room',
    label: 'Phòng cá nhân',
  },
];

const SidebarMeet = () => {
  const pathname = usePathname();

  return (
    <section className="sticky left-0 top-0 flex h-screen w-fit flex-col bg-[#f0fcff] p-6 pt-28  max-sm:hidden lg:w-[264px]">
      <div className="flex flex-1 flex-col gap-6">
        {sidebarLinks.map((item) => {
          const isHome = item.route === '/video-conferencing';

          const isActive = isHome
            ? pathname === item.route
            : pathname.startsWith(item.route);

          return (
<Link
  href={item.route}
  key={item.label}
  className={`flex items-center gap-4 rounded-xl p-4 transition-colors ${
    isActive
      ? 'bg-[#e3f6ff] text-[#1573ee] font-bold'
      : 'text-gray-700 hover:bg-gray-100 font-semibold'
  }`}
>
  <Image
    src={item.imgURL}
    alt={item.label}
    width={24}
    height={24}
    className="transition"
    style={{
      filter: isActive
        ? 'brightness(0) saturate(100%) invert(32%) sepia(83%) saturate(2100%) hue-rotate(200deg)'
        : 'brightness(0)',
    }}
  />
  <p className="text-lg max-lg:hidden">
    {item.label}
  </p>
</Link>


          );
        })}
      </div>
    </section>
  );
};

export default SidebarMeet;
