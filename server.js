//Definição da Rigorozidade da escrita do código
'use strict'

//Set das Instâncias 
const http = require('http');
const debug = require('debug')('nodestr:server');
const express = require('express');

//Importação da Rota
const routes = require('./routes');

//Criação da app e definição da porta
const app = express();
const port = 3000;
app.set('port', port);

//Execução da Rota
app.use(routes);

//Criação do Servidor
const server = http.createServer(app);

//Execução da app
app.use('/', routes);

server.listen(port);
console.log("Porta da app " + port);