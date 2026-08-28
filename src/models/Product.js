const db = require('../config/database');

const columns = ['nome', 'custoProducao', 'freteEntrada', 'custoEmbalagem', 'custoGasolina', 'custoOutros',
    'percentualNF', 'taxaMarketplace', 'margemLucro', 'custoTotalCalculado', 'precoVendaCalculado',
    'lucroLiquidoCalculado', 'marketplacePricing'];

const valuesFor = (data) => columns.map((column) => column === 'marketplacePricing'
    ? JSON.stringify(data[column] || []) : data[column] ?? 0);

const Product = {
    async findAll() {
        await db.ready;
        const [rows] = await db.query('SELECT * FROM produtos ORDER BY id DESC');
        return rows;
    },
    async findByPk(id) {
        await db.ready;
        const [rows] = await db.query('SELECT * FROM produtos WHERE id = ?', [id]);
        return rows[0] || null;
    },
    async create(data) {
        await db.ready;
        const [result] = await db.query(`INSERT INTO produtos (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`, valuesFor(data));
        return this.findByPk(result.insertId);
    },
    async update(id, data) {
        await db.ready;
        const assignments = columns.map((column) => `${column} = ?`).join(', ');
        const [result] = await db.query(`UPDATE produtos SET ${assignments} WHERE id = ?`, [...valuesFor(data), id]);
        return result.affectedRows ? this.findByPk(id) : null;
    },
    async destroy(id) {
        await db.ready;
        const [result] = await db.query('DELETE FROM produtos WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = Product;
