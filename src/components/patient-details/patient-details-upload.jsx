"use client";

import { useState, useEffect } from 'react';

const primaryColor = '#800080'; // Purple theme color

// Mock data for medical records (replace with your actual API calls)
const initialMedicalRecords = [
  { id: 1, patientName: 'John Doe', hospitalNo: 'H12345', mobile: '9876543210', gender: 'Male', assignedToDoctorEmail: 'dr.smith@hospital.com' },
  { id: 2, patientName: 'Jane Smith', hospitalNo: 'H12346', mobile: '9876543211', gender: 'Female', assignedToDoctorEmail: 'nurse.alice@hospital.com' },
  { id: 3, patientName: 'Peter Jones', hospitalNo: 'H12347', mobile: '9876543212', gender: 'Male', assignedToDoctorEmail: 'dr.lee@hospital.com' },
  { id: 4, patientName: 'Alice Brown', hospitalNo: 'H12348', mobile: '9876543213', gender: 'Female', assignedToDoctorEmail: 'billing@hospital.com' },
  { id: 5, patientName: 'John Doe', hospitalNo: 'H12349', mobile: '9876543214', gender: 'Male', assignedToDoctorEmail: 'lab.tech@hospital.com' },
];

const UploadOptions = [
  {
    id: 'initialAssessmentForm',
    label: 'Initial Assessment Form',
    fields: ['patientName', 'assessmentDate', 'symptoms', 'diagnosis'],
  },
  {
    id: 'scanReport',
    label: 'Scan Report',
    fields: ['patientName', 'scanType', 'scanDate', 'findings'],
  },
  {
    id: 'labReport',
    label: 'Lab Report',
    fields: ['patientName', 'testName', 'result', 'unit', 'referenceRange'],
  },
  {
    id: 'pastCare',
    label: 'Past Care',
    fields: ['patientName', 'careProvider', 'careDate', 'notes'],
  },
];

