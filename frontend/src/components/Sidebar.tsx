"use client";

import { useState } from "react";

interface SidebarProps {
  onTabChange?: (tab: string) => void;
}

const tabs = ["Deputados", "Perfil Parlamentar"];

export default function Sidebar({ onTabChange }: SidebarProps) {
  const [open, setOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  return (
    <aside className={`sidebar ${open ? "open" : "closed"}`}>
      <button
        className="toggle-button"
        onClick={() => setOpen(!open)}
      >
        {open ? "◀" : "▶"}
      </button>

      {open && (
        <>
          <h3>Glossário</h3>

          <ul>
            {tabs.map((tab) => (
              <li key={tab}>
                <button
                  className={`tab-button ${activeTab === tab ? "active" : ""}`}
                  onClick={() => handleTabClick(tab)}
                >
                  {tab}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </aside>
  );
}