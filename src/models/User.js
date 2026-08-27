import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // Apontando para a pasta config

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    email: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true,
        validate: {
            isEmail: true
        }
    },
    tipo_usuario: { 
        type: DataTypes.ENUM('PF', 'CNPJ'), 
        allowNull: false 
    },
    documento: { 
        type: DataTypes.STRING, 
        allowNull: false,
        unique: true 
    },
    inscricao_estadual: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    senha: { 
        type: DataTypes.STRING, 
        allowNull: false 
    }
}, {
    tableName: 'usuarios'
});

export default User;