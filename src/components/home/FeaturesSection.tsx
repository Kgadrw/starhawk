import { Satellite, Camera, Shield, Database, TrendingUp, MapPin, Cloud, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { HOMEPAGE_COLORS, HOMEPAGE_TYPOGRAPHY, HOMEPAGE_SPACING, HOMEPAGE_ALIGNMENT } from "@/constants/homepage";

const SOLUTIONS = [
  {
    title: "Drone Surveillance",
    description: "High-resolution aerial monitoring for precise crop assessment. Capture field images in minutes and detect anomalies early to monitor growth stages continuously.",
    icon: Camera,
    iconBg: "bg-white/20",
    iconColor: "text-white",
    gradient: "from-blue-500 via-cyan-500 to-blue-600",
    textColor: "text-white",
    borderColor: "border-blue-400/30"
  },
  {
    title: "Satellite Analytics",
    description: "Long-range crop intelligence powered by multi-spectral imagery. Assess vegetation health trends, track moisture and drought risk, and evaluate seasonal performance.",
    icon: Satellite,
    iconBg: "bg-white/20",
    iconColor: "text-white",
    gradient: "from-yellow-400 via-orange-500 to-amber-600",
    textColor: "text-white",
    borderColor: "border-yellow-400/30"
  },
  {
    title: "AI Risk Assessment",
    description: "Predictive scoring that blends field data with historical baselines. Automated risk classifications, scenario modelling for insurers, and real-time portfolio heatmaps.",
    icon: Shield,
    iconBg: "bg-white/20",
    iconColor: "text-white",
    gradient: "from-green-500 via-emerald-500 to-teal-600",
    textColor: "text-white",
    borderColor: "border-green-400/30"
  },
  {
    title: "Smart Insurance",
    description: "Guided policy workflows and streamlined claims management. Configurable product templates, automated document handling, and live claims tracking dashboards.",
    icon: Database,
    iconBg: "bg-white/20",
    iconColor: "text-white",
    gradient: "from-purple-500 via-pink-500 to-rose-600",
    textColor: "text-white",
    borderColor: "border-purple-400/30"
  }
];

const PLATFORM_FEATURES = [
  {
    title: "Satellite Analytics",
    description: "Long-range crop intelligence powered by multi-spectral imagery. Assess vegetation health trends, track moisture and drought risk, and evaluate seasonal performance.",
    icon: Satellite,
    iconBg: "bg-white/20",
    iconColor: "text-white",
    gradient: "from-yellow-400 via-orange-500 to-amber-600",
    textColor: "text-white",
    borderColor: "border-yellow-400/30",
    image: "/satelite.jpg"
  },
  {
    title: "Analytics Dashboard",
    description: "Comprehensive insights and reporting tools to make data-driven decisions for your agricultural operations.",
    icon: BarChart3,
    iconBg: "bg-white/20",
    iconColor: "text-white",
    gradient: "from-indigo-500 via-purple-500 to-pink-600",
    textColor: "text-white",
    borderColor: "border-indigo-400/30",
    image: "/dashboard.jpg"
  }
];

export function FeaturesSection() {
   return (
     <section className={`relative ${HOMEPAGE_COLORS.bgWhite} ${HOMEPAGE_SPACING.sectionPadding} pb-32`}>
       <div className={`${HOMEPAGE_SPACING.maxWidth} ${HOMEPAGE_SPACING.containerPadding}`}>
        {/* Top Section: Image on Left, Text on Right */}
        <div className={`grid md:grid-cols-2 ${HOMEPAGE_SPACING.gap} ${HOMEPAGE_ALIGNMENT.itemsStart} ${HOMEPAGE_SPACING.mb.xlarge}`}>
          {/* Left Section - Large Drone Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative w-full aspect-[16/9] max-h-[400px] rounded-lg overflow-hidden border border-gray-200 shadow-sm"
          >
            <img 
              src="/drone.webp" 
              alt="Agricultural drone surveillance" 
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Right Section - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col"
          >
            <h2 className={`${HOMEPAGE_TYPOGRAPHY.h2} ${HOMEPAGE_COLORS.heading} ${HOMEPAGE_SPACING.mb.medium} ${HOMEPAGE_TYPOGRAPHY.leadingTight}`}>
              Explore the platform
            </h2>
            <p className={`${HOMEPAGE_TYPOGRAPHY.body} ${HOMEPAGE_COLORS.body} ${HOMEPAGE_SPACING.mb.large} ${HOMEPAGE_TYPOGRAPHY.leadingRelaxed}`}>
              STARHAWK is a constantly evolving ecosystem of agricultural technologies and AI-powered solutions for farmers, insurers, and governments to make farming more profitable and risk-free. These solutions are pathways for you to dive into each part of the platform—at your pace.
            </p>
            <Button 
              variant="outline" 
              className="self-start border-blue-600 text-blue-600 hover:bg-blue-50 whitespace-nowrap rounded-full"
            >
              Start exploring
            </Button>
          </motion.div>
         </div>

        {/* New Component Section */}
        <div className={`flex flex-col md:flex-row ${HOMEPAGE_SPACING.mb.xlarge} overflow-hidden rounded-lg h-[300px]`}>
          {/* Left Section - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center bg-green-600 p-6 md:w-1/2"
          >
            <h2 className="text-xl text-white mb-3">
              Advanced Technology Solutions
            </h2>
            <p className="text-white/90 leading-relaxed">
              Leverage cutting-edge AI and satellite technology to optimize your agricultural operations. Our platform provides real-time insights and predictive analytics to help you make informed decisions.
            </p>
          </motion.div>

          {/* Right Section - Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative w-full md:w-1/2"
          >
            <img 
              src="/satelite.jpg" 
              alt="Satellite technology" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        {/* Platform Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h3 className={`${HOMEPAGE_TYPOGRAPHY.h3} ${HOMEPAGE_COLORS.heading} ${HOMEPAGE_SPACING.mb.small}`}>
            Built for Precision Agriculture
          </h3>
          <p className={`${HOMEPAGE_TYPOGRAPHY.body} ${HOMEPAGE_COLORS.bodyLight} max-w-3xl ${HOMEPAGE_SPACING.mb.xlarge}`}>
            Four connected modules give insurers, agronomists, and field teams the clarity they need—from season planning to claims settlement.
          </p>
        </motion.div>

        <div className="flex flex-col gap-4">
          {PLATFORM_FEATURES.map((feature, index) => {
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="w-full"
              >
                {/* Alternating layout: even index = image left, odd index = text left */}
                {index % 2 === 0 ? (
                  // Even index: Image on left, Text on right
                  <div className={`relative ${HOMEPAGE_COLORS.cardBg} rounded-lg h-[300px] flex flex-row overflow-hidden`}>
                    {/* Left Side - Image */}
                    <div className="relative z-10 flex-1">
                      <img 
                        src={feature.image || "/famrs.webp"} 
                        alt={feature.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Right Side - Text Content */}
                    <div className="relative z-10 flex-1 flex flex-col justify-center p-6">
                      {/* Title */}
                      <h3 className="text-xl text-green-600 mb-3">
                        {feature.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-gray-700 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ) : (
                  // Odd index: Text on left, Image on right
                  <div className={`relative ${HOMEPAGE_COLORS.cardBg} rounded-lg h-[300px] flex flex-row overflow-hidden`}>
                    {/* Left Side - Text Content */}
                    <div className="relative z-10 flex-1 flex flex-col justify-center p-6">
                      {/* Title */}
                      <h3 className="text-xl text-green-600 mb-3">
                        {feature.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-gray-700 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                    
                    {/* Right Side - Image */}
                    <div className="relative z-10 flex-1">
                      <img 
                        src={feature.image || "/famrs.webp"} 
                        alt={feature.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}