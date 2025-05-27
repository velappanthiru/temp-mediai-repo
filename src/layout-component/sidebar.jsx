'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { userLogout } from '@/reducers/auth';
import { removeCookies } from '@/utils/cookies';
import { getMenuByRole } from '@/utils/commonapi';
import { Image } from '@heroui/react';

import logoImage from '../assets/images/logo.jpeg';
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { LuBookUp } from "react-icons/lu";
import { PiExam } from "react-icons/pi";
import { MdOutlineLibraryBooks, MdReportGmailerrorred } from "react-icons/md";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { RiSearch2Line } from "react-icons/ri";
import { IoChatboxEllipsesOutline } from 'react-icons/io5';
import { FaLock } from "react-icons/fa";

// 🔷 Menu configuration
const menuConfig = {
  chat_bot: {
    label: 'Chat Bot',
    icon: <IoChatboxEllipsesOutline className="w-6 h-6" />,
    path: '/chatbot',
  },
  book_list: {
    label: 'Book List',
    icon: <LuBookUp className="w-6 h-6" />,
    path: '/book-list',
  },
  user: {
    label: 'Users',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
      </svg>
    ),
    path: '/user',
  },
  patient_360: {
    label: 'Patient 360',
    icon: <LuBookUp className="w-6 h-6" />,
    path: '/patient-details',
  },
  online_exam: {
    label: 'Online Exam',
    icon: <PiExam className="w-6 h-6" />,
    path: '/online-exam',
  },
  lesson_plan: {
    label: 'Lesson Plan',
    icon: <MdOutlineLibraryBooks className="w-6 h-6" />,
    path: '/lesson-plan',
  },
  reports: {
    label: 'Reports',
    icon: <MdReportGmailerrorred className="w-6 h-6" />,
    path: '/reports',
  },
  role_and_permission: {
    label: 'Role and Permission',
    icon: <FaLock className="w-6 h-6" />,
    path: '/role-and-permission',
  },
};

const Sidebar = ({ hideMenu }) => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const userRole = useSelector((state) => state.auth?.userInfo?.roleId);

  const [menuPermission, setMenuPermission] = useState([]);

  const handleLogout = () => {
    dispatch(userLogout());
    removeCookies();
    window.location.href = '/';
  };

  const handlePermissionByRole = async (id) => {
    try {
      const response = await getMenuByRole(id);
      if (response?.data?.data) {
        setMenuPermission(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

  useEffect(() => {
    if (userRole) {
      handlePermissionByRole(userRole);
    }
  }, [userRole]);

  return (
    <aside
      className={`hidden lg:flex flex-col lg:fixed top-0 bg-[linear-gradient(90deg,#7E41A2_0%,#9246B2_100%)] dark:bg-[#212529] left-0 z-40 ${hideMenu ? 'w-20' : 'w-64'} h-screen transition-all`}
      aria-label="Sidebar"
    >
      {/* Logo */}
      <div className="logo-wrapper py-4 min-h-20 flex items-center justify-center">
        <Link href="/">
          <Image
            alt="logo"
            src={logoImage.src}
            className="w-[8rem] h-auto rounded-none"
          />
        </Link>
      </div>

      {/* Dynamic Menu Items */}
      <div className="h-full overflow-y-auto flex flex-col justify-between">
        <ul className="flex flex-col">
          {menuPermission.map((item) => {
            const config = menuConfig[item.key];

            if (!config) return null;

            const isActive = pathname.startsWith(userRole === 1 ? `/super-admin${config.path}` : config.path);

            return (
              <li key={item.id}>
                <Link
                  href={userRole === 1 ? `/super-admin${config.path}` : config.path}
                  className={`text-base font-normal flex items-center gap-3 p-4 border-l-4 ${isActive ? 'text-white border-white' : 'text-slate-300 border-transparent dark:text-zinc-400'}`}
                >
                  {config.icon}
                  <span className={hideMenu ? 'hidden' : ''}>
                    {config.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Logout */}
        <div className="p-4 border-t border-slate-600">
          <button
            onClick={handleLogout}
            className="text-slate-300 hover:text-white flex items-center gap-3"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
              />
            </svg>
            <span className={hideMenu ? 'hidden' : ''}>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
