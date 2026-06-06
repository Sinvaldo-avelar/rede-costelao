'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // 🎯 Conexão direta e segura

interface FotoChurras {
  id: number;
  restaurante: string;
  titulo: string;
  imagem_url: string;
}

export default function GerenciarChurrascaria() {
  const [restaurante, setRestaurante] = useState('cobraice');
  const [titulo, setTitulo] = useState('');
  const [imagem, setImagem] = useState<File | null>(null);
  const [carregando, setCarregando] = useState(false);

  const [fotos, setFotos] = useState<FotoChurras[]>([]);
  const [buscando, setBuscando] = useState(true);

  // 🎯 Busca as fotos direto da tabela
  const buscarFotosChurrascaria = async () => {
    try {
      const { data, error } = await supabase
        .from('fotos_churrascaria')
        .select('*')
        .order('id', { ascending: false });

      if (!error && data) setFotos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setBuscando(false);
    }
  };

  useEffect(() => {
    buscarFotosChurrascaria();
  }, []);

  // 🚀 Envio Direto via Supabase Client (Sem passar por API interna)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagem) return alert('Por favor, selecione uma foto!');

    setCarregando(true);
    try {
      // 1. Cria um nome único para o arquivo físico
      const extensao = imagem.name.split('.').pop();
      const nomeArquivo = `foto-${Date.now()}.${extensao}`;

      // 2. Faz o upload direto para o Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('churrascaria')
        .upload(nomeArquivo, imagem, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw new Error(`Erro no Storage: ${uploadError.message}`);

      // 3. Pega a URL pública gerada
      const { data: urlData } = supabase.storage
        .from('churrascaria')
        .getPublicUrl(nomeArquivo);

      const urlPublicaImagem = urlData.publicUrl;

      // 4. Insere a nova linha direto na tabela do banco
      const { error: dbError } = await supabase
        .from('fotos_churrascaria')
        .insert([
          {
            restaurante,
            titulo,
            imagem_url: urlPublicaImagem
          }
        ]);

      if (dbError) throw new Error(`Erro no Banco: ${dbError.message}`);

      alert('🎉 Foto enviada com sucesso para a Galeria!');
      setTitulo('');
      setImagem(null);
      buscarFotosChurrascaria(); // Atualiza a lista na tela na hora

    } catch (error: any) {
      alert(`❌ Erro ao Publicar: ${error.message}`);
    } finally {
      setCarregando(false);
    }
  };

  // 🗑️ Exclusão Direta via Supabase Client
  const lidarComExclusao = async (id: number, imagemUrl: string, tituloFoto: string) => {
    if (!confirm(`Tem certeza que deseja apagar permanentemente a foto "${tituloFoto}"?`)) return;

    try {
      // 1. Deleta a linha do banco de dados
      const { error: dbError } = await supabase
        .from('fotos_churrascaria')
        .delete()
        .eq('id', id);

      if (dbError) throw new Error(`Erro ao deletar do banco: ${dbError.message}`);

      // 2. Remove o arquivo físico correspondente do Storage
      const nomeArquivo = imagemUrl.split('/').pop();
      if (nomeArquivo) {
        await supabase.storage
          .from('churrascaria')
          .remove([nomeArquivo]);
      }

      alert('🗑️ Foto removida com sucesso!');
      setFotos((antigas) => antigas.filter(item => item.id !== id));
    } catch (error: any) {
      alert(`❌ Erro ao deletar: ${error.message}`);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-zinc-200 shadow-sm">
        <div className="border-b border-zinc-100 pb-4 mb-6">
          <h3 className="text-lg font-black text-zinc-950 uppercase">🥩 Galeria do Site: Churrascaria</h3>
          <p className="text-[11px] text-zinc-500 font-bold uppercase mt-1">Cadastre as fotos dos pratos e ambientes que aparecem no site público.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-black text-zinc-700 uppercase mb-1">Selecione a Unidade / Aba</label>
            <select 
              value={restaurante} 
              onChange={(e) => setRestaurante(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-950 focus:outline-none focus:border-red-600"
            >
              <option value="cobraice">Churrascaria Cobraice 🐍</option>
              <option value="sayonara">Churrascaria Sayonara 🌸</option>
              <option value="gourmet">Churrascaria Gourmet ✨</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-black text-zinc-700 uppercase mb-1">Título ou Nome do Prato</label>
            <input 
              type="text" 
              required 
              value={titulo} 
              onChange={(e) => setTitulo(e.target.value)} 
              placeholder="Ex: Picanha na Brasa com Fritas" 
              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-950 focus:outline-none focus:border-red-600" 
            />
          </div>

          <div>
            <label className="block text-[11px] font-black text-zinc-700 uppercase mb-1">Foto Ilustrativa</label>
            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-zinc-200 border-dashed rounded-xl cursor-pointer bg-zinc-50 hover:bg-zinc-100/50">
              <p className="text-[11px] text-zinc-500 font-bold uppercase">{imagem ? `✅ ${imagem.name}` : '📸 Selecionar foto'}</p>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && setImagem(e.target.files[0])} />
            </label>
          </div>

          <button type="submit" disabled={carregando} className={`w-full py-3 rounded-xl text-xs font-black uppercase text-white ${carregando ? 'bg-zinc-400' : 'bg-red-600 hover:bg-red-500'}`}>
            {carregando ? 'Salvando...' : '🚀 Publicar na Churrascaria'}
          </button>
        </form>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-zinc-200 shadow-sm">
        <h3 className="text-sm font-black text-zinc-950 uppercase mb-4 border-b border-zinc-100 pb-2">Fotos Exibidas no Site</h3>
        
        {buscando ? (
          <p className="text-xs text-zinc-400">Carregando lista de fotos...</p>
        ) : fotos.length === 0 ? (
          <p className="text-xs text-zinc-400">Nenhuma foto cadastrada para o site ainda.</p>
        ) : (
          <div className="divide-y divide-zinc-100 max-h-96 overflow-y-auto pr-2">
            {fotos.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3 gap-3">
                <div className="flex items-center gap-3">
                  <img src={item.imagem_url} alt={item.titulo} className="w-10 h-10 object-cover rounded-lg border border-zinc-100" />
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 line-clamp-1">{item.titulo}</h4>
                    <span className="inline-block text-[9px] bg-zinc-100 text-zinc-600 font-black uppercase px-1.5 py-0.5 rounded mt-0.5">
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