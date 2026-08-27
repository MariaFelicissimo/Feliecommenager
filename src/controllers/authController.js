import User from '../models/User.js';

// --- AUTENTICAÇÃO ---

export const login = async (req, res) => {
    try {
        const { email, senha } = req.body;
        const usuario = await User.findOne({ where: { email } });

        if (!usuario || usuario.senha !== senha) {
            // Se for requisição HTML de formulário
            if (req.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
                return res.redirect('/login?erro=dados_invalidos');
            }
            return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
        }

        // Se o login for feito via formulário HTML direto, redireciona para o dashboard
        if (req.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
            return res.redirect('/dashboard');
        }

        // Se for requisição via Fetch/API (JSON)
        return res.json({ mensagem: 'Login realizado com sucesso!', usuario });
    } catch (error) {
        return res.status(500).json({ erro: 'Erro ao realizar login.' });
    }
};

export const cadastrar = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        const usuarioExiste = await User.findOne({ where: { email } });

        if (usuarioExiste) {
            if (req.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
                return res.redirect('/cadastro?erro=email_cadastrado');
            }
            return res.status(400).json({ erro: 'E-mail já cadastrado.' });
        }

        await User.create({ nome, email, senha });

        if (req.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
            return res.redirect('/login');
        }

        return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
        return res.status(500).json({ erro: 'Erro ao cadastrar usuário.' });
    }
};

// --- CONFIGURAÇÕES DO PERFIL / VENDEDOR ---

export const obterPerfil = async (req, res) => {
    try {
        const usuario = await User.findOne();

        if (!usuario) {
            return res.json({
                tipoPessoa: 'CNPJ',
                usarNF: true,
                percentualNF: 6.0,
                tipoMargemPadrao: 'percentual',
                usarEmbalagem: true,
                custoEmbalagem: 2.50,
                usarGasolina: true,
                custoGasolina: 1.50,
                usarOutros: false,
                custoOutros: 0.00
            });
        }

        return res.json(usuario);
    } catch (error) {
        return res.status(500).json({ erro: 'Erro ao carregar dados do perfil.' });
    }
};

export const atualizarPerfil = async (req, res) => {
    try {
        const { 
            tipoPessoa, 
            usarNF, 
            percentualNF, 
            tipoMargemPadrao, 
            usarEmbalagem, 
            custoEmbalagem, 
            usarGasolina, 
            custoGasolina, 
            usarOutros, 
            custoOutros 
        } = req.body;

        let usuario = await User.findOne();

        if (usuario) {
            await usuario.update({
                tipoPessoa,
                usarNF,
                percentualNF,
                tipoMargemPadrao,
                usarEmbalagem,
                custoEmbalagem,
                usarGasolina,
                custoGasolina,
                usarOutros,
                custoOutros
            });
        } else {
            usuario = await User.create(req.body);
        }

        return res.json({ 
            mensagem: 'Configurações de perfil e margem salvas com sucesso!', 
            perfil: usuario 
        });
    } catch (error) {
        return res.status(500).json({ erro: 'Erro ao salvar configurações do perfil.' });
    }
};