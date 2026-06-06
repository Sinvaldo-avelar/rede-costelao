import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const nome = formData.get('nome') as string;
    const precoNormal = formData.get('precoNormal') as string;
    const precoOferta = formData.get('precoOferta') as string;
    const aba = formData.get('aba') as string; // 'dia' ou 'semana'
    const whatsappLoja = formData.get('whatsappLoja') as string;
    const imagem = formData.get('imagem') as File | null;

    if (!nome || !precoNormal || !precoOferta || !aba || !whatsappLoja || !imagem) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios.' },
        { status: 400 }
      );
    }

    // 🚨 ATENÇÃO: Vamos salvar as fotos em um bucket chamado 'imagens_produtos' 
    // para não confundir com o nome da tabela SQL!
    const extensao = imagem.name.split('.').pop();
    const nomeUnicoImagem = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${extensao}`;

    const { data: storageData, error: storageError } = await supabase.storage
      .from('imagens_produtos') // Mudei o nome do bucket aqui
      .upload(nomeUnicoImagem, imagem, {
        cacheControl: '3600',
        upsert: false,
      });

    if (storageError) {
      console.error('Erro no Storage:', storageError);
      return NextResponse.json({ error: 'Falha ao salvar a imagem no Storage. Verifique se o bucket "imagens_produtos" existe e é público.' }, { status: 500 });
    }

    const { data: urlData } = supabase.storage
      .from('imagens_produtos')
      .getPublicUrl(nomeUnicoImagem);

    const imagemUrl = urlData.publicUrl;

    const precoNormalNum = parseFloat(precoNormal.replace(',', '.'));
    const precoOfertaNum = parseFloat(precoOferta.replace(',', '.'));

    // 🎯 CONEXÃO COM A SUA TABELA REAL (Conforme a imagem image_f33624.png)
    const { data: novaOferta, error: dbError } = await supabase
      .from('produtos') // Nome real da sua tabela
      .insert([
        {
          nome,
          preco_normal: precoNormalNum,
          preco_promocao: precoOfertaNum, // Coluna real do seu print
          imagem_url: imagemUrl,          // Coluna real do seu print
          tipo_oferta: aba,               // Coluna real do seu print ('dia' ou 'semana')
          // whatsapp_loja: whatsappLoja   // OBS: Se não tiver essa coluna na tabela 'produtos', o link do Whats pode ser gerado direto no componente da página principal usando o número padrão.
        },
      ])
      .select();

    if (dbError) {
      console.error('Erro no Banco de Dados:', dbError);
      await supabase.storage.from('imagens_produtos').remove([nomeUnicoImagem]);
      return NextResponse.json({ error: `Erro no banco: ${dbError.message}` }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Oferta integrada e publicada com sucesso!',
      dados: novaOferta[0],
    });

  } catch (error: any) {
    console.error('Erro interno:', error);
    return NextResponse.json({ error: 'Erro interno no servidor.' }, { status: 500 });
  }
}