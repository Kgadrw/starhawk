import { HomeNavbar } from "@/components/layout/HomeNavbar";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { FAQSection } from "@/components/home/FAQSection";
import { FooterSection } from "@/components/home/FooterSection";
import CustomScrollbar from "@/components/ui/CustomScrollbar";

const Index = () => {
  return (
    <CustomScrollbar>
      <div className="bg-white relative min-h-screen">
        <HomeNavbar />
        <HeroSection />
        <div className="relative z-10">
          <FeaturesSection />
          <FAQSection />
          <FooterSection />
        </div>
      </div>
    </CustomScrollbar>
  );
};

export default Index;
