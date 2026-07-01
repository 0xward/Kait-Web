"use client";
import Navbar from "../../components/Navbar";
import SiteFooter from "../../components/SiteFooter";
import { WalletGate, DeploymentBanner } from "../../components/dashboard/StatusBanners";
import StatRow from "../../components/dashboard/StatRow";
import RegisterApiForm from "../../components/dashboard/RegisterApiForm";
import WithdrawPanel from "../../components/dashboard/WithdrawPanel";
import MyApisTable from "../../components/dashboard/MyApisTable";
import BrowseApis from "../../components/dashboard/BrowseApis";
import { useGateway } from "../../lib/useGateway";

export default function DashboardPage() {
  const { usdcAddress } = useGateway();

  return (
    <main className="relative min-h-screen bg-bg text-ink">
      <Navbar />
      <DeploymentBanner />

      <WalletGate>
        <section className="b-line-t">
          <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-8 md:py-12">
            <p className="font-mono text-xs tracking-widest2 text-muted mb-2">DASHBOARD</p>
            <h1 className="font-display font-black uppercase text-3xl md:text-4xl mb-8">
              Gateway Console
            </h1>

            <StatRow />

            <div className="grid md:grid-cols-2 gap-px md:gap-4 mt-4 md:mt-6">
              <RegisterApiForm />
              <WithdrawPanel usdcAddress={usdcAddress as `0x${string}`} />
            </div>

            <div className="mt-4 md:mt-6">
              <MyApisTable usdcAddress={usdcAddress as `0x${string}`} />
            </div>

            <div className="mt-4 md:mt-6">
              <BrowseApis usdcAddress={usdcAddress as `0x${string}`} />
            </div>
          </div>
        </section>
      </WalletGate>

      <SiteFooter />
    </main>
  );
}
