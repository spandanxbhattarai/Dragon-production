"use client"
import { useState, useEffect } from 'react';
import { Toaster} from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
    Clock,
    AlertCircle,
    BookOpen,
    Award,
    Calendar,
    ClipboardList,
    Flag,
    Hourglass,
    Info,
    Rocket,
    Zap,
    Download,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import Cookies from 'js-cookie';
import { format, parseISO, isBefore, isAfter, differenceInSeconds } from 'date-fns';
import { useRouter } from 'next/navigation';
import { fetchExams, fetchQuestionSheet, submitExamAnswers, submitExamResult } from '../../../../apiCalls/manageExam';

enum ExamView {
    LIST,
    RULES,
    QUESTIONS,
    RESULT
}

enum ExamStatus {
    CURRENT = 'current',
    UPCOMING = 'upComming'
}

interface Exam {
    _id: string;
    exam_id: string;
    title: string;
    description: string;
    exam_name: string;
    startDateTime: string;
    endDateTime: string;
    total_marks: number;
    pass_marks: number;
    question_sheet_id?: string;
    batches: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
    status?: string;
    duration: number;
    negativeMarking: boolean;
}

interface Question {
    question: string;
    marks: number;
    answers: string[];
    _id: string;
}

interface QuestionSheet {
    _id: string;
    sheetName: string;
    questions: Question[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface PaginationData {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

interface ExamResult {
    totalQuestions: number;
    correctAnswersCount: number;
    totalMarksObtained: number;
    totalPossibleMarks: number;
    percentage: number;
    examName: string | undefined;
    unAnsweredQuestions: number;
    answers: {
        question: string;
        userAnswer: string;
        correctAnswer: string;
        marksObtained: number;
        marksDeducted: number;
    }[];
}

export default function ExamPortal() {
    const [currentView, setCurrentView] = useState<ExamView>(ExamView.LIST);
    const router = useRouter();
    const [currentExams, setCurrentExams] = useState<Exam[]>([]);
    const [upcomingExams, setUpcomingExams] = useState<Exam[]>([]);
    const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
    const [questionSheet, setQuestionSheet] = useState<QuestionSheet | null>(null);
    const [currentPagination, setCurrentPagination] = useState<PaginationData | null>(null);
    const [upcomingPagination, setUpcomingPagination] = useState<PaginationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [upcomingPage, setUpcomingPage] = useState(1);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState<ExamStatus>(ExamStatus.CURRENT);
    const [result, setResult] = useState<ExamResult | null>(null);
    const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});
    const limit = 10;

    useEffect(() => {
        const userCookie = Cookies.get("user");
        if (!userCookie) {
            console.error("User cookie not found");
            return;
        }

        try {
            const { batch, id } = JSON.parse(userCookie);
            if (batch && id) {
                loadExams(currentPage, upcomingPage, batch, id);
            }
        } catch (err) {
            console.error("Error parsing user cookie", err);
            setError('Failed to load user data. Please try again.');
        }
    }, [currentPage, upcomingPage, activeTab]);

    const loadExams = async (currentPage: number, upcomingPage: number, batch: string, id: string) => {
        try {
            setLoading(true);

            // Fetch current exams
            const currentData = await fetchExams({
                batch,
                id,
                page: currentPage,
                limit,
                status: ExamStatus.CURRENT
            });
            setCurrentExams(currentData.data);
            setCurrentPagination(currentData.pagination);

            // Fetch upcoming exams
            const upcomingData = await fetchExams({
                batch,
                id,
                page: upcomingPage,
                limit,
                status: ExamStatus.UPCOMING
            });
            setUpcomingExams(upcomingData.data);
            setUpcomingPagination(upcomingData.pagination);

            setError(null);
        } catch (err) {
            setError('Failed to load exams. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadQuestionSheet = async (id: string) => {
        try {
            setLoading(true);
            const data = await fetchQuestionSheet(id);
            setQuestionSheet(data.data);
            setError(null);
        } catch (err) {
            setError('Failed to load exam questions. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage: number, isUpcoming: boolean = false) => {
        if (isUpcoming) {
            if (newPage < 1 || (upcomingPagination && newPage > upcomingPagination.totalPages)) return;
            setUpcomingPage(newPage);
        } else {
            if (newPage < 1 || (currentPagination && newPage > currentPagination.totalPages)) return;
            setCurrentPage(newPage);
        }
    };

    const isExamActive = (exam: Exam) => {
        const now = new Date();
        const start = parseISO(exam.startDateTime);
        const end = parseISO(exam.endDateTime);
        return isBefore(start, now) && isAfter(end, now);
    };

    const handleBeginExam = (exam: Exam) => {
        if (!exam.question_sheet_id) {
            setError('Question sheet not available for this exam.');
            return;
        }
        if (!isExamActive(exam)) {
            setError('Exam is not currently active.');
            return;
        }

        setSelectedExam(exam);
        setCurrentView(ExamView.RULES);
    };

    const startExam = async () => {
        if (!selectedExam?.question_sheet_id) return;
        await loadQuestionSheet(selectedExam.question_sheet_id);

        setTimeLeft(selectedExam.duration * 60);

        setCurrentView(ExamView.QUESTIONS);
    };

    const handleAnswerChange = (questionId: string, answerIndex: number) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answerIndex
        }));
    };

    const handleSubmit = async () => {
        if (!questionSheet || !selectedExam) return;

        try {
            setSubmitting(true);


            // Submit answers to get correct answers
            const response = await submitExamAnswers(
                questionSheet._id
            );

            // Calculate result
            const calculatedResult = calculateResult(
                questionSheet,
                answers,
                response.data,
                selectedExam.negativeMarking
            );

            setResult(calculatedResult);

            // Submit final result to backend
            await submitExamResult(selectedExam._id, calculatedResult);
            setCurrentView(ExamView.RESULT);
            alert("Exam Submitted Sucessfully")

        } catch (err) {
            setError('Failed to submit answers. Please try again.');
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const calculateResult = (
        questionSheet: QuestionSheet,
        userAnswers: Record<string, number>,
        correctAnswersData: any,
        negativeMarking: boolean
    ): ExamResult => {
        let correctAnswersCount = 0;
        let totalMarksObtained = 0;
        let unAnsweredQuestions = 0;
        const totalPossibleMarks = questionSheet.questions.reduce((sum, q) => sum + q.marks, 0);

        const answersDetail = questionSheet.questions.map(q => {
            const userAnswerIndex = userAnswers[q._id] ?? -1;
            let userAnswer = "Not answered";
            let isUnanswered = false;

            // Check if answer is empty (unanswered)
            if (userAnswerIndex === -1) {
                isUnanswered = true;
                unAnsweredQuestions++;
            } else {
                userAnswer = q.answers[userAnswerIndex] || "Not answered";
            }

            // Find correct answer from the response
            const correctAnswerData = correctAnswersData.questions.find((qa: any) => qa._id === q._id);
            const correctAnswer = correctAnswerData?.correctAnswer || "";

            const isCorrect = userAnswer === correctAnswer;
            let marksObtained = 0;
            let marksDeducted = 0;

            if (isCorrect) {
                marksObtained = q.marks;
                correctAnswersCount++;
            } else if (negativeMarking && userAnswerIndex >= 0 && !isUnanswered) {
                // Only apply negative marking for answered (but incorrect) questions
                marksDeducted = q.marks * 1; // Assuming 100% negative marking
            }

            totalMarksObtained += marksObtained - marksDeducted;

            return {
                question: q.question,
                userAnswer,
                correctAnswer,
                marksObtained,
                marksDeducted,
                isUnanswered
            };
        });

        const percentage = (totalMarksObtained / totalPossibleMarks) * 100;

        return {
            totalQuestions: questionSheet.questions.length,
            correctAnswersCount,
            totalMarksObtained,
            totalPossibleMarks,
            percentage,
            unAnsweredQuestions,
            answers: answersDetail,
            examName: selectedExam?.exam_name || selectedExam?.title || "Exam"
        };
    };
    const toggleQuestionExpand = (questionId: string) => {
        setExpandedQuestions(prev => ({
            ...prev,
            [questionId]: !prev[questionId]
        }));
    };



    const downloadResult = () => {
        if (!result || !selectedExam) return;

        const content = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>${selectedExam.exam_name} - Exam Result</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                text-align: center;
                margin-bottom: 30px;
              }
              .header h1 {
                color: #2c3e50;
                margin-bottom: 5px;
              }
              .header p {
                color: #7f8c8d;
                margin-top: 0;
              }
              .summary {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 15px;
                margin-bottom: 30px;
              }
              .summary-card {
                background: #f8f9fa;
                border-radius: 8px;
                padding: 15px;
                text-align: center;
                border-top: 4px solid;
              }
              .summary-card h3 {
                margin: 0 0 5px 0;
                font-size: 14px;
                color: #7f8c8d;
              }
              .summary-card .value {
                font-size: 24px;
                font-weight: bold;
                color: #2c3e50;
              }
              .breakdown-title {
                color: #2c3e50;
                border-bottom: 2px solid #ecf0f1;
                padding-bottom: 10px;
                margin-bottom: 20px;
              }
              .question {
                margin-bottom: 20px;
                padding: 15px;
                background: #f8f9fa;
                border-radius: 8px;
              }
              .indicator {
                display: inline-block;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                margin-left: 10px;
              }
              .correct {
                background: #2ecc71;
              }
              .incorrect {
                background: #e74c3c;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${selectedExam.exam_name}</h1>
              <p>Exam Result Summary</p>
            </div>
            
            <div class="summary">
              <div class="summary-card" style="border-color: #3498db">
                <h3>Total Marks</h3>
                <div class="value">${result.totalMarksObtained}/${result.totalPossibleMarks}</div>
              </div>
              <div class="summary-card" style="border-color: #2ecc71">
                <h3>Percentage</h3>
                <div class="value">${result.percentage.toFixed(2)}%</div>
              </div>
              <div class="summary-card" style="border-color: #e74c3c">
                <h3>Correct Answers</h3>
                <div class="value">${result.correctAnswersCount}/${result.totalQuestions}</div>
              </div>
            </div>
            
            <h3 class="breakdown-title">Question-wise Breakdown</h3>
            
            ${result.answers.map((answer, index) => `
              <div class="question">
                <strong>${index + 1}. ${answer.question}</strong>
                <span class="indicator ${answer.marksObtained > 0 ? 'correct' : 'incorrect'}"></span>
                <div><span style="color:#7f8c8d">Your Answer:</span> ${answer.userAnswer || 'Not answered'}</div>
                <div><span style="color:#7f8c8d">Correct Answer:</span> ${answer.correctAnswer}</div>
                <div><span style="color:#7f8c8d">Marks Obtained:</span> ${answer.marksObtained}</div>
                ${answer.marksDeducted > 0 ? `<div><span style="color:#e74c3c">Marks Deducted:</span> ${answer.marksDeducted}</div>` : ''}
              </div>
            `).join('')}
          </body>
          </html>
        `;

        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedExam.exam_name}_result.html`;
        a.click();
        URL.revokeObjectURL(url);
    };

    useEffect(() => {
        if (currentView === ExamView.QUESTIONS && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        handleSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [currentView, timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const calculateProgress = () => {
        if (!selectedExam) return 0;
        const totalDuration = differenceInSeconds(
            parseISO(selectedExam.endDateTime),
            parseISO(selectedExam.startDateTime)
        );
        return ((totalDuration - timeLeft) / totalDuration) * 100;
    };

    const renderExamCards = (exams: Exam[], isUpcoming: boolean = false) => {
        return exams.map((exam) => (
            <div
                key={exam._id}
                className={`p-6 rounded-lg border hover:shadow-md transition-shadow flex flex-col h-full border-l-4 ${ 'border-[#182c34] bg-white'}`}
            >
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            {exam.exam_name}
                           
                        </h3>
                        <p className="text-muted-foreground mt-1">{exam.title}</p>
                    </div>
                    <div className={`p-2 rounded-full ${ 'bg-[#182c34]'}`}>
                        <BookOpen className={`h-4 w-4 ${'text-white'}`} />
                    </div>
                </div>

                <div className="mt-4 flex-grow">
                    <p className="text-muted-foreground mb-4">{exam.description}</p>

                    <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>
                                {format(parseISO(exam.startDateTime), 'MMM d, yyyy h:mm a')} - {' '}
                                {format(parseISO(exam.endDateTime), 'MMM d, yyyy h:mm a')}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Award className="h-4 w-4 text-muted-foreground" />
                            <span>Total Marks: {exam.total_marks}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Flag className="h-4 w-4 text-muted-foreground" />
                            <span>Passing Marks: {exam.pass_marks}</span>
                        </div>
                        {!isUpcoming && (
                            <div className="flex items-center space-x-2">
                                <Info className="h-4 w-4 text-muted-foreground" />
                                <span>Negative Marking: {exam.negativeMarking ? 'Yes' : 'No'}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-4 flex justify-end">
                    <Button
                        onClick={() => handleBeginExam(exam)}
                        disabled={!exam.question_sheet_id || isUpcoming}
                        variant={exam.question_sheet_id && !isUpcoming ? "default" : "secondary"}
                        className={ 'text-white bg-[#182c34] hover:bg-[#2b434c]'}
                    >
                        {isUpcoming ? (
                            <span className="flex items-center">
                                <Clock className="h-4 w-4 mr-2" />
                                Coming Soon
                            </span>
                        ) : exam.question_sheet_id ? (
                            'Begin Exam'
                        ) : (
                            'Not Available'
                        )}
                    </Button>
                </div>
            </div>
        ));
    };

    if (loading && currentView === ExamView.LIST && !currentExams.length && !upcomingExams.length) {
        return (
            <div className="container mx-auto py-8 space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex flex-col space-y-3">
                        <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-8">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    if (currentView === ExamView.RESULT && result && selectedExam) {
        return (
            <div className="container mx-auto py-8 max-w-4xl">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold">Exam Results</h1>
                            <p className="text-muted-foreground">{selectedExam.exam_name}</p>
                        </div>
                        <Button onClick={downloadResult} variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download Result
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground">Total Marks</p>
                            <p className="text-2xl font-bold">
                                {result.totalMarksObtained} / {result.totalPossibleMarks}
                            </p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground">Percentage</p>
                            <p className="text-2xl font-bold">{result.percentage.toFixed(2)}%</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground">Correct Answers</p>
                            <p className="text-2xl font-bold">
                                {result.correctAnswersCount} / {result.totalQuestions}
                            </p>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground">Status</p>
                            <p className="text-2xl font-bold">
                                {result.percentage >= selectedExam.pass_marks ? 'Passed' : 'Failed'}
                            </p>
                        </div>
                    </div>

                    <h2 className="text-xl font-semibold mb-4">Question-wise Breakdown</h2>
                    <div className="space-y-4">
                        {result.answers.map((answer, index) => (
                            <div key={index} className="border rounded-lg overflow-hidden">
                                <button
                                    className="w-full flex justify-between items-center p-4 hover:bg-gray-50"
                                    onClick={() => toggleQuestionExpand(`question-${index}`)}
                                >
                                    <div className="flex items-center space-x-3">
                                        <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full ${answer.userAnswer === answer.correctAnswer ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {index + 1}
                                        </span>
                                        <span className="font-medium">{answer.question}</span>
                                    </div>
                                    {expandedQuestions[`question-${index}`] ? (
                                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                    )}
                                </button>
                                {expandedQuestions[`question-${index}`] && (
                                    <div className="p-4 pt-0 border-t">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-muted-foreground">Your Answer</p>
                                                <p className={`font-medium ${answer.userAnswer === answer.correctAnswer ? 'text-green-600' : 'text-red-600'}`}>
                                                    {answer.userAnswer}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Correct Answer</p>
                                                <p className="font-medium text-green-600">{answer.correctAnswer}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mt-4">
                                            <div>
                                                <p className="text-sm text-muted-foreground">Marks Obtained</p>
                                                <p className="font-medium">{answer.marksObtained}</p>
                                            </div>
                                            {answer.marksDeducted > 0 && (
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Marks Deducted</p>
                                                    <p className="font-medium text-red-600">-{answer.marksDeducted}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex justify-end">
                        <Button onClick={() => router.push('/dashboard/studentsCourse')}>
                            Back to Courses
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (currentView === ExamView.RULES && selectedExam) {
        return (
            <div className="container mx-auto py-8 max-w-4xl">
                <div className="bg-white rounded-lg shadow-md border border-primary p-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <BookOpen className="h-6 w-6 text-primary" />
                        <h1 className="text-2xl font-bold">{selectedExam.exam_name}</h1>
                    </div>
                    <p className="text-muted-foreground mb-6">{selectedExam.title}</p>

                    <div className="grid gap-4 md:grid-cols-2 mb-6">
                        <div className="flex items-start space-x-3">
                            <Calendar className="h-5 w-5 mt-0.5 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Exam Duration</p>
                                <p className="text-sm text-muted-foreground">
                                    {format(parseISO(selectedExam.startDateTime), 'MMM d, yyyy h:mm a')} - {' '}
                                    {format(parseISO(selectedExam.endDateTime), 'MMM d, yyyy h:mm a')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <Award className="h-5 w-5 mt-0.5 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Marks</p>
                                <p className="text-sm text-muted-foreground">
                                    Total: {selectedExam.total_marks} | Passing: {selectedExam.pass_marks}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <Hourglass className="h-5 w-5 mt-0.5 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Duration</p>
                                <p className="text-sm text-muted-foreground">
                                    {Math.floor(selectedExam.duration)} minutes
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <Info className="h-5 w-5 mt-0.5 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Negative Marking</p>
                                <p className="text-sm text-muted-foreground">
                                    {selectedExam.negativeMarking ? 'Yes (100% deduction)' : 'No'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 mb-6">
                        <h3 className="font-medium flex items-center space-x-2">
                            <ClipboardList className="h-5 w-5" />
                            <span>Exam Rules & Regulations</span>
                        </h3>

                        <ul className="space-y-2 pl-2">
                            <li className="flex items-start space-x-2">
                                <Info className="h-4 w-4 mt-0.5 text-primary" />
                                <span>All questions are mandatory to attempt.</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <Info className="h-4 w-4 mt-0.5 text-primary" />
                                <span>The exam will auto-submit when time expires.</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <Info className="h-4 w-4 mt-0.5 text-primary" />
                                <span>Do not refresh the page during the exam.</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <Info className="h-4 w-4 mt-0.5 text-primary" />
                                <span>Each question may carry different marks.</span>
                            </li>
                            {selectedExam.negativeMarking && (
                                <li className="flex items-start space-x-2">
                                    <Info className="h-4 w-4 mt-0.5 text-primary" />
                                    <span>Incorrect answers will result in 25% marks deduction.</span>
                                </li>
                            )}
                        </ul>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <Button variant="outline" onClick={() => setCurrentView(ExamView.LIST)}>
                            Back
                        </Button>
                        <Button onClick={startExam}>
                            <Flag className="h-4 w-4 mr-2" />
                            Start Exam
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (currentView === ExamView.QUESTIONS && questionSheet && selectedExam) {
        return (
            <div className="container mx-auto py-8 max-w-5xl bg-white px-10 my-2 rounded-3xl">
                <div className="flex flex-col space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">{questionSheet.sheetName}</h1>
                            <p className="text-muted-foreground">{selectedExam.title}</p>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 bg-background px-4 py-2 rounded-lg border">
                                <Hourglass className="h-5 w-5 text-primary" />
                                <span className="font-medium">{formatTime(timeLeft)}</span>
                            </div>
                        </div>
                    </div>

                    <Progress value={calculateProgress()} className="h-2" />

                    <div className="space-y-6">
                        {questionSheet.questions.map((question, index) => (
                            <div key={question._id} className="border rounded-lg p-6 hover:shadow-sm transition-shadow">
                                <div className="flex justify-between items-start">
                                    <h2 className="text-lg font-semibold">
                                        Question {index + 1}
                                        <span className="text-sm text-muted-foreground ml-2">
                                            ({question.marks} mark{question.marks !== 1 ? 's' : ''})
                                        </span>
                                    </h2>
                                </div>

                                <p className="my-4 text-gray-800">{question.question}</p>

                                <RadioGroup
                                    value={answers[question._id]?.toString() || ''}
                                    onValueChange={(value) => handleAnswerChange(question._id, parseInt(value))}
                                >
                                    <div className="space-y-3">
                                        {question.answers.map((answer, ansIndex) => (
                                            <div key={ansIndex} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                                                <RadioGroupItem
                                                    value={ansIndex.toString()}
                                                    id={`${question._id}-${ansIndex}`}
                                                    className="h-5 w-5"
                                                />
                                                <Label
                                                    htmlFor={`${question._id}-${ansIndex}`}
                                                    className="text-base font-normal cursor-pointer"
                                                >
                                                    {answer}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </RadioGroup>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between items-center pt-6 border-t">
                        <div className="text-sm text-muted-foreground">
                            Answered {Object.keys(answers).length} of {questionSheet.questions.length} questions
                        </div>
                        <Button
                            onClick={handleSubmit}
                            disabled={submitting}
                            size="lg"
                            className="min-w-[150px]"
                        >
                            {submitting ? 'Submitting...' : 'Submit Exam'}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className=" max-w-4xl mx-auto py-8 px-10">
            <div className="flex flex-col space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Exam Portal</h1>
                    <p className="text-muted-foreground">Select an exam to begin your assessment</p>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b">
                    <button
                        className={`px-4 py-2 font-medium flex items-center gap-2 ${activeTab === ExamStatus.CURRENT
                            ? 'border-b-2 border-primary text-primary'
                            : 'text-muted-foreground'
                            }`}
                        onClick={() => setActiveTab(ExamStatus.CURRENT)}
                    >
                        <Zap className="h-4 w-4" />
                        Current Exams
                    </button>
                    <button
                        className={`px-4 py-2 font-medium flex items-center gap-2 ${activeTab === ExamStatus.UPCOMING
                            ? 'border-b-2 border-primary text-primary'
                            : 'text-muted-foreground'
                            }`}
                        onClick={() => setActiveTab(ExamStatus.UPCOMING)}
                    >
                        <Rocket className="h-4 w-4" />
                        Upcoming Exams
                    </button>
                </div>

                {loading ? (
                    <div className="container mx-auto py-8 space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex flex-col space-y-3">
                                <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                ) : (
                    <>
                        {/* Current Exams Section */}
                        {activeTab === ExamStatus.CURRENT && (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-semibold flex items-center gap-2">
                                    Active Exams
                                    <span className="text-sm bg-[#182c34] text-white px-2 py-1 rounded-full ml-2">
                                        {currentExams.length} available
                                    </span>
                                </h2>

                                {currentExams.length === 0 ? (
                                    <Alert>
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>No active exams</AlertTitle>
                                        <AlertDescription>There are currently no active exams for your batch.</AlertDescription>
                                    </Alert>
                                ) : (
                                    <>
                                        <div className="grid gap-4">
                                            {renderExamCards(currentExams)}
                                        </div>

                                        {currentPagination && currentPagination.totalPages > 1 && (
                                            <div className="flex justify-center pt-6">
                                                <div className="flex space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => handlePageChange(currentPage - 1)}
                                                        disabled={currentPage === 1}
                                                    >
                                                        Previous
                                                    </Button>

                                                    {Array.from({ length: Math.min(5, currentPagination.totalPages) }, (_, i) => {
                                                        let pageNum;
                                                        if (currentPagination.totalPages <= 5) {
                                                            pageNum = i + 1;
                                                        } else if (currentPage <= 3) {
                                                            pageNum = i + 1;
                                                        } else if (currentPage >= currentPagination.totalPages - 2) {
                                                            pageNum = currentPagination.totalPages - 4 + i;
                                                        } else {
                                                            pageNum = currentPage - 2 + i;
                                                        }

                                                        return (
                                                            <Button
                                                                key={pageNum}
                                                                variant={currentPage === pageNum ? "default" : "outline"}
                                                                onClick={() => handlePageChange(pageNum)}
                                                            >
                                                                {pageNum}
                                                            </Button>
                                                        );
                                                    })}

                                                    <Button
                                                        variant="outline"
                                                        onClick={() => handlePageChange(currentPage + 1)}
                                                        disabled={currentPage === currentPagination.totalPages}
                                                    >
                                                        Next
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}

                        {/* Upcoming Exams Section */}
                        {activeTab === ExamStatus.UPCOMING && (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-semibold flex items-center gap-2">
                                    Upcoming Exams
                                    <span className="text-sm bg-[#182c34] text-white px-2 py-1 rounded-full ml-2">
                                        {upcomingExams.length} scheduled
                                    </span>
                                </h2>

                                {upcomingExams.length === 0 ? (
                                    <Alert>
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>No upcoming exams</AlertTitle>
                                        <AlertDescription>There are currently no upcoming exams scheduled for your batch.</AlertDescription>
                                    </Alert>
                                ) : (
                                    <>
                                        <div className="grid gap-4 ">
                                            {renderExamCards(upcomingExams, true)}
                                        </div>

                                        {upcomingPagination && upcomingPagination.totalPages > 1 && (
                                            <div className="flex justify-center pt-6">
                                                <div className="flex space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => handlePageChange(upcomingPage - 1, true)}
                                                        disabled={upcomingPage === 1}
                                                    >
                                                        Previous
                                                    </Button>

                                                    {Array.from({ length: Math.min(5, upcomingPagination.totalPages) }, (_, i) => {
                                                        let pageNum;
                                                        if (upcomingPagination.totalPages <= 5)  {
                                                            pageNum = i + 1;
                                                        } else if (upcomingPage <= 3) {
                                                            pageNum = i + 1;
                                                        } else if (upcomingPage >= upcomingPagination.totalPages - 2) {
                                                            pageNum = upcomingPagination.totalPages - 4 + i;
                                                        } else {
                                                            pageNum = upcomingPage - 2 + i;
                                                        }

                                                        return (
                                                            <Button
                                                                key={pageNum}
                                                                variant={upcomingPage === pageNum ? "default" : "outline"}
                                                                onClick={() => handlePageChange(pageNum, true)}
                                                            >
                                                                {pageNum}
                                                            </Button>
                                                        );
                                                    })}

                                                    <Button
                                                        variant="outline"
                                                        onClick={() => handlePageChange(upcomingPage + 1, true)}
                                                        disabled={upcomingPage === upcomingPagination.totalPages}
                                                    >
                                                        Next
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
            <Toaster/>
        </div>
    );
}