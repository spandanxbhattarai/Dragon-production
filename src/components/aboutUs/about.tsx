import React from 'react';
import { Lightbulb, ClipboardList } from 'lucide-react';
import { Button } from '../ui/button';

interface BlueCurveProps {
  className?: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const BlueCurve: React.FC<BlueCurveProps> = ({
  className = '',
  position = 'top-right'
}) => {
  return (
    <div
      className={`absolute bg-blue-600 -z-1 ${className}`}
      aria-hidden="true"
    />
  );
};

const HeroSection: React.FC = () => {

  return (
    <div className="relative w-full mt-10 bg-white px-4 sm:px-6 md:px-8 lg:px-8 xl:px-8 2xl:px-16 py-6 sm:py-8 overflow-hidden">
      {/* Responsive container with better breakpoints, keeping XL same as LG */}
      <div className="max-w-full xl:max-w-[100rem] 2xl:max-w-[120rem] mx-auto flex flex-col md:flex-col lg:flex-row xl:flex-row items-center justify-between gap-4 sm:gap-6 lg:gap-8 xl:gap-8">
        {/* Left Side with Images and Decorative Elements - stacked on mobile and tablets */}
        <div className="relative w-full md:w-full lg:w-1/2 mb-10 lg:mb-0">
          {/* Top-left blue curve - hidden on smallest screens */}
          <BlueCurve
            className="hidden sm:block w-16 h-16 sm:w-20 sm:h-20 md:w-32 md:h-32 rounded-br-full top-0 left-0"
            position="top-left"
          />

          {/* First Image (student studying) - better tablet support */}
          <div className="relative z-10 mx-auto md:mx-auto lg:ml-4 mt-6 sm:mt-12 md:mt-8 max-w-xs sm:max-w-sm md:max-w-md">
            {/* Blue curve at top-right of image - smaller on mobile */}
            <div className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 w-12 sm:w-16 h-12 sm:h-16 bg-blue-600 rounded-bl-full z-0"></div>
            <div className="relative z-10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg">
              <img
                src="https://i.pinimg.com/736x/22/14/a3/2214a38b161a1247d2d59cb292476eb1.jpg"
                alt="Student studying at a desk with laptop and books"
                className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover"
              />
            </div>
          </div>

          {/* Second Image (group of students) - adjust margin for better stacking on mobile and tablets */}
          <div className="relative z-10 mx-auto md:mx-auto lg:ml-24 -mt-10 sm:-mt-12 md:-mt-14 lg:-mt-20 max-w-xs sm:max-w-sm md:max-w-md">
            {/* Blue curve at bottom-left of image - smaller on mobile */}
            <div className="absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 w-12 sm:w-16 h-12 sm:h-16 bg-blue-600 rounded-tr-full z-0"></div>
            <div className="relative z-10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg">
              <img
                src="https://i.pinimg.com/736x/d6/5c/f0/d65cf0415be1802dbbdfdb9694955f25.jpg"
                alt="Group of diverse students collaborating on a project"
                className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover"
              />
            </div>
          </div>

          {/* Bottom-right blue curve - hidden on smallest screens */}
          <BlueCurve
            className="hidden sm:block w-16 h-16 sm:w-20 sm:h-20 md:w-32 md:h-32 rounded-tl-full bottom-0 right-0"
            position="bottom-right"
          />
        </div>

        {/* Right Side Content - stacked on mobile and tablets */}
        <div className="w-full md:w-full lg:w-1/2 mt-6 sm:mt-10 lg:mt-0 px-2 sm:px-4 md:px-6">
          {/* Section Header */}
          <p className="text-blue-600 font-medium text-base sm:text-lg font-Urbanist">About Us Education</p>

          {/* Main Heading - keeping XL same as LG */}
          <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl 2xl:text-6xl font-bold text-gray-900 mt-2 font-Urbanist leading-tight">
            Go Your Skill in Next Level
          </h1>

          {/* Description Text - keeping XL same as LG */}
          <p className="text-sm sm:text-base md:text-base lg:text-lg xl:text-lg 2xl:text-xl text-gray-600 mt-4 sm:mt-6 font-Urbanist max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-2xl mx-auto md:mx-auto lg:mx-0 xl:mx-0">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sed turpis
            in arcu gravida faucibus euismod eget magna. Donec non justo ac libero
            pharetra congue.
          </p>

          {/* First Mission Item - better spacing on mobile */}
          <div className="flex items-start gap-3 sm:gap-4 mt-8 sm:mt-10">
            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-blue-50">
              <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 font-Urbanist">Our Success Mission</h3>
              <p className="text-sm sm:text-base text-gray-600 mt-1 font-Urbanist">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
          </div>

          {/* Second Mission Item - better spacing on mobile */}
          <div className="flex items-start gap-3 sm:gap-4 mt-6 sm:mt-8">
            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-blue-50">
              <ClipboardList className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 font-Urbanist">Our Success Mission</h3>
              <p className="text-sm sm:text-base text-gray-600 mt-1 font-Urbanist">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
          </div>

          {/* CTA Button - responsive sizing and centered on mobile */}
          <div className="mt-8 sm:mt-10 flex justify-center sm:justify-start">
            <Button
              size="lg"
              asChild
              className="group relative text-white px-6 sm:px-8 py-3 sm:py-4 bg-[#1A73E8] border-2 border-[#1A73E8] rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-lg hover:border-[#1A73E8] hover:text-[#1A73E8]"
            >
              <a href="/jobs" className="flex gap-2 relative z-10 p-2 sm:p-4">
                <span className="relative z-20 font-Urbanist text-sm sm:text-base">
                  Discover More
                </span>
                <div className="absolute inset-0 w-full h-full bg-white -z-10 transform translate-x-full transition-transform duration-500 group-hover:translate-x-0" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;