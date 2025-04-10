
"use client"
import { useState, useEffect } from "react";

export default function IntroductionPage() {
  const [cookies, setCookies] = useState([]);
  const [showCookies, setShowCookies] = useState(false);

  return (
    <div className="container mx-auto p-6 h-screen w-screeen flex justify-center items-center text-6xl">
      Welcome to our platform
      
    </div>
  );
}