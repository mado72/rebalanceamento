import { Injectable } from '@angular/core';
import { TransacaoService } from './transacao.service';
import { TipoTransacao, TransacaoImpl } from '../models/transacao.model';
import { CalendarColorType, CalendarColors, Evento } from 'src/app/calendario/calendario.model';
import { Observable, Observer, from, map, mergeAll, tap, toArray } from 'rxjs';
import { getTime, startOfDay } from 'date-fns';

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
          const mapTransacoesByOrigem = new Map(transacoes.filter(transacao=>!!transacao.dataLiquidacao && !!transacao.origem).map(transacao=> [transacao.origem as string, transacao]));
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
    const color : CalendarColorType = 
        transacao.tipoTransacao == TipoTransacao.DEBITO 
            ? (!! transacao.dataLiquidacao ? 'purple' : 'red')
            : (!! transacao.dataLiquidacao ? 'blue' : 'cyan');
    return {
      data: transacao.dataLiquidacao || transacao.dataInicial,
      titulo: transacao.descricao,
      descricao: transacao.descricao,
      cor: CalendarColors[color].primary,
      meta: transacao
    }
  }

}
