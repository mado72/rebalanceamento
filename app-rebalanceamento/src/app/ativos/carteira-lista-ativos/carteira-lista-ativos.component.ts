import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { CarteiraImpl, IAtivo, ICarteiraAtivo } from '../model/ativos.model';
import { Subscription } from 'rxjs';
import { CotacaoService } from 'src/app/cotacao/services/cotacao.service';

interface ValorAtivo {
    vlInicial: number | undefined;
    vlAtual: number | undefined;
}

/**
 * @description
 * Componente para exibição e interação com uma lista de ativos em uma carteira.
 *
 * @class CarteiraListaAtivosComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-carteira-lista-ativos',
  templateUrl: './carteira-lista-ativos.component.html',
  styleUrls: ['./carteira-lista-ativos.component.scss']
})
export class CarteiraListaAtivosComponent implements OnDestroy {

  private _carteira!: CarteiraImpl;

  @Input() exibirLinkEdicao: boolean = true;

  /**
   * @description
   * Emite um evento quando um item de ativo é clicado.
   *
   * @type {EventEmitter<ICarteiraAtivo>}
   * @memberof CarteiraListaAtivosComponent
   */
  @Output() itemClicado = new EventEmitter<ICarteiraAtivo>();
  
  itensSubscriber: Subscription | null = null;

  constructor(
    private _cotacaoService: CotacaoService
  ) {}

  ngOnDestroy(): void {
      if (this.itensSubscriber) {
        this.itensSubscriber.unsubscribe();
        this.itensSubscriber = null;
      }
  }

  /**
   * @description
   * Obtém o objeto da carteira.
   *
   * @returns {CarteiraImpl}
   * @memberof CarteiraListaAtivosComponent
   */
  get carteira(): CarteiraImpl {
    return this._carteira;
  }

  /**
   * @description
   * O objeto da carteira a ser exibido e interagido.
   *
   * @type {CarteiraImpl}
   * @memberof CarteiraListaAtivosComponent
   */
  @Input()
  set carteira(carteira: CarteiraImpl) {
    if (!!this._carteira) {
      this.itensSubscriber && this.itensSubscriber.unsubscribe();

    }
    this._carteira = carteira;
    if (!!carteira) {
      this.itensSubscriber = this._carteira.onItemsAlterados.subscribe(items=>this.itensAlterados(items));
    }
  }

  /**
   * @description
   * Seleciona um item de ativo e emite um evento com o item selecionado.
   *
   * @param {ICarteiraAtivo} item - O item de ativo a ser selecionado.
   * @memberof CarteiraListaAtivosComponent
   */
  selecionar(item: ICarteiraAtivo): void {
    this.itemClicado.emit(item);
  }

  vlUnitario(ativo: ICarteiraAtivo) {
    return !ativo.vlInicial? NaN : (ativo.vlAtual || 0) / ativo.quantidade;
  }

  resultado(ativo: ValorAtivo | ICarteiraAtivo) {
    return !ativo.vlInicial? NaN : ((ativo.vlAtual || 0) - ativo.vlInicial);
  }

  resultadoPerc(ativo: ValorAtivo | ICarteiraAtivo) {
    return !ativo.vlInicial? NaN : this.resultado(ativo) / ativo.vlInicial;
  }

  itensAlterados(items: ICarteiraAtivo[]) {
    Promise.resolve().then(() => {
      const siglas = items.map(item=>item.ativo.sigla);
      this._cotacaoService.obterCotacoes(siglas).subscribe(cotacoes=>{
        const mapCotacoes = new Map(cotacoes.map(cotacao=>[cotacao.simbolo, cotacao]));
        items.forEach(item=>{
          item.ativo.cotacao = mapCotacoes.get(item.ativo.sigla);
        })
      });
      console.log(`Carregando cotações de itens alterados ${this._carteira.nome}`);
    });
  }
}