//Definição da Rigorozidade da escrita do código
'use strict'
require('dotenv').config();

//Set das Instâncias 
const http = require('http');
const debug = require('debug')('nodestr:server');
const bodyParser = require('body-parser');
//#
const express = require('express');

//Criação da app
const app = express();
//#

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const swaggerUi = require('swagger-ui-express');
//BD
const mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTIONSTRING).then(() => {
    console.log('Conexão Estabelecida');
}).catch(e => console.log(e));

//Importações
const escolaRoute = require('./src/routes/escolaRoute');
const swaggerJson = require('./src/swagger.json');


//Definição da porta
const port = 3000;
app.set('port', port);

//Execução da Rota
app.use(escolaRoute);

//Documentação da API
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJson));

//Criação do Servidor
const server = http.createServer(app);

//Execução da app
app.use('/escola', bodyParser.json(), escolaRoute);
app.use('/provincias', escolaRoute);

server.listen(port);