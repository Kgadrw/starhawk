import StarhawkMagicBento from "./StarhawkMagicBento";
import VariableProximity from "@/components/ui/VariableProximity";
import { useRef } from 'react';
import { Zap } from "lucide-react";

export function FeaturesSection() {
  const containerRef = useRef(null);

  return (
    <section 
      ref={containerRef}
      className="relative z-10 py-24 px-4 bg-gradient-to-b from-transparent to-gray-900/20"
      style={{ position: 'relative' }}
    >
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-70 flex items-center justify-center">
        <img
          src="/lines.png"
          alt="Grid lines"
          className="w-3/4 h-3/4 object-contain"
        />
      </div>

      {/* Bottom Corner Lines */}
      <div className="absolute bottom-0 left-0 opacity-60">
        <img
          src="/lines2.png"
          alt="Bottom left lines"
          className="w-[32rem] h-[32rem]"
        />
      </div>
      <div className="absolute bottom-0 right-0 opacity-60">
        <img
          src="/lines2.png"
          alt="Bottom right lines"
          className="w-[32rem] h-[32rem]"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Zap className="h-4 w-4 text-yellow-400" />
            <VariableProximity
              label="Advanced Technology"
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
              label="Technology Solutions"
              className="block cursor-pointer"
              fromFontVariationSettings="'wght' 400, 'opsz' 9"
              toFontVariationSettings="'wght' 1000, 'opsz' 40"
              containerRef={containerRef}
              radius={150}
              falloff="linear"
            />
          </div>
          <div className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
            <VariableProximity
              label="Our platform integrates cutting-edge technology to deliver comprehensive agricultural monitoring and insurance services."
              className="text-center cursor-pointer"
              fromFontVariationSettings="'wght' 300, 'opsz' 8"
              toFontVariationSettings="'wght' 600, 'opsz' 20"
              containerRef={containerRef}
              radius={120}
              falloff="linear"
            />
          </div>
        </div>
        
        <div className="flex justify-center">
          <StarhawkMagicBento 
            textAutoHide={true}
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={false}
            enableMagnetism={true}
            clickEffect={true}
            spotlightRadius={300}
            particleCount={12}
            glowColor="34, 197, 94"
          />
        </div>
      </div>
    </section>
  );
}