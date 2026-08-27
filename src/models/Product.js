const db = require('../config/database');

const Product = {
    // Buscar todos os produtos
    async findAll() {
        const [rows] = await db.query('SELECT * FROM produtos');
        return rows;
    },

    // Buscar produto por ID
    async findByPk(id) {
        const [rows] = await db.query('SELECT * FROM produtos WHERE id = ?', [id]);
        return rows[0] || null;
    },

    // Excluir produto por ID
    async destroy(options) {
        const id = options && options.where ? options.where.id : null;
        if (!id) return;
        const [result] = await db.query('DELETE FROM produtos WHERE id = ?', [id]);
        return result;
    }
};

module.exports = Product;