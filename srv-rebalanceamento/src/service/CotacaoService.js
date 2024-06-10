'use strict';
var Model = require('../models/model');
var mongoose = require('mongoose');
const { respondWithCode } = require('../utils/writer');
const Cotacao = mongoose.model('cotacao');
const yahooFinance = require('yahoo-finance2').default;
const { exec } = require('child_process');

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
                stdout = stdout.split('\n').filter((line,idx)=>idx >=3).join('\n');
                resolve(stdout);
            }
        });
    });
}
