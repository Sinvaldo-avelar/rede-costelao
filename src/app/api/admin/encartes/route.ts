import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 🚀 POST: Recebe o PDF da gerente, salva no Storage e registra na Tabela
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const arquivoPdf = formData.get('encarte') as File | null;

    if (!arquivoPdf) {
      return NextResponse.json({ error: 'Nenhum arquivo PDF foi selecionado.' }, { status: 400 });
    }

    // 1. Gera um nome único para o arquivo não sobrescrever o antigo por erro de cache
    const timestamp = Date.now();
    const nomeArquivo = `encarte-${timestamp}.pdf`;

    // 2. Faz o upload do arquivo físico para dentro do bucket 'encartes' no Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('encartes')
      .upload(nomeArquivo, arquivoPdf, {
        contentType: 'application/pdf',
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      return NextResponse.json({ error: `Erro no Storage: ${uploadError.message}` }, { status: 500 });
    }

    // 3. Pega a URL pública oficial que o Supabase gerou para esse PDF
    const { data: urlData } = supabase.storage
      .from('encartes')
      .getPublicUrl(nomeArquivo);

    const urlPublicaPdf = urlData.publicUrl;

    // 4. Limpa os encartes antigos da tabela para deixar apenas o atual ativo
    // (Assim a tabela não fica acumulando lixo eletrônico, deixando sempre o mais novo)
    await supabase.from('encartes').delete().neq('id', 0);

    // 5. Salva a nova linha com o link do PDF na tabela 'encartes'
    const { error: dbError } = await supabase
      .from('encartes')
      .insert([
        { 
          pdf_url: urlPublicaPdf, 
          criado_em: new Date().toISOString() 
        }
      ]);

    if (dbError) {
      return NextResponse.json({ error: `Erro no Banco de Dados: ${dbError.message}` }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Encarte Digital atualizado com sucesso!', 
      url: urlPublicaPdf 
    });

  } catch (error: any) {
    return NextResponse.json({ error: `Erro interno: ${error.message}` }, { status: 500 });
  }
}