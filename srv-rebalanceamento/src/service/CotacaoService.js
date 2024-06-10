'use strict';
var mongoose = require('mongoose');
const Cotacao = mongoose.model('cotacao');
const Ativo = mongoose.model('ativo');
const StatusColeta = mongoose.model('status-coleta');

var Model = require('../models/model');

// const yahooFinance = require('yahoo-finance2').default;
const { exec } = require('child_process');
const { format } = require('date-fns');

module.exports.cotacaoYahooGET = function (simbolo) {
    return new Promise((resolve, reject) => {
        // yahooFinance.quoteSummary(simbolo, {}).then((quote)=>{
        //     resolve(quote);
        // })
        // .catch((err) =>{
        //     reject(err);
        // });
        exec(`npx yahoo-finance2 quote ${simbolo}`, (err, stdout, stderr) => {
            if (err) {
                reject(err);
            } else {
                stdout = stdout.split('\n').filter((_, idx) => idx >= 3).join('\n');
                resolve(stdout);
            }
        });
    });
}

module.exports.cotacaoYahooSummaryGET = function (simbolo) {
    return new Promise((resolve, reject) => {
        this.cotacaoYahooGET(simbolo)
            .then((response) => {
                if (!!response && response.indexOf('undefined') == 0) {
                    reject('Não foi possível obter a cotação');
                    return;
                }
                const quote = JSON.parse(response);
                const result = {
                    simbolo: quote.symbol,
                    moeda: quote.currency,
                    variacao: quote.regularMarketChangePercent,
                    preco: quote.regularMarketPrice,
                    nome: quote.longName,
                    curto: quote.shortName,
                    minima: quote.regularMarketDayRange.low,
                    maxima: quote.regularMarketDayRange.high,
                    dividendo: quote.dividendYield,
                    dividendoTaxa: quote.dividendRate,
                    horaMercado: quote.regularMarketTime
                }
                resolve(result);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

module.exports.atualizarCotacoesBatchPUT = function () {
    return new Promise(async (resolve, reject) => {
        try {
            var ativos = Ativo.find({});
            const siglas = ativos.map((ativo) => ativo.sigla);
            const hoje = format(new Date(), 'yyyy-MM-dd');
            siglas.forEach((sigla) => {
                this.cotacaoYahooSummaryGET(sigla).then(async (response) => {
                    const now = format(new Date(), "yyyy-MM-dd'T'hh:mm:ss");
                    await atualizarCotacao(response, hoje, now);
                    StatusColeta.insertOne({
                        simbolo: response.simbolo,
                        data: hoje,
                        dataColeta: now,
                        status: 'CONCLUIDA'
                    })
                })
                .catch((error)=>{
                    console.error(error);
                    StatusColeta.insertOne({
                        simbolo: response.simbolo,
                        data: hoje,
                        dataColeta: now,
                        status: 'ERRO',
                        mensagem: error.message
                    })
                });
            });
            resolve(siglas)
        } catch (error) {
            reject(error);
        }
    });
}

module.exports.atualizarCotacaoBatchPUT = function (sigla) {
    return new Promise(async (resolve, reject) => {
        try {
            const hoje = format(new Date(), 'yyyy-MM-dd');
            const now = format(new Date(), "yyyy-MM-dd'T'hh:mm:ss");

            this.cotacaoYahooSummaryGET(sigla).then(async (response) => {
                await atualizarCotacao(response, hoje, now);
                const status = new StatusColeta({
                    simbolo: sigla,
                    data: hoje,
                    dataColeta: now,
                    status: 'CONCLUIDA',
                    mensagem: 'Manual'
                });
                status.save();
            })
            .catch((error)=>{
                console.error(error);
                const status = new StatusColeta({
                    simbolo: sigla,
                    data: hoje,
                    dataColeta: now,
                    status: 'ERRO',
                    mensagem: error.message
                });
                status.save();
            });
            resolve(sigla);
        } catch (error) {
            reject(error);
        }
    });
}

async function atualizarCotacao(response, hoje, now) {
    const filter = {
        simbolo: response.simbolo,
        data: hoje
    };
    const dbCotacao = await Cotacao.find(filter);
    const dadosCotacao = responseToCotacao(response, hoje, now);

    if (dbCotacao && dbCotacao.length) {
        const update = {
            $set: dadosCotacao
        };
        await Cotacao.updateOne(filter, update);
    }
    else {
        const newCotacao = new Cotacao(dadosCotacao);
        await newCotacao.save();
    }
}

function responseToCotacao(response, hoje, now) {
    const moedas = {
        "BRL": "REAL",
        "USD": "DOLAR",
        "USDT": "USDT"
    }
    return {
        simbolo: response.simbolo,
        moeda: moedas[response.moeda],
        data: hoje,
        dataColeta: now,
        variacao: response.variacao,
        preco: response.preco,
        nome: response.nome,
        curto: response.curto,
        minima: response.minima,
        maxima: response.maxima,
        dividendo: response.dividendo,
        dividendoTaxa: response.dividendoTaxa,
        horaMercado: response.horaMercado,
        atualizacao: now
    };
}

