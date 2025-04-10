"use client"
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Clock, Users, BookOpen, Star } from 'lucide-react';
import { fetchCourses, CourseSummary } from '../../../apiCalls/fetchCourses';

export const PopularCourses: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [visibleCourses, setVisibleCourses] = useState<number>(3);
  const [totalSlides, setTotalSlides] = useState<number>(0);
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false
  });
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef<boolean>(false);
  const lastPageRef = useRef<number>(1);

  // Fetch courses data
  const loadCourses = async (page: number) => {
    try {
      if (isFetchingRef.current) return;

      setLoading(true);
      isFetchingRef.current = true;
      const data = await fetchCourses(page, 10);

      // Only append new courses if we're loading a new page
      if (page > lastPageRef.current) {
        setCourses(prev => [...prev, ...data.data.courses]);
      } else {
        setCourses(data.data.courses);
      }

      lastPageRef.current = page;
      setPagination(data.data.pagination);
      setLoading(false);
      isFetchingRef.current = false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load courses');
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    loadCourses(1);
  }, []);

  // Determine visible courses based on screen size
  const getVisibleCourses = (): number => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  };

  // Handle window resize and check for device size
  useEffect(() => {
    const checkDeviceSize = () => {
      setIsMobile(window.innerWidth < 768);
      setVisibleCourses(getVisibleCourses());
    };

    checkDeviceSize();
    setTotalSlides(Math.ceil(courses.length / getVisibleCourses()));

    window.addEventListener('resize', checkDeviceSize);
    return () => window.removeEventListener('resize', checkDeviceSize);
  }, [courses.length]);

  // Check if we need to fetch more courses when reaching the end
  useEffect(() => {
    if (courses.length === 0 || visibleCourses === 0) return;

    const currentSlides = Math.ceil(courses.length / visibleCourses);
    const isAtLastSlide = currentIndex >= currentSlides - 1;
    const hasMorePages = pagination.hasNextPage;

    if (isAtLastSlide && hasMorePages && !isFetchingRef.current) {
      loadCourses(pagination.currentPage + 1);
    }
  }, [currentIndex, courses.length, visibleCourses, pagination]);

  // Auto scroll functionality
  useEffect(() => {
    if (totalSlides === 0 || courses.length === 0) return;

    const startAutoScroll = () => {
      autoScrollRef.current = setInterval(() => {
        if (!isHovering) {
          setCurrentIndex(prevIndex => {
            const nextIndex = (prevIndex + 1) % totalSlides;
            return nextIndex;
          });
        }
      }, 5000);
    };

    startAutoScroll();

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [isHovering, totalSlides, courses.length]);

  const nextSlide = (): void => {
    setCurrentIndex(prevIndex => {
      const nextIndex = (prevIndex + 1) % totalSlides;
      return nextIndex;
    });
  };

  const prevSlide = (): void => {
    setCurrentIndex(prevIndex => (prevIndex === 0 ? totalSlides - 1 : prevIndex - 1));
  };

  const goToSlide = (index: number): void => {
    setCurrentIndex(index);
  };

  // Get display courses with proper offset
  const displayCourses = (): CourseSummary[] => {
    const startIndex = currentIndex * visibleCourses;
    const endIndex = Math.min(startIndex + visibleCourses, courses.length);
    return courses.slice(startIndex, endIndex);
  };



  // For mobile swipe functionality
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent): void => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent): void => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (): void => {
    if (touchStartX.current - touchEndX.current > 50) {
      nextSlide();
    } else if (touchEndX.current - touchStartX.current > 50) {
      prevSlide();
    }
  };

  if (loading && courses.length === 0) {
    return (
      <div className="relative w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 py-12 sm:py-16 lg:py-24 overflow-hidden bg-[#fbfdff]">
        <div className="max-w-full xl:max-w-[100rem] 2xl:max-w-[120rem] mx-auto relative z-10">
          <div className="text-center mb-12 sm:mb-16 md:mb-20 lg:mb-24">
            <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl 2xl:text-6xl font-bold text-gray-900 mt-2 font-Urbanist leading-tight">
              Loading Courses...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 py-12 sm:py-16 lg:py-24 overflow-hidden bg-[#fbfdff]">
        <div className="max-w-full xl:max-w-[100rem] 2xl:max-w-[120rem] mx-auto relative z-10">
          <div className="text-center mb-12 sm:mb-16 md:mb-20 lg:mb-24">
            <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl 2xl:text-6xl font-bold text-gray-900 mt-2 font-Urbanist leading-tight">
              Error: {error}
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 py-12 sm:py-16 lg:py-24 overflow-hidden bg-[#fbfdff]">
      <div className="max-w-full xl:max-w-[100rem] 2xl:max-w-[120rem] mx-auto relative z-10">
        <div className="text-center mb-12 sm:mb-16 md:mb-20 lg:mb-24">
          <h3 className="text-blue-600 font-medium text-base sm:text-lg md:text-xl font-Urbanist mb-3 sm:mb-4">
            Our Courses List
          </h3>
          <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-4xl 2xl:text-5xl font-bold text-gray-900 font-Urbanist leading-tight tracking-tight">
            Most Popular Courses
          </h2>
        </div>

        {/* Carousel Container */}
        <div
          className="relative px-2 sm:px-4 md:px-6 lg:px-8"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          ref={carouselRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Navigation Buttons */}
          <div className="hidden md:block absolute -left-2 sm:-left-4 top-1/2 transform -translate-y-1/2 z-10">
            <button
              onClick={prevSlide}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300"
              aria-label="Previous courses"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Courses Grid/Slider */}
          <div className="overflow-hidden">
            <div className="transition-all duration-500 ease-in-out">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
                {displayCourses().map((course) => (
                  <div
                    key={course._id}
                    className="overflow-hidden transition-all duration-300 transform hover:-translate-y-2 bg-white shadow-md hover:shadow-lg"
                  >
                    {/* Course Image */}
                    <div className="relative">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-48 sm:h-56 md:h-64 object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-1.5 rounded-tr-3xl rounded-bl-3xl rounded-tl-sm rounded-br-sm font-medium shadow-md text-sm font-Urbanist">
                          NRP {course.price.toFixed(2)}
                      </div>
                    </div>

                    {/* Course Content */}
                    <div className="p-5 sm:p-6 md:p-7">


                      {/* Title */}
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 md:mb-5 h-14 md:h-16 line-clamp-2 text-gray-800  transition-colors font-Urbanist">
                        {course.title}
                      </h3>

                      {/* Meta Information */}
                      <div className="flex flex-wrap items-center text-gray-700 mb-4 sm:mb-5 md:mb-6 text-sm font-Urbanist">
                        <div className="flex items-center mr-4 mb-2">
                          <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 text-blue-600" />
                          <span className="font-medium">{course.studentsEnrolled} Students</span>
                        </div>
                        <div className="flex items-center mr-4 mb-2">
                          <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 text-blue-600" />
                          <span className="font-medium">{course.teachersCount} Teachers</span>
                        </div>
                        <div className="flex items-center mb-2">
                          <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 text-blue-600" />
                          <span className="font-medium">{course.overallHours} Hours</span>
                        </div>
                      </div>

                      {/* Instructor */}
                      <div className="flex items-center justify-between border-t pt-4 sm:pt-5">
                        <div className="flex items-center min-w-0">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden mr-3 bg-gray-200 flex items-center justify-center flex-shrink-0">
                            <img
                              src="https://cdn.pixabay.com/photo/2016/11/29/12/52/face-1869641_1280.jpg"
                              alt={course.moduleLeader}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="font-medium text-gray-800 text-sm sm:text-base md:text-lg font-Urbanist truncate">
                            {course.moduleLeader}
                          </span>
                        </div>
                        <span className="text-blue-600 font-medium px-3 py-1.5 rounded-full text-sm font-Urbanist whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px] sm:max-w-[150px]">
                          {course.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Navigation Button */}
          <div className="hidden md:block absolute -right-2 sm:-right-4 top-1/2 transform -translate-y-1/2 z-10">
            <button
              onClick={nextSlide}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300"
              aria-label="Next courses"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center mt-8 sm:mt-10 md:mt-12">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 sm:w-4 sm:h-4 mx-1.5 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-blue-600 w-8 sm:w-10" : "bg-gray-300"}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularCourses;