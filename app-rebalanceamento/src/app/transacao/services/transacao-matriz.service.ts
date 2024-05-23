import { Injectable, OnInit } from '@angular/core';
import { TransacaoService } from './transacao.service';
import { TipoTransacao, TransacaoImpl } from '../models/transacao.model';
import { map } from 'rxjs';
import { getMonth, isAfter, isBefore, set, setMonth, startOfDay } from 'date-fns';

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

    const matriz: MatrizTransacoes = new Map<string, { [mes: number]: TransacaoImpl[] }>();

    this.preencherMatrizComTransacoesInformadas(transacoes, matriz);

    this.preencherMatrizComProjecaoOcorrencias(matriz);

    return matriz;
  }
  private preencherMatrizComProjecaoOcorrencias(matriz: MatrizTransacoes) {
    new Array(...matriz.values()).forEach((matrizLinha: MatrizLinha) => {
      for (var mes = 1; mes < 12; mes++) {
        const transacoesMes = matrizLinha[mes];
        if (!transacoesMes.length && matrizLinha[mes - 1].length) {
          const novasTransacoes = this.copiarTransacoesParaMes(matrizLinha, mes);

          if (novasTransacoes.length) {
            this.preencherMatrizComTransacoesInformadas(novasTransacoes, matriz);
          }
        }
      }
    });
  }

  private copiarTransacoesParaMes(matrizLinha: MatrizLinha, mes: number) {
    return matrizLinha[mes - 1]
      .filter(item => !item.dataFinal || !isAfter(setMonth(item.dataInicial, mes), item.dataFinal))
      .map(original => {
        const novaTransacao = new TransacaoImpl(original);
        delete novaTransacao._id;
        delete novaTransacao.dataLiquidacao;
        novaTransacao.dataInicial = setMonth(original.dataInicial, mes);
        novaTransacao.origem = original._id || original.origem;
        return novaTransacao;
      });
  }

  private preencherMatrizComTransacoesInformadas(transacoes: TransacaoImpl[], matriz: MatrizTransacoes) {
    transacoes.forEach(transacao => {
      if (!matriz.has(transacao.descricao)) {
        const item: MatrizLinha = {};
        for (let i = 0; i < 12; i++) { item[i] = []; }
        matriz.set(transacao.descricao, item);
      }

      const linha = matriz.get(transacao.descricao);
      if (!!linha) {
        const mes = getMonth(transacao.dataInicial);
        linha[mes].push(transacao);
      }
    });
  }

  totalMes(matriz: MatrizTransacoes, mes?: number) {
    const linhasMatriz = new Array(...matriz.keys());

    return linhasMatriz.reduce((acc: number, descricao: string) => {
      const linhaTransacao = matriz.get(descricao);
      if (!linhaTransacao) return 0;

      let transacoes: TransacaoImpl[] = obterTransacoes(linhaTransacao);

      return acc + transacoes
        .filter(transacao => [TipoTransacao.DEBITO, TipoTransacao.CREDITO].includes(transacao.tipoTransacao))
        .reduce((tacc, transacao) => {
          const fator = transacao.tipoTransacao === TipoTransacao.DEBITO ? -1 : 1;
          return tacc + fator * transacao.valor;
        }, 0);
        
      }, 0);
      
      function obterTransacoes(linhaTransacao: MatrizLinha) {
        let transacoes: TransacaoImpl[];
      if (!!mes) {
        transacoes = linhaTransacao[mes];
      }
      else {
        transacoes = Object.values(linhaTransacao)
          .reduce((tacc, transacao) => {
            return tacc.concat(transacao);
          }, []);
        }
      return transacoes;
    }
  }

  totalAnual(matriz: MatrizTransacoes, nomeTransacao?: string): number {
    const linhasMatriz = new Array(...matriz.keys()).filter(item=> !nomeTransacao || nomeTransacao === item);
    
    return linhasMatriz.reduce((acc: number, chaveMatriz: string)=>{
      const linhaTransacao = matriz.get(chaveMatriz);
      
      if (!linhaTransacao) return 0;
      
      const matrizTransacao = Object.values(linhaTransacao);
      
      const somaMatrizTransacao = matrizTransacao.reduce((lacc, transacoesMes) => {

        const somaTransacoesMes = transacoesMes
          .filter(transacao => [TipoTransacao.DEBITO, TipoTransacao.CREDITO].includes(transacao.tipoTransacao))
          .reduce((tacc, transacao) => {
            const fator = transacao.tipoTransacao === TipoTransacao.DEBITO ? -1 : 1;
            return tacc + fator * transacao.valor;
          }, 0);

        return lacc + somaTransacoesMes;
      }, 0);

      return acc + somaMatrizTransacao

    }, 0);
  }

  obterTransacoesMatriz({ matriz, nomeTransacao, mes }: { matriz: MatrizTransacoes; nomeTransacao: string; mes: number; }): TransacaoImpl[] {
    return new Array(...matriz.keys())
      .filter(key=> nomeTransacao === key)
      .flatMap(linha => {
        const meses = matriz.get(linha);
        if (!meses) throw `Linha não encontrada ${linha}`
        return meses[mes];
      })
  }

}
