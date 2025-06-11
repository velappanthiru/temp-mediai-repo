"use client";

import React, { useEffect, useState } from 'react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, User, Avatar, Image, Skeleton } from '@heroui/react';
import { useTheme } from 'next-themes';
import { usePathname, useRouter } from 'next/navigation';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel
} from '@headlessui/react'
import Link from 'next/link';
import { LuBookUp } from "react-icons/lu";
import { PiExam, PiUsers } from "react-icons/pi";
import { MdMedicalServices, MdOutlineDashboard, MdOutlineLibraryBooks, MdReportGmailerrorred, MdSecurity } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { userLogout } from '@/reducers/auth';
import { removeCookies } from '@/utils/cookies';
import { IoChatboxEllipsesOutline } from 'react-icons/io5';
import logoImage from "../assets/images/logo.jpeg";
import { getMenusBasedRoleId } from '@/utils/commonapi';

export const SearchIcon = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`size-6 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

const iconMap = {
  IoChatboxEllipsesOutline: IoChatboxEllipsesOutline,
  LuBookUp: LuBookUp,
  MdOutlineLibraryBooks: MdOutlineLibraryBooks,
  MdReportGmailerrorred: MdReportGmailerrorred,
  PiExam: PiExam,
  MdOutlineDashboard: MdOutlineDashboard,
  MdMedicalServices: MdMedicalServices,
  MdSecurity: MdSecurity,
  PiUsers: PiUsers
};


const Header = ({
  onClickSideBar
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const selector = useSelector((state) => state?.auth);
  const userRole = selector?.userInfo?.roleId;
  const dispatch = useDispatch();
  const [menuItems, setMenuItems] = useState([]);
  const router = useRouter();

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

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await getMenusBasedRoleId(userRole);
        if (response) {
          const { data: { menus } } = response;
          setMenuItems(menus);
        }
      } catch (error) {
        console.log("🚀 ~ fetchMenus ~ error:", error)
      }
    }
    if (userRole) {
      fetchMenus();
    }
  },[userRole])

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
                  <div className="menu-items cursor-pointer dark:hidden text-black dark:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                    </svg>
                  </div>
                  <div className="menu-items cursor-pointer hidden dark:block text-black dark:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                    </svg>
                  </div>
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
                      <DropdownItem key="settings" onPress={()=>router.push('/settings')}>
                        Settings
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
                      <DropdownItem key="settings" onPress={()=>router.push('/settings')}>
                        Settings
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
            className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white dark:bg-[#212529] shadow-xl transition duration-300 ease-in-out data-[closed]:-translate-x-full"
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
              {menuItems && Array.isArray(menuItems) && menuItems.length > 0 ?
                menuItems.map((item, index) => {
                const IconComponent = iconMap[item.icon] ? iconMap[item.icon] : PiExam; // Get the icon component

                  return (
                    <li key={index}>
                      <Link
                        href={item?.path}
                        className={`text-base font-normal flex items-center gap-3 p-4 ${
                          pathname.startsWith(item.path)
                            ? "text-[#7E41A2]"
                            : "text-slate-800 dark:text-zinc-400"
                        }`}
                      >
                        {IconComponent && <IconComponent className="w-6 h-6" />}
                        <span>{item?.title}</span>
                      </Link>
                    </li>
                  );
                }) : <>
                  {
                    Array.from({ length: 6 }).map((_, index) => (
                      <div className="flex items-center gap-3 p-4">
                        <Skeleton className="flex rounded-md w-6 h-6" />
                        <Skeleton className="flex rounded-md flex-1 h-6" />
                      </div>
                    ))
                  }
                </>
              }
              </ul>
            </div>

          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}

export default Header;
