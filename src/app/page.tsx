"use client";

import Navbar from "@/components/navbar";
import HeroSection from '@/components/homePage/heroSection';
import FeatureSection from '@/components/homePage/featureSection';

import PopularCourses from '@/components/homePage/courses';

import HowItWorks from "@/components/homePage/howItWork";
import Teacher from "@/components/homePage/teachersection";
import Video from "@/components/homePage/videoSection";
import Testimonials from "@/components/homePage/testimonials";
import Footer from "@/components/footer";
import Announcement from "@/components/homePage/announcement";
import MarqueeAdvertisement from "@/components/homePage/marqueeAdvertisement";
import Banner from "@/components/homePage/baneer";
import PricingSection from "@/components/homePage/pricingSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeatureSection />

      <MarqueeAdvertisement
        speed={40}
        gap={16}
        autoplayDirection="left"
      />

      <PopularCourses />
      <PricingSection />
      <Announcement />
      <HowItWorks />
      <Video />
      <Teacher />
      <Banner />

      <Testimonials />
      <Footer />
    </>
  );
}