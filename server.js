//Definição da Rigorozidade da escrita do código
'use strict'

//Set das Instâncias 
const http = require('http');
const debug = require('debug')('nodestr:server');
const express = require('express');
const { version } = require('os');

//Criação da app e definição da porta
const app = express();
const port = 3000;
app.set('port', port);

//Criação do Servidor
const server = http.createServer(app);
const router = express.Router();

//Rotas
var route = router.get('/', (req, res, next) => {
    res.status(200).send({
        title: "Node Store API",
        version: "0.0.1"
    });
});

//Execução da app
app.use('/', route);

server.listen(port);
console.log("Porta da app " + port);