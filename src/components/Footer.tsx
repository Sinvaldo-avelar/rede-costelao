import Link from 'next/link';
export default function Footer() {
  const anoAtual = new Date().getFullYear();

  return (
    <footer id="unidades" className="w-full bg-black text-zinc-400 pt-5 pb-3 border-t-2 border-red-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Coluna 1: Sobre o Grupo */}
        <div>
          <h3 className="text-sm font-black text-white tracking-wider mb-1">
            REDE <span className="text-red-500">COSTELÃO</span>
          </h3>
          <p className="leading-tight text-zinc-500">
            Qualidade, variedade e o melhor preço para a sua família. Visite uma de nossas unidades ou faça seu pedido online.
          </p>
        </div>

        {/* Coluna 2: Nossas Lojas (Supermercados) */}
        <div>
          <h4 className="text-white font-bold uppercase tracking-wider mb-1 text-[11px] border-l-2 border-red-600 pl-1.5">
            Supermercados
          </h4>
          <ul className="space-y-1 leading-tight">
            <li>
              <strong className="text-zinc-300">Loja 1 (Centro):</strong> Av. Principal, 100 <br />
              <span className="text-zinc-600 text-[10px]">Seg a Sáb: 07h às 21h | Dom: 07h às 13h</span>
            </li>
            <li>
              <strong className="text-zinc-300">Loja 2 (Bairro):</strong> Rua das Palmeiras, 450
            </li>
          </ul>
        </div>

        {/* Coluna 3: Restaurante & Churrascaria */}
        <div>
          <h4 className="text-white font-bold uppercase tracking-wider mb-1 text-[11px] border-l-2 border-red-600 pl-1.5">
            Churrascaria
          </h4>
          <ul className="space-y-1 leading-tight">
            <li>
              <strong className="text-zinc-300">Costelão Grill:</strong> Trevo da Cidade, Km 2 <br />
              <span className="text-zinc-600 text-[10px]">Ter a Dom: 11h às 15h30</span>
            </li>
            <li>
              <span className="text-zinc-500 text-[10px]">Reservas: </span>
              <strong className="text-red-500 font-bold">(27) 99999-0000</strong>
            </li>
          </ul>
        </div>
        

      </div>
      

      {/* Linha de Direitos Autorais */}
      <div className="max-w-7xl mx-auto px-4 mt-4 pt-2 border-t border-zinc-900 text-center text-[10px] text-zinc-600">
        <p>&copy; {anoAtual} Rede Costelão. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}