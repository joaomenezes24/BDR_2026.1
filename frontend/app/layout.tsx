import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Proeza: de Olho na Câmara",
  description: "Plataforma de análise de dados da Câmara dos Deputados",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}
