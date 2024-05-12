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

const TipoLiquidacaoDespesa = Object.freeze({
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

var Despesa = new Schema({
    descricao: { type: String, required: true}, // Descrição da despesa
    valor: {type: Number, required: true}, // Valor da despesa
    periodicidade: {type: String, required: true, enum: Object.values(TipoPeriodicidade)}, // Periodicidade da despesa (mensal, trimestral, anual, etc.)
    dataVencimento: {type: String, required: true}, // Data de vencimento da despesa
    dataFinal: {type: String}, // Data final da recorrência (opcional)
    dataPagamento: {type: String}, // Data em que a despesa foi paga (opcional)
    origem: {type: String}, // Identifica se a despesa surgiu de uma despesa anterior (opcional)
    categoria: {type: String}, // Identifica a categoria da despesa (opcional)
    liquidacao: {type: String, required: true, enum: Object.values(TipoLiquidacaoDespesa)}, // Tipo de liquidação
    contaLiquidacao: {type: String} // Conta de Liquidação
}, {
    statics: {
        toObjectInstance: (dbInstance)=> {
            var obj = dbInstance.toObject();
            if (!! obj.dataVencimento) obj.dataVencimento = DateTime.fromFormat(obj.dataVencimento, 'yyyy-MM-dd');
            if (!! obj.dataFinal) obj.dataFinal = DateTime.fromFormat(obj.dataFinal, 'yyyy-MM-dd');
            if (!! obj.dataPagamento) obj.dataPagamento = DateTime.fromFormat(obj.dataPagamento, 'yyyy-MM-dd');
            if (!! obj.periodicidade) obj.periodicidade = TipoPeriodicidade[obj.periodicidade];
            if (!! obj.liquidacao) obj.liquidacao = TipoLiquidacaoDespesa[obj.liquidacao];
            return obj;
        },
        toDBInstance: () => {
            if (!! this.dataVencimento) this.dataVencimento = DateTime.fromJSDate(this.dataVencimento).format('yyyy-MM-dd');
            if (typeof this.dataFinal === "object" && this.dataFinal.getMonth && typeof this.dataFinal.getMonth === 'function') this.dataFinal = DateTime.fromJSDate(this.dataFinal).format('yyyy-MM-dd');
            if (typeof this.dataPagamento === "object" && this.dataPagamento.getMonth && typeof this.dataPagamento.getMonth === 'function') this.dataPagamento = DateTime.fromJSDate(this.dataPagamento).format('yyyy-MM-dd');
            if (typeof this.periodicidade === "object" && this.periodicidade.getMonth && typeof this.periodicidade.getMonth === 'function') this.periodicidade = TipoPeriodicidade[this.periodicidade];
            if (!! this.liquidacao) this.liquidacao = TipoLiquidacaoDespesa[this.liquidacao];
        }
    }
});

var Recebimento = new Schema({
    descricao: { type: String, required: true}, // Descrição do recebimento
    valor: {type: Number, required: true}, // Valor do recebimento
    periodicidade: {type: String, required: true, enum: Object.values(TipoPeriodicidade)}, // Periodicidade do recebimento (mensal, trimestral, anual, etc.)
    dataRecebimento: {type: String, required: true}, // Data do recebimento
    dataFinal: {type: String}, // Data final da recorrência (opcional)
    origem: {type: String}, // Identifica se o recebimento surgiu de uma recebimento anterior (opcional)
    contaLiquidacao: {type: String} // Conta de Liquidação
}, {
    statics: {
        toObjectInstance: (dbInstance)=> {
            var obj = dbInstance.toObject();
            if (!! obj.dataRecebimento) obj.dataRecebimento = DateTime.fromFormat(obj.dataRecebimento, 'yyyy-MM-dd');
            if (!! obj.dataFinal) obj.dataFinal = DateTime.fromFormat(obj.dataFinal, 'yyyy-MM-dd');
            if (!! obj.periodicidade) obj.periodicidade = TipoPeriodicidade[obj.periodicidade];
            return obj;
        },
        toDBInstance: () => {
            if (!! this.dataRecebimento) this.dataRecebimento = DateTime.fromJSDate(this.dataRecebimento).format('yyyy-MM-dd');
            if (typeof this.dataFinal === "object" && this.dataFinal.getMonth && typeof this.dataFinal.getMonth === 'function') this.dataFinal = DateTime.fromJSDate(this.dataFinal).format('yyyy-MM-dd');
            if (typeof this.periodicidade === "object" && this.periodicidade.getMonth && typeof this.periodicidade.getMonth === 'function') this.periodicidade = TipoPeriodicidade[this.periodicidade];
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
    'recebimento': mongoose.model('recebimento', Recebimento, 'recebimento'),
    'despesa': mongoose.model('despesa', Despesa, 'despesa'),
    'carteira': mongoose.model('carteira', Carteira, 'carteira'),
    'carteira-ativo': mongoose.model('carteira-ativo', CarteiraAtivo),
    'contato': mongoose.model('conta', Conta, 'conta'),
}