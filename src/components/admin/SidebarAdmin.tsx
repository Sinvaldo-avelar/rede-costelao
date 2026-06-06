'use client';

import React from 'react';

interface SidebarAdminProps {
  abaAtiva: string;
  setAbaAtiva: (aba: string) => void;
  onLogout: () => void;
}

export default function SidebarAdmin({ abaAtiva, setAbaAtiva, onLogout }: SidebarAdminProps) {
  const menus = [
    { id: 'ofertas', nome: '🛒 Ofertas Loja', emoji: '🛒' },
    { id: 'banners', nome: '📸 Banners Topo', emoji: '📸' },
    { id: 'restaurantes', nome: '📦 Logística Lojas', emoji: '📦' }, // Ajustei o nome para diferenciar!
    { id: 'encarte', nome: '📄 Encarte PDF', emoji: '📄' },
    { id: 'churrascaria_site', nome: '🥩 Site Churrascaria', emoji: '🥩' }, // 🎯 ADICIONADO NA LISTA
  ];

  return (
    <aside className="w-full md:w-64 bg-zinc-950 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col text-white">
      {/* Topo da Sidebar */}
      <div className="p-4 md:p-6 border-b border-zinc-800 flex items-center justify-between md:block">
        <div>
          <h2 className="text-sm font-black uppercase tracking-wider text-white">Rede Costelão</h2>
          <p className="text-[10px] font-bold uppercase text-red-500 tracking-widest mt-0.5">Painel Admin</p>
        </div>
        <div className="text-xs bg-zinc-900 border border-zinc-800 px-2 py-1 rounded-lg md:mt-3 font-bold text-zinc-400">
          v1.2.0 ⚡
        </div>
      </div>

      {/* Links de Navegação */}
      <nav className="flex-1 p-3 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible scrollbar-none">
        <div className="flex flex-row md:flex-col gap-1 flex-1">
          {menus.map((item) => {
            const ativo = abaAtiva === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setAbaAtiva(item.id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all w-full text-left ${
                  ativo 
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/10' 
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                <span>{item.emoji}</span>
                <span className="md:inline">{item.nome}</span>
              </button>
            );
          })}
        </div>

        {/* 🚪 BOTÃO DE SAIR */}
        <button
          onClick={onLogout}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-zinc-500 hover:bg-red-950/30 hover:text-red-500 transition-all mt-auto text-left whitespace-nowrap"
        >
          <span>🚪</span>
          <span>Sair do Painel</span>
        </button>
      </nav>
    </aside>
  );
}