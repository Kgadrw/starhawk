import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HomeNavbar } from "@/components/layout/HomeNavbar";
import CustomScrollbar from "@/components/ui/CustomScrollbar";
import { motion } from "framer-motion";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Send,
  CheckCircle,
  MessageCircle
} from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
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
      details: "+250 123 456 789",
      description: "Call us for immediate assistance"
    },
    {
      icon: Mail,
      title: "Email",
      details: "info@starhawk.com",
      description: "Send us an email anytime"
    },
    {
      icon: MapPin,
      title: "Address",
      details: "KG 7 Ave, Kigali, Rwanda",
      description: "Visit our headquarters"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: "Mon - Fri: 8:00 AM - 6:00 PM",
      description: "We're here to help"
    }
  ];

  return (
    <CustomScrollbar>
      <div className="bg-white relative min-h-screen">
        <HomeNavbar />
      
        {/* Hero Section */}
        <section className="relative pt-8 pb-8 bg-gradient-to-br from-green-50 via-white to-emerald-50">
          <div className="max-w-7xl mx-auto px-12 sm:px-16 lg:px-24 text-left">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-xl font-bold text-green-600 mb-4">
                Contact Us
              </h1>
              <p className="text-base text-gray-600 max-w-3xl leading-relaxed">
                Ready to transform your agricultural insurance? Send us a message and we'll get back to you within 24 hours.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Card className="border border-gray-200 shadow-sm">
                  <CardContent className="p-6">
                    {submitSuccess && (
                      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-green-700 font-medium text-sm">Message sent successfully!</span>
                        </div>
                      </div>
                    )}
                    
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label htmlFor="name" className="text-sm text-gray-700">Full Name *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            placeholder="Enter your full name"
                            required
                            className="bg-white border-gray-300 text-gray-700 mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-sm text-gray-700">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            placeholder="Enter your email"
                            required
                            className="bg-white border-gray-300 text-gray-700 mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="phone" className="text-sm text-gray-700">Phone Number</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="Enter your phone number"
                          className="bg-white border-gray-300 text-gray-700 mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="inquiryType" className="text-sm text-gray-700">Type of Inquiry *</Label>
                        <Select value={formData.inquiryType} onValueChange={(value) => handleInputChange("inquiryType", value)}>
                          <SelectTrigger className="bg-white border-gray-300 text-gray-700 mt-1">
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
                        <Label htmlFor="subject" className="text-sm text-gray-700">Subject *</Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => handleInputChange("subject", e.target.value)}
                          placeholder="Enter message subject"
                          required
                          className="bg-white border-gray-300 text-gray-700 mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="message" className="text-sm text-gray-700">Message *</Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => handleInputChange("message", e.target.value)}
                          placeholder="Enter your message"
                          rows={5}
                          required
                          className="bg-white border-gray-300 text-gray-700 mt-1"
                        />
                      </div>

                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full py-3 font-semibold"
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

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Get in Touch</h3>
                  <div className="space-y-3">
                    {contactInfo.map((info, index) => {
                      const Icon = info.icon;
                      return (
                        <Card key={index} className="border border-gray-200 hover:border-green-300 transition-colors">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                                <Icon className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-1 text-sm">{info.title}</h4>
                                <p className="text-sm text-gray-600 mb-1">{info.description}</p>
                                <p className="text-sm text-gray-700">{info.details}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Message Card */}
                <Card className="border border-green-200 bg-green-50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <MessageCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm">Need Quick Help?</h4>
                        <p className="text-sm text-gray-600 mb-3">
                          For urgent matters, call us directly or send an email. We typically respond within 24 hours.
                        </p>
                        <div className="flex flex-col gap-2">
                          <a href="tel:+250123456789" className="text-sm text-green-600 hover:text-green-700 font-medium">
                            +250 123 456 789
                          </a>
                          <a href="mailto:info@starhawk.com" className="text-sm text-green-600 hover:text-green-700 font-medium">
                            info@starhawk.com
                          </a>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </CustomScrollbar>
  );
}
