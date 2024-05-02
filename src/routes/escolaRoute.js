'use strict'

const express = require('express');
const router = express.Router();
const provinciaRoute = require('./provinciaRoute');
const Escola = require('../models/escolaModel')
const Provincia = require('../models/provinciaModel');
const { isEmpty } = require('lodash');
const { json } = require('body-parser');

//Pegar o id da província
async function idProvincia(nomeProvincia) {
    try {
        const object = await Provincia.find({ nome: nomeProvincia});
        return object[0]._id;
    } catch (error) {
        return error;
    }
}
//Pegar o nome da província
async function nomeProvincia(idProvincia) {
    try {
        const object = await Provincia.find({ _id: idProvincia});
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
         
        if (isEmpty(escola)) {
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

    if (isEmpty(id)) {
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

//Consultar apenas uma escola específica
router.get('/escola/:id', async (req, res) => {
    try {
        const escolas = await Escola.find({ _id: req.params.id});
        const escola = await mostrarEscola(escolas);
         
        if (isEmpty(escola)) {
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
    const escola = await Escola.find({ _id: req.params.id});

    if (isEmpty(req.body.nome && req.body.email && req.body.numSalas && req.body.provincia)) {
        res.status(400).json({ message: "Preencha os campos nome, email, número de salas e província da escola" });
    } else {
        const id = await idProvincia(req.body.provincia);

        if(isEmpty(id)) {
            res.status(400).json({ message: "Por favor digite a Província da forma certa" });
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
        await Escola.findByIdAndDelete({ _id: req.params.id}).then(escola => {
           if (isEmpty(escola)) {
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