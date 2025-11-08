import { HomeNavbar } from "@/components/layout/HomeNavbar";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import PartnersSection from "@/components/home/PartnersSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CTASection } from "@/components/home/CTASection";
import { FAQSection } from "@/components/home/FAQSection";
import { FooterSection } from "@/components/home/FooterSection";
import CustomScrollbar from "@/components/ui/CustomScrollbar";

const Index = () => {
  return <HomePage />;
};

// Home Page Component
function HomePage() {
    return (
    <CustomScrollbar>
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 relative min-h-screen">
        {/* Navigation */}
        <HomeNavbar />
        
        {/* Hero Section - Full Screen */}
        <HeroSection />

        {/* Scroll Stack Sections */}
        <div className="relative z-10">
          <FeaturesSection />
          <PartnersSection />
          <TestimonialsSection />
          <CTASection />
          <FAQSection />
          <FooterSection />
              </div>
            </div>
    </CustomScrollbar>
        );
}

export default Index;
