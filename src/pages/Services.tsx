import { HomeNavbar } from "@/components/layout/HomeNavbar";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import CustomScrollbar from "@/components/ui/CustomScrollbar";

export default function Services() {
  return (
    <CustomScrollbar>
      <div className="bg-white relative min-h-screen">
        <HomeNavbar />
        <FeaturesSection />
      </div>
    </CustomScrollbar>
  );
}
