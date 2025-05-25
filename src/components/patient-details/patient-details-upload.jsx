"use client";

import { useState, useEffect } from 'react';
import RecordDetailView from './RecordDetailView'; // <--- ADDED THIS LINE

const primaryColor = '#800080'; // Purple theme color

// Mock data for medical records (replace with your actual API calls)
const initialMedicalRecords = [
    { id: 1, patientName: 'John Doe', hospitalNo: 'H12345', mobile: '9876543210', gender: 'Male', assignedToDoctorEmail: 'dr.smith@hospital.com',
        documentType: 'Initial Assessment Form', // Added documentType
        assessmentDate: '2023-01-01', symptoms: 'Fever, Cough', diagnosis: 'Common Cold',
        timeline: [ // Example timeline data
            { date: "2023-01-01", notes: "Initial consultation for fever and cough. Prescribed rest and fluids.", description: "Initial Assessment" },
            { date: "2023-01-03", notes: "Patient reported feeling better. Temperature normal.", description: "Follow-up Call" }
        ]
    },
    { id: 2, patientName: 'Jane Smith', hospitalNo: 'H12346', mobile: '9876543211', gender: 'Female', assignedToDoctorEmail: 'nurse.alice@hospital.com',
        documentType: 'Scan Report', // Added documentType
        ocrText: 'Simulated OCR for Jane Smith\'s Brain MRI. Findings: No abnormalities. Date: 2023-02-10.',
        imageFileName: 'jane_smith_mri.jpg',
        timeline: [ // Example timeline data for a scan
            { date: "2023-02-09", notes: "Ordered MRI for Jane Smith due to recurring headaches.", description: "Consultation" },
            { date: "2023-02-10", notes: "MRI Brain completed. Report indicates no acute intracranial pathology.", description: "Scan Report" }
        ]
    },
    { id: 3, patientName: 'Peter Jones', hospitalNo: 'H12347', mobile: '9876543212', gender: 'Male', assignedToDoctorEmail: 'dr.lee@hospital.com',
        documentType: 'Lab Report', // Added documentType
        ocrText: 'Simulated OCR for Peter Jones\'s Blood Test. Glucose: 95 mg/dL. Date: 2023-03-05.',
        imageFileName: 'peter_jones_blood_test.png',
        timeline: [ // Example timeline data for a lab report
            { date: "2023-03-04", notes: "Patient scheduled for routine blood work.", description: "Appointment" },
            { date: "2023-03-05", notes: "Blood test results normal. Glucose within range.", description: "Lab Report" }
        ]
    },
    { id: 4, patientName: 'Alice Brown', hospitalNo: 'H12348', mobile: '9876543213', gender: 'Female', assignedToDoctorEmail: 'billing@hospital.com',
        documentType: 'Past Care', // Added documentType
        ocrText: 'Simulated OCR for Alice Brown\'s physical therapy notes. Session 1: Focus on knee mobility. Date: 2023-04-20.',
        imageFileName: 'alice_brown_pt_notes.pdf',
        timeline: [
            { date: "2023-04-19", notes: "Referral to physical therapy for knee pain.", description: "Doctor's Visit" },
            { date: "2023-04-20", notes: "First physical therapy session completed.", description: "PT Session" }
        ]
    },
    { id: 5, patientName: 'John Doe', hospitalNo: 'H12349', mobile: '9876543214', gender: 'Male', assignedToDoctorEmail: 'lab.tech@hospital.com',
        documentType: 'Initial Assessment Form', // Example with different John Doe
        assessmentDate: '2023-05-15', symptoms: 'Fatigue, mild nausea', diagnosis: 'Anemia suspected',
        timeline: [
            { date: "2023-05-15", notes: "Patient presented with fatigue. Ordered CBC.", description: "Initial Assessment" },
            { date: "2023-05-18", notes: "CBC results show low hemoglobin. Recommended iron supplements.", description: "Lab Review & Treatment" }
        ]
    },
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
        fields: ['patientName', 'scanType', 'scanDate', 'findings'], // These are for reference, OCR will handle it
    },
    {
        id: 'labReport',
        label: 'Lab Report',
        fields: ['patientName', 'testName', 'result', 'unit', 'referenceRange'], // For reference
    },
    {
        id: 'pastCare',
        label: 'Past Care',
        fields: ['patientName', 'careProvider', 'careDate', 'notes'], // For reference
    },
];

