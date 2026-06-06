import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabaseDeDentoDaApi = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false }
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const imagem = formData.get('imagem') as File | null;

    if (!imagem) {
      return NextResponse.json({ error: 'A imagem do banner é obrigatória.' }, { status: 400 });
    }

    const extensao = imagem.name.split('.').pop();
    const nomeUnicoImagem = `banner-${Date.now()}.${extensao}`;

    // Upload para o bucket (que já sabemos que está funcionando!)
    const { error: storageError } = await supabaseDeDentoDaApi.storage
      .from('banners')
      .upload(nomeUnicoImagem, imagem, { cacheControl: '3600', upsert: false });

    if (storageError) {
      console.error(storageError);
      return NextResponse.json({ error: 'Falha no Storage ao salvar o arquivo.' }, { status: 500 });
    }

    const { data: urlData } = supabaseDeDentoDaApi.storage.from('banners').getPublicUrl(nomeUnicoImagem);
    const imagemUrl = urlData.publicUrl;

    // 🎯 ENVIANDO APENAS A IMAGEM PARA EVITAR O CONFLITO DA COLUNA 'TITULO'
    const { data: novoBanner, error: dbError } = await supabaseDeDentoDaApi
      .from('banners_topo')
      .insert([{ 
        imagem_url: imagemUrl // Essa coluna é padrão e o banco vai aceitar de primeira!
      }])
      .select();

    if (dbError) {
      console.error('--- ERRO DETALHADO DO BANCO ---', dbError);
      await supabaseDeDentoDaApi.storage.from('banners').remove([nomeUnicoImagem]);
      return NextResponse.json({ error: `Erro no banco: ${dbError.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Banner publicado com sucesso!', dados: novoBanner[0] });

  } catch (error: any) {
    return NextResponse.json({ error: `Erro interno: ${error.message}` }, { status: 500 });
  }
}