import { Zap, Satellite, Camera, Shield, Database } from "lucide-react";
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
    <section className="relative bg-white py-16 sm:py-20">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45 }}
          className="text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
            <Zap className="h-3.5 w-3.5" />
            <span>Tech Solutions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-green-700 tracking-tight">
            Built for precision agriculture
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Four connected modules give insurers, agronomists, and field teams the clarity they need—from season planning to claims settlement.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
          {SOLUTIONS.map((solution, index) => {
            const Icon = solution.icon;
            return (
              <motion.div
                key={solution.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
              >
                <Card className="h-full border-gray-200 hover:border-gray-300 transition-colors">
                  <CardHeader className="pb-4 flex flex-row items-start gap-3">
                    <div className="rounded-lg bg-gray-100 text-gray-700 p-2.5">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-green-700">
                        {solution.title}
                      </CardTitle>
                      <p className="mt-1 text-sm text-gray-600">
                        {solution.summary}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    <ul className="space-y-2">
                      {solution.points.map(point => (
                        <li key={point} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-400" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                    <Button variant="ghost" className="px-0 text-sm text-gray-700 hover:text-gray-900">
                      Explore capability
                    </Button>
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