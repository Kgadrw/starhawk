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
  Send,
  CheckCircle,
  Users,
  Briefcase,
  Globe,
  MessageCircle
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
      <div className="bg-white relative min-h-screen">
        <HomeNavbar />
      
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 bg-gradient-to-br from-green-50 via-white to-emerald-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-700 mb-4">
                Contact Our Team
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                Ready to transform your agricultural insurance? Send us a message and we'll get back to you within 24 hours.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Card className="border border-gray-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-700">Send us a Message</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {submitSuccess && (
                      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-green-700 font-medium">Message sent successfully!</span>
                        </div>
                      </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label htmlFor="name" className="text-gray-700">Full Name *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            placeholder="Enter your full name"
                            required
                            className="bg-gray-50 border-gray-300 text-gray-700 mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-gray-700">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            placeholder="Enter your email"
                            required
                            className="bg-gray-50 border-gray-300 text-gray-700 mt-2"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="inquiryType" className="text-gray-700">Type of Inquiry *</Label>
                        <Select value={formData.inquiryType} onValueChange={(value) => handleInputChange("inquiryType", value)}>
                          <SelectTrigger className="bg-gray-50 border-gray-300 text-gray-700 mt-2">
                            <SelectValue placeholder="Select inquiry type" />
                          </SelectTrigger>
                          <SelectContent>
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
                        <Label htmlFor="subject" className="text-gray-700">Subject *</Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => handleInputChange("subject", e.target.value)}
                          placeholder="Enter message subject"
                          required
                          className="bg-gray-50 border-gray-300 text-gray-900 mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="message" className="text-gray-700">Message *</Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => handleInputChange("message", e.target.value)}
                          placeholder="Enter your message"
                          rows={5}
                          required
                          className="bg-gray-50 border-gray-300 text-gray-900 mt-2"
                        />
                      </div>

                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full py-6 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        {isSubmitting ? (
                          "Sending Message..."
                        ) : (
                          <>
                            <Send className="h-5 w-5 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                {/* Quick Contact */}
                <div>
                  <h3 className="text-xl font-bold text-gray-700 mb-6">Quick Contact</h3>
                  <div className="grid gap-4">
                    {contactInfo.map((info, index) => {
                      const Icon = info.icon;
                      return (
                        <Card key={index} className="border border-gray-200">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                                <Icon className="h-6 w-6 text-green-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-700 mb-1">{info.title}</h4>
                                <p className="text-sm text-gray-600 mb-2">{info.description}</p>
                                {info.details.map((detail, idx) => (
                                  <p key={idx} className="text-sm text-gray-700">{detail}</p>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* Departments */}
                <div>
                  <h3 className="text-xl font-bold text-gray-700 mb-6">Contact by Department</h3>
                  <div className="grid gap-4">
                    {departments.map((dept, index) => {
                      const Icon = dept.icon;
                      return (
                        <Card key={index} className="border border-gray-200 hover:border-green-300 transition-colors">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                <Icon className="h-5 w-5 text-emerald-600" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-700 mb-1">{dept.name}</h4>
                                <p className="text-sm text-gray-600 mb-2">{dept.description}</p>
                                <div className="space-y-1">
                                  <p className="text-sm text-gray-700">{dept.email}</p>
                                  <p className="text-sm text-gray-700">{dept.phone}</p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <FooterSection />
      </div>
    </CustomScrollbar>
  );
}