export default function UploadPage() {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [medicalRecords, setMedicalRecords] = useState(initialMedicalRecords);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [errorRecords, setErrorRecords] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [formData, setFormData] = useState({});
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [message, setMessage] = useState(''); // For custom alert messages

  useEffect(() => {
    setLoadingRecords(true);
    // Simulate API call to fetch records
    setTimeout(() => {
      // Replace this with your actual API fetch for medical records
      setMedicalRecords(initialMedicalRecords);
      setLoadingRecords(false);
    }, 500);
  }, []);

  const handleUploadButtonClick = () => {
    setShowUploadForm(true);
    setMessage(''); // Clear any previous messages
  };

  const handleBackToList = () => {
    setShowUploadForm(false);
    setSelectedOption(null);
    setUploadedImage(null);
    setFormData({});
    setSubmissionResult(null);
    setMessage(''); // Clear any messages
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setFormData({});
    setMessage(''); // Clear any messages
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      setMessage(''); // Clear any messages
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedOption || !uploadedImage) {
      setMessage('Please select a document type and upload an image.');
      return;
    }

    setIsSubmittingForm(true);
    setSubmissionResult(null);
    setMessage('');

    // Simulate API call to submit data
    try {
      console.log('Form Data:', formData);
      console.log('Uploaded Image:', uploadedImage);
      console.log('Selected Option:', selectedOption.id);

      // In a real application, send this data to your backend
      // Example:
      /*
      const apiFormData = new FormData();
      apiFormData.append('image', uploadedImage);
      apiFormData.append('documentType', selectedOption.id);
      Object.keys(formData).forEach(key => {
          apiFormData.append(key, formData[key]);
      });

      const response = await fetch('/api/upload-document', { // Replace with your actual API endpoint
          method: 'POST',
          body: apiFormData,
      });

      if (!response.ok) {
          throw new Error('Network response was not ok.');
      }
      const result = await response.json();
      */

      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call

      // Simulate adding the new record to the list (replace with actual fetch)
      const newRecord = {
        id: medicalRecords.length + 1,
        patientName: formData.patientName || 'N/A',
        hospitalNo: formData.hospitalNo || 'N/A',
        mobile: formData.mobile || 'N/A',
        gender: formData.gender || 'N/A',
        assignedToDoctorEmail: formData.assignedToDoctorEmail || 'N/A',
      };
      setMedicalRecords((prevRecords) => [...prevRecords, newRecord]);


      setSubmissionResult({ success: true, message: 'Data submitted successfully!' });
      setShowUploadForm(false); // Go back to the list after successful submission
      // In a real app, you might want to refresh the medical records list here
    } catch (error) {
      console.error('Submission error:', error);
      setSubmissionResult({ success: false, message: 'Failed to submit data.' });
    } finally {
      setIsSubmittingForm(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 font-sans">
      {!showUploadForm ? (
        <>
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Medical Records</h1>

          <div className="mb-4">
            <button
              onClick={handleUploadButtonClick}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white transition-colors duration-200"
              style={{ backgroundColor: primaryColor }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#660066')}
              onMouseOut={(e) => (e.target.style.backgroundColor = primaryColor)}
            >
              Upload New Document
            </button>
          </div>

          {loadingRecords ? (
            <p className="text-gray-600">Loading medical records...</p>
          ) : errorRecords ? (
            <p className="text-red-500">Error: {errorRecords}</p>
          ) : medicalRecords.length === 0 ? (
            <p className="text-gray-600">No medical records found.</p>
          ) : (
            <div className="overflow-x-auto shadow-md rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      S.No
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hospital No
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mobile
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gender
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned to Doctor (email)
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">View</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {medicalRecords.map((record, index) => (
                    <tr key={record.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.patientName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.hospitalNo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.mobile}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.gender}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.assignedToDoctorEmail}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                          style={{ color: primaryColor }}
                          onMouseOver={(e) => (e.target.style.color = '#660066')}
                          onMouseOut={(e) => (e.target.style.color = primaryColor)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Upload Medical Document</h1>

          <div className="mb-4">
            <button
              onClick={handleBackToList}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              Back to Records
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {UploadOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => handleOptionSelect(option)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                  selectedOption?.id === option.id
                    ? `border-${primaryColor}-500 bg-${primaryColor}-50`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                style={{
                  borderColor: selectedOption?.id === option.id ? primaryColor : undefined,
                  backgroundColor: selectedOption?.id === option.id ? `${primaryColor}20` : undefined, // Adding some transparency
                }}
              >
                <h3 className="font-medium text-gray-800">{option.label}</h3>
              </div>
            ))}
          </div>

          {message && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{message}</span>
            </div>
          )}

          {selectedOption && (
            <div className="mb-6">
              <label
                htmlFor="image-upload"
                className="inline-block mb-2 text-sm font-medium text-gray-700"
              >
                Upload Image ({selectedOption.label})
              </label>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageUpload}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
              />
            </div>
          )}

          {selectedOption && uploadedImage && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Enter Details</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {selectedOption.fields.map((field) => (
                  <div key={field}>
                    <label
                      htmlFor={field}
                      className="block text-sm font-medium text-gray-700"
                    >
                      {field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) =>
                        str.toUpperCase()
                      )}
                    </label>
                    <input
                      type="text"
                      id={field}
                      name={field}
                      value={formData[field] || ''}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                      required
                    />
                  </div>
                ))}

                {/* New fields for Hospital No, Mobile, Gender */}
                <div>
                  <label htmlFor="hospitalNo" className="block text-sm font-medium text-gray-700">
                    Hospital No
                  </label>
                  <input
                    type="text"
                    id="hospitalNo"
                    name="hospitalNo"
                    value={formData.hospitalNo || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                    Mobile
                  </label>
                  <input
                    type="text"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Assigned to Doctor (email) */}
                <div>
                  <label
                    htmlFor="assignedToDoctorEmail"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Assigned to Doctor (email)
                  </label>
                  <input
                    type="email"
                    id="assignedToDoctorEmail"
                    name="assignedToDoctorEmail"
                    value={formData.assignedToDoctorEmail || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                    required
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white transition-colors duration-200"
                    style={{ backgroundColor: primaryColor }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = '#660066')}
                    onMouseOut={(e) => (e.target.style.backgroundColor = primaryColor)}
                    disabled={isSubmittingForm}
                  >
                    {isSubmittingForm ? 'Submitting...' : 'Submit'}
                  </button>
                  <button
                    type="button"
                    onClick={handleBackToList}
                    className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                    disabled={isSubmittingForm}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {submissionResult && (
            <div className={`mt-6 p-4 rounded-md ${submissionResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {submissionResult.message}
            </div>
          )}
        </>
      )}
    </div>
  );
}
