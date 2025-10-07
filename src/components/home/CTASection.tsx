import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative z-10 py-24 px-4 bg-gradient-to-b from-transparent to-gray-900/20">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-12">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8">
            <Star className="h-4 w-4 text-yellow-400" />
            <span className="text-white/90 text-sm font-medium">Ready to Get Started?</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
            Join the Future of Agriculture
          </h2>
          <p className="text-lg text-white/80 mb-10 leading-relaxed max-w-2xl mx-auto">
            Experience the power of AI-driven agricultural insurance. Get started today and transform your farming operations with cutting-edge technology.
          </p>
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