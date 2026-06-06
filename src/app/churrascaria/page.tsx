'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';


interface FotoChurras {
    id: number;
    restaurante: string;
    titulo: string;
    imagem_url: string;
}

export default function ChurrascariaPage() {
    // Aba ativa selecionada pelo cliente (Cobraice é a padrão)
    const [abaAtiva, setAbaAtiva] = useState('cobraice');
    const [fotos, setFotos] = useState<FotoChurras[]>([]);
    const [carregando, setCarregando] = useState(true);

    // 🎯 Busca as fotos exclusivas da churrascaria direto do banco
    useEffect(() => {
        async function carregarFotos() {
            setCarregando(true);
            try {
                const { data, error } = await supabase
                    .from('fotos_churrascaria')
                    .select('*')
                    .order('id', { ascending: false });

                if (!error && data) {
                    setFotos(data);
                }
            } catch (err) {
                console.error('Erro ao carregar fotos da churrascaria:', err);
            } finally {
                setCarregando(false);
            }
        }
        carregarFotos();
    }, []);

    // 🔥 Filtra as fotos na tela de acordo com a aba que o cliente clicar
    const fotosFiltradas = fotos.filter(foto => foto.restaurante === abaAtiva);

    return (
        <div className="min-h-screen bg-zinc-950 text-white selection:bg-red-600 selection:text-white antialiased">


            {/* Conteúdo Principal */}
            <main className="max-w-7xl mx-auto px-4 pt-24 pb-16 space-y-12">

                {/* Título de Impacto */}
                <div className="text-center space-y-3 max-w-2xl mx-auto">
                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-600/10 border border-red-600/20 px-3 py-1 rounded-full">
                        Nossas Especialidades 🥩
                    </span>
                    <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tight">
                        Churrascaria <span className="text-red-600">Costelão</span>
                    </h1>
                    <p className="text-xs text-zinc-400 font-medium uppercase tracking-wide">
                        O melhor churrasco na brasa da região, preparado por profissionais qualificados para servir você e sua família.
                    </p>
                </div>

                {/* 🧭 SELETOR DE ABAS ESTILIZADO (Estilo Preto e Vermelho do Admin) */}
                <div className="flex justify-center border-b border-zinc-900 pb-px">
                    <div className="flex gap-2 max-w-full overflow-x-auto pb-3 md:pb-0 scrollbar-none">
                        {[
                            { id: 'cobraice', nome: '🐍 Unidade Cobraice' },
                            { id: 'sayonara', nome: '🌸 Unidade Sayonara' },
                            { id: 'gourmet', nome: '✨ Espaço Gourmet' }
                        ].map((aba) => {
                            const ativa = abaAtiva === aba.id;
                            return (
                                <button
                                    key={aba.id}
                                    onClick={() => setAbaAtiva(aba.id)}
                                    className={`px-5 py-3 rounded-t-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all border-b-2 ${ativa
                                            ? 'bg-zinc-900 text-red-500 border-red-600 shadow-lg shadow-red-600/5'
                                            : 'text-zinc-500 border-transparent hover:text-zinc-300'
                                        }`}
                                >
                                    {aba.nome}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 📸 GALERIA DE FOTOS DINÂMICA */}
                {carregando ? (
                    <div className="text-center py-20">
                        <p className="text-xs font-black uppercase tracking-widest text-zinc-500 animate-pulse">
                            🔥 Acendendo a brasa e carregando fotos...
                        </p>
                    </div>
                ) : fotosFiltradas.length === 0 ? (
                    <div className="text-center py-20 bg-zinc-900/20 border border-zinc-900 rounded-3xl p-8">
                        <span className="text-3xl block mb-2">🍽️</span>
                        <p className="text-xs font-black uppercase tracking-wider text-zinc-500">
                            Nenhuma foto publicada para esta unidade ainda!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {fotosFiltradas.map((item) => (
                            <div
                                key={item.id}
                                className="group bg-zinc-900/40 border border-zinc-900 rounded-3xl overflow-hidden hover:border-zinc-800 transition-all duration-300 shadow-xl flex flex-col"
                            >
                                {/* Imagem do Prato */}
                                <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-950">
                                    <img
                                        src={item.imagem_url}
                                        alt={item.titulo}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />
                                </div>

                                {/* Legenda/Título abaixo da foto */}
                                <div className="p-5 flex-1 flex flex-col justify-between bg-zinc-950">
                                    <h3 className="text-xs font-black uppercase tracking-wider text-zinc-100 line-clamp-2">
                                        {item.titulo}
                                    </h3>
                                    <div className="w-8 h-0.5 bg-red-600 mt-3" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </main>
        </div>
    );
}