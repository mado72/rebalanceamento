import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CarteiraImpl, Moeda, MoedaSigla, TipoAtivo } from '../model/ativos.model';

@Component({
  selector: 'app-carteira-form',
  templateUrl: './carteira-form.component.html',
  styleUrls: ['./carteira-form.component.scss']
})
export class CarteiraFormComponent {
  
  @Output() onSalvar = new EventEmitter<CarteiraImpl>();
  
  @Output() onCancelar = new EventEmitter();

  _carteira!: CarteiraImpl;

  get carteira(): CarteiraImpl {
    return this._carteira;
  }
  
  @Input()
  set carteira(value: CarteiraImpl) {
    this._carteira = Object.assign({} as CarteiraImpl, value);
  }

  salvarEdicao() {
    this.onSalvar.emit(this._carteira);
  }
  cancelarEdicao() {
    this.onCancelar.emit();
  }

  /**
   * @description
   * Método que retorna um array de tipos disponíveis.
   *
   * @returns {string[]} - Um array de tipos disponíveis.
   * @memberof CarteiraAtivoFormComponent
   */
  get tipos(): string[] {
    return Object.values(TipoAtivo);
  }

  /**
   * @description
   * Método que retorna um array de moedas disponíveis.
   *
   * @returns {string[]} - Um array de moedas disponíveis.
   * @memberof CarteiraAtivoFormComponent
   */
  get moedas(): string[] {
    return Object.keys(Moeda);
  }

  /**
   * @description
   * Método que retorna a sigla da moeda baseada na string da moeda fornecida.
   *
   * @param {string} moedaString - A string da moeda.
   * @returns {any} - A sigla da moeda ou null se não encontrada.
   * @memberof CarteiraAtivoFormComponent
   */
  sigla(moedaString: string): any {
    const moeda = Object.values(Moeda).find(m => "" + m === moedaString);
    if (!moeda) return null;
    return MoedaSigla[moeda];
  }

  get objetivoPerc() {
    return this.carteira.objetivo * 100;
  }

  set objetivoPerc(value: number) {
    this.carteira.objetivo = value / 100;
  }

}
