import React, { useState, useRef, useEffect } from 'react';
import { CgArrowLongRight } from "react-icons/cg";
import { FiMessageSquare, FiPaperclip, FiX } from "react-icons/fi";
import { getChatApi, imageToText, newChatAPi, toggleApi } from '@/utils/commonapi';
import ReactMarkdown from 'react-markdown';
import { Button, Checkbox, Chip, Input } from '@heroui/react';
import { TbRefresh } from "react-icons/tb";
import { LuBrain, LuFileText, LuStethoscope } from 'react-icons/lu';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

const ChatbotComponent = ({ chatData }) => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [preview, setPreview] = useState([]);
  const [imageFile, setImageFile] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const [isChecked, setIsChecked] = useState(true);
  const authSelector = useSelector(state => state?.auth);
  const userRole = authSelector?.userInfo?.roleId;
  const router = useRouter();
  const fileInputRef = useRef(null);


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

  useEffect(() => {
    setChatHistory(chatData);
  }, [chatData]);


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

  // Helper function to safely get string content
  const getStringContent = (content) => {
    if (typeof content === 'string') {
      return content;
    }
    if (typeof content === 'object' && content !== null) {
      return JSON.stringify(content);
    }
    return String(content || '');
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files); // Convert FileList to Array
    if (!files.length) return;

    const validFiles = [];
    const invalidFiles = [];

    files.forEach(file => {
      // Check if it's an image
      const isImage = file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB

      if (!isImage) {
        invalidFiles.push(`${file.name} - Not an image file`);
        return;
      }

      if (!isValidSize) {
        invalidFiles.push(`${file.name} - File size exceeds 10MB`);
        return;
      }

      validFiles.push(file);
    });

    // Show alerts for invalid files
    if (invalidFiles.length > 0) {
      alert(`The following files were rejected:\n${invalidFiles.join('\n')}`);
    }

    if (validFiles.length > 0) {
      const newFileObjects = validFiles.map(file => ({
        file,
        id: Date.now() + Math.random() + file.name, // Unique ID
        name: file.name,
        size: file.size,
        type: file.type,
        preview: URL.createObjectURL(file)
      }));

      // Add to existing files instead of replacing
      setImageFile(prev => Array.isArray(prev) ? [...prev, ...validFiles] : [...validFiles]);
      setPreview(prev => Array.isArray(prev) ? [...prev, ...newFileObjects] : [...newFileObjects]);
    }

    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const removeAttachedFile = (id) => {
   // Remove from both arrays
   setPreview(prev => prev.filter(p => p.id !== id));
   setImageFile(prev => {
     const previewIndex = preview.findIndex(p => p.id === id);
     if (previewIndex !== -1) {
       return prev.filter((_, index) => index !== previewIndex);
     }
     return prev;
   });
  };

  const onSubmitImageToText = async () => {
    setIsLoading(true);

    // Update UI immediately for better UX
    const userChatMessage = {
      role: 'user',
      attachments: preview.map(preview => ({ // Changed to attachments array
        type: preview.type,
        name: preview.name,
        size: preview.size,
        preview: preview.preview
      }))
    };
    setChatHistory(prev => [...prev, userChatMessage]);

    try {
      if (imageFile) {
        const formData = new FormData();
        imageFile.forEach((image) => {
          formData.append("files", image); // use file[]
        });

        const response = await imageToText(formData);
        const data = response?.data?.texts;
        const assistantChatMessage = {
          role: 'assistant',
          content: {
            medical_report: data
          }
        };
        setChatHistory(prev => [...prev, assistantChatMessage]);
      }
    } catch (error) {
      console.log("🚀 ~ onSubmitImageToText ~ error:", error)
    } finally {
      setIsLoading(false);
      setImageFile(null);
      setPreview(null);
    }
  }

  const formatMedicalReport = (reportArray) => {
    if (!Array.isArray(reportArray)) return reportArray;

    return reportArray.map(line => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return '';

      // Check if line contains colon for key-value formatting
      if (trimmedLine.includes(':')) {
        const colonIndex = trimmedLine.indexOf(':');
        const key = trimmedLine.substring(0, colonIndex).trim();
        const value = trimmedLine.substring(colonIndex + 1).trim();

        if (key && value) {
          return `**${key}:** ${value}`;
        }
      }

      // Return as is if no colon or formatting needed
      return trimmedLine;
    }).filter(line => line).join('\n\n');
  };

  return (
    <div className='h-[calc(100dvh-80px)] flex flex-col relative bg-white dark:bg-[#292e32]'>
      {/* <div className='flex justify-end p-4 border-b border-neutral-200 dark:border-neutral-600'>
        <div className={`p-4 text-black dark:text-white ${chatHistory?.length === 0 ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
          onClick={handleRefresh}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
          </svg>
        </div>
      </div> */}
      <div
        ref={chatContainerRef}
        className={`flex-1 overflow-y-auto ${preview ? "pb-[230px]" : "pb-40"} scroll-smooth scrollbar-hide`}
      >
        {chatHistory?.length === 0 ? (
          <div className="flex flex-col h-full p-4 mx-auto w-full md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem]">
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
          <div className="flex flex-col gap-6 pt-6 px-4 mx-auto w-full md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem]">
            {chatHistory?.map((chat, index) => (
              <>
                {
                  chat?.role === "user" && <div
                    key={`user_${index}`}
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
                      {/* Handle multiple attachments */}
                      {chat?.attachments && chat.attachments.length > 0 && (
                        <div className="mb-3 space-y-2">
                          {chat.attachments.map((attachment, attachIndex) => (
                            <div key={attachIndex} className="flex items-center gap-2 bg-white/10 rounded-lg p-2">
                              <img
                                src={attachment?.preview}
                                alt={attachment?.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{attachment?.name}</p>
                                <p className="text-xs opacity-75">{formatFileSize(attachment?.size)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
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
                          {getStringContent(chat.content)}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                }
                {
                  chat?.role === "assistant" && <div
                    key={`assistant_${index}`}
                    className={`flex flex-col gap-4 ${chat.role === 'user' ? 'justify-end' : 'justify-center'}`}
                  >
                    {/* Medical Report Display */}
                    {chat?.content?.medical_report && (
                      <div className="max-w-full rounded-2xl px-4 py-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:bg-gradient-to-br dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700 shadow-md">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                            <LuFileText className="text-white w-4 h-4" />
                          </div>
                          <span className="text-base font-semibold text-blue-700 dark:text-blue-300">
                            Medical Report
                          </span>
                        </div>
                        <div className="prose prose-sm dark:prose-invert max-w-none break-words bg-white/50 rounded-lg p-4">
                          <ReactMarkdown>
                            {formatMedicalReport(chat?.content?.medical_report)}
                          </ReactMarkdown>
                        </div>
                      </div>
                    )}
                    {
                      !chat?.content?.media_ai && !chat?.content?.common_ai && !chat?.content?.medi_ai && !chat?.content?.medical_report && <div
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
                            {getStringContent(chat?.content)}
                          </ReactMarkdown>
                        </div>
                      </div>
                    }
                    {
                      chat?.content?.media_ai && chat?.content?.media_ai?.trim() !== "" && <div
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
                            {getStringContent(chat?.content?.media_ai)}
                          </ReactMarkdown>
                        </div>
                      </div>
                    }
                    {
                      chat?.content?.medi_ai && chat?.content?.medi_ai?.trim() !== "" &&  <div
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
                            {getStringContent(chat?.content?.medi_ai)}
                          </ReactMarkdown>
                        </div>
                      </div>
                    }
                    {
                      chat?.content?.common_ai && chat?.content?.common_ai?.trim() !== "" && <div
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
                            {getStringContent(chat?.content?.common_ai)}
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

      <div className='absolute left-4 right-4 bottom-0'>
        <form onSubmit={handleSubmit} className='shadow rounded-2xl border border-neutral-200 dark:border-neutral-600 bg-neutral-50 dark:bg-zinc-800 p-4 mx-auto w-full md:max-w-3xl lg:max-w-[42rem] xl:max-w-[50rem]'>
          <div className='flex flex-col gap-3'>
            <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
              {preview && preview?.length > 0 && (
                preview?.map((image, index) => (
                    <div
                      key={image.id}
                      className="relative flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg p-2 pr-8"
                    >
                      {image.type.startsWith('image/') && (
                        <img
                          src={image.preview}
                          alt={image.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate max-w-[120px]">{image.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(image.size)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachedFile(image.id)}
                        className="absolute top-1 right-1 w-4 h-4 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </div>
                ))
              )}
            </div>
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
              {/* File upload button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-10 h-10 flex items-center justify-center rounded-full transition-colors bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300"
                disabled={isLoading}
              >
                <FiPaperclip className="w-5 h-5" />
              </button>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            <div className="flex items-center justify-between">
              <Checkbox color='secondary'
                isSelected={isChecked}
                onChange={onCheckboxChange}
              >
                Use Base Model
              </Checkbox>
              {
                preview?.length === 0 ? <button
                  type="submit"
                  className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors bg-purple-600 text-white ${
                    message.trim()
                    ? 'opacity-100 hover:bg-purple-700 cursor-pointer'
                    : 'opacity-50 cursor-not-allowed'
                  }`}
                  disabled={!message.trim() || isLoading}
                >
                  <CgArrowLongRight className='w-5 h-5'/>
                </button> : <button
                  onClick={onSubmitImageToText}
                  disabled={isLoading}
                  type='button'
                  className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors bg-purple-600 text-white opacity-100 hover:bg-purple-700 cursor-pointer`}
                >
                  <CgArrowLongRight className='w-5 h-5'/>
                </button>
              }
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatbotComponent;
