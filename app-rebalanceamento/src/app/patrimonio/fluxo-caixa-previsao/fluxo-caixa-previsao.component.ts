import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { endOfMonth, getDate, startOfMonth } from 'date-fns';
import { forkJoin } from 'rxjs';
import { Moeda } from 'src/app/ativos/model/ativos.model';
import { TipoConta } from 'src/app/conta/model/conta.model';
import { ContaService } from 'src/app/conta/services/conta.service';
import { TipoTransacao, TransacaoImpl } from 'src/app/transacao/models/transacao.model';
import { TransacaoService } from 'src/app/transacao/services/transacao.service';

interface Previsao {
  saldo: number;
  recebiveis: number;
  despesas: number;
  previsao: number;
}

type Previsoes = {
  [k: number]: Previsao;
}

interface Intervalo {
  inicio: number,
  fim: number
}

@Component({
  selector: 'app-fluxo-caixa-previsao',
  templateUrl: './fluxo-caixa-previsao.component.html',
  styleUrls: ['./fluxo-caixa-previsao.component.scss']
})
export class FluxoCaixaPrevisaoComponent implements OnInit {

  previsoes: Previsoes = {};

  constructor(
    private _contaService: ContaService,
    private _transacaoService: TransacaoService
  ) { }

  originalOrder = (a: KeyValue<string,Previsao>, b: KeyValue<string,Previsao>): number => {
    return 0;
  }

  ngOnInit(): void {
    const now = new Date();
    const inicio = startOfMonth(now);
    const fim = endOfMonth(now);
    forkJoin({
      conta: this._contaService.obterContas(),
      transacoes: this._transacaoService.obterTransacoesIntervalo({ inicio, fim })
    }).subscribe(res => {
      const saldoInicial = res.conta
        .filter(conta => [TipoConta.CORRENTE, TipoConta.POUPANCA].includes(conta.tipo))
        .reduce((acc, conta) => acc += this._contaService.converterSaldoParaMoeda(conta, Moeda.BRL), 0);

      const intervalos = [1].concat(
        res.transacoes
          .filter(transacao => transacao.tipoTransacao === TipoTransacao.CREDITO)
          .reduce((acc, transacao) => {
            acc.push(getDate(transacao.dataInicial));
            return acc;
          }, new Array<number>()))
        .concat(getDate(fim))
        .reduce((acc, data, idx, origem)=>{
          if (idx > 0) {
            acc.push({inicio: origem[idx - 1], fim: data});
          }
          return acc;
        }, new Array<Intervalo>());

      const naoLiquidadas = res.transacoes.filter(transacao => !transacao.liquidada);
      const creditaveis = naoLiquidadas.filter(transacao => transacao.tipoTransacao === TipoTransacao.CREDITO);

      const mapRecebiveis = this.mapearPorIntervalos(creditaveis, intervalos);

      const mapDespesas = this.mapearPorIntervalos(naoLiquidadas.filter(transacao => transacao.tipoTransacao === TipoTransacao.DEBITO), intervalos);
      
      let saldo = saldoInicial;
      this.previsoes = Object.fromEntries(intervalos.reduce((acc, intervalo, idx) => {
        if (idx == 0) return acc;
        const recebiveis = mapRecebiveis.get(this.intervaloToString(intervalo)) || 0;
        const despesas = mapDespesas.get(this.intervaloToString(intervalo)) || 0;
        const previsao = saldo + recebiveis + despesas;
        acc.set(intervalo.inicio, { saldo, recebiveis, despesas, previsao });

        saldo = previsao;
        return acc;
      }, new Map<number, Previsao>()).entries());
    })
  }


  private mapearPorIntervalos(transacoes: TransacaoImpl[], intervalos: Intervalo[]) {
    const mapIntervalo = transacoes.map(transacao => {
      const data = getDate(transacao.dataInicial);
      const intervalo = intervalos.find(intervalo => data >= intervalo.inicio && data < intervalo.fim) as Intervalo;
      return {
        intervalo: this.intervaloToString(intervalo),
        valor: transacao.valorTransacao
      };
    });
    return mapIntervalo.reduce((acc, item) => {
      acc.set(item.intervalo, (acc.get(item.intervalo) || 0) + item.valor);
      return acc;
    }, new Map<string, number>());
  }

  private intervaloToString(intervalo: Intervalo): string {
    return `${intervalo.inicio}-${intervalo.fim}`;
  }
}
