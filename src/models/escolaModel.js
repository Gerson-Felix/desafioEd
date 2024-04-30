'use strict'

const mongoose = require('mongoose');
const Provincia = require('./provinciaModel');

const escolaSchema = new mongoose.Schema({
    nome: {type: String, required: true},
    email: {type: String, required: true},
    numSalas: {type: Number, required: true},
    provincia_id: {type: mongoose.Schema.Types.ObjectId, ref: Provincia},
    criadoEm: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Escola', escolaSchema);