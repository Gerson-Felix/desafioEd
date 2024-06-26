'use strict'

const express = require('express');
const router = express.Router();
const fs = require('fs');
//const province = require('../province.json');

//Manipulação do JSON
const _ = require('lodash');
const Provincia = require('../models/provinciaModel');

//Upload
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '/uploads/'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Função para criar Província
async function createProvince(jsonUploadPath) {
    const province = require(jsonUploadPath);

    let filtro = [];
    _.forEach(province.Angola.Provincias, (v, k) => {
        filtro[k] = v.nome
    });

    const nome = [];
    for (let i = 0; i < filtro.length; i++) {
        nome[i] = new Provincia({ nome: filtro[i] });
    }

    const allProvincias = [];
    for (let i = 0; i < filtro.length; i++) {
        allProvincias[i] = await nome[i].save();
    }

    return allProvincias;
}
//Rescrever as provincias
function mostrarProvincias(provincias) {
    const provincia = [provincias.length];

    for (let i = 0; i < provincias.length; i++) {
        provincia[i] = {
            id: provincias[i]._id,
            nome: provincias[i].nome
        };
    }
    return provincia;
}

//Pesquisar se existe Províncias
router.get('/provincias', async (req, res) => {
    try {
        const provincias = await Provincia.find();
        const provincia = mostrarProvincias(provincias);
        if (_.isEmpty(provincia)){
            res.status(400).json({ info: "Nenhuma província Listada. Carrega o ficheiro JSON das províncias usando o POST"});
        } else {
            res.status(200).json(provincia);
        }
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
});

//Cadastro da Província com API
router.post('/provincias', upload.single('file'), async (req, res) => {
    const pathFind = path.join(__dirname, '/uploads/');

    if (!req.file && !fs.existsSync(pathFind.includes('.json'))) {
        return res.status(400).json({
            info: 'Nenhum JSON carregado'
        });
    } else {
        res.status(200).json(await createProvince(req.file.path));
    }
});

module.exports = router;