import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabaseDeDentroApi = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false }
});

// --- ROTA DE CADASTRO (POST) ---
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const imagem = formData.get('imagem') as File | null;

    if (!imagem) {
      return NextResponse.json({ error: 'A imagem do banner é obrigatória.' }, { status: 400 });
    }

    const extensao = imagem.name.split('.').pop();
    const nomeUnicoImagem = `banner-${Date.now()}.${extensao}`;

    const { error: storageError } = await supabaseDeDentroApi.storage
      .from('banners')
      .upload(nomeUnicoImagem, imagem, { cacheControl: '3600', upsert: false });

    if (storageError) {
      console.error(storageError);
      return NextResponse.json({ error: 'Falha no Storage ao salvar o arquivo.' }, { status: 500 });
    }

    const { data: urlData } = supabaseDeDentroApi.storage.from('banners').getPublicUrl(nomeUnicoImagem);
    const imagemUrl = urlData.publicUrl;

    const { data: novoBanner, error: dbError } = await supabaseDeDentroApi
      .from('banners_topo')
      .insert([{ imagem_url: imagemUrl }])
      .select();

    if (dbError) {
      await supabaseDeDentroApi.storage.from('banners').remove([nomeUnicoImagem]);
      return NextResponse.json({ error: `Erro no banco: ${dbError.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Banner publicado com sucesso!', dados: novoBanner[0] });
  } catch (error: any) {
    return NextResponse.json({ error: `Erro interno: ${error.message}` }, { status: 500 });
  }
}

// 🎯 --- NOVA ROTA DE EXCLUSÃO (DELETE) ---
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const imagemUrl = searchParams.get('imagemUrl');

    if (!id) {
      return NextResponse.json({ error: 'ID do banner é obrigatório.' }, { status: 400 });
    }

    // 1. Deleta a imagem física do Storage se a URL foi passada
    if (imagemUrl) {
      const nomeArquivo = imagemUrl.split('/').pop();
      if (nomeArquivo) {
        await supabaseDeDentroApi.storage.from('banners').remove([nomeArquivo]);
      }
    }

    // 2. Remove o registro do banco de dados
    const { error: dbError } = await supabaseDeDentroApi
      .from('banners_topo')
      .delete()
      .eq('id', id);

    if (dbError) {
      return NextResponse.json({ error: `Erro ao deletar no banco: ${dbError.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Banner removido com sucesso!' });
  } catch (error: any) {
    return NextResponse.json({ error: `Erro interno: ${error.message}` }, { status: 500 });
  }
}