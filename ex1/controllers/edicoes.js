var Edicao = require('../models/edicao')

module.exports.list = () => {
    return Edicao.find()
                .exec()   
}

module.exports.getByOrg = (org) => {
    return Edicao.find({organizacao : org})
                .exec()   
}

module.exports.getPais = (pais) => {
    return Edicao.aggregate([
        {
            $match: {
                $or: [
                    { "musicas.país": pais },  
                    { "organizacao": pais },    
                    { "vencedor": pais } 
                ]
            }
        },
        { $unwind: { path: "$musicas", preserveNullAndEmptyArrays: true } },
        {
            $project: {
                edicaoId: "$_id",
                anoEdição: 1,
                organizacao: 1,
                vencedor: 1,
                musica: {
                    $cond: [
                        { $eq: ["$musicas.país", pais] },
                        "$musicas",
                        null
                    ]
                },
                foiOrganizador: { $eq: ["$organizacao", pais] },
                foiVencedor: { $eq: ["$vencedor", pais] }
            }
        },
        {
            $group: {
                _id: "$edicaoId",
                ano: { $first: "$anoEdição" },
                organizacoes: { $first: "$foiOrganizador" },
                vitorias: { $first: "$foiVencedor" },
                musicas: { $push: "$musica" }
            }
        },
        {
            $project: {
                _id: 0,
                edicaoId: "$_id",
                ano: 1,
                organizou: "$organizacoes",
                venceu: "$vitorias",
                musicas: {
                    $filter: {
                        input: "$musicas",
                        as: "musica",
                        cond: { $ne: ["$$musica", null] }
                    }
                }
            }
        }
    ]).exec();
}


//GET /paises?papel=org: devolve a lista dos países organizadores, ordenada alfabeticamente por nome e sem repetições (lista de pares: país, lista de anos em que organizou);
module.exports.getPaiseByORg = () => {
    return Edicao.aggregate([
        { $group: { _id: "$organizacao", anos: { $addToSet: "$anoEdição" } } },
        { $project: { _id: 0, pais: "$_id", anos: 1 } },
        { $sort: { pais: 1 } }
    ]).exec();
}


//GET /paises?papel=venc: dos países vencedores, ordenada alfabeticamente por nome e sem repetições(lista de pares: país, lista de anos em que venceu);
module.exports.getPaiseByVenc = () => {
    return Edicao.aggregate([
        { $group: { _id: "$vencedor", anos: { $addToSet: "$anoEdição" } } },
        { $project: { _id: 0, pais: "$_id", anos: 1 } },
        { $sort: { pais: 1 } }
    ]).exec();
}

module.exports.getInterpretes = () => {
    return Edicao.aggregate([
        { $unwind: "$musicas" },
        { $group: { _id: { nome: "$musicas.intérprete", pais: "$musicas.país" } } },
        { $project: { _id: 0, nome: "$_id.nome", pais: "$_id.pais" } },
        { $sort: { nome: 1 } }
    ]).exec();
}


module.exports.getById = (id) => {
    return Edicao.findOne({_id : id})
                .exec()   
}

module.exports.insert = edicao => {
    if (Edicao.find({_id : edicao._id}).exec.lenght != 1) {
        var newEdicao = new Edicao(edicao)
        newEdicao._id = edicao._id
        return newEdicao.save()
    }
}


module.exports.update = (id, edicao) => {
    return Edicao
        .findOneAndReplace({ _id: id }, edicao, { new: true })
        .exec();
}


module.exports.delete = (id) => {
    return Edicao.findByIdAndDelete(id).exec();
}