import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const restaurante = formData.get('restaurante') as string; // 'cobraice', 'sayonara' ou 'gourmet'
    const titulo = formData.get('titulo') as string || 'Foto do Ambiente'; // Captura o título da foto
    const imagem = formData.get('imagem') as File | null;

    if (!restaurante || !imagem) {
      return NextResponse.json({ error: 'O restaurante e a imagem são obrigatórios.' }, { status: 400 });
    }

    // Nome único para o arquivo no Storage
    const extensao = imagem.name.split('.').pop();
    const nomeUnicoImagem = `restaurante-${restaurante}-${Date.now()}.${extensao}`;

    // Upload para o bucket 'galeria'
    const { error: storageError } = await supabase.storage
      .from('galeria')
      .upload(nomeUnicoImagem, imagem, { cacheControl: '3600', upsert: false });

    if (storageError) {
      console.error(storageError);
      return NextResponse.json({ error: 'Falha ao salvar a imagem na galeria do Storage.' }, { status: 500 });
    }

    // Pega a URL pública gerada no bucket
    const { data: urlData } = supabase.storage.from('galeria').getPublicUrl(nomeUnicoImagem);
    const imagemUrl = urlData.publicUrl;

    // 🎯 MAPA EXATO DA SUA TABELA (Conforme imagem image_f25929.png)
    const { data: novaFoto, error: dbError } = await supabase
      .from('galeria') // Sua tabela real
      .insert([{ 
        restaurante,     // Nome da coluna correto do seu print
        titulo,          // Coluna de texto do seu print
        imagem_url: imagemUrl 
      }])
      .select();

    if (dbError) {
      console.error('Erro no SQL:', dbError);
      await supabase.storage.from('galeria').remove([nomeUnicoImagem]);
      return NextResponse.json({ error: `Erro no banco: ${dbError.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Foto integrada à galeria com sucesso!', dados: novaFoto[0] });

  } catch (error) {
    return NextResponse.json({ error: 'Erro interno no servidor.' }, { status: 500 });
  }
}