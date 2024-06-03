import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CarteiraImpl, IAtivo, ICarteiraAtivo } from '../model/ativos.model';

interface ValorAtivo {
    resultado: number;
    objetivo: number;
    vlInicial: number;
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
export class CarteiraListaAtivosComponent {

  private _carteira!: CarteiraImpl;

  /**
   * @description
   * Emite um evento quando um item de ativo é clicado.
   *
   * @type {EventEmitter<ICarteiraAtivo>}
   * @memberof CarteiraListaAtivosComponent
   */
  @Output() itemClicado = new EventEmitter<ICarteiraAtivo>();

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
    this._carteira = carteira;
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
    return (ativo.vlAtual || ativo.vlInicial || 0) / ativo.quantidade;
  }
}