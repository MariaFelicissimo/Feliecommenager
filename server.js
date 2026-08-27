const express = require('express');
const path = require('path');
const app = express();

// Importação dos Controllers
const productController = require('./controllers/productController');
const profileController = require('./controllers/profileController');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (CSS, JS, imagens) da pasta src/public
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// ROTAS DE PÁGINAS (Views)
// ==========================================

// Página Inicial (index.html dentro de src/public)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Demais páginas dentro de src/views
app.get('/produtos', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'produtos.html'));
});

app.get('/produto-detalhe', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'produto-detalhe.html'));
});

app.get('/precificacao', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'precificacao.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

app.get('/perfil', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'perfil.html'));
});

app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'cadastro.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// ==========================================
// ROTAS DA API (JSON)
// ==========================================

// Perfil
app.get('/api/perfil', profileController.obterPerfil);

// Produtos (CRUD completo com MySQL/Sequelize)
app.get('/api/produtos', productController.listarProdutos);
app.get('/api/produtos/:id', productController.buscarProdutoPorId);

if (typeof productController.salvarProduto === 'function') {
    app.post('/api/produtos', productController.salvarProduto);
}

app.delete('/api/produtos/:id', productController.excluirProduto);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`🔗 Acesse: http://localhost:${PORT}`);
});