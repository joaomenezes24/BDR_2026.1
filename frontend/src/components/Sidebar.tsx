"use client";

import { useState } from "react";

export default function Sidebar() {
  const [open, setOpen] = useState(true);

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
            <li>Deputados</li>
          </ul>
        </>
      )}
    </aside>
  );
}