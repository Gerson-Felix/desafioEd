'use strict'

const express = require('express');
const router = express.Router();
const provinciaRoute = require('./provinciaRoute');
const Escola = require('../models/escolaModel')

//Rotas
router.get('/', async (req, res) => {
    try {
        const escolas = Escola.find();
        res.json(escolas);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});
// router.get('/', (req, res, next) => {
//     res.status(200).send({
//         alerta1: "Para o SWAGGER - Por favor adiciona a url /api-docs", alerta2: "Para a BASE DE DADOS - Por favor adiciona a url :8081"
//     });
// });

router.use(provinciaRoute); //Importar as Rotas da Provincia para o ficheiro Principal
module.exports = router;