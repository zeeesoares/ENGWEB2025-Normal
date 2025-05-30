var express = require('express');
var router = express.Router();
var Edicao = require('../controllers/edicoes')

router.get('/edicoes', function(req, res, next){
  if (req.query.org) {
    Edicao.getByOrg(req.query.org)
      .then(data => res.status(200).jsonp(data))
      .catch(erro => res.status(500).jsonp(erro))
    return
  }
  Edicao.list()
  .then(data => res.status(200).jsonp(data))
  .catch(erro => res.status(500).jsonp(erro))
})


router.get('/paises/:id', function(req, res, next){
  var id = req.params.id
  Edicao.getPais(id)
    .then(data => res.status(200).jsonp(data))
    .catch(erro => res.status(500).jsonp(erro))
  }
)

router.get('/paises', function(req, res, next){

  if (req.query.papel == "org") {
    Edicao.getPaiseByORg()
      .then(data => res.status(200).jsonp(data))
      .catch(erro => res.status(500).jsonp(erro))
    return
  }
  if (req.query.papel = "venc") {
    Edicao.getPaiseByVenc()
      .then(data => res.status(200).jsonp(data))
      .catch(erro => res.status(500).jsonp(erro))
    return
  }
})


router.get('/interpretes', function(req, res, next){
  Edicao.getInterpretes()
    .then(data => res.status(200).jsonp(data))
    .catch(erro => res.status(500).jsonp(erro))
}
)

router.get('/edicoes/:id', function(req, res, next){
  var id = req.params.id
  Edicao.getById(id)
  .then(data => res.status(200).jsonp(data))
  .catch(erro => res.status(500).jsonp(erro))
})


router.delete('/edicoes/:id', function(req, res, next) {
  var id = req.params.id
  Edicao.delete(id)
    .then(data => res.jsonp(data))
    .catch(erro => res.jsonp(erro))
});

router.put('/edicoes/:id', function(req, res, next) {
  Edicao.update(req.params.id,req.body)
    .then(data => res.jsonp(data))
    .catch(erro => res.jsonp(erro))
});

router.post('/edicoes', function(req, res, next) {
  console.log(req.body)
  Edicao.insert(req.body)
    .then(data => res.status(201).jsonp(data))
    .catch(erro => res.jsonp(erro))
});

module.exports = router;