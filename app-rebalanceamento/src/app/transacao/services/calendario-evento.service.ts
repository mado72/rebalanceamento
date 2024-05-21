import { Injectable } from '@angular/core';
import { TransacaoService } from './transacao.service';
import { TipoTransacao, TransacaoImpl } from '../models/transacao.model';
import { Evento } from 'src/app/calendario/calendario.model';
import { Observable, Observer, from, map, mergeAll, tap, toArray } from 'rxjs';
import { getTime, startOfDay } from 'date-fns';

type ColorType = 'red' | 'green' | 'blue' | 'yellow' | 'purple';

const colors: Record<ColorType, {primary: string, secondary: string}> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
  green: {
    primary: '#0fe308',
    secondary: '#bcfdba',
  },
  purple: {
    primary: '#663399',
    secondary: '#D8BFD8',
  }
};

@Injectable({
  providedIn: 'root'
})
export class CalendarioEventoService {

  constructor(private _transacaoService: TransacaoService) { }

  obterEventos({inicio, fim}:{inicio: Date, fim: Date}) {
    return new Observable<Evento[]>((observer: Observer<Evento[]>)=>{
      this._transacaoService.obterTransacoesIntervalo({inicio, fim}).subscribe({
        next: transacoes=>{
          // mapeia transações com liquidação
          const mapTransacoesByOrigem = new Map(transacoes.filter(transacao=>!!transacao.dataLiquidacao).map(transacao=> [transacao.origem as string, transacao]));
          const mapTransacoes = new Map<number, TransacaoImpl[]>();
          transacoes.filter(transacao=>!!transacao.dataLiquidacao).forEach(transacao=>{
            const time = getTime(startOfDay(transacao.dataInicial));
            if (!mapTransacoes.has(time)) {
              mapTransacoes.set(time, []);
            }
            mapTransacoes.get(time)?.push(transacao);
          });

          // transações recorrentes
          transacoes.filter(transacao=>!transacao.dataLiquidacao && ! mapTransacoesByOrigem.get(transacao.origem as string)).forEach(transacao=>{
            const time = getTime(startOfDay(transacao.dataInicial));
            if (!mapTransacoes.has(time)) {
              mapTransacoes.set(time, []);
            }
            mapTransacoes.get(time)?.push(transacao);
          })
          
          from(mapTransacoes.values())
            .pipe(
              mergeAll(),
              toArray()
            )
            .subscribe(transacoes=>{
              observer.next(transacoes.map(transacao=>this.converterParaEvento(transacao)));
            });
        },
        error: (error)=>observer.error(error),
        complete: ()=> observer.complete()
      })
    });
/*
    console.log(inicio);
    console.log(fim);
*/

  }

  converterParaEvento(transacao: TransacaoImpl) : Evento {
    const color : ColorType = 
        transacao.tipoTransacao == TipoTransacao.DEBITO 
            ? !! transacao.dataLiquidacao ? 'green' : !! transacao._id ? 'red' : 'yellow'
            : !! transacao.dataLiquidacao ? 'blue' : !! transacao._id ? 'purple' : 'yellow' ;
    return {
      data: transacao.dataLiquidacao || transacao.dataInicial,
      titulo: transacao.descricao,
      descricao: transacao.descricao,
      cor: colors[color].primary,
      meta: transacao
    }
  }

}
