'use client';

import React, { useState } from 'react';

import GerenciarOfertas from '@/components/admin/GerenciarOfertas';
import GerenciarRestaurantes from '@/components/admin/GerenciarRestaurantes';
import GerenciarBanners from '@/components/admin/GerenciarBanners';

// Tipagem das tarefas disponíveis
type TarefaAtiva = 'banners' | 'ofertas' | 'restaurantes';

export default function PainelAdministrativo() {
  // Estado que controla qual arquivo/tarefa está ativa na tela
  const [abaAtiva, setAbaAtiva] = useState<TarefaAtiva>('ofertas');

  // Função que renderiza o componente correto baseado na escolha do menu
  const renderizarConteudo = () => {
    switch (abaAtiva) {
      case 'banners':
        return <GerenciarBanners />;
      case 'restaurantes':
        return <GerenciarRestaurantes />;
      case 'ofertas':
      default:
        return <GerenciarOfertas />;
    }
  };

  return (
    <div className="w-full min-h-screen bg-zinc-50 flex flex-col md:flex-row">
      
      {/* 🧭 MENU LATERAL (SIDEBAR) */}
      <aside className="w-full md:w-64 bg-zinc-950 text-white md:min-h-screen p-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-900 select-none">
        <div>
          {/* Cabeçalho do Menu */}
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-sm font-black uppercase tracking-wider">
              Rede <span className="text-red-600">Costelão</span>
            </h2>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">
              Painel de Controle
            </p>
          </div>

          {/* Botões de Tarefas do Menu Lateral */}
          <nav className="space-y-1 flex flex-row md:flex-col justify-center gap-1 md:gap-0">
            <button
              onClick={() => setAbaAtiva('ofertas')}
              className={`flex-1 md:w-full text-center md:text-left px-3 py-2.5 rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-wide transition-all ${
                abaAtiva === 'ofertas'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              🛒 Ofertas
            </button>

            <button
              onClick={() => setAbaAtiva('banners')}
              className={`flex-1 md:w-full text-center md:text-left px-3 py-2.5 rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-wide transition-all ${
                abaAtiva === 'banners'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              📸 Banners
            </button>

            <button
              onClick={() => setAbaAtiva('restaurantes')}
              className={`flex-1 md:w-full text-center md:text-left px-3 py-2.5 rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-wide transition-all ${
                abaAtiva === 'restaurantes'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              🍽️ Lojas
            </button>
          </nav>
        </div>

        {/* Rodapé do Menu (Só aparece no PC devido ao layout) */}
        <div className="hidden md:block text-[9px] text-zinc-600 font-bold uppercase tracking-wider border-t border-zinc-900 pt-4 text-center">
          Acesso Restrito
        </div>
      </aside>

      {/* 💻 ÁREA DE CONTEÚDO DINÂMICO (Onde o arquivo selecionado brota) */}
      <main className="flex-1 p-4 sm:p-8 max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-zinc-900 uppercase tracking-tight">
              Ambiente Administrativo
            </h1>
            <p className="text-xs text-zinc-500">
              Gerencie o conteúdo visível para os clientes na internet
            </p>
          </div>
          <a 
            href="/" 
            className="text-[10px] bg-zinc-200 text-zinc-700 font-bold px-3 py-1.5 rounded-lg hover:bg-zinc-300 uppercase transition-all"
          >
            Sair do Painel
          </a>
        </div>

        {/* Aqui o Next.js injeta o arquivo isolado automaticamente de acordo com o clique */}
        {renderizarConteudo()}
      </main>

    </div>
  );
}