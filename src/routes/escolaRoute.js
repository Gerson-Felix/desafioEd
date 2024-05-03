'use strict'

const express = require('express');
const router = express.Router();
const provinciaRoute = require('./provinciaRoute');
const Escola = require('../models/escolaModel')
const Provincia = require('../models/provinciaModel');
//Manipulação do Excel
const _ = require('lodash');
const fs = require('fs');
const xslx = require('node-xlsx');

const { json } = require('body-parser');

//Upload
const multer = require('multer');
const path = require('path');
const { log } = require('console');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '/uploads/'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

//Pegar o id da província
async function idProvincia(nomeProvincia) {
    try {
        const object = await Provincia.find({ nome: nomeProvincia });
        return object[0]._id;
    } catch (error) {
        return error;
    }
}
//Pegar o nome da província
async function nomeProvincia(idProvincia) {
    try {
        const object = await Provincia.find({ _id: idProvincia });
        return object[0].nome;
    } catch (error) {
        return error;
    }
}
//Pegar as escolas
async function mostrarEscola(escolas) {
    const escola = [escolas.length];

    for (let i = 0; i < escolas.length; i++) {
        escola[i] = {
            id: escolas[i]._id,
            nome: escolas[i].nome,
            email: escolas[i].email,
            numSalas: escolas[i].numSalas,
            provincia: await nomeProvincia(escolas[i].provincia_id)
        };
    }
    return escola;
}

//Cosultar todas as escolas
router.get('/escola', async (req, res) => {
    try {
        const escolas = await Escola.find();
        const escola = await mostrarEscola(escolas);

        if (_.isEmpty(escola)) {
            res.status(400).json({ info: "Nenhuma escola Listada" });
        } else {
            res.status(200).json(escola);
        }

    } catch (error) {
        res.status(500).json({ message: "error.message" });
    }
});

//Cadastrar Escolas
router.post('/escola', async (req, res) => {

    const id = await idProvincia(req.body.provincia);

    if (_.isEmpty(id)) {
        res.status(400).json({ message: "Por favor digite a Província da forma certa" });
    } else {
        const escola = new Escola({
            nome: req.body.nome,
            email: req.body.email,
            numSalas: req.body.numSalas,
            provincia_id: id
        });
        try {
            const novaEscola = await escola.save();
            res.status(200).json(novaEscola);
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }
});

//Cadastrar Escolas Dinamicamente
router.post('/escola/excel', upload.single('file'), async (req, res) => {
    const pathFind = path.join(__dirname, '/uploads/');

    if (!req.file && (!fs.existsSync(pathFind.includes('.xslx')) || !fs.existsSync(pathFind.includes('.xsl')))) {
        return res.status(400).json({
            info: 'Nenhum EXCEL carregado'
        });
    } else {
        const workbook = xslx.parse(req.file.path);
        
        let filtro = [];
        let escolas = [];
        if (_.isEqual("Nome,Email,Número de Salas,Província", workbook[0].data[0].toString())) {
            
            _.forEach(workbook[0].data, (v, k) => {
                filtro[k] = v;
            });
            
            for (let i = 1; i < filtro.length; i++) {
                const id = await idProvincia(filtro[i][3]);
                if (_.isEmpty(id)) {
                    res.status(401).json({ message: filtro[i] + "-" + "Por favor digite a Província da forma certa" });
                    continue;
                } else {
                    escolas[i] = new Escola ({
                        nome: filtro[i][0],
                        email: filtro[i][1],
                        numSalas: filtro[i][2],
                        provincia_id: id
                    });
                }
            }
        } else {
            res.status(400).json({ info: "Copie e cole esse cabaçalho ao seu Excel para cada campo. Nome, Email, Número de Salas, Província" });
        }

        const cadastroDinamicoEscolas = [];
        for (let i = 1; i < filtro.length; i++) {
            cadastroDinamicoEscolas[i] = await escolas[i].save();
        }   
        
        res.status(200).json(cadastroDinamicoEscolas);
    }
});

//Consultar apenas uma escola específica
router.get('/escola/:id', async (req, res) => {
    try {
        const escolas = await Escola.find({ _id: req.params.id });
        const escola = await mostrarEscola(escolas);

        if (_.isEmpty(escola)) {
            res.status(400).json({ info: "Nenhuma escola Listada." });
        } else {
            res.status(200).json(escola);
        }

    } catch (error) {
        res.status(500).json({ message: "error.message" });
    }
});

//Actualizar Escola
router.patch('/escola/:id', async (req, res) => {
    const escola = await Escola.find({ _id: req.params.id });

    if (_.isEmpty(req.body.nome && req.body.email && req.body.numSalas && req.body.provincia)) {
        res.status(400).json({ message: "Preencha os campos nome, email, número de salas e província da escola" });
    } else {
        const id = await idProvincia(req.body.provincia);

        if (_.isEmpty(id)) {
            res.status(401).json({ message: "Por favor digite a Província da forma certa" });
        } else {
            escola[0].nome = req.body.nome;
            escola[0].email = req.body.email;
            escola[0].numSalas = req.body.numSalas;
            escola[0].provincia_id = id;

            try {
                const updateEscola = await escola[0].save();
                res.status(200).json(updateEscola);
            } catch (error) {
                res.status(500).json({ message: error });
            }
        }
    }
});

//Deletar Escola
router.delete('/escola/:id', async (req, res) => {
    try {
        await Escola.findByIdAndDelete({ _id: req.params.id }).then(escola => {
            if (_.isEmpty(escola)) {
                res.status(404).json({ message: "Escola não encontrada" });
            } else {
                res.status(200).json({ message: "Escola deletada" });
            }
        });
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

router.use(provinciaRoute); //Importar as Rotas da Provincia para o ficheiro Principal
module.exports = router;