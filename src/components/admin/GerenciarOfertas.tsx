'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // 🎯 Única conexão limpa usada aqui!

interface Produto {
  id: number;
  nome: string;
  preco_normal: number;
  preco_promocao: number;
  imagem_url: string;
  tipo_oferta: string;
}

export default function GerenciarOfertas() {
  const [nome, setNome] = useState('');
  const [precoNormal, setPrecoNormal] = useState('');
  const [precoOferta, setPrecoOferta] = useState('');
  const [aba, setAba] = useState('dia');
  const [whatsappLoja, setWhatsappLoja] = useState('5527999999999');
  const [imagem, setImagem] = useState<File | null>(null);
  const [carregando, setCarregando] = useState(false);
  
  // Estados para a listagem
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [buscando, setBuscando] = useState(true);

  // Função limpa sem criar novas instâncias
  const buscarProdutos = async () => {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .order('id', { ascending: false });

      if (!error && data) setProdutos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setBuscando(false);
    }
  };

  useEffect(() => {
    buscarProdutos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagem) return alert('Selecione uma foto!');

    setCarregando(true);
    try {
      const formData = new FormData();
      formData.append('nome', nome);
      formData.append('precoNormal', precoNormal);
      formData.append('precoOferta', precoOferta);
      formData.append('aba', aba);
      formData.append('whatsappLoja', whatsappLoja);
      formData.append('imagem', imagem);

      const response = await fetch('/api/admin/ofertas', { method: 'POST', body: formData });
      const resultado = await response.json();

      if (!response.ok) throw new Error(resultado.error);

      alert(`🎉 ${resultado.message}`);
      setNome('');
      setPrecoNormal('');
      setPrecoOferta('');
      setImagem(null);
      buscarProdutos(); 

    } catch (error: any) {
      alert(`❌ Erro: ${error.message}`);
    } finally {
      setCarregando(false);
    }
  };

  const lidarComExclusao = async (id: number, imagemUrl: string, nomeProd: string) => {
    if (!confirm(`Tem certeza que deseja apagar permanentemente o produto "${nomeProd}"?`)) return;

    try {
      const response = await fetch(`/api/admin/ofertas?id=${id}&imagemUrl=${encodeURIComponent(imagemUrl)}`, {
        method: 'DELETE',
      });

      const resultado = await response.json();

      if (!response.ok) throw new Error(resultado.error);

      alert('🗑️ Produto removido com sucesso!');
      setProdutos((antigos) => antigos.filter(prod => prod.id !== id));
    } catch (error: any) {
      alert(`❌ Erro ao deletar: ${error.message}`);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      {/* FORMULÁRIO DE CADASTRO */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-zinc-200 shadow-sm">
        <div className="border-b border-zinc-100 pb-4 mb-6">
          <h3 className="text-lg font-black text-zinc-950 uppercase">🛒 Cadastrar Oferta</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-black text-zinc-700 uppercase mb-1">Nome do Produto</label>
            <input type="text" required value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Arroz Costelão 5kg" className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-950 focus:outline-none focus:border-red-600" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black text-zinc-700 uppercase mb-1">Preço Normal</label>
              <input type="text" required value={precoNormal} onChange={(e) => setPrecoNormal(e.target.value)} placeholder="Ex: 24,90" className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-950 focus:outline-none focus:border-red-600" />
            </div>
            <div>
              <label className="block text-[11px] font-black text-red-600 uppercase mb-1">Preço Promotion</label>
              <input type="text" required value={precoOferta} onChange={(e) => setPrecoOferta(e.target.value)} placeholder="Ex: 19,98" className="w-full px-3 py-2 bg-zinc-50 border border-red-100 rounded-xl text-xs text-zinc-950 focus:outline-none focus:border-red-600" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black text-zinc-700 uppercase mb-1">Onde exibir?</label>
              <select value={aba} onChange={(e) => setAba(e.target.value)} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-950 focus:outline-none focus:border-red-600">
                <option value="dia">Ofertas do Dia ☀️</option>
                <option value="semana">Ofertas da Semana 📅</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-black text-zinc-700 uppercase mb-1">WhatsApp da Loja</label>
              <input 
                type="text" 
                required 
                value={whatsappLoja} 
                onChange={(e) => setWhatsappLoja(e.target.value)} // 🎯 IDÊNTICO AO BOTÃO DO BANNER!
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-950 focus:outline-none focus:border-red-600" 
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-black text-zinc-700 uppercase mb-1">Foto do Produto</label>
            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-zinc-200 border-dashed rounded-xl cursor-pointer bg-zinc-50 hover:bg-zinc-100/50">
              <p className="text-[11px] text-zinc-500 font-bold uppercase">{imagem ? `✅ ${imagem.name}` : '📸 Selecionar foto'}</p>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && setImagem(e.target.files[0])} />
            </label>
          </div>

          <button type="submit" disabled={carregando} className={`w-full py-3 rounded-xl text-xs font-black uppercase text-white ${carregando ? 'bg-zinc-400' : 'bg-red-600 hover:bg-red-500'}`}>
            {carregando ? 'Salvando...' : '🚀 Publicar Oferta'}
          </button>
        </form>
      </div>

      {/* 📋 LISTAGEM COM BOTÃO DE EXCLUIR */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-zinc-200 shadow-sm">
        <h3 className="text-sm font-black text-zinc-950 uppercase mb-4 border-b border-zinc-100 pb-2">Produtos Ativos no Site</h3>
        
        {buscando ? (
          <p className="text-xs text-zinc-400">Carregando lista de produtos...</p>
        ) : produtos.length === 0 ? (
          <p className="text-xs text-zinc-400">Nenhum produto cadastrado ainda.</p>
        ) : (
          <div className="divide-y divide-zinc-100 max-h-96 overflow-y-auto pr-2">
            {produtos.map((prod) => (
              <div key={prod.id} className="flex items-center justify-between py-3 gap-3">
                <div className="flex items-center gap-3">
                  <img src={prod.imagem_url} alt={prod.nome} className="w-10 h-10 object-cover rounded-lg border border-zinc-100" />
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 line-clamp-1">{prod.nome}</h4>
                    <p className="text-[10px] text-zinc-500 font-bold">
                      De: R$ {prod.preco_normal.toFixed(2)} | <span className="text-red-600">Por: R$ {prod.preco_promocao.toFixed(2)}</span>
                    </p>
                    <span className="inline-block text-[9px] bg-zinc-100 text-zinc-600 font-black uppercase px-1.5 py-0.5 rounded mt-0.5">
                      {prod.tipo_oferta === 'dia' ? '☀️ Dia' : '📅 Semana'}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => lidarComExclusao(prod.id, prod.imagem_url, prod.nome)}
                  className="bg-zinc-100 hover:bg-red-50 text-zinc-400 hover:text-red-600 p-2 rounded-xl transition-all"
                  title="Excluir Produto"
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