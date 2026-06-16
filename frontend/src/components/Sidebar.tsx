import { ChevronLeft, ChevronRight, DollarSign, House, User, LocateFixed, Megaphone } from 'lucide-react';

type Props = {
  section: string;
  setSection: (section: string) => void;
  isCollapsed: boolean;
  onToggle: () => void;
};

export default function Sidebar({
  section,
  setSection,
  isCollapsed,
  onToggle
}: Props) {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: House },
    { id: "gastos", label: "Gastos", icon: DollarSign },
    { id: "deputados", label: "Deputados", icon: User },
    { id: "perfil-parlamentar", label: "Perfil Parlamentar", icon: LocateFixed },
    { id: "proposicoes", label: "Proposições", icon: Megaphone },
  ];

  return (

    <aside
      className={`sidebar ${isCollapsed ? "closed" : "open"}`}
    >

      <button
        type="button"
        className="toggle-button"
        onClick={onToggle}
        aria-label={isCollapsed ? "Expandir sidebar" : "Recolher sidebar"}
        title={isCollapsed ? "Expandir sidebar" : "Recolher sidebar"}
      >
        <span className="toggle-icon" aria-hidden="true">
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </span>
      </button>

      <h3>Visualizações</h3>

      <ul>
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = section === id;

          return (
            <li key={id}>
              <button
                type="button"
                className={`tab-button ${isActive ? "active" : ""}`}
                onClick={() => setSection(id)}
                aria-label={label}
                title={label}
              >
                <span className="tab-icon" aria-hidden="true">
                  <Icon size={20} />
                </span>
                {!isCollapsed && <span className="tab-label">{label}</span>}
              </button>
            </li>
          );
        })}
      </ul>

    </aside>
  );
}