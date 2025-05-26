"use client";

import React, { useState } from 'react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, User, Avatar, Image } from '@heroui/react';
import { useTheme } from 'next-themes';
import { usePathname, useRouter } from 'next/navigation';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel
} from '@headlessui/react'
import Link from 'next/link';
import { LuBookUp } from "react-icons/lu";
import { PiExam } from "react-icons/pi";
import { MdOutlineLibraryBooks, MdReportGmailerrorred } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { userLogout } from '@/reducers/auth';
import { removeCookies } from '@/utils/cookies';
import { IoChatboxEllipsesOutline } from 'react-icons/io5';
import logoImage from "../assets/images/logo.jpeg";

export const SearchIcon = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`size-6 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

const Header = ({
  onClickSideBar
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const selector = useSelector((state) => state?.auth);
  const userRole = selector?.userInfo?.roleId;
  const dispatch = useDispatch();

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      // Request full-screen mode
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) { // Firefox
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari, and Opera
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
        document.documentElement.msRequestFullscreen();
      }
    } else {
      // Exit full-screen mode
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }

    // Toggle the state
    setIsFullScreen(!isFullScreen);
  };

  const pathname = usePathname(); // Get the current path

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
      <header className="relative bg-white dark:bg-[#292e32] px-4">
        <nav aria-label="Top" className="py-4 min-h-20 flex items-center">
          <div className="inner-header w-full">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center gap-4 lg:gap-8">
                <div className="bar-icon cursor-pointer hidden lg:block" onClick={onClickSideBar}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                  </svg>
                </div>
                <div className="bar-icon cursor-pointer lg:hidden"  onClick={() => setOpen(true)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                  </svg>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="menu-items cursor-pointer" onClick={toggleFullScreen}>
                  <div className="icon text-black dark:text-white">
                    {
                      !isFullScreen ? (
                        <svg
                          width="800px"
                          height="800px"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6"
                        >
                          <path
                            d="M9.00002 3.99997H4.00004L4 8.99999M20 8.99999V4L15 3.99997M15 20H20L20 15M4 15L4 20L9.00002 20"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ): (
                        <svg
                          width="800px"
                          height="800px"
                          viewBox="0 0 16 16"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          className="w-6 h-6"
                        >
                          <path d="M5.5 0a.5.5 0 0 1 .5.5v4A1.5 1.5 0 0 1 4.5 6h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5zm5 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 10 4.5v-4a.5.5 0 0 1 .5-.5zM0 10.5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 6 11.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zm10 1a1.5 1.5 0 0 1 1.5-1.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4z" />
                        </svg>
                      )
                    }

                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setTheme(resolvedTheme === "dark" ? "light" : "dark")
                  }
                  className='text-black dark:text-white'
                >
                    {
                      resolvedTheme === "light" ?
                      <div className="menu-items cursor-pointer text-black dark:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                        </svg>
                      </div> :
                      <div className="menu-items cursor-pointer text-black dark:text-white">
                        <div className="icon">
                          <svg width="24" height="24" viewBox="0 0 24 24" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2V3M12 21V22M22 12H21M3 12H2M19.07 4.93L18.678 5.323M5.322 18.678L4.929 19.071M19.07 19.07L18.678 18.677M5.322 5.322L4.929 4.929M6.341 10C5.88777 11.2831 5.88415 12.6821 6.33073 13.9675C6.77732 15.2529 7.64758 16.3484 8.79871 17.074C9.94984 17.7997 11.3135 18.1125 12.6658 17.9612C14.0181 17.8098 15.2788 17.2033 16.2411 16.2411C17.2033 15.2788 17.8098 14.0181 17.9612 12.6658C18.1125 11.3135 17.7997 9.94984 17.074 8.79871C16.3484 7.64758 15.2529 6.77732 13.9675 6.33073C12.6821 5.88415 11.2831 5.88777 10 6.341" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        </div>
                      </div>
                    }
                </button>
                <div className='hidden md:block'>
                  <Dropdown placement="bottom-start">
                    <DropdownTrigger>
                      <User
                        as="button"
                        avatarProps={{
                          isBordered: true,
                          src: selector?.userInfo?.image,
                        }}
                        className="transition-transform"
                        description={selector?.userInfo?.emailid}
                        name={selector?.userInfo?.username}
                      />
                    </DropdownTrigger>
                    <DropdownMenu aria-label="User Actions" variant="flat">
                      <DropdownItem key="profile" className="h-14 gap-2">
                        <p className="font-bold">Signed in as</p>
                        <p className="font-bold">{selector?.userInfo?.emailid}</p>
                      </DropdownItem>
                      <DropdownItem key="logout" color="danger" onPress={handleLogout}>
                        Log Out
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
                <div className='md:hidden'>
                  <Dropdown placement="bottom-start">
                    <DropdownTrigger>
                      <Avatar
                        isBordered
                        as="button"
                        className="transition-transform"
                        src= {selector?.userInfo?.image}
                      />
                    </DropdownTrigger>
                    <DropdownMenu aria-label="User Actions" variant="flat">
                      <DropdownItem key="profile" className="h-14 gap-2">
                        <p className="font-bold">Signed in as</p>
                        <p className="font-bold">{selector?.userInfo?.emailid}</p>
                      </DropdownItem>
                      <DropdownItem key="logout" color="danger" onPress={handleLogout}>
                        Log Out
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <Dialog open={open} onClose={setOpen} className="relative z-40 lg:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
        />

        <div className="fixed inset-0 z-40 flex">
          <DialogPanel
            transition
            className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white dark:bg-[#212529] pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:-translate-x-full"
          >
            <div className="flex justify-between items-center px-4 pb-2 pt-4 min-h-20">
              <div className="logo-wrapper">
                <Link href={'/'} className='text-2xl text-center block font-semibold text-white uppercase'>
                  <Image
                    alt="logo"
                    src={logoImage.src}
                    className="w-[8rem] h-[auto] rounded-none"
                  />
                </Link>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 dark:text-white"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Close menu</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
              </button>
            </div>

            <div className="h-full overflow-y-auto flex flex-col justify-between border-t border-gray-200 dark:border-zinc-400">
              {
                userRole === 1 ? <>
                  <ul className='flex flex-col'>
                    <li>
                      <Link href={'/super-admin/chatbot'} className={`text-base font-normal flex items-center gap-3 p-4 ${pathname?.startsWith('/super-admin/chatbot') ? "text-[#7E41A2]" : "text-slate-800 dark:text-zinc-400"}`}>
                        <IoChatboxEllipsesOutline className='w-6 h-6'/>
                        <span>Chat Bot</span>
                      </Link>
                    </li>
                    <li>
                      <Link href={'/super-admin/book-list'} className={`text-base font-normal flex items-center gap-3 p-4 ${pathname?.startsWith('/super-admin/book-list') ? "text-[#7E41A2]" : "text-slate-800 dark:text-zinc-400"}`}>
                        <LuBookUp className='w-6 h-6'/>
                        <span>Book List</span>
                      </Link>
                    </li>
                    <li>
                      <Link href={'/super-admin/user'} className={`text-base font-normal flex items-center gap-3 p-4 ${pathname?.startsWith('/super-admin/user') ? "text-[#7E41A2]" : "text-slate-800 dark:text-zinc-400"}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                        <span>Users</span>
                      </Link>
                    </li>
                    <li>
                      <Link href={'/super-admin/online-exam'} className={`text-base font-normal flex items-center gap-3 p-4 ${pathname?.startsWith('/super-admin/online-exam') ? "text-[#7E41A2]" : "text-slate-800 dark:text-zinc-400"}`}>
                        <PiExam className='w-6 h-6'/>
                        <span>Online Exam</span>
                      </Link>
                    </li>
                    <li>
                      <Link href={'/super-admin/lesson-plan'} className={`text-base font-normal flex items-center gap-3 p-4 ${pathname?.startsWith('/super-admin/lesson-plan') ? "text-[#7E41A2]" : "text-slate-800 dark:text-zinc-400"}`}>
                        <MdOutlineLibraryBooks className='w-6 h-6'/>
                        <span>Lesson Plan</span>
                      </Link>
                    </li>
                    <li>
                      <Link href={'/super-admin/reports'} className={`text-base font-normal flex items-center gap-3 p-4 ${pathname?.startsWith('/super-admin/reports') ? "text-[#7E41A2]" : "text-slate-800 dark:text-zinc-400"}`}>
                        <MdReportGmailerrorred className='w-6 h-6'/>
                        <span>Reports</span>
                      </Link>
                    </li>
                    <li>
                      <Link href={'/super-admin/role-and-permission'} className={`text-base font-normal flex items-center gap-3 p-4 ${pathname?.startsWith('/super-admin/reports') ? "text-[#7E41A2]" : "text-slate-800 dark:text-zinc-400"}`}>
                        <MdReportGmailerrorred className='w-6 h-6'/>
                        <span>Roles and Permission</span>
                      </Link>
                    </li>
                  </ul>
                </> : <>
                  <ul className='flex flex-col'>
                    <li>
                      <Link href={'/chatbot'} className={`text-base font-normal flex items-center gap-3 p-4 ${pathname?.startsWith('/super-admin/chatbot') ? "text-[#7E41A2]" : "text-slate-800 dark:text-zinc-400"}`}>
                        <IoChatboxEllipsesOutline className='w-6 h-6'/>
                        <span>Chat Bot</span>
                      </Link>
                    </li>

                    <li>
                      <Link href={'/online-exam'} className={`text-base font-normal flex items-center gap-3 p-4 ${pathname?.startsWith('/super-admin/online-exam') ? "text-[#7E41A2]" : "text-slate-800 dark:text-zinc-400"}`}>
                        <PiExam className='w-6 h-6'/>
                        <span>Online Exam</span>
                      </Link>
                    </li>
                  </ul>
                </>
              }


            </div>

          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}

export default Header;
