import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Conta, TipoConta } from '../model/conta.model';
import { Moeda, MoedaSigla } from 'src/app/ativos/model/ativos.model';

@Component({
  selector: 'app-conta-form',
  templateUrl: './conta-form.component.html',
  styleUrls: ['./conta-form.component.scss']
})
export class ContaFormComponent {

  _conta!: Conta;

  @Output() onSalvarConta = new EventEmitter<Conta>();

  @Output() onExcluirConta = new EventEmitter<Conta>();

  @Output() onCancelar = new EventEmitter();

  get conta() {
    return this._conta
  }

  @Input()
  set conta(conta: Conta) {
    this._conta = Object.assign({} as Conta, conta);
  }

  salvar() {
    this.onSalvarConta.emit(this.conta);
  }

  excluir() {
    this.onExcluirConta.emit(this.conta);
  }

  cancelar() {
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
    return Object.values(TipoConta);
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

}
