"use client";

import React, { useState } from 'react'
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Spinner, Pagination } from '@heroui/react';
import jsPDF from 'jspdf';

import { toast } from 'react-hot-toast';
import { storeQuestionsApi } from '@/utils/commonapi';

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
        examData
      };
      const response = await storeQuestionsApi(examData);
      if (response) {
        onClose();
        onSave();
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

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const maxWidth = pageWidth - (margin * 2);

    const addWrappedText = (text, x, y, maxWidth, fontSize = 12, fontStyle = 'normal') => {
      doc.setFontSize(fontSize);
      doc.setFont(undefined, fontStyle);
      const lines = doc.splitTextToSize(text, maxWidth);
      lines.forEach((line, index) => {
        doc.text(line, x, y + (index * 6));
      });
      return y + (lines.length * 6);
    };

    const checkPageBreak = (currentY, requiredSpace = 30) => {
      if (currentY + requiredSpace > pageHeight - margin) {
        doc.addPage();
        return margin + 10;
      }
      return currentY;
    };

    let currentY = margin;

    // Header background
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, currentY, maxWidth, 50, 'F');
    currentY += 8;

    // Title
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    const examTitle = `EXAM: ${examData.exam_name || 'Untitled Exam'}`;
    currentY = addWrappedText(examTitle, margin + 5, currentY, maxWidth - 10, 18, 'bold');
    currentY += 5;

    // Header Info
    doc.setFontSize(11);
    const headerInfo = [
      `Book: ${examData.book_name || 'N/A'}`,
      `Date: ${examData.date || 'N/A'}`,
      `Duration: ${examData.duration || 'N/A'} minutes`,
      `Total Questions: ${examData.total_questions || examData.questions?.length || 0}`,
      `Total Marks: ${examData.total_marks || (examData.questions?.length * (examData.marks_per_question || 1)) || 'N/A'}`
    ];
    headerInfo.forEach((info) => {
      currentY = addWrappedText(info, margin + 5, currentY, maxWidth - 10, 11, 'normal');
      currentY += 1;
    });

    currentY += 10;

    if (examData.questions?.length) {
      examData.questions.forEach((q, index) => {
        currentY = checkPageBreak(currentY, 50);

        const questionNumber = `Q${index + 1}.`;
        const questionText = q.question || 'Question text not available';

        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text(questionNumber, margin, currentY);

        currentY = addWrappedText(questionText, margin + 15, currentY, maxWidth - 15, 12, 'bold');
        currentY += 5;

        const optionLabels = ['A', 'B', 'C', 'D'];
        q.options?.forEach((option, optIndex) => {
          if (optIndex < optionLabels.length) {
            currentY = checkPageBreak(currentY, 15);

            const label = optionLabels[optIndex];
            const text = option.text || option.option_text || `Option ${label}`;
            const isCorrect = option.correct || option.is_correct;

            if (isCorrect) {
              doc.setFillColor(220, 255, 220);
              const textWidth = doc.getTextWidth(`${label}) ${text}`) + 10;
              doc.rect(margin + 10, currentY - 4, Math.min(textWidth, maxWidth - 20), 6, 'F');
            }

            currentY = addWrappedText(
              `${label}) ${text}`,
              margin + 15,
              currentY,
              maxWidth - 20,
              11,
              isCorrect ? 'bold' : 'normal'
            );
            currentY += 2;
          }
        });

        const correctOption = q.options?.find(o => o.correct || o.is_correct);
        if (correctOption) {
          currentY += 3;
          currentY = checkPageBreak(currentY, 10);
          const correctLabel = q.options.indexOf(correctOption);
          const correctAnswer = `Correct Answer: ${optionLabels[correctLabel] || 'N/A'}`;
          doc.setFillColor(255, 255, 200);
          const answerWidth = doc.getTextWidth(correctAnswer) + 10;
          doc.rect(margin + 15, currentY - 4, Math.min(answerWidth, maxWidth - 30), 6, 'F');
          currentY = addWrappedText(correctAnswer, margin + 20, currentY, maxWidth - 40, 10, 'bold');
        }

        const marks = q.marks || examData.marks_per_question || 1;
        currentY += 3;
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        doc.text(`[${marks} mark${marks !== 1 ? 's' : ''}]`, pageWidth - margin - 30, currentY);

        currentY += 8;
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 10;
      });
    } else {
      currentY = addWrappedText('No questions available for this exam.', margin, currentY, maxWidth, 12, 'italic');
    }

    // Page numbers
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 30, pageHeight - 10);
    }

    const fileName = `${(examData.exam_name || 'exam').replace(/[^a-z0-9]/gi, '_')}_questions.pdf`;

    try {
      doc.save(fileName);
      toast.success('PDF downloaded successfully!', {
        duration: 3000,
        position: 'top-right',
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to download PDF. Please try again.', {
        duration: 3000,
        position: 'top-right',
      });
    }
  };



  if (!examData) return null;
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
              isLoading={isSaving}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isSaving ? (
                <>
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
