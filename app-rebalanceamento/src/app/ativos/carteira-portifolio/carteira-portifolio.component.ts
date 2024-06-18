import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CarteiraFormComponent } from '../carteira-form/carteira-form.component';
import { CarteiraImpl, Moeda } from '../model/ativos.model';
import { CarteiraService } from '../services/carteira.service';
import { AlertService } from 'src/app/services/alert.service';
import { Observable, forkJoin, map, of } from 'rxjs';
import { CacheService } from 'src/app/util/services/cache.service';
import { CotacaoImpl } from 'src/app/cotacao/models/cotacao.model';
import { CotacaoService } from 'src/app/cotacao/services/cotacao.service';

// type CombinacoesMoedas = "BRLUSD" | "USDBRL" | "BRLUSDT" | "USDTBRL" | "USDTUSD" | "USDUSDT";

// type CombincoesMoedasObservable = Observable<CotacaoImpl | undefined>;


@Component({
  selector: 'app-carteira-portifolio',
  templateUrl: './carteira-portifolio.component.html',
  styleUrls: ['./carteira-portifolio.component.scss']
})
export class CarteiraPortifolioComponent implements OnInit{
  carteiras!: CarteiraImpl[];

  carteiraSelecionada?: CarteiraImpl;

  idCarteira?: string;

  constructor(
    private _carteiraService: CarteiraService,
    private _cotacaoService: CotacaoService,
    private _cacheService: CacheService,
    private _alertService: AlertService,
    private _route: ActivatedRoute,
    private _modal: NgbModal
  ) {}

  ngOnInit(): void {
    this.idCarteira = this._route.snapshot.params['carteira'];
    this.obterCotacoesMoedas();
    this.obterCarteiras();
  }

  obterCarteiras() {
    if (! this.idCarteira) {
      this._carteiraService.obterCarteiras().subscribe(carteiras=>this.carteiras = carteiras);
    }
    else {
      this._carteiraService.obterCarteira(this.idCarteira).subscribe(carteira=>carteira && (this.carteiras = [carteira]));
    }
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
      ).subscribe();
    };
  }

  adicionarCarteira() {
    this.editarCarteira(new CarteiraImpl({}));
  }

  editarCarteira(carteira: CarteiraImpl) {
    this.carteiraSelecionada = carteira;

    this._carteiraService.editarCarteira(carteira).subscribe((result)=>{
      delete this.carteiraSelecionada;
      if (!!result) {
        this.obterCarteiras();
      }
    });
  }

  excluirCarteira(carteira: CarteiraImpl) {
    this._carteiraService.excluirCarteira(carteira).subscribe(()=>{
      this._alertService.alert({
        titulo: 'Resultado da operação',
        mensagem: 'Carteira excluída',
        tipo: 'sucesso'
      })
      this.obterCarteiras();
  });
  }

}
