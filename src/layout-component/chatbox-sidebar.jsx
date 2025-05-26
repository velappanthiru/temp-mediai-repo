import React, { useEffect, useState } from 'react';
import { Button, Link } from '@heroui/react';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { usePathname } from 'next/navigation';
import { PlusIcon } from '@/utils/icon';
import { LuStethoscope } from 'react-icons/lu';
import { historyApi } from '@/utils/commonapi';
import { isSameDay, isToday, subDays, startOfWeek, isAfter, parseISO } from 'date-fns';
import { MdDashboard } from 'react-icons/md';
import { useSelector } from 'react-redux';

const isUpdatedYesterday = (dateString) => {
  const date = parseISO(dateString);
  const yesterday = subDays(new Date(), 1);
  return isSameDay(date, yesterday);
};

const isUpdatedThisWeek = (dateString) => {
  const date = parseISO(dateString);
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday as start of week
  return isAfter(date, weekStart) || isSameDay(date, weekStart);
};

const CharboxSidebar = ({ hideMenu }) => {

  const [todayData, setTodayData] = useState([]);
  const [yesterdayData, setYesterdayData] = useState([]);
  const [thisWeekData, setThisWeekData] = useState([]);
  const pathname = usePathname(); // Get the current path
  const selector = useSelector(state => state);
  const userRole = selector?.auth?.userInfo?.roleId;

  const fetchHistory = async () => {
    try {
      const { data } = await historyApi();

      const historyArray = data.sessions || [];

      const todayData = historyArray.filter((item) =>
        isToday(parseISO(item?.last_updated))
      );

      const yesterdayData = historyArray.filter((item) =>
        isUpdatedYesterday(item?.last_updated)
      );

      const thisWeekData = historyArray.filter((item) =>
        isUpdatedThisWeek(item?.last_updated)
      );

      setTodayData(todayData);
      setYesterdayData(yesterdayData);
      setThisWeekData(thisWeekData);
    } catch (error) {
      console.log("🚀 ~ fetchHistory ~ error:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [])
  return (
    <>
      <aside
        id="default-sidebar"
        className={`hidden lg:flex flex-col lg:fixed top-0 bg-white dark:bg-[#292e32] left-0 z-40 ${hideMenu ? 'w-[0px] overflow-hidden' : 'w-64'}  h-screen transition-transform transition-width -translate-x-full sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="logo-wrapper p-4 min-h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
              <LuStethoscope className="text-white w-4 h-4" />
            </div>
            <span className="text-base font-semibold text-purple-700 dark:text-purple-300">
              Medical AI
            </span>
          </div>
        </div>

        <div className="h-[calc(100vh-80px)] overflow-hidden flex flex-col">
          <div className="p-4">
            <Button
              className='bg-purple-600 text-white w-full'
              startContent={
                <PlusIcon className="w-6 h-6" />
              }
            >
              New Chat
            </Button>
          </div>
          <div className="relative flex flex-col gap-4 p-4 h-[calc(100%-60px)] overflow-y-auto">
            <div className="flex flex-col gap-3 pb-8">
              {
                todayData?.length > 0 && <>
                  <div className="title">
                    <h6 className='m-0 text-sm text-neutral-500 dark:text-neutral-400 font-semibold'>Today</h6>
                  </div>
                  <ul className='flex flex-col'>
                    {
                      todayData?.map((item, idx) => (
                        <li key={`today_${idx}`} className='px-2.5 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg cursor-pointer'>
                          <span className="w-[calc(100%-0.625rem)] black text-sm text-black dark:text-white line-clamp-1 whitespace-nowrap">{item?.title}</span>
                        </li>
                      ))
                    }
                  </ul>
                </>
              }
              {
                yesterdayData?.length > 0 && <>
                  <div className="title">
                    <h6 className='m-0 text-sm text-neutral-500 dark:text-neutral-400 font-semibold'>Yesterday</h6>
                  </div>
                  <ul className='flex flex-col'>
                    {
                      yesterdayData?.map((item, idx) => (
                        <li key={`yesterday_${idx}`} className='px-2.5 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg cursor-pointer'>
                          <span className="w-[calc(100%-0.625rem)] black text-sm text-black dark:text-white line-clamp-1 whitespace-nowrap">{item?.title}</span>
                        </li>
                      ))
                    }
                  </ul>
                </>
              }
              {
                thisWeekData?.length > 0 && <>
                  <div className="title">
                    <h6 className='m-0 text-sm text-neutral-500 dark:text-neutral-400 font-semibold'>Previous 7 Days</h6>
                  </div>
                  <ul className='flex flex-col'>
                    {
                      thisWeekData?.map((item, idx) => (
                        <li key={`thisweek_${idx}`} className='px-2.5 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg cursor-pointer'>
                          <span className="w-[calc(100%-0.625rem)] black text-sm text-black dark:text-white line-clamp-1 whitespace-nowrap">{item?.title}</span>
                        </li>
                      ))
                    }
                  </ul>
                </>
              }
            </div>
            {/* Bottom fade overlay */}
          </div>
          <div className="mt-auto relative">
            <div className="absolute bottom-0 left-0 right-0 top-[-4rem] h-16 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-[#292e32] dark:via-[#292e32]/80 dark:to-transparent pointer-events-none rounded-t-lg"></div>

            <ul>
              <li>
                <Link href={userRole === 1 ? "/super-admin/book-list": "/online-exam"} className={`text-base font-normal flex items-center gap-3 p-4 text-purple-600 dark:text-white`}>
                  <MdDashboard className='w-6 h-6'/>
                  <span className={`${hideMenu ? 'hidden' : ''}`}>DashBoard</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </>
  )
}

export default CharboxSidebar;
