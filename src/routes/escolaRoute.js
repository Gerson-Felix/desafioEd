const express = require('express');

const router = express.Router();

//Rotas
router.get('/', (req, res, next) => {
    res.status(200).send({
        alerta1: "Para o SWAGGER - Por favor adiciona a url /api-docs", alerta2: "Para a BASE DE DADOS - Por favor adiciona a url :8081"
    });
});

module.exports = router;