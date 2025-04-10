import React, { useState } from 'react';
import { Sparkles, Brain, Rocket, ChevronRight, Star, Shield, Clock } from 'lucide-react';

const PricingCard = ({ plan, isHighlighted }: any) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative group bg-white transition-all duration-500 ease-out mt-8 ${isHighlighted ? 'lg:-translate-y-6' : ''
        }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating elements */}
      <div className={`absolute inset-0 bg-white backdrop-blur-xl rounded-2xl sm:rounded-3xl transition-all duration-500 
        ${isHovered ? 'scale-[1.02] ' : ''} 
        ${isHighlighted ? 'border-1 border-[#d1e0fb]' : 'border border-[#def1f6]'}`}
      />

      {/* Card Content */}
      <div className="relative p-6 sm:p-8">
        {/* Plan Icon */}
        <div className={`inline-flex mb-4 sm:mb-6 p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br
          ${isHighlighted
            ? 'bg-[#0d5ff9] text-[white]'
            : 'from-slate-100 to-slate-50 text-slate-700'}`}>
          {plan.icon}
        </div>

        {/* Plan Details */}
        <div className="mb-4 sm:mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 font-Urbanist">{plan.name}</h3>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-Urbanist">{plan.description}</p>
        </div>

        {/* Pricing */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-baseline gap-1">
            <span className="text-slate-500 text-xs font-Urbanist  sm:text-sm">NPR</span>
            <span className="text-2xl sm:text-3xl font-bold font-Urbanist text-slate-900">{plan.price}</span>
            <span className="text-slate-500 text-xs font-Urbanist sm:text-sm">/ month</span>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          {plan.features.map((feature: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined, idx: React.Key | null | undefined) => (
            <div key={idx} className="flex items-start gap-2 sm:gap-3">
              <div className={`mt-1 p-0.5 rounded-full ${isHighlighted ? 'bg-[#ebf2ff] text-[#0d5ff9]' : 'bg-[#dcf2f7] text-[#082c34]'
                }`}>
                <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </div>
              <span className="text-slate-700 text-xs sm:text-sm font-Urbanist">{feature}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-medium transition-all duration-300 font-Urbanist text-sm sm:text-base
            ${isHighlighted
              ? 'bg-[#0d5ff9] text-white hover:bg-[#0d60f9d5]'
              : 'bg-[#082c34] text-white hover:bg-slate-800'
            } ${isHovered ? 'scale-[1.02]' : ''}`}
        >
          <span className="flex items-center justify-center gap-2">
            Get Started
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </span>
        </button>

        {/* Trust Indicators */}
        {plan.badge && (
          <div className="mt-4 sm:mt-6 flex items-center justify-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-slate-600">
            {plan.securityBadge && <Shield className="w-3 h-3 sm:w-4 sm:h-4" />}
            {plan.timeBadge && <Clock className="w-3 h-3 sm:w-4 sm:h-4" />}
            <span className='font-Urbanist'>{plan.badge}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const PricingSection = () => {
  const plans = [
    {
      name: "Foundation",
      price: "2,500",
      description: "Perfect starting point for IOE aspirants focusing on core concepts and fundamentals",
      icon: <Brain className="w-5 h-5 sm:w-6 sm:h-6" />,
      badge: "7-Day Free Trial Available",
      timeBadge: true,
      features: [
        "Structured IOE curriculum coverage",
        "Basic concept strengthening modules",
        "200+ practice questions",
        "Monthly progress assessments",
        "Mobile-friendly study materials",
        "Email support"
      ]
    },
    {
      name: "Accelerator",
      price: "4,500",
      description: "Comprehensive preparation with advanced practice and personalized guidance",
      icon: <Rocket className="w-5 h-5 sm:w-6 sm:h-6" />,
      badge: "Secured Payment • Money-back Guarantee",
      securityBadge: true,
      features: [
        "Advanced problem-solving techniques",
        "1000+ curated practice questions",
        "Weekly mock tests with analysis",
        "Live doubt clearing sessions",
        "Personal mentor guidance",
        "Priority support response",
        "Performance analytics dashboard"
      ]
    },
    {
      name: "Elite",
      price: "8,900",
      description: "Premium program designed for students aiming for top IOE ranks",
      icon: <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />,
      badge: "Limited Seats Available",
      timeBadge: true,
      features: [
        "One-on-one mentoring with IOE toppers",
        "Advanced topic mastery workshops",
        "Specialized question bank access",
        "Daily practice tests with rankings",
        "Interview preparation sessions",
        "24/7 dedicated support",
        "Campus visit and orientation",
        "Guaranteed rank improvement"
      ]
    }
  ];

  return (
    <div className="relative w-full mt-10 bg-white px-4 sm:px-6 md:px-8 lg:px-8 xl:px-8 2xl:px-16 py-6 sm:py-8 overflow-hidden">
      {/* Section header */}
      <div className="max-w-full xl:max-w-[100rem] 2xl:max-w-[120rem] mx-auto">


        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-8 xl:gap-8">
          <PricingCard plan={plans[0]} isHighlighted={false} />
          <PricingCard plan={plans[1]} isHighlighted={true} />
          <PricingCard plan={plans[2]} isHighlighted={false} />
        </div>
      </div>
    </div>
  );
};

export default PricingSection;