"use client";

import { Button, DatePicker, Input } from '@heroui/react';
import React, { useRef, useState } from 'react'
import BreadcrumbsComponent from '../../layout-component/breadcrumbs';
import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from "react-redux";
import { bookSchema } from '@/utils/yubSchema/validate';
import { bookUploadApi } from '@/utils/commonapi';
import {parseDate} from "@internationalized/date";
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

const BookListAddComponent = () => {
  const pathname = usePathname();
  const currentDate = format(new Date(), 'yyyy-MM-dd');

  const [publishValue, setPublishValue] = React.useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  // Split the current path into segments and filter out empty strings
  const pathSegments = pathname.split('/').filter((segment) => segment);
  const fileInputRef = useRef();
  const [selectedFile, setSelectedFile] = useState('');

  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };


  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      setSelectedFile(file);
      setValue('pdf_file', file);
    }
  };

  const { register, handleSubmit, reset, formState, setValue } = useForm({
    resolver: yupResolver(
      bookSchema
    ),
    mode: "onSubmit",
    reValidateMode: "onBlur"
  })

  const { errors } = formState;

  const handleSubmitLogin = async (data) => {
    setIsButtonDisabled(true);
    // Create a new FormData instance to handle form data
    const formData = new FormData();

    // Append form fields to FormData
    formData.append('bookName', data.book_name);
    formData.append('authorName', data.author_name);
    formData.append('year', data.year);
    formData.append('publisher', data.publisher_name);
    formData.append('edition', data.edition);
    formData.append('publishDate', data.is_publish);
    // If a file exists, append it to FormData
    if (data.pdf_file) {
      formData.append('bookFile', data.pdf_file);
    }
   try {
      const response = await bookUploadApi(formData);
      if (response) {
        reset();
        setValue("is_publish", null);
        setValue("pdf_file", null);
        setPublishValue(null);
        setIsButtonDisabled(false);
        setSelectedFile(null);
        toast.success('Book upload successfully', {
          duration: 3000,
          position: 'top-right',
        });
      }
    } catch (error) {
     const errorMessage = error.response?.data?.error || "Something went wrong. Please try again.";
      toast.error(error?.response?.data?.message || "Something went wrong. Please try again.", {
        duration: 3000,
        position: 'top-right',
      })
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

  const handleDateOnChange = (e) => {
    if (e?.year && e?.month && e?.day) {
      const selectedDate = new Date(e?.year, e?.month - 1, e?.day);  // Create a new Date object
      const formatDate = format(selectedDate, 'yyyy-MM-dd');
      setValue("is_publish", formatDate);
      setPublishValue(parseDate(formatDate));
    }
  }

  return (
    <>
      <div className='mb-6'>
        <BreadcrumbsComponent arr={pathSegments} />
      </div>
      <form onSubmit={handleSubmit(handleSubmitLogin)} encType="multipart/form-data">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
          <div className="flex flex-col gap-1.5">
            <Input
              type="text"
              label="Book Name"
              {...register('book_name')}
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
            <small className='text-red-500 text-sm'>{errors?.book_name?.message}</small>
          </div>
          <div className="flex flex-col gap-1.5">
            <Input
              type="text"
              label="Author Name"
              {...register('author_name')}
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
            <small className='text-red-500 text-sm'>{errors?.author_name?.message}</small>
          </div>
          <div className="flex flex-col gap-1.5">
            <Input
              type="text"
              label="Year"
              {...register('year')}
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
            <small className='text-red-500 text-sm'>{errors?.year?.message}</small>
          </div>
          <div className="flex flex-col gap-1.5">
            <Input
              type="text"
              label="Publisher"
              {...register('publisher_name')}
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
            <small className='text-red-500 text-sm'>{errors?.publisher_name?.message}</small>
          </div>
          <div className="flex flex-col gap-1.5">
            <Input
              type="text"
              label="Editon"
              {...register('edition')}
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
            <small className='text-red-500 text-sm'>{errors?.edition?.message}</small>
          </div>
          {/* <div className="flex flex-col gap-1.5">
            <Input
              type="date"
              label="Publish Date"
              {...register('is_publish')}
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
            <small className='text-red-500 text-sm'>{errors?.is_publish?.message}</small>
          </div> */}
          <div className="flex flex-col gap-1.5 bg-background-date">
            <DatePicker
              showMonthAndYearPickers
              placeholder=' '
              labelPlacement='outside'
              // onChange={setPublishValue}
              value={publishValue}
              label="Publish Date"
              variant="bordered"
              size='lg'
              onChange={(e)=>handleDateOnChange(e)}
            />
            <small className='text-red-500 text-sm'>{errors?.is_publish?.message}</small>
          </div>

          <div className='flex flex-col gap-1.5'>
            <div>
              <input
                type="file"
                className='hidden'
                accept=".pdf"
                {...register('pdf_file')}
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <label className='block text-medium font-medium text-black dark:text-[#9F9FA5] mb-2'>
              Upload PDF
              </label>
              <div className='bg-white dark:bg-transparent flex items-center justify-between cursor-pointer border border-[#E7E7E9] dark:border-[#3E3E3E] rounded-large py-[0.6rem] px-4 min-h-12 h-12' onClick={handleFileUploadClick}>
                <p className='m-0 text-[#9B9CA1] text-base max-w-[calc(100%-2rem)] break-words'>{selectedFile ? selectedFile.name : 'Upload PDF'}</p>
                <div className='icon'>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className='w-5 h-5' xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.5 11.25V16.25C17.5 16.4158 17.4342 16.5747 17.3169 16.6919C17.1997 16.8092 17.0408 16.875 16.875 16.875H3.125C2.95924 16.875 2.80027 16.8092 2.68306 16.6919C2.56585 16.5747 2.5 16.4158 2.5 16.25V11.25C2.5 11.0842 2.56585 10.9253 2.68306 10.8081C2.80027 10.6909 2.95924 10.625 3.125 10.625C3.29076 10.625 3.44973 10.6909 3.56694 10.8081C3.68415 10.9253 3.75 11.0842 3.75 11.25V15.625H16.25V11.25C16.25 11.0842 16.3158 10.9253 16.4331 10.8081C16.5503 10.6909 16.7092 10.625 16.875 10.625C17.0408 10.625 17.1997 10.6909 17.3169 10.8081C17.4342 10.9253 17.5 11.0842 17.5 11.25ZM7.31719 6.06719L9.375 4.0086V11.25C9.375 11.4158 9.44085 11.5747 9.55806 11.6919C9.67527 11.8092 9.83424 11.875 10 11.875C10.1658 11.875 10.3247 11.8092 10.4419 11.6919C10.5592 11.5747 10.625 11.4158 10.625 11.25V4.0086L12.6828 6.06719C12.8001 6.18447 12.9591 6.25035 13.125 6.25035C13.2909 6.25035 13.4499 6.18447 13.5672 6.06719C13.6845 5.94992 13.7503 5.79086 13.7503 5.625C13.7503 5.45915 13.6845 5.30009 13.5672 5.18282L10.4422 2.05782C10.3841 1.99971 10.3152 1.95361 10.2393 1.92215C10.1635 1.8907 10.0821 1.87451 10 1.87451C9.91787 1.87451 9.83654 1.8907 9.76066 1.92215C9.68479 1.95361 9.61586 1.99971 9.55781 2.05782L6.43281 5.18282C6.31554 5.30009 6.24965 5.45915 6.24965 5.625C6.24965 5.79086 6.31554 5.94992 6.43281 6.06719C6.55009 6.18447 6.70915 6.25035 6.875 6.25035C7.04085 6.25035 7.19991 6.18447 7.31719 6.06719Z" fill="#B5B6BA"/>
                  </svg>
                </div>
              </div>
            </div>
            {
              errors?.pdf_file && <small className='text-red-500 text-sm'>{errors?.pdf_file?.message}</small>
            }
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 mt-6">
          {/* <button
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
          </button> */}
          <Button type="submit" isLoading={isButtonDisabled} className='bg-orange-600 text-white'>
            Save
          </Button>
        </div>
      </form>
    </>
  )
}

export default BookListAddComponent;
