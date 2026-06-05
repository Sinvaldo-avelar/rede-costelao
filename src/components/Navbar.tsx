'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  // Controla a abertura da gaveta lateral
  const [showSidebar, setShowSidebar] = useState(false);

  // Links da sua Área Externa Privada
  const links = [
    { nome: '🛒 LojaS', url: 'https://controle-logistica-v2.vercel.app/loja' },
    { nome: '📦 Estoque', url: 'https://controle-logistica-v2.vercel.app/login' },
    { nome: '💼 Administrativo', url: 'https://controle-logistica-v2.vercel.app/administrativo' },
  ];

  return (
    <>
      {/* Barra Superior Principal */}
      <nav className="w-full bg-zinc-950 border-b border-zinc-900 sticky top-0 z-40 shadow-md select-none">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          
          {/* Clique secreto na palavra Costelão */}
          <div 
            onClick={() => setShowSidebar(true)}
            className="cursor-pointer active:opacity-80 transition-opacity"
          >
            <span className="text-white font-black text-sm uppercase tracking-wider">
              Rede <span className="text-red-600 hover:text-red-500 transition-colors">Costelão</span>
            </span>
          </div>

          <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest pointer-events-none">
            Oficial
          </div>
        </div>
      </nav>

      {/* 🖤 FUNDO ESCURO SEMI-TRANSPARENTE (Aparece atrás da gaveta) */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300"
          onClick={() => setShowSidebar(false)} // Fecha se clicar fora da gaveta
        />
      )}

      {/* 🚪 GAVETA LATERAL DISCRETA (Vem da direita para a esquerda) */}
      <div
        className={`fixed top-0 right-0 h-full w-[260px] bg-zinc-950 border-l border-zinc-800 z-50 p-5 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col justify-between ${
          showSidebar ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div>
          {/* Cabeçalho da Gaveta */}
          <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-6">
            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">
              🔐 SISTEMAS INTERNOS
            </span>
            <button 
              onClick={() => setShowSidebar(false)}
              className="text-zinc-500 hover:text-white text-xs font-bold bg-zinc-900 border border-zinc-800 px-2 py-1 rounded-lg active:scale-95"
            >
              Fechar
            </button>
          </div>

          {/* Links em formato de lista vertical limpa */}
          <div className="space-y-2">
            {links.map((link) => {
              const isActive = pathname === link.url;

              return (
                <a
                  key={link.nome}
                  href={link.url}
                  target={link.url.startsWith('http') ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  onClick={() => setShowSidebar(false)} // Fecha ao clicar
                  className={`block w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wide transition-all ${
                    isActive
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-zinc-900/50 text-zinc-400 hover:text-white border border-zinc-900 hover:border-zinc-800 active:bg-zinc-900'
                  }`}
                >
                  {link.nome}
                </a>
              );
            })}
          </div>
        </div>

        {/* Rodapé da Gaveta */}
        <div className="text-center text-[10px] text-zinc-600 font-bold uppercase tracking-wider border-t border-zinc-900 pt-4">
          Rede Costelão © 2026
        </div>
      </div>
    </>
  );
}