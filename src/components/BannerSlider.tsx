'use client';

import React, { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { supabase } from '@/lib/supabase';

interface Banner {
  id: string | number;
  imagem_url: string;
  link_destino?: string;
}

export default function BannerSlider() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false })
  ]);

  useEffect(() => {
    async function carregarBanners() {
      try {
        const { data, error } = await supabase
          .from('banners_topo')
          // Buscamos apenas as colunas que com certeza existem no seu banco
          .select('id, imagem_url, link_destino');

        if (error) {
          console.error('Detalhes do erro do Supabase:', error.message, error.details, error.hint);
          throw error;
        }
        
        if (data) setBanners(data);
      } catch (err) {
        console.error('Erro geral na requisição:', err);
      } finally {
        setLoading(false);
      }
    }

    carregarBanners();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-[250px] sm:h-[400px] bg-zinc-900 flex items-center justify-center animate-pulse">
        <span className="text-sm font-medium text-zinc-500">Carregando ofertas...</span>
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="w-full h-[250px] sm:h-[450px] bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 flex flex-col items-center justify-center text-center px-4 border-b border-red-600/20">
        <h2 className="text-xl sm:text-3xl font-black text-white tracking-wider">
          BENVINDO À <span className="text-red-500">REDE COSTELÃO</span>
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-md">
          Fique ligado! Em breve as melhores ofertas de churrascaria e supermercado direto aqui no nosso encarte digital.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-zinc-950 overflow-hidden border-b border-red-600/30" ref={emblaRef}>
      <div className="flex">
        {banners.map((banner) => (
          <div className="flex-[0_0_100%] min-w-0 relative h-[220px] sm:h-[420px]" key={banner.id}>
            {banner.link_destino ? (
              <a href={banner.link_destino} target="_blank" rel="noopener noreferrer">
                <img
                  src={banner.imagem_url}
                  alt="Banner de Oferta Rede Costelão"
                  className="w-full h-full object-cover select-none"
                />
              </a>
            ) : (
              <img
                src={banner.imagem_url}
                alt="Banner de Oferta Rede Costelão"
                className="w-full h-full object-cover select-none"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}