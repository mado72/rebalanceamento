var mongoose = require('mongoose');
const { format } = require('date-fns');
const mongoosePaginate = require('mongoose-paginate-v2');

var Schema = mongoose.Schema;

const TipoTransacao = Object.freeze({
    DEBITO : "DEBITO",
    CREDITO : "CREDITO",
    DIVIDENDO: "DIVIDENDO",
    JCP : "JCP",
    TAXA: "TAXA",
    BONUS: "BONUS",
    EXTRA: "EXTRA"
})

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

const TipoConta = Object.freeze({
    CORRENTE : "CORRENTE",
    POUPANCA : "POUPANCA",
    CARTAO : "CARTAO",
    INVESTIMENTO : "INVESTIMENTO"
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

const TipoConsolidado = Object.freeze({
    CONTA : "CONTA",
    ACAO : "ACAO",
    FII : "FII",
    RF : "RF",
    INTL : "INTL",
    TRADE : "TRADE",
    RESERVA : "RESERVA",
    CRIPTO : "CRIPTO",
    SWING : "SWING",
    PROVENTO : "PROVENTO",
    RETIRADA : "RETIRADA"
})

var Transacao = new Schema({
    descricao: { type: String, required: true}, // Descrição da transação
    valor: {type: Number, required: true}, // Valor da transação
    periodicidade: {type: String, required: true, enum: Object.values(TipoPeriodicidade)}, // Periodicidade da transação (mensal, trimestral, anual, etc.)
    tipoTransacao: {type: String, required: true, enum: Object.values(TipoTransacao)}, // Tipo da transação
    dataInicial: {type: String, required: true}, // Data de vencimento da transação
    dataFinal: {type: String}, // Data final da recorrência (opcional)
    origem: {type: String}, // Identifica se a transação surgiu de uma transação anterior (opcional)
    categoria: {type: String}, // Identifica a categoria da transação (opcional)
    liquidacao: {type: String, required: true, enum: Object.values(TipoLiquidacao)}, // Tipo de liquidação
    dataLiquidacao: {type: String}, // Data em que a transação foi paga (opcional)
    contaLiquidacao: {type: String}, // Conta de Liquidação
}, {
    statics: {
        toObjectInstance: (dbInstance)=> {
            var obj = dbInstance.toObject();
            if (!! obj.periodicidade) obj.periodicidade = TipoPeriodicidade[obj.periodicidade];
            if (!! obj.liquidacao) obj.liquidacao = TipoLiquidacao[obj.liquidacao];
            return obj;
        },
        toDBInstance: (obj) => {
            if (typeof obj.dataInicial === "object" && obj.dataInicial.getMonth && typeof obj.dataFinal.getMonth === 'function') obj.dataInicial = format(obj.dataInicial, 'yyyy-MM-dd');
            if (typeof obj.dataFinal === "object" && !! obj.dataFinal && obj.dataFinal.getMonth && typeof obj.dataFinal.getMonth === 'function') obj.dataFinal = format(obj.dataFinal, 'yyyy-MM-dd');
            if (typeof obj.dataLiquidacao === "object" && !! obj.dataLiquidacao && obj.dataLiquidacao.getMonth && typeof obj.dataLiquidacao.getMonth === 'function') obj.dataLiquidacao = format(obj.dataLiquidacao, 'yyyy-MM-dd');
            if (typeof obj.periodicidade === "object") obj.periodicidade = TipoPeriodicidade[obj.periodicidade];
            if (! obj.contaLiquidacao) obj.contaLiquidacao = null;
            if (!! obj.liquidacao) obj.liquidacao = TipoLiquidacao[obj.liquidacao];
            return obj;
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
    tipo: {type: String, required: true, enum: Object.values(TipoConta)}, // Tipo da Conta}
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


var Consolidado = new Schema(
    {
        idRef: {type: String, required: true, index: true}, // Conta 
        tipo: {type: String, required: true, enum: Object.values(TipoConsolidado)}, // Tipo da Consolidado
        valor: {type: Number, required: true}, // Valor da Consolidado
        anoMes: {type: Number, required: true, index: true}, // Ano e Mês da Consolidado
    },
    {
        methods: {
            ehValido() {
                var ano = this.anoMes / 100;
                var mes = this.anoMes % 100;
                return ! (ano < 1900 || ano > 2100 || mes < 1 || mes > 12);
            }
        }
    }
)

module.exports = {
    'ativo': mongoose.model('ativo', Ativo, 'ativo'),
    'transacao': mongoose.model('transacao', Transacao, 'transacao'),
    'carteira': mongoose.model('carteira', Carteira, 'carteira'),
    'carteira-ativo': mongoose.model('carteira-ativo', CarteiraAtivo),
    'conta': mongoose.model('conta', Conta, 'conta'),
    'consolidado': mongoose.model('consolidado', Consolidado, 'consolidado'),
}