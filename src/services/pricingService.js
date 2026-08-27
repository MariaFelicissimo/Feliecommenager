export function calcularPrecoVenda(dadosProduto, perfilVendedor = {}) {
    // 1. Verificação do Tipo de Pessoa e Chave Geral da Nota Fiscal
    const eCNPJ = perfilVendedor.tipoPessoa === 'CNPJ';
    
    // Liga/Desliga individual da Nota Fiscal (no produto ou no perfil)
    const nfAtiva = dadosProduto.usar_nf !== undefined 
        ? dadosProduto.usar_nf 
        : (perfilVendedor.usarNF !== undefined ? perfilVendedor.usarNF : true);

    // % da NF entra apenas se for CNPJ e se a opção de NF estiver ativada
    const percentualNF = (eCNPJ && nfAtiva) 
        ? (parseFloat(dadosProduto.percentual_nf || perfilVendedor.percentualNF) || 0) 
        : 0;

    // 2. Custos Extras Globais (respeitando os switches liga/desliga)
    const usarEmbalagem = dadosProduto.usar_embalagem !== undefined 
        ? dadosProduto.usar_embalagem 
        : (perfilVendedor.usarEmbalagem ?? true);
        
    const usarGasolina = dadosProduto.usar_gasolina !== undefined 
        ? dadosProduto.usar_gasolina 
        : (perfilVendedor.usarGasolina ?? true);

    const usarOutros = dadosProduto.usar_outros !== undefined 
        ? dadosProduto.usar_outros 
        : (perfilVendedor.usarOutros ?? true);

    const custoEmbalagem = usarEmbalagem ? (parseFloat(dadosProduto.custo_embalagem ?? perfilVendedor.custoEmbalagem) || 0) : 0;
    const custoGasolina = usarGasolina ? (parseFloat(dadosProduto.custo_gasolina ?? perfilVendedor.custoGasolina) || 0) : 0;
    const custoOutros = usarOutros ? (parseFloat(dadosProduto.custo_outros ?? perfilVendedor.custoOutros) || 0) : 0;

    const totalCustosExtrasPerfil = custoEmbalagem + custoGasolina + custoOutros;

    // 3. Custos de Produção/Aquisição e Marketplace
    const custoFabricacao = parseFloat(dadosProduto.custo_fabricacao) || 0;
    const freteCusto = parseFloat(dadosProduto.frete_custo) || 0;
    
    const impostoPercentualProduto = parseFloat(dadosProduto.imposto_percentual) || 0;
    const taxaMktPercentual = parseFloat(dadosProduto.taxa_marketplace_percentual) || 0;
    const taxaFixaMkt = parseFloat(dadosProduto.taxa_fixa_marketplace) || 0;

    // 4. Tipo de Margem de Lucro: 'percentual' (%) ou 'fixo' ($)
    const tipoMargem = dadosProduto.tipo_margem || 'percentual'; // Padrão: percentual
    const valorMargemInformado = parseFloat(dadosProduto.margem_lucro_desejada) || 0;

    let precoVendaSugerido = 0;
    let lucroLiquidoReais = 0;
    let margemPercentualEfetiva = 0;

    // Soma das deduções percentuais (impostos + NF + taxa mkt)
    const somaDeducoesPercentual = (impostoPercentualProduto + percentualNF + taxaMktPercentual) / 100;

    if (tipoMargem === 'fixo') {
        // --- LUCRO EM VALOR FIXO (R$) ---
        const custoTotalComLucroFixo = custoFabricacao + freteCusto + taxaFixaMkt + totalCustosExtrasPerfil + valorMargemInformado;

        if (somaDeducoesPercentual >= 1) {
            throw new Error('A soma dos impostos e taxas do marketplace não pode atingir ou ultrapassar 100%.');
        }

        precoVendaSugerido = custoTotalComLucroFixo / (1 - somaDeducoesPercentual);
        lucroLiquidoReais = valorMargemInformado;
        margemPercentualEfetiva = (lucroLiquidoReais / precoVendaSugerido) * 100;

    } else {
        // --- LUCRO EM PERCENTUAL (%) ---
        const margemDesejadaPercentual = valorMargemInformado;
        const totalDeducoesComMargem = somaDeducoesPercentual + (margemDesejadaPercentual / 100);

        if (totalDeducoesComMargem >= 1) {
            throw new Error('A soma dos impostos, NF, taxas e margem desejada não pode atingir ou ultrapassar 100%.');
        }

        const custoTotalFixoReais = custoFabricacao + freteCusto + taxaFixaMkt + totalCustosExtrasPerfil;
        precoVendaSugerido = custoTotalFixoReais / (1 - totalDeducoesComMargem);
        lucroLiquidoReais = precoVendaSugerido * (margemDesejadaPercentual / 100);
        margemPercentualEfetiva = margemDesejadaPercentual;
    }

    // Valor em R$ emitido na Nota Fiscal (Proporcional ao preço final)
    const valorEmitidoNF = precoVendaSugerido * (percentualNF / 100);

    return {
        precoVendaSugerido: precoVendaSugerido.toFixed(2),
        lucroLiquidoReais: lucroLiquidoReais.toFixed(2),
        margemPercentualEfetiva: margemPercentualEfetiva.toFixed(2),
        valorEmitidoNF: valorEmitidoNF.toFixed(2),
        percentualNFAplicado: percentualNF,
        tipoMargem
    };
}