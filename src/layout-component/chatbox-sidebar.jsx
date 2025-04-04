import React, { useEffect, useState } from 'react';
import { Image, Link } from '@heroui/react';
import { MdOutlineLibraryBooks, MdReportGmailerrorred } from 'react-icons/md';
import { PiExam } from 'react-icons/pi';
import { RiSearch2Line } from 'react-icons/ri';
import { HiMiniPencilSquare } from 'react-icons/hi2';
import { usePathname } from 'next/navigation';
// import { useSelector } from 'react-redux';
import logoImage from "../assets/images/logo.jpeg";

const CharboxSidebar = ({ hideMenu }) => {
  const pathname = usePathname(); // Get the current path
  // const selector = useSelector(state => state?.auth);
  // console.log(selector);


  const [role, setRole] = useState('student');
  useEffect(() => {
    const superAdmin = pathname.startsWith('/super-admin');
    setRole(superAdmin ? "super-admin" : "user");
  }, []);
  return (
    <>
      <aside
        id="default-sidebar"
        className={`hidden lg:flex flex-col lg:fixed top-0 bg-[linear-gradient(90deg,#7E41A2_0%,#9246B2_100%)] dark:bg-[#212529] left-0 z-40 ${hideMenu ? 'w-[0px] overflow-hidden' : 'w-64'}  h-screen transition-transform transition-width -translate-x-full sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="logo-wrapper p-4 min-h-20 flex items-center justify-between">
          <Link href={'/'} className='text-xl block font-semibold text-white uppercase'>
            <Image
              alt="logo"
              src={logoImage.src}
              className="w-[8rem] h-[auto] rounded-none"
            />
          </Link>
          <div className="flex gap-4 items-center">
            <div className='icon cursor-pointer text-white dark:text-zinc-200'>
              <RiSearch2Line className='w-6 h-6'/>
            </div>
            <div className='icon cursor-pointer text-white dark:text-zinc-200'>
              <HiMiniPencilSquare className='w-6 h-6'/>
            </div>
          </div>
        </div>
        {
          role === "super-admin" &&  <ul className='flex flex-col'>
            <li className='px-4'>
              <Link href={'/super-admin/book-upload'} className={`text-sm font-normal flex items-center gap-3 px-4 py-3 rounded-xl bg-white hover:opacity-100 text-black`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                </svg>
                <span>Back To Book Upload</span>
              </Link>
            </li>
          </ul>
        }
        <div className="h-full overflow-hidden flex flex-col justify-between">
          <div className="flex flex-col gap-4 p-4 h-full overflow-y-auto">
            <div className="flex flex-col gap-3">
              <div className="title">
                <h6 className='m-0 text-xs text-white font-semibold'>Today</h6>
              </div>
              <ul className='flex flex-col'>
                <li className='px-2.5 py-2 hover:bg-zinc-700 rounded-lg cursor-pointer'>
                  <span className="w-[calc(100%-0.625rem)] black text-sm text-white dark:text-zinc-200 line-clamp-1 whitespace-nowrap">Dark mode placeholder color</span>
                </li>
                <li className='px-2.5 py-2 hover:bg-zinc-700 rounded-lg cursor-pointer'>
                  <span className="w-[calc(100%-0.625rem)] black text-sm text-white dark:text-zinc-200 line-clamp-1 whitespace-nowrap">Chatbot UI Design</span>
                </li>
                <li className='px-2.5 py-2 hover:bg-zinc-700 rounded-lg cursor-pointer'>
                  <span className="w-[calc(100%-0.625rem)] black text-sm text-white dark:text-zinc-200 line-clamp-1 whitespace-nowrap">Fixing JSX Conditional Rendering</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <div className="title">
                <h6 className="m-0 text-xs text-white font-semibold">Yesterday</h6>
              </div>
              <ul className="flex flex-col">
                <li className="px-2.5 py-2 hover:bg-zinc-700 rounded-lg cursor-pointer">
                  <span className="w-[calc(100%-0.625rem)] black text-sm text-white dark:text-zinc-200 line-clamp-1 whitespace-nowrap">OG Image Meta Tag</span>
                </li>
                <li className="px-2.5 py-2 hover:bg-zinc-700 rounded-lg cursor-pointer">
                  <span className="w-[calc(100%-0.625rem)] black text-sm text-white dark:text-zinc-200 line-clamp-1 whitespace-nowrap">Install XAMPP or MySQL</span>
                </li>
                <li className='px-2.5 py-2 hover:bg-zinc-700 rounded-lg cursor-pointer'>
                  <span className="w-[calc(100%-0.625rem)] black text-sm text-white dark:text-zinc-200 line-clamp-1 whitespace-nowrap">Dark mode placeholder color</span>
                </li>
                <li className='px-2.5 py-2 hover:bg-zinc-700 rounded-lg cursor-pointer'>
                  <span className="w-[calc(100%-0.625rem)] black text-sm text-white dark:text-zinc-200 line-clamp-1 whitespace-nowrap">Chatbot UI Design</span>
                </li>
                <li className='px-2.5 py-2 hover:bg-zinc-700 rounded-lg cursor-pointer'>
                  <span className="w-[calc(100%-0.625rem)] black text-sm text-white dark:text-zinc-200 line-clamp-1 whitespace-nowrap">Fixing JSX Conditional Rendering</span>
                </li>
                <li className='px-2.5 py-2 hover:bg-zinc-700 rounded-lg cursor-pointer'>
                  <span className="w-[calc(100%-0.625rem)] black text-sm text-white dark:text-zinc-200 line-clamp-1 whitespace-nowrap">Dark mode placeholder color</span>
                </li>
                <li className='px-2.5 py-2 hover:bg-zinc-700 rounded-lg cursor-pointer'>
                  <span className="w-[calc(100%-0.625rem)] black text-sm text-white dark:text-zinc-200 line-clamp-1 whitespace-nowrap">Chatbot UI Design</span>
                </li>
                <li className='px-2.5 py-2 hover:bg-zinc-700 rounded-lg cursor-pointer'>
                  <span className="w-[calc(100%-0.625rem)] black text-sm text-white dark:text-zinc-200 line-clamp-1 whitespace-nowrap">Fixing JSX Conditional Rendering</span>
                </li>
              </ul>
            </div>
            {/* <div className="flex flex-col gap-3">
              <div className="title">
                <h6 className="m-0 text-xs text-white font-semibold">Previous 7 Days</h6>
              </div>
              <ul className="flex flex-col">
                <li className="px-2.5 py-2 hover:bg-zinc-700 rounded-lg cursor-pointer">
                  <span className="w-[calc(100%-0.625rem)] black text-sm text-white dark:text-zinc-200 line-clamp-1 whitespace-nowrap">OG Image Meta Tag</span>
                </li>
                <li className="px-2.5 py-2 hover:bg-zinc-700 rounded-lg cursor-pointer">
                  <span className="w-[calc(100%-0.625rem)] black text-sm text-white dark:text-zinc-200 line-clamp-1 whitespace-nowrap">Install XAMPP or MySQL</span>
                </li>
                <li className='px-2.5 py-2 hover:bg-zinc-700 rounded-lg cursor-pointer'>
                  <span className="w-[calc(100%-0.625rem)] black text-sm text-white dark:text-zinc-200 line-clamp-1 whitespace-nowrap">Dark mode placeholder color</span>
                </li>
                <li className='px-2.5 py-2 hover:bg-zinc-700 rounded-lg cursor-pointer'>
                  <span className="w-[calc(100%-0.625rem)] black text-sm text-white dark:text-zinc-200 line-clamp-1 whitespace-nowrap">Chatbot UI Design</span>
                </li>
                <li className='px-2.5 py-2 hover:bg-zinc-700 rounded-lg cursor-pointer'>
                  <span className="w-[calc(100%-0.625rem)] black text-sm text-white dark:text-zinc-200 line-clamp-1 whitespace-nowrap">Fixing JSX Conditional Rendering</span>
                </li>
                <li className='px-2.5 py-2 hover:bg-zinc-700 rounded-lg cursor-pointer'>
                  <span className="w-[calc(100%-0.625rem)] black text-sm text-white dark:text-zinc-200 line-clamp-1 whitespace-nowrap">Dark mode placeholder color</span>
                </li>
                <li className='px-2.5 py-2 hover:bg-zinc-700 rounded-lg cursor-pointer'>
                  <span className="w-[calc(100%-0.625rem)] black text-sm text-white dark:text-zinc-200 line-clamp-1 whitespace-nowrap">Chatbot UI Design</span>
                </li>
                <li className='px-2.5 py-2 hover:bg-zinc-700 rounded-lg cursor-pointer'>
                  <span className="w-[calc(100%-0.625rem)] black text-sm text-white dark:text-zinc-200 line-clamp-1 whitespace-nowrap">Fixing JSX Conditional Rendering</span>
                </li>
              </ul>
            </div> */}
          </div>

          <div className='flex flex-col'>
            {
              role !== "super-admin" && <ul className='flex flex-col'>
                <li>
                  <Link href={'/student-profile'} className={`text-base font-normal flex items-center gap-3 p-4 border-l-4 border-transparent ${pathname.startsWith('/student-profile') ? "text-white border-white" : "text-slate-300 dark:text-zinc-400"}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    <span>Student Profile</span>
                  </Link>
                </li>
                <li>
                  <Link href={'/online-exam'} className={`text-base font-normal flex items-center gap-3 p-4 border-l-4 border-transparent ${pathname.startsWith('/online-exam') ? "text-white border-white" : "text-slate-300 dark:text-zinc-400"}`}>
                    <PiExam className='w-6 h-6'/>
                    <span>Online Exam</span>
                  </Link>
                </li>
                <li>
                  <Link href={'/lesson-plan'} className={`text-base font-normal flex items-center gap-3 p-4 border-l-4 border-transparent ${pathname.startsWith('/lesson-plan') ? "text-white border-white" : "text-slate-300 dark:text-zinc-400"}`}>
                    <MdOutlineLibraryBooks className='w-6 h-6'/>
                    <span>Lesson Plan</span>
                  </Link>
                </li>
                <li>
                  <Link href={'/reports'} className={`text-base font-normal flex items-center gap-3 p-4 border-l-4 border-transparent ${pathname.startsWith('/reports') ? "text-white border-white" : "text-slate-300 dark:text-zinc-400"}`}>
                    <MdReportGmailerrorred className='w-6 h-6'/>
                    <span>Reports</span>
                  </Link>
                </li>
              </ul>
            }
          </div>
        </div>
      </aside>
    </>
  )
}

export default CharboxSidebar;
