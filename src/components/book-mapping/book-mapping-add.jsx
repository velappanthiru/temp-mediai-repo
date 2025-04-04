"use client";

import { Input } from '@heroui/input';
import React from 'react'
import { usePathname } from 'next/navigation';
import Select from 'react-select';
import BreadcrumbsComponent from '../../layout-component/breadcrumbs';

const BookMappingAdd = () => {
  const pathname = usePathname();

  // Split the current path into segments and filter out empty strings
  const pathSegments = pathname.split('/').filter((segment) => segment);

  const customTheme = (theme) => ({
      ...theme,
      colors: {
          ...theme.colors,
          primary25: '#d4d4d8',
          primary: 'white',
      },
  });

  const customSelectStyles = {
      control: (base) => ({
          ...base,
          borderColor: '#E7E7E9',
          boxShadow: 'none',
          borderRadius: 12,
          height: "3rem",
          '&:hover': {
              borderColor: '#E7E7E9',
          },
      }),
      menu: (base) => ({
          ...base,
          zIndex: 9999,
          borderColor: '#E7E7E9',
          borderRadius: 12,
          paddingTop: 8,
          paddingBottom: 8,
      }),
      option: (base, state) => ({
          ...base,
          backgroundColor: state.isSelected ? '#E7E7E9' : state.isFocused ? '#E7E7E9' : 'transparent',
          color: state.isSelected ? 'black' : 'black',
          cursor: 'pointer',
      }),
  };

  return (
    <>
      <div className='mb-6'>
        <BreadcrumbsComponent arr={pathSegments} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        <div className='flex flex-col gap-1'>
          <label className="block text-base font-medium text-black dark:text-[#9F9FA5] mt-[-0.25rem]">Select Book</label>
          <Select
            id={`state-select-timeDurationOptions`}
            className="basic-single"
            isClearable={true}
            isSearchable={true}
            options={[]}
            theme={customTheme}
            styles={customSelectStyles}
          />
          {/* <small className='text-red-500 text-sm'></small> */}
        </div>
        <div className='flex flex-col gap-1'>
          <label className="block text-base font-medium text-black dark:text-[#9F9FA5] mt-[-0.25rem]">Select Student  grade</label>
          <Select
            id={`state-select-timeDurationOptions`}
            className="basic-single"
            isClearable={true}
            isSearchable={true}
            options={[]}
            theme={customTheme}
            styles={customSelectStyles}
          />
          {/* <small className='text-red-500 text-sm'></small> */}
        </div>
        <div className='flex flex-col gap-1'>
          <label className="block text-base font-medium text-black dark:text-[#9F9FA5] mt-[-0.25rem]">Select Professor role</label>
          <Select
            id={`state-select-timeDurationOptions`}
            className="basic-single"
            isClearable={true}
            isSearchable={true}
            options={[]}
            theme={customTheme}
            styles={customSelectStyles}
          />
          {/* <small className='text-red-500 text-sm'></small> */}
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

export default BookMappingAdd;
