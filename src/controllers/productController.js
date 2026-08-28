const Product = require('../models/Product');

const numericFields = ['custoProducao', 'freteEntrada', 'custoEmbalagem', 'custoGasolina', 'custoOutros',
    'percentualNF', 'taxaMarketplace', 'margemLucro', 'custoTotalCalculado', 'precoVendaCalculado', 'lucroLiquidoCalculado'];

const normalizeProduct = (body) => {
    const product = { nome: String(body.nome || '').trim(), marketplacePricing: Array.isArray(body.marketplacePricing) ? body.marketplacePricing : [] };
    numericFields.forEach((field) => { product[field] = Math.max(0, Number(body[field]) || 0); });
    return product;
};

exports.listarProdutos = async (req, res) => {
    try { res.json(await Product.findAll()); }
    catch (error) { console.error('Erro ao listar produtos:', error.message); res.status(500).json({ error: 'Erro ao listar produtos.' }); }
};

exports.buscarProdutoPorId = async (req, res) => {
    try {
        const produto = await Product.findByPk(req.params.id);
        if (!produto) return res.status(404).json({ error: 'Produto não encontrado.' });
        res.json(produto);
    } catch (error) { console.error('Erro ao buscar produto:', error.message); res.status(500).json({ error: 'Erro ao buscar produto.' }); }
};

exports.salvarProduto = async (req, res) => {
    try {
        const data = normalizeProduct(req.body);
        if (!data.nome) return res.status(400).json({ error: 'O nome do produto é obrigatório.' });
        const produto = req.body.id ? await Product.update(req.body.id, data) : await Product.create(data);
        if (!produto) return res.status(404).json({ error: 'Produto não encontrado para atualização.' });
        res.status(req.body.id ? 200 : 201).json({ success: true, produto });
    } catch (error) { console.error('Erro ao salvar produto:', error.message); res.status(500).json({ error: 'Erro ao salvar produto no banco de dados.' }); }
};

exports.excluirProduto = async (req, res) => {
    try {
        const deleted = await Product.destroy(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Produto não encontrado.' });
        res.json({ success: true, message: 'Produto excluído com sucesso.' });
    } catch (error) { console.error('Erro ao excluir produto:', error.message); res.status(500).json({ error: 'Erro ao excluir produto.' }); }
};
