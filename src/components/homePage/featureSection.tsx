"use client"
import React, { useEffect, useState } from 'react';
import { UserSquare2, PlaySquare, DollarSign, Headphones } from 'lucide-react';

const FeatureSection = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }
  return (
    <div className="relative w-full bg-[#fbfdff] px-4 sm:px-6 md:px-8 lg:px-8 xl:px-4 2xl:px-16 py-10 sm:py-12 md:py-16 lg:py-20 xl:py-24">
      <div className="max-w-full lg:max-w-full xl:max-w-7xl 2xl:max-w-[120rem] mx-auto">
        {/* Section Header with consistent styling but no blue lines */}
        <div className="flex flex-col items-center justify-center mb-8 sm:mb-12 md:mb-16">
          <p className="text-blue-600 font-medium text-base sm:text-lg md:text-lg lg:text-xl font-Urbanist mb-4">
            Features
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl 2xl:text-6xl font-bold text-center text-gray-900 font-Urbanist">
            One Platform Many Course
          </h2>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {/* Card 1 */}
          <div className="bg-[#fbfdff] p-6 sm:p-7 md:p-8 pb-10 sm:pb-12 md:pb-14 rounded-lg border-black/5 border-2 relative hover:rounded-tr-[5rem] hover:border-[#1A73E8] transition-all duration-300 ease-in-out">
            <div className="absolute top-0 left-4 font-Urbanist bg-[#1A73E8] text-white px-3 py-2 rounded-b-lg text-xs sm:text-sm">
              01
            </div>
            <div className="flex flex-col items-center text-center mt-6 sm:mt-8">
              <div className="bg-blue-50 p-3 sm:p-4 rounded-full mb-4 sm:mb-6">
                <UserSquare2 className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#1A73E8]" />
              </div>
              <h4 className="text-lg sm:text-xl font-bold font-Urbanist mb-2 sm:mb-4">Exclusive Advisor</h4>
              <p className="text-sm sm:text-base text-gray-600 font-Urbanist">Lorem ipsum dolor amet consectetur</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#fbfdff] p-6 sm:p-7 md:p-8 pb-10 sm:pb-12 md:pb-14 rounded-lg border-black/5 border-2 relative hover:rounded-tr-[5rem] hover:border-[#1A73E8] transition-all duration-300 ease-in-out">
            <div className="absolute top-0 left-4 font-Urbanist bg-[#1A73E8] text-white px-3 py-2 rounded-b-lg text-xs sm:text-sm">
              02
            </div>
            <div className="flex flex-col items-center text-center mt-6 sm:mt-8">
              <div className="bg-blue-50 p-3 sm:p-4 rounded-full mb-4 sm:mb-6">
                <PlaySquare className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#1A73E8]" />
              </div>
              <h4 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 font-Urbanist">Video Tutorial</h4>
              <p className="text-sm sm:text-base text-gray-600 font-Urbanist">Lorem ipsum dolor amet consectetur</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#fbfdff] p-6 sm:p-7 md:p-8 pb-10 sm:pb-12 md:pb-14 rounded-lg border-black/5 border-2 relative hover:rounded-tr-[5rem] hover:border-[#1A73E8] transition-all duration-300 ease-in-out">
            <div className="absolute font-Urbanist top-0 left-4 bg-[#1A73E8] text-white px-3 py-2 rounded-b-lg text-xs sm:text-sm">
              03
            </div>
            <div className="flex flex-col items-center text-center mt-6 sm:mt-8">
              <div className="bg-blue-50 p-3 sm:p-4 rounded-full mb-4 sm:mb-6">
                <DollarSign className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#1A73E8]" />
              </div>
              <h4 className="text-lg sm:text-xl font-bold font-Urbanist mb-2 sm:mb-4">Affordable Price</h4>
              <p className="text-sm sm:text-base text-gray-600 font-Urbanist">Lorem ipsum dolor amet consectetur</p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-[#fbfdff] p-6 sm:p-7 md:p-8 pb-10 sm:pb-12 md:pb-14 rounded-lg border-black/5 border-2 relative hover:rounded-tr-[5rem] hover:border-[#1A73E8] transition-all duration-300 ease-in-out">
            <div className="font-Urbanist absolute top-0 left-4 bg-[#1A73E8] text-white px-3 py-2 rounded-b-lg text-xs sm:text-sm">
              04
            </div>
            <div className="flex flex-col items-center text-center mt-6 sm:mt-8">
              <div className="bg-blue-50 p-3 sm:p-4 rounded-full mb-4 sm:mb-6">
                <Headphones className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#1A73E8]" />
              </div>
              <h4 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 font-Urbanist">Life Time Support</h4>
              <p className="text-sm sm:text-base text-gray-600 font-Urbanist">Lorem ipsum dolor amet consectetur</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;