import Header from "@/src/components/Header";
import Sidebar from "@/src/components/Sidebar";
import Footer from "@/src/components/Footer";

export default function Home() {
  return (
    <>
      <Header />

      <div style={{ display: "flex" }}>
        <Sidebar />

        <main style={{ flex: 1, padding: "2rem" }}>
          {/* Analytics aqui */}
        </main>
      </div>

      <Footer />
    </>
  );
}