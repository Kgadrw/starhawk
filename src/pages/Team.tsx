import { HomeNavbar } from "@/components/layout/HomeNavbar";
import { FooterSection } from "@/components/home/FooterSection";
import { Users, ArrowLeft, Linkedin, Github } from "lucide-react";
import { Link } from "react-router-dom";

const Team = () => {
  const teamMembers = [
    {
      image: "https://i.pravatar.cc/300?img=1",
      title: "Victor Muragwa",
      subtitle: "Chief Executive Officer",
      handle: "@victormuragwa",
      borderColor: "#22C55E",
      gradient: "linear-gradient(145deg, #22C55E, #000)",
      url: "https://linkedin.com/in/victormuragwa"
    },
    {
      image: "https://i.pravatar.cc/300?img=2",
      title: "Gad Kalisa",
      subtitle: "Software Engineer & Product Designer",
      handle: "@gadkalisa",
      borderColor: "#3B82F6",
      gradient: "linear-gradient(180deg, #3B82F6, #000)",
      url: "https://github.com/gadkalisa"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 min-h-screen">
      {/* Navigation */}
      <HomeNavbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4">
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

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Users className="h-4 w-4 text-yellow-400" />
            <span className="text-white/90 text-sm font-medium">Meet Our Team</span>
                  </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
            Our Expert Team
          </h1>
          
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed mb-8">
            The talented individuals behind STARHAWK's revolutionary agricultural insurance platform.
            Our team combines expertise in technology, agriculture, and insurance to deliver 
            innovative solutions for farmers worldwide.
          </p>

          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
                  </div>
      </section>

      {/* Team Grid */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <div key={index} className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden w-72 h-80">
                <img 
                  src={member.image} 
                  alt={member.title}
                  className="w-full h-full object-cover"
                />
                
                {/* LinkedIn Icon - Top Right */}
                <div className="absolute top-3 right-3">
                  <a 
                    href={member.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-colors"
                  >
                    <Linkedin className="h-4 w-4 text-white" />
                  </a>
                </div>
                
                {/* Text Overlay - Bottom */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-4">
                  <h3 className="text-lg font-bold text-white mb-1">{member.title}</h3>
                  <p className="text-green-400 text-sm font-medium mb-1">{member.subtitle}</p>
                  <p className="text-white/70 text-xs">{member.handle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Footer */}
      <FooterSection />
    </div>
  );
};

export default Team;