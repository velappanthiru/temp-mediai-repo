"use client";

import { Button, Input } from '@heroui/react';
import React, { useRef, useState } from 'react'
import BreadcrumbsComponent from '../../layout-component/breadcrumbs';
import { usePathname } from 'next/navigation';
import Select from 'react-select';
import { roleData, statusData } from '../../utils/common';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerValidationSchema } from '@/utils/yubSchema/authSchemeValidation';
import { userRegisterApi } from '@/utils/commonapi';
import { toast } from 'react-hot-toast';

const AddUser = () => {
  const pathname = usePathname();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const selectRoleRef = useRef();
  const selectStatusRef = useRef();
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


  const { register, handleSubmit, reset, formState, setValue } = useForm({
    resolver: yupResolver(
      registerValidationSchema
    ),
    mode: "onSubmit",
    reValidateMode: "onBlur"
  })

  const { errors } = formState;

  const handleSubmitLogin = async (data) => {
    setIsButtonDisabled(true);
    try {
      const objData = {
        name: data?.name,
        emailid: data?.email,
        mobilenum: data?.phone,
        role: data?.role
      }
      const response = await userRegisterApi(objData);
      if (response) {
        reset();
        setValue('role', null); // Clears the 'role' field
        setValue('status', null); // Clears the 'status' field
        selectRoleRef.current.clearValue();
        selectStatusRef.current.clearValue();
        setIsButtonDisabled(false);
        toast.success('User created successfully', {
          duration: 4000,
          position: 'top-right',
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Something went wrong. Please try again.";

      const errorData = {
        error: errorMessage
      }
      console.log("🚀 ~ reviewHandleSubmit ~ error:", error);
      handleLoginApiError(error);
    } finally {
      setIsButtonDisabled(false);
    }
  }

  const handleLoginApiError = (error) => {
    let errorMessage = 'An error occurred';
    if (error?.response) {
      errorMessage = error?.response?.data?.message;
    } else if (error?.request) {
      errorMessage = 'No response received from server';
    }
    console.log("🚀 ~ handleLoginApiError ~ errorMessage:", errorMessage)
  };

  const handleOnChange = (e,field) => {
    setValue(field, e?.value);
  }

  return (
    <>
      <div className='mb-6'>
        <BreadcrumbsComponent arr={pathSegments} />
      </div>
      <form onSubmit={handleSubmit(handleSubmitLogin)}>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        <div className="flex flex-col gap-1.5">
          <Input
            type="text"
            label="User Name"
            placeholder=' '
            labelPlacement='outside'
            size='lg'
            {...register("name")}
            classNames={
              {
                label: "block text-base font-medium text-black dark:text-[#9F9FA5] group-data-[filled-within=true]:text-[#000] group-data-[filled-within=true]:dark:text-[#9F9FA5]",
                inputWrapper: "block bg-white dark:bg-transparent data-[hover=true]:bg-white dark:data-[hover=true]:bg-black group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-black shadow-none w-full px-4 py-2 h-10 border border-[#E7E7E9] dark:border-[#3E3E3E] data-[hover=true]:border-[#E7E7E9] data-[hover=true]:dark:border-[#3E3E3E] group-data-[focus=true]:border-[#E7E7E9] group-data-[focus=true]:dark:border-[#3E3E3E] rounded-xl focus:outline-none",
                input: "text-base font-medium text-[#343437] dark:text-white placeholder-[#9B9CA1]"
              }
            }
          />
          {
            errors?.name && <small className='text-red-500 text-sm'>{errors?.name?.message}</small>
          }
        </div>

        <div className="flex flex-col gap-1.5">
          <Input
            type="text"
            label="Mobile"
            {...register("phone")}
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
          {
            errors?.phone && <small className='text-red-500 text-sm'>{errors?.phone?.message}</small>
          }
        </div>
        <div className="flex flex-col gap-1.5">
          <Input
            type="text"
            label="Email"
            {...register("email")}
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
          {
            errors?.email && <small className='text-red-500 text-sm'>{errors?.email?.message}</small>
          }
        </div>
        <div className='flex flex-col gap-1.5'>
          <label className="block text-base font-medium text-black dark:text-[#9F9FA5] mt-[-0.25rem]">Role</label>
          <Select
            id={`state-select-timeDurationOptions`}
            className="basic-single"
            isClearable={true}
            isSearchable={true}
            options={roleData}
            theme={customTheme}
            styles={customSelectStyles}
            onChange={(e) => handleOnChange(e, "role")}
            ref={selectRoleRef}
          />
          {
            errors?.role && <small className='text-red-500 text-sm'>{errors?.role?.message}</small>
          }
        </div>
        <div className='flex flex-col gap-1.5'>
          <label className="block text-base font-medium text-black dark:text-[#9F9FA5] mt-[-0.25rem]">Status</label>
          <Select
            ref={selectStatusRef}
            id={`state-select-timeDurationOptions`}
            className="basic-single"
            isClearable={true}
            isSearchable={true}
            options={statusData}
            theme={customTheme}
            styles={customSelectStyles}
            onChange={(e)=>handleOnChange(e,"status")}

          />
          {
            errors?.status && <small className='text-red-500 text-sm'>{errors?.status?.message}</small>
          }
        </div>
      </div>
        <div className="flex items-center justify-end gap-4 mt-6">
          <Button type="submit" isLoading={isButtonDisabled} className='bg-orange-600 text-white'>
            Save
          </Button>
          {/* <button
            type="button"
            className="bg-gray-300 dark:bg-gray-700 dark:text-white px-6 py-2 rounded-lg"
          >
            Cancel
          </button> */}
        </div>
      </form>

    </>
  )
}

export default AddUser;
