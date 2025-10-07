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
import DarkVeil from "@/components/ui/DarkVeil";
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
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 relative">
        {/* Navigation */}
        <HomeNavbar />
      
      {/* Hero Section with Contact Form */}
      <div className="relative min-h-screen flex items-center justify-center">
        {/* DarkVeil Background */}
        <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
          <DarkVeil 
            hueShift={120}
            noiseIntensity={0.02}
            scanlineIntensity={0.1}
            speed={0.3}
            scanlineFrequency={0.8}
            warpAmount={0.1}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-gray-800/10 backdrop-blur-sm px-3 py-1.5 rounded-full mb-4">
              <Sparkles className="h-3 w-3 text-green-400" />
              <span className="text-white/90 text-xs font-medium">Get in Touch</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
              Contact Our Team
            </h1>
            
            <p className="text-base text-white/80 max-w-2xl mx-auto leading-relaxed">
              Ready to transform your agricultural insurance? Send us a message and we'll get back to you within 24 hours.
            </p>
          </div>

          {/* Contact Form */}
          <Card className="bg-transparent backdrop-blur-sm border border-green-400/20 max-w-2xl mx-auto">
            <CardContent className="p-8">
              {submitSuccess && (
                <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-green-400 font-medium">Message sent successfully!</span>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="name" className="text-white text-sm">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter your full name"
                      required
                      className="bg-transparent border-white/20 text-white placeholder:text-white/60 backdrop-blur-sm mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-white text-sm">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="bg-transparent border-white/20 text-white placeholder:text-white/60 backdrop-blur-sm mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="inquiryType" className="text-white text-sm">Type of Inquiry *</Label>
                        <Select value={formData.inquiryType} onValueChange={(value) => handleInputChange("inquiryType", value)}>
                          <SelectTrigger className="bg-transparent border-white/20 text-white backdrop-blur-sm mt-1">
                            <SelectValue placeholder="Select inquiry type" />
                          </SelectTrigger>
                          <SelectContent className="bg-transparent backdrop-blur-sm border border-white/20">
                            <SelectItem value="general" className="text-white hover:bg-white/10">General Inquiry</SelectItem>
                            <SelectItem value="sales" className="text-white hover:bg-white/10">Sales & Partnership</SelectItem>
                            <SelectItem value="support" className="text-white hover:bg-white/10">Technical Support</SelectItem>
                            <SelectItem value="demo" className="text-white hover:bg-white/10">Request Demo</SelectItem>
                            <SelectItem value="pricing" className="text-white hover:bg-white/10">Pricing Information</SelectItem>
                            <SelectItem value="media" className="text-white hover:bg-white/10">Media & Press</SelectItem>
                          </SelectContent>
                        </Select>
                </div>

                <div>
                  <Label htmlFor="subject" className="text-white text-sm">Subject *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => handleInputChange("subject", e.target.value)}
                    placeholder="Enter message subject"
                    required
                    className="bg-transparent border-white/20 text-white placeholder:text-white/60 backdrop-blur-sm mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-white text-sm">Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder="Enter your message"
                    rows={5}
                    required
                    className="bg-transparent border-white/20 text-white placeholder:text-white/60 backdrop-blur-sm mt-1"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 text-white backdrop-blur-sm rounded-3xl py-3 font-medium duration-500 ease-out hover:scale-105 hover:-translate-y-1"
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
        </div>
      </div>

        {/* Footer */}
        <FooterSection />
      </div>
    </CustomScrollbar>
  );
}