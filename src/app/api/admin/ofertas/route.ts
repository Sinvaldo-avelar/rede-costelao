import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabaseDeDentro = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false }
});

// --- ROTA DE CADASTRO (POST) ---
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const nome = formData.get('nome') as string;
    const precoNormal = formData.get('precoNormal') as string;
    const precoOferta = formData.get('precoOferta') as string;
    const aba = formData.get('aba') as string;
    const whatsappLoja = formData.get('whatsappLoja') as string;
    const imagem = formData.get('imagem') as File | null;

    if (!nome || !precoNormal || !precoOferta || !aba || !whatsappLoja || !imagem) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios.' }, { status: 400 });
    }

    const extensao = imagem.name.split('.').pop();
    const nomeUnicoImagem = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${extensao}`;

    const { error: storageError } = await supabaseDeDentro.storage
      .from('imagens_produtos')
      .upload(nomeUnicoImagem, imagem, { cacheControl: '3600', upsert: false });

    if (storageError) {
      return NextResponse.json({ error: 'Falha ao salvar a imagem no Storage.' }, { status: 500 });
    }

    const { data: urlData } = supabaseDeDentro.storage.from('imagens_produtos').getPublicUrl(nomeUnicoImagem);
    const imagemUrl = urlData.publicUrl;

    const precoNormalNum = parseFloat(precoNormal.replace(',', '.'));
    const precoOfertaNum = parseFloat(precoOferta.replace(',', '.'));

    const { data: novaOferta, error: dbError } = await supabaseDeDentro
      .from('produtos')
      .insert([{ 
        nome, 
        preco_normal: precoNormalNum, 
        preco_promocao: precoOfertaNum, 
        imagem_url: imagemUrl, 
        tipo_oferta: aba 
      }])
      .select();

    if (dbError) {
      await supabaseDeDentro.storage.from('imagens_produtos').remove([nomeUnicoImagem]);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Oferta integrada com sucesso!', dados: novaOferta[0] });
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 });
  }
}

// 🎯 --- NOVA ROTA DE EXCLUSÃO (DELETE) ---
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const imagemUrl = searchParams.get('imagemUrl');

    if (!id) {
      return NextResponse.json({ error: 'ID do produto é obrigatório.' }, { status: 400 });
    }

    // 1. Se veio a URL da imagem, extrai o nome do arquivo para apagar do Storage também
    if (imagemUrl) {
      const nomeArquivo = imagemUrl.split('/').pop();
      if (nomeArquivo) {
        await supabaseDeDentro.storage.from('imagens_produtos').remove([nomeArquivo]);
      }
    }

    // 2. Apaga a linha definitiva do banco de dados
    const { error: dbError } = await supabaseDeDentro
      .from('produtos')
      .delete()
      .eq('id', id);

    if (dbError) {
      return NextResponse.json({ error: `Erro ao deletar do banco: ${dbError.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Produto removido com sucesso!' });

  } catch (error: any) {
    return NextResponse.json({ error: `Erro interno: ${error.message}` }, { status: 500 });
  }
}