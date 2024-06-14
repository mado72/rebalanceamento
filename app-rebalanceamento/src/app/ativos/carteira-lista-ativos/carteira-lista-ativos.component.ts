import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CarteiraImpl, ICarteiraAtivo } from '../model/ativos.model';

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
export class CarteiraListaAtivosComponent {

  @Input() carteira!: CarteiraImpl;

  @Input() exibirLinkEdicao: boolean = true;

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

}