import React, { useState, useRef, useEffect } from 'react';
import { CgArrowLongRight } from "react-icons/cg";
import { FiMessageSquare } from "react-icons/fi";
import { getChatApi, newChatAPi, toggleApi } from '@/utils/commonapi';
import ReactMarkdown from 'react-markdown';
import { Button, Checkbox, Chip, Input } from '@heroui/react';
import { TbRefresh } from "react-icons/tb";
import { LuBrain, LuStethoscope } from 'react-icons/lu';

const ChatbotComponent = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const [isChecked, setIsChecked] = useState(true);

  // Scroll to bottom when chat history updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!message.trim()) return;
    const userMessage = message.trim();
    // Update UI immediately for better UX
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);

    // Clear input
    setMessage("");
    setIsLoading(true);

    try {
      const response = await getChatApi({
        message,
        use_mistral_only: false
      });

      if (response?.data?.messages) {
        setChatHistory(response?.data?.messages);
      }
    } catch (error) {
      // Add error message to chat
      const errorMessage = {
        role: 'error',
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

  const handleToggle = async (payload) => {
    try {
      const { data: { data } } = await toggleApi(payload);
      console.log('Toggle response:', data);
    } catch (error) {
      console.error("🚀 ~ handleToggle ~ error:", error);
    }
  };

  const onCheckboxChange = async (e) => {
    const checked = e.target.checked;
    setIsChecked(checked);

    await handleToggle({ medi_ai_mode: checked });
  };

  const handleNewChatApi = async () => {
    try {
      const response = await newChatAPi();
      if (response) {
        const { data } = response;
        setChatHistory(data?.messages || []);
      }
    } catch (error) {
      console.log("🚀 ~ handleNewChatApi ~ error:", error);
    }
  }

  const handleRefresh = async () => {
    if (chatHistory?.length > 0) {
      await handleNewChatApi();
    }
  }
  return (
    <div className='h-[calc(100vh-7rem)] flex flex-col relative bg-white dark:bg-[#292e32] rounded-xl'>
      <div className='flex justify-end p-4 border-b border-neutral-200 dark:border-neutral-600'>
        <div className={`p-4 text-black dark:text-white ${chatHistory?.length === 0 ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
          onClick={handleRefresh}
        >
          <TbRefresh className={`w-6 h-6`} disabled={chatHistory?.length === 0} />
        </div>
      </div>
      <div
        ref={chatContainerRef}
        className={`flex-1 overflow-y-auto pb-40 mx-auto w-full md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem] scroll-smooth scrollbar-hide`}
      >
        {chatHistory?.length === 0 ? (
          <div className="flex flex-col h-full p-4">
            <div className="text-center w-full md:max-w-3xl lg:max-w-[35rem] my-auto mx-auto">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center animate-pulse">
                <FiMessageSquare className="text-white w-8 h-8" />
              </div>
              <h2 className="text-2xl font-medium mb-2">Welcome to MediAI</h2>
              <p>Your Al-powered medical assistant. Ask me anything about health, wellness, or medical information.</p>
            </div>
            <div className="hidden flex-wrap gap-3 justify-center mt-4">
              {[
                "What are the symptoms of seasonal allergies?",
                "How can I lower my blood pressure naturally?",
                "What foods are good for gut health?",
                "What are common causes of headaches?",
                "How much water should I drink daily?",
                "What exercises are best for back pain?"
              ].map((suggestion, i) => (
                <Chip
                  key={i}
                  variant="flat"
                  color='default'
                  className='cursor-pointer'
                  onClick={() => {
                    setMessage(suggestion);
                    setTimeout(() => handleSubmit(), 100);
                  }}
                >
                  {suggestion}
                </Chip>
              ))}
            </div>
          </div>

        ) : (
          <div className="flex flex-col gap-6 pt-6 px-4">
            {chatHistory?.map((chat, index) => (
              <>
                {
                  chat?.role === "user" && <div
                    key={index}
                    className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-full rounded-2xl px-4 py-3 ${
                        chat.role === 'user'
                          ? 'bg-[linear-gradient(90deg,#7E41A2_0%,#9246B2_100%)] text-white'
                          : chat.role === 'error'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      <div className="prose prose-sm dark:prose-invert max-w-none break-words">
                        <ReactMarkdown
                          components={{
                            h1: ({node, ...props}) => <h1 className="text-xl font-bold mt-3 mb-2" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-lg font-bold mt-3 mb-2" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-md font-bold mt-2 mb-1" {...props} />,
                            p: ({node, ...props}) => <p className={`${chat?.role === "user" ? "mb-0" : "mb-2"}`} {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2" {...props} />,
                            li: ({node, ...props}) => <li className="mb-1" {...props} />
                          }}
                        >
                          {chat.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                }
                {
                  chat?.role === "assistant" && <div
                    key={index}
                    className={`flex flex-col gap-4 ${chat.role === 'user' ? 'justify-end' : 'justify-center'}`}
                  >
                    {
                      chat?.content?.media_ai &&  <div
                        className={`max-w-full rounded-2xl px-4 py-3 ${ chat?.role === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-gradient-to-br from-purple-50 to-purple-100 dark:bg-gradient-to-br dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-4 border border-purple-200 dark:border-purple-700 shadow-md'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                            <LuStethoscope className="text-white w-4 h-4" />
                          </div>
                          <span className="text-base font-semibold text-purple-700 dark:text-purple-300">
                            Medical AI
                          </span>
                        </div>
                        <div className="prose prose-sm dark:prose-invert max-w-none break-words">
                          <ReactMarkdown
                            components={{
                              h1: ({node, ...props}) => <h1 className="text-xl font-bold mt-3 mb-2" {...props} />,
                              h2: ({node, ...props}) => <h2 className="text-lg font-bold mt-3 mb-2" {...props} />,
                              h3: ({node, ...props}) => <h3 className="text-md font-bold mt-2 mb-1" {...props} />,
                              p: ({node, ...props}) => <p className={`${chat?.role === "user" ? "mb-0" : "mb-2"}`} {...props} />,
                              ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2" {...props} />,
                              ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2" {...props} />,
                              li: ({node, ...props}) => <li className="mb-1" {...props} />
                            }}
                          >
                            {chat?.content?.media_ai ? chat?.content?.media_ai : chat?.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    }
                    {
                      chat?.content?.common_ai &&  <div
                        className={`max-w-full rounded-2xl px-4 py-3 ${ chat?.role === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-gradient-to-br from-indigo-50 to-indigo-100 dark:bg-gradient-to-br dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-2xl p-4 border border-indigo-200 dark:border-indigo-700 shadow-md'
                        }`}
                      >
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                          <LuBrain className="text-white w-4 h-4" />
                        </div>
                        <span className="text-base font-semibold text-indigo-700 dark:text-indigo-300">
                          General AI
                        </span>
                      </div>
                        <div className="prose prose-sm dark:prose-invert max-w-none break-words">
                          <ReactMarkdown
                            components={{
                              h1: ({node, ...props}) => <h1 className="text-xl font-bold mt-3 mb-2" {...props} />,
                              h2: ({node, ...props}) => <h2 className="text-lg font-bold mt-3 mb-2" {...props} />,
                              h3: ({node, ...props}) => <h3 className="text-md font-bold mt-2 mb-1" {...props} />,
                              p: ({node, ...props}) => <p className={`${chat?.role === "user" ? "mb-0" : "mb-2"}`} {...props} />,
                              ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2" {...props} />,
                              ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2" {...props} />,
                              li: ({node, ...props}) => <li className="mb-1" {...props} />
                            }}
                          >
                            {chat?.content?.common_ai ? chat?.content?.common_ai : chat?.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    }
                    {
                      !chat?.content?.media_ai && !chat?.content?.common_ai && <div
                        className={`max-w-full rounded-2xl px-4 py-3 ${ chat?.role === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-gradient-to-br from-purple-50 to-purple-100 dark:bg-gradient-to-br dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-4 border border-purple-200 dark:border-purple-700 shadow-md'
                        }`}
                      >
                         <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                            <LuStethoscope className="text-white w-4 h-4" />
                          </div>
                          <span className="text-base font-semibold text-purple-700 dark:text-purple-300">
                            Medical AI
                          </span>
                        </div>
                        <div className="prose prose-sm dark:prose-invert max-w-none break-words">
                          <ReactMarkdown
                            components={{
                              h1: ({node, ...props}) => <h1 className="text-xl font-bold mt-3 mb-2" {...props} />,
                              h2: ({node, ...props}) => <h2 className="text-lg font-bold mt-3 mb-2" {...props} />,
                              h3: ({node, ...props}) => <h3 className="text-md font-bold mt-2 mb-1" {...props} />,
                              p: ({node, ...props}) => <p className={`${chat?.role === "user" ? "mb-0" : "mb-2"}`} {...props} />,
                              ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2" {...props} />,
                              ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2" {...props} />,
                              li: ({node, ...props}) => <li className="mb-1" {...props} />
                            }}
                          >
                            {chat?.content ? chat?.content : ""}
                          </ReactMarkdown>
                        </div>
                      </div>
                    }

                  </div>
                }
              </>
            ))}
            {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-sm border border-gray-200 dark:border-gray-700 max-w-md">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <LuStethoscope className="text-white w-4 h-4" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" style={{ width: '120px' }}></div>
                        <div className="flex gap-1">
                          <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1.4s' }}></div>
                          <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '160ms', animationDuration: '1.4s' }}></div>
                          <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '320ms', animationDuration: '1.4s' }}></div>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" style={{ width: '100%', animationDelay: '0.1s' }}></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" style={{ width: '85%', animationDelay: '0.2s' }}></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" style={{ width: '70%', animationDelay: '0.3s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            )}
          </div>
        )}
      </div>

      <div className='absolute left-4 right-4 bottom-3'>
        <form onSubmit={handleSubmit} className='shadow rounded-2xl border border-neutral-200 dark:border-neutral-600 bg-neutral-50 dark:bg-zinc-800 p-4 mx-auto w-full md:max-w-3xl lg:max-w-[42rem] xl:max-w-[50rem]'>
          <div className='flex flex-col gap-3'>
            <div className="flex items-center gap-3">
              <Input
                ref={inputRef}
                label=""
                value={message}
                disabled={isLoading}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask MediAI..."
                type="text"

                classNames={
                  {
                    label: "block text-base font-medium text-black dark:text-[#9F9FA5] group-data-[filled-within=true]:text-[#000] group-data-[filled-within=true]:dark:text-[#9F9FA5]",
                    inputWrapper: "block bg-transparent dark:bg-transparent data-[hover=true]:bg-transparent dark:data-[hover=true]:bg-transparent group-data-[focus=true]:bg-transparent dark:group-data-[focus=true]:bg-transparent shadow-none w-full px-4 py-2 h-12 border border-[#E7E7E9] dark:border-[#3E3E3E] data-[hover=true]:border-[#E7E7E9] data-[hover=true]:dark:border-[#3E3E3E] group-data-[focus=true]:border-[#E7E7E9] group-data-[focus=true]:dark:border-[#3E3E3E] rounded-xl focus:outline-none",
                    input: "text-base font-medium text-[#343437] dark:text-white placeholder-[#9B9CA1]"
                  }
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Checkbox color='secondary'
                isSelected={isChecked}
                onChange={onCheckboxChange}
              >
                Use Base Model
              </Checkbox>
              <button
                type="submit"
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors bg-purple-600 text-white ${
                  message.trim()
                  ? 'opacity-100 hover:bg-purple-700 cursor-pointer'
                  : 'opacity-50 cursor-not-allowed'
                }`}
                disabled={!message.trim() || isLoading}
              >
                <CgArrowLongRight className='w-5 h-5'/>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatbotComponent;
