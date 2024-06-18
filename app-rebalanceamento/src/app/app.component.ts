import { Component, OnInit } from '@angular/core';
import { CacheService } from './util/services/cache.service';
import { forkJoin, map } from 'rxjs';
import { CotacaoService } from './cotacao/services/cotacao.service';
import { Moeda } from './ativos/model/ativos.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app-rebalanceamento';

  cotacoes: any;

  constructor(
    private _cacheService: CacheService,
    private _cotacaoService: CotacaoService
  ) {}

  ngOnInit(): void {
      this.obterCotacoesMoedas();
  }

  
  obterCotacoesMoedas() {
    const cotacoes = this._cacheService.get('cotacoesMoedas');
    if (!cotacoes) {
      forkJoin({
        USDBRL: this._cotacaoService.obterCotacaoMoeda(Moeda.USD, Moeda.BRL),
        USDTUSD: this._cotacaoService.obterCotacaoMoeda(Moeda.USDT, Moeda.USD),
      }).pipe(
        map(resultado => {
          const mapCotacoes = new Map<string, number>();
          
          const usdBRL = resultado.USDBRL?.preco || 0;
          const usdtUSD = resultado.USDTUSD?.preco || 0;
          const brlUSD = resultado.USDBRL ? 1 / resultado.USDBRL?.preco : 0;
          const usdUSDT = resultado.USDTUSD ? 1 / resultado.USDTUSD?.preco : 0;
          const usdtBRL = (resultado.USDTUSD?.preco || 0) * (resultado.USDBRL?.preco || 0);

          mapCotacoes.set("USDBRL", usdBRL);
          mapCotacoes.set("USDTUSD", usdtUSD);

          mapCotacoes.set("BRLUSD", brlUSD);
          mapCotacoes.set("USDUSDT", usdUSDT);

          mapCotacoes.set("USDTBRL", usdtBRL );
          mapCotacoes.set("USDUSDT", 1 / usdtBRL);

          this._cacheService.set('cotacoesMoedas', mapCotacoes);
          return mapCotacoes;
        })
      ).subscribe(cotacoes => this.cotacoes = cotacoes);
    };
  }

}
