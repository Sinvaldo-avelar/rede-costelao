'use client';

import React, { useState, useEffect } from 'react';
import SidebarAdmin from '@/components/admin/SidebarAdmin';
import GerenciarOfertas from '@/components/admin/GerenciarOfertas';
import GerenciarBanners from '@/components/admin/GerenciarBanners';
import GerenciarRestaurantes from '@/components/admin/GerenciarRestaurantes';
import GerenciarEncarte from '@/components/admin/GerenciarEncarte';
import GerenciarChurrascaria from '@/components/admin/GerenciarChurrascaria'; // 🎯 IMPORTADO O NOVO COMPONENTE

export default function AdminPage() {
  const [abaAtiva, setAbaAtiva] = useState('ofertas');
  const [autenticado, setAutenticado] = useState(false);
  const [senhaDigitada, setSenhaDigitada] = useState('');
  const [carregandoSeguranca, setCarregandoSeguranca] = useState(true);

  const SENHA_ADMIN_MASTER = 'costelao2026'; 

  useEffect(() => {
    const sessaoAtiva = localStorage.getItem('rede_costelao_admin_autenticado');
    if (sessaoAtiva === 'true') {
      setAutenticado(true);
    }
    setCarregandoSeguranca(false);
  }, []);

  const lidarComLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (senhaDigitada === SENHA_ADMIN_MASTER) {
      localStorage.setItem('rede_costelao_admin_autenticado', 'true');
      setAutenticado(true);
      setSenhaDigitada('');
    } else {
      alert('❌ Senha Administrativa Incorreta!');
      setSenhaDigitada('');
    }
  };

  const lidarComLogout = () => {
    if (confirm('Deseja realmente sair do painel administrativo?')) {
      localStorage.removeItem('rede_costelao_admin_autenticado');
      setAutenticado(false);
    }
  };

  if (carregandoSeguranca) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-xs font-black uppercase text-zinc-400 tracking-widest animate-pulse">🔒 Verificando credenciais...</p>
      </div>
    );
  }

  if (!autenticado) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 selection:bg-red-600 selection:text-white">
        <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-red-600/10 border border-red-600/20 rounded-2xl flex items-center justify-center mx-auto text-xl">
              🔒
            </div>
            <h2 className="text-sm font-black text-white uppercase tracking-wider">Acesso Restrito</h2>
            <p className="text-[11px] text-zinc-400 font-bold uppercase">Painel Administrativo Rede Costelão</p>
          </div>

          <form onSubmit={lidarComLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-zinc-400 uppercase mb-1.5 tracking-wider">Digite a Senha Master</label>
              <input
                type="password"
                required
                value={senhaDigitada}
                onChange={(e) => setSenhaDigitada(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white text-center focus:outline-none focus:border-red-600 font-mono tracking-widest transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-red-600/10 active:scale-[0.98]"
            >
              🔓 Entrar no Painel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col md:flex-row antialiased select-none">
      <SidebarAdmin abaAtiva={abaAtiva} setAbaAtiva={setAbaAtiva} onLogout={lidarComLogout} />

      <main className="flex-1 p-4 sm:p-8 md:p-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {abaAtiva === 'ofertas' && <GerenciarOfertas />}
          {abaAtiva === 'banners' && <GerenciarBanners />}
          {abaAtiva === 'restaurantes' && <GerenciarRestaurantes />}
          {abaAtiva === 'encarte' && <GerenciarEncarte />}
          {abaAtiva === 'churrascaria_site' && <GerenciarChurrascaria />} {/* 🎯 CONECTADO AQUI */}
        </div>
      </main>
    </div>
  );
}