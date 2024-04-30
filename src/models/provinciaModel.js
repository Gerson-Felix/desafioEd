'use strict'

const mongoose = require('mongoose');

const provinciaSchema = new mongoose.Schema({
    nome: {type: String, required: true}
});

module.exports = mongoose.model('Provincia', provinciaSchema)