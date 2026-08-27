const Product = require('../models/Product'); // Importa o model que gerencia os produtos no banco

// 1. Listar todos os produtos
exports.listarProdutos = async (req, res) => {
    try {
        const produtos = await Product.findAll();
        res.json(produtos);
    } catch (err) {
        console.error('❌ Erro ao listar produtos:', err.message);
        res.status(500).json({ error: 'Erro ao listar produtos' });
    }
};

// 2. Buscar produto por ID
exports.buscarProdutoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const produto = await Product.findByPk(id);
        
        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }
        
        res.json(produto);
    } catch (err) {
        console.error('❌ Erro ao buscar produto:', err.message);
        res.status(500).json({ error: 'Erro ao buscar produto' });
    }
};

// 3. Cadastrar / Salvar novo produto (FUNÇÃO QUE FALTAVA)
exports.salvarProduto = async (req, res) => {
    try {
        const {
            nome,
            custoProducao,
            freteEntrada,
            custoEmbalagem,
            custoGasolina,
            custoOutros,
            percentualNF,
            taxaMarketplace,
            margemLucro,
            custoTotalCalculado,
            precoVendaCalculado,
            lucroLiquidoCalculado
        } = req.body;

        if (!nome || nome.trim() === '') {
            return res.status(400).json({ error: 'O nome do produto é obrigatório.' });
        }

        // Cria o registro no banco usando o Sequelize
        const novoProduto = await Product.create({
            nome,
            custoProducao,
            freteEntrada,
            custoEmbalagem,
            custoGasolina,
            custoOutros,
            percentualNF,
            taxaMarketplace,
            margemLucro,
            custoTotalCalculado,
            precoVendaCalculado,
            lucroLiquidoCalculado
        });

        console.log('✅ Produto salvo no banco com sucesso:', novoProduto.nome);
        return res.status(201).json({ success: true, message: 'Produto cadastrado com sucesso!', produto: novoProduto });

    } catch (err) {
        console.error('❌ Erro ao salvar produto:', err.message);
        res.status(500).json({ error: 'Erro ao salvar produto no banco de dados.' });
    }
};

// 4. Excluir produto
exports.excluirProduto = async (req, res) => {
    try {
        const { id } = req.params;
        const produto = await Product.findByPk(id);
        
        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        await produto.destroy();
        res.json({ success: true, message: 'Produto excluído com sucesso' });
    } catch (err) {
        console.error('❌ Erro ao excluir produto:', err.message);
        res.status(500).json({ error: 'Erro ao excluir produto' });
    }
};