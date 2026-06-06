'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // 🎯 Conexão centralizada única!

interface ItemGaleria {
  id: number;
  restaurante: string;
  titulo: string;
  imagem_url: string;
}

export default function GerenciarRestaurantes() {
  const [restaurante, setRestaurante] = useState('cobraice');
  const [titulo, setTitulo] = useState('');
  const [imagem, setImagem] = useState<File | null>(null);
  const [carregando, setCarregando] = useState(false);

  // Estados para buscar a lista da galeria
  const [itensGaleria, setItensGaleria] = useState<ItemGaleria[]>([]);
  const [buscando, setBuscando] = useState(true);

  // Função limpa para buscar os dados sem duplicar clientes
  const buscarGaleria = async () => {
    try {
      const { data, error } = await supabase
        .from('galeria')
        .select('*')
        .order('id', { ascending: false });

      if (!error && data) {
        setItensGaleria(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBuscando(false);
    }
  };

  useEffect(() => {
    buscarGaleria();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagem) return alert('Por favor, selecione uma foto!');

    setCarregando(true);

    try {
      const formData = new FormData();
      formData.append('restaurante', restaurante);
      formData.append('titulo', titulo);
      formData.append('imagem', imagem);

      const response = await fetch('/api/admin/restaurantes', {
        method: 'POST',
        body: formData,
      });

      const resultado = await response.json();

      if (!response.ok) throw new Error(resultado.error);

      alert('🎉 Foto publicada na galeria com sucesso!');
      setTitulo('');
      setImagem(null);
      buscarGaleria(); 

    } catch (error: any) {
      alert(`❌ Erro: ${error.message}`);
    } finally {
      setCarregando(false);
    }
  };

  // 🗑️ Função para deletar prato/ambiente da galeria
  const lidarComExclusao = async (id: number, imagemUrl: string, tituloFoto: string) => {
    if (!confirm(`Deseja realmente excluir a foto "${tituloFoto}"?`)) return;

    try {
      const response = await fetch(`/api/admin/restaurantes?id=${id}&imagemUrl=${encodeURIComponent(imagemUrl)}`, {
        method: 'DELETE'
      });

      const resultado = await response.json();
      if (!response.ok) throw new Error(resultado.error);

      alert('🗑️ Foto removida com sucesso!');
      
      // 🔥 Força a remoção visual imediata no estado
      setItensGaleria((antigos) => antigos.filter(item => item.id !== id));
      
      buscarGaleria(); 
    } catch (error: any) {
      alert(`❌ Erro ao deletar: ${error.message}`);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      {/* FORMULÁRIO */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-zinc-200 shadow-sm">
        <div className="border-b border-zinc-100 pb-4 mb-6">
          <h3 className="text-lg font-black text-zinc-950 uppercase">🍽️ Cadastrar Fotos dos Restaurantes</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-black text-zinc-700 uppercase mb-1">Selecione o Restaurante / Destino</label>
            <select 
              value={restaurante} 
              onChange={(e) => setRestaurante(e.target.value)} // 🎯 Amarrado certinho!
              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-950 focus:outline-none focus:border-red-600"
            >
              <option value="cobraice">Restaurante Cobraice 🐍</option>
              <option value="sayonara">Restaurante Sayonara 🌸</option>
              <option value="gourmet">Restaurante Gourmet ✨</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-black text-zinc-700 uppercase mb-1">Título ou Legenda da Foto</label>
            <input 
              type="text" 
              required 
              value={titulo} 
              onChange={(e) => setTitulo(e.target.value)} // 🎯 Amarrado certinho para sumir o aviso!
              placeholder="Ex: Pratos Executivos Selecionados" 
              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-950 focus:outline-none focus:border-red-600 transition-colors" 
            />
          </div>

          <div>
            <label className="block text-[11px] font-black text-zinc-700 uppercase mb-1">Foto do Ambiente ou Prato</label>
            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-zinc-200 border-dashed rounded-xl cursor-pointer bg-zinc-50 hover:bg-zinc-100/50">
              <p className="text-[11px] text-zinc-500 font-bold uppercase">{imagem ? `✅ ${imagem.name}` : '📸 Selecionar foto'}</p>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && setImagem(e.target.files[0])} />
            </label>
          </div>

          <button type="submit" disabled={carregando} className={`w-full py-3 rounded-xl text-xs font-black uppercase text-white ${carregando ? 'bg-zinc-400' : 'bg-red-600 hover:bg-red-500'}`}>
            {carregando ? 'Publicando...' : '🚀 Enviar para a Galeria'}
          </button>
        </form>
      </div>

      {/* 📋 LISTAGEM COMPLETA DA GALERIA */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-zinc-200 shadow-sm">
        <h3 className="text-sm font-black text-zinc-950 uppercase mb-4 border-b border-zinc-100 pb-2">Fotos Ativas nas Abas</h3>

        {buscando ? (
          <p className="text-xs text-zinc-400">Carregando galeria...</p>
        ) : itensGaleria.length === 0 ? (
          <p className="text-xs text-zinc-400">Nenhuma foto cadastrada ainda.</p>
        ) : (
          <div className="divide-y divide-zinc-100 max-h-96 overflow-y-auto pr-2">
            {itensGaleria.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3 gap-3">
                <div className="flex items-center gap-3">
                  <img src={item.imagem_url} alt={item.titulo} className="w-12 h-12 object-cover rounded-lg border border-zinc-100" />
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 line-clamp-1">{item.titulo}</h4>
                    <span className="inline-block text-[9px] bg-red-50 text-red-600 font-black uppercase px-1.5 py-0.5 rounded mt-0.5 tracking-wider">
                      {item.restaurante === 'cobraice' ? '🐍 Cobraice' : item.restaurante === 'sayonara' ? '🌸 Sayonara' : '✨ Gourmet'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => lidarComExclusao(item.id, item.imagem_url, item.titulo)}
                  className="bg-zinc-100 hover:bg-red-50 text-zinc-400 hover:text-red-600 p-2 rounded-xl transition-all"
                  title="Excluir Foto"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}