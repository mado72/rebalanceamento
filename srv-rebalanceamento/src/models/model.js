const { DateTime } = require('luxon');
var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

var Schema = mongoose.Schema;

const TipoPeriodicidade = Object.freeze({
    SEMANAL : "SEMANAL",
    QUINZENAL : "QUINZENAL",
    MENSAL : "MENSAL",
    TRIMESTRAL : "TRIMESTRAL",
    SEMESTRAL : "SEMESTRAL",
    ANUAL : "ANUAL",
    UNICO: "UNICO"
})

const TipoLiquidacao = Object.freeze({
    CONTA: "CONTA",
    CARTAO: "CARTAO",
    OUTROS: "OUTROS"
})

const TipoMoeda = Object.freeze({
    REAL : "REAL",
    DOLAR : "DOLAR",
    USDT : "USDT"
})

const TipoClasse = Object.freeze({
    MOEDA : "MOEDA",
    ACAO : "ACAO",
    FII : "FII",
    FUNDO: "FUNDO",
    CDB : "CDB",
    RF : "RF",
    INTERNACIONAL : "INTERNACIONAL",
    CRYPTO : "CRYPTO",
    ALTCOINS : "ALTCOINS"
})

var Transacao = new Schema({
    descricao: { type: String, required: true}, // Descrição da transação
    valor: {type: Number, required: true}, // Valor da transação
    periodicidade: {type: String, required: true, enum: Object.values(TipoPeriodicidade)}, // Periodicidade da transação (mensal, trimestral, anual, etc.)
    dataInicial: {type: String, required: true}, // Data de vencimento da transação
    dataFinal: {type: String}, // Data final da recorrência (opcional)
    origem: {type: String}, // Identifica se a transação surgiu de uma transação anterior (opcional)
    categoria: {type: String}, // Identifica a categoria da transação (opcional)
    liquidacao: {type: String, required: true, enum: Object.values(TipoLiquidacao)}, // Tipo de liquidação
    dataLiquidacao: {type: String}, // Data em que a transação foi paga (opcional)
    contaLiquidacao: {type: String} // Conta de Liquidação
}, {
    statics: {
        toObjectInstance: (dbInstance)=> {
            var obj = dbInstance.toObject();
            if (!! obj.dataInicial) obj.dataVencimento = DateTime.fromFormat(obj.dataInicial, 'yyyy-MM-dd');
            if (!! obj.dataFinal) obj.dataFinal = DateTime.fromFormat(obj.dataFinal, 'yyyy-MM-dd');
            if (!! obj.dataLiquidacao) obj.dataLiquidacao = DateTime.fromFormat(obj.dataLiquidacao, 'yyyy-MM-dd');
            if (!! obj.periodicidade) obj.periodicidade = TipoPeriodicidade[obj.periodicidade];
            if (!! obj.liquidacao) obj.liquidacao = TipoLiquidacao[obj.liquidacao];
            return obj;
        },
        toDBInstance: () => {
            if (!! this.dataInicial) this.dataInicial = DateTime.fromJSDate(this.dataInicial).format('yyyy-MM-dd');
            if (typeof this.dataFinal === "object" && this.dataFinal.getMonth && typeof this.dataFinal.getMonth === 'function') this.dataFinal = DateTime.fromJSDate(this.dataFinal).format('yyyy-MM-dd');
            if (typeof this.dataLiquidacao === "object" && this.dataLiquidacao.getMonth && typeof this.dataLiquidacao.getMonth === 'function') this.dataLiquidacao = DateTime.fromJSDate(this.dataLiquidacao).format('yyyy-MM-dd');
            if (typeof this.periodicidade === "object" && this.periodicidade.getMonth && typeof this.periodicidade.getMonth === 'function') this.periodicidade = TipoPeriodicidade[this.periodicidade];
            if (!! this.liquidacao) this.liquidacao = TipoLiquidacao[this.liquidacao];
        }
    }
});

var CarteiraAtivo = new Schema({
    _id: false,
    ativoId: { type: mongoose.Schema.Types.ObjectId, ref: 'ativo', index: true, unique: true }, // Referência ao ativo
    objetivo: {type: Number, required: true}, // Objetivo do ativo na carteira
});

var Carteira = new Schema({
    nome: {type: String, required: true, index: true, unique: true}, // Nome da carteira
    moeda: {type: String, required: true, enum: Object.values(TipoMoeda)}, // Moeda da carteira
    objetivo: {type: Number, required: true}, // Objetivo da carteira
    classe: {type: String, required: true, enum: Object.values(TipoClasse)}, // Classe da carteira
    ativos: [CarteiraAtivo], // Ativos
});

var Ativo = new Schema({
    ativo: {type: String, required: true, index: true, unique: true}, // Nome do ativo
    moeda: {type: String, required: true, enum: Object.values(TipoMoeda)}, // Moeda do ativo
    simbolo: {type: String, required: true, index: true, unique: true}, // Simbolo do ativo
    descricao: {type: String}, // Descrição do ativo
    setor: {type: String, required: true}, // Setor do ativo
    classe: {type: String, required: true, enum: Object.values(TipoClasse)}, // Classe do ativo
})

var Conta = new Schema({
    conta: {type: String, required: true}, // Conta 
    saldo: {type: Number, required: true}, // Saldo da Conta
    moeda: {type: String, required: true, enum: Object.values(TipoMoeda)}, // Moeda da Conta
},
/* {
    methods: {
        getSaldoTotal() {
            return new mongoose.model('Conta'),aggregate({
                $group: {
                    _id: null,
                    total: { $sum: "$saldo" }
                }
            })
        }
    },
    query: {
        byName(name) {
            return this.where({ conta: new RegExp(name, 'i')});
        }
    }
}*/)

module.exports = {
    'ativo': mongoose.model('ativo', Ativo, 'ativo'),
    'transacao': mongoose.model('transacao', Transacao, 'transacao'),
    'carteira': mongoose.model('carteira', Carteira, 'carteira'),
    'carteira-ativo': mongoose.model('carteira-ativo', CarteiraAtivo),
    'contato': mongoose.model('conta', Conta, 'conta'),
}