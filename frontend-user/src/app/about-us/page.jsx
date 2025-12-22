"use client"
import Line from "@/app/components/about/LineInAbout";
import ProfileCard from '@/app/components/about/ProfileCard';
import ScrollRevealEffect from '@/app/components/about/ScrollRevealEff';
import Heading from "@/app/components/contact/Heading";
import Image from "next/image";
import data from './datasource.json';
import LeftSideBar from "../components/LeftSideBar";

const { WHY_CHOOSE, ABOUT, TEAM } = data;

const About = () => {
    return (
        <div className="container mx-auto px-4">
            <div className="md:hidden">
                <LeftSideBar />
            </div>
            <ScrollRevealEffect />

            {/* banner */}
            <div className="my-10 pt-10">
                <Heading title="Về chúng tôi" />
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between mb-2 md:mb-10 w-full">
                <div className="w-1/2 lg:ml-20 lg:pr-10 flex items-center justify-end">
                    <Image
                        src={WHY_CHOOSE.picture}
                        alt="Về chúng tôi"
                        width={550}
                        height={400}
                        className="filter contrast-125 saturate-150 brightness-75"
                    />
                </div>

                <div className="md:w-1/2 pr-2 lg:pr-20 pl-2 lg:pl-10">
                    <p className="text-2xl font-bold my-3">
                        {WHY_CHOOSE.title}
                    </p>
                    <p className="text-base text-gray-400">{WHY_CHOOSE.desc}</p>
                    <ul>
                        {WHY_CHOOSE.reason.map((row, key) => (
                            <li
                                key={key}
                                className="my-4 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg rounded-lg p-4 overflow-hidden"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="pl-5">
                                        <Image
                                            src={row.img}
                                            height={30}
                                            width={30}
                                            alt=''
                                        />
                                    </div>

                                    <span className="text-xl font-medium">
                                        {row.label}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* about us */}
            <div className="flex items-start justify-center lg:px-4 lg:mx-20">
                <div className="flex-1 mx-1 lg:mx-5">
                    <div className="lg:px-5 md:mb-10 lg:mb-16 left-element">
                        <p className="text-xl lg:text-2xl font-bold py-5">
                            {ABOUT.text[0].title}
                        </p>
                        <p className="pl-3 leading-6 text-base">
                            {ABOUT.text[0].desc}
                        </p>
                    </div>

                    <div className="lg:px-5 my-8 md:my-14 lg:my-16 left-element">
                        <Image
                            src={ABOUT.img[1]}
                            alt="Nội dung chất lượng"
                            width={400}
                            height={200}
                            className="rounded-xl"
                        />
                    </div>

                    <div className="lg:px-5 left-element">
                        <p className="text-xl lg:text-2xl font-bold py-5">
                            {ABOUT.text[2].title}
                        </p>
                        <p className="pl-3 leading-6 text-base">
                            {ABOUT.text[2].desc}
                        </p>
                    </div>
                </div>

                <Line />

                <div className="flex-1 ml-10 lg:ml-20">
                    <div className="mt-36 md:mt-8 lg:mt-0 lg:px-10 mb-16 md:mb-10 right-element">
                        <Image
                            src={ABOUT.img[0]}
                            alt="Cộng đồng năng động"
                            height={200}
                            width={400}
                            className="rounded-xl"
                        />
                    </div>

                    <div className="px-5 lg:px-10 my-16 md:my-8 right-element text-right">
                        <p className="text-xl lg:text-2xl font-bold py-5">
                            {ABOUT.text[1].title}
                        </p>
                        <p className="pr-3 text-base">{ABOUT.text[1].desc}</p>
                    </div>

                    <div className="lg:px-10 mt-16 right-element">
                        <Image
                            src={ABOUT.img[2]}
                            alt="Cá nhân hóa trải nghiệm"
                            height={200}
                            width={400}
                            className="rounded-xl"
                        />
                    </div>
                </div>
            </div>

            {/* Team  */}
            <div className="my-10">
                <Heading title="Team & Founder" />
            </div>

            <div className="container mx-auto mt-24 mb-10">
                <div className="grid grid-cols-4">
                    {TEAM.map((row, key) => (
                        <div key={key} className="flex items-center justify-center">
                            <ProfileCard
                                img={row.img}
                                name={row.name}
                                role={row.role}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default About;