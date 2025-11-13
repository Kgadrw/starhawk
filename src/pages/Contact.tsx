import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HomeNavbar } from "@/components/layout/HomeNavbar";
import { FooterSection } from "@/components/home/FooterSection";
import CustomScrollbar from "@/components/ui/CustomScrollbar";
import { motion } from "framer-motion";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  MessageCircle,
  Send,
  CheckCircle,
  Users,
  Briefcase,
  Globe,
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    subject: "",
    message: "",
    inquiryType: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitSuccess(true);
    
    // Auto hide success message after 5 seconds
    setTimeout(() => setSubmitSuccess(false), 5000);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: ["+250 123 456 789", "+250 987 654 321"],
      description: "Call us for immediate assistance"
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@starhawk.com", "support@starhawk.com"],
      description: "Send us an email anytime"
    },
    {
      icon: MapPin,
      title: "Address",
      details: ["KG 7 Ave, Kigali", "Rwanda, East Africa"],
      description: "Visit our headquarters"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Mon - Fri: 8:00 AM - 6:00 PM", "Sat: 9:00 AM - 4:00 PM"],
      description: "We're here to help"
    }
  ];

  const departments = [
    {
      name: "Sales & Business Development",
      email: "sales@starhawk.com",
      phone: "+250 123 456 789",
      icon: Briefcase,
      description: "For new partnerships and business inquiries"
    },
    {
      name: "Technical Support",
      email: "support@starhawk.com",
      phone: "+250 123 456 790",
      icon: MessageCircle,
      description: "For technical assistance and platform support"
    },
    {
      name: "Customer Success",
      email: "success@starhawk.com",
      phone: "+250 123 456 791",
      icon: Users,
      description: "For existing customer support and training"
    },
    {
      name: "Media & Press",
      email: "media@starhawk.com",
      phone: "+250 123 456 792",
      icon: Globe,
      description: "For media inquiries and press releases"
    }
  ];

  return (
    <CustomScrollbar>
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 relative">
        {/* Navigation */}
        <HomeNavbar />
      
      {/* Hero Section with Contact Form */}
      <div className="relative min-h-screen flex items-center justify-center">
        {/* Grid Pattern Background */}
        <div className="absolute inset-0 opacity-70 flex items-center justify-center">
          <img
            src="/lines.png"
            alt="Grid lines"
            className="w-3/4 h-3/4 object-contain"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center space-x-2 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full mb-4">
              <Sparkles className="h-3 w-3 text-green-600" />
              <span className="text-gray-900/90 text-xs font-medium">Get in Touch</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-4">
              Contact Our Team
            </h1>
            
            <p className="text-base text-gray-900/80 max-w-2xl mx-auto leading-relaxed">
              Ready to transform your agricultural insurance? Send us a message and we'll get back to you within 24 hours.
            </p>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Card className="bg-white border border-gray-200 max-w-2xl mx-auto">
            <CardContent className="p-8">
              {submitSuccess && (
                <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-green-600 font-medium">Message sent successfully!</span>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="name" className="text-gray-900 text-sm">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter your full name"
                      required
                      className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-900/60 backdrop-blur-sm mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-gray-900 text-sm">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-900/60 backdrop-blur-sm mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="inquiryType" className="text-gray-900 text-sm">Type of Inquiry *</Label>
                        <Select value={formData.inquiryType} onValueChange={(value) => handleInputChange("inquiryType", value)}>
                          <SelectTrigger className="bg-gray-50 border-gray-300 text-gray-900 backdrop-blur-sm mt-1">
                            <SelectValue placeholder="Select inquiry type" />
                          </SelectTrigger>
                          <SelectContent className="bg-transparent backdrop-blur-sm border border-gray-200">
                            <SelectItem value="general" className="text-gray-900 hover:bg-white/10">General Inquiry</SelectItem>
                            <SelectItem value="sales" className="text-gray-900 hover:bg-white/10">Sales & Partnership</SelectItem>
                            <SelectItem value="support" className="text-gray-900 hover:bg-white/10">Technical Support</SelectItem>
                            <SelectItem value="demo" className="text-gray-900 hover:bg-white/10">Request Demo</SelectItem>
                            <SelectItem value="pricing" className="text-gray-900 hover:bg-white/10">Pricing Information</SelectItem>
                            <SelectItem value="media" className="text-gray-900 hover:bg-white/10">Media & Press</SelectItem>
                          </SelectContent>
                        </Select>
                </div>

                <div>
                  <Label htmlFor="subject" className="text-gray-900 text-sm">Subject *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => handleInputChange("subject", e.target.value)}
                    placeholder="Enter message subject"
                    required
                    className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-900/60 backdrop-blur-sm mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-gray-900 text-sm">Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder="Enter your message"
                    rows={5}
                    required
                    className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-900/60 backdrop-blur-sm mt-1"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white rounded-3xl py-3 font-medium shadow-md transition-all duration-300"
                >
                  {isSubmitting ? (
                    "Sending Message..."
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
          </motion.div>
        </div>
      </div>

        {/* Footer */}
        <FooterSection />
      </div>
    </CustomScrollbar>
  );
}