"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const authSelector = useSelector(state => state?.auth);
  const userRole = authSelector?.userInfo?.roleId;
  const router = useRouter();
  const dispatch = useDispatch();
  const token = getCookies();
  const onetimeRef = useRef(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSideBar = useCallback(() => {
    setSideBar(prevState => !prevState);
  }, []);

  // Memoized API calls
  const handleSessionBasedAnswer = useCallback(async (sessionId) => {
    if (!sessionId) return;

    try {
      setIsLoading(true);
      const response = await sessionIdApi(sessionId);
      if (response) {
        setChatData(response?.data?.messages || []);
      }
    } catch (error) {
      console.error("handleSessionBasedAnswer error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleNewChatApi = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await newChatAPi();
      if (response) {
        const { data } = response;
        const newSessionId = data?.session_id;

        // Safe localStorage usage
        if (typeof window !== 'undefined') {
          localStorage.setItem('chatbotSessionId', newSessionId);
        }

        setChatData(data?.messages || []);

        // Navigate based on user role
        const targetPath = userRole === 1
          ? `/super-admin/chatbot/${newSessionId}`
          : `/chatbot/${newSessionId}`;

        router.replace(targetPath);
      }
    } catch (error) {
      console.error("handleNewChatApi error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userRole, router]);

  const handleRefresh = useCallback(async () => {
    await handleNewChatApi();
    setRefreshTrigger(prev => !prev);
    setIsMobileMenuOpen(false);
  }, [handleNewChatApi]);

  // User authentication effect
  useEffect(() => {
    if (token && onetimeRef.current) {
      const getUserMe = async () => {
        try {
          dispatch(setLoginRequest());
          const response = await userMe();
          if (response) {
            const { data: { data } } = response;
            const objData = { userInfo: data };
            dispatch(setUserDetails(objData));
          }
        } catch (error) {
          const errorData = { error };
          dispatch(errorToLogin(errorData));
          console.error("getUserMe error:", error);
        }
      };
      getUserMe();
      onetimeRef.current = false;
    }
  }, [dispatch, token]);

  // Session-based data loading effect
  useEffect(() => {
    if (sessionId) {
      handleSessionBasedAnswer(sessionId);
    }
  }, [sessionId, handleSessionBasedAnswer]);

  // Prevent server-side rendering issues
  if (!isClient) return null;

  return (
    <>
      <style jsx global>{`
        :root {
          --albert-font: ${albertSans.style.fontFamily};
        }
      `}</style>

      <CharboxSidebar
        hideMenu={sideBar}
        newChatOnclick={handleRefresh}
        refreshTrigger={refreshTrigger}
        isMobileOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main className={`main-layout ${
        sideBar
          ? 'lg:ml-[0] lg:w-full'
          : 'lg:ml-[16rem] lg:w-[calc(100%-16rem)]'
        } transition-all bg-[#f1f1f1] dark:bg-[#1a1d21] h-dvh overflow-hidden`}
      >
        <ChatbotHeader
          onClickSideBar={handleSideBar}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        <section className="main-section">
          <ChatbotComponent
            chatData={chatData}
          />
        </section>
      </main>
    </>
  );
};

export default ChatBoxLayout;
