import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import VariableProximity from "@/components/ui/VariableProximity";
import { useRef } from 'react';
import { motion } from "framer-motion";
import { 
  ArrowRight
} from "lucide-react";

export function HeroSection() {
  const containerRef = useRef(null);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white"
      style={{ position: 'relative' }}
    >
      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-6 sm:mb-8 bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent leading-tight px-2"
        >
          <VariableProximity
            label="Revolutionizing Agricultural"
            className="block mb-4 cursor-pointer"
            fromFontVariationSettings="'wght' 400, 'opsz' 9"
            toFontVariationSettings="'wght' 1000, 'opsz' 40"
            containerRef={containerRef}
            radius={150}
            falloff="linear"
          />
          <VariableProximity
            label="Insurance with AI"
            className="block bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent cursor-pointer"
            fromFontVariationSettings="'wght' 400, 'opsz' 9"
            toFontVariationSettings="'wght' 1000, 'opsz' 40"
            containerRef={containerRef}
            radius={150}
            falloff="linear"
          />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-base sm:text-lg lg:text-xl text-gray-600 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4 text-center"
        >
          STARHAWK combines drone surveillance, satellite analytics, and AI to provide comprehensive agricultural insurance solutions for farmers, insurers, and governments.
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4"
        >
          <Link to="/role-selection" className="w-full sm:w-auto">
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-3xl font-medium text-base sm:text-lg shadow-md hover:shadow-lg transition-all duration-500 ease-out hover:scale-105 hover:-translate-y-1"
            >
              Get Started
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2 transition-transform duration-300 ease-out group-hover:translate-x-1" />
            </Button>
          </Link>
          <Button 
            size="lg" 
            variant="outline" 
            className="w-full sm:w-auto bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 px-6 sm:px-10 py-3 sm:py-4 rounded-3xl font-medium text-base sm:text-lg shadow-sm transition-all duration-500 ease-out hover:scale-105 hover:-translate-y-1"
          >
            Learn More
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
