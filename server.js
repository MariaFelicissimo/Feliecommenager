const express = require('express');
const path = require('path');
const app = express();

// Importação dos Controllers (apontando corretamente para a pasta src/)
const productController = require('./src/controllers/productController');
const profileController = require('./src/controllers/profileController');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (CSS, JS, imagens) da pasta src/public
app.use(express.static(path.join(__dirname, 'src', 'public')));

// ==========================================
// ROTAS DE PÁGINAS (Views)
// ==========================================

// Página Inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'public', 'index.html'));
});

// Demais páginas dentro de src/views
app.get('/produtos', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'views', 'produtos.html'));
});

app.get('/produto-detalhe', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'views', 'produto-detalhe.html'));
});

app.get('/precificacao', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'views', 'precificacao.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'views', 'dashboard.html'));
});

app.get('/perfil', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'views', 'perfil.html'));
});

app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'views', 'cadastro.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'views', 'login.html'));
});

// ==========================================
// ROTAS DA API (JSON)
// ==========================================

// Perfil
app.get('/api/perfil', profileController.obterPerfil);

// Produtos (CRUD completo com MySQL)
app.get('/api/produtos', productController.listarProdutos);
app.get('/api/produtos/:id', productController.buscarProdutoPorId);

if (typeof productController.salvarProduto === 'function') {
    app.post('/api/produtos', productController.salvarProduto);
}

app.delete('/api/produtos/:id', productController.excluirProduto);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('--------------------------------------------------');
    console.log(`🚀 Servidor inicializado com sucesso!`);
    console.log(`📡 Ambiente rodando na porta: ${PORT}`);
    console.log(`🔗 URL local: http://localhost:${PORT}`);
    console.log('--------------------------------------------------');
});