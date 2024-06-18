import { Injectable } from '@angular/core';
import { TransacaoService } from './transacao.service';
import { TipoTransacao, TransacaoImpl } from '../models/transacao.model';
import { CalendarColorType, CalendarColors, Evento } from 'src/app/calendario/calendario.model';
import { Observable, Observer, from, map, mergeAll, tap, toArray } from 'rxjs';
import { getTime, startOfDay } from 'date-fns';
import { MatrizLinhaTransacoes, MatrizTransacoes, MatrizType, TransacaoMatrizService } from './transacao-matriz.service';

export type MatrizEventos = MatrizType<Evento>;

export type MatrizEventoLinha = {
  [mes: number]: Evento[];
};


@Injectable({
  providedIn: 'root'
})
export class CalendarioEventoService {

  constructor(
    private _transacaoService: TransacaoService, 
    private _matrizService: TransacaoMatrizService) { }

  obterEventos({inicio, fim}:{inicio: Date, fim: Date}) : Observable<MatrizEventos>{
    return this._transacaoService.obterTransacoesIntervalo({inicio, fim}).pipe(
      map(transacoes=>this._matrizService.montarMatriz(transacoes)),
      map(matrizTransacoes=>this.converterMatrizEventos(matrizTransacoes)),
    )
  }

  converterMatrizEventos(original: MatrizTransacoes): MatrizEventos {
    const matrizEventos = new Map<string, MatrizEventoLinha>();
    new Array(...original.keys()).map(nomeTransacao=>{
      const matrizLinha = original.get(nomeTransacao);
      if (!matrizLinha) {
        throw `Matriz inválida ${nomeTransacao}`
      }
      const linha : MatrizEventoLinha = this.converterMatrizLinha(matrizLinha);
      matrizEventos.set(nomeTransacao, linha);
    });
    return matrizEventos;
  }

  private converterMatrizLinha(matrizLinha: MatrizLinhaTransacoes): MatrizEventoLinha {
    const linha : MatrizEventoLinha = {};
    const meses = Object.keys(matrizLinha).map(mes=>Number(mes));
    meses.forEach(mes=>{
      let eventos = matrizLinha[mes].map(transacao=>this.converterParaEvento(transacao));
      linha[mes] = eventos;
    })
    return linha;
  }

  converterParaEvento(transacao: TransacaoImpl) : Evento {
    const color : CalendarColorType = 
        transacao.tipoTransacao == TipoTransacao.DEBITO 
            ? (!! transacao.dataLiquidacao ? 'red' : 'orange')
            : (!! transacao.dataLiquidacao ? 'green' : 'lightgreen');
    return {
      dataInicial: transacao.dataLiquidacao || transacao.dataInicial,
      titulo: transacao.descricao,
      descricao: transacao.descricao,
      cor: CalendarColors[color].primary,
      meta: transacao
    }
  }

}

