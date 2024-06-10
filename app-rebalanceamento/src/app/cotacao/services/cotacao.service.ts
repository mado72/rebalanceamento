import { Injectable } from '@angular/core';
import { CarteiraService } from 'src/app/ativos/services/carteira.service';
import { Observable, map } from 'rxjs';
import { CotacaoImpl, ICotacao } from '../models/cotacao.model';
import { YahooQuote } from 'src/app/ativos/model/yahoo.model';
import { Moeda, TipoAtivo } from 'src/app/ativos/model/ativos.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CotacaoService {

  constructor(
    private _http: HttpClient, 
    private _carteiraService: CarteiraService
  ) { }

  obterCotacoes(simbolos: string[]): Observable<CotacaoImpl[]> {
    return this._http.get<YahooQuote[]>(`${environment.apiUrl}/cotacao`, {params: {simbolos}})
    .pipe(
      map((quotes:YahooQuote[])=> quotes.map(quote=>this.converterDeYahooQuote(quote)))
    );
  }

  converterDeYahooQuote(quote:YahooQuote) : CotacaoImpl {
    const data: ICotacao = {
      simbolo: quote.simbolo as string,
      preco: quote.cotacao as number,
      moeda: this.converterDeYahooMoeda(quote.moeda as string),
      tipo: this.converterDeYahooTipo(quote.tipo as string)
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
  converterDeYahooTipo(valor: string): TipoAtivo {
    switch (valor) {
      case "CRYPTOCURRENCY":
        return TipoAtivo.CRIPTO;
      case "CURRENCY":
        return TipoAtivo.REFERENCIA;
      case "ETF":
        return TipoAtivo.FUNDO;
      case "EQUITY":
        return TipoAtivo.ACAO;
      case "FUTURE":
        return TipoAtivo.RF;
      case "INDEX":
        return TipoAtivo.FUNDO;
      case "MUTUALFUND":
        return TipoAtivo.FUNDO;
      case "OPTION":
        return TipoAtivo.ACAO;
      default:
        return TipoAtivo.REFERENCIA;
    }
  }
}
