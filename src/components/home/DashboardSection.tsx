import { motion } from "framer-motion";
import { HOMEPAGE_COLORS, HOMEPAGE_TYPOGRAPHY, HOMEPAGE_SPACING } from "@/constants/homepage";
import { PLATFORM_WORKFLOW_CONTENT } from "@/constants/workflowContent";
import { BarChart3, Shield, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardSection() {
  return (
    <section className={`relative ${HOMEPAGE_COLORS.bgWhite} p-4 pt-4 sm:pt-6 md:pt-8 mb-4 sm:mb-6 md:mb-8`}>
      <div className={`${HOMEPAGE_SPACING.maxWidth}`}>
        {/* Workflow Header with Icon, Title, Description and Drone Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left Side - Text Content */}
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-green-100 rounded-lg p-3 flex-shrink-0">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600">
                  {PLATFORM_WORKFLOW_CONTENT.coreWorkflow.title}
                </h2>
              </div>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                {PLATFORM_WORKFLOW_CONTENT.coreWorkflow.description}
              </p>
            </div>
            
            {/* Right Side - Drone Image */}
            <div className="relative w-full h-full min-h-[300px] rounded-lg overflow-hidden">
              <img 
                src="/drone.webp" 
                alt="Agricultural drone" 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </motion.div>

        {/* Three Column Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {/* Card 1: Enrollment & Risk Assessment */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-green-50 px-6 py-4">
              <h3 className="text-lg font-bold text-green-600">
                Enrollment & Risk Assessment
              </h3>
            </div>
            <div className="px-6 py-6 flex-1">
              <p className="text-gray-700 leading-relaxed mb-6">
                Farmers are enrolled through agents or digital channels, capturing farm GPS, crop type, and size to issue an insurance policy. Drones and weather data create a baseline risk profile using AI.
              </p>
            </div>
            <div className="px-6 pb-6">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full">
                More details on the project
              </Button>
            </div>
          </div>

          {/* Card 2: Monitoring & Claims Processing */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-green-50 px-6 py-4">
              <h3 className="text-lg font-bold text-green-600">
                Monitoring & Claims Processing
              </h3>
            </div>
            <div className="px-6 py-6 flex-1">
              <p className="text-gray-700 leading-relaxed mb-6">
                Farms are continuously monitored, and farmers receive early warnings for weather or crop stress. If damage occurs, farmers submit claims through USSD, app, or agents. AI automatically evaluates losses using remote sensing and weather data, giving payout recommendations.
              </p>
            </div>
            <div className="px-6 pb-6">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full">
                More details on the project
              </Button>
            </div>
          </div>

          {/* Card 3: Analytics & Reporting */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-green-50 px-6 py-4">
              <h3 className="text-lg font-bold text-green-600">
                Analytics & Reporting
              </h3>
            </div>
            <div className="px-6 py-6 flex-1">
              <p className="text-gray-700 leading-relaxed mb-6">
                Insurers review and finalize decisions. Approved payouts are sent to farmers, and all claim actions are recorded. Government and insurers can access anonymized analytics for planning, risk assessment, and performance tracking.
              </p>
            </div>
            <div className="px-6 pb-6">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full">
                More details on the project
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`${HOMEPAGE_SPACING.mb.xlarge}`}
        >
          <div className="grid md:grid-cols-5 gap-8 lg:gap-12 items-center">
            {/* Left Side - Text Content */}
            <div className="md:col-span-2">
              <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${HOMEPAGE_COLORS.heading} ${HOMEPAGE_SPACING.mb.small}`}>
                Experience Our Intuitive Dashboard
              </h2>
              <p className={`text-base sm:text-lg ${HOMEPAGE_COLORS.bodyLight} leading-relaxed`}>
                Our comprehensive dashboard provides real-time insights, monitoring tools, and seamless management of your agricultural operations.
              </p>
            </div>
            
            {/* Right Side - Dashboard Image */}
            <div className="md:col-span-3 relative w-full border-t border-l border-r border-gray-200 rounded-lg overflow-hidden">
              <img 
                src="/dashboard.png" 
                alt="STARHAWK Dashboard Interface" 
                className="w-full h-auto"
              />
              {/* Bottom gradient overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

