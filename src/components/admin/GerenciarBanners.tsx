'use client';

import React, { useState } from 'react';

export default function GerenciarBanners() {
  const [titulo, setTitulo] = useState('');
  const [imagem, setImagem] = useState<File | null>(null);
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagem) return alert('Selecione uma imagem para o banner!');

    setCarregando(true);

    try {
      const formData = new FormData();
      formData.append('titulo', titulo);
      formData.append('imagem', imagem);

      const response = await fetch('/api/admin/banners', {
        method: 'POST',
        body: formData,
      });

      const resultado = await response.json();

      if (!response.ok) throw new Error(resultado.error);

      alert('🎉 Banner publicado com sucesso!');
      setTitulo('');
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
        <h3 className="text-lg font-black text-zinc-950 uppercase">📸 Gerenciar Banners do Topo</h3>
        <p className="text-xs text-zinc-500">Suba novas imagens para o carrossel de anúncios principal.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[11px] font-black text-zinc-700 uppercase tracking-wide mb-1">
            Título ou Descrição do Banner (Opcional)
          </label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ex: Campanha de Campanhas de Junho"
            className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-950 focus:outline-none focus:border-red-600 template-colors"
          />
        </div>

        <div>
          <label className="block text-[11px] font-black text-zinc-700 uppercase tracking-wide mb-1">
            Imagem do Banner (Formatos largos)
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-zinc-200 border-dashed rounded-xl cursor-pointer bg-zinc-50 hover:bg-zinc-100/50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-wide">
                  {imagem ? `✅ ${imagem.name}` : '📸 Selecionar imagem do Banner'}
                </p>
                <p className="text-[10px] text-zinc-400 mt-0.5">Imagens retangulares e compridas de preferência</p>
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
          {carregando ? 'Enviando...' : '🚀 Publicar Banner'}
        </button>
      </form>
    </div>
  );
}