'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { LuBookUp } from "react-icons/lu";
import { PiExam } from "react-icons/pi";
import { MdOutlineLibraryBooks, MdReportGmailerrorred } from "react-icons/md";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { RiSearch2Line } from "react-icons/ri";
import { useDispatch } from 'react-redux';
import { userLogout } from '@/reducers/auth';
import { removeCookies } from '@/utils/cookies';
import { IoChatboxEllipsesOutline } from 'react-icons/io5';
import { Image } from '@heroui/react';
import logoImage from "../assets/images/logo.jpeg";


const Sidebar = ({ hideMenu }) => {

  const pathname = usePathname(); // Get the current path


  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    try {
      dispatch(userLogout());
      removeCookies();
      window.location.href = "/";
    } catch (error) {
      console.log("🚀 ~ handleLogout ~ error:", error)
    }
  }


  return (
    <>
      <aside
        id="default-sidebar"
        className={`hidden lg:flex flex-col lg:fixed top-0 bg-[linear-gradient(90deg,#7E41A2_0%,#9246B2_100%)] dark:bg-[#212529] left-0 z-40 ${hideMenu ? 'w-20' : 'w-64'} h-screen transition-transform transition-width -translate-x-full sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="logo-wrapper py-4 min-h-20 flex items-center justify-center">
          <Link href={'/'} className='text-2xl text-center block font-semibold text-white uppercase'>
          <Image
              alt="logo"
              src={logoImage.src}
              className="w-[8rem] h-[auto] rounded-none"
            />
          </Link>
        </div>
        <div className="h-full overflow-y-auto flex flex-col justify-between">
          <ul className='flex flex-col'>
            <li>
              <Link href={'/super-admin/chatbot'} className={`text-base font-normal flex items-center gap-3 p-4 border-l-4 border-transparent ${pathname.startsWith('/super-admin/chatbot') ? "text-white border-white" : "text-slate-300 dark:text-zinc-400"}`}>
                <IoChatboxEllipsesOutline className='w-6 h-6'/>
                <span className={`${hideMenu ? 'hidden': ''}`}>Chat Bot</span>
              </Link>
            </li>
            <li>
              <Link href={'/super-admin/book-list'} className={`text-base font-normal flex items-center gap-3 p-4 border-l-4 border-transparent ${pathname.startsWith('/super-admin/book-list') ? "text-white border-white" : "text-slate-300 dark:text-zinc-400"}`}>
                <LuBookUp className='w-6 h-6'/>
                <span className={`${hideMenu ? 'hidden': ''}`}>Book List</span>
              </Link>
            </li>
            <li>
              <Link href={'/super-admin/user'} className={`text-base font-normal flex items-center gap-3 p-4 border-l-4 border-transparent ${pathname.startsWith('/super-admin/user') ? "text-white border-white" : "text-slate-300 dark:text-zinc-400"}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                <span className={`${hideMenu ? 'hidden': ''}`}>Users</span>
              </Link>
            </li>
            <li>
              <Link href={'/super-admin/patient-details'} className={`text-base font-normal flex items-center gap-3 p-4 border-l-4 border-transparent ${pathname.startsWith('/super-admin/patient-details') ? "text-white border-white" : "text-slate-300 dark:text-zinc-400"}`}>
                <LuBookUp className='w-6 h-6'/>
                <span className={`${hideMenu ? 'hidden': ''}`}>Patient 360</span>
              </Link>
            </li>  
            <li>
              <Link href={'/super-admin/online-exam'} className={`text-base font-normal flex items-center gap-3 p-4 border-l-4 border-transparent ${pathname.startsWith('/super-admin/online-exam') ? "text-white border-white" : "text-slate-300 dark:text-zinc-400"}`}>
                <PiExam className='w-6 h-6'/>
                <span className={`${hideMenu ? 'hidden' : ''}`}>Online Exam</span>
              </Link>
            </li>
            <li>
              <Link href={'/super-admin/lesson-plan'} className={`text-base font-normal flex items-center gap-3 p-4 border-l-4 border-transparent ${pathname.startsWith('/super-admin/lesson-plan') ? "text-white border-white" : "text-slate-300 dark:text-zinc-400"}`}>
                <MdOutlineLibraryBooks className='w-6 h-6'/>
                <span className={`${hideMenu ? 'hidden': ''}`}>Lesson Plan</span>
              </Link>
            </li>
            <li>
              <Link href={'/super-admin/reports'} className={`text-base font-normal flex items-center gap-3 p-4 border-l-4 border-transparent ${pathname.startsWith('/super-admin/reports') ? "text-white border-white" : "text-slate-300 dark:text-zinc-400"}`}>
                <MdReportGmailerrorred className='w-6 h-6'/>
                <span className={`${hideMenu ? 'hidden': ''}`}>Reports</span>
              </Link>
            </li>
            <li>
              <Link href={'/super-admin/role-and-permission'} className={`text-base font-normal flex items-center gap-3 p-4 border-l-4 border-transparent ${pathname.startsWith('/super-admin/role-and-permission') ? "text-white border-white" : "text-slate-300 dark:text-zinc-400"}`}>
                <MdReportGmailerrorred className='w-6 h-6'/>
                <span className={`${hideMenu ? 'hidden': ''}`}>Role and Permission</span>
              </Link>
            </li>
          </ul>
          <div className='flex flex-col gap-4'>
            <ul className='flex flex-col gap-4'>
              <li>
                <div onClick={handleLogout} className={`cursor-pointer text-base font-normal flex items-center gap-3 px-4 py-3 ${pathname === '/logout' ? "text-white" : "text-slate-300 dark:text-zinc-400"}`}>
                  <svg
                    width="800px"
                    height="800px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-6"
                  >
                    <path
                      d="M12 3.25C12.4142 3.25 12.75 3.58579 12.75 4C12.75 4.41421 12.4142 4.75 12 4.75C7.99594 4.75 4.75 7.99594 4.75 12C4.75 16.0041 7.99594 19.25 12 19.25C12.4142 19.25 12.75 19.5858 12.75 20C12.75 20.4142 12.4142 20.75 12 20.75C7.16751 20.75 3.25 16.8325 3.25 12C3.25 7.16751 7.16751 3.25 12 3.25Z"
                      fill="currentColor"
                    />
                    <path
                      d="M16.4697 9.53033C16.1768 9.23744 16.1768 8.76256 16.4697 8.46967C16.7626 8.17678 17.2374 8.17678 17.5303 8.46967L20.5303 11.4697C20.8232 11.7626 20.8232 12.2374 20.5303 12.5303L17.5303 15.5303C17.2374 15.8232 16.7626 15.8232 16.4697 15.5303C16.1768 15.2374 16.1768 14.7626 16.4697 14.4697L18.1893 12.75H10C9.58579 12.75 9.25 12.4142 9.25 12C9.25 11.5858 9.58579 11.25 10 11.25H18.1893L16.4697 9.53033Z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className={`${hideMenu ? 'hidden': ''}`}>Logout</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </>

  );
};

export default Sidebar;
