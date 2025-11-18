import { Satellite, Camera, Shield, Database } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const SOLUTIONS = [
  {
    title: "Drone Surveillance",
    summary: "High-resolution aerial monitoring for precise crop assessment.",
    icon: Camera,
    points: [
      "Capture field images in minutes",
      "Detect anomalies early",
      "Monitor growth stages continuously"
    ]
  },
  {
    title: "Satellite Analytics",
    summary: "Long-range crop intelligence powered by multi-spectral imagery.",
    icon: Satellite,
    points: [
      "Assess vegetation health trends",
      "Track moisture and drought risk",
      "Evaluate seasonal performance"
    ]
  },
  {
    title: "AI Risk Assessment",
    summary: "Predictive scoring that blends field data with historical baselines.",
    icon: Shield,
    points: [
      "Automated risk classifications",
      "Scenario modelling for insurers",
      "Real-time portfolio heatmaps"
    ]
  },
  {
    title: "Smart Insurance",
    summary: "Guided policy workflows and streamlined claims management.",
    icon: Database,
    points: [
      "Configurable product templates",
      "Automated document handling",
      "Live claims tracking dashboards"
    ]
  }
];

export function FeaturesSection() {
  return (
    <section className="relative bg-white py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-700 mb-4">
            Built for Precision Agriculture
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Four connected modules give insurers, agronomists, and field teams the clarity they need—from season planning to claims settlement.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {SOLUTIONS.map((solution, index) => {
            const Icon = solution.icon;
            return (
              <motion.div
                key={solution.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-300 group">
                  <CardHeader className="pb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-700 mb-2">
                      {solution.title}
                    </CardTitle>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {solution.summary}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-2.5 mb-4">
                      {solution.points.map(point => (
                        <li key={point} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
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