const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '14253679',
    database: process.env.DB_NAME || 'feliecommenager',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const criarTabelaPerfil = async () => {
    const createTableSQL = `
        CREATE TABLE IF NOT EXISTS perfis (
            id INT AUTO_INCREMENT PRIMARY KEY,
            tipo_margem_padrao VARCHAR(20) DEFAULT 'percentual',
            usar_nf TINYINT(1) DEFAULT 0,
            percentual_nf DECIMAL(5,2) DEFAULT 0.00,
            usar_embalagem TINYINT(1) DEFAULT 0,
            custo_embalagem DECIMAL(10,2) DEFAULT 0.00,
            usar_gasolina TINYINT(1) DEFAULT 0,
            custo_gasolina DECIMAL(10,2) DEFAULT 0.00,
            usar_outros TINYINT(1) DEFAULT 0,
            custo_outros DECIMAL(10,2) DEFAULT 0.00
        );
    `;

    const insertInitialSQL = `
        INSERT IGNORE INTO perfis (id) VALUES (1);
    `;

    try {
        await pool.query(createTableSQL);
        await pool.query(insertInitialSQL);
        console.log('✅ Banco MySQL conectado e tabela "perfis" pronta!');
    } catch (error) {
        console.error('❌ Erro no banco de dados MySQL:', error);
    }
};
const express = require('express');
const app = express();

// IMPORTANTE: Necessário para o Express conseguir ler dados em JSON enviados pelo front-end
app.use(express.json());

// Objeto temporário para guardar os dados do perfil (ou substitua pela gravação no seu banco de dados)
let configuracoesPerfil = {
    usarNF: false,
    percentualNF: 0,
    usarEmbalagem: false,
    custoEmbalagem: 0,
    usarGasolina: false,
    custoGasolina: 0,
    usarOutros: false,
    custoOutros: 0
};

// 1. Rota que o front-end chama ao carregar a página para preencher os campos
app.get('/api/perfil', (req, res) => {
    res.json(configuracoesPerfil);
});

// 2. Rota que o front-end chama ao clicar em "Salvar Configurações"
app.post('/api/perfil', (req, res) => {
    try {
        configuracoesPerfil = req.body;
        console.log('Dados salvos:', configuracoesPerfil);
        res.status(200).json({ success: true, message: 'Salvo com sucesso!' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Certifique-se de que seu servidor está ouvindo a porta (ex: 3000)
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});

criarTabelaPerfil();

module.exports = pool;