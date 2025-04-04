"use client";

import { Input } from '@heroui/react';
import React from 'react'
import BreadcrumbsComponent from '../../layout-component/breadcrumbs';
import { usePathname } from 'next/navigation';

const BookListAddComponent = () => {
  const pathname = usePathname();

  // Split the current path into segments and filter out empty strings
  const pathSegments = pathname.split('/').filter((segment) => segment);

  return (
    <>
      <div className='mb-6'>
        <BreadcrumbsComponent arr={pathSegments} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        <div className="flex flex-col-gap-1.5">
          <Input
            type="text"
            label="Book Name"
            placeholder=' '
            labelPlacement='outside'
            size='lg'
            classNames={
              {
                label: "block text-base font-medium text-black dark:text-[#9F9FA5] group-data-[filled-within=true]:text-[#000] group-data-[filled-within=true]:dark:text-[#9F9FA5]",
                inputWrapper: "block bg-white dark:bg-transparent data-[hover=true]:bg-white dark:data-[hover=true]:bg-black group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-black shadow-none w-full px-4 py-2 h-10 border border-[#E7E7E9] dark:border-[#3E3E3E] data-[hover=true]:border-[#E7E7E9] data-[hover=true]:dark:border-[#3E3E3E] group-data-[focus=true]:border-[#E7E7E9] group-data-[focus=true]:dark:border-[#3E3E3E] rounded-xl focus:outline-none",
                input: "text-base font-medium text-[#343437] dark:text-white placeholder-[#9B9CA1]"
              }
            }
          />
          <small className='text-red-500 text-sm'></small>
        </div>
        <div className="flex flex-col-gap-1.5">
          <Input
            type="text"
            label="Author Name"
            placeholder=' '
            labelPlacement='outside'
            size='lg'
            classNames={
              {
                label: "block text-base font-medium text-black dark:text-[#9F9FA5] group-data-[filled-within=true]:text-[#000] group-data-[filled-within=true]:dark:text-[#9F9FA5]",
                inputWrapper: "block bg-white dark:bg-transparent data-[hover=true]:bg-white dark:data-[hover=true]:bg-black group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-black shadow-none w-full px-4 py-2 h-10 border border-[#E7E7E9] dark:border-[#3E3E3E] data-[hover=true]:border-[#E7E7E9] data-[hover=true]:dark:border-[#3E3E3E] group-data-[focus=true]:border-[#E7E7E9] group-data-[focus=true]:dark:border-[#3E3E3E] rounded-xl focus:outline-none",
                input: "text-base font-medium text-[#343437] dark:text-white placeholder-[#9B9CA1]"
              }
            }
          />
          <small className='text-red-500 text-sm'></small>
        </div>
        <div className="flex flex-col-gap-1.5">
          <Input
            type="text"
            label="Year"
            placeholder=' '
            labelPlacement='outside'
            size='lg'
            classNames={
              {
                label: "block text-base font-medium text-black dark:text-[#9F9FA5] group-data-[filled-within=true]:text-[#000] group-data-[filled-within=true]:dark:text-[#9F9FA5]",
                inputWrapper: "block bg-white dark:bg-transparent data-[hover=true]:bg-white dark:data-[hover=true]:bg-black group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-black shadow-none w-full px-4 py-2 h-10 border border-[#E7E7E9] dark:border-[#3E3E3E] data-[hover=true]:border-[#E7E7E9] data-[hover=true]:dark:border-[#3E3E3E] group-data-[focus=true]:border-[#E7E7E9] group-data-[focus=true]:dark:border-[#3E3E3E] rounded-xl focus:outline-none",
                input: "text-base font-medium text-[#343437] dark:text-white placeholder-[#9B9CA1]"
              }
            }
          />
          <small className='text-red-500 text-sm'></small>
        </div>
        <div className="flex flex-col-gap-1.5">
          <Input
            type="text"
            label="Publisher"
            placeholder=' '
            labelPlacement='outside'
            size='lg'
            classNames={
              {
                label: "block text-base font-medium text-black dark:text-[#9F9FA5] group-data-[filled-within=true]:text-[#000] group-data-[filled-within=true]:dark:text-[#9F9FA5]",
                inputWrapper: "block bg-white dark:bg-transparent data-[hover=true]:bg-white dark:data-[hover=true]:bg-black group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-black shadow-none w-full px-4 py-2 h-10 border border-[#E7E7E9] dark:border-[#3E3E3E] data-[hover=true]:border-[#E7E7E9] data-[hover=true]:dark:border-[#3E3E3E] group-data-[focus=true]:border-[#E7E7E9] group-data-[focus=true]:dark:border-[#3E3E3E] rounded-xl focus:outline-none",
                input: "text-base font-medium text-[#343437] dark:text-white placeholder-[#9B9CA1]"
              }
            }
          />
          <small className='text-red-500 text-sm'></small>
        </div>
        <div className="flex flex-col-gap-1.5">
          <Input
            type="text"
            label="Editons"
            placeholder=' '
            labelPlacement='outside'
            size='lg'
            classNames={
              {
                label: "block text-base font-medium text-black dark:text-[#9F9FA5] group-data-[filled-within=true]:text-[#000] group-data-[filled-within=true]:dark:text-[#9F9FA5]",
                inputWrapper: "block bg-white dark:bg-transparent data-[hover=true]:bg-white dark:data-[hover=true]:bg-black group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-black shadow-none w-full px-4 py-2 h-10 border border-[#E7E7E9] dark:border-[#3E3E3E] data-[hover=true]:border-[#E7E7E9] data-[hover=true]:dark:border-[#3E3E3E] group-data-[focus=true]:border-[#E7E7E9] group-data-[focus=true]:dark:border-[#3E3E3E] rounded-xl focus:outline-none",
                input: "text-base font-medium text-[#343437] dark:text-white placeholder-[#9B9CA1]"
              }
            }
          />
          <small className='text-red-500 text-sm'></small>
        </div>
      </div>
        <div className="flex items-center justify-end gap-4 mt-6">
          <button
            type="submit"
            className="bg-orange-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
          >
            Save
          </button>
          <button
            type="button"
            className="bg-gray-300 dark:bg-gray-700 dark:text-white px-6 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
    </>
  )
}

export default BookListAddComponent;
