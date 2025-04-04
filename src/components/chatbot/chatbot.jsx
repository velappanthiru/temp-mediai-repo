import React, { useState, useRef, useEffect } from 'react';
import { IoAttachSharp } from "react-icons/io5";
import { CgArrowLongRight } from "react-icons/cg";
import { getChatApi } from '@/utils/commonapi';

const ChatbotComponent = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom when chat history updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!message.trim()) return;

    // Add user message to chat history
    const userMessage = { type: 'user', content: message };
    setChatHistory(prev => [...prev, userMessage]);

    // Clear input
    setMessage("");
    setIsLoading(true);

    try {
      const response = await getChatApi({
        message,
        use_mistral_only: false
      });

      if (response?.data?.response) {
        // Add bot response to chat history
        const botMessage = {
          type: 'bot',
          content: response.data.response,
          sources: response.data.sources || []
        };
        setChatHistory(prev => [...prev, botMessage]);
      }
    } catch (error) {
      // Add error message to chat
      const errorMessage = {
        type: 'error',
        content: 'Sorry, I encountered an error. Please try again.'
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className='h-[calc(100vh-7rem)] flex flex-col relative'>
      <div
        ref={chatContainerRef}
        className='flex-1 overflow-y-auto pb-32 mx-auto w-full md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem] scroll-smooth scrollbar-hide'
      >
        {chatHistory.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <h2 className="text-2xl font-medium mb-2">Welcome to MediAI</h2>
              <p>Start a conversation by typing a message below.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 pt-6">
            {chatHistory.map((chat, index) => (
              <div
                key={index}
                className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-full rounded-2xl px-4 py-3 ${
                    chat.type === 'user'
                      ? 'bg-[linear-gradient(90deg,#7E41A2_0%,#9246B2_100%)] text-white'
                      : chat.type === 'error'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm'
                  }`}
                >
                  <div>{chat.content}</div>

                  {/* Display sources if they exist */}
                  {chat.sources && chat.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs font-medium mb-1">Sources:</p>
                      <ul className="text-xs list-disc pl-4">
                        {chat.sources.map((source, idx) => (
                          <li key={idx}>{source}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] bg-white dark:bg-gray-800 rounded-2xl rounded-tl-none px-4 py-3 text-gray-800 dark:text-gray-200 shadow-sm">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#7E41A2] dark:bg-gray-500 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-[#7E41A2] dark:bg-gray-500 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-[#7E41A2] dark:bg-gray-500 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Container */}
      <div className='absolute left-0 right-0 bottom-0'>
        <form onSubmit={handleSubmit} className='shadow-lg rounded-2xl bg-white dark:bg-gray-800 p-4 mx-auto w-full md:max-w-3xl lg:max-w-[42rem] xl:max-w-[50rem]'>
          <div className='flex flex-col gap-3'>
            <div className="flex items-center gap-3">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder='Enter a prompt for MediAI'
                className='flex-1 border-0 placeholder:text-gray-500 dark:placeholder:text-gray-400 bg-transparent w-full outline-transparent focus:outline-transparent focus-visible:outline-transparent text-base text-black dark:text-white'
                disabled={isLoading}
              />
              {/* <button
                type="button"
                className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                disabled={isLoading}
              >
                <IoAttachSharp className='w-5 h-5'/>
              </button> */}
              <button
                type="submit"
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                  message.trim()
                  ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
                disabled={!message.trim() || isLoading}
              >
                <CgArrowLongRight className='w-5 h-5'/>
              </button>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
              Press Enter to send
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatbotComponent;
