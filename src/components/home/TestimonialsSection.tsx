import { Card, CardContent } from "@/components/ui/card";
import VariableProximity from "@/components/ui/VariableProximity";
import { useRef } from 'react';
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

export function TestimonialsSection() {
  const containerRef = useRef(null);
  
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Farm Owner, Iowa",
      content: "STARHAWK has revolutionized how we monitor our crops. The satellite data and AI predictions have helped us prevent losses and optimize our yield by 25%.",
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "Michael Chen",
      role: "Agricultural Insurance Agent",
      content: "The automated claim processing with drone verification has reduced our processing time from weeks to days. Our clients love the transparency and speed.",
      rating: 5,
      avatar: "MC"
    },
    {
      name: "Elena Rodriguez",
      role: "Government Agriculture Officer",
      content: "STARHAWK's platform provides invaluable insights for policy making. The real-time monitoring helps us support farmers more effectively during challenging seasons.",
      rating: 5,
      avatar: "ER"
    }
  ];

  return (
    <section 
      ref={containerRef}
      className="relative z-10 py-24 px-4"
      style={{ position: 'relative' }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-green-50 border border-green-200 px-4 py-2 rounded-full mb-6">
            <Quote className="h-4 w-4 text-green-600" />
            <VariableProximity
              label="What Our Users Say"
              className="text-gray-700 text-sm font-medium cursor-pointer"
              fromFontVariationSettings="'wght' 400, 'opsz' 8"
              toFontVariationSettings="'wght' 700, 'opsz' 16"
              containerRef={containerRef}
              radius={100}
              falloff="linear"
            />
          </div>
          <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-gray-900 to-green-700 bg-clip-text text-transparent">
            <VariableProximity
              label="Trusted by Industry Leaders"
              className="block cursor-pointer"
              fromFontVariationSettings="'wght' 400, 'opsz' 9"
              toFontVariationSettings="'wght' 1000, 'opsz' 40"
              containerRef={containerRef}
              radius={150}
              falloff="linear"
            />
          </div>
          <div className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            <VariableProximity
              label="See how farmers, insurers, and government officials are transforming agriculture with STARHAWK."
              className="text-center cursor-pointer"
              fromFontVariationSettings="'wght' 300, 'opsz' 8"
              toFontVariationSettings="'wght' 600, 'opsz' 20"
              containerRef={containerRef}
              radius={120}
              falloff="linear"
            />
          </div>
        </motion.div>
        
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <Card className="bg-white border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-500 rounded-2xl group h-full">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-gray-600 leading-relaxed mb-6 text-sm">
                  "{testimonial.content}"
                </blockquote>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="text-gray-900 font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
