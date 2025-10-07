import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HomeNavbar } from "@/components/layout/HomeNavbar";
import { FooterSection } from "@/components/home/FooterSection";
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
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 relative">
      {/* Navigation */}
      <HomeNavbar />
      
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center">
        {/* Grid Pattern Background */}
        <div className="absolute inset-0 opacity-70 flex items-center justify-center">
          <img
            src="/lines.png"
            alt="Grid lines"
            className="w-3/4 h-3/4 object-contain"
          />
        </div>

        {/* Bottom Corner Lines */}
        <div className="absolute bottom-0 left-0 opacity-60">
          <img
            src="/lines2.png"
            alt="Bottom left lines"
            className="w-[32rem] h-[32rem]"
          />
        </div>
        <div className="absolute bottom-0 right-0 opacity-60">
          <img
            src="/lines2.png"
            alt="Bottom right lines"
            className="w-[32rem] h-[32rem]"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 text-center">
          <div className="inline-flex items-center space-x-2 bg-gray-800/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Sparkles className="h-4 w-4 text-green-400" />
            <span className="text-white/90 text-sm font-medium">Get in Touch</span>
          </div>
          
          <h1 className="text-6xl font-bold text-white mb-6 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
            Contact Our Team
          </h1>
          
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed mb-12">
            Ready to transform your agricultural insurance? Contact our team of experts
            for personalized solutions and support.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gray-800/10 hover:bg-gray-800/20 border border-gray-700/20 text-white backdrop-blur-sm rounded-3xl px-8 py-4 text-lg font-medium duration-500 ease-out hover:scale-105 hover:-translate-y-1"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Live Chat Support
            </Button>
            <Button 
              size="lg" 
              className="bg-gray-800/10 hover:bg-gray-800/20 border border-gray-700/20 text-white backdrop-blur-sm rounded-3xl px-8 py-4 text-lg font-medium duration-500 ease-out hover:scale-105 hover:-translate-y-1"
            >
              <Phone className="h-5 w-5 mr-2" />
              Schedule a Call
            </Button>
          </div>
        </div>
      </div>

      {/* Contact Form & Info Section */}
      <div className="relative z-10 py-20">
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-70 flex items-center justify-center">
          <img
            src="/lines.png"
            alt="Grid lines"
            className="w-3/4 h-3/4 object-contain"
          />
        </div>

        <div className="absolute bottom-0 left-0 opacity-60">
          <img
            src="/lines2.png"
            alt="Bottom left lines"
            className="w-[32rem] h-[32rem]"
          />
        </div>
        <div className="absolute bottom-0 right-0 opacity-60">
          <img
            src="/lines2.png"
            alt="Bottom right lines"
            className="w-[32rem] h-[32rem]"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <Card className="bg-gray-950/80 backdrop-blur-xl border border-gray-800/50">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Send us a Message</CardTitle>
                <p className="text-white/70">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </CardHeader>
              <CardContent>
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
                      <Label htmlFor="name" className="text-white">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Enter your full name"
                        required
                        className="bg-gray-900/80 border-gray-800/50 text-white placeholder:text-white/60 backdrop-blur-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-white">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="bg-gray-900/80 border-gray-800/50 text-white placeholder:text-white/60 backdrop-blur-sm"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="company" className="text-white">Company/Organization</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        placeholder="Enter your company name"
                        className="bg-gray-900/80 border-gray-800/50 text-white placeholder:text-white/60 backdrop-blur-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-white">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="Enter your phone number"
                        className="bg-gray-900/80 border-gray-800/50 text-white placeholder:text-white/60 backdrop-blur-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="inquiryType" className="text-white">Type of Inquiry *</Label>
                    <Select value={formData.inquiryType} onValueChange={(value) => handleInputChange("inquiryType", value)}>
                      <SelectTrigger className="bg-gray-900/80 border-gray-800/50 text-white backdrop-blur-sm">
                        <SelectValue placeholder="Select inquiry type" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="sales">Sales & Partnership</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                        <SelectItem value="demo">Request Demo</SelectItem>
                        <SelectItem value="pricing">Pricing Information</SelectItem>
                        <SelectItem value="media">Media & Press</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="subject" className="text-white">Subject *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      placeholder="Enter message subject"
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-white">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Enter your message"
                      rows={6}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-gray-800/10 hover:bg-gray-800/20 border border-gray-700/20 text-white backdrop-blur-sm rounded-3xl py-3 font-medium duration-500 ease-out hover:scale-105 hover:-translate-y-1"
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

            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="bg-gray-950/80 backdrop-blur-xl border border-gray-800/50">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Contact Information</CardTitle>
                  <p className="text-white/70">
                    Multiple ways to reach us for your convenience.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {contactInfo.map((info, index) => {
                    const Icon = info.icon;
                    return (
                      <div key={index} className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gray-800/10 backdrop-blur-sm border border-gray-700/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1 text-white">{info.title}</h3>
                          <div className="space-y-1">
                            {info.details.map((detail, idx) => (
                              <p key={idx} className="text-sm text-white/70">{detail}</p>
                            ))}
                          </div>
                          <p className="text-xs text-white/50 mt-1">{info.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-gray-950/80 backdrop-blur-xl border border-gray-800/50">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full bg-gray-800/10 hover:bg-gray-800/20 border border-gray-700/20 text-white backdrop-blur-sm justify-start"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Live Chat Support
                  </Button>
                  <Button 
                    className="w-full bg-gray-800/10 hover:bg-gray-800/20 border border-gray-700/20 text-white backdrop-blur-sm justify-start"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Schedule a Call
                  </Button>
                  <Button 
                    className="w-full bg-gray-800/10 hover:bg-gray-800/20 border border-gray-700/20 text-white backdrop-blur-sm justify-start"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Request Demo
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Departments Section */}
      <div className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Contact Our Departments
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Reach out to the right team for specialized assistance and support.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {departments.map((dept, index) => {
              const Icon = dept.icon;
              return (
                <Card key={index} className="group bg-gray-950/80 backdrop-blur-xl border border-gray-800/50 hover:bg-gray-900/50 transition-all duration-500 rounded-2xl h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-800/10 backdrop-blur-sm border border-gray-700/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-all duration-500">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-lg text-white">{dept.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-white/70 mb-4">{dept.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-green-400" />
                        <span className="text-white/80">{dept.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-green-400" />
                        <span className="text-white/80">{dept.phone}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Visit Our Office
            </h2>
            <p className="text-xl text-white/70">
              Located in the heart of Kigali, Rwanda
            </p>
          </div>
          
          <Card className="bg-gray-950/80 backdrop-blur-xl border border-gray-800/50 overflow-hidden">
            <CardContent className="p-0">
              <div className="h-96 bg-gradient-to-br from-green-900/20 to-blue-900/20 flex items-center justify-center relative">
                {/* Background decorations */}
                <div className="absolute inset-0 opacity-30">
                  <img
                    src="/lines.png"
                    alt="Grid lines"
                    className="w-full h-full object-contain"
                  />
                </div>
                
                <div className="relative z-10 text-center">
                  <div className="w-20 h-20 bg-gray-800/10 backdrop-blur-sm border border-gray-700/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <MapPin className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">STARHAWK Headquarters</h3>
                  <p className="text-white/70 text-lg">KG 7 Ave, Kigali, Rwanda</p>
                  <p className="text-sm text-white/50 mt-2">
                    Interactive map would be integrated here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <FooterSection />
    </div>
  );
}