import React, { useState, useEffect } from "react";
import { GraduationCap, BookOpen, Star, Pencil } from "lucide-react";
import { Button } from "../ui/button";
import AdvertisementDialog from "./advertisement";
import { useRouter } from "next/navigation";

const HeroSection = () => {
  const [isAdDialogOpen, setIsAdDialogOpen] = useState(true);
  const [screenSize, setScreenSize] = useState("md");
  const router = useRouter()

  // Detect screen size for precise layout adjustments
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width < 640) {
        setScreenSize("sm");
      } else if (width >= 640 && width < 768) {
        setScreenSize("md");
      } else if (width >= 768 && width < 1024) {
        setScreenSize("lg");
      } else if (width >= 1024 && width < 1280) {
        setScreenSize("xl");
      } else if (width >= 1280 && width < 1536) {
        setScreenSize("2xl");
      } else {
        setScreenSize("3xl");
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Helper functions to check screen size
  const isMedium = () => screenSize === "md";
  const isLarge = () => screenSize === "lg";
  const isXL = () => screenSize === "xl";
  const is2XL = () => screenSize === "2xl";
  const is3XL = () => screenSize === "3xl";
  const isLargeScreen = () => isXL() || is2XL() || is3XL();

  return (
    <>
      <div className="relative min-h-screen w-full bg-[#002935] overflow-hidden">
        {/* Background decorative elements - optimized for different screen sizes */}
        <div className="absolute inset-0 w-full h-full z-0">
          {/* Animated stars - progressively larger and more spread out on bigger screens */}
          <div className="absolute top-10 right-10 animate-pulse sm:top-12 md:top-16 lg:top-20 xl:top-24 2xl:top-28 opacity-80">
            <Star className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 text-blue-400" />
          </div>
          <div className="absolute top-20 right-20 animate-pulse delay-150 sm:top-24 md:top-32 lg:top-36 xl:top-40 2xl:top-44 opacity-60">
            <Star className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7 text-blue-300" />
          </div>
          <div className="absolute top-32 right-12 animate-pulse delay-300 sm:top-40 md:top-48 lg:top-52 xl:top-56 2xl:top-60 opacity-40">
            <Star className="w-2 h-2 md:w-3 md:h-3 lg:w-4 lg:h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6 text-blue-200" />
          </div>

          {/* Additional stars for larger screens */}
          {isLargeScreen() && (
            <>
              <div className="absolute top-16 left-1/4 animate-pulse opacity-40">
                <Star className="w-3 h-3 lg:w-4 lg:h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6 text-blue-300" />
              </div>
              <div className="absolute bottom-36 right-1/4 animate-pulse opacity-30">
                <Star className="w-3 h-3 lg:w-4 lg:h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6 text-blue-200" />
              </div>
            </>
          )}

          {/* SVG Background pattern - more elaborate for larger screens */}
          <div className="hidden md:block absolute bottom-0 right-0 w-full h-auto opacity-40 z-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 800 300"
              className="w-full h-auto"
            >
              {/* Left side curved lines - enhanced for XL and 2XL screens */}
              <path
                d="M 0 110 C 40 150, 45 170, 0 210"
                stroke="#4a6d78"
                strokeWidth={isLargeScreen() ? "2.5" : "2"}
                fill="none"
                className="opacity-70"
              />
              <path
                d="M 0 80 C 70 170, 75 190, 0 260"
                stroke="#4a6d78"
                strokeWidth={isLargeScreen() ? "3" : "2"}
                fill="none"
                className="opacity-80"
              />
              <path
                d="M 0 50 C 100 190, 110 210, 0 320"
                stroke="#4a6d78"
                strokeWidth={isLargeScreen() ? "3.5" : "2"}
                fill="none"
                className="opacity-90"
              />

              {/* Right side pattern - enhanced for larger screens */}
              <path
                d="M 550 150 C 580 120, 600 180, 630 110 C 660 80, 680 140, 710 70 C 740 40, 760 100, 790 50"
                stroke="#4a6d78"
                strokeWidth={isLargeScreen() ? "2.5" : "2"}
                fill="none"
              />

              {/* Additional patterns for XL screens and up */}
              {isLargeScreen() && (
                <>
                  <path
                    d="M 400 250 C 450 220, 480 280, 520 200"
                    stroke="#4a6d78"
                    strokeWidth="2"
                    fill="none"
                    className="opacity-60"
                  />
                  <path
                    d="M 300 280 C 350 250, 380 290, 420 220"
                    stroke="#4a6d78"
                    strokeWidth="1.5"
                    fill="none"
                    className="opacity-50"
                  />
                </>
              )}
            </svg>
          </div>

          {/* Mobile-specific decorations */}
          <div className="sm:hidden absolute top-1/4 right-0 opacity-20">
            <div className="w-32 h-32 border border-blue-400/30 rounded-full"></div>
            <div className="w-40 h-40 border border-blue-400/20 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>

          <div className="sm:hidden absolute bottom-1/4 left-0 opacity-20">
            <div className="w-24 h-24 border border-blue-400/40 rounded-full"></div>
          </div>

          {/* Decorative elements for larger screens */}
          <div className="hidden sm:block absolute top-1/3 left-10 md:left-16 lg:left-24 xl:left-32 2xl:left-48 opacity-30">
            <div className="relative">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 2xl:w-32 2xl:h-32 border-2 border-blue-500/20 rounded-full animate-pulse"></div>
              <Pencil className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 2xl:w-16 2xl:h-16 text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Additional decorative circles for XL and larger screens */}
          {isLargeScreen() && (
            <div className="absolute bottom-1/4 right-1/4 opacity-20">
              <div className="w-40 h-40 xl:w-48 xl:h-48 2xl:w-56 2xl:h-56 border border-blue-400/15 rounded-full"></div>
              <div className="w-32 h-32 xl:w-40 xl:h-40 2xl:w-48 2xl:h-48 border border-blue-400/10 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          )}
        </div>

        {/* Main content container - responsive padding and sizing for all screens */}
        <div className="container relative z-10 min-h-screen w-full max-w-full 2xl:max-w-[1600px] mx-auto px-5 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-8 sm:py-10 md:py-12 lg:py-16 xl:py-20 2xl:py-24 flex items-center">
          {/* Mobile layout (stacked) */}
          <div className="flex flex-col justify-center sm:hidden w-full">
            {/* Header */}
            <div className="mb-4">
              <span className="text-white/90 text-sm font-semibold tracking-wider font-Urbanist bg-blue-500/20 px-3 py-1 rounded-full">
                E-Learning Platform
              </span>
            </div>

            {/* Main heading */}
            <h1 className="font-Urbanist font-bold text-4xl leading-tight mb-3 tracking-tight">
              <span className="text-[#1A73E8]">Creating</span>{" "}
              <span className="text-white">a</span>
              <br />
              <span className="text-white">Better Future</span>
              <br />
              <span className="text-white">through</span>
              <br />
              <span className="text-white">Education</span>
            </h1>

            {/* Description */}
            <p className="text-white/80 font-Urbanist text-sm leading-relaxed mb-6 max-w-xs">
              Empowering students worldwide with quality
              education and innovative learning solutions.
            </p>

            <div className="flex flex-row items-center gap-4 xl:gap-5 2xl:gap-6 mb-8 xl:mb-10 2xl:mb-12">
              <Button
                size="lg"
                asChild
                onClick={() => router.push("/courses")}
                className="group relative cursor-pointer text-white px-6 sm:px-8 py-3 sm:py-4 bg-[#1A73E8] border-2 border-[#1A73E8] rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-lg hover:border-[white] hover:bg-transparent hover:text-[#1A73E8]"
              >
                <a className="flex gap-2 relative z-10 p-2 sm:p-4">
                  <span className="relative z-20 font-Urbanist text-sm sm:text-base">
                    All Courses
                  </span>
                  <div className="absolute inset-0 w-full h-full bg-white -z-10 transform translate-x-full transition-transform duration-500 group-hover:translate-x-0" />
                </a>
              </Button>
              <Button
                size="lg"
                asChild
                onClick={() => router.push("/contact")}
                className="group relative cursor-pointer text-white px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-[#ffffff] rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-lg hover:border-[#1A73E8] hover:text-[#1A73E8]"
              >
                <a className="flex gap-2 relative z-10 p-2 sm:p-4">
                  <span className="relative z-20 font-Urbanist text-sm sm:text-base">
                    Contact Us
                  </span>
                  <div className="absolute inset-0 w-full h-full bg-white -z-10 transform translate-x-full transition-transform duration-500 group-hover:translate-x-0" />
                </a>
              </Button>


            </div>

            {/* Social proof */}
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full w-fit">
              <div className="flex">
                <div
                  className="w-7 h-7 rounded-full border-2 border-white bg-gray-300 flex items-center justify-center overflow-hidden"
                  style={{ marginRight: "-0.5rem", zIndex: 3 }}
                >
                  <img
                    src="https://i.pinimg.com/474x/0b/6c/b1/0b6cb1a71ca09f9eeff65bac7f4dda16.jpg"
                    alt="Student"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  className="w-7 h-7 rounded-full border-2 border-white bg-gray-300 flex items-center justify-center overflow-hidden"
                  style={{ marginRight: "-0.5rem", zIndex: 2 }}
                >
                  <img
                    src="https://i.pinimg.com/736x/cf/13/17/cf1317a828577134642e892695f77821.jpg"
                    alt="Student"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  className="w-7 h-7 rounded-full border-2 border-white bg-gray-300 flex items-center justify-center overflow-hidden"
                  style={{ zIndex: 1 }}
                >
                  <img
                    src="https://i.pinimg.com/474x/b2/db/0b/b2db0be191eaf907636fa3a784ca6c89.jpg"
                    alt="Student"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <span className="text-white text-xs font-Urbanist">
                24k+ Happy Students
              </span>
            </div>

            {/* Mobile stats cards */}
            <div className="flex gap-3 mt-8 font-Urbanist">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex items-center flex-1">
                <div className="bg-[#1A73E8] rounded-full p-2 mr-3">
                  <GraduationCap className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg">28k</p>
                  <p className="text-white/70 text-xs">Students</p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex items-center flex-1">
                <div className="bg-[#1A73E8] rounded-full p-2 mr-3">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg">529+</p>
                  <p className="text-white/70 text-xs">Courses</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tablet, Desktop, XL, and 2XL layout with optimizations for each size */}
          <div className="hidden sm:flex flex-col md:flex-row items-center justify-between w-full gap-4 sm:gap-6 md:gap-8 lg:gap-12 xl:gap-16 2xl:gap-24">
            {/* Left content - scaled appropriately for larger screens */}
            <div className="w-full md:w-1/2 mb-8 md:mb-0">
              {/* Header with badge */}
              <div className="mb-4 xl:mb-5 2xl:mb-6">
                <span className="text-white/90 text-sm md:text-base xl:text-lg font-medium font-Urbanist bg-[#1A73E8]/20 px-3 py-1 xl:px-4 xl:py-1.5 2xl:px-5 2xl:py-2 rounded-full">
                  Online Learning Platform
                </span>
              </div>

              {/* Main heading - dynamically sized for every screen */}
              <h1 className={`font-bold leading-tight mb-4 xl:mb-5 2xl:mb-6 font-Urbanist tracking-tight ${isMedium() ? "text-2xl" :
                isLarge() ? "text-3xl" :
                  isXL() ? "text-4xl" :
                    is2XL() ? "text-5xl" :
                      is3XL() ? "text-6xl" : "text-3xl"
                }`}>
                <span className="text-[#1A73E8]">Creating</span>{" "}
                <span className="text-white">a Better Future</span>
                <br />
                <span className="text-white"> through</span>
                <span className="text-white"> Education</span>
              </h1>

              {/* Description - enhanced for larger screens */}
              <p className={`text-white/80 font-Urbanist leading-relaxed mb-6 xl:mb-8 2xl:mb-10 max-w-xl xl:max-w-2xl 2xl:max-w-3xl ${isMedium() ? "text-sm" :
                isLarge() ? "text-md" :
                  isXL() ? "text-lg" :
                    is2XL() || is3XL() ? "text-lg" : "text-sm"
                }`}>
                {isLargeScreen()
                  ? "Empowering students worldwide with quality education and innovative learning solutions that transform lives and unlock potential for a brighter tomorrow."
                  : "Empowering students worldwide with quality education and innovative learning solutions that transform lives."
                }
              </p>

              {/* CTA Buttons - sized appropriately for each screen */}
              <div className="flex flex-row items-center gap-4 xl:gap-5 2xl:gap-6 mb-8 xl:mb-10 2xl:mb-12">
                <Button
                  size="lg"
                  asChild
                  onClick={() => router.push("/courses")}
                  className="group relative cursor-pointer text-white px-6 sm:px-8 py-3 sm:py-4 bg-[#1A73E8] border-2 border-[#1A73E8] rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-lg hover:border-[white] hover:bg-transparent hover:text-[#1A73E8]"
                >
                  <a className="flex gap-2 relative z-10 p-2 sm:p-4">
                    <span className="relative z-20 font-Urbanist text-sm sm:text-base">
                      All Courses
                    </span>
                    <div className="absolute inset-0 w-full h-full bg-white -z-10 transform translate-x-full transition-transform duration-500 group-hover:translate-x-0" />
                  </a>
                </Button>
                <Button
                  size="lg"
                  asChild
                  onClick={() => router.push("/contact")}
                  className="group relative cursor-pointer text-white px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-[#ffffff] rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-lg hover:border-[#1A73E8] hover:text-[#1A73E8]"
                >
                  <a className="flex gap-2 relative z-10 p-2 sm:p-4">
                    <span className="relative z-20 font-Urbanist text-sm sm:text-base">
                      Contact Us
                    </span>
                    <div className="absolute inset-0 w-full h-full bg-white -z-10 transform translate-x-full transition-transform duration-500 group-hover:translate-x-0" />
                  </a>
                </Button>


              </div>

              {/* Social proof - scaled for larger screens */}
              <div className={`flex items-center gap-3 xl:gap-4 2xl:gap-5 bg-white/10 backdrop-blur-sm px-4 py-2 xl:px-5 xl:py-3 2xl:px-6 2xl:py-4 rounded-full w-fit ${isLargeScreen() ? "border border-white/10" : ""
                }`}>
                <div className="flex">
                  <div
                    className={`rounded-full border-2 border-white bg-gray-300 flex items-center justify-center overflow-hidden ${isMedium() ? "w-8 h-8" :
                      isLarge() ? "w-10 h-10" :
                        isXL() ? "w-12 h-12" :
                          is2XL() || is3XL() ? "w-14 h-14" : "w-8 h-8"
                      }`}
                    style={{ marginRight: "-0.5rem", zIndex: 3 }}
                  >
                    <img
                      src="https://i.pinimg.com/474x/0b/6c/b1/0b6cb1a71ca09f9eeff65bac7f4dda16.jpg"
                      alt="Student"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    className={`rounded-full border-2 border-white bg-gray-300 flex items-center justify-center overflow-hidden ${isMedium() ? "w-8 h-8" :
                      isLarge() ? "w-10 h-10" :
                        isXL() ? "w-12 h-12" :
                          is2XL() || is3XL() ? "w-14 h-14" : "w-8 h-8"
                      }`}
                    style={{ marginRight: "-0.5rem", zIndex: 2 }}
                  >
                    <img
                      src="https://i.pinimg.com/736x/cf/13/17/cf1317a828577134642e892695f77821.jpg"
                      alt="Student"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    className={`rounded-full border-2 border-white bg-gray-300 flex items-center justify-center overflow-hidden ${isMedium() ? "w-8 h-8" :
                      isLarge() ? "w-10 h-10" :
                        isXL() ? "w-12 h-12" :
                          is2XL() || is3XL() ? "w-14 h-14" : "w-8 h-8"
                      }`}
                    style={{ zIndex: 1 }}
                  >
                    <img
                      src="https://i.pinimg.com/474x/b2/db/0b/b2db0be191eaf907636fa3a784ca6c89.jpg"
                      alt="Student"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <span className={`text-white font-Urbanist ${isMedium() ? "text-xs" :
                  isLarge() ? "text-sm" :
                    isXL() ? "text-base" :
                      is2XL() || is3XL() ? "text-md" : "text-xs"
                  }`}>
                  {isLargeScreen() ? "24,000+ Happy Students" : "24k+ Happy Students"}
                </span>
              </div>
            </div>

            {/* Right content - properly scaled image and cards for all screen sizes */}
            <div className="w-full md:w-1/2 relative flex justify-center md:justify-end">
              {/* Main image with proper scaling */}
              <div className="relative shadow-2xl">
                <img
                  src="https://edumon-nextjs.vercel.app/assets/img/banner.png"
                  className={`h-auto object-cover ${isMedium() ? "max-w-xs" :
                    isLarge() ? "max-w-sm" :
                      isXL() ? "max-w-md" :
                        is2XL() ? "max-w-lg" :
                          is3XL() ? "max-w-xl" : "max-w-xs"
                    }`}
                  style={{
                    borderTopRightRadius: isLargeScreen() ? "4rem" : "3rem",
                    borderBottomRightRadius: "0",
                    borderTopLeftRadius: "0",
                    borderBottomLeftRadius: "0"
                  }}
                  alt="Teacher with students"
                />

                {/* Stats cards - positioned and sized for each screen */}
                {/* Student count card */}
                <div className={`absolute bg-white/10 backdrop-blur-lg rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 z-10 border border-white/20 ${isMedium() ? "bottom-20 -left-4 " :
                  isLarge() ? "bottom-24 -left-5 p-3" :
                    isXL() ? "bottom-28 -left-6 p-3" :
                      is2XL() ? "bottom-32 -left-8 p-4" :
                        is3XL() ? "bottom-36 -left-10 p-4" : "bottom-20 -left-4 p-2"
                  }`}>
                  <div className="flex flex-col items-center gap-2 sm:gap-3 lg:gap-4 xl:gap-5 2xl:gap-6">
                    <div className={`bg-[#1A73E8] flex justify-center items-center rounded-full shadow-md ${isMedium() ? "p-2 h-10 w-10" :
                      isLarge() ? "p-2 h-12 w-12" :
                        isXL() ? "p-3 h-14 w-14" :
                          is2XL() ? "p-4 h-16 w-16" :
                            is3XL() ? "p-4 h-20 w-20" : "p-2 h-10 w-10"
                      }`}>
                      <GraduationCap className={`text-white ${isMedium() ? "w-5 h-5" :
                        isLarge() ? "w-6 h-6" :
                          isXL() ? "w-7 h-7" :
                            is2XL() ? "w-8 h-8" :
                              is3XL() ? "w-10 h-10" : "w-5 h-5"
                        }`} />
                    </div>
                    <div className="text-center">
                      <h3 className={`font-bold text-white font-Urbanist ${isMedium() ? "text-lg" :
                        isLarge() ? "text-xl" :
                          isXL() ? "text-2xl" :
                            is2XL() ? "text-3xl" :
                              is3XL() ? "text-4xl" : "text-lg"
                        }`}>
                        28k
                      </h3>
                      <p className={`text-white/80 font-Urbanist ${isMedium() ? "text-xs" :
                        isLarge() ? "text-sm" :
                          isXL() ? "text-base" :
                            is2XL() || is3XL() ? "text-md" : "text-xs"
                        }`}>
                        Total Students
                      </p>
                    </div>
                  </div>
                </div>

                {/* Courses count card */}
                <div className={`absolute bg-white/10 backdrop-blur-lg rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 z-10 border border-white/20 ${isMedium() ? "-bottom-4 -right-4" :
                  isLarge() ? "-bottom-5 -right-5 p-3" :
                    isXL() ? "-bottom-6 -right-6 p-4" :
                      is2XL() ? "-bottom-8 -right-8 p-4" :
                        is3XL() ? "-bottom-10 -right-10 p-6" : "-bottom-4 -right-4 p-2"
                  }`}>
                  <div className="flex items-center gap-3 lg:gap-4 xl:gap-5 2xl:gap-6">
                    <div className={`bg-[#1A73E8] flex justify-center items-center rounded-full shadow-md ${isMedium() ? "p-2 h-10 w-10" :
                      isLarge() ? "p-2 h-12 w-12" :
                        isXL() ? "p-3 h-14 w-14" :
                          is2XL() ? "p-4 h-16 w-16" :
                            is3XL() ? "p-4 h-20 w-20" : "p-2 h-10 w-10"
                      }`}>
                      <BookOpen className={`text-white ${isMedium() ? "w-5 h-5" :
                        isLarge() ? "w-6 h-6" :
                          isXL() ? "w-7 h-7" :
                            is2XL() ? "w-8 h-8" :
                              is3XL() ? "w-10 h-10" : "w-5 h-5"
                        }`} />
                    </div>
                    <div>
                      <h3 className={`font-bold text-white font-Urbanist ${isMedium() ? "text-lg" :
                        isLarge() ? "text-xl" :
                          isXL() ? "text-2xl" :
                            is2XL() ? "text-3xl" :
                              is3XL() ? "text-4xl" : "text-lg"
                        }`}>
                        529+
                      </h3>
                      <p className={`text-white/80 font-Urbanist ${isMedium() ? "text-xs" :
                        isLarge() ? "text-sm" :
                          isXL() ? "text-base" :
                            is2XL() || is3XL() ? "text-md" : "text-xs"
                        }`}>
                        Total Courses
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AdvertisementDialog
        autoScrollInterval={5000}
        isOpen={isAdDialogOpen}
        setIsOpen={setIsAdDialogOpen}
      />
    </>
  );
};

export default HeroSection;