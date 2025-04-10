"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  ChevronRight,
  X,
  Users,
  Clock,
  Award,
  Monitor,
  CheckCircle,
  Filter,
  ChevronLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchCourses  } from "../../../apiCalls/fetchCources";

// Define course types
type CourseCategory =
  | "All Courses"
  | "Engineering Entrance Preparation"
  | "Management Entrance Preparation";

type Course = {
  _id: string;
  title: string;
  description: string[];
  category: CourseCategory;
  studentsEnrolled: number;
  teachersCount: number;
  overallHours: number;
  price: number;
  moduleLeader: string;
  courseHighlights: string[];
  curriculum: Array<{
    title: string;
    duration: number;
    description: string;
  }>;
  learningFormat: Array<{
    name: string;
    description: string;
  }>;
  image?: string; // We'll add a default image since it's not in the API
};

// NoSSR wrapper component - This prevents the component from rendering on the server
function NoSSR({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with the same structure but no dynamic content
    return (
      <div className="w-full mt-10 bg-white px-4 sm:px-6 md:px-8 lg:px-8 xl:px-8 2xl:px-16 py-6 sm:py-8 md:py-10 lg:py-12">
        <div className="animate-pulse">
          <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-12 w-96 bg-gray-200 rounded mb-8"></div>

          <div className="flex items-center mb-4">
            <div className="h-4 w-4 bg-gray-200 rounded-full mr-2"></div>
            <div className="h-6 w-32 bg-gray-200 rounded"></div>
          </div>

          <div className="flex gap-4 mb-10">
            <div className="h-10 w-32 bg-gray-200 rounded"></div>
            <div className="h-10 w-64 bg-gray-200 rounded"></div>
            <div className="h-10 w-48 bg-gray-200 rounded"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="bg-gray-100 rounded-xl shadow overflow-hidden"
              >
                <div className="h-48 bg-gray-200"></div>
                <div className="p-5">
                  <div className="h-6 w-3/4 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 w-full bg-gray-200 rounded mb-4"></div>
                  <div className="flex justify-between mb-5">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-10 w-full bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Dialog component
interface CourseDialogProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
}

const CourseDialog: React.FC<CourseDialogProps> = ({
  course,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col md:flex-row">
        {/* Image section - Fixed width on desktop, full width on mobile */}
        <div className="relative w-full md:w-[40%] h-72 md:h-auto flex-shrink-0">
          <Image
            src={
              course.image ||
              "https://images.unsplash.com/photo-1552664730-d307ca884978"
            }
            alt={course.title}
            fill
            className="object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium font-Urbanist">
              {course.category}
            </span>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content section - Scrollable */}
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto">
          <h2 className="font-Urbanist text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold mb-4">
            {course.title}
          </h2>

          <div className="flex flex-wrap gap-4 sm:gap-6 mb-6">
            <div className="flex items-center">
              <Users className="text-blue-600 mr-2" size={20} />
              <span className="font-Urbanist text-gray-700">
                {course.studentsEnrolled} Students
              </span>
            </div>
            <div className="flex items-center">
              <Clock className="text-blue-600 mr-2" size={20} />
              <span className="font-Urbanist text-gray-700">
                {course.overallHours} Hours
              </span>
            </div>
            <div className="flex items-center bg-blue-50 px-3 py-1 rounded-md">
              <span className="font-Urbanist text-gray-700 font-semibold">
                NRP {course.price}
              </span>
            </div>
          </div>

          <div className="font-Urbanist text-sm sm:text-base md:text-base lg:text-lg text-gray-600 mb-8 leading-relaxed">
            {course.description.map((desc, index) => (
              <p key={index} className="mb-2">
                {desc}
              </p>
            ))}
          </div>

          <div className="space-y-6 sm:space-y-8">
            <div>
              <h3 className="font-Urbanist text-xl font-bold mb-4">
                Course Curriculum
              </h3>
              <div className="space-y-3">
                {course.curriculum.map((item, index) => (
                  <div key={index} className="bg-blue-50 p-3 rounded-lg font-Urbanist">
                    <h4 className="font-bold mb-1">
                      {item.title}{" "}
                      <span className="font-normal text-sm">
                        ({item.duration} hours)
                      </span>
                    </h4>
                    <p className="text-sm text-gray-700">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-Urbanist text-xl font-bold mb-4 flex items-center">
                <Award className="text-blue-600 mr-2" size={20} />
                Course Highlights
              </h3>
              <ul className="space-y-3 font-Urbanist pl-8">
                {course.courseHighlights.map((highlight, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle
                      className="text-blue-600 mr-3 flex-shrink-0 mt-1"
                      size={16}
                    />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-Urbanist text-xl font-bold mb-4 flex items-center">
                <Monitor className="text-blue-600 mr-2" size={20} />
                Learning Format
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-Urbanist">
                {course.learningFormat.map((format, index) => (
                  <div key={index} className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-bold mb-2">{format.name}</h4>
                    <p className="text-sm text-gray-700">
                      {format.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <Link href="/register" className="block w-full">
                <button className="group relative text-white px-6 sm:px-8 py-3 sm:py-4 bg-[#1A73E8] border-2 border-[#1A73E8] rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-lg hover:border-[#1A73E8] hover:text-[#1A73E8] hover:bg-transparent w-full">
                  <span className="relative z-20 font-Urbanist text-sm sm:text-base">
                    Enroll Now
                  </span>
                  <div className="absolute inset-0 w-full h-full bg-white -z-10 transform translate-x-full transition-transform duration-500 group-hover:translate-x-0" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// Course card component
const CourseCard: React.FC<{
  course: Course;
  onLearnMore: () => void;
}> = ({ course, onLearnMore }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      <div className="relative h-52">
        <Image
          src={
            course.image ||
            "https://images.unsplash.com/photo-1552664730-d307ca884978"
          }
          alt={course.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-medium font-Urbanist">
            {course.category}
          </span>
        </div>
      </div>

      <div className="p-5 sm:p-6 flex flex-col flex-grow">
        <h3 className="font-Urbanist font-bold text-xl mb-3">
          {course.title}
        </h3>
        <p className="font-Urbanist text-gray-600 text-sm sm:text-base mb-4 line-clamp-2">
          {course.description && course.description[0]}
        </p>

        <div className="flex justify-between text-sm text-gray-500 mb-5">
          <div className="flex items-center">
            <Users size={16} className="mr-1 text-blue-600" />
            <span className="font-Urbanist">
              {course.studentsEnrolled} Students
            </span>
          </div>
          <div className="flex items-center">
            <Clock size={16} className="mr-1 text-blue-600" />
            <span className="font-Urbanist">{course.overallHours} Hours</span>
          </div>
        </div>

        <button
          onClick={onLearnMore}
          className="group relative px-6 py-3 border-2 border-[#1A73E8] text-[#1A73E8] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md mt-auto w-full flex items-center justify-center"
        >
          <span className="relative z-20 font-Urbanist text-sm sm:text-base flex items-center">
            <BookOpen size={16} className="mr-2" />
            Learn More
            <ChevronRight
              size={16}
              className="ml-1 group-hover:translate-x-1 transition-transform"
            />
          </span>
          <div className="absolute inset-0 w-full h-full bg-[#1A73E8] -z-10 transform translate-x-full transition-transform duration-500 group-hover:translate-x-0" />
        </button>
      </div>
    </div>
  );
};

// Pagination component
const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center items-center mt-8 space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-lg ${
          currentPage === 1
            ? "text-gray-400 cursor-not-allowed"
            : "text-blue-600 hover:bg-blue-50"
        }`}
      >
        <ChevronLeft size={20} />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-lg ${
            currentPage === page
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-blue-50"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-lg ${
          currentPage === totalPages
            ? "text-gray-400 cursor-not-allowed"
            : "text-blue-600 hover:bg-blue-50"
        }`}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

// Main component content that will only render on client-side
function EngineeringCoursesContent() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 9;
  const router = useRouter()

  // Fetch courses when component mounts or dependencies change
  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      setError(null);

      try {
        const { courses, totalPages } = await fetchCourses(
          currentPage,
          limit
        );
        setCourses(courses);
        setTotalPages(totalPages);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load courses. Please try again later."
        );
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [ currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const openCourseDialog = (course: Course) => {
    setSelectedCourse(course);
    setIsDialogOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeCourseDialog = () => {
    setIsDialogOpen(false);
    document.body.style.overflow = "auto";
  };


  return (
    <div className="w-full">
      <p className="text-blue-600 font-medium text-base sm:text-lg font-Urbanist">
        Our Programs
      </p>

      <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl 2xl:text-6xl font-bold text-gray-900 mt-2 font-Urbanist leading-tight mb-8 sm:mb-10">
        Programs We Offer
      </h1>


      {loading ? (
        // Loading state
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        // Error state
        <div className="bg-red-50 text-red-600 rounded-xl p-8 text-center shadow-md">
          <h3 className="font-Urbanist text-xl font-bold mb-2">Error</h3>
          <p className="font-Urbanist">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Return Home
          </button>
        </div>
      ) : courses.length > 0 ? (
        // Courses grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 xl:gap-8">
          {courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              onLearnMore={() => openCourseDialog(course)}
            />
          ))}
        </div>
      ) : (
        // No courses found
        <div className="bg-white rounded-xl p-8 text-center shadow-md">
          <h3 className="font-Urbanist text-xl font-bold mb-2">
            No courses found
          </h3>
          <p className="font-Urbanist text-gray-600">
            No courses available in this category. Try selecting a different
            category.
          </p>
        </div>
      )}

      {/* Show pagination only when there are courses and more than one page */}
      {!loading && !error && courses.length > 0 && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      <CourseDialog
        course={selectedCourse}
        isOpen={isDialogOpen}
        onClose={closeCourseDialog}
      />
    </div>
  );
}

// Main component
export default function EngineeringCourses() {
  return (
    <div className="relative w-full mt-10 bg-white px-4 sm:px-6 md:px-8 lg:px-8 xl:px-8 2xl:px-16 py-6 sm:py-8 md:py-10 lg:py-12 overflow-hidden">
      <div className="max-w-full xl:max-w-[100rem] 2xl:max-w-[120rem] mx-auto">
        <NoSSR>
          <EngineeringCoursesContent />
        </NoSSR>
      </div>
    </div>
  );
}