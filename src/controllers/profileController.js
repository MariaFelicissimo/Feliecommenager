// Simulação de banco de dados ou estado em memória para as configurações de perfil
let dadosPerfil = {
    tipoPessoa: 'cnpj', // 'cpf' ou 'cnpj'
    documento: '',
    usarNF: true,
    percentualNF: 5.00,
    usarEmbalagem: true,
    custoEmbalagem: 2.00,
    usarGasolina: true,
    custoGasolina: 3.00,
    usarOutros: false,
    custoOutros: 0.00
};

// Função para buscar as configurações atuais do perfil
exports.obterPerfil = (req, res) => {
    try {
        res.status(200).json(dadosPerfil);
    } catch (error) {
        console.error('Erro ao obter perfil:', error);
        res.status(500).json({ success: false, message: 'Erro ao buscar dados do perfil.' });
    }
};

// Função para salvar e aplicar as regras de negócio completas
exports.salvarPerfil = (req, res) => {
    try {
        const {
            tipoPessoa,
            documento,
            usarNF,
            percentualNF,
            usarEmbalagem,
            custoEmbalagem,
            usarGasolina,
            custoGasolina,
            usarOutros,
            custoOutros
        } = req.body;

        // REGRA DE NEGÓCIO: O usuário é obrigado a informar se é CPF ou CNPJ
        if (!tipoPessoa || (tipoPessoa !== 'cpf' && tipoPessoa !== 'cnpj')) {
            return res.status(400).json({ 
                success: false, 
                message: 'Você deve especificar se o cadastro é CPF ou CNPJ.' 
            });
        }

        // REGRA DE NEGÓCIO: Validação do documento obrigatório de acordo com o tipo escolhido
        if (!documento || documento.trim() === '') {
            return res.status(400).json({ 
                success: false, 
                message: `O campo ${tipoPessoa.toUpperCase()} é obrigatório e não pode estar vazio.` 
            });
        }

        // Limpeza básica do documento (removendo caracteres especiais se houver)
        const documentoLimpo = documento.replace(/\D/g, '');

        if (tipoPessoa === 'cpf' && documentoLimpo.length !== 11) {
            return res.status(400).json({ 
                success: false, 
                message: 'CPF inválido. Deve conter exatamente 11 dígitos.' 
            });
        }

        if (tipoPessoa === 'cnpj' && documentoLimpo.length !== 14) {
            return res.status(400).json({ 
                success: false, 
                message: 'CNPJ inválido. Deve conter exatamente 14 dígitos.' 
            });
        }

        // Validação de consistência para alíquotas e custos (não podem ser negativos)
        const nfParsed = parseFloat(percentualNF) || 0;
        const embalagemParsed = parseFloat(custoEmbalagem) || 0;
        const gasolinaParsed = parseFloat(custoGasolina) || 0;
        const outrosParsed = parseFloat(custoOutros) || 0;

        if (nfParsed < 0 || embalagemParsed < 0 || gasolinaParsed < 0 || outrosParsed < 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Os valores de custos e impostos não podem ser negativos.' 
            });
        }

        // Atualização dos dados aplicando as regras validadas
        dadosPerfil = {
            tipoPessoa,
            documento: documentoLimpo,
            usarNF: !!usarNF,
            percentualNF: nfParsed,
            usarEmbalagem: !!usarEmbalagem,
            custoEmbalagem: embalagemParsed,
            usarGasolina: !!usarGasolina,
            custoGasolina: gasolinaParsed,
            usarOutros: !!usarOutros,
            custoOutros: outrosParsed
        };

        console.log('✅ Configurações de perfil atualizadas com sucesso:', dadosPerfil);

        res.status(200).json({ 
            success: true, 
            message: 'Perfil e configurações salvos com sucesso!',
            dados: dadosPerfil 
        });
    } catch (error) {
        console.error('Erro ao salvar perfil:', error);
        res.status(500).json({ success: false, message: 'Erro interno ao salvar o perfil.' });
    }
};