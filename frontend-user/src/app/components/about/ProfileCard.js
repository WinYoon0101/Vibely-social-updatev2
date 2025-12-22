import Image from "next/image";
import Link from "next/link";

const ICON_SOCIALS = [
    "/icons/facebook.svg",
    "/icons/instagram.svg",
    "/icons/telegram.svg"
];

 
const ProfileCard = (props) => {
  return (
    <div className="relative w-[300px] h-[130px] bg-white rounded-2xl shadow-custom duration-300 hover:h-[230px] group">
      <div className="absolute left-1/2 -top-[50px] -translate-x-1/2 shadow-custom rounded-2xl">
        <Image
          className="rounded-2xl group-hover:w-[180px]  transition-all duration-300"
          src={props.img}
          width={110}
          height={110}
          alt={`${props.name}'s profile`}
          sizes="(max-width: 300px) 120px, (min-width: 300px) 1800px"
        />
      </div>

      <div className="text-center flex justify-center items-center">
        <div className="translate-y-[30px] group-hover:translate-y-[50px] md:translate-y-[50px] md:group-hover:translate-y-[80px] lg:translate-y-[70px] lg:group-hover:translate-y-[100px] transition-all duration-300">
          <p className="text-xl p-2">{props.name}</p>
          
          {/* Chỉ hiện khi hover */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">

            <p className="text-base text-gray-400 pb-2">{props.role}</p>
            
            <div className="flex items-center justify-center space-x-3">
              {ICON_SOCIALS.map((icon, key) => (
                <Link key={key} href="/" >
                  <Image src={icon} width={24} height={24} alt="Social icon" />
                </Link>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;