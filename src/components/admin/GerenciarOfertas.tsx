'use client';

import React, { useState } from 'react';

export default function GerenciarOfertas() {
  // Estados para controlar os campos do formulário
  const [nome, setNome] = useState('');
  const [precoNormal, setPrecoNormal] = useState('');
  const [precoOferta, setPrecoOferta] = useState('');
  const [aba, setAba] = useState('dia'); // 'dia' ou 'semana'
  const [whatsappLoja, setWhatsappLoja] = useState('5527999999999'); // Substitua pelo número oficial com DDD
  const [imagem, setImagem] = useState<File | null>(null);
  const [carregando, setCarregando] = useState(false);

  // Função para lidar com o envio real dos dados para a API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imagem) {
      alert('Por favor, selecione uma foto para o produto!');
      return;
    }

    setCarregando(true);

    try {
      // 1. Criamos o pacote FormData necessário para enviar arquivos físicos
      const formData = new FormData();
      formData.append('nome', nome);
      formData.append('precoNormal', precoNormal);
      formData.append('precoOferta', precoOferta);
      formData.append('aba', aba);
      formData.append('whatsappLoja', whatsappLoja);
      formData.append('imagem', imagem); // Envia o arquivo da foto

      // 2. Fazemos o disparo real para a rota da API que você acabou de criar!
      const response = await fetch('/api/admin/ofertas', {
        method: 'POST',
        body: formData, // Envia o pacote completo
      });

      const resultado = await response.json();

      if (!response.ok) {
        throw new Error(resultado.error || 'Erro ao cadastrar produto.');
      }

      // 3. Sucesso absoluto!
      alert(`🎉 Sucesso: ${resultado.message}`);
      
      // Limpa o formulário para o próximo cadastro
      setNome('');
      setPrecoNormal('');
      setPrecoOferta('');
      setImagem(null);

    } catch (error: any) {
      console.error('Erro ao enviar formulário:', error);
      alert(`❌ Ocorreu um erro: ${error.message}`);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl border border-zinc-200 shadow-sm max-w-2xl">
      <div className="border-b border-zinc-100 pb-4 mb-6">
        <h3 className="text-lg font-black text-zinc-950 uppercase">🛒 Cadastrar Oferta do Supermercado</h3>
        <p className="text-xs text-zinc-500">Preencha os dados abaixo para enviar o produto direto para o site.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Nome do Produto */}
        <div>
          <label className="block text-[11px] font-black text-zinc-700 uppercase tracking-wide mb-1">
            Nome do Produto
          </label>
          <input
            type="text"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Arroz Tipo 1 Costelão 5kg"
            className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-950 focus:outline-none focus:border-red-600 transition-colors"
          />
        </div>

        {/* Preços (Lado a Lado) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-black text-zinc-700 uppercase tracking-wide mb-1">
              Preço Normal (De)
            </label>
            <input
              type="text"
              required
              value={precoNormal}
              onChange={(e) => setPrecoNormal(e.target.value)}
              placeholder="Ex: 24,90"
              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-950 focus:outline-none focus:border-red-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-black text-red-600 uppercase tracking-wide mb-1">
              Preço de Oferta (Por)
            </label>
            <input
              type="text"
              required
              value={precoOferta}
              onChange={(e) => setPrecoOferta(e.target.value)}
              placeholder="Ex: 19,98"
              className="w-full px-3 py-2 bg-zinc-50 border border-red-100 rounded-xl text-xs text-zinc-950 focus:outline-none focus:border-red-600 transition-colors"
            />
          </div>
        </div>

        {/* Seleção da Aba e WhatsApp */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-black text-zinc-700 uppercase tracking-wide mb-1">
              Onde exibir no site?
            </label>
            <select
              value={aba}
              onChange={(e) => setAba(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-950 focus:outline-none focus:border-red-600 transition-colors"
            >
              <option value="dia">Ofertas do Dia ☀️</option>
              <option value="semana">Ofertas da Semana 📅</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-black text-zinc-700 uppercase tracking-wide mb-1">
              WhatsApp para Pedidos (Com DDD)
            </label>
            <input
              type="text"
              required
              value={whatsappLoja}
              onChange={(e) => setWhatsappLoja(e.target.value)}
              placeholder="Ex: 5527999999999"
              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-950 focus:outline-none focus:border-red-600 transition-colors"
          />
          </div>
        </div>

        {/* Carregar Imagem do Produto */}
        <div>
          <label className="block text-[11px] font-black text-zinc-700 uppercase tracking-wide mb-1">
            Foto do Produto
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-zinc-200 border-dashed rounded-xl cursor-pointer bg-zinc-50 hover:bg-zinc-100/50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-wide">
                  {imagem ? `✅ ${imagem.name}` : '📸 Clique para selecionar a foto'}
                </p>
                <p className="text-[10px] text-zinc-400 mt-0.5">PNG ou JPG de boa qualidade</p>
              </div>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImagem(e.target.files[0]);
                  }
                }}
              />
            </label>
          </div>
        </div>

        {/* Botão de Envio */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={carregando}
            className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider text-white transition-all ${
              carregando 
                ? 'bg-zinc-400 cursor-not-allowed' 
                : 'bg-red-600 hover:bg-red-500 active:scale-[0.99] shadow-md shadow-red-600/10'
            }`}
          >
            {carregando ? 'Salvando no Banco...' : '🚀 Publicar Oferta no Site'}
          </button>
        </div>

      </form>
    </div>
  );
}