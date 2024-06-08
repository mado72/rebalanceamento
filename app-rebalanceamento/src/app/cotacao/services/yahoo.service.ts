import { Injectable } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { YahooQuote } from 'src/app/ativos/model/yahoo.model';
import yahooFinance from 'yahoo-finance2';

const keysOfYahooQuote = Array<keyof YahooQuote>();
@Injectable({
  providedIn: 'root'
})
export class YahooService {
  constructor() { }

  obterCotacoes(simbolos: string[]) {
    return from(yahooFinance.quote(simbolos, {return: "array", fields: keysOfYahooQuote})).pipe(
      map(quote=>{
        return quote.map(item => {
          return {
            simbolo: item.symbol,
            moeda: item.currency,
            tipo: item.quoteType,
            nome: item.shortName,
            cotacao: item.regularMarketPrice,
            variacao: item.regularMarketChangePercent
          } as YahooQuote
        })
      })
    );
  }

}
