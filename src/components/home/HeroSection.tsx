import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative w-full px-4 sm:px-6 md:px-8 mt-6 sm:mt-8 md:mt-12 mb-4 sm:mb-6 md:mb-8">
      {/* Hero Section with Rounded Top Corners */}
      <div className="relative w-full min-h-[50vh] md:min-h-[60vh] rounded-t-[2rem] md:rounded-t-[3rem] rounded-b-[2rem] md:rounded-b-[3rem] overflow-hidden border-b border-gray-200">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/surviellance.webp" 
            alt="Agricultural surveillance" 
            className="w-full h-full object-cover rounded-t-[2rem] md:rounded-t-[3rem] rounded-b-[2rem] md:rounded-b-[3rem]"
          />
        </div>
        
        {/* Noise Overlay - Over the image */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.15] rounded-t-[2rem] md:rounded-t-[3rem] rounded-b-[2rem] md:rounded-b-[3rem]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            mixBlendMode: 'overlay'
          }}
        ></div>
        
        {/* Left Gradient Overlay */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-green-900/85 via-green-900/60 to-transparent rounded-t-[2rem] md:rounded-t-[3rem] rounded-b-[2rem] md:rounded-b-[3rem]"></div>
        
        {/* Content Overlay - Positioned on the left */}
        <div className="relative z-10 w-full h-full flex items-start justify-start px-6 sm:px-8 lg:px-16 pt-8 sm:pt-12 md:pt-16 lg:pt-20 pb-8 sm:pb-12 md:pb-16 lg:pb-20">
        <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
            className="max-w-lg"
        >
            {/* Heading - White text for better contrast */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
              Transforming Agriculture with <span className="text-green-400">AI-Powered Solutions</span> for Farmers
          </h1>
          
            {/* Paragraph - White text */}
            <p className="text-base sm:text-lg text-white mb-8 leading-relaxed">
            STARHAWK has a role at every step of the agricultural insurance journey. When it comes to farming, we monitor it, assess it, insure it, and protect it. Find out how we're transforming agriculture with innovative technology.
          </p>
          
            {/* Button - White/light oval/pill shape */}
            <button 
              className="bg-white hover:bg-gray-100 text-gray-900 rounded-full px-12 py-4 text-base font-medium transition-colors"
          >
            Our Services
            </button>
        </motion.div>
        </div>
      </div>
    </section>
  );
}
