import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 🚀 POST: Recebe a foto da gerente, joga no Storage e grava na Tabela
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const restaurante = formData.get('restaurante') as string;
    const titulo = formData.get('titulo') as string;
    const arquivoImagem = formData.get('imagem') as File | null;

    // Validação básica de segurança
    if (!restaurante || !titulo || !arquivoImagem) {
      return NextResponse.json({ error: 'Preencha todos os campos e selecione uma imagem.' }, { status: 400 });
    }

    // 1. Gera um nome único para o arquivo usando timestamp (evita lixo em cache)
    const extensao = arquivoImagem.name.split('.').pop();
    const nomeArquivo = `foto-${Date.now()}.${extensao}`;

    // 2. Faz o upload da foto física para dentro da pasta 'churrascaria' no Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('churrascaria')
      .upload(nomeArquivo, arquivoImagem, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      return NextResponse.json({ error: `Erro no Storage: ${uploadError.message}` }, { status: 500 });
    }

    // 3. Captura a URL pública oficial gerada para essa imagem
    const { data: urlData } = supabase.storage
      .from('churrascaria')
      .getPublicUrl(nomeArquivo);

    const urlPublicaImagem = urlData.publicUrl;

    // 4. Grava os dados completos na nossa nova tabela exclusiva
    const { error: dbError } = await supabase
      .from('fotos_churrascaria')
      .insert([
        {
          restaurante,
          titulo,
          imagem_url: urlPublicaImagem
        }
      ]);

    if (dbError) {
      return NextResponse.json({ error: `Erro no Banco: ${dbError.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Foto publicada na galeria do site!' });

  } catch (error: any) {
    return NextResponse.json({ error: `Erro interno: ${error.message}` }, { status: 500 });
  }
}

// 🗑️ DELETE: Remove a foto da tabela e também limpa o arquivo físico do Storage
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const imagemUrl = searchParams.get('imagemUrl');

    if (!id || !imagemUrl) {
      return NextResponse.json({ error: 'Parâmetros ausentes para exclusão.' }, { status: 400 });
    }

    // 1. Remove o registro do banco de dados primeiro
    const { error: dbError } = await supabase
      .from('fotos_churrascaria')
      .delete()
      .eq('id', id);

    if (dbError) {
      return NextResponse.json({ error: `Erro ao deletar do banco: ${dbError.message}` }, { status: 500 });
    }

    // 2. Extrai o nome do arquivo de dentro da URL pública para remover do Storage
    const nomeArquivo = imagemUrl.split('/').pop();
    if (nomeArquivo) {
      await supabase.storage.from('churrascaria').remove([nomeArquivo]);
    }

    return NextResponse.json({ success: true, message: 'Foto removida com sucesso!' });

  } catch (error: any) {
    return NextResponse.json({ error: `Erro interno ao deletar: ${error.message}` }, { status: 500 });
  }
}