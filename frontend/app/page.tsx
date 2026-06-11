"use client";

import { useState } from "react";
import Header from "@/src/components/Header";
import Sidebar from "@/src/components/Sidebar";
import Footer from "@/src/components/Footer";
import { Deputados, PerfilParlamentar } from "@/src/components/tabs";

const tabComponents: Record<string, React.ComponentType> = {
  "Deputados": Deputados,
  "Perfil Parlamentar": PerfilParlamentar,
};

export default function Home() {
  const [activeTab, setActiveTab] = useState("Deputados");
  const [headerExpanded, setHeaderExpanded] = useState(true);
  const TabComponent = tabComponents[activeTab];

  return (
    <>
      <Header isExpanded={headerExpanded} onToggle={() => setHeaderExpanded(!headerExpanded)} />

      <div style={{ display: "flex" }}>
        <Sidebar onTabChange={setActiveTab} />

        <main style={{ flex: 1, padding: "2rem" }}>
          {TabComponent && <TabComponent />}
        </main>
      </div>

      <Footer />
    </>
  );
}