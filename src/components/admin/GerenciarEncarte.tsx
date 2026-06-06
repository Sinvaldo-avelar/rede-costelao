'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // 🎯 Conexão direta e segura

export default function GerenciarEncarte() {
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [carregando, setCarregando] = useState(false);
  
  // Estados para monitorar o encarte que já está publicado
  const [encarteAtivo, setEncarteAtivo] = useState<string | null>(null);
  const [buscando, setBuscando] = useState(true);

  // 🎯 Busca se já existe um encarte ativo no banco de dados
  const verificarEncarteAtivo = async () => {
    try {
      const { data, error } = await supabase
        .from('encartes')
        .select('pdf_url')
        .limit(1);

      if (!error && data && data.length > 0) {
        setEncarteAtivo(data[0].pdf_url);
      } else {
        setEncarteAtivo(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBuscando(false);
    }
  };

  useEffect(() => {
    verificarEncarteAtivo();
  }, []);

  // 🚀 Envia o novo PDF e substitui o antigo
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!arquivo) return alert('Por favor, selecione um arquivo PDF primeiro!');

    if (arquivo.type !== 'application/pdf') {
      return alert('❌ Arquivo inválido! Por favor, selecione apenas arquivos no formato PDF.');
    }

    setCarregando(true);

    try {
      // 1. Gera um nome único para evitar problemas de cache no navegador do cliente
      const timestamp = Date.now();
      const nomeArquivo = `encarte-${timestamp}.pdf`;

      // 2. Faz o upload direto para o Storage na pasta 'encartes'
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('encartes')
        .upload(nomeArquivo, arquivo, {
          contentType: 'application/pdf',
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw new Error(`Erro no Storage: ${uploadError.message}`);

      // 3. Captura a URL pública oficial
      const { data: urlData } = supabase.storage
        .from('encartes')
        .getPublicUrl(nomeArquivo);

      const urlPublicaPdf = urlData.publicUrl;

      // 4. Limpa qualquer registro antigo para não acumular histórico
      await supabase.from('encartes').delete().neq('id', 0);

      // 5. Salva o link do novo PDF na tabela
      const { error: dbError } = await supabase
        .from('encartes')
        .insert([{ pdf_url: urlPublicaPdf }]);

      if (dbError) throw new Error(`Erro no Banco: ${dbError.message}`);

      alert('🎉 Encarte Digital publicado com sucesso!');
      setArquivo(null);
      verificarEncarteAtivo(); // Recarrega a tela com o novo link

    } catch (error: any) {
      alert(`❌ Erro ao publicar: ${error.message}`);
    } finally {
      setCarregando(false);
    }
  };

  // 🗑️ NOVA FUNÇÃO: Remove o encarte do banco e apaga o arquivo físico do Storage
  const lidarComExclusao = async () => {
    if (!encarteAtivo) return;
    if (!confirm('🚨 Atenção: Deseja realmente remover o Encarte Digital do ar? O botão do site ficará desativado.')) return;

    setCarregando(true);
    try {
      // 1. Limpa a tabela do banco de dados
      const { error: dbError } = await supabase
        .from('encartes')
        .delete()
        .neq('id', 0);

      if (dbError) throw new Error(`Erro ao limpar banco: ${dbError.message}`);

      // 2. Descobre o nome do arquivo pela URL e apaga ele fisicamente do Storage
      const nomeArquivo = encarteAtivo.split('/').pop();
      if (nomeArquivo) {
        await supabase.storage
          .from('encartes')
          .remove([nomeArquivo]);
      }

      alert('🗑️ Encarte Digital removido do ar com sucesso!');
      setEncarteAtivo(null);

    } catch (error: any) {
      alert(`❌ Erro ao remover: ${error.message}`);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-zinc-200 shadow-sm">
        
        {/* Cabeçalho do Bloco */}
        <div className="border-b border-zinc-100 pb-4 mb-6">
          <h3 className="text-lg font-black text-zinc-950 uppercase">📄 Atualizar Encarte Digital (PDF)</h3>
          <p className="text-[11px] text-zinc-500 font-bold uppercase mt-1">
            O arquivo enviado aqui substituirá automaticamente o panfleto antigo no site principal.
          </p>
        </div>

        {/* Formulário de Upload */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[11px] font-black text-zinc-700 uppercase mb-2 tracking-wider">
              Selecione o arquivo das ofertas da semana
            </label>
            
            <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-zinc-200 border-dashed rounded-xl cursor-pointer bg-zinc-50 hover:bg-zinc-100/50 transition-all">
              <div className="text-center p-4">
                <span className="text-2xl block mb-2">📁</span>
                <p className="text-[11px] text-zinc-600 font-black uppercase tracking-wider">
                  {arquivo ? `✅ ${arquivo.name}` : 'Clique aqui para escolher o PDF'}
                </p>
                <p className="text-[9px] text-zinc-400 font-bold uppercase mt-1">
                  Apenas arquivos no formato .PDF
                </p>
              </div>
              <input 
                type="file" 
                accept="application/pdf" 
                className="hidden" 
                onChange={(e) => e.target.files && setArquivo(e.target.files[0])} 
              />
            </label>
          </div>

          <button 
            type="submit" 
            disabled={carregando} 
            className={`w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-wider text-white transition-all shadow-md active:scale-[0.99] ${
              carregando ? 'bg-zinc-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-500 shadow-red-600/10'
            }`}
          >
            {carregando ? 'Processando...' : '🚀 Publicar Novo Encarte'}
          </button>
        </form>
      </div>

      {/* 📋 STATUS DO ENCARTE ATUAL COM OPÇÃO DE EXCLUIR */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-zinc-200 shadow-sm">
        <h3 className="text-sm font-black text-zinc-950 uppercase mb-4 border-b border-zinc-100 pb-2">Encarte Ativo no Site</h3>
        
        {buscando ? (
          <p className="text-xs text-zinc-400">Verificando status do encarte...</p>
        ) : !encarteAtivo ? (
          <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 text-center">
            <p className="text-xs font-bold text-zinc-500 uppercase">📭 Nenhum encarte publicado no momento.</p>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-zinc-50 border border-zinc-100 rounded-xl gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📄</span>
              <div>
                <p className="text-xs font-black text-zinc-900 uppercase">Existe um encarte publicado</p>
                <a 
                  href={encarteAtivo} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[10px] text-red-600 font-black uppercase tracking-wider hover:underline"
                >
                  👁️ Clique aqui para visualizar o PDF ativo
                </a>
              </div>
            </div>

            {/* 🗑️ O Botão de Excluir Solicitado */}
            <button
              type="button"
              disabled={carregando}
              onClick={lidarComExclusao}
              className="w-full sm:w-auto px-4 py-2.5 bg-zinc-900 hover:bg-red-600 border border-zinc-800 hover:border-red-600 rounded-xl text-[10px] font-black uppercase tracking-wider text-zinc-400 hover:text-white transition-all active:scale-[0.98]"
            >
              🗑️ Remover do Ar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}