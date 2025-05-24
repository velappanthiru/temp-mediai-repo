"use client";

import { useState, useEffect } from 'react';

const primaryColor = '#800080'; // Purple theme color

// Mock data for medical records (replace with your actual API calls)
const initialMedicalRecords = [
  { id: 1, patientName: 'John Doe', hospitalNo: 'H12345', mobile: '9876543210', gender: 'Male', assignedToDoctorEmail: 'dr.smith@hospital.com' },
  { id: 2, patientName: 'Jane Smith', hospitalNo: 'H12346', mobile: '9876543211', gender: 'Female', assignedToDoctorEmail: 'nurse.alice@hospital.com' },
  { id: 3, patientName: 'Peter Jones', hospitalNo: 'H12347', mobile: '9876543212', gender: 'Male', assignedToDoctorEmail: 'dr.lee@hospital.com' },
  { id: 4, patientName: 'Alice Brown', hospitalNo: 'H12348', mobile: '9876543213', gender: 'Female', assignedToDoctorEmail: 'billing@hospital.com' }, // Example of non-doctor email
  { id: 5, patientName: 'John Doe', hospitalNo: 'H12349', mobile: '9876543214', gender: 'Male', assignedToDoctorEmail: 'lab.tech@hospital.com' }, // Example of non-doctor email
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
    // patientName will be handled explicitly, others go into textarea
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

const doctorsList = [
  { id: 'doc1', name: 'Dr. Smith (dr.smith@hospital.com)', email: 'dr.smith@hospital.com' },
  { id: 'doc2', name: 'Nurse Alice (nurse.alice@hospital.com)', email: 'nurse.alice@hospital.com' },
  { id: 'doc3', name: 'Dr. Lee (dr.lee@hospital.com)', email: 'dr.lee@hospital.com' },
  { id: 'doc4', name: 'Dr. Emily Carter (dr.emily@hospital.com)', email: 'dr.emily@hospital.com' },
  { id: 'doc5', name: 'Dr. John Davis (dr.davis@hospital.com)', email: 'dr.davis@hospital.com' },
  { id: 'doc0', name: 'Other / Unassigned', email: 'unassigned@hospital.com' },
];

// SVG Icon for the Plus Button
const PlusIcon = () => (
  <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
);


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
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoadingRecords(true);
    setTimeout(() => {
      setMedicalRecords(initialMedicalRecords);
      setLoadingRecords(false);
    }, 500);
  }, []);

  const handleUploadButtonClick = () => {
    setShowUploadForm(true);
    setSelectedOption(null); // Reset selected option when opening form
    setUploadedImage(null);
    setFormData({});
    setMessage('');
    setSubmissionResult(null);
  };

  const handleBackToList = () => {
    setShowUploadForm(false);
    setSelectedOption(null);
    setUploadedImage(null);
    setFormData({});
    setSubmissionResult(null);
    setMessage('');
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    // Reset form data, but keep patient name if already entered, or other common fields
    const commonData = {
        patientName: formData.patientName || '',
        hospitalNo: formData.hospitalNo || '',
        mobile: formData.mobile || '',
        gender: formData.gender || '',
        assignedToDoctorEmail: formData.assignedToDoctorEmail || '',
    };
    if (option.id !== 'initialAssessmentForm') {
        setFormData({
            ...commonData,
            extractedAdditionalData: uploadedImage ? `Simulated OCR from ${uploadedImage.name} for ${option.label}` : '',
        });
    } else {
        setFormData(commonData); // For initial assessment, clear specific fields
    }
    setUploadedImage(null); // Reset image when option changes
    setMessage('');
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      setMessage('');
      if (selectedOption && selectedOption.id !== 'initialAssessmentForm') {
        setFormData(prevData => ({
            ...prevData,
            extractedAdditionalData: `Simulated OCR from ${file.name} for ${selectedOption.label}:\nPatient: \nDetails: \nDate: `,
        }));
      }
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedOption) {
        setMessage('Please select a document type.');
        return;
    }
    if (!uploadedImage && selectedOption.id !== 'initialAssessmentForm') { // Image might be optional for initial assessment in some flows
        // For the 3 special tabs, image is implied to be source of data
        if (selectedOption.id !== 'initialAssessmentForm') {
             setMessage('Please upload an image for this document type.');
             return;
        }
    }
    if (!formData.patientName || !formData.hospitalNo || !formData.assignedToDoctorEmail) {
        setMessage('Please fill in all required patient and assignment details.');
        return;
    }


    setIsSubmittingForm(true);
    setSubmissionResult(null);
    setMessage('');

    try {
      console.log('Form Data:', formData);
      console.log('Uploaded Image:', uploadedImage);
      console.log('Selected Option:', selectedOption.id);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newRecord = {
        id: medicalRecords.length + 1, // Ensure unique ID generation in real app
        patientName: formData.patientName || 'N/A',
        hospitalNo: formData.hospitalNo || 'N/A',
        mobile: formData.mobile || 'N/A',
        gender: formData.gender || 'N/A',
        assignedToDoctorEmail: formData.assignedToDoctorEmail || 'N/A',
        // You might want to add extractedAdditionalData or other specific fields to the record if needed
      };
      setMedicalRecords((prevRecords) => [...prevRecords, newRecord]);

      setSubmissionResult({ success: true, message: 'Data submitted successfully!' });
      setShowUploadForm(false);
    } catch (error) {
      console.error('Submission error:', error);
      setSubmissionResult({ success: false, message: 'Failed to submit data.' });
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const filteredRecords = medicalRecords.filter(record =>
    record.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.hospitalNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.mobile.includes(searchQuery) || // Mobile numbers are often searched as is
    record.assignedToDoctorEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.gender.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 font-sans">
      {!showUploadForm ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
            <div className="flex items-center gap-4">
                <button
                    onClick={handleUploadButtonClick}
                    className="inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white transition-colors duration-200"
                    style={{ backgroundColor: primaryColor }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#660066'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = primaryColor}
                    title="Upload New Document"
                >
                    <PlusIcon />
                    <span className="hidden sm:inline"></span>
                </button>
                <input
                    type="search"
                    placeholder="Search records..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm w-full max-w-xs"
                />
            </div>
          </div>

          {submissionResult && !submissionResult.success && ( // Show submission error here if not redirecting
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{submissionResult.message}</span>
            </div>
          )}
          {submissionResult && submissionResult.success && ( // Show success message
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{submissionResult.message}</span>
            </div>
          )}


          {loadingRecords ? (
            <p className="text-gray-600">Loading medical records...</p>
          ) : errorRecords ? (
            <p className="text-red-500">Error: {errorRecords}</p>
          ) : filteredRecords.length === 0 ? (
            <p className="text-gray-600">{searchQuery ? 'No records match your search.' : 'No medical records found.'}</p>
          ) : (
            <div className="overflow-x-auto shadow-md rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hospital No</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned to Doctor</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">View</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecords.map((record, index) => (
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
                          onMouseOver={(e) => (e.currentTarget.style.color = '#660066')}
                          onMouseOut={(e) => (e.currentTarget.style.color = primaryColor)}
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
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Upload Details</h1>
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
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedOption?.id === option.id
                    ? `ring-2 ring-offset-1`
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
                style={{
                  borderColor: selectedOption?.id === option.id ? primaryColor : undefined,
                  backgroundColor: selectedOption?.id === option.id ? `${primaryColor}1A` : undefined, // Light purple with transparency
                  ringColor: selectedOption?.id === option.id ? primaryColor : undefined,
                }}
              >
                <h3 className={`font-medium ${selectedOption?.id === option.id ? 'text-purple-700' : 'text-gray-800'}`}>{option.label}</h3>
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
                Upload Image for {selectedOption.label}
              </label>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageUpload}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
               {uploadedImage && <p className="mt-2 text-sm text-gray-500">Selected: {uploadedImage.name}</p>}
            </div>
          )}

          {selectedOption && (uploadedImage || selectedOption.id === 'initialAssessmentForm') && ( // Show form if option is selected and (image uploaded OR it's initial assessment)
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Enter Details for {selectedOption.label}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Conditional Fields based on selectedOption */}
                {selectedOption.id === 'initialAssessmentForm' ? (
                  selectedOption.fields.map((field) => (
                    <div key={field}>
                      <label htmlFor={field} className="block text-sm font-medium text-gray-700">
                        {field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                      </label>
                      <input
                        type={field.toLowerCase().includes('date') ? 'date' : 'text'}
                        id={field}
                        name={field}
                        value={formData[field] || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                        required={field === 'patientName'} // Only patientName strictly required here from these fields
                      />
                    </div>
                  ))
                ) : ( // For Scan Report, Lab Report, Past Care
                  <>
                    <div>
                      <label htmlFor="patientName" className="block text-sm font-medium text-gray-700">Patient Name</label>
                      <input
                        type="text"
                        id="patientName"
                        name="patientName"
                        value={formData.patientName || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="extractedAdditionalData" className="block text-sm font-medium text-gray-700">
                        Extracted Data / Details from {selectedOption.label}
                      </label>
                      <textarea
                        id="extractedAdditionalData"
                        name="extractedAdditionalData"
                        value={formData.extractedAdditionalData || ''}
                        onChange={handleInputChange}
                        rows={8}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                        placeholder={`Enter or edit details extracted from the ${selectedOption.label.toLowerCase()} image here...`}
                      />
                    </div>
                  </>
                )}

                {/* Common Fields: Hospital No, Mobile, Gender - always show these */}
                <div>
                  <label htmlFor="hospitalNo" className="block text-sm font-medium text-gray-700">Hospital No</label>
                  <input type="text" id="hospitalNo" name="hospitalNo" value={formData.hospitalNo || ''} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" required />
                </div>
                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">Mobile</label>
                  <input type="text" id="mobile" name="mobile" value={formData.mobile || ''} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" required />
                </div>
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                  <select id="gender" name="gender" value={formData.gender || ''} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Assign to Doctor Dropdown */}
                <div>
                  <label htmlFor="assignedToDoctorEmail" className="block text-sm font-medium text-gray-700">Assign to Doctor</label>
                  <select
                    id="assignedToDoctorEmail"
                    name="assignedToDoctorEmail"
                    value={formData.assignedToDoctorEmail || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                    required
                  >
                    <option value="">Select a Doctor</option>
                    {doctorsList.map(doc => (
                      <option key={doc.id} value={doc.email}>{doc.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white transition-colors duration-200"
                    style={{ backgroundColor: primaryColor }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#660066')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = primaryColor)}
                    disabled={isSubmittingForm}
                  >
                    {isSubmittingForm ? 'Submitting...' : 'Submit Document'}
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

          {submissionResult && ( // Show submission result at the bottom of the form page
            <div className={`mt-6 p-4 rounded-md ${submissionResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {submissionResult.message}
            </div>
          )}
        </>
      )}
    </div>
  );
}
