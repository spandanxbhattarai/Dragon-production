import { useRef, useEffect, useState } from "react";
import { motion, useAnimationControls, useInView } from "framer-motion";

const logos = [
  {
    name: "Microsoft",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
  },
  {
    name: "Google",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
  },
  {
    name: "Amazon",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  },
  {
    name: "Apple",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
  },
  {
    name: "Meta",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
  },
  {
    name: "Netflix",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
  },
  {
    name: "Tesla",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg",
  },
];

// Create multiple sets of logos for seamless infinite scrolling
// Using three sets instead of two for smoother transitions
const duplicatedLogos = [...logos, ...logos, ...logos];

// Custom hook for animation pause on hover
const useAnimationPause = () => {
  const [isPaused, setIsPaused] = useState(false);

  const pauseAnimation = () => setIsPaused(true);
  const resumeAnimation = () => setIsPaused(false);

  return { isPaused, pauseAnimation, resumeAnimation };
};

const LogoSection = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });
  const controls = useAnimationControls();
  const { isPaused, pauseAnimation, resumeAnimation } = useAnimationPause();
  const [isClient, setIsClient] = useState(false);

  // Initialize with default dimensions
  const [dimensions, setDimensions] = useState({
    logoGap: 60,
    logoWidth: 120,
    logoHeight: 64,
    animationDuration: 60
  });

  // Responsive logo sizing and spacing based on screen size
  const logoCount = duplicatedLogos.length;
  const { logoGap, logoWidth, logoHeight, animationDuration } = dimensions;
  const totalWidth = (logoWidth + logoGap) * logoCount;

  // Set isClient to true after mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  // Update dimensions based on screen size
  useEffect(() => {
    if (!isClient) return;

    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) { // Mobile
        setDimensions({
          logoGap: 40,
          logoWidth: 90,
          logoHeight: 48,
          animationDuration: 40
        });
      } else if (width < 1024) { // Tablet
        setDimensions({
          logoGap: 50,
          logoWidth: 100,
          logoHeight: 56,
          animationDuration: 50
        });
      } else { // Desktop
        setDimensions({
          logoGap: 60,
          logoWidth: 120,
          logoHeight: 64,
          animationDuration: 60
        });
      }
    };

    // Set initial dimensions
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isClient]);

  return (
    <section
      className="py-8 sm:py-10 md:py-12 xl:py-16 bg-white overflow-hidden"
      ref={containerRef}
    >
      <div className="w-full mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-gradient-to-br from-[#001828] to-[#002e47] rounded-2xl p-1.5 shadow-xl"
        >
          {/* Keeping the same padding for height */}
          <div className="bg-[#002935] rounded-xl py-8 sm:py-10 md:py-12 overflow-hidden backdrop-blur-sm relative">
            {/* Responsive gradient width */}
            <div className="absolute left-0 top-0 w-16 sm:w-20 md:w-24 h-full bg-gradient-to-r from-[#001420] to-transparent z-10" />
            <div className="absolute right-0 top-0 w-16 sm:w-20 md:w-24 h-full bg-gradient-to-l from-[#001420] to-transparent z-10" />

            {/* Add subtle background pattern */}
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `radial-gradient(circle at 25px 25px, white 2%, transparent 0%)`,
                backgroundSize: '50px 50px'
              }}
            />

            <div
              className="flex relative"
              onMouseEnter={pauseAnimation}
              onMouseLeave={resumeAnimation}>
              <motion.div
                className="flex items-center"
                animate={isPaused ? { x: 0 } : {
                  x: [0, -totalWidth],
                }}
                transition={{
                  x: {
                    duration: animationDuration,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "linear",
                  },
                }}
                style={{
                  width: "fit-content",
                  gap: `${logoGap}px`, // Reduced gap between logos
                  paddingLeft: `${logoGap / 2}px`, // Reduced initial offset
                  paddingRight: `${logoGap / 2}px`, // Reduced end offset
                }}
              >
                {duplicatedLogos.map((logo, index) => (
                  <motion.div
                    key={`${logo.name}-${index}`}
                    className="flex-shrink-0 group"
                    whileHover={{
                      scale: 1.12,
                      y: -6,
                      transition: {
                        type: "spring",
                        stiffness: 400,
                        damping: 8,
                      },
                    }}
                    whileTap={{
                      scale: 0.95,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 15
                      }
                    }}
                  >
                    <img
                      src={logo.image}
                      alt={`${logo.name} logo`}
                      className="w-auto object-contain brightness-0 invert opacity-60 group-hover:opacity-100 transition-all duration-300 filter drop-shadow-lg"
                      style={{
                        height: `${logoHeight}px`,
                        minWidth: `${logoWidth * 0.8}px`,
                        maxWidth: `${logoWidth}px`,
                        transform: `perspective(800px) rotateY(0deg)`,
                        transition: "transform 0.6s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = `perspective(800px) rotateY(10deg)`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = `perspective(800px) rotateY(0deg)`;
                      }}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {/* Second animation synchronized with the first */}
              <motion.div
                className="flex items-center absolute left-0 top-0"
                initial={{ x: totalWidth }} // Start from outside right
                animate={isPaused ? { x: totalWidth } : {
                  x: [totalWidth, 0], // Move from right to left
                }}
                transition={{
                  x: {
                    duration: animationDuration, // Match first animation
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "linear",
                  },
                }}
                style={{
                  width: "fit-content",
                  gap: `${logoGap}px`, // Reduced gap
                  paddingLeft: `${logoGap / 2}px`, // Reduced initial offset
                  paddingRight: `${logoGap / 2}px`, // Reduced end offset
                }}
              >
                {duplicatedLogos.map((logo, index) => (
                  <motion.div
                    key={`${logo.name}-2-${index}`}
                    className="flex-shrink-0 group"
                    whileHover={{
                      scale: 1.12,
                      y: -6,
                      transition: {
                        type: "spring",
                        stiffness: 400,
                        damping: 8,
                      },
                    }}
                    whileTap={{
                      scale: 0.95,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 15
                      }
                    }}
                  >
                    <img
                      src={logo.image}
                      alt={`${logo.name} logo`}
                      className="w-auto object-contain brightness-0 invert opacity-60 group-hover:opacity-100 transition-all duration-300 filter drop-shadow-lg"
                      style={{
                        height: `${logoHeight}px`,
                        minWidth: `${logoWidth * 0.8}px`,
                        maxWidth: `${logoWidth}px`,
                        transform: `perspective(800px) rotateY(0deg)`,
                        transition: "transform 0.6s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = `perspective(800px) rotateY(10deg)`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = `perspective(800px) rotateY(0deg)`;
                      }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LogoSection;