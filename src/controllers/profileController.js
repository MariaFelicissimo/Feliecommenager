const db = require('../config/database');
const number = (value) => Math.max(0, Number(value) || 0);
const format = (row) => ({
    tipoPessoa: row.tipo_pessoa, documento: row.documento, usarNF: Boolean(row.usar_nf), percentualNF: Number(row.percentual_nf),
    usarEmbalagem: Boolean(row.usar_embalagem), custoEmbalagem: Number(row.custo_embalagem),
    usarGasolina: Boolean(row.usar_gasolina), custoGasolina: Number(row.custo_gasolina), usarOutros: Boolean(row.usar_outros), custoOutros: Number(row.custo_outros)
});

exports.obterPerfil = async (req, res) => {
    try {
        await db.ready;
        const [rows] = await db.query('SELECT * FROM perfis WHERE id = 1');
        res.json(format(rows[0]));
    } catch (error) {
        console.error('Erro ao obter perfil:', error.message);
        res.status(500).json({ error: 'Erro ao buscar configurações do perfil.' });
    }
};

exports.salvarPerfil = async (req, res) => {
    try {
        await db.ready;
        const body = req.body;
        const values = [body.tipoPessoa === 'cpf' ? 'cpf' : 'cnpj', String(body.documento || '').replace(/\D/g, ''), !!body.usarNF,
            number(body.percentualNF), !!body.usarEmbalagem, number(body.custoEmbalagem), !!body.usarGasolina,
            number(body.custoGasolina), !!body.usarOutros, number(body.custoOutros)];
        await db.query(`UPDATE perfis SET tipo_pessoa=?, documento=?, usar_nf=?, percentual_nf=?, usar_embalagem=?, custo_embalagem=?, usar_gasolina=?, custo_gasolina=?, usar_outros=?, custo_outros=? WHERE id=1`, values);
        res.json({ success: true, message: 'Configurações salvas no banco de dados.' });
    } catch (error) {
        console.error('Erro ao salvar perfil:', error.message);
        res.status(500).json({ error: 'Erro ao salvar configurações do perfil.' });
    }
};
