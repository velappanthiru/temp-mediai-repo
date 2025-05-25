import { getExamDetailsById } from '@/utils/commonapi';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FaChevronLeft, FaChevronRight, FaSave, FaPaperPlane, FaDownload, FaArrowLeft, FaRegClock, FaBookOpen, FaFileAlt, FaBullseye, FaLock, FaCheck, FaTimes, FaUser } from 'react-icons/fa';

const SimpleExamPage = () => {
  // Mock data for demonstration
  const [examData, setExamData] = useState();

  const [loading, setLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [lockedQuestions, setLockedQuestions] = useState({});
  const [showResults, setShowResults] = useState(false);

  const router = useRouter()

  const examId = router.query.id;
  console.log("🚀 ~ SimpleExamPage ~ examId:", examId)
  // Fetch exam data on component mount

  useEffect(() => {
    if (examId) {
      fetchExamData(examId);
    } else {
      setLoading(false);
    }
  }, [examId]);

  const fetchExamData = async (examId) => {
    console.log("check");
    try {
      setLoading(true);

      // Replace with your actual API endpoint
      const response = await getExamDetailsById(examId);

      if (response) {
        setExamData(response?.data?.data);
      }
    } catch (err) {
      console.error('Error fetching exam:', err);
      toast.error('Failed to load exam data', {
        duration: 4000,
        position: 'top-right',
      });
    } finally {
      setLoading(false);
    }
  };
  const handleAnswerSelect = (questionIndex, optionIndex) => {
    if (lockedQuestions[questionIndex]) return;

    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));

    setLockedQuestions(prev => ({
      ...prev,
      [questionIndex]: true
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < examData?.questions?.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const getAnswerStats = () => {
    let correct = 0;
    let attempted = 0;

    examData?.questions?.forEach((question, qIndex) => {
      if (selectedAnswers[qIndex] !== undefined) {
        attempted++;
        const selectedOption = question.options[selectedAnswers[qIndex]];
        if (selectedOption?.is_correct) {
          correct++;
        }
      }
    });

    return { correct, attempted, total: examData?.questions?.length };
  };

  const handleSubmitExam = () => {
    setShowResults(true);
  };



  const stats = getAnswerStats();
  const currentQ = examData?.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / examData?.questions?.length) * 100;
  const isCurrentQuestionLocked = lockedQuestions[currentQuestion];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto py-8">
        {/* Exam Header Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-4 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FaFileAlt className="w-8 h-8 text-white" />
            </div>
            <div className='w-[calc(100%-5rem)]'>
              <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-1">{examData?.exam_name}</h1>
              <p className="text-lg text-gray-600">{examData?.book_name}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <FaRegClock className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">Duration</span>
              </div>
              <div className="text-xl font-bold text-purple-900">{examData?.duration}</div>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-4 rounded-xl border border-indigo-200">
              <div className="flex items-center gap-2 mb-2">
                <FaFileAlt className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">Questions</span>
              </div>
              <div className="text-xl font-bold text-indigo-900">{examData?.total_questions}</div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <FaBullseye className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">Total Marks</span>
              </div>
              <div className="text-xl font-bold text-purple-900">{examData?.total_marks}</div>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-200">
              <div className="flex items-center gap-2 mb-2">
                <FaBookOpen className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">Per Question</span>
              </div>
              <div className="text-xl font-bold text-indigo-900">{examData?.marks_per_question} marks</div>
            </div>
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <span className="text-xl sm:text-2xl font-bold text-gray-900">
                Question {currentQuestion + 1} of {examData?.questions?.length}
              </span>
              <div className="hidden lg:block h-8 w-px bg-gray-200"></div>
              <span className="hidden lg:block text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full font-medium">
                {Math.round(progress)}% Complete
              </span>
              {isCurrentQuestionLocked && (
                <div className="hidden lg:flex items-center gap-2 text-sm text-amber-700 bg-amber-100 px-4 py-2 rounded-full border border-amber-200">
                  <FaLock className="w-3 h-3" />
                  <span className="font-medium">Answer Locked</span>
                </div>
              )}
            </div>
            <div className="hidden lg:flex items-center gap-6 text-sm">
              <div className="text-center">
                <div className="text-xl font-bold text-purple-600">{stats.attempted}</div>
                <div className="text-gray-500">Attempted</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-indigo-600">{stats.correct}</div>
                <div className="text-gray-500">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-purple-600">
                  {stats.total > 0 ? ((stats.correct / stats.total) * 100).toFixed(1) : 0}%
                </div>
                <div className="text-gray-500">Score</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-indigo-600 h-3 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-4 py-6 border-b border-purple-100">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex flex-col md:flex-row items-start gap-3">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">Q{currentQuestion + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                      Question {currentQuestion + 1}
                    </span>
                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {examData?.marks_per_question} Marks
                    </span>
                    {isCurrentQuestionLocked && (
                      <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <FaLock className="w-3 h-3" />
                        <span>Locked</span>
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
                    {currentQ?.question_text}
                  </h2>
                </div>
              </div>
              <div className="flex items-center md:flex-col gap-3 md:items-end md:text-right">
                <div className="text-sm text-gray-500 leading-[1]">Status</div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                  selectedAnswers[currentQuestion] !== undefined
                    ? 'bg-green-100 text-green-700'
                    : 'bg-orange-100 text-orange-700'
                }`}>
                  {selectedAnswers[currentQuestion] !== undefined ? (
                    <>
                      <FaCheck className="w-3 h-3 mr-1" />
                      Answered
                    </>
                  ) : (
                    'Not Answered'
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Choose the correct answer:
              </h3>
              {isCurrentQuestionLocked && (
                <p className="text-sm text-amber-600">
                  Answer has been submitted and cannot be changed.
                </p>
              )}
            </div>

            <div className="space-y-4">
              {currentQ?.options.map((option, optionIndex) => {
                const isSelected = selectedAnswers[currentQuestion] === optionIndex;
                const isCorrect = option.is_correct;
                const showAnswer = selectedAnswers[currentQuestion] !== undefined;

                return (
                  <div
                    key={option.id}
                    className={`
                      group relative border-2 rounded-xl p-4 transition-all duration-300 cursor-pointer
                      ${isCurrentQuestionLocked ? 'cursor-not-allowed' : 'hover:shadow-md'}
                      ${isSelected
                        ? showAnswer
                          ? isCorrect
                            ? 'border-green-400 bg-green-50'
                            : 'border-red-400 bg-red-50'
                          : 'border-purple-400 bg-purple-50'
                        : showAnswer && isCorrect
                          ? 'border-green-400 bg-green-50'
                          : 'border-gray-200 hover:border-purple-300 bg-white hover:bg-purple-50'
                      }
                    `}
                    onClick={() => handleAnswerSelect(currentQuestion, optionIndex)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`
                        w-10 h-10 rounded-full border-2 flex items-center justify-center text-base font-bold transition-all duration-300
                        ${isSelected
                          ? showAnswer
                            ? isCorrect
                              ? 'border-green-500 bg-green-500 text-white'
                              : 'border-red-500 bg-red-500 text-white'
                            : 'border-purple-500 bg-purple-500 text-white'
                          : showAnswer && isCorrect
                            ? 'border-green-500 bg-green-500 text-white'
                            : 'border-gray-300 bg-white text-gray-600 group-hover:border-purple-400'
                        }
                      `}>
                        {option.option}
                      </div>

                      <div className="flex-1">
                        <span className={`
                          text-base leading-relaxed
                          ${isSelected || (showAnswer && isCorrect) ? 'font-semibold' : 'font-medium'}
                          ${isSelected
                            ? showAnswer
                              ? isCorrect ? 'text-green-800' : 'text-red-800'
                              : 'text-purple-800'
                            : showAnswer && isCorrect
                              ? 'text-green-800'
                              : 'text-gray-800'
                          }
                        `}>
                          {option.text}
                        </span>
                      </div>

                      <div className="flex items-center">
                        {showAnswer && isCorrect && (
                          <div className="flex items-center gap-2 text-green-600">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                              <FaCheck className="text-white text-sm" />
                            </div>
                            <span className="text-sm font-semibold">Correct</span>
                          </div>
                        )}
                        {isSelected && showAnswer && !isCorrect && (
                          <div className="flex items-center gap-2 text-red-600">
                            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                              <FaTimes className="text-white text-sm" />
                            </div>
                            <span className="text-sm font-semibold">Your Answer</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
                className="flex items-center px-6 py-3 text-sm font-medium border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <FaChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </button>
              <button
                onClick={nextQuestion}
                disabled={currentQuestion === examData?.questions?.length - 1}
                className="flex items-center px-6 py-3 text-sm font-medium border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Next
                <FaChevronRight className="w-4 h-4 ml-2" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleSubmitExam}
                className="flex items-center px-6 py-3 text-sm font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <FaPaperPlane className="w-4 h-4 mr-2" />
                Submit Exam
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {showResults && (
          <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCheck className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Exam Completed!</h3>
              <p className="text-gray-600 mb-8">Congratulations on completing your exam.</p>

              <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{stats.attempted}</div>
                  <div className="text-sm text-gray-500 font-medium">Questions Attempted</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600 mb-2">{stats.correct}</div>
                  <div className="text-sm text-gray-500 font-medium">Correct Answers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {((stats.correct / stats.total) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-500 font-medium">Final Score</div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <button className="flex items-center px-6 py-3 mx-auto text-sm font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200">
                  <FaDownload className="w-4 h-4 mr-2" />
                  Download Certificate
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleExamPage;
