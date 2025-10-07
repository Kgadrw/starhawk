import { HomeNavbar } from "@/components/layout/HomeNavbar";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CTASection } from "@/components/home/CTASection";
import { FooterSection } from "@/components/home/FooterSection";

const Index = () => {
  return <HomePage />;
};

// Home Page Component
function HomePage() {
    return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 relative">
      {/* Navigation */}
      <HomeNavbar />
      
      {/* Hero Section - Full Screen */}
      <HeroSection />

      {/* Scroll Stack Sections */}
      <div className="relative z-10">
        <FeaturesSection />
        <TestimonialsSection />
        <CTASection />
        <FooterSection />
                      </div>
          </div>
        );
}

export default Index;
