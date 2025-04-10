"use client";

import { Play, X } from "lucide-react";
import { useState, useEffect } from "react";

const VideoSection = ({
  videoUrl = "https://www.youtube.com/watch?v=vjsnZHhI2Z0",
}) => {
  // Function to extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  // Effect to handle scroll events - IMPROVED VERSION
  useEffect(() => {
    const handleScroll = () => {
      // Only apply sticky behavior if video is playing
      if (isPlaying) {
        const videoSection = document.getElementById("video-section");
        if (videoSection) {
          // Get the section's position relative to the viewport
          const rect = videoSection.getBoundingClientRect();

          // Get viewport height
          const viewportHeight = window.innerHeight;

          // Check if the section is sufficiently out of  view
          // We consider it out of view if:
          // 1. The top edge is more than 300px above the viewport OR
          // 2. The bottom edge is more than 300px below the viewport bottom
          const isSectionOutOfView =
            rect.top < -300 || rect.bottom > viewportHeight + 300;

          // Check if a significant portion of the section is visible in viewport
          const isSignificantlyVisible =
            (rect.top >= -100 && rect.top <= viewportHeight) ||
            (rect.bottom >= 0 && rect.bottom <= viewportHeight + 100) ||
            (rect.top <= 0 && rect.bottom >= viewportHeight);

          // Set sticky state based on visibility
          setIsSticky(isSectionOutOfView && !isSignificantlyVisible);
        }
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Run once on mount to set initial state
    handleScroll();

    // Clean up listener on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isPlaying]);

  return (
    <section id="video-section" className="py-16 relative">
      <div className="container mx-auto px-4 flex justify-center">
        {/* Container with relative positioning for proper dotted border placement */}
        <div className="relative w-full max-w-4xl">
          {/* Dotted border container with animation */}
          <div
            className={`absolute -top-8 -left-8 -bottom-8 -right-8 border-2 border-dashed border-blue-300 rounded-[40px] transition-all duration-700 ${
              isHovering ? "border-blue-500 scale-[1.02]" : ""
            }`}
          ></div>

          {/* Video container */}
          <div
            className="relative rounded-3xl overflow-hidden bg-gray-100 shadow-lg transition-transform duration-500 ease-in-out"
            style={{
              transform: isHovering ? "translateY(-8px)" : "translateY(0)",
            }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <img
              src="https://images.unsplash.com/photo-1516534775068-ba3e7458af70?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
              alt="Student studying"
              className="w-full object-cover transition-all duration-700"
              style={{
                height: "450px",
                filter: isHovering ? "brightness(0.85)" : "brightness(1)",
                transform: isHovering ? "scale(1.03)" : "scale(1)",
              }}
            />

            {/* Play button overlay with hover animations */}

            {/* Play button overlay with premium design */}



{/* Play button overlay with premium design */}
{/* Play button overlay with premium design */}
<button
  onClick={() => setIsPlaying(true)}
  className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
  aria-label="Play video"
>
  <div className="relative">
    {/* Subtle glow effect - changed to monochromatic */}
    <div 
      className={`absolute inset-0 rounded-full ${
        isHovering ? "animate-pulse" : ""
      } bg-white opacity-40`} 
      style={{ 
        width: "6rem", 
        height: "6rem", 
        marginLeft: "-0.75rem", 
        marginTop: "-0.75rem",
        filter: "blur(8px)"
      }}
    ></div>
    
    {/* Outer circle with refined glass morphism effect */}
    <div 
      className={`w-20 h-20 rounded-full backdrop-blur-sm flex items-center justify-center transition-all duration-500 ${
        isHovering ? "scale-110" : ""
      }`}
      style={{
        background: "rgba(255,255,255,0.15)",
        border: "1px solid rgba(255,255,255,0.3)",
        boxShadow: isHovering ? "0 10px 25px rgba(0,0,0,0.2)" : "0 5px 15px rgba(0,0,0,0.1)"
      }}
    >
      {/* Inner circle with premium dark gradient */}
      <div 
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
          isHovering ? "scale-110" : ""
        }`}
        style={{
          background: "#082c34",
          boxShadow: "0 0 15px rgba(0,0,0,0.5)"
        }}
      >
        {/* Play icon with animation */}
        <Play 
          className={`w-8 h-8 ml-1 transition-all duration-500 ${
            isHovering ? "text-white scale-110" : "text-gray-200"
          }`} 
          strokeWidth={2.5}
        />
      </div>
    </div>
  </div>
</button>


          </div>
        </div>
      </div>

      {/* Sticky Video Player that follows during scroll */}
      {isPlaying && (
        <div
          className={`${
            isSticky
              ? "fixed bottom-6 right-6 z-50 w-80 h-45 shadow-2xl rounded-lg overflow-hidden transition-all duration-500"
              : "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[75%] h-[75%] max-w-3xl bg-[#082c34] rounded-xl shadow-2xl overflow-hidden transition-all duration-500"
          }`}
        >
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${getYouTubeVideoId(
              videoUrl
            )}?autoplay=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <button
            className={`absolute top-4 right-4 bg-white/20 rounded-full p-2 hover:bg-white/30 transition-all duration-300 hover:scale-110 ${
              isSticky ? "scale-75" : ""
            }`}
            onClick={() => setIsPlaying(false)}
            aria-label="Close video"
          >
            <X className="text-white" />
          </button>
        </div>
      )}
    </section>
  );
};

export default VideoSection;