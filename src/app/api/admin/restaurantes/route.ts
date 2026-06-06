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
    const restaurante = formData.get('restaurante') as string;
    const titulo = formData.get('titulo') as string || 'Foto do Ambiente';
    const imagem = formData.get('imagem') as File | null;

    if (!restaurante || !imagem) {
      return NextResponse.json({ error: 'O restaurante e a imagem são obrigatórios.' }, { status: 400 });
    }

    const extensao = imagem.name.split('.').pop();
    const nomeUnicoImagem = `restaurante-${restaurante}-${Date.now()}.${extensao}`;

    const { error: storageError } = await supabaseDeDentroApi.storage
      .from('galeria')
      .upload(nomeUnicoImagem, imagem, { cacheControl: '3600', upsert: false });

    if (storageError) {
      console.error(storageError);
      return NextResponse.json({ error: 'Falha ao salvar a imagem na galeria do Storage.' }, { status: 500 });
    }

    const { data: urlData } = supabaseDeDentroApi.storage.from('galeria').getPublicUrl(nomeUnicoImagem);
    const imagemUrl = urlData.publicUrl;

    const { data: novaFoto, error: dbError } = await supabaseDeDentroApi
      .from('galeria')
      .insert([{ 
        restaurante,     
        titulo,          
        imagem_url: imagemUrl 
      }])
      .select();

    if (dbError) {
      console.error('Erro no SQL:', dbError);
      await supabaseDeDentroApi.storage.from('galeria').remove([nomeUnicoImagem]);
      return NextResponse.json({ error: `Erro no banco: ${dbError.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Foto integrada à galeria com sucesso!', dados: novaFoto[0] });

  } catch (error) {
    return NextResponse.json({ error: 'Erro interno no servidor.' }, { status: 500 });
  }
}

// 🎯 --- NOVA ROTA DE EXCLUSÃO (DELETE) ---
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const imagemUrl = searchParams.get('imagemUrl');

    if (!id) {
      return NextResponse.json({ error: 'ID da foto é obrigatório.' }, { status: 400 });
    }

    // 1. Deleta a imagem física do Storage do bucket 'galeria'
    if (imagemUrl) {
      const nomeArquivo = imagemUrl.split('/').pop();
      if (nomeArquivo) {
        await supabaseDeDentroApi.storage.from('galeria').remove([nomeArquivo]);
      }
    }

    // 2. Remove o registro correspondente do banco de dados na tabela 'galeria'
    const { error: dbError } = await supabaseDeDentroApi
      .from('galeria')
      .delete()
      .eq('id', id);

    if (dbError) {
      return NextResponse.json({ error: `Erro ao deletar no banco: ${dbError.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Foto removida com sucesso!' });
  } catch (error: any) {
    return NextResponse.json({ error: `Erro interno: ${error.message}` }, { status: 500 });
  }
}