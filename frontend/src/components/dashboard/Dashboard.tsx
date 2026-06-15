import OverviewCards from "./OverviewCards";
import WordCloud from "./WordCloud";
import TemasTable from "./TemasTable";
import EscolaridadeTable from "./EscolaridadeTable";

export default function Dashboard() {

  return (

    <>
      <h1>Dashboard</h1>

      <OverviewCards />

      <WordCloud />

      <TemasTable />

      <EscolaridadeTable />

    </>
  );
}