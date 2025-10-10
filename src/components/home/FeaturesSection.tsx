import { Zap, Satellite, Camera, Shield, Database } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export function FeaturesSection() {
  const features = [
    {
      title: 'Drone Surveillance',
      description: 'Advanced aerial monitoring with high-resolution imaging for precise field assessment',
      icon: Camera,
      image: '/surviellance.webp'
    },
    {
      title: 'Satellite Analytics',
      description: 'AI-powered analysis of satellite imagery for comprehensive crop monitoring',
      icon: Satellite,
      image: '/satelite.jpg'
    },
    {
      title: 'AI Risk Assessment',
      description: 'Intelligent risk evaluation using machine learning and predictive analytics',
      icon: Shield,
      image: '/risk.png'
    },
    {
      title: 'Smart Insurance',
      description: 'Data-driven insurance solutions with automated claims processing',
      icon: Database,
      image: '/insurance.jpg'
    }
  ];

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

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Zap className="h-4 w-4 text-green-400" />
            <span className="text-white/90 text-sm font-medium">Advanced Technology</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">Technology </span>
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">Solutions</span>
          </h2>
          <p className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
            Our platform integrates cutting-edge technology to deliver comprehensive agricultural monitoring and insurance services.
          </p>
        </motion.div>
        
        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card 
                  className="group bg-white/5 backdrop-blur-xl border border-white/10 hover:border-green-400/30 transition-all duration-500 rounded-2xl overflow-hidden h-full"
                >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
                  <div className="absolute top-4 right-4 w-12 h-12 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-xl flex items-center justify-center">
                    <Icon className="h-6 w-6 text-green-400" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}