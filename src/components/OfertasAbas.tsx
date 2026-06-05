'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Produto {
  id: string | number;
  nome: string;
  preco_normal: number;
  preco_promocao: number;
  imagem_url: string;
  tipo_oferta: 'dia' | 'semana';
}

export default function OfertasAbas() {
  const [abaAtiva, setAbaAtiva] = useState<'dia' | 'semana'>('dia');
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarProdutos() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('produtos')
          .select('id, nome, preco_normal, preco_promocao, imagem_url, tipo_oferta')
          .eq('tipo_oferta', abaAtiva);

        if (error) throw error;
        if (data) setProdutos(data);
      } catch (err) {
        console.error('Erro ao buscar produtos:', err);
      } finally {
        setLoading(false);
      }
    }

    carregarProdutos();
  }, [abaAtiva]);

  return (
    <div className="w-full mt-2">
      {/* Botões de Alternar Abas */}
      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => setAbaAtiva('dia')}
          className={`flex-1 max-w-[180px] py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-200 ${
            abaAtiva === 'dia' ? 'bg-red-600 text-white shadow-md scale-105' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
          }`}
        >
          Ofertas do Dia
        </button>
        <button
          onClick={() => setAbaAtiva('semana')}
          className={`flex-1 max-w-[180px] py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-200 ${
            abaAtiva === 'semana' ? 'bg-red-600 text-white shadow-md scale-105' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
          }`}
        >
          Ofertas da Semana
        </button>
      </div>

      {/* Carregamento Pulse */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 animate-pulse">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-zinc-200 border border-zinc-300 rounded-xl h-64 w-full" />
          ))}
        </div>
      ) : produtos.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-zinc-200 text-zinc-400 text-sm font-medium">
          Nenhuma oferta cadastrada para este período no momento.
        </div>
      ) : (
        /* Grade de Produtos Mobile-First */
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {produtos.map((produto) => (
            <div key={produto.id} className="bg-white border border-zinc-200 rounded-xl p-3 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden">
              <div className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider z-10">
                Oferta
              </div>

              <div className="w-full h-28 sm:h-36 flex items-center justify-center overflow-hidden rounded-lg bg-zinc-50 mb-2 select-none">
                <img src={produto.imagem_url} alt={produto.nome} className="max-h-full max-w-full object-contain p-1" />
              </div>

              <div className="flex flex-col flex-grow justify-between">
                <h3 className="text-zinc-900 font-bold text-xs sm:text-sm line-clamp-2 h-9 leading-tight">
                  {produto.nome}
                </h3>
                <div className="mt-2 bg-zinc-50 p-2 rounded-lg border border-zinc-100">
                  <span className="text-zinc-400 text-[10px] line-through block leading-none">
                    De: R$ {produto.preco_normal.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-red-600 text-sm sm:text-lg font-black tracking-tight block mt-0.5">
                    <span className="text-[10px] font-bold mr-0.5">Por: R$</span>
                    {produto.preco_promocao.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              <a href={`https://wa.me/seu-numero?text=Olá,%20gostaria%20de%20pedir%20o%20produto:%20${encodeURIComponent(produto.nome)}`} target="_blank" rel="noopener noreferrer" className="mt-3 w-full bg-zinc-900 hover:bg-red-600 text-white text-center py-2 rounded-lg font-bold text-[11px] uppercase tracking-wider transition-colors block">
                Pedir no Whats
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}