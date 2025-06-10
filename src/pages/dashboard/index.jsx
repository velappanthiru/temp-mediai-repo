import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import MainLayout from '@/layout-component/main-layout';
import { getMenusBasedRoleId } from '@/utils/commonapi';
import { LuBookUp } from "react-icons/lu";
import { PiExam, PiUsers } from "react-icons/pi";
import { MdMedicalServices, MdOutlineDashboard, MdOutlineLibraryBooks, MdReportGmailerrorred, MdSecurity } from "react-icons/md";
import { IoChatboxEllipsesOutline } from 'react-icons/io5';
import { Card, CardBody } from '@heroui/react';
import Link from 'next/link';

const quotes = [
  "Success is not in what you have, but who you are.",
  "Believe you can and you're halfway there.",
  "Your limitation—it’s only your imagination.",
  "Push yourself, because no one else is going to do it for you.",
  "Great things never come from comfort zones.",
];

const healthTips = [
  "Stay hydrated by drinking at least 8 cups of water daily.",
  "Get at least 7–8 hours of sleep each night to boost immunity.",
  "Wash your hands frequently to prevent the spread of infections.",
  "Regular exercise improves mood and overall health.",
  "Eat more fresh fruits and vegetables for vital nutrients.",
];

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

const Dashboard = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [quote, setQuote] = useState("");
  const [healthTip, setHealthTip] = useState("");

  const authSelector = useSelector((state) => state?.auth);
  const userName =
    authSelector?.userInfo?.username === "super@example.com"
      ? "Admin"
      : authSelector?.userInfo?.username || "User";
  const userRole = authSelector?.userInfo?.roleId;

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await getMenusBasedRoleId(userRole);
        if (response) {
          const { data: { menus } } = response;
          setMenuItems(menus);
        }
      } catch (error) {
        console.log("🚀 ~ fetchMenus ~ error:", error);
      }
    };
    if (userRole) fetchMenus();
  }, [userRole]);

  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const randomTip = healthTips[Math.floor(Math.random() * healthTips.length)];
    setQuote(randomQuote);
    setHealthTip(randomTip);
  }, []);

  const iconMap = {
    IoChatboxEllipsesOutline,
    LuBookUp,
    MdOutlineLibraryBooks,
    MdReportGmailerrorred,
    PiExam,
    MdOutlineDashboard,
    MdMedicalServices,
    MdSecurity,
    PiUsers,
  };

  return (
    <MainLayout>
      {/* Greeting and Quote */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          {getGreeting()}, {userName} 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1 italic">“{quote}”</p>
      </div>

      {/* Health Tip */}
      <Card className="mb-8 border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900">
        <CardBody>
          <h2 className="text-base font-semibold text-purple-900 dark:text-purple-200 mb-2">
            💡 Health Tip of the Day
          </h2>
          <p className="text-sm text-purple-800 dark:text-purple-300">{healthTip}</p>
        </CardBody>
      </Card>

      <h6 className='m-0 mb-4 text-xl ext-gray-600 dark:text-gray-300'>All Menu Items</h6>
      {/* Dynamic Menu */}
      {menuItems.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No menu items available for your role.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item, index) => {
            const IconComponent = iconMap[item.icon] || PiExam;
            const delay = `${index * 75}ms`;

            return (
              <Link href={item.path || '#'} key={index}>
                <Card
                  className="transition-all duration-200 hover:lg:shadow-xl hover:lg:scale-[1.02] cursor-pointer border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 animate-fade-in"
                  style={{ animationDelay: delay }}
                >
                  <CardBody>
                    <div className="flex items-center gap-4 p-2">
                      <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full">
                        <IconComponent className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <p className="text-base font-medium text-gray-800 dark:text-gray-100 flex-1">
                        {item.title}
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </MainLayout>
  );
};

export default Dashboard;
