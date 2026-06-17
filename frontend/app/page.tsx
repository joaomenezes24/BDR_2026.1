"use client";

import { useState } from "react";

import Header from "@/src/components/Header";
import Sidebar from "@/src/components/Sidebar";
import Footer from "@/src/components/Footer";

import Dashboard from "@/src/components/dashboard/Dashboard";
import Gastos from "@/src/components/gastos/GastosSection";
import { PerfilParlamentar } from "@/src/tabs";
import Deputados from "@/src/components/deputados/DeputadosSection";


const tabComponents: Record<
  string,
  React.ComponentType
> = {

  gastos: Gastos,

  deputados: Deputados,

  "perfil-parlamentar":
    PerfilParlamentar,
};

export default function Home() {

  const [section, setSection] =
    useState("dashboard");

  const [isExpanded,
    setIsExpanded] =
    useState(false);

  const [
    isSidebarCollapsed,
    setIsSidebarCollapsed
  ] = useState(false);

  return (

    <div className="page-container">

      <Header
        isExpanded={isExpanded}
        onToggle={() =>
          setIsExpanded(prev => !prev)
        }
      />

      <div className="main-layout">

        <Sidebar
          section={section}
          setSection={setSection}
          isCollapsed={
            isSidebarCollapsed
          }
          onToggle={() =>
            setIsSidebarCollapsed(
              prev => !prev
            )
          }
        />

        <main className="content-area">

          {section === "dashboard" &&
            <Dashboard />
          }

          {section !== "dashboard" &&
            tabComponents[section] &&
            (() => {

              const Component =
                tabComponents[
                  section
                ];

              return <Component />;

            })()
          }

        </main>

      </div>

      <Footer />

    </div>
  );
}