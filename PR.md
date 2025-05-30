#  Relatório Técnico - Implementação Eurovision API


## Estrutura do Projeto

```
ENGWEB2025-Normal/
├── ex1/
│   ├── models/              # Modelos Mongoose
│   ├── controllers/         # Controller
│   ├── routes/              # Rotas da API
│   ├── queries.txt          # Queries solicitadas
│   ├── app.js               # Aplicação principal
│   └── package.json
├── ex2/
│   ├── public/              # Assets estáticos
│   ├── views/               # Templates Pug
│   ├── routes/              # Rotas do frontend
│   ├── app.js               # Aplicação frontend
│   └── package.json
├── PR.md                    # Este relatório
├── eurovisao.json           # Dataset USADO
├── datasetORIGINAL.json             # Dataset ORIGINAL
├── script_dataset.json      # Script Usado
```

## Respostas às Queries Pedidas
As queries solicitadas foram implementadas no arquivo ex1/queries.txt:

```javascript
// 1. Contagem total de edições
db.edicoes.countDocuments({})

// 2. Edições onde a Irlanda foi vencedora
db.edicoes.countDocuments({ vencedor: "Ireland" })

// 3. Lista de intérpretes únicos
db.edicoes.aggregate([{$unwind:"$musicas"},{$group:{_id:"$musicas.intérprete"}},{$sort:{_id:1}},{$project:{_id:0,intérprete:"$_id"}}])

// 4. Distribuição de músicas por edição
db.edicoes.aggregate([{$project:{"anoEdição":1,totalMusicas:{$size:"$musicas"}}},{$sort:{"anoEdição":1}}])

// 5. Distribuição de vitórias por país
db.edicoes.aggregate([{$match:{"vencedor":{$exists:true}}},{$group:{_id:"$vencedor",totalVitórias:{$sum:1}}},{$sort:{"totalVitórias":-1}},{$project:{_id:0,país:"$_id",vitórias:"$totalVitórias"}}])
```





## Preparação e Importação do Dataset
-  Transformação do Dataset Original

O dataset original foi processado para adequação ao MongoDB com o script seguinte:
```python
import json

with open('dataset.json', 'r', encoding='utf-8') as f:
    original_dataset = json.load(f)

editions_array = []
for edition_id, edition_data in original_dataset.items():
    new_edition = {**edition_data, '_id': edition_data['id']}
    del new_edition['id']  
    editions_array.append(new_edition)

with open('eurovisao_edicoes.json', 'w', encoding='utf-8') as f:
    json.dump(editions_array, f, ensure_ascii=False, indent=2)

print('Arquivo eurovisao_edicoes.json criado com sucesso!')
```

###  Importação para o MongoDB
Comando utilizado para importação:
```bash
docker cp eurovisao.json mongoEW:/tmp

docker exec -it mongoEW sh

mongoimport -d eurovisao -c edicoes /tmp/eurovisao.json --jsonArray
```


### Configuração da Persistência de Dados
Modelo de Dados (Mongoose Schema)

```javascript
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

module.exports = mongoose.model('Edicao', EdicaoSchema, 'edicoes'); 
```

```js
var mongoose = require('mongoose')
var mongoDB = 'mongodb://127.0.0.1:27017/eurovisao'

mongoose.connect(mongoDB)
var db =  mongoose.connection

db.on('error', console.error.bind(console, 'Erro de conexão ao MongoDB'))
db.once('open',() => console.log('Conexão ao MongoDB realizada com sucesso'))
```

## Instruções de Execução
### Pré-requisitos
- Node.js 
- MongoDB
- NPM 

1. Instalação
```bash
git clone <repositorio>
cd ENGWEB2025-Normal
cd ex1
npm i
cd ..
cd ex2
npm 1
cd ..
```


## API (porta 25000)
```bash
cd ex1
npm start
```

## Frontend (porta 25001)
```bash
cd ex2
npm start
```
