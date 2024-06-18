import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { AtivoImpl, CarteiraImpl } from 'src/app/ativos/model/ativos.model';
import { CarteiraService } from 'src/app/ativos/services/carteira.service';
import { CotacaoService } from 'src/app/cotacao/services/cotacao.service';
import { CacheService } from 'src/app/util/services/cache.service';

export class Portifolio {
  carteiras: CarteiraImpl[] = [];
  ativos: AtivoImpl[] = [];
}

@Injectable({
  providedIn: 'root'
})
export class PortifolioService {

  portifolio = new BehaviorSubject<Portifolio|null>(null);

  constructor(
    private _cacheService: CacheService,
    private _carteiraService: CarteiraService,
    private _cotacaoService: CotacaoService,
  ) {
    forkJoin({
      carteiras: this._carteiraService.obterCarteiras(),
      ativos: this._carteiraService.obterTodosAtivos()
    }).subscribe((result)=>{
      const portifolio = new Portifolio();

      portifolio.ativos = result.ativos;
      portifolio.carteiras = result.carteiras;

      this._cacheService.set('portifolio', this.portifolio);

      const elegiveis = portifolio.ativos.filter(ativo => !!ativo.siglaYahoo);

      this.portifolio.next(portifolio);

      this._cotacaoService.obterCotacoes(elegiveis).subscribe(cotacoes => {

        const mapBySigla = new Map(elegiveis.map(ativo=>[ativo.sigla, ativo]));

        cotacoes.forEach(cotacao=>{
          const ativo = mapBySigla.get(cotacao.simbolo);
          if (ativo) {
            ativo.cotacao = cotacao;
          }
        });

      })
    })
  }
}
