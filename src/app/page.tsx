import HomeContent from "@/components/home-content";
import { InspectorPanel } from "@/components/layout/InspectorPanel";
import { Sidebar } from "@/components/layout/Sidebar";

export default function Home() {
  return (
      <main className="container">
        {/* <HeroHeader /> */}
        <Sidebar activeHref="/sessions/session-1-locators" />
        <HomeContent />
        <InspectorPanel hint={null} />
      </main>
    );
}


