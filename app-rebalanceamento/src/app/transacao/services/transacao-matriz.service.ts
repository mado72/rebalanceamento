import { Injectable, OnInit } from '@angular/core';
import { TransacaoService } from './transacao.service';
import { TransacaoImpl } from '../models/transacao.model';
import { map } from 'rxjs';
import { getMonth, isAfter, isBefore, set, startOfDay } from 'date-fns';

export type MatrizTransacoes = Map<string, MatrizLinha>;

export type MatrizLinha = {
  [mes: number]: TransacaoImpl[];
};

@Injectable({
  providedIn: 'root'
})
export class TransacaoMatrizService {

  constructor(private _transacaoService: TransacaoService) { }

  obterTransacoes() {
    return this._transacaoService.obterTransacoes().pipe(
      map((transacoes: TransacaoImpl[]) => {
        return this.montarMatriz(transacoes);
      })
    )
  }
  montarMatriz(transacoes: TransacaoImpl[]): MatrizTransacoes {

    const matriz : MatrizTransacoes = new Map<string, { [mes: number]: TransacaoImpl[]}>();

    transacoes.forEach(transacao=>{
      if (!matriz.has(transacao.descricao)) {
        const item : MatrizLinha = {};
        for (let i = 0; i < 12; i++) {item[i]=[];}
        matriz.set(transacao.descricao, item);
      }

      const linha = matriz.get(transacao.descricao);
      if (!!linha) {
        const mes = getMonth(transacao.dataInicial) - 1;
        linha[mes].push(transacao);        
      }
    });


    Object.values(matriz).forEach((matrizLinha: MatrizLinha)=>{
      console.log(matrizLinha)
      Object.keys(matrizLinha).forEach(mes => {
        console.log(mes);
      });
    })
/*
    matriz.forEach(linhaTransacoes=>{

      Object.keys(linhaTransacoes).forEach(transacaoDescricao => { 
        const linhaTransacoes = linhaTransacoes.get(transacaoDescricao);
      });
      linhaTransacoes.forEach((transacoesMes, mes) => {
        if (mes < 11) {
          const dataMes = startOfDay(set(new Date(), {month: mes +1, date: 1})) 
          transacoesMes.forEach(transacao=>{
            if (! transacao.dataFinal || isBefore(transacao.dataFinal, dataMes)) {
              const novaTransacao = new TransacaoImpl(transacao);
              delete novaTransacao._id;
              delete novaTransacao.dataLiquidacao;
              novaTransacao.origem = transacao._id || transacao.origem;

              const encontrou = linhaTransacoes[mes+1].findIndex(transacao=>transacao.descricao === novaTransacao.descricao);
              if (encontrou < 0) {
                linhaTransacoes[mes+1].push(novaTransacao);
              }
            }
          });
        }
      })
    })
*/

    return matriz;
  }
  totalMes(matriz: MatrizTransacoes, mes: number) {

  }

}
