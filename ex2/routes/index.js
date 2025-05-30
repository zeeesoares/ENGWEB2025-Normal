var express = require('express');
var router = express.Router();
var axios = require('axios');

/* GET home page. */
router.get('/', function(req, res, next) {
  axios.get('http://localhost:25000/edicoes') 
    .then(response => {
      res.render('index', { title: 'Eurovisão', edicoes: response.data });
    })
    .catch(error => {
      console.error('Erro ao buscar edições:', error);
      res.status(500).send('Erro ao buscar edições');
    });
});


router.get('/:id', function(req, res, next) {
  const id = req.params.id;
  axios.get('http://localhost:25000/edicoes/' + id) 
    .then(response => {
      res.render('edicao', { title: 'Eurovisão', edicao: response.data });
    })
    .catch(error => {
      console.error('Erro ao buscar edições:', error);
      res.status(500).send('Erro ao buscar edições');
    });
});

router.get('/paises/:id', function(req, res, next) {
  const id = req.params.id;
  axios.get('http://localhost:25000/paises/' + id) 
    .then(response => {
      res.render('pais', { title: 'Eurovisão - Países', pais : id ,participacoes: response.data });
    })
    .catch(error => {
      console.error('Erro ao buscar países:', error);
      res.status(500).send('Erro ao buscar países');
    });
});


module.exports = router;
