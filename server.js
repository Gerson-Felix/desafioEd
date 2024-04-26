//Definição da Rigorozidade da escrita do código
'use strict'

//Set das Instâncias 
const http = require('http');
const debug = require('debug')('nodestr:server');
const express = require('express');
const swaggerUi = require('swagger-ui-express');

//Importações
const routes = require('./routes');
const swaggerJson = require('./src/swagger.json');


//Criação da app e definição da porta
const app = express();
const port = 3000;
app.set('port', port);

//Execução da Rota
app.use(routes);

//Documentação da API
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJson));

//Criação do Servidor
const server = http.createServer(app);

//Execução da app
app.use('/', routes);

server.listen(port);
console.log("Porta da app " + port);