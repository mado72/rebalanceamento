import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CarteiraImpl, ICarteiraAtivo } from '../model/ativos.model';

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

  /**
   * @description
   * Calcula os totais de resultados, objetivos, valores iniciais e atuais da carteira.
   *
   * @returns {any} - Um objeto contendo os totais de resultados, objetivos, valores iniciais e atuais.
   * @memberof CarteiraListaAtivosComponent
   */
  get totais() {
    const totais = (this.carteira.items || [])
      .map(item => {
        return {
          resultado: item.vlInicial ? item.valor - item.vlInicial : 0,
          objetivo: item.objetivo,
          vlInicial: item.vlInicial || 0,
          valor: item.valor
        };
      });
    if (!totais.length) {
      return {
        resultado: 0,
        objetivo: 0,
        vlInicial: 0,
        valor: 0
      }
    }
    return totais.reduce((acc, item)=>{
        return {
          resultado: acc.resultado + item.resultado,
          objetivo: acc.objetivo + item.objetivo,
          vlInicial: (acc.vlInicial + item.vlInicial || 0),
          valor: acc.valor + item.valor
        }
      })
  }
}