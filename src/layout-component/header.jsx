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
              <ul className='flex flex-col'>
                <li>
                  <Link href={'/super-admin/chatbot'} className={`text-base font-normal flex items-center gap-3 p-4 ${pathname.startsWith('/super-admin/chatbot') ? "text-[#7E41A2]" : "text-slate-800 dark:text-zinc-400"}`}>
                    <IoChatboxEllipsesOutline className='w-6 h-6'/>
                    <span>Chat Bot</span>
                  </Link>
                </li>
                <li>
                  <Link href={'/super-admin/book-upload'} className={`text-base font-normal flex items-center gap-3 p-4 ${pathname.startsWith('/super-admin/book-upload') ? "text-[#7E41A2]" : "text-slate-800 dark:text-zinc-400"}`}>
                    <LuBookUp className='w-6 h-6'/>
                    <span>Book Upload</span>
                  </Link>
                </li>
                <li>
                  <Link href={'/super-admin/user'} className={`text-base font-normal flex items-center gap-3 p-4 ${pathname.startsWith('/super-admin/user') ? "text-[#7E41A2]" : "text-slate-800 dark:text-zinc-400"}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    <span>Users</span>
                  </Link>
                </li>
                <li>
                  <Link href={'/super-admin/book-mapping'} className={`text-base font-normal flex items-center gap-3 p-4 ${pathname.startsWith('/super-admin/book-mapping') ? "text-[#7E41A2]" : "text-slate-800 dark:text-zinc-400"}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                    </svg>
                    <span>Books Mapping</span>
                  </Link>
                </li>
                <li>
                  <Link href={'/super-admin/online-exam'} className={`text-base font-normal flex items-center gap-3 p-4 ${pathname.startsWith('/super-admin/online-exam') ? "text-[#7E41A2]" : "text-slate-800 dark:text-zinc-400"}`}>
                    <PiExam className='w-6 h-6'/>
                    <span>Online Exam</span>
                  </Link>
                </li>
                <li>
                  <Link href={'/super-admin/lesson-plan'} className={`text-base font-normal flex items-center gap-3 p-4 ${pathname.startsWith('/super-admin/lesson-plan') ? "text-[#7E41A2]" : "text-slate-800 dark:text-zinc-400"}`}>
                    <MdOutlineLibraryBooks className='w-6 h-6'/>
                    <span>Lesson Plan</span>
                  </Link>
                </li>
                <li>
                  <Link href={'/super-admin/reports'} className={`text-base font-normal flex items-center gap-3 p-4 ${pathname.startsWith('/super-admin/reports') ? "text-[#7E41A2]" : "text-slate-800 dark:text-zinc-400"}`}>
                    <MdReportGmailerrorred className='w-6 h-6'/>
                    <span>Reports</span>
                  </Link>
                </li>
              </ul>
              <div className='flex flex-col gap-4'>
                <ul className='flex flex-col gap-4'>
                  <li>
                    <Link href={'/settings'} className={`text-base font-normal flex items-center gap-3 px-4 py-3 ${pathname === '/settings' ? "text-[#7E41A2]" : "text-slate-800 dark:text-zinc-400"}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                      <span>Settings</span>
                    </Link>
                  </li>
                  <li>
                    <div onClick={handleLogout} className={`cursor-pointer text-base font-normal flex items-center gap-3 px-4 py-3 ${pathname === '/logout' ? "text-[#7E41A2]" : "text-slate-800 dark:text-zinc-400"}`}>
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
                      <span>Logout</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}

export default Header;
