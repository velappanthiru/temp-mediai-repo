"use client";

import { useEffect, useRef, useState } from "react";
import Header from "./header";

import { Albert_Sans } from 'next/font/google'
import { getCookies } from "@/utils/cookies";
import { useDispatch, useSelector } from "react-redux";
import { newChatAPi, sessionIdApi, userMe } from "@/utils/commonapi";
import { errorToLogin, setLoginRequest, setUserDetails } from "@/reducers/auth";
import CharboxSidebar from "./chatbox-sidebar";
import ChatbotComponent from "@/components/chatbot/chatbot";
import { useRouter } from "next/router";
import ChatbotHeader from "./chatbox-header";

const albertSans = Albert_Sans({
  subsets: ['latin'],
  weight: ['400'],
});

const ChatBoxLayout = ({ sessionId }) => {

  const [isClient, setIsClient] = useState(false);
  const [sideBar, setSideBar] = useState(false);
  const [chatData, setChatData] = useState([]);
  const authSelector = useSelector(state => state?.auth);
  const userRole = authSelector?.userInfo?.roleId;
  const router = useRouter();
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsClient(true); // Runs only on the client
  }, []);

  const handleSideBar = () => {
    const newState = !sideBar;
    setSideBar(newState);
  };
  const dispatch = useDispatch();
  const token = getCookies();
  const onetimeRef = useRef(true)

  useEffect(() => {
    // Get the token from the cookie
    if (token && onetimeRef.current) {
      const getUserMe = async () => {
        try {
          dispatch(setLoginRequest());
          const response = await userMe();
          if (response) {
            const { data: { data } } = response;
            const objData = {
              userInfo: data,
            }
            dispatch(setUserDetails(objData));
          }
        } catch (error) {
          const errorData = {
            error: error
          }
          dispatch(errorToLogin(errorData));
          console.log("🚀 ~ getUserMe:", error)
        }
      }
      getUserMe();
      onetimeRef.current = false;
    }
  }, [dispatch, token])

  const handleSessionBasedAnswer = async (sessionId) => {
    try {
      const response = await sessionIdApi(sessionId);
      if (response) {
        setChatData(response?.data?.messages);
      }
    } catch (error) {
      console.log("🚀 ~ handleSessionBasedAnswer ~ error:", error)
    }
  }

  useEffect(() => {
    if (sessionId) {
      handleSessionBasedAnswer(sessionId)
    }
  }, [sessionId]);


  const handleNewChatApi = async () => {
    try {
      const response = await newChatAPi();
      if (response) {
        const { data } = response;
        let sessionId = data?.session_id;
        localStorage.setItem('chatbotSessionId', sessionId);
        setChatData(data?.messages || []);
        if (userRole === 1) {
          router.replace(`/super-admin/chatbot/${sessionId}`);
        } else {
          router.replace(`/chatbot/${sessionId}`);
        }
      }
    } catch (error) {
      console.log("🚀 ~ handleNewChatApi ~ error:", error);
    }
  }

  const handleRefresh = async () => {
    await handleNewChatApi();
    setRefreshTrigger(prev => !prev);
  }

  if (!isClient) return null; // Avoid rendering server-side

  return (
    <>
      <style jsx global>{`
        :root {
          --albert-font: ${albertSans.style.fontFamily};
        }
      `}</style>
      <CharboxSidebar hideMenu={sideBar} newChatOnclick={handleRefresh} refreshTrigger={refreshTrigger} isMobileOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />


      <main className={`main-layout ${sideBar ? 'lg:ml-[0] lg:w-full' : 'lg:ml-[16rem] lg:w-[calc(100%-16rem)]'} transition-all bg-[#f1f1f1] dark:bg-[#1a1d21] h-dvh overflow-y-auto`}>
        <ChatbotHeader onClickSideBar={handleSideBar} setIsMobileMenuOpen={setIsMobileMenuOpen} />
        <section className={`main-section`}>
          <ChatbotComponent chatData={chatData} />
        </section>
      </main>
    </>
  );
};

export default ChatBoxLayout;

