'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // 🎯 Conexão centralizada única!

interface Banner {
  id: number;
  imagem_url: string;
}

export default function GerenciarBanners() {
  const [titulo, setTitulo] = useState('');
  const [imagem, setImagem] = useState<File | null>(null);
  const [carregando, setCarregando] = useState(false);
  
  // Estados para listagem
  const [banners, setBanners] = useState<Banner[]>([]);
  const [buscando, setBuscando] = useState(true);

  // 🎯 Função corrigida usando o cliente global correto
  const buscarBanners = async () => {
    try {
      const { data, error } = await supabase
        .from('banners_topo')
        .select('*')
        .order('id', { ascending: false });

      if (!error && data) setBanners(data);
    } catch (err) {
      console.error(err);
    } finally {
      setBuscando(false);
    }
  };

  useEffect(() => {
    buscarBanners();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagem) return alert('Selecione uma imagem para o banner!');

    setCarregando(true);
    try {
      const formData = new FormData();
      formData.append('titulo', titulo);
      formData.append('imagem', imagem);

      const response = await fetch('/api/admin/banners', { method: 'POST', body: formData });
      const resultado = await response.json();

      if (!response.ok) throw new Error(resultado.error);

      alert('🎉 Banner publicado com sucesso!');
      setTitulo('');
      setImagem(null);
      buscarBanners(); 

    } catch (error: any) {
      alert(`❌ Erro: ${error.message}`);
    } finally {
      setCarregando(false);
    }
  };

  // 🗑️ Função de exclusão do banner
  const lidarComExclusao = async (id: number, imagemUrl: string) => {
    if (!confirm('Deseja realmente apagar este banner do topo do site?')) return;

    try {
      const response = await fetch(`/api/admin/banners?id=${id}&imagemUrl=${encodeURIComponent(imagemUrl)}`, {
        method: 'DELETE',
      });

      const resultado = await response.json();
      if (!response.ok) throw new Error(resultado.error);

      alert('🗑️ Banner removido com sucesso!');
      
      // 🔥 Remove visualmente na hora
      setBanners((antigos) => antigos.filter(ban => ban.id !== id));
      
      buscarBanners(); 
    } catch (error: any) {
      alert(`❌ Erro ao deletar: ${error.message}`);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      {/* FORMULÁRIO */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-zinc-200 shadow-sm">
        <div className="border-b border-zinc-100 pb-4 mb-6">
          <h3 className="text-lg font-black text-zinc-950 uppercase">📸 Adicionar Banner do Topo</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-black text-zinc-700 uppercase mb-1">Imagem do Banner</label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-zinc-200 border-dashed rounded-xl cursor-pointer bg-zinc-50 hover:bg-zinc-100/50">
              <p className="text-[11px] text-zinc-500 font-bold uppercase">{imagem ? `✅ ${imagem.name}` : '📸 Selecionar imagem do Banner'}</p>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && setImagem(e.target.files[0])} />
            </label>
          </div>

          <button type="submit" disabled={carregando} className={`w-full py-3 rounded-xl text-xs font-black uppercase text-white ${carregando ? 'bg-zinc-400' : 'bg-red-600 hover:bg-red-500'}`}>
            {carregando ? 'Enviando...' : '🚀 Publicar Banner'}
          </button>
        </form>
      </div>

      {/* 📋 MINIATURAS DOS BANNERS ATIVOS */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-zinc-200 shadow-sm">
        <h3 className="text-sm font-black text-zinc-950 uppercase mb-4 border-b border-zinc-100 pb-2">Banners em Exibição</h3>
        
        {buscando ? (
          <p className="text-xs text-zinc-400">Buscando banners...</p>
        ) : banners.length === 0 ? (
          <p className="text-xs text-zinc-400">Nenhum banner ativo no carrossel.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-80 overflow-y-auto pr-1">
            {banners.map((ban) => (
              <div key={ban.id} className="relative group border border-zinc-100 rounded-xl overflow-hidden bg-zinc-50">
                <img src={ban.imagem_url} alt="Banner" className="w-full h-24 object-cover" />
                <div className="absolute inset-0 bg-zinc-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                  <button
                    onClick={() => lidarComExclusao(ban.id, ban.imagem_url)}
                    className="bg-white text-zinc-900 font-black text-xs px-3 py-1.5 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-md"
                  >
                    🗑️ Remover Banner
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}