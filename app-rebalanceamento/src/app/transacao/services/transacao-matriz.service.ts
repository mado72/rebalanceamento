import { Injectable } from '@angular/core';
import { endOfMonth, getDate, getMonth, getTime, isAfter, isSameDay, setMonth, startOfMonth } from 'date-fns';
import { map } from 'rxjs';
import { ITransacao, TipoTransacao, TransacaoImpl } from '../models/transacao.model';
import { TransacaoService } from './transacao.service';

export type ItemDataInicial = { 
  dataInicial: Date 
};

export type ItemDescricaoType = {
  descricao: string
}

export type MatrizLinhaType<ItemDateInicial> = {
  [mes: number]: ItemDateInicial[]
}

export type MatrizType<T> = Map<string, MatrizLinhaType<T>>;

export type MatrizTransacoes = MatrizType<TransacaoImpl>;

export type MatrizLinhaTransacoes = MatrizLinhaType<TransacaoImpl>;

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

  obterTransacoesIntervalo({inicio, fim}: {inicio?: Date, fim?: Date}) {
    inicio = inicio || startOfMonth(new Date(2000, 0, 1));
    fim = fim || endOfMonth(new Date(2100, 11, 12));

    return this._transacaoService.obterTransacoesIntervalo({inicio, fim}).pipe(
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
    new Array(...matriz.values()).forEach((matrizLinha: MatrizLinhaTransacoes) => {
      for (var mes = 1; mes < 12; mes++) {
        const itensMes = matrizLinha[mes];
        if (!itensMes.length && matrizLinha[mes - 1].length) {
          const novasTransacoes = this.copiarTransacoesParaMes(matrizLinha, mes);

          if (novasTransacoes.length) {
            this.preencherMatrizComTransacoesInformadas(novasTransacoes, matriz);
          }
        }
      }
    });
  }

  private copiarTransacoesParaMes(matrizLinha: MatrizLinhaTransacoes, mes: number) {
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
        const item: MatrizLinhaTransacoes = {};
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

  rotulos(matriz: MatrizTransacoes) {
    return new Array(...matriz.keys());
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
      
      function obterTransacoes(linhaTransacao: MatrizLinhaTransacoes) {
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

  obterItensMatriz<ItemDataInicial>({ matriz, nomeTransacao, mes }: { matriz: MatrizType<ItemDataInicial>; nomeTransacao: string; mes: number; }): ItemDataInicial[] {
    return new Array(...matriz.keys())
      .filter(key=> nomeTransacao === key)
      .flatMap(linha => {
        const meses = matriz.get(linha);
        if (!meses) throw `Linha não encontrada ${linha}`
        return meses[mes];
      })
  }

  obterItensMatrizData<T extends ItemDataInicial>({ matriz, data }: { matriz: MatrizType<T>; data: Date }): T[] {
    return new Array(...matriz.keys())
      .flatMap(linha => {
        const meses = matriz.get(linha);
        if (!meses) throw `Linha não encontrada ${linha}`
        return new Array(...Object.values(meses)).flatMap(_itens=>_itens.filter(item=>isSameDay(item.dataInicial, data)))
      })
  }

  obterDiaInicial<T extends ItemDataInicial>({matriz, nomeTransacao}: {matriz: MatrizType<T>; nomeTransacao: string}): number {
    const key = new Array(...matriz.keys()).find(key=> nomeTransacao === key);
    if (!key) return 0;

    const linha = matriz.get(key);
    if (!linha) return 0;

    const datas = Object.values(linha)
        .filter(meses=>meses.length) // meses preenchidos
        .flatMap(transacoes=>transacoes.filter(item=> !! item.dataInicial)) // possui data
        .map(transacao=>transacao.dataInicial) // recupera as datas
        .filter(data=>!!data) // garante datas definidas
        .sort((d1,d2)=>getTime(d1)-getTime(d2)); // ordena para pegar o primeiro registro
    
    return datas?.length && getDate(datas[0]) || 0; // primeira data ou zero
  }

}
