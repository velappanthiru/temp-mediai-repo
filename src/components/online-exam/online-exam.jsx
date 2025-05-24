"use client";

import React, { useState } from 'react'
import { usePathname } from 'next/navigation';
import Select from 'react-select';
import BreadcrumbsComponent from '../../layout-component/breadcrumbs';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Spinner, Pagination } from '@heroui/react';
import jsPDF from 'jspdf';

import { toast } from 'react-hot-toast';

// Preview Component
const ExamPreview = ({ examData, isOpen, onClose, onSave }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < examData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Fixed pagination handler - convert from 1-based to 0-based
  const handlePageChange = (page) => {
    setCurrentQuestion(page - 1);
  };

  const getAnswerStats = () => {
    let correct = 0;
    let attempted = 0;

    examData.questions.forEach((question, qIndex) => {
      if (selectedAnswers[qIndex] !== undefined) {
        attempted++;
        const selectedOption = question.options[selectedAnswers[qIndex]];
        if (selectedOption?.correct) {
          correct++;
        }
      }
    });

    return { correct, attempted, total: examData.questions.length };
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Prepare data for saving
      const examToSave = {
        ...examData,
        saved_at: new Date().toISOString(),
        status: 'saved'
      };

      // Call the save function passed from parent
      if (onSave) {
        await onSave(examToSave);
      }

      toast.success('Exam saved successfully!', {
        duration: 3000,
        position: 'top-right',
      });
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error?.message || 'Failed to save exam. Please try again.', {
        duration: 3000,
        position: 'top-right',
      });
    } finally {
      setIsSaving(false);
    }
  };


  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Format header
    doc.setFontSize(16);
    doc.text(`EXAM: ${examData.exam_name}`, 10, 10);
    doc.setFontSize(12);
    doc.text(`Book: ${examData.book_name}`, 10, 20);
    doc.text(`Date: ${examData.date}`, 10, 30);
    doc.text(`Duration: ${examData.duration}`, 10, 40);
    doc.text(`Total Questions: ${examData.total_questions}`, 10, 50);
    doc.text(`Total Marks: ${examData.total_marks}`, 10, 60);

    let y = 75; // Starting Y position for questions

    examData.questions.forEach((q, index) => {
      const questionText = `${index + 1}. ${q.question}`;
      doc.setFont(undefined, 'bold');
      doc.text(questionText, 10, y);
      y += 7;

      doc.setFont(undefined, 'normal');
      const options = ['A', 'B', 'C', 'D'];
      options.forEach(opt => {
        const optText = q.options.find(o => o.option === opt)?.text || '';
        doc.text(`   ${opt}) ${optText}`, 10, y);
        y += 7;
      });

      const correct = q.options.find(o => o.correct);
      doc.text(`   Correct Answer: ${correct?.option} - ${correct?.text}`, 10, y);
      y += 7;

      // const explanation = q.explanation || 'No explanation provided';
      // doc.text(`   Explanation: ${explanation}`, 10, y);
      // y += 7;

      // doc.text(`   Marks: ${q.marks || examData.marks_per_question}`, 10, y);
      // y += 10;

      // If reaching bottom of page, create a new page
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save(`${examData.exam_name.replace(/[^a-z0-9]/gi, '_')}_questions.pdf`);

    toast.success('PDF downloaded successfully!', {
      duration: 3000,
      position: 'top-right',
    });
  };


  if (!examData) return null;
console.log(currentQuestion,"currentQuestion");
  const stats = getAnswerStats();
  const currentQ = examData.questions[currentQuestion];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="4xl"
      scrollBehavior="inside"
      classNames={{
        closeButton: "hidden",
        base: "bg-white dark:bg-gray-900",
        header: "border-b border-gray-200 dark:border-gray-700",
        body: "p-6",
        footer: "border-t border-gray-200 dark:border-gray-700"
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {examData.exam_name}
              </h2>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Book: {examData.book_name} | Duration: {examData.duration} |
                Total Questions: {examData.total_questions} | Total Marks: {examData.total_marks}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onPress={handleDownloadPDF}
                className="text-gray-600 dark:text-gray-400"
              >
                📄 Download
              </Button>

            </div>
          </div>
        </ModalHeader>

        <ModalBody>
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Question {currentQuestion + 1} of {examData.questions.length}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Attempted: {stats.attempted}/{stats.total} | Correct: {stats.correct}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / examData.questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3 mb-4">
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                Q{currentQuestion + 1}
              </span>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {currentQ.question}
                </h3>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Marks: {currentQ.marks_per_question || examData.marks_per_question}
                </span>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentQ.options.map((option, optionIndex) => {
                const isSelected = selectedAnswers[currentQuestion] === optionIndex;
                const isCorrect = option.correct;
                const showCorrectAnswer = selectedAnswers[currentQuestion] !== undefined;

                return (
                  <div
                    key={optionIndex}
                    className={`
                      p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                      ${isSelected
                        ? showCorrectAnswer
                          ? isCorrect
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                            : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : showCorrectAnswer && isCorrect
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }
                    `}
                    onClick={() => handleAnswerSelect(currentQuestion, optionIndex)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium
                        ${isSelected
                          ? showCorrectAnswer
                            ? isCorrect
                              ? 'border-green-500 bg-green-500 text-white'
                              : 'border-red-500 bg-red-500 text-white'
                            : 'border-blue-500 bg-blue-500 text-white'
                          : showCorrectAnswer && isCorrect
                            ? 'border-green-500 bg-green-500 text-white'
                            : 'border-gray-400 dark:border-gray-500'
                        }
                      `}>
                        {option.option}
                      </div>
                      <span className={`
                        flex-1
                        ${isSelected
                          ? showCorrectAnswer
                            ? isCorrect
                              ? 'text-green-800 dark:text-green-200'
                              : 'text-red-800 dark:text-red-200'
                            : 'text-blue-800 dark:text-blue-200'
                          : showCorrectAnswer && isCorrect
                            ? 'text-green-800 dark:text-green-200'
                            : 'text-gray-700 dark:text-gray-300'
                        }
                      `}>
                        {option.text}
                      </span>
                      {showCorrectAnswer && isCorrect && (
                        <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                          ✓ Correct
                        </span>
                      )}
                      {isSelected && showCorrectAnswer && !isCorrect && (
                        <span className="text-red-600 dark:text-red-400 text-sm font-medium">
                          ✗ Incorrect
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Explanation */}
            {selectedAnswers[currentQuestion] !== undefined && currentQ.explanation && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Explanation:</h4>
                <p className="text-blue-700 dark:text-blue-300">{currentQ.explanation}</p>
              </div>
            )}
          </div>

          {/* Question Navigation - Fixed Pagination */}
          <div className="flex justify-center gap-2 mb-4 flex-wrap">
            <Pagination
              color="secondary"
              page={currentQuestion + 1} // Convert 0-based to 1-based
              total={examData?.questions?.length}
              onChange={handlePageChange} // Use the fixed handler
            />
          </div>
        </ModalBody>

        <ModalFooter className="flex justify-between">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onPress={prevQuestion}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <Button
              variant="ghost"
              onPress={nextQuestion}
              disabled={currentQuestion === examData.questions.length - 1}
            >
              Next
            </Button>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              color="success"
              onPress={handleSave}
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isSaving ? (
                <>
                  <Spinner size="sm" color="white" />
                  Saving...
                </>
              ) : (
                '💾 Save Exam'
              )}
            </Button>
            <Button
              color="primary"
              variant="ghost"
              onPress={() => {
                const score = (stats.correct / stats.total) * 100;
                toast.success(`Your Score: ${stats.correct}/${stats.total} (${score.toFixed(1)}%)`, {
                  duration: 5000,
                  position: 'top-center',
                });
              }}
            >
              📊 Show Score
            </Button>
            <Button color="secondary" onPress={onClose}>
              Close Preview
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ExamPreview;
