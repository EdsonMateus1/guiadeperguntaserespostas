const Sequelize = require('sequelize');
const connection = require('./database');

//criando tabela Pergunta com dois campos titulo e descricao
const Resposta = connection.define('resposta', {
    resposta: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    perguntaid :{
        type : Sequelize.INTEGER,
        allowNull: false
    }
});
//comando que vai verificar se a tabela existe se nao existir vai ser criado a  tabela
Resposta.sync({ force: false }).then(() => {
    console.log('tabela resposta criada');
});
module.exports = Resposta;