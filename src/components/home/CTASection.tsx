import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import VariableProximity from "@/components/ui/VariableProximity";
import { useRef } from 'react';
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";

export function CTASection() {
  const containerRef = useRef(null);

  return (
    <section 
      ref={containerRef}
      className="relative z-10 py-24 px-4 bg-gradient-to-b from-transparent to-gray-50"
      style={{ position: 'relative' }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="bg-white border border-gray-200 rounded-3xl p-12 shadow-lg"
        >
          <div className="inline-flex items-center space-x-2 bg-green-50 border border-green-200 px-4 py-2 rounded-full mb-8">
            <Star className="h-4 w-4 text-green-600" />
            <VariableProximity
              label="Ready to Get Started?"
              className="text-gray-700 text-sm font-medium cursor-pointer"
              fromFontVariationSettings="'wght' 400, 'opsz' 8"
              toFontVariationSettings="'wght' 700, 'opsz' 16"
              containerRef={containerRef}
              radius={100}
              falloff="linear"
            />
          </div>
          <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent">
            <VariableProximity
              label="Join the Future of Agriculture"
              className="block cursor-pointer"
              fromFontVariationSettings="'wght' 400, 'opsz' 9"
              toFontVariationSettings="'wght' 1000, 'opsz' 40"
              containerRef={containerRef}
              radius={150}
              falloff="linear"
            />
          </div>
          <div className="text-lg text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
            <VariableProximity
              label="Experience the power of AI-driven agricultural insurance. Get started today and transform your farming operations with cutting-edge technology."
              className="text-center cursor-pointer"
              fromFontVariationSettings="'wght' 300, 'opsz' 8"
              toFontVariationSettings="'wght' 600, 'opsz' 20"
              containerRef={containerRef}
              radius={120}
              falloff="linear"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/role-selection">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-10 py-4 rounded-3xl font-medium text-lg shadow-md hover:shadow-lg transition-all duration-500 ease-out hover:scale-105 hover:-translate-y-1"
              >
                How It Works
                <ArrowRight className="h-5 w-5 ml-2 transition-transform duration-300 ease-out group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 px-10 py-4 rounded-3xl font-medium text-lg shadow-sm transition-all duration-500 ease-out hover:scale-105 hover:-translate-y-1"
            >
              Learn More
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}