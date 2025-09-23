import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Award, 
  Linkedin, 
  Mail, 
  GraduationCap,
  Briefcase,
  Globe,
  Shield,
  Brain,
  Database,
  BarChart3
} from "lucide-react";

export default function Team() {
  const teamMembers = [
    {
      name: "Dr. Sarah Johnson",
      role: "Chief Technology Officer",
      expertise: "AI & Machine Learning",
      experience: "15+ years",
      education: "PhD Computer Science, MIT",
      image: "/api/placeholder/300/300",
      description: "Leading our AI initiatives with expertise in machine learning and satellite imagery analysis.",
      achievements: ["Published 50+ research papers", "Former Google AI researcher", "Patent holder in agricultural AI"],
      icon: Brain,
      color: "bg-blue-500"
    },
    {
      name: "Michael Chen",
      role: "Head of Agriculture",
      expertise: "Crop Science & Risk Assessment",
      experience: "12+ years",
      education: "MS Agricultural Science, UC Davis",
      image: "/api/placeholder/300/300",
      description: "Expert in crop science with deep understanding of agricultural risk factors and mitigation strategies.",
      achievements: ["Worked with FAO on global projects", "Developed 20+ crop models", "International agriculture consultant"],
      icon: Globe,
      color: "bg-green-500"
    },
    {
      name: "Dr. Aisha Patel",
      role: "Data Science Director",
      expertise: "Satellite Imagery Analysis",
      experience: "10+ years",
      education: "PhD Remote Sensing, Stanford",
      image: "/api/placeholder/300/300",
      description: "Specialist in satellite imagery processing and geospatial analysis for agricultural monitoring.",
      achievements: ["NASA Earth Science Fellow", "Developed satellite algorithms", "Published in Nature journals"],
      icon: Database,
      color: "bg-purple-500"
    },
    {
      name: "James Wilson",
      role: "Product Manager",
      expertise: "Insurance Technology",
      experience: "8+ years",
      education: "MBA Technology Management, Wharton",
      image: "/api/placeholder/300/300",
      description: "Bridging technology and insurance to create innovative solutions for agricultural risk management.",
      achievements: ["Led 10+ product launches", "Former McKinsey consultant", "Insurance industry expert"],
      icon: Briefcase,
      color: "bg-orange-500"
    },
    {
      name: "Dr. Maria Rodriguez",
      role: "Chief Risk Officer",
      expertise: "Agricultural Risk Modeling",
      experience: "14+ years",
      education: "PhD Agricultural Economics, Cornell",
      image: "/api/placeholder/300/300",
      description: "Expert in developing sophisticated risk models for agricultural insurance and climate adaptation.",
      achievements: ["World Bank consultant", "Climate risk expert", "Published risk models"],
      icon: Shield,
      color: "bg-red-500"
    },
    {
      name: "David Kim",
      role: "Head of Engineering",
      expertise: "Full-Stack Development",
      experience: "11+ years",
      education: "MS Computer Science, Carnegie Mellon",
      image: "/api/placeholder/300/300",
      description: "Leading our engineering team to build scalable and robust agricultural insurance platforms.",
      achievements: ["Former Amazon engineer", "Open source contributor", "Scalability expert"],
      icon: BarChart3,
      color: "bg-indigo-500"
    }
  ];

  const stats = [
    { label: "Team Members", value: "25+", icon: Users },
    { label: "Years Combined Experience", value: "150+", icon: Award },
    { label: "Research Papers Published", value: "200+", icon: GraduationCap },
    { label: "Countries Served", value: "15+", icon: Globe }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 to-green-900 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Meet Our Expert Team
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              World-class professionals dedicated to revolutionizing agricultural insurance
              through cutting-edge technology and deep industry expertise.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Icon className="h-8 w-8" />
                    </div>
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <div className="text-sm text-blue-200">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Leadership Team
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet the visionaries and experts who are transforming agricultural insurance 
            through innovation, technology, and deep industry knowledge.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member, index) => {
            const Icon = member.icon;
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardHeader className="text-center pb-4">
                  <div className="relative mx-auto mb-4">
                    <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full mx-auto flex items-center justify-center">
                      <Icon className="h-16 w-16 text-gray-500" />
                    </div>
                    <div className={`absolute -top-2 -right-2 w-8 h-8 ${member.color} rounded-full flex items-center justify-center`}>
                      <Award className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <p className="text-primary font-semibold">{member.role}</p>
                  <Badge variant="outline" className="mt-2">
                    {member.expertise}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center">
                    {member.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <GraduationCap className="h-4 w-4 text-primary" />
                      <span className="font-medium">Education:</span>
                    </div>
                    <p className="text-sm text-muted-foreground ml-6">{member.education}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="h-4 w-4 text-primary" />
                      <span className="font-medium">Experience:</span>
                    </div>
                    <p className="text-sm text-muted-foreground ml-6">{member.experience}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Key Achievements:</div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {member.achievements.map((achievement, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-center gap-2 pt-4">
                    <Button size="sm" variant="outline">
                      <Linkedin className="h-4 w-4 mr-2" />
                      LinkedIn
                    </Button>
                    <Button size="sm" variant="outline">
                      <Mail className="h-4 w-4 mr-2" />
                      Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Join Our Team Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Our Mission
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            We're always looking for talented individuals who share our passion for 
            transforming agriculture through technology. Join us in building the future 
            of agricultural insurance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              View Open Positions
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
              Send Your Resume
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
