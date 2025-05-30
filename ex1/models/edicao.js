const mongoose = require('mongoose');

const EdicaoSchema = new mongoose.Schema({
  _id: String,
  anoEdição: String,
  musicas: [{
    id: String,
    link: String,
    título: String,
    país: String,
    compositor: String,
    intérprete: String,
    letra: String
  }],
  organizacao: String,
  vencedor: String
}, { versionKey: false });

module.exports = mongoose.model('Edicao', EdicaoSchema, 'edicoes'); // 'edicoes' é o nome da coleção no MongoDB