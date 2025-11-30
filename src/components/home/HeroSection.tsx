import { motion } from "framer-motion";
import { HOMEPAGE_COLORS, HOMEPAGE_TYPOGRAPHY, HOMEPAGE_ALIGNMENT, HOMEPAGE_SPACING } from "@/constants/homepage";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[400px] flex">
      {/* Left Content Area - Green Background */}
      <div className="w-full md:w-1/2 bg-green-600 flex items-center px-20 sm:px-24 lg:px-40 py-20 sm:py-28 lg:py-40 relative overflow-hidden">
        {/* Rhombus shape decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/20 transform rotate-45 translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-500/20 transform rotate-45 -translate-x-24 translate-y-24"></div>
        
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl relative z-10"
        >
          {/* Heading */}
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
            Transforming Agriculture with
            <br />
            <span className="bg-white text-green-600 px-2 py-1 inline-block relative">
              AI-Powered Solutions
              {/* Rhombus shape on the highlight */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 transform rotate-45"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-green-500 transform rotate-45"></div>
            </span>
            <br />
            for Farmers
          </h1>
          
          {/* Paragraph */}
          <p className="text-sm sm:text-base text-white/90 mb-6 leading-relaxed max-w-xl">
            STARHAWK has a role at every step of the agricultural insurance journey. When it comes to farming, we monitor it, assess it, insure it, and protect it. Find out how we're transforming agriculture with innovative technology.
          </p>
          
          {/* Button */}
          <Button 
            variant="outline"
            className="bg-white border-2 border-white text-green-600 hover:bg-green-50 rounded-full px-6 py-4 text-sm font-semibold"
          >
            Our Services
          </Button>
        </motion.div>
      </div>

      {/* Right Visual Area - Image */}
      <div className="w-full md:w-1/2 relative">
        <img 
          src="/drone.webp" 
          alt="Agricultural drone over fields"
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  );
}
