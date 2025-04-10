import React from "react";
import { GraduationCap, ShoppingCart, BookOpen } from "lucide-react";

// Define TypeScript interfaces for our data
interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const HowItWorks: React.FC = () => {
  const steps: Step[] = [
    {
      icon: <GraduationCap size={36} className="text-white" />,
      title: "Choose A Course",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    },
    {
      icon: <ShoppingCart size={36} className="text-white" />,
      title: "Purchase A Course",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    },
    {
      icon: <BookOpen size={36} className="text-white" />,
      title: "Start Now",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    },
  ];

  return (
    // Aligned with HeroSection container structure
    <div className="relative w-full   py-6 sm:py-8 lg:py-20 overflow-hidden">
      {/* Section with background - maintaining the dark theme */}
      <section className="w-full relative">
        {/* Background image */}
        {/* Dark blue overlay with opacity to create the deep effect */}
        <div className="absolute inset-0 bg-[#022936] bg-opacity-100 z-0"></div>

        {/* Additional texture overlay */}
        <div
          className="absolute inset-0 bg-opacity-30 z-0"
          style={{
            backgroundImage:
              'url("https://plus.unsplash.com/premium_photo-1664372145541-4556b409492e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c3R1ZGVudHxlbnwwfHwwfHx8MA%3D%3D")',
            backgroundSize: "cover",
            backgroundBlendMode: "overlay",
            opacity: 0.15,
          }}
        ></div>

        {/* Inner container with matching max-width constraints */}
        <div className="max-w-full xl:max-w-[100rem] 2xl:max-w-[120rem] mx-auto relative z-10 py-10 sm:py-16 lg:py-24">
          {/* Section Header - aligned with HeroSection typography and spacing */}
          <div className="text-center mb-8 sm:mb-12 md:mb-16 lg:mb-24">
            <h3 className="text-blue-300 font-medium text-base sm:text-lg font-Urbanist mb-2 tracking-wide">
              Working Process
            </h3>
            <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl 2xl:text-6xl font-bold text-white mt-2 font-Urbanist leading-tight">
              How Does It Work
            </h2>
          </div>

          {/* Process Steps - aligned with HeroSection gap patterns */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 lg:gap-8 xl:gap-8 relative">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                {/* Step Card - maintained width but aligned with HeroSection margins */}
                <div className="flex flex-col items-center text-center z-10 w-full md:w-1/3 mb-8 md:mb-0">
                  {/* Icon Container - Diamond shape with white border and shadow */}
                  <div className="bg-[#0d5ff9] p-6 rounded-lg rotate-45 mb-6 sm:mb-8 inline-flex relative shadow-lg">
                    {/* White border around diamond */}
                    <div className="absolute inset-0 rounded-lg border-2 border-white"></div>
                    <div className="-rotate-45">{step.icon}</div>
                  </div>

                  {/* Title - aligned with HeroSection typography */}
                  <h3 className="text-white text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-4 font-Urbanist">
                    {step.title}
                  </h3>

                  {/* Description - aligned with HeroSection typography scaling */}
                  <p className="text-sm sm:text-base md:text-base lg:text-lg xl:text-lg 2xl:text-xl text-white max-w-xs mx-auto font-Urbanist">
                    {step.description}
                  </p>
                </div>

                {/* Connecting Line - Only between steps */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block w-24 lg:w-36 xl:w-48 flex-shrink-0 flex-grow-0 relative">
                    {/* Add inline style for animations */}
                    <style dangerouslySetInnerHTML={{
                      __html: `
                      @keyframes gradientFlow {
                        0% {
                          stroke-dashoffset: 24;
                          stroke: rgba(255, 255, 255, 0.6);
                        }
                        50% {
                          stroke: rgba(255, 255, 255, 1);
                        }
                        100% {
                          stroke-dashoffset: 0;
                          stroke: rgba(255, 255, 255, 0.6);
                        }
                      }
                      
                      @keyframes glowEffect {
                        0%, 100% {
                          filter: drop-shadow(0 0 1px rgba(255, 255, 255, 0.3));
                          opacity: 0.8;
                        }
                        50% {
                          filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.7));
                          opacity: 1;
                        }
                      }
                      
                      @keyframes floatAnimation {
                        0%, 100% {
                          transform: translateY(0);
                        }
                        50% {
                          transform: translateY(-2px);
                        }
                      }
                      
                      @keyframes pulseSize {
                        0%, 100% {
                          r: 1.8;
                        }
                        50% {
                          r: 2.5;
                        }
                      }
                      
                      .premium-path {
                        animation: gradientFlow 3s ease-in-out infinite;
                        stroke-linecap: round;
                        stroke-linejoin: round;
                      }
                      
                      .glow-effect {
                        animation: glowEffect 4s ease-in-out infinite;
                      }
                      
                      .float-animation {
                        animation: floatAnimation 3s ease-in-out infinite;
                      }
                      
                      .pulse-dot {
                        animation: pulseSize 2s ease-in-out infinite;
                      }
                      
                      .staggered-1 {
                        animation-delay: 0.2s;
                      }
                      
                      .staggered-2 {
                        animation-delay: 0.4s;
                      }
                      
                      .staggered-3 {
                        animation-delay: 0.6s;
                      }
                    `}} />

                    <svg
                      className="absolute w-full h-32 top-0"
                      viewBox="0 0 200 100"
                      preserveAspectRatio="none"
                    >
                      {/* Subtle glow effect for premium look */}
                      <defs>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="2" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>

                      {/* Main curved path with gradient-like animation */}
                      <path
                        d="M0,50 C20,25 40,15 60,25 C80,35 110,45 140,35 C170,25 190,30 195,38"
                        fill="none"
                        stroke="white"
                        strokeWidth="1.2"
                        strokeDasharray="6,3"
                        className="premium-path"
                        filter="url(#glow)"
                      />

                      {/* Modern decorative elements */}
                      <g className="glow-effect">
                        {/* Elegant circle with inner detail */}
                        <circle
                          cx="60"
                          cy="25"
                          r="10"
                          fill="none"
                          stroke="white"
                          strokeWidth="1"
                          strokeDasharray="3,2"
                        />
                        <circle
                          cx="60"
                          cy="25"
                          r="5"
                          fill="none"
                          stroke="white"
                          strokeWidth="0.8"
                          strokeDasharray="2,2"
                        />

                        {/* Enhanced arrow with premium feel */}
                        <g className="">
                          <path
                            d="M185,35 L198,40 L190,30"
                            fill="none"
                            stroke="white"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <line
                            x1="193"
                            y1="35"
                            x2="185"
                            y2="35"
                            stroke="white"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                          />
                        </g>
                      </g>

                      {/* Animated dots along the path with staggered timing */}
                      <circle cx="30" cy="35" r="2" fill="white" opacity="0.9" className="pulse-dot" />
                      <circle cx="80" cy="35" r="2" fill="white" opacity="0.9" className="pulse-dot staggered-1" />
                      <circle cx="120" cy="40" r="2" fill="white" opacity="0.9" className="pulse-dot staggered-2" />
                      <circle cx="160" cy="35" r="2" fill="white" opacity="0.9" className="pulse-dot staggered-3" />

                      {/* Subtle sparkle accents */}
                      <path
                        d="M45,25 L47,22 L49,25 L47,28 Z"
                        fill="white"
                        opacity="0.7"
                        className="float-animation"
                      />
                      <path
                        d="M135,35 L137,32 L139,35 L137,38 Z"
                        fill="white"
                        opacity="0.7"
                        className="float-animation staggered-2"
                      />
                    </svg>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;