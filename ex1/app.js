var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')
var mongoDB = 'mongodb://127.0.0.1:27017/eurovisao'

mongoose.connect(mongoDB)
var db =  mongoose.connection

db.on('error', console.error.bind(console, 'Erro de conexão ao MongoDB'))
db.once('open',() => console.log('Conexão ao MongoDB realizada com sucesso'))

var indexRouter = require('./routes/index');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

module.exports = app;
