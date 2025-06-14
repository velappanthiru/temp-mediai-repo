"use client";

import BreadcrumbsComponent from "@/layout-component/breadcrumbs";
import { AiDiagnosticApi } from "@/utils/commonapi";
import { Button, Image, Card, CardBody, Progress } from "@heroui/react";
import { usePathname } from "next/navigation";
import { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import ReactMarkdown from 'react-markdown';

const formatMedicalReport = (reportArray) => {
  if (!Array.isArray(reportArray)) return reportArray;

  return reportArray.map(line => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return '';

    if (trimmedLine.includes(':')) {
      const colonIndex = trimmedLine.indexOf(':');
      const key = trimmedLine.substring(0, colonIndex).trim();
      const value = trimmedLine.substring(colonIndex + 1).trim();

      if (key && value) {
        return `**${key}:** ${value}`;
      }
    }

    return trimmedLine;
  }).filter(line => line).join('\n\n');
};

export default function AiFiagnosticFileUpload() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter((segment) => segment);
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);

  const handleFileOnChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    processFiles(selectedFiles);
  }

  const processFiles = (selectedFiles) => {
    const validFiles = selectedFiles.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not a valid image file`, {
          duration: 3000,
          position: 'top-right',
        });
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is 10MB`, {
          duration: 3000,
          position: 'top-right',
        });
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setFiles(prev => [...prev, ...validFiles]);

    validFiles.forEach((file) => {
      const url = URL.createObjectURL(file);
      setPreviews(prev => [...prev, { url, name: file.name, size: file.size }]);
    });

    if (validFiles.length !== selectedFiles.length) {
      toast.success(`${validFiles.length} of ${selectedFiles.length} files added successfully`, {
        duration: 3000,
        position: 'top-right',
      });
    } else {
      toast.success(`${validFiles.length} file${validFiles.length !== 1 ? 's' : ''} added successfully`, {
        duration: 2000,
        position: 'top-right',
      });
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const onSubmit = async () => {
    if (!files || files.length === 0) {
      toast.error('Please upload images', {
        duration: 3000,
        position: 'top-right',
      });
      return false;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await AiDiagnosticApi(formData);

      if (response?.data) {
        console.log("🚀 ~ onSubmit ~ response:", response.data);
        setAnalysisData(response?.data);
        toast.success("AI Diagnostic completed successfully!", {
          duration: 4000,
          position: 'top-right',
        });
        setFiles([]);
        setPreviews([]);
      }
    } catch (error) {
      console.error("❌ Upload error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Upload failed. Please try again.", {
        duration: 4000,
        position: 'top-right',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (indexToRemove) => {
    if (previews[indexToRemove]?.url) {
      URL.revokeObjectURL(previews[indexToRemove].url);
    }

    setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    setPreviews(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const clearAllFiles = () => {
    previews.forEach(preview => {
      if (preview.url) {
        URL.revokeObjectURL(preview.url);
      }
    });

    setFiles([]);
    setPreviews([]);
    toast.success("All files cleared", {
      duration: 1500,
      position: 'top-right',
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      <div className='mb-6'>
        <BreadcrumbsComponent arr={pathSegments} />

        <div className="mt-6 max-w-5xl mx-auto">
          {/* Compact Header */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
              AI Medical Diagnostic
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Upload medical images for AI-powered analysis
            </p>
          </div>

          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileOnChange}
            multiple
          />

          <div className="grid grid-cols-1 gap-6">
            {/* Left Column - Upload & Preview */}
            <div className="flex flex-col gap-4">
              {/* Compact Upload Area */}
              <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-300">
                <CardBody
                  className={`p-4 ${isDragOver ? 'bg-purple-50 dark:bg-purple-900/20' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div
                    className="text-center cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="mb-3">
                      <div className="mx-auto w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-base font-semibold mb-1 text-gray-800 dark:text-gray-200">
                      Drop images here
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      or <span className="text-purple-600 dark:text-purple-400 font-medium">browse</span> to select
                    </p>
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      JPG, PNG • Max 10MB
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Compact File Previews */}
              {previews.length > 0 && (
                <Card>
                  <CardBody className="p-3">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        Images ({previews.length})
                      </h3>
                      <Button
                        variant="light"
                        color="danger"
                        size="xs"
                        onClick={clearAllFiles}
                        className="text-red-600 dark:text-red-400 h-6 min-w-0 px-2"
                      >
                        Clear All
                      </Button>
                    </div>

                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2">
                      {previews.map((preview, idx) => (
                        <div key={idx} className="relative group">
                          <div className="aspect-square rounded-md bg-gray-100 dark:bg-gray-800 relative">
                            <Image
                              src={preview.url}
                              alt={preview.name}
                              className="w-full h-full object-cover"
                              radius="md"
                              classNames={{
                                wrapper: "h-full rounded-md"
                              }}
                            />
                            <button
                              onClick={() => removeFile(idx)}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-lg z-10"
                              type="button"
                            >
                              ×
                            </button>
                          </div>
                          <div className="mt-1 text-xs text-gray-600 dark:text-gray-400 truncate">
                            <div className="font-medium truncate text-xs" title={preview.name}>
                              {preview.name}
                            </div>
                            <div className="text-xs">{formatFileSize(preview.size)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* Upload Progress */}
              {isUploading && (
                <Card>
                  <CardBody className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-600 border-t-transparent"></div>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        Processing with AI...
                      </span>
                    </div>
                    <Progress
                      isIndeterminate
                      color="secondary"
                      className="w-full"
                      size="sm"
                      classNames={{
                        indicator: "bg-gradient-to-r from-purple-500 to-pink-500"
                      }}
                    />
                  </CardBody>
                </Card>
              )}

              {/* Action Button */}
              <div className="flex justify-center">
                <Button
                  color="primary"
                  size="md"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 w-full shadow-lg hover:shadow-xl transition-all duration-300"
                  onPress={onSubmit}
                  isDisabled={files.length === 0 || isUploading}
                  isLoading={isUploading}
                >
                  {isUploading ? (
                    "Analyzing..."
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Start AI Analysis ({files.length})
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Right Column - Results */}
            <div className="flex flex-col gap-4">
              {/* Analysis Results */}
              {analysisData ? (
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-200 dark:border-blue-800">
                  <CardBody className="p-4">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Analysis Results
                    </h3>

                    {analysisData?.interpretation && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Summary:</h4>
                        <p className="text-sm text-gray-800 dark:text-gray-200 bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
                          {analysisData.interpretation}
                        </p>
                      </div>
                    )}

                    {analysisData?.extracted_texts && (
                      <div>
                        <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Detailed Report:</h4>
                        <div className="prose prose-sm max-w-none text-gray-800 dark:text-gray-200 bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
                          <ReactMarkdown>
                            {formatMedicalReport(analysisData.extracted_texts)}
                          </ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </CardBody>
                </Card>
              ) : (
                <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600">
                  <CardBody className="p-6 text-center">
                    <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-200">
                      Analysis Results
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Upload medical images to get AI-powered diagnostic insights and detailed analysis reports.
                    </p>
                  </CardBody>
                </Card>
              )}

              {/* Info/Tips Section */}
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border-green-200 dark:border-green-800">
                <CardBody className="p-4">
                  <h3 className="text-sm font-semibold mb-2 text-green-800 dark:text-green-200 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Tips for Best Results
                  </h3>
                  <ul className="text-xs text-green-700 dark:text-green-300 space-y-1">
                    <li>• Ensure images are clear and well-lit</li>
                    <li>• Include multiple angles if possible</li>
                    <li>• Remove any personal identifying information</li>
                    <li>• Use high-resolution images when available</li>
                  </ul>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
