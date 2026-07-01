import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import CorePrinciples from "../components/CorePrinciples";
import WorkGrid from "../components/WorkGrid";
import CtaStatusRow from "../components/CtaStatusRow";
import LogoBar from "../components/LogoBar";
import SiteFooter from "../components/SiteFooter";
import StatusBar from "../components/StatusBar";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-bg text-ink">
      <Navbar />
      <HeroSection />
      <CorePrinciples />
      <WorkGrid />
      <CtaStatusRow />
      <LogoBar />
      <SiteFooter />
      <StatusBar />
    </main>
  );
}
