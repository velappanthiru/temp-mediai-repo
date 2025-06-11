"use client";

import { Input } from '@heroui/input';
import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation';
import BreadcrumbsComponent from '../../layout-component/breadcrumbs';
import { Button, Radio, RadioGroup, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@heroui/react';
import { questionSchema } from '@/utils/yubSchema/validate';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { bookTopicsandTitleApi, generateQuestionsApi } from '@/utils/commonapi';
import { toast } from 'react-hot-toast';
import ExamPreview from './online-exam';
import Select from 'react-select';




const OnlineExamAdd = () => {
  const pathname = usePathname();

  // Split the current path into segments and filter out empty strings
  const pathSegments = pathname.split('/').filter((segment) => segment);

  const [generatedExam, setGeneratedExam] = useState(null);
  const [topics, setTopics] = useState([]);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting, isSubmitSuccessful }, control } = useForm({
    resolver: yupResolver(questionSchema),
    mode: "onSubmit",
    reValidateMode: "onBlur",
    defaultValues: {
      ai_option: "" // Set default value for radio group (empty string for radio)
    }
  })

  const handleSubmitLogin = async (data) => {
    try {
      const response = await generateQuestionsApi(data);
      if (response) {
        setGeneratedExam(response.data || []);
        reset();
        toast.success('Question is generate successfully', {
          duration: 3000,
          position: 'top-right',
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong. Please try again.", {
        duration: 3000,
        position: 'top-right',
      })

      console.log("🚀 ~ reviewHandleSubmit ~ error:", error);
    }
  }

  const handlePreview = () => {
    if (generatedExam) {
      onOpen();
    } else {
      toast.error('No exam data to preview. Please generate questions first.', {
        duration: 3000,
        position: 'top-right',
      });
    }
  };

  const handleOnSave = () => {
    setGeneratedExam(null);
  }

  const fetchBookTopicsandTitle = async () => {
    setTopicsLoading(true);
    try {
      const response = await bookTopicsandTitleApi();
      if (response?.data) {
        const options = response.data.map((book) => ({
          value: book,
          label: book,
        }));
        setTopics(options);
      }
    } catch (error) {
      console.log("🚀 ~ fetchBookTopicsandTitle ~ error:", error);
    } finally {
      setTopicsLoading(false);
    }
  };


  useEffect(() => {
    fetchBookTopicsandTitle();
  }, [])

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

  const handleSelectChange = (e) => {
    setValue("book_name", e?.label);
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
              label="Exam Name"
              {...register("exam_name")}
              placeholder=' '
              labelPlacement='outside'
              size='lg'
              classNames={
                {
                  base: "data-[has-label=true]:mt-[calc(theme(fontSize.small)_+_18px)]",
                  label: "block text-base font-medium text-black dark:text-[#9F9FA5] group-data-[filled-within=true]:text-[#000] group-data-[filled-within=true]:dark:text-[#9F9FA5]",
                  inputWrapper: "block bg-white dark:bg-transparent data-[hover=true]:bg-white dark:data-[hover=true]:bg-black group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-black shadow-none w-full px-4 py-2 h-10 border border-[#E7E7E9] dark:border-[#3E3E3E] data-[hover=true]:border-[#E7E7E9] data-[hover=true]:dark:border-[#3E3E3E] group-data-[focus=true]:border-[#E7E7E9] group-data-[focus=true]:dark:border-[#3E3E3E] rounded-xl focus:outline-none",
                  input: "text-base font-medium text-[#343437] dark:text-white placeholder-[#9B9CA1]"
                }
              }
            />
            {
              errors?.exam_name && <small className='text-red-500 text-sm'>{errors?.exam_name?.message}</small>
            }
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="block text-base font-medium text-black dark:text-[#9F9FA5]">Topic or Books Name ( Google Search option)</label>
            <Controller
              name="book_name"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select
                  id={`state-select-timeDurationOptions`}
                  className="basic-single"
                  isClearable={true}
                  isSearchable={true}
                  isLoading={topicsLoading}
                  options={topics}
                  theme={customTheme}
                  styles={customSelectStyles}
                  value={topics.find(option => option.label === value) || null}
                  onChange={(selectedOption) => {
                    onChange(selectedOption?.label || "");
                  }}
                />
              )}
            />
            {errors?.book_name && <small className='text-red-500 text-sm'>{errors?.book_name?.message}</small>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Input
              type="date"
              label="Exam date"
              placeholder=' '
              labelPlacement='outside'
              {...register("date")}
              size='lg'
              classNames={
                {
                  base: "data-[has-label=true]:mt-[calc(theme(fontSize.small)_+_18px)]",
                  label: "block text-base font-medium text-black dark:text-[#9F9FA5] group-data-[filled-within=true]:text-[#000] group-data-[filled-within=true]:dark:text-[#9F9FA5]",
                  inputWrapper: "block bg-white dark:bg-transparent data-[hover=true]:bg-white dark:data-[hover=true]:bg-black group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-black shadow-none w-full px-4 py-2 h-10 border border-[#E7E7E9] dark:border-[#3E3E3E] data-[hover=true]:border-[#E7E7E9] data-[hover=true]:dark:border-[#3E3E3E] group-data-[focus=true]:border-[#E7E7E9] group-data-[focus=true]:dark:border-[#3E3E3E] rounded-xl focus:outline-none",
                  input: "text-base font-medium text-[#343437] dark:text-white placeholder-[#9B9CA1]"
                }
              }
            />
            {
              errors?.date && <small className='text-red-500 text-sm'>{errors?.date?.message}</small>
            }
          </div>

          <div className="flex flex-col gap-1.5">
            <Input
              type="number"
              label="Time duration"
              {...register("duration")}
              placeholder=' '
              labelPlacement='outside'
              size='lg'
              classNames={
                {
                  base: "data-[has-label=true]:mt-[calc(theme(fontSize.small)_+_18px)]",
                  label: "block text-base font-medium text-black dark:text-[#9F9FA5] group-data-[filled-within=true]:text-[#000] group-data-[filled-within=true]:dark:text-[#9F9FA5]",
                  inputWrapper: "block bg-white dark:bg-transparent data-[hover=true]:bg-white dark:data-[hover=true]:bg-black group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-black shadow-none w-full px-4 py-2 h-10 border border-[#E7E7E9] dark:border-[#3E3E3E] data-[hover=true]:border-[#E7E7E9] data-[hover=true]:dark:border-[#3E3E3E] group-data-[focus=true]:border-[#E7E7E9] group-data-[focus=true]:dark:border-[#3E3E3E] rounded-xl focus:outline-none",
                  input: "text-base font-medium text-[#343437] dark:text-white placeholder-[#9B9CA1]"
                }
              }
            />
            {
              errors?.duration && <small className='text-red-500 text-sm'>{errors?.duration?.message}</small>
            }
          </div>

          <div className="flex flex-col gap-1.5">
            <Input
              type="number"
              label="Total number question"
              {...register("total_questions")}
              placeholder='e.g. 10'
              labelPlacement='outside'
              size='lg'
              classNames={
                {
                  base: "data-[has-label=true]:mt-[calc(theme(fontSize.small)_+_18px)]",
                  label: "block text-base font-medium text-black dark:text-[#9F9FA5] group-data-[filled-within=true]:text-[#000] group-data-[filled-within=true]:dark:text-[#9F9FA5]",
                  inputWrapper: "block bg-white dark:bg-transparent data-[hover=true]:bg-white dark:data-[hover=true]:bg-black group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-black shadow-none w-full px-4 py-2 h-10 border border-[#E7E7E9] dark:border-[#3E3E3E] data-[hover=true]:border-[#E7E7E9] data-[hover=true]:dark:border-[#3E3E3E] group-data-[focus=true]:border-[#E7E7E9] group-data-[focus=true]:dark:border-[#3E3E3E] rounded-xl focus:outline-none",
                  input: "text-base font-medium text-[#343437] dark:text-white placeholder-[#9B9CA1]"
                }
              }
            />
            {
              errors?.total_questions && <small className='text-red-500 text-sm'>{errors?.total_questions?.message}</small>
            }
          </div>

          <div className="flex flex-col gap-1.5">
            <Input
              type="number"
              label="Marks Per Question"
              placeholder='e.g. 1'
              labelPlacement='outside'
              {...register("marks_per_question")}
              size='lg'
              classNames={
                {
                  base: "data-[has-label=true]:mt-[calc(theme(fontSize.small)_+_18px)]",
                  label: "block text-base font-medium text-black dark:text-[#9F9FA5] group-data-[filled-within=true]:text-[#000] group-data-[filled-within=true]:dark:text-[#9F9FA5]",
                  inputWrapper: "block bg-white dark:bg-transparent data-[hover=true]:bg-white dark:data-[hover=true]:bg-black group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-black shadow-none w-full px-4 py-2 h-10 border border-[#E7E7E9] dark:border-[#3E3E3E] data-[hover=true]:border-[#E7E7E9] data-[hover=true]:dark:border-[#3E3E3E] group-data-[focus=true]:border-[#E7E7E9] group-data-[focus=true]:dark:border-[#3E3E3E] rounded-xl focus:outline-none",
                  input: "text-base font-medium text-[#343437] dark:text-white placeholder-[#9B9CA1]"
                }
              }
            />
            {
              errors?.marks_per_question && <small className='text-red-500 text-sm'>{errors?.marks_per_question?.message}</small>
            }
          </div>

          {/* Fixed RadioGroup using Controller */}
          <div className="flex flex-col gap-1.5">
            <label className="block text-base font-medium text-black dark:text-[#9F9FA5]">
              AI Options
            </label>
            <Controller
              name="ai_option"
              control={control}
              render={({ field: { onChange, value } }) => (
                <RadioGroup
                  color="secondary"
                  value={value || ""}
                  onChange={onChange}
                  orientation="horizontal"
                  classNames={{
                    wrapper: "gap-4"
                  }}
                >
                  <Radio value="Common ai">Common Ai</Radio>
                  <Radio value="MediAI">MediAi</Radio>
                </RadioGroup>
              )}
            />
            {
              errors?.ai_option && <small className='text-red-500 text-sm'>{errors?.ai_option?.message}</small>
            }
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-4 mt-6">
          <Button
            type='submit'
            disabled={isSubmitting}
            isLoading={isSubmitting}
            color='secondary'
          >
            {isSubmitting ? 'Generating...' : 'Generate'}
          </Button>
          <Button
            type='button'
            disabled={!isSubmitSuccessful}
            color='secondary'
            onPress={handlePreview}
          >
            Preview
          </Button>
          <button
            type="button"
            className="bg-gray-300 dark:bg-gray-700 dark:text-white px-6 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
      {/* Preview Modal */}
      {
        isOpen && <ExamPreview
          examData={generatedExam}
          isOpen={isOpen}
          onClose={onClose}
          onSave={handleOnSave}
        />
      }
    </>
  )
}

export default OnlineExamAdd;
