/*
O EJS é uma engine de visualização, com ele conseguimos 
de uma maneira fácil e simples transportar dados do back-end
para o front-end, basicamente conseguimos utilizar códigos 
em javascript no html de nossas páginas.

Para isso vamos precisar da seguinte estrutura de arquivos:

- public/
-- css/
--- styles.css

- views/
-- layout.ejs
--- pages/
---- about.ejs
---- contact.ejs
---- home.ejs

- package.json
- server.js

Agora no seu console digite npm install express ejs express-ejs-layouts faker body-parser nodemon --save.
Dessa forma o npm vai baixar os pacotes e já inserir eles nas dependências do nosso projeto, dentro do package.json.

Pacote	Descrição
express	É o pacote mais simples para criarmos as rotas do nosso app
ejs	É o pacote responsável pela engine EJS
express-ejs-layouts	Usamos ele para conseguirmos enviar dados para nossas páginas ejs pelo express.
faker	Usamos ele para gerar algumas informações aleatórias como Nome, email, imagens. (Útil para testes)
nodemon	Pacote usado para subir sua aplicação com a vantagem de que a cada vez que alterar ou criar um arquivo js ele reinicia automaticamente.

*/
/*
Express é o framework web mais popular, e é a biblioteca subjacente para uma série de outros frameworks populares de Nodes. Fornece mecanismos para:

Gerencia as requisições de diferentes requisições e rotas e URLs.
Combinar com mecanismos de renderização de "view" para gerar respostas inserindo dados em modelos.
Definir as configurações comuns da aplicação web, como a porta a ser usada para conexão e a localização dos modelos que são usados para renderizar a resposta.
Adicionar em qualquer ponto da requisição um "middleware" para interceptar processar ou pré-processar e tratamentar à mesma.
Equanto o Express é bastante minimalista, os desenvolvedores criam pacotes de middleware para resolver quase todos os problemas no desenvolvimento web. Há bibliotecas 
para trabalhar com cookies, sessões, login de usuários, parametros de URL, dados em requisições POST, cabeçalho de segurança e entre tantos outros. Você pode achar uma lista de pacote de middleware 
mantido pela equipe Express em Express Middleware (juntamente com uma lista de alguns pacotes populares de terceiros).

Node.js e um interpretador,que roda fora dos navegadores

*/

//exportando o express 
const express = require('express');
//criando a variavel app que vai recerber o express
const app = express();
/*importando o bary-parser que permite traduzir os dados pegos pelo formulario em um estrutura javascripit
ou seja o body_parser vai decodificar os dados recebidos no formulario
*/
const body_parser = require('body-parser');
//exportando database
const connection = require('./database/database');
const modelPergunta = require('./database/Pergunta');
const modelResposta = require('./database/Respostas');
// configurando DataBase
connection
    .authenticate()
    .then(() => {
        console.log('conexao feita com o banco de dados');
    })
    .catch(msgErr => {
        console.log(msgErr);
    });
//estou dizendo para o express usar o ejs como motor html
app.set('view engine', 'ejs');
//configurando o body_parser
app.use(body_parser.urlencoded({ extended: false })); /*
A extendedopção permite escolher entre analisar os dados codificados em URL com a querystringbiblioteca 
(quando false) ou a qsbiblioteca (quando true). A sintaxe "estendida" permite que objetos e matrizes avançados 
sejam codificados no formato codificado por URL, permitindo uma experiência 
semelhante a JSON com codificado por URL. Para mais informações, consulte a biblioteca qs .
*/
//configurando o body_parser para que leia dados em json
app.use(body_parser.json());

app.use(express.static('public'));
//roda principal da aplicacao
app.get("/", (req, res) => {
    modelPergunta.findAll({
        raw: true, order: [ //ordenado os registro da tabela,foi criado um atributo ordem (array) que recebeu um outro array com o parametro id que o valor que vamos usar para orderna e o parametro DESC a ordem que vamos usar decrecente
            ['id', 'DESC'] // ASC =crecendo DESC = decrecente
        ]
    }).then(perguntas => { //findAall metodo que puxa os dados da tabela perguntas raw true quer dizer que sera feita uma pesquisa sem detalhes
        res.render('index', {
            perguntas: perguntas
        });
    })
});
//criando uma nova rota
app.get("/perguntar", (req, res) => {
    res.render("perguntar");
});
//criando requisicao post para receber o formulario
app.post("/saveres", (req, res) => {
    const titulo = req.body.titulo;
    const descricao = req.body.descricao;
    //armazenando no banco de dados as perguntas
    modelPergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect('/');
    }).catch(msgErr => {
        console.log(msgErr);
    });
});

app.get("/pergunta/:id", (req, res) => {
    const id = req.params.id;
    modelPergunta.findOne({ //find - Procure um elemento específico no banco de dados
        where: { id: id }
    }).then(pergunta => {
        if (pergunta != undefined) {
            modelResposta.findAll({//findAll - Pesquise vários(todos) elementos no banco de dados
                where: { perguntaid: pergunta.id },
                order:[['id','DESC']]
            }).then(respostas => {
                res.render("pergunta", {
                    pergunta: pergunta,
                    respostas: respostas
                });
            });
        } else {
            res.redirect("/");
        }
    });
});

//rota de armazenamento das respostas
app.post("/saveresposta", (req, res) => {
    const resposta = req.body.resposta;
    const perguntaid = req.body.perguntaid;
    modelResposta.create({
        resposta: resposta,
        perguntaid: perguntaid
    }).then(() => {
        res.redirect("/pergunta/" + perguntaid);

    }).catch(err => {
        res.send(err);
    })
});

//abrindo servidor OBS CONTROL C PARA O SERVIDOR
app.listen(8080, err => {
    if (err) {
        console.log("servodor com erro");
    } else {
        console.log("servidor rodando");
    }
});
