import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from '../ui/button';

interface Instructor {
  id: string;
  name: string;
  title: string;
  imageUrl: string;
  studentCount: number;
  courseCount: number;
}

const InstructorsSection: React.FC = () => {
  // Track which instructor is being hovered
  const [hoveredInstructor, setHoveredInstructor] = useState<string | null>(
    null
  );

  const instructors: Instructor[] = [
    {
      id: "1",
      name: "Masum Billah",
      title: "UI / UX Designer",
      imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=faces",
      studentCount: 25,
      courseCount: 32,
    },
    {
      id: "2",
      name: "Munaim Billah",
      title: "UI / UX Designer",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces",
      studentCount: 25,
      courseCount: 32,
    },
    {
      id: "3",
      name: "Motasim Billah",
      title: "UI / UX Designer",
      imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=faces",
      studentCount: 25,
      courseCount: 32,
    },
    {
      id: "4",
      name: "Ekram Hossain",
      title: "UI / UX Designer",
      imageUrl: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop&crop=faces",
      studentCount: 25,
      courseCount: 32,
    },
  ];

  // Social media variants for animation
  const socialMediaVariants = {
    hidden: {
      opacity: 0,
      x: -50,
    },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        type: "spring",
        stiffness: 200,
      },
    }),
    exit: {
      opacity: 0,
      x: -50,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  // Improved plus button variants with smoother hover/unhover animations
  const plusButtonVariants = {
    initial: {
      opacity: 1,
      scale: 1,
      x: 0,
    },
    hover: {
      x: 50, // Move to the right
      opacity: 0, // Fade out
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    exit: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  return (
    // Aligned with previous components' container structure
    <div className="relative w-full mt-10 bg-[#fdfdfd] px-4 sm:px-6 md:px-8 lg:px-8 xl:px-8 2xl:px-16 py-6 sm:py-8 lg:py-20 overflow-hidden">
      {/* Inner container with matching max-width constraints */}
      <div className="max-w-full xl:max-w-[100rem] 2xl:max-w-[120rem] mx-auto relative z-10">
        {/* Section Header - Aligned with previous components */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 md:mb-16 lg:mb-20">
          <div className="relative mb-6 sm:mb-0">
            {/* Updated typography to match previous components */}
            <h3 className="text-blue-600 font-medium text-base sm:text-lg font-Urbanist mb-2">
              Talented Instructors
            </h3>
            <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-Urbanist xl:text-5xl 2xl:text-6xl font-bold text-gray-900 mt-2  leading-tight">
              Our Expert Instructors
            </h2>
          </div>

          {/* Button styled to match HeroSection */}
          <Button
            size="lg"
            asChild
            className="group relative text-white px-6 sm:px-8 py-3 sm:py-4 bg-[#1A73E8] border-2 border-[#1A73E8] rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-lg hover:border-[#1A73E8] hover:text-[#1A73E8]"
          >
            <a href="/allInstructor" className="flex gap-2 relative z-10 p-2 sm:p-4">
              <span className="relative z-20 font-Urbanist text-sm sm:text-base">
                View All
              </span>
              <div className="absolute inset-0 w-full h-full bg-white -z-10 transform translate-x-full transition-transform duration-500 group-hover:translate-x-0" />
            </a>
          </Button>
        </div>

        {/* Instructors Grid - Consistent gap patterns with previous components */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 xl:gap-8">
          {instructors.map((instructor) => (
            <div
              key={instructor.id}
              className="bg-white rounded-lg p-4 sm:p-5 md:p-6 border border-gray-200 flex flex-col items-center h-auto min-h-82"
            >
              {/* Circular Instructor Image with touch support for mobile */}
              <div
                className="relative mb-3 sm:mb-4 group"
                onMouseEnter={() => setHoveredInstructor(instructor.id)}
                onMouseLeave={() => setHoveredInstructor(null)}
                onTouchStart={() =>
                  setHoveredInstructor(
                    hoveredInstructor === instructor.id
                      ? null
                      : instructor.id
                  )
                }
              >
                <div className="w-32 h-32 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50">
                  <img
                    src={instructor.imageUrl}
                    alt={instructor.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Animated plus button with improved animations */}
                <AnimatePresence>
                  <motion.button
                    key={`plus-${instructor.id}`}
                    className="absolute bottom-1 right-1 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-7 lg:h-7 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors duration-300"
                    variants={plusButtonVariants}
                    initial="initial"
                    animate={
                      hoveredInstructor === instructor.id ? "hover" : "exit"
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-5 lg:h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </motion.button>
                </AnimatePresence>

                {/* Social Media Icons with Animation that appears on hover/touch */}
                <AnimatePresence>
                  {hoveredInstructor === instructor.id && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                      <div className="flex space-x-1.5">
                        {[
                          {
                            color: "bg-[#1877f2] hover:bg-blue-700",
                            icon: (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                              </svg>
                            ),
                          },
                          {
                            color: "bg-[#00acee] hover:bg-blue-500",
                            icon: (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                              </svg>
                            ),
                          },
                          {
                            color: "bg-[#0a66c2] hover:bg-blue-800",
                            icon: (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                              </svg>
                            ),
                          },
                        ].map((item, index) => (
                          <motion.button
                            key={index}
                            className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-7 lg:h-7 ${item.color} text-white rounded-full flex items-center justify-center shadow-md`}
                            custom={index}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            variants={socialMediaVariants}
                          >
                            {item.icon}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Instructor Name and Title - responsive typography */}
              <h3 className="text-lg sm:text-xl md:text-xl font-semibold text-gray-900 text-center mb-1 sm:mb-2 font-Urbanist">
                {instructor.name}
              </h3>
              <p className="text-blue-600 text-sm font-Urbanist sm:text-base md:text-base text-center mb-3 sm:mb-4">
                {instructor.title}
              </p>
              <div className="flex-grow"></div>

              {/* Improved border with better visibility */}
              <div className="w-full border-t border-gray-100 my-2 sm:my-3">
                {/* This empty div ensures the border is visible */}
              </div>

              {/* Instructor Stats - Improved spacing and typography */}




              <div className="w-full flex justify-between items-center mt-2 sm:mt-3">
                <div className="flex items-center text-gray-900">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1.5 opacity-70"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="text-base sm:text-sm font-Urbanist">
                    {instructor.studentCount}+ Students
                  </span>
                </div>



                <div className="flex items-center text-gray-900">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1.5 opacity-70"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <span className="text-base sm:text-sm font-Urbanist">
                    {instructor.courseCount} Courses
                  </span>
                </div>
              </div>















            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstructorsSection;