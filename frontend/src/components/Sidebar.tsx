type Props = {
  section: string;
  setSection: (section: string) => void;
};

export default function Sidebar({
  section,
  setSection
}: Props) {

  return (

    <aside
      style={{
        width: "240px",
        background: "#1f2937",
        color: "white",
        padding: "1rem"
      }}
    >

      <h2>BDR 2026.1</h2>

      <button
        onClick={() => setSection("dashboard")}
      >
        Dashboard
      </button>

      <button
        onClick={() => setSection("gastos")}
      >
        Gastos
      </button>

      <button
        onClick={() => setSection("deputados")}
      >
        Deputados
      </button>

    </aside>
  );
}