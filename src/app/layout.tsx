import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rede Costelão | Supermercados e Churrascaria",
  description: "As melhores ofertas do dia e da semana na Rede Costelão. Venha conhecer nossas lojas e nossa churrascaria!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`${inter.className} antialiased bg-gray-50 flex flex-col min-h-screen`}>
        {/* Cabeçalho Fixo */}
        <Header />
        
        {/* O conteúdo dinâmico das páginas entra aqui dentro do main */}
        <main className="flex-grow">
          {children}
        </main>
        
        {/* Rodapé Fixo */}
        <Footer />
      </body>
    </html>
  );
}