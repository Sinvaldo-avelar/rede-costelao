'use client';

import React, { useState } from 'react';

export default function GerenciarRestaurantes() {
  const [restaurante, setRestaurante] = useState('cobraice');
  const [titulo, setTitulo] = useState(''); // Estado para o novo campo de texto
  const [imagem, setImagem] = useState<File | null>(null);
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagem) return alert('Por favor, selecione uma foto!');

    setCarregando(true);

    try {
      const formData = new FormData();
      formData.append('restaurante', restaurante);
      formData.append('titulo', titulo); // Envia o título digitado
      formData.append('imagem', imagem);

      const response = await fetch('/api/admin/restaurantes', {
        method: 'POST',
        body: formData,
      });

      const resultado = await response.json();

      if (!response.ok) throw new Error(resultado.error);

      alert('🎉 Foto publicada na galeria com sucesso!');
      setTitulo(''); // Limpa o título
      setImagem(null);

    } catch (error: any) {
      alert(`❌ Erro: ${error.message}`);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl border border-zinc-200 shadow-sm max-w-2xl">
      <div className="border-b border-zinc-100 pb-4 mb-6">
        <h3 className="text-lg font-black text-zinc-950 uppercase">🍽️ Gerenciar Fotos dos Restaurantes</h3>
        <p className="text-xs text-zinc-500">Adicione fotos e descrições para as abas do Cobraice, Sayonara ou Gourmet.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Seleção do Restaurante */}
        <div>
          <label className="block text-[11px] font-black text-zinc-700 uppercase tracking-wide mb-1">
            Selecione o Restaurante / Destino
          </label>
          <select
            value={restaurante}
            onChange={(e) => setRestaurante(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-950 focus:outline-none focus:border-red-600 transition-colors"
          >
            <option value="cobraice">Restaurante Cobraice 🐍</option>
            <option value="sayonara">Restaurante Sayonara 🌸</option>
            <option value="gourmet">Restaurante Gourmet ✨</option>
          </select>
        </div>

        {/* Novo Campo: Título/Descrição da Foto */}
        <div>
          <label className="block text-[11px] font-black text-zinc-700 uppercase tracking-wide mb-1">
            Título ou Legenda da Foto
          </label>
          <input
            type="text"
            required
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ex: Pratos Executivos Selecionados"
            className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-950 focus:outline-none focus:border-red-600 transition-colors"
          />
        </div>

        {/* Upload da Foto */}
        <div>
          <label className="block text-[11px] font-black text-zinc-700 uppercase tracking-wide mb-1">
            Foto do Ambiente ou Prato
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-zinc-200 border-dashed rounded-xl cursor-pointer bg-zinc-50 hover:bg-zinc-100/50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-wide">
                  {imagem ? `✅ ${imagem.name}` : '📸 Selecionar foto do Restaurante'}
                </p>
                <p className="text-[10px] text-zinc-400 mt-0.5">Fotos de boa qualidade</p>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && setImagem(e.target.files[0])} />
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={carregando}
          className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider text-white ${
            carregando ? 'bg-zinc-400' : 'bg-red-600 hover:bg-red-500'
          }`}
        >
          {carregando ? 'Publicando...' : '🚀 Enviar para a Galeria'}
        </button>
      </form>
    </div>
  );
}