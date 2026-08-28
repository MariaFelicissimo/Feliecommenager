const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '14253679',
    database: process.env.DB_NAME || 'feliecommenager',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.ready = (async () => {
    await pool.query(`CREATE TABLE IF NOT EXISTS perfis (
        id INT PRIMARY KEY, tipo_pessoa VARCHAR(10) DEFAULT 'cnpj', documento VARCHAR(20) DEFAULT '',
        usar_nf TINYINT(1) NOT NULL DEFAULT 1, percentual_nf DECIMAL(7,2) NOT NULL DEFAULT 0.00,
        usar_embalagem TINYINT(1) NOT NULL DEFAULT 1, custo_embalagem DECIMAL(12,2) NOT NULL DEFAULT 0.00,
        usar_gasolina TINYINT(1) NOT NULL DEFAULT 1, custo_gasolina DECIMAL(12,2) NOT NULL DEFAULT 0.00,
        usar_outros TINYINT(1) NOT NULL DEFAULT 0, custo_outros DECIMAL(12,2) NOT NULL DEFAULT 0.00,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)`);
    await pool.query('INSERT IGNORE INTO perfis (id) VALUES (1)');
    for (const definition of ["tipo_pessoa VARCHAR(10) DEFAULT 'cnpj'", "documento VARCHAR(20) DEFAULT ''"]) {
        try { await pool.query(`ALTER TABLE perfis ADD COLUMN ${definition}`); }
        catch (error) { if (error.code !== 'ER_DUP_FIELDNAME') throw error; }
    }
    await pool.query(`CREATE TABLE IF NOT EXISTS produtos (
        id INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(255) NOT NULL,
        custoProducao DECIMAL(12,2) NOT NULL DEFAULT 0.00, freteEntrada DECIMAL(12,2) NOT NULL DEFAULT 0.00,
        custoEmbalagem DECIMAL(12,2) NOT NULL DEFAULT 0.00, custoGasolina DECIMAL(12,2) NOT NULL DEFAULT 0.00,
        custoOutros DECIMAL(12,2) NOT NULL DEFAULT 0.00, percentualNF DECIMAL(7,2) NOT NULL DEFAULT 0.00,
        taxaMarketplace DECIMAL(7,2) NOT NULL DEFAULT 0.00, margemLucro DECIMAL(7,2) NOT NULL DEFAULT 0.00,
        custoTotalCalculado DECIMAL(12,2) NOT NULL DEFAULT 0.00, precoVendaCalculado DECIMAL(12,2) NOT NULL DEFAULT 0.00,
        lucroLiquidoCalculado DECIMAL(12,2) NOT NULL DEFAULT 0.00, marketplacePricing JSON NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)`);
    try { await pool.query('ALTER TABLE produtos ADD COLUMN marketplacePricing JSON NULL'); }
    catch (error) { if (error.code !== 'ER_DUP_FIELDNAME') throw error; }
    console.log('✅ Banco MySQL pronto para perfis e produtos.');
})().catch((error) => { console.error('❌ Erro ao preparar o banco MySQL:', error.message); throw error; });

module.exports = pool;
