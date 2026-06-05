'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  // Controle para abrir e fechar o menu no celular
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <header className="w-full bg-black text-white shadow-md sticky top-0 z-50 border-b-2 border-red-600">
      {/* Barra Principal */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
        
        {/* Lado Esquerdo: Selo Redondo Nativo + Nome da Rede com Carrinho */}
        <div className="flex items-center gap-3 select-none">
          
          {/* O Selo Redondinho feito 100% em código */}
          <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-full bg-zinc-950 flex flex-col items-center justify-center border-2 border-red-600 shadow-lg shrink-0">
            <div className="absolute inset-1 rounded-full border border-dashed border-red-700 pointer-events-none opacity-60" />
            
            <span className="text-[5px] md:text-[6px] font-black tracking-widest text-gray-400 uppercase leading-none z-10">
              SUPERMERCADO
            </span>
            <span className="text-[10px] md:text-xs font-serif font-black tracking-tight text-white leading-none mt-0.5 z-10">
              Costelão
            </span>
            
            <div className="w-6 md:w-8 h-[1px] bg-red-600 mt-0.5 z-10" />
          </div>

          {/* Divisor vertical discreto - Oculto em telas bem pequenas */}
          <div className="hidden sm:block h-10 w-[1px] bg-zinc-800" />

          {/* Nome Principal com o Carrinho de Supermercado Estilizado */}
          <div className="flex items-center gap-2">
            <div className="bg-zinc-900 border border-red-600/40 p-1.5 md:p-2 rounded-lg md:rounded-xl shadow-inner text-red-500">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={2.5} 
                stroke="currentColor" 
                className="w-4 h-4 md:w-5 md:h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
            </div>
            
            <div className="flex flex-col">
              <span className="text-[8px] md:text-[10px] font-black tracking-[0.25em] text-red-500 leading-none">REDE</span>
              <span className="text-sm md:text-xl font-black tracking-tight text-white leading-tight">COSTELÃO</span>
            </div>
          </div>

        </div>

        {/* Centro: Menu de Navegação para Computador */}
        <nav className="hidden lg:flex space-x-8 font-bold text-sm uppercase tracking-wide">
          <Link href="/" className="hover:text-red-500 transition-colors text-gray-200">
            Início
          </Link>
          <Link href="#ofertas" className="hover:text-red-500 transition-colors text-gray-200">
            Ofertas
          </Link>
          <Link href="#unidades" className="hover:text-red-500 transition-colors text-gray-200">
            Nossas Lojas
          </Link>
          <Link href="/lojas/churrascaria" className="hover:text-red-500 transition-colors text-gray-200">
            Churrascaria
          </Link>
        </nav>

        {/* Lado Direito: Ações */}
        <div className="flex items-center gap-2">
          {/* Botão de Encarte Fixo na Barra - AGORA SÓ APARECE NO PC (hidden lg:block) */}
          <a 
            href="https://wa.me/seu-numero" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden lg:block bg-zinc-900 hover:bg-red-700 text-white border border-red-600 px-5 py-2 rounded-md font-bold text-xs uppercase tracking-wider transition-all shadow-md"
          >
            Encarte Digital
          </a>

          {/* Botão Hambúrguer para abrir o Menu no celular (Invisível no computador) */}
          <button 
            onClick={() => setMenuAberto(!menuAberto)}
            className="lg:hidden bg-zinc-900 border border-zinc-800 p-2.5 rounded-md text-gray-400 hover:text-white focus:outline-none"
            aria-label="Menu de navegação"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              {menuAberto ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>

      </div>

      {/* Menu Retrátil para Celular */}
      {menuAberto && (
        <nav className="lg:hidden bg-zinc-950 border-t border-zinc-900 px-4 py-4 flex flex-col space-y-4 font-bold text-xs uppercase tracking-wide border-b border-red-600/30">
          <Link href="/" onClick={() => setMenuAberto(false)} className="hover:text-red-500 text-gray-300 py-1.5 border-b border-zinc-900">
            Início
          </Link>
          <Link href="#ofertas" onClick={() => setMenuAberto(false)} className="hover:text-red-500 text-gray-300 py-1.5 border-b border-zinc-900">
            Ofertas
          </Link>
          <Link href="#unidades" onClick={() => setMenuAberto(false)} className="hover:text-red-500 text-gray-300 py-1.5 border-b border-zinc-900">
            Nossas Lojas
          </Link>
          <Link href="/lojas/churrascaria" onClick={() => setMenuAberto(false)} className="hover:text-red-500 text-gray-300 py-1.5 border-b border-zinc-900">
            Churrascaria
          </Link>
          
          {/* O Encarte Digital ganhou destaque total aqui dentro no Mobile! */}
          <div className="pt-2">
            <a 
              href="https://wa.me/seu-numero" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => setMenuAberto(false)}
              className="bg-red-600 hover:bg-red-700 text-white text-center py-2.5 rounded-md font-bold text-xs uppercase tracking-wider block shadow-md"
            >
              Encarte Digital (WhatsApp)
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}