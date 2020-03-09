const Sequelize = require("sequelize");
//configurando sequelize que permite criar bancos de dados convertendo comando javascripts em sql
const connection = new Sequelize("GuiaPerguntas", "root", "94236924", {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;