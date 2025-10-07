import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import VariableProximity from "@/components/ui/VariableProximity";
import { useRef } from 'react';
import { ArrowRight, Star } from "lucide-react";

export function CTASection() {
  const containerRef = useRef(null);

  return (
    <section 
      ref={containerRef}
      className="relative z-10 py-24 px-4 bg-gradient-to-b from-transparent to-gray-900/20"
      style={{ position: 'relative' }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-12">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8">
            <Star className="h-4 w-4 text-yellow-400" />
            <VariableProximity
              label="Ready to Get Started?"
              className="text-white/90 text-sm font-medium cursor-pointer"
              fromFontVariationSettings="'wght' 400, 'opsz' 8"
              toFontVariationSettings="'wght' 700, 'opsz' 16"
              containerRef={containerRef}
              radius={100}
              falloff="linear"
            />
          </div>
          <div className="text-4xl md:text-5xl font-bold text-white mb-6 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
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
          <div className="text-lg text-white/80 mb-10 leading-relaxed max-w-2xl mx-auto">
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
                className="bg-gradient-to-r from-green-500/90 to-emerald-600/90 hover:from-green-500 hover:to-emerald-600 text-white px-10 py-4 rounded-3xl font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-500 ease-out hover:scale-105 hover:-translate-y-1"
              >
                Get Started Now
                <ArrowRight className="h-5 w-5 ml-2 transition-transform duration-300 ease-out group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white/5 border-white/10 text-white/90 hover:bg-white/10 hover:border-white/20 hover:text-white px-10 py-4 rounded-3xl font-medium text-lg backdrop-blur-md transition-all duration-500 ease-out hover:scale-105 hover:-translate-y-1"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}