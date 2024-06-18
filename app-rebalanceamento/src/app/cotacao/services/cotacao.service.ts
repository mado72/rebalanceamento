import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { parse } from 'date-fns';
import { Observable, forkJoin, map, mergeAll, of } from 'rxjs';
import { Moeda } from 'src/app/ativos/model/ativos.model';
import { YahooQuote } from 'src/app/ativos/model/yahoo.model';
import { CarteiraService } from 'src/app/ativos/services/carteira.service';
import { environment } from 'src/environments/environment';
import { CotacaoImpl, ICotacao } from '../models/cotacao.model';

export interface Simbolos {
  sigla: string;
  siglaYahoo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CotacaoService {

  constructor(
    private http: HttpClient,
  ) { }

  atualizarCotacoesBatch() {
    return this.http.put<string[]>(`${environment.apiUrl}/cotacao/batch/cotacoes`, {});
  }

  obterCotacoes(simbolos: Simbolos[]): Observable<Map<string, CotacaoImpl>> {
    const mapSimbolos = new Map(simbolos.filter(simbolo => !!simbolo.siglaYahoo).map(simbolo => [simbolo.siglaYahoo as string, simbolo.sigla]));
    const simbolo = encodeURIComponent(simbolos.map(simbolo => simbolo.siglaYahoo).join(','));
    return this.http.get<YahooQuote[]>(`${environment.apiUrl}/cotacao`, { params: { simbolo: simbolo } })
      .pipe(
        map((quotes: YahooQuote[]) => quotes.map(quote => this.converterDeYahooQuote(quote))),
        map(cotacoes => new Map(cotacoes.map(cotacao => [mapSimbolos.get(cotacao.simbolo) as string, cotacao])))
      );
  }

  converterDeYahooQuote(quote: YahooQuote): CotacaoImpl {
    const data: ICotacao = {
      simbolo: quote.simbolo as string,
      preco: quote.preco as number,
      moeda: this.converterDeYahooMoeda(quote.moeda as string),
      data: parse(quote.data, "yyyy-MM-dd", new Date())
    };
    return new CotacaoImpl(data);
  }
  converterDeYahooMoeda(valor: string): Moeda {
    switch (valor) {
      case "BRL":
        return Moeda.BRL;
      case "USD":
        return Moeda.USD;
      case "USDT":
        return Moeda.USDT;
      default:
        return Moeda.BRL;
    }
  }

  obterCotacaoUSDBRL() {
    return this.obterCotacoes([{
      sigla: "USD",
      siglaYahoo: "BRL=X"
    }]).pipe(
      map(cotacoes => new Array(...cotacoes.values()).find((_, i) => i === 0))
    );
  }

  obterCotacaoUSDTUSD() {
    return this.obterCotacoes([{
      sigla: "USDT",
      siglaYahoo: "USDT-USD"
    }]).pipe(
      map(cotacoes => new Array(...cotacoes.values()).find((_, i) => i === 0))
    );
  }

  obterCotacaoUSDTBRL() {
    return forkJoin({
      USDBRL: this.obterCotacaoUSDBRL(),
      USDBTUSD: this.obterCotacaoUSDTUSD()
    }).pipe(
      map(cotacoes => {
        const { USDBRL, USDBTUSD } = cotacoes;
        return new CotacaoImpl({
          simbolo: "USDTBRL",
          moeda: Moeda.BRL,
          preco: USDBTUSD && USDBRL ? USDBTUSD.preco * USDBRL.preco : 0,
          data: new Date()
        });
      })
    )
  }

  obterCotacaoMoeda(de: Moeda, para: Moeda): Observable<CotacaoImpl | undefined> {
    if (de === para) return of(new CotacaoImpl({
      simbolo: `${de}${para}`,
      moeda: de,
      preco: 1,
      data: new Date()
    }));

    switch (de) {
      case Moeda.BRL:
        switch (para) {
          case Moeda.USD:
            return this.obterCotacaoUSDBRL().pipe(map(cotacao=>{
              return cotacao && new CotacaoImpl({
                simbolo: `${de}${para}`,
                moeda: de,
                preco: 1 / cotacao.preco,
                data: new Date()
              });
            }));
          case Moeda.USDT:
            return this.obterCotacaoUSDTBRL();
          default:
            return of(undefined);
        }
      case Moeda.USD:
        switch (para) {
          case Moeda.BRL:
            return this.obterCotacaoUSDBRL();
          case Moeda.USDT:
            return this.obterCotacaoUSDTUSD();
          default:
            return of(undefined);
        }
      case Moeda.USDT:
        switch (para) {
          case Moeda.BRL:
            return this.obterCotacaoUSDTBRL();
          case Moeda.USD:
            return this.obterCotacaoUSDTUSD();
          default:
            return of(undefined);
          }
      default:
        return of(undefined);
    }
  }
}
