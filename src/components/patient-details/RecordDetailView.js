// components/RecordDetailView.js
"use client";

import { useState, useEffect } from 'react';

// Helper function to format date
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

const TimelineDotIcon = ({ primaryColor }) => (
    <span
        className="absolute flex items-center justify-center w-6 h-6 rounded-full -start-[0.80rem] ring-4 ring-white dark:ring-gray-800" // Adjusted for border
        style={{ backgroundColor: primaryColor }}
    >
        <svg className="w-2.5 h-2.5 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h2a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Zm5 0h2a1 1 0 0 1 0 2H10a1 1 0 0 1 0-2Zm5 0h2a1 1 0 0 1 0 2H15a1 1 0 0 1 0-2Z"/>
        </svg>
    </span>
);


export default function RecordDetailView({ record, onBack, primaryColor = '#800080', isCurrentUserDoctor, onReviewSubmit }) {
    // States for per-entry interactions
    const [entrySpecificReviews, setEntrySpecificReviews] = useState({});
    const [entrySpecificDocTypeAssociations, setEntrySpecificDocTypeAssociations] = useState({});

    // UploadOptions are now primarily for the per-entry document type association
    const UploadOptions = [
        { id: 'scanReport', label: 'Scan Report' },
        { id: 'labReport', label: 'Lab Report' },
        { id: 'pastCare', label: 'Past Care' },
    ];

    // Effect to initialize states if record or its timeline changes
    useEffect(() => {
        if (record && record.timeline) {
            const initialReviews = {};
            const initialDocAssociations = {};

            record.timeline.forEach((entry, index) => {
                const entryId = getEntryId(entry, index);
                initialReviews[entryId] = entry.doctorPhaseReview || '';
                initialDocAssociations[entryId] = entry.associatedDocTypesForReview || [];
            });

            setEntrySpecificReviews(initialReviews);
            setEntrySpecificDocTypeAssociations(initialDocAssociations);
        }
    }, [record]);


    const getEntryId = (entry, index) => entry.id || `timeline-entry-${index}`;

    const handleEntrySpecificReviewTextChange = (entryId, text) => {
        setEntrySpecificReviews(prev => ({ ...prev, [entryId]: text }));
    };

    const handleEntrySpecificDocTypeChange = (entryId, docTypeLabel, isChecked) => {
        setEntrySpecificDocTypeAssociations(prev => {
            const currentAssociations = prev[entryId] || [];
            const newAssociations = isChecked
                ? [...currentAssociations, docTypeLabel]
                : currentAssociations.filter(type => type !== docTypeLabel);
            return { ...prev, [entryId]: newAssociations };
        });
    };
    
    // Function to handle submission for a single timeline entry
    const handleSubmitEntryReview = (entry) => {
        const entryId = getEntryId(entry, record.timeline.indexOf(entry)); // Get current entry's dynamic ID
        const reviewData = {
            entryId: entry.id, // Use original entry.id for submission
            originalEntryDate: entry.date,
            phaseReviewText: entrySpecificReviews[entryId] || '',
            associatedDocTypes: entrySpecificDocTypeAssociations[entryId] || [],
        };
        console.log(`Submitting review for entry ${entry.id || entryId}:`, reviewData);
        if (onReviewSubmit) {
            // onReviewSubmit should be adapted to handle individual entry submissions
            // For example, onReviewSubmit(record.id, entry.id, reviewData);
            onReviewSubmit(record.id, reviewData); 
        } else {
            alert(`Review data for entry ${entry.id || entryId} prepared (see console). Implement actual submission via onReviewSubmit prop.`);
        }
    };


    const sortedTimeline = [...(record?.timeline || [])].sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl max-w-4xl mx-auto my-8 font-sans">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Record Details: {record?.patientName}</h2>
                <button
                    onClick={onBack}
                    className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 text-xs sm:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                    Back to List
                </button>
            </div>

            {/* Patient Information Section */}
            <div className="mb-6 border-b pb-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3">Patient Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm sm:text-base text-gray-700">
                    <p><strong>Hospital No:</strong> {record?.hospitalNo}</p>
                    <p><strong>Mobile:</strong> {record?.mobile}</p>
                    <p><strong>Gender:</strong> {record?.gender}</p>
                    <p><strong>Main Document:</strong> {record?.documentType}</p>
                    <p><strong>Assigned Doctor:</strong> {record?.assignedToDoctorEmail}</p>
                </div>
            </div>

            {/* Document Specific Details */}
            {record?.documentType === 'Initial Assessment Form' && record?.details && (
                   <div className="mb-6 border-b pb-4">
                       <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3">Initial Assessment Details</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm sm:text-base text-gray-700">
                           <p><strong>Assessment Date:</strong> {formatDate(record.details.assessmentDate)}</p>
                           <p><strong>Symptoms:</strong> {record.details.symptoms || 'N/A'}</p>
                           <p><strong>Diagnosis:</strong> {record.details.diagnosis || 'N/A'}</p>
                       </div>
                   </div>
            )}
            {record?.imageData && (record.documentType === 'Scan Report' || record.documentType === 'Lab Report' || record.documentType === 'Past Care') && (
                <div className="mb-6 border-b pb-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3">Extracted Document Data</h3>
                    <div className="bg-gray-50 p-3 sm:p-4 rounded-md text-xs sm:text-sm text-gray-800 whitespace-pre-wrap overflow-x-auto">
                        {record.imageData}
                    </div>
                    {record.imageFileName && (
                        <p className="mt-2 text-xs sm:text-sm text-gray-600">Original File: {record.imageFileName}</p>
                    )}
                </div>
            )}

            {/* --- Enhanced Patient Timeline Section --- */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-700">Patient Timeline</h3>
                    {/* Removed the global "Save All" button */}
                </div>

                {sortedTimeline.length === 0 ? (
                    <p className="text-gray-600 text-sm sm:text-base">No timeline entries available for this patient.</p>
                ) : (
                    <div className="relative border-s-2 sm:border-s-4 ps-20 sm:ps-28" style={{borderColor: `${primaryColor}40`}}> {/* Added padding-left to create space for date */}
                        {sortedTimeline.map((entry, index) => {
                            const entryId = getEntryId(entry, index);
                            return (
                                <div key={entryId} className="relative mb-8 ms-6 sm:ms-10"> {/* Margin start to give space from border */}
                                    <TimelineDotIcon primaryColor={primaryColor} />
                                    <time className="absolute -left-[5.5rem] sm:-left-32 top-1 text-xs text-gray-500 w-20 sm:w-28 text-right whitespace-nowrap pr-2"> {/* Adjusted left position */}
                                        {formatDate(entry.date)}
                                    </time>

                                    <div className="bg-slate-50 p-3 sm:p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                                        <h4 className="text-md sm:text-lg font-semibold mb-1" style={{color: primaryColor}}>
                                            {entry.description || 'Timeline Event'}
                                        </h4>
                                        <p className="text-xs sm:text-sm text-gray-600 mb-3">
                                            {entry.notes || 'No additional notes.'}
                                        </p>

                                        {isCurrentUserDoctor && (
                                            <div className="mt-3 pt-3 border-t border-gray-200 space-y-4">
                                                {/* Removed Quick Remark */}
                                                {/* Removed Reviewed / Actioned checkbox */}
                                                
                                                {/* Per-entry Detailed Review */}
                                                <div>
                                                    <label htmlFor={`phase-review-${entryId}`} className="block text-xs sm:text-sm font-medium text-gray-700 mb-0.5">
                                                        Review for this Phase:
                                                    </label>
                                                    <textarea
                                                        id={`phase-review-${entryId}`}
                                                        rows={3}
                                                        value={entrySpecificReviews[entryId] || ''}
                                                        onChange={(e) => handleEntrySpecificReviewTextChange(entryId, e.target.value)}
                                                        className="w-full p-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-1 sm:text-xs"
                                                        placeholder="Detailed review for this phase..."
                                                        style={{ borderColor: `${primaryColor}80`}}
                                                    />
                                                </div>
                                                <div>
                                                    <p className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Associate this phase review with:</p>
                                                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                                                        {UploadOptions.map(option => (
                                                            <div key={option.id} className="flex items-center">
                                                                <input
                                                                    id={`phase-review-doc-${entryId}-${option.id}`}
                                                                    type="checkbox"
                                                                    value={option.label}
                                                                    checked={(entrySpecificDocTypeAssociations[entryId] || []).includes(option.label)}
                                                                    onChange={(e) => handleEntrySpecificDocTypeChange(entryId, option.label, e.target.checked)}
                                                                    className="h-4 w-4 rounded focus:ring-1"
                                                                    style={{ accentColor: primaryColor }}
                                                                />
                                                                <label htmlFor={`phase-review-doc-${entryId}-${option.id}`} className="ml-1.5 text-xs sm:text-sm text-gray-700">
                                                                    {option.label}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                {/* Submit button for each entry */}
                                                <button
                                                    onClick={() => handleSubmitEntryReview(entry)}
                                                    className="w-full px-3 py-1.5 sm:px-4 sm:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md shadow-sm text-white transition-colors duration-200 mt-4"
                                                    style={{ backgroundColor: primaryColor }}
                                                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = `${primaryColor}CC`)}
                                                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = primaryColor)}
                                                >
                                                    Submit Review for This Phase
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
