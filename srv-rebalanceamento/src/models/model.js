var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

var Schema = mongoose.Schema;

const Periodicidade = Object.freeze({
    SEMANAL : "SMN",
    QUINZENAL : "Q",
    MENSAL : "M",
    TRIMESTRAL : "T",
    SEMESTRAL : "SMT",
    ANUAL : "A"
})

const TipoLiquidacao = Object.freeze({
    Compra: 'C',
    Venda: 'V',
    Dividendo: 'D'
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
    periodicidade: {type: String, required: true, enum: Object.values(Periodicidade)}, // Periodicidade da despesa (mensal, trimestral, anual, etc.)
    dataVencimento: {type: String, required: true}, // Data de vencimento da despesa
    dataFinal: {type: String}, // Data final da recorrência (opcional)
    dataPagamento: {type: String}, // Data em que a despesa foi paga (opcional)
    origem: {type: String}, // Identifica se a despesa surgiu de uma despesa anterior (opcional)
    categoria: {type: String}, // Identifica a categoria da despesa (opcional)
    liquidacao: {type: String, required: true}, // Tipo de liquidação
    contaLiquidacao: {type: String} // Conta de Liquidação
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

module.exports = {
    'ativo': mongoose.model('ativo', Ativo, 'ativo'),
    'despesa': mongoose.model('despesa', Despesa, 'despesa'),
    'carteira': mongoose.model('carteira', Carteira, 'carteira'),
    'carteira-ativo': mongoose.model('carteira-ativo', CarteiraAtivo),
}