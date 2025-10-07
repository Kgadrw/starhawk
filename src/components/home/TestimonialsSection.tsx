import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

export function TestimonialsSection() {
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
    <section className="relative z-10 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Quote className="h-4 w-4 text-yellow-400" />
            <span className="text-white/90 text-sm font-medium">What Our Users Say</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
            Trusted by Industry Leaders
          </h2>
          <p className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
            See how farmers, insurers, and government officials are transforming agriculture with STARHAWK.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 rounded-2xl group">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-white/80 leading-relaxed mb-6 text-sm">
                  "{testimonial.content}"
                </blockquote>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{testimonial.name}</h4>
                    <p className="text-white/60 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