const doctorsList = [
    { id: 'doc1', name: 'Dr. Smith', email: 'dr.smith@hospital.com' },
    { id: 'doc2', name: 'Nurse Alice', email: 'nurse.alice@hospital.com' },
    { id: 'doc3', name: 'Dr. Lee', email: 'dr.lee@hospital.com' },
    { id: 'doc4', name: 'Dr. Emily Carter', email: 'dr.emily@hospital.com' },
    { id: 'doc5', name: 'Dr. John Davis', email: 'dr.davis@hospital.com' },
    { id: 'doc0', name: 'Other / Unassigned', email: 'unassigned@hospital.com' },
];

// SVG Icon for the Plus Button
const PlusIcon = () => (
    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);

// Placeholder for the current "logged-in" user's email to simulate doctor/non-doctor view
// In a real app, this would come from an authentication context
const currentUserEmail = 'dr.smith@hospital.com'; // Change this to test as a doctor or non-doctor
const isCurrentUserDoctor = doctorsList.some(doc => doc.email === currentUserEmail);


export default function UploadPage() {
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [medicalRecords, setMedicalRecords] = useState(initialMedicalRecords);
    const [loadingRecords, setLoadingRecords] = useState(false);
    const [errorRecords, setErrorRecords] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [uploadedImages, setUploadedImages] = useState([]); // Changed from single to array
    const [formData, setFormData] = useState({});
    const [isSubmittingForm, setIsSubmittingForm] = useState(false);
    const [submissionResult, setSubmissionResult] = useState(null);
    const [message, setMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    // New state for viewing a specific record
    const [viewingRecord, setViewingRecord] = useState(null); // <--- ADDED THIS STATE

    useEffect(() => {
        setLoadingRecords(true);
        setTimeout(() => {
            setMedicalRecords(initialMedicalRecords);
            setLoadingRecords(false);
        }, 500);
    }, []);

    const handleUploadButtonClick = () => {
        setShowUploadForm(true);
        setSelectedOption(null);
        setUploadedImages([]);
        setFormData({});
        setMessage('');
        setSubmissionResult(null);
        setViewingRecord(null); // <--- RESET viewingRecord when going to upload form
    };

    const handleBackToList = () => {
        setShowUploadForm(false);
        setSelectedOption(null);
        setUploadedImages([]);
        setFormData({});
        setSubmissionResult(null);
        setMessage('');
        setViewingRecord(null); // <--- RESET viewingRecord when going back to list
    };

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
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
                assessmentDate: '',
                symptoms: '',
                diagnosis: '',
                extractedAdditionalData: uploadedImages.length > 0 ? `Simulated OCR from ${uploadedImages.map(img => img.name).join(', ')} for ${option.label}:\nPatient: ${commonData.patientName || '(Not specified)'}\nDetails: \nDate: ` : '',
            });
        } else {
            setFormData({
                ...commonData,
                extractedAdditionalData: '',
            });
        }
        setUploadedImages([]);
        setMessage('');
    };

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        if (files.length > 0) {
            setUploadedImages(files);
            setMessage('');
            if (selectedOption && selectedOption.id !== 'initialAssessmentForm') {
                const extractedData = files.map(file => 
                    `Simulated OCR from ${file.name} for ${selectedOption.label}:\nPatient: ${formData.patientName || '(Not specified)'}\nDetails: \nDate: ${new Date().toLocaleDateString()}`
                ).join('\n\n');
                setFormData(prevData => ({
                    ...prevData,
                    extractedAdditionalData: extractedData,
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

        if (!formData.assignedToDoctorEmail) {
            setMessage('Please assign to a doctor.');
            return;
        }

        if (selectedOption.id === 'initialAssessmentForm') {
            if (!formData.patientName || !formData.hospitalNo || !formData.gender) {
                setMessage('Please fill in Patient Name, Hospital No, and Gender for the Initial Assessment form.');
                return;
            }
            if (uploadedImages.length === 0) { // IAF also requires an image now, check array
                setMessage('Please upload at least one image for the Initial Assessment Form.');
                return;
            }
        } else {
            if (uploadedImages.length === 0) {
                setMessage('Please upload at least one image for this document type.');
                return;
            }
            if (!formData.extractedAdditionalData) {
                setMessage('No data extracted from image. Please ensure image is uploaded and processed.');
                return;
            }
        }

        setIsSubmittingForm(true);
        setSubmissionResult(null);
        setMessage('');

        try {
            console.log('Form Data:', formData);
            console.log('Uploaded Images:', uploadedImages);
            console.log('Selected Option:', selectedOption.id);

            await new Promise((resolve) => setTimeout(resolve, 1500));

            const newRecord = {
                id: medicalRecords.length + 1 + Date.now(),
                patientName: formData.patientName || 'N/A',
                hospitalNo: formData.hospitalNo || 'N/A',
                mobile: formData.mobile || 'N/A',
                gender: formData.gender || 'N/A',
                assignedToDoctorEmail: formData.assignedToDoctorEmail || 'N/A',
                documentType: selectedOption.label,
                ...(selectedOption.id === 'initialAssessmentForm' && {
                    assessmentDate: formData.assessmentDate || '',
                    symptoms: formData.symptoms || '',
                    diagnosis: formData.diagnosis || '',
                }),
                ...(selectedOption.id !== 'initialAssessmentForm' && {
                    ocrText: formData.extractedAdditionalData || '',
                }),
                imageFileNames: uploadedImages.length > 0 ? uploadedImages.map(img => img.name) : [], // Store as array
                timeline: [{ // Initial timeline entry from the submission
                    date: new Date().toISOString().split('T')[0], // Current date
                    notes: selectedOption.id === 'initialAssessmentForm' ? `Initial assessment recorded. Symptoms: ${formData.symptoms || 'N/A'}` : `Document uploaded: ${selectedOption.label}`,
                    description: `New ${selectedOption.label} Upload`
                }]
            };
            setMedicalRecords((prevRecords) => [newRecord, ...prevRecords]);

            setSubmissionResult({ success: true, message: 'Data submitted successfully!' });
            setShowUploadForm(false);
            setSelectedOption(null);
            setUploadedImages([]);
            setFormData({});

        } catch (error) {
            console.error('Submission error:', error);
            setSubmissionResult({ success: false, message: 'Failed to submit data.' });
        } finally {
            setIsSubmittingForm(false);
        }
    };

    // Handler to set the record to be viewed
    const handleViewRecord = (record) => { // <--- ADDED THIS HANDLER
        setViewingRecord(record);
        setShowUploadForm(false); // Hide the upload form when viewing a record
    };

    // Handler to go back from the record detail view to the list
    const handleBackFromView = () => { // <--- ADDED THIS HANDLER
        setViewingRecord(null);
        setShowUploadForm(false); // Make sure upload form is hidden, show list
    };

    // This function would be called when a doctor submits a review
    const handleDoctorReviewSubmit = async (recordId, reviewText, selectedDocTypes) => {
        console.log(`Submitting review for record \${recordId}: "\${reviewText}" with document types: \${selectedDocTypes.join(', ')}`);
        // Simulate API call
        setIsSubmittingForm(true); // Using the same state for simplicity, ideally a separate one
        await new Promise(resolve => setTimeout(resolve, 1000));

        setMedicalRecords(prevRecords =>
            prevRecords.map(record =>
                record.id === recordId
                    ? {
                        ...record,
                        timeline: [
                            ...(record.timeline || []), // Keep existing timeline entries
                            {
                                date: new Date().toISOString().split('T')[0],
                                notes: reviewText,
                                description: `Doctor Review by \${currentUserEmail} for types: \${selectedDocTypes.length > 0 ? selectedDocTypes.join(', ') : 'N/A'}`
                            }
                        ]
                    }
                    : record
            )
        );
        setIsSubmittingForm(false);
        alert('Review submitted successfully!');
        // Optionally, reset review form fields or close it
    };

    const filteredRecords = medicalRecords.filter(record =>
        record.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.hospitalNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.mobile.includes(searchQuery) ||
        record.assignedToDoctorEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.gender.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.documentType.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 font-sans">
            {/* Conditional Rendering based on viewingRecord and showUploadForm states */}
            {viewingRecord ? ( // If a record is selected for viewing, show RecordDetailView
                <RecordDetailView
                    record={viewingRecord}
                    onBack={handleBackFromView}
                    primaryColor={primaryColor}
                    isCurrentUserDoctor={isCurrentUserDoctor}
                    onReviewSubmit={handleDoctorReviewSubmit}
                />
            ) : showUploadForm ? ( // If not viewing a record and showUploadForm is true, show the upload form
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
                                    backgroundColor: selectedOption?.id === option.id ? `${primaryColor}1A` : undefined,
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

                    {/* Group Image Upload and Submit Button together */}
                    {selectedOption && (
                        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:gap-4">
                            <div className="flex-1">
                                <label
                                    htmlFor="image-upload"
                                    className="inline-block mb-2 text-sm font-medium text-gray-700"
                                >
                                    Upload Image(s) for {selectedOption.label}
                                    <span className="text-red-500">*</span> {/* All types require image */}
                                </label>
                                <input
                                    type="file"
                                    id="image-upload"
                                    key={selectedOption.id + (uploadedImages.length > 0 ? uploadedImages.map(img => img.name).join(', ') : '')}
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    multiple
                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                />
                                {uploadedImages.length > 0 && <p className="mt-2 text-sm text-gray-500">Selected: {uploadedImages.map(img => img.name).join(', ')}</p>}
                            </div>

                            <div className="mt-4 sm:mt-0">
                                <button
                                    type="submit"
                                    onClick={handleSubmit}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white transition-colors duration-200"
                                    style={{ backgroundColor: primaryColor }}
                                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#660066')}
                                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = primaryColor)}
                                    disabled={isSubmittingForm}
                                >
                                    {isSubmittingForm ? 'Submitting...' : 'Submit Document'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* --- START OF MODIFIED FORM SECTION --- */}

                    {selectedOption && uploadedImages.length > 0 && (
                        <div className="bg-white p-6 rounded-lg shadow mt-6">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Enter Details for {selectedOption.label}</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">

                                {selectedOption.id === 'initialAssessmentForm' ? (
                                    <>
                                        {selectedOption.fields.map((field) => (
                                            <div key={field} className="form-field">
                                                <label htmlFor={field} className="block text-sm font-medium text-gray-700">
                                                    {field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                                                    {(field === 'patientName' || field === 'assessmentDate' || field === 'symptoms') && <span className="text-red-500">*</span>}
                                                </label>
                                                <input
                                                    type={field.toLowerCase().includes('date') ? 'date' : 'text'}
                                                    id={field}
                                                    name={field}
                                                    value={formData[field] || ''}
                                                    onChange={handleInputChange}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                                                    required={field === 'patientName' || field === 'assessmentDate' || field === 'symptoms'}
                                                />
                                            </div>
                                        ))}
                                        {/* Common Demographic Fields FOR IAF ONLY */}
                                        <div className="form-field">
                                            <label htmlFor="hospitalNo" className="block text-sm font-medium text-gray-700">Hospital No <span className="text-red-500">*</span></label>
                                            <input type="text" id="hospitalNo" name="hospitalNo" value={formData.hospitalNo || ''} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" required />
                                        </div>
                                        <div className="form-field">
                                            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">Mobile</label>
                                            <input type="text" id="mobile" name="mobile" value={formData.mobile || ''} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
                                        </div>
                                        <div className="form-field">
                                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender <span className="text-red-500">*</span></label>
                                            <select id="gender" name="gender" value={formData.gender || ''} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" required>
                                                <option value="">Select Gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <label htmlFor="extractedAdditionalData" className="block text-sm font-medium text-gray-700">
                                                Extracted Data / Details from {selectedOption.label} (View Only)
                                            </label>
                                            <textarea
                                                id="extractedAdditionalData"
                                                name="extractedAdditionalData"
                                                value={formData.extractedAdditionalData || 'Processing OCR...'}
                                                rows={10}
                                                readOnly
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 bg-gray-100 cursor-not-allowed"
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Assign to Doctor Dropdown - Common to ALL types (and always appears if form is shown) */}
                                <div>
                                    <label htmlFor="assignedToDoctorEmail" className="block text-sm font-medium text-gray-700">Assign to Doctor <span className="text-red-500">*</span></label>
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
                            </form>
                        </div>
                    )}
                    {/* --- END OF MODIFIED FORM SECTION --- */}

                    {submissionResult && (
                        <div className={`mt-6 p-4 rounded-md ${submissionResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {submissionResult.message}
                        </div>
                    )}
                </>
            ) : ( // Default view: Show the list of records
                <>
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleUploadButtonClick}
                                className="inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white transition-colors duration-200"
                                style={{ backgroundColor: primaryColor }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#660066'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = primaryColor}
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

                    {submissionResult && !submissionResult.success && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <span className="block sm:inline">{submissionResult.message}</span>
                        </div>
                    )}
                    {submissionResult && submissionResult.success && (
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
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Type</th>
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
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.documentType}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctorsList.find(doc => doc.email === record.assignedToDoctorEmail)?.name || record.assignedToDoctorEmail}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleViewRecord(record)} // <--- UPDATED CLICK HANDLER
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
            )}
        </div>
    );
}

