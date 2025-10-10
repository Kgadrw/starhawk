import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Minus, HelpCircle, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What is agricultural insurance and how does it work?",
      answer: "Agricultural insurance protects farmers against crop losses due to natural disasters, pests, diseases, and adverse weather conditions. Our platform uses AI and satellite technology to assess risks, monitor crops, and process claims efficiently, ensuring farmers receive timely compensation for their losses."
    },
    {
      question: "How does the AI-powered risk assessment work?",
      answer: "Our AI system analyzes multiple data sources including satellite imagery, weather patterns, soil conditions, and historical data to evaluate farm-specific risks. This provides accurate risk scoring and helps insurers offer fair premiums while ensuring farmers get appropriate coverage for their crops."
    },
    {
      question: "What crops are covered under the insurance policies?",
      answer: "We cover a wide range of crops including maize, rice, beans, coffee, tea, potatoes, and other staple crops. Each policy is customized based on the crop type, farm size, location, and specific risk factors to provide comprehensive protection."
    },
    {
      question: "How long does it take to process a claim?",
      answer: "Our automated system significantly reduces claim processing time. Using drone surveillance and AI-powered damage assessment, most claims are processed within 7-10 days, compared to traditional methods that can take weeks or months."
    },
    {
      question: "How do I register as a farmer on the platform?",
      answer: "Simply click on the 'Farmer Portal' from the role selection page, fill out the registration form with your farm details, and submit required documents. Once verified, you'll receive a Farmer ID and can immediately start requesting insurance policies."
    },
    {
      question: "What technology is used for crop monitoring?",
      answer: "We use a combination of drone surveillance, satellite imagery (Sentinel-2), weather forecasting APIs, and IoT sensors to provide continuous crop monitoring. This multi-source approach ensures accurate, real-time data for both insurers and farmers."
    },
    {
      question: "How are premiums calculated?",
      answer: "Premiums are calculated based on multiple factors including crop type, farm size, location, historical yield data, weather patterns, and AI-assessed risk levels. Our automated underwriting system ensures fair and competitive pricing for all farmers."
    },
    {
      question: "Can I track my policy and claims online?",
      answer: "Yes! Our platform provides real-time tracking for all policies and claims. Farmers can log in to their dashboard to view policy status, file new claims, upload evidence, and track claim progress through every stage of assessment and approval."
    },
    {
      question: "What payment methods are supported?",
      answer: "We support multiple payment methods including mobile money (MTN Mobile Money, Airtel Money), bank transfers, and USSD services. This ensures farmers can easily pay premiums and receive claim payouts through their preferred channels."
    },
    {
      question: "Is there government support or subsidies available?",
      answer: "Yes, the government provides subsidies covering up to 15% of insurance premiums to make agricultural insurance more affordable for farmers. Our platform automatically applies these subsidies when calculating premium amounts."
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

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <HelpCircle className="h-4 w-4 text-green-400" />
            <span className="text-white/90 text-sm font-medium">Frequently Asked Questions</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">Got </span>
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">Questions?</span>
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            Find answers to common questions about our agricultural insurance platform
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Card 
                className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-green-400/30 transition-all duration-300 rounded-2xl overflow-hidden"
              >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left p-6 flex items-center justify-between group"
              >
                <span className="text-lg font-semibold text-white group-hover:text-green-400 transition-colors pr-4">
                  {faq.question}
                </span>
                <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-400/30 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/30 transition-all duration-300">
                  {openIndex === index ? (
                    <Minus className="h-4 w-4 text-green-400" />
                  ) : (
                    <Plus className="h-4 w-4 text-green-400" />
                  )}
                </div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardContent className="px-6 pb-6 pt-0">
                      <p className="text-white/70 leading-relaxed">
                        {faq.answer}
                      </p>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-white/60 mb-4">Still have questions?</p>
          <a 
            href="/contact" 
            className="inline-flex items-center text-green-400 hover:text-green-300 font-medium transition-colors"
          >
            Contact our support team
            <ChevronDown className="h-4 w-4 ml-1 rotate-[-90deg]" />
          </a>
        </div>
      </div>
    </section>
  );
}

