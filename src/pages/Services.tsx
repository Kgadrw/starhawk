import { HomeNavbar } from "@/components/layout/HomeNavbar";
import { DashboardSection } from "@/components/home/DashboardSection";
import { FooterSection } from "@/components/home/FooterSection";
import CustomScrollbar from "@/components/ui/CustomScrollbar";

export default function Services() {
  return (
    <CustomScrollbar>
      <div className="bg-white relative min-h-screen">
        <HomeNavbar />
        <div className="relative z-10">
          <DashboardSection />
          <FooterSection />
        </div>
      </div>
    </CustomScrollbar>
  );
}
