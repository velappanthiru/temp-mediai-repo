import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { newChatAPi } from '@/utils/commonapi';
import { Spinner } from '@heroui/react';
import { useSelector } from 'react-redux';

const ChatbotIndex = () => {
  const router = useRouter();
  const selector = useSelector(state => state);
  const userRole = selector?.auth?.userInfo?.roleId;
  useEffect(() => {
    const initSession = async () => {
      // 1. Check localStorage for sessionId
      let sessionId = localStorage.getItem('chatbotSessionId');

      // 2. If not found, call API to create one
      if (!sessionId) {
        try {
          const response = await newChatAPi();
          if (response) {
            const data = response?.data;
            console.log("🚀 ~ initSession ~ data:", data)

            sessionId = data?.session_id;
            localStorage.setItem('chatbotSessionId', sessionId);
          }
        } catch (error) {
          console.log("🚀 ~ initSession ~ error:", error)
        }
        // 3. Save to localStorage
      }

      router.replace(`/chatbot/${sessionId}`);

    };

    initSession();
  }, []);

  return <>
    <div className='min-h-dvh flex items-center justify-center'>
      <Spinner size='lg' />
    </div>
  </>;
};

export default ChatbotIndex;
