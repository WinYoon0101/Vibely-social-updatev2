'use client'
import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import ChartSection from '../../components/dashboard/ChartSection';
import Image from 'next/image';
import { getTotalUsers, getTotalPosts, getTotalDocuments, getTotalQuestions, getDashboardStats } from '@/service/dashboardAdmin.service';
import './dashboard.css';

const Dashboard = () => {
    const [userStats, setUserStats] = useState([]);
    const [postStats, setPostStats] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalDocuments, setTotalDocuments] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [timeRange, setTimeRange] = useState("day");


    useEffect(() => {
        fetchData(timeRange);
    }, [timeRange]);

    const fetchData = async (range) => {
        try {
            const users = await getTotalUsers();
            const posts = await getTotalPosts();
            const documents = await getTotalDocuments();
            const questions = await getTotalQuestions();
            const stats = await getDashboardStats(range);

            setTotalUsers(users);
            setTotalPosts(posts);
            setTotalDocuments(documents);
            setTotalQuestions(questions);

            if (!stats || !stats.usersStats || !stats.postsStats) {
                console.error("Lỗi: ", stats);
                return;
            }

            const formattedUserData = stats.usersStats.map(item => ({
                date: item._id.month ? `${item._id.year}-${item._id.month}` : item._id.date,
                count: item.count
            }));

            const formattedPostData = stats.postsStats.map(item => ({
                date: item._id.month ? `${item._id.year}-${item._id.month}` : item._id.date,
                count: item.count
            }));

            setUserStats(formattedUserData);
            setPostStats(formattedPostData);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu:", error);
        }
    };

    const handleTimeRangeChange = (event) => {
        setTimeRange(event.target.value);
    };

    return (
        <div className="flex w-full flex-row min-h-screen bg-[#F4F7FE]">
            <Sidebar />
            <div className="w-full md:w-4/5 md:ml-52 py-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-6 px-6">
                    <h1 className="text-2xl font-semibold text-[#333]">Dashboard</h1>
                    <div className="flex items-center space-x-4">

                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 px-6">
                    <DashboardCard title="Tổng số người dùng" count={totalUsers} imageSrc="/images/dashboard/users.png" />
                    <DashboardCard title="Tổng số bài viết" count={totalPosts} imageSrc="/images/dashboard/posts.png" />
                    <DashboardCard title="Tổng số tài liệu" count={totalDocuments} imageSrc="/images/dashboard/documents.png" />
                    <DashboardCard title="Tổng số thắc mắc" count={totalQuestions} imageSrc="/images/dashboard/questions.png" />
                </div>
                <div className="px-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-[#333]">Biểu đồ thống kê</h2>
                        <select
                            value={timeRange}
                            onChange={handleTimeRangeChange}
                            className="p-2 border border-gray-300 rounded"
                        >
                            <option value="day">Ngày</option>
                            <option value="month">Tháng</option>
                            <option value="year">Năm</option>
                        </select>
                    </div>
                    {userStats.length > 0 && postStats.length > 0 ? (
                        <ChartSection userStats={userStats} postStats={postStats} />
                    ) : (
                        <p className="text-gray-500">Đang tải dữ liệu...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const DashboardCard = ({ title, count, imageSrc }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center">
            <Image src={imageSrc} alt={title} width={50} height={50} />
            <div className="ml-3">
                <p className="text-gray-500 text-sm">{title}</p>
                <h2 className="text-2xl font-bold text-[#2B3674]">{count}</h2>
            </div>
        </div>
    </div>
);

export default Dashboard;