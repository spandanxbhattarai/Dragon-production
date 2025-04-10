"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { ArrowUp, Mail, ChevronUp, MapPin, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  // Add state for showing/hiding back to top button
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Scroll to top function
  const scrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Add scroll event listener to show/hide button
  useEffect(() => {
    const handleScroll = () => {
      // Show button when user scrolls down 500px
      if (window.scrollY > 500) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    // Add event listener
    window.addEventListener('scroll', handleScroll);
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <footer className="relative w-full bg-[#0A2A3A] text-white px-4 sm:px-6 md:px-8 lg:px-8 xl:px-8 2xl:px-16 py-10 sm:py-12 md:py-16 lg:py-20 overflow-hidden">
      {/* Background shapes - keeping these as they add nice subtle decoration */}
      <div className="absolute left-0 bottom-0 opacity-5">
        <svg
          width="120"
          height="120"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,50 a50,50 0 1,0 100,0 a50,50 0 1,0 -100,0"
            fill="#ffffff"
          />
        </svg>
      </div>

      <div className="absolute -right-20 top-20 opacity-3 hidden sm:block">
        <svg
          width="180"
          height="180"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,50 a50,50 0 1,0 100,0 a50,50 0 1,0 -100,0"
            fill="#ffffff"
          />
        </svg>
      </div>

      <div className="absolute right-1/3 -bottom-10 opacity-3 hidden sm:block">
        <svg
          width="140"
          height="140"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,50 a50,50 0 1,0 100,0 a50,50 0 1,0 -100,0"
            fill="#ffffff"
          />
        </svg>
      </div>

      <div className="max-w-full xl:max-w-[100rem] 2xl:max-w-[120rem] mx-auto relative z-10">
        {/* Newsletter Section - Improved tablet responsiveness */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 md:mb-12 lg:mb-16">
          <div className="flex flex-col items-center md:items-start mb-6 md:mb-0 w-full md:w-auto">
            <div className="flex items-center mb-2 md:mb-4">
              <div className="mr-3 md:mr-4 text-opacity-60">
                <svg
                  className="w-10 h-10 md:w-12 md:h-12 text-gray-300 opacity-60"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-Urbanist font-bold">
                  Subscribe to Our Newsletter
                </h2>
                <h3 className="text-lg sm:text-xl md:text-xl lg:text-2xl font-Urbanist font-bold">
                  for Latest Update
                </h3>
              </div>
            </div>
          </div>
          <div className="w-full md:w-auto md:min-w-[320px] lg:min-w-[400px]">
            <div className="flex max-w-2xl mx-auto md:mx-0 font-Urbanist bg-white rounded-full overflow-hidden shadow-md p-2">
              <input
                type="email"
                placeholder="Email Address"
                className="px-4 sm:px-6 lg:px-8 py-3 flex-grow bg-white text-gray-600 focus:outline-none text-sm sm:text-base font-medium rounded-l-full"
                aria-label="Email for newsletter"
              />
              <button
                className="group relative overflow-hidden text-white px-6 sm:px-8 md:px-10 py-3 font-medium text-sm sm:text-base focus:outline-none rounded-full ml-2 w-32 sm:w-36 md:w-40"
                aria-label="Subscribe to newsletter"
              >
                <span className="relative font-Urbanist z-10">Subscribe</span>
                <div className="absolute inset-0 bg-[#0052FF]"></div>
                <div className="absolute inset-0 bg-[#002E47] transform translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Main Footer Content - Modified for better tablet responsiveness */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8 text-center sm:text-left">
          {/* Column 1 - Logo and Info */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center justify-center sm:justify-start mb-4">
              <img
                src="/images/logo.png"
                alt="Logo"
                className="h-12 w-auto sm:h-14 md:h-16 lg:h-20 transition-all duration-300 text-blue-600 brightness-0 invert"
              />
              <h2 className="text-2xl sm:text-3xl font-Urbanist font-bold">
                Dragon
              </h2>
            </div>
            <p className="text-gray-300 mb-6 font-Urbanist max-w-xs mx-auto sm:mx-0 text-sm sm:text-base md:text-base lg:text-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit varius
              congue Morbi
            </p>

            {/* Social Media - Unique Hexagon Design */}
            <div className="w-full">
              <h3 className="text-xl sm:text-2xl font-bold font-Urbanist mb-5 text-center sm:text-left">
                Connect With Us
              </h3>
              <div className="flex justify-center sm:justify-start space-x-3">
                <a
                  href="#"
                  className="group relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition duration-300 overflow-hidden"
                  aria-label="Facebook"
                >
                  <div className="absolute inset-0 bg-[#1e2d40] transform rotate-45 transition-all duration-300 group-hover:bg-[#0866ff] rounded-md"></div>
                  <FaFacebookF
                    size={16}
                    className="relative z-10 text-[#6b88a7] group-hover:text-white transition duration-300"
                  />
                </a>

                <a
                  href="#"
                  className="group relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition duration-300 overflow-hidden"
                  aria-label="Twitter"
                >
                  <div className="absolute inset-0 bg-[#1e2d40] transform rotate-45 transition-all duration-300 group-hover:bg-[#1DA1F2] rounded-md"></div>
                  <FaTwitter
                    size={16}
                    className="relative z-10 text-[#6b88a7] group-hover:text-white transition duration-300"
                  />
                </a>

                <a
                  href="#"
                  className="group relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition duration-300 overflow-hidden"
                  aria-label="LinkedIn"
                >
                  <div className="absolute inset-0 bg-[#1e2d40] transform rotate-45 transition-all duration-300 group-hover:bg-[#0A66C2] rounded-md"></div>
                  <FaLinkedinIn
                    size={16}
                    className="relative z-10 text-[#6b88a7] group-hover:text-white transition duration-300"
                  />
                </a>

                <a
                  href="#"
                  className="group relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition duration-300 overflow-hidden"
                  aria-label="YouTube"
                >
                  <div className="absolute inset-0 bg-[#1e2d40] transform rotate-45 transition-all duration-300 group-hover:bg-[#FF0000] rounded-md"></div>
                  <FaYoutube
                    size={16}
                    className="relative z-10 text-[#6b88a7] group-hover:text-white transition duration-300"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2 - Useful Links */}
          <div className="col-span-1">
            <h3 className="text-xl sm:text-2xl font-Urbanist font-bold mb-3">
              Useful Links
            </h3>
            <div className="h-0.5 w-24 border-b-2 border-blue-500 border-dashed mb-4 md:mb-6 mx-auto sm:mx-0"></div>
            <ul className="space-y-3 md:space-y-4 font-Urbanist text-sm sm:text-base md:text-base lg:text-lg">
              <li>
                <Link
                  href="/"
                  className="hover:text-blue-400 transition-all duration-300 inline-block py-1"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about-us"
                  className="hover:text-blue-400 transition-all duration-300 inline-block py-1"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/courses"
                  className="hover:text-blue-400 transition-all duration-300 inline-block py-1"
                >
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="hover:text-blue-400 transition-all duration-300 inline-block py-1"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-blue-400 transition-all duration-300 inline-block py-1"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-blue-400 transition-all duration-300 inline-block py-1"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Resources */}
          <div className="col-span-1">
            <h3 className="text-xl sm:text-2xl font-Urbanist font-bold mb-3 mt-0">
              Resources
            </h3>
            <div className="h-0.5 w-24 border-b-2 border-blue-500 border-dashed mb-4 md:mb-6 mx-auto sm:mx-0"></div>
            <ul className="space-y-3 md:space-y-4 font-Urbanist text-sm sm:text-base md:text-base lg:text-lg">
              <li>
                <Link
                  href="/community"
                  className="hover:text-blue-400 transition-all duration-300 inline-block py-1"
                >
                  Community
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="hover:text-blue-400 transition-all duration-300 inline-block py-1"
                >
                  Support
                </Link>
              </li>
              <li>
                <Link
                  href="/video-guides"
                  className="hover:text-blue-400 transition-all duration-300 inline-block py-1"
                >
                  Video Guides
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-blue-400 transition-all duration-300 inline-block py-1"
                >
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-blue-400 transition-all duration-300 inline-block py-1"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/security"
                  className="hover:text-blue-400 transition-all duration-300 inline-block py-1"
                >
                  Security
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Contact Us - Modified to be centered on mobile only */}
          <div className="col-span-2 md:col-span-1 text-center sm:text-center md:text-left">
            <div className="flex justify-center md:justify-start mb-3 mt-0">
              <h3 className="text-xl sm:text-2xl font-Urbanist font-bold">
                Contact Us
              </h3>
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 ml-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                <path d="M2 2l7.586 7.586"></path>
                <circle cx="11" cy="11" r="2"></circle>
              </svg>
            </div>
            <div className="h-0.5 w-24 border-b-2 border-blue-500 border-dashed mb-4 md:mb-6 mx-auto md:mx-0"></div>
            <ul className="space-y-4 md:space-y-5 font-Urbanist max-w-xs mx-auto md:mx-0 text-sm sm:text-base md:text-base lg:text-lg">
              <li className="flex flex-col sm:flex-col md:flex-row items-center md:items-start">
                <div className="w-10 h-10 flex items-center justify-center mb-2 md:mb-0 md:mr-4 flex-shrink-0">
                  <MapPin className="w-5 h-5 text-blue-500" />
                </div>
                <div className="text-center md:text-left">
                  <span>
                  New Baneshwor, Kathmandu 
                    {/* <br />
                    Harvey, IL
                    <br />
                    60426 USA */}
                  </span>
                </div>
              </li>
              <li className="flex flex-col sm:flex-col md:flex-row items-center md:items-start">
                <div className="w-10 h-10 flex items-center justify-center mb-2 md:mb-0 md:mr-4 flex-shrink-0">
                  <Phone className="w-5 h-5 text-blue-500" />
                </div>
                <a
                  href="tel:7082109101"
                  className="hover:text-blue-400 transition-all duration-300"
                >
                  +977-01-4579540
                  <br />
                  +977 970 454 1292
                </a>
              </li>
              <li className="flex flex-col sm:flex-col md:flex-row items-center md:items-start">
                <div className="w-10 h-10 flex items-center justify-center mb-2 md:mb-0 md:mr-4 flex-shrink-0">
                  <Mail className="w-5 h-5 text-blue-500" />
                </div>
                <a
                  href="mailto:example@education.com"
                  className="hover:text-blue-400 transition-all duration-300"
                >
                  dragonfoundation555@gmail
                  <br />.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 md:mt-12 pt-6 text-center font-Urbanist text-sm sm:text-base">
          <p>Copyright © 2024 Edumon. All rights reserved.</p>
        </div>
      </div>

      {/* Scroll to top button - ADDED */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-4 sm:right-6 md:right-8 w-12 h-12 rounded-full flex items-center justify-center z-50 shadow-lg overflow-hidden group animate-float"
          aria-label="Back to top"
        >
          <div className="absolute inset-0 bg-[#0052FF]"></div>
          <div className="absolute inset-0 bg-[#002E47] transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
          <ChevronUp size={20} className="text-white relative z-10" />
        </button>
      )}
    </footer>
  );
};

export default Footer;