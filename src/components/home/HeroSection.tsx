import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import LightRays from "@/components/ui/LightRays";
import { 
  ArrowRight,
  Sparkles
} from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
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

      {/* LightRays Background */}
      <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
        <LightRays
          raysOrigin="top-center"
          raysColor="#00ffff"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={1.2}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
          className="custom-rays"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-6 sm:mb-8">
          <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />
          <span className="text-white/90 text-xs sm:text-sm font-medium">Revolutionary Agricultural Technology</span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 sm:mb-8 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent leading-tight px-2">
          Revolutionizing Agricultural
          <span className="block bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">Insurance with AI</span>
        </h1>
        
        <p className="text-base sm:text-lg lg:text-xl text-white/80 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4">
          STARHAWK combines drone surveillance, satellite analytics, and AI to provide 
          comprehensive agricultural insurance solutions for farmers, insurers, and governments.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4">
          <Link to="/role-selection" className="w-full sm:w-auto">
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-gradient-to-r from-green-500/90 to-emerald-600/90 hover:from-green-500 hover:to-emerald-600 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-3xl font-medium text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-500 ease-out hover:scale-105 hover:-translate-y-1"
            >
              Get Started
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2 transition-transform duration-300 ease-out group-hover:translate-x-1" />
            </Button>
          </Link>
          <Button 
            size="lg" 
            variant="outline" 
            className="w-full sm:w-auto bg-white/5 border-white/10 text-white/90 hover:bg-white/10 hover:border-white/20 hover:text-white px-6 sm:px-10 py-3 sm:py-4 rounded-3xl font-medium text-base sm:text-lg backdrop-blur-md transition-all duration-500 ease-out hover:scale-105 hover:-translate-y-1"
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
}
