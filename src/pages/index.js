"use client"
import Link from "next/link";

import { Button, Checkbox, Input } from "@heroui/react";
import { EyeFilledIcon, EyeSlashFilledIcon, LockIcon, MailIcon } from "../utils/icon";
import { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginValidationSchema } from "@/utils/yubSchema/authSchemeValidation";
import { userLoginApi } from "@/utils/commonapi";
import { useDispatch, useSelector } from "react-redux";
import { errorToLogin, setLoginRequest, setUserDetails } from "@/reducers/auth";
import { toast } from "react-hot-toast";
import { setCookies } from "@/utils/cookies";
import { Albert_Sans } from 'next/font/google'

const albertSans = Albert_Sans({
  subsets: ['latin'],
  weight: ['400'],
});

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [buttonDisbale, setButtonDisbale] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const router = useRouter();
  const dispatch = useDispatch();
  const selector = useSelector((state) => state?.auth);

  const { register, handleSubmit, reset, formState } = useForm({
    resolver: yupResolver(
      loginValidationSchema
    ),
    mode: "onSubmit",
    reValidateMode: "onBlur"
  })

  const { errors } = formState;
  const handleSubmitLogin = async (data) => {
    setButtonDisbale(true)
    dispatch(setLoginRequest());
    const { email, password } = data;

    const userData = {
      username: email,
      password: password
    }

    try {
      const response = await userLoginApi(userData);
      if (response) {
        const { data: { data: { email, role, token } } } = response;
        const objData = {
          refreshToken: token,
          userInfo: email,
          success: true
        }
        dispatch(setUserDetails(objData));
        toast.success('Login successfully', {
          duration: 4000,
          position: 'top-right',
        });
        reset();
        setButtonDisbale(false);
        if (role !== null && role !== undefined) {
          setCookies(token, role);
        }
        if (role !== 1) {
          router.push('/chatbot');
        } else {
          router.push('/super-admin/chatbot');
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Something went wrong. Please try again.";

      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-right',
      });
      const errorData = {
        error: errorMessage
      }

      dispatch(errorToLogin(errorMessage));
      console.log("🚀 ~ loginHandleSubmit ~ error:", error);
      handleLoginApiError(error);
    } finally {
      setButtonDisbale(false);
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

  return (
    <section className={`auth-section ${albertSans.className}`}>
      <div className="auth-section__wrapper lg:flex">
        <div className="left-side__wrapper min-h-dvh py-4 px-6 hidden lg:flex flex-col items-center justify-center lg:w-2/4 bg-[linear-gradient(90deg,#7E41A2_0%,#9246B2_100%)]">
          <div className="content-wrapper flex flex-col gap-6">
            <h1 className='m-0 text-white font-bold text-4xl text-center uppercase'>MediAI</h1>

            <div className="flex flex-col gap-4">
              {/* <h6 className='m-0 text-center text-xl font-semibold text-white'>Fast, Efficient and Productive</h6> */}
              <p className='m-0 text-slate-100 text-sm max-w-sm text-center'>
                Welcome to MediAi, an advanced AI-powered medical platform designed to enhance learning and streamline medical knowledge.
              </p>
            </div>
          </div>
        </div>
        <div className="right-side__wrapper min-h-dvh py-4 px-6 flex flex-col justify-center lg:w-2/4">
          <div className="form-content__wrapper md:px-12 max-w-[600px] w-full mx-auto">
            <div className="auth-form__title">
              <h3 className='m-0 mb-4 text-3xl font-bold text-black dark:text-white'>Sign In</h3>
              <p className='m-0 text-sm text-black dark:text-white'>Welcome back MediAI !</p>
            </div>
            <form onSubmit={handleSubmit(handleSubmitLogin)}>
              <div className="flex flex-col gap-6 mt-6">
                <div className="form-group">
                  <Input
                    autoFocus
                    startContent={
                      <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                    }
                    label="Email"
                    placeholder="Enter your email"
                    variant="bordered"
                    labelPlacement='outside'
                    autoComplete='on'
                    {...register('email')}
                  />
                  <small className='err-mge text-red-700 dark:text-red-500 text-sm'>{errors?.email?.message}</small>
                </div>
                <div className="form-group">
                  <Input
                    startContent={
                      <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0"/>
                    }
                    endContent={
                      <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                        {isVisible ? (
                          <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                    {...register('password')}
                    label="Password"
                    placeholder="Enter your password"
                    type={isVisible ? "text" : "password"}
                    variant="bordered"
                    labelPlacement='outside'
                    autoComplete='off'
                  />
                  <small className='err-mge text-red-700 dark:text-red-500 text-sm'>{errors?.password?.message}</small>
                </div>
                <div className="flex justify-between items-center w-full">
                  <Checkbox defaultSelected className='py-0' radius="sm" size="md" color="primary">Remember me</Checkbox>
                  <Link href={"/"} className='text-[#016fee] text-md'>
                    Forgot Password ?
                  </Link>
                </div>

              </div>
              <Button type="submit" isLoading={buttonDisbale} className="bg-[linear-gradient(90deg,#7E41A2_0%,#9246B2_100%)] text-white w-full mt-4">Sign In</Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
