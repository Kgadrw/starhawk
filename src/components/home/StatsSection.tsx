import { 
  Users,
  Shield,
  Target,
  TrendingUp
} from "lucide-react";

export function StatsSection() {
  return (
    <section className="relative z-10 py-24 px-4 bg-gradient-to-b from-transparent to-gray-900/20">
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
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 ease-out">
                <Users className="h-8 w-8 text-white/90" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">10,000+</h3>
              <p className="text-white/70">Active Farmers</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 ease-out">
                <Shield className="h-8 w-8 text-white/90" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">99.9%</h3>
              <p className="text-white/70">Uptime Guarantee</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 ease-out">
                <Target className="h-8 w-8 text-white/90" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">24/7</h3>
              <p className="text-white/70">Support Available</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 ease-out">
                <TrendingUp className="h-8 w-8 text-white/90" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">95%</h3>
              <p className="text-white/70">Claim Accuracy</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}