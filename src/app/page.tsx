import Navbar from "@/components/Navbar"; // <-- 1. Importa a nova barra aqui
import BannerSlider from "@/components/BannerSlider";
import OfertasAbas from "@/components/OfertasAbas";
import GaleriaCostelao from "@/components/GaleriaCostelao";

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      {/* 2. Barra de Navegação Unificada no Topo */}
      <Navbar />
      
      {/* Slider de Banners do Topo */}
      <BannerSlider />
      
      {/* Miolo Dinâmico do Site */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 flex-grow w-full space-y-12">
        
        {/* Seção de Ofertas */}
        <section id="ofertas" className="scroll-mt-20">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black text-black tracking-tight uppercase border-b-4 border-red-600 inline-block pb-1">
              Confira Nossas Ofertas
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Os melhores produtos com preços imbatíveis na Rede Costelão
            </p>
          </div>

          <OfertasAbas />
        </section>

        {/* Seção dos Restaurantes */}
        <section id="galeria" className="scroll-mt-20 border-t border-zinc-200 pt-8">
          <GaleriaCostelao />
        </section>

      </div>
    </div>
  );
}