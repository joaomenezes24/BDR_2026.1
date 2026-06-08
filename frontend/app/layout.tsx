import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dogma",
  description: "Deputados Ordenados por Gastos",
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
