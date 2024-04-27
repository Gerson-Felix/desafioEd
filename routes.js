const express = require('express');

const router = express.Router();

//Rotas
var route = router.get('/', (req, res, next) => {
    res.status(200).send({
        alerta: "Por favor adiciona a url /api-docs"
    });
});

module.exports = router;