'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface ItemGaleria {
  id: string | number;
  restaurante: 'cobraice' | 'sayonara' | 'gourmet';
  titulo: string;
  imagem_url: string;
}

export default function GaleriaCostelao() {
  // Define o Cobraice ativo por padrão ao entrar na página
  const [restauranteAtivo, setRestauranteAtivo] = useState<'cobraice' | 'sayonara' | 'gourmet'>('cobraice');
  const [fotos, setFotos] = useState<ItemGaleria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarGaleria() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('galeria')
          .select('id, restaurante, titulo, imagem_url')
          .eq('restaurante', restauranteAtivo) // Busca apenas as fotos do restaurante clicado
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) setFotos(data);
      } catch (err) {
        console.error('Erro ao buscar galeria dos restaurantes:', err);
      } finally {
        setLoading(false);
      }
    }

    carregarGaleria();
  }, [restauranteAtivo]);

  return (
    <div className="w-full mt-4 mb-8">
      {/* Título da Seção */}
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-black text-zinc-900 uppercase tracking-tight">
          🍽️ Conheça Nossos Restaurantes
        </h2>
        <p className="text-xs text-zinc-500 mt-1">
          Clique no restaurante para ver o que tem de melhor esperando por você
        </p>
      </div>

      {/* Botões dos 3 Restaurantes Oficiais - Perfeitos no celular */}
      <div className="grid grid-cols-3 gap-2 max-w-3xl mx-auto mb-6">
        <button
          onClick={() => setRestauranteAtivo('cobraice')}
          className={`py-3 px-1 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all duration-200 text-center shadow-sm ${
            restauranteAtivo === 'cobraice'
              ? 'bg-red-600 text-white shadow-md scale-105'
              : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
          }`}
        >
          Cobraice
        </button>
        <button
          onClick={() => setRestauranteAtivo('sayonara')}
          className={`py-3 px-1 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all duration-200 text-center shadow-sm ${
            restauranteAtivo === 'sayonara'
              ? 'bg-red-600 text-white shadow-md scale-105'
              : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
          }`}
        >
          Sayonara
        </button>
        <button
          onClick={() => setRestauranteAtivo('gourmet')}
          className={`py-3 px-1 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all duration-200 text-center shadow-sm ${
            restauranteAtivo === 'gourmet'
              ? 'bg-red-600 text-white shadow-md scale-105'
              : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
          }`}
        >
          Gourmet
        </button>
      </div>

      {/* Grid de Exibição das Fotos */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 animate-pulse">
          {[1, 2].map((n) => (
            <div key={n} className="bg-zinc-200 rounded-xl h-40 w-full" />
          ))}
        </div>
      ) : fotos.length === 0 ? (
        <div className="text-center py-8 bg-white border border-zinc-200 rounded-xl text-zinc-400 text-xs font-medium">
          Nenhuma foto cadastrada para este restaurante ainda.
        </div>
      ) : (
        /* Painel de Fotos Premium */
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
          {fotos.map((item) => (
            <div 
              key={item.id} 
              className="group relative h-40 sm:h-48 w-full overflow-hidden rounded-xl bg-zinc-100 shadow-sm border border-zinc-200"
            >
              <img 
                src={item.imagem_url} 
                alt={item.titulo || 'Foto Restaurante'} 
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2.5">
                <span className="text-white text-[10px] sm:text-xs font-bold uppercase tracking-wide line-clamp-1">
                  {item.titulo}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}