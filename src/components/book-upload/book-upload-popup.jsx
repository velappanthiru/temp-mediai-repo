import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  addToast
} from "@heroui/react";
import { fileUploadApi } from '@/utils/commonapi';

// Yup validation schema
const schema = yup.object().shape({
  collectionName: yup
    .string()
    .required('Collection name is required')
    .min(3, 'Collection name must be at least 3 characters'),
  files: yup
    .array()
    .min(1, 'At least one PDF file is required')
    .test(
      'is-pdf',
      'Only PDF files are allowed',
      (value) => value && value.every(fileObj =>
        fileObj.file.type === 'application/pdf' ||
        fileObj.file.name.toLowerCase().endsWith('.pdf')
      )
    )
});

const BookUploadPopup = ({ isOpen, onOpenChange, onSubmit }) => {
  const fileInputRef = useRef(null);
  const [uploadMode, setUploadMode] = useState('files'); // 'files' or 'folder'
  const [isSubmiting, setIsSubmiting] = useState(false); // 'files' or 'folder'

  // React Hook Form setup
  const { register, handleSubmit, setValue, watch, formState: { errors, isValid }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      collectionName: '',
      files: []
    }
  });

  const files = watch('files') || [];

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);

    // Collect file + relative path
    const withPaths = selectedFiles.map(file => ({
      file,
      relativePath: file.webkitRelativePath || file.name
    }));

    // Filter for PDF files only
    const pdfFiles = withPaths.filter(({ file }) =>
      file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    );

    if (pdfFiles.length) {
      // Update form value
      setValue('files', [...files, ...pdfFiles], { shouldValidate: true });
    } else {
      alert("Please select PDF files only");
    }
  };

  const removeFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setValue('files', updatedFiles, { shouldValidate: true });
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const triggerFileInput = (mode) => {
    setUploadMode(mode);
    setTimeout(() => {
      fileInputRef.current.click();
    }, 0);
  };

  const processSubmit = async (data) => {
    setIsSubmiting(true);
    const formData = new FormData();

    // Add collection name to form data
    formData.append("collection_name", data.collectionName);

    // Add files to form data
    data.files.forEach(({ file }) => {
      formData.append("files", file);
    });


    try {
      const response = await fileUploadApi(formData);
      if (response) {
        addToast({
          title: "File Upload.",
          description: "file is upload success.",
          color: "success",
          variant:"solid"
        });
        setIsSubmiting(false);
        onOpenChange();
        reset();
      }
    } catch (error) {
      setIsSubmiting(false);
      console.error("❌ Failed to upload books:", error?.response?.data || error.message || error);
    } finally {
      setIsSubmiting(false);
    }
  };

  console.log(errors,"errors");
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit(processSubmit)}>
            <ModalHeader className="flex flex-col gap-1">Upload Books</ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                {/* Collection Name field */}
                <div className="mb-2">
                  <label htmlFor="collectionName" className="block text-sm font-medium text-gray-700 mb-1">
                    Collection Name
                  </label>
                  <input
                    type="text"
                    id="collectionName"
                    placeholder="Enter collection name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    {...register('collectionName')}
                  />
                  {errors.collectionName && (
                    <p className="mt-1 text-sm text-red-500">{errors.collectionName.message}</p>
                  )}
                </div>

                {/* Hidden file input */}
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  accept=".pdf"
                  onChange={handleFileSelect}
                  multiple={uploadMode === 'files'}
                  webkitdirectory={uploadMode === 'folder' ? "" : undefined}
                  directory={uploadMode === 'folder' ? "" : undefined}
                />

                {/* File selection options */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => triggerFileInput('files')}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center gap-2 transition-colors"
                  >
                    <div className="text-xl font-bold">📄</div>
                    <span className="font-medium">Select PDF Files</span>
                    <span className="text-xs text-gray-500">Single or multiple</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => triggerFileInput('folder')}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center gap-2 transition-colors"
                  >
                    <div className="text-xl font-bold">📁</div>
                    <span className="font-medium">Select Folder</span>
                    <span className="text-xs text-gray-500">All PDFs in folder</span>
                  </button>
                </div>

                {/* Validation error message for files */}
                {errors.files && (
                  <p className="text-red-500 text-sm">{errors.files.message}</p>
                )}

                {/* Selected files list */}
                {files.length > 0 && (
                  <div className="mt-2">
                    <h3 className="text-base font-medium mb-2">Selected Files ({files.length})</h3>
                    <div className="max-h-52 overflow-y-auto border border-gray-200 rounded-lg p-2">
                      <ul className="divide-y divide-gray-100">
                        {files.map(({ file, relativePath }, index) => (
                          <li key={index} className="py-2 px-1 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-red-500">📄</span>
                              <div>
                                <p className="text-sm font-medium truncate max-w-xs">{relativePath || file.name}</p>
                                <p className="text-xs text-gray-500">{formatFileSize(file?.size)}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-100 transition-colors"
                            >
                              ✕
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button disabled={isSubmiting} color="danger" variant="light" type="button" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                type="submit"
                className="bg-black text-white disabled:opacity-50"
                disabled={isSubmiting}
                isLoading={isSubmiting}
              >
                Upload {files.length > 0 && `(${files.length})`}
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};

export default BookUploadPopup;
