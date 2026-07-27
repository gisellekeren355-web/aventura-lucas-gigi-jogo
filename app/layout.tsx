import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "A Aventura de Lucas & Gigi",
  description: "Um RPG romântico interativo feito para Lucas e Gigi."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
