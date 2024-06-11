import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { parse } from 'date-fns';
import { Observable, map } from 'rxjs';
import { Moeda } from 'src/app/ativos/model/ativos.model';
import { YahooQuote } from 'src/app/ativos/model/yahoo.model';
import { CarteiraService } from 'src/app/ativos/services/carteira.service';
import { environment } from 'src/environments/environment';
import { CotacaoImpl, ICotacao } from '../models/cotacao.model';

@Injectable({
  providedIn: 'root'
})
export class CotacaoService {

  constructor(
    private http: HttpClient, 
    private _carteiraService: CarteiraService
  ) { }
  
  atualizarCotacoesBatch() {
    return this.http.put<string[]>(`${environment.apiUrl}/cotacao/batch/cotacoes`, {});
  }

  obterCotacoes(simbolos: string[]): Observable<CotacaoImpl[]> {
    const simbolo = encodeURIComponent( simbolos.join(',') );
    return this.http.get<YahooQuote[]>(`${environment.apiUrl}/cotacao`, {params: {simbolo: simbolo}})
    .pipe(
      map((quotes:YahooQuote[])=> quotes.map(quote=>this.converterDeYahooQuote(quote)))
    );
  }

  converterDeYahooQuote(quote:YahooQuote) : CotacaoImpl {
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
        return Moeda.REAL;
      case "USD":
        return Moeda.DOLAR;
      case "USDT":
        return Moeda.USDT;
      default:
        return Moeda.REAL;
    }
  }
}
