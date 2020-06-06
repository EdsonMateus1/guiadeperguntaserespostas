const Sequelize = require('sequelize');
const connection = require('./database');

//criando tabela Pergunta com dois campos titulo e descricao
const Pergunta = connection.define('pergunta', {
    titulo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});
//comando que vai verificar se a tabela existe se nao existir vai ser criado a  tabela
Pergunta.sync({ force: false }).then(() => {
    console.log('tabela criada');
});
module.exports = Pergunta;