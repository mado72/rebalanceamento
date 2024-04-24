import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CarteiraAtivo } from '../model/ativos.model';

@Component({
  selector: 'app-carteira-ativo-form',
  templateUrl: './carteira-ativo-form.component.html',
  styleUrls: ['./carteira-ativo-form.component.scss']
})
/**
 * @description
 * Componente para lidar com o formulário de um item da carteira.
 *
 * @class CarteiraAtivoFormComponent
 */
export class CarteiraAtivoFormComponent {

  /**
   * @description
   * Propriedade de entrada que recebe os dados iniciais do item da carteira.
   *
   * @type {CarteiraAtivo}
   * @memberof CarteiraAtivoFormComponent
   */
  _carteiraAtivo!: CarteiraAtivo;

  get carteiraAtivo(): CarteiraAtivo {
    return this._carteiraAtivo;
  }

  @Input()
  set carteiraAtivo(value: CarteiraAtivo) {
    this._carteiraAtivo = Object.assign({} as CarteiraAtivo, value);
  }

  /**
   * @description
   * EventEmitter que emite os dados do item da carteira salvo.
   *
   * @type {EventEmitter<CarteiraAtivo>}
   * @memberof CarteiraAtivoFormComponent
   */
  @Output() salvo = new EventEmitter<CarteiraAtivo>();

  /**
   * @description
   * EventEmitter que emite os dados do item da carteira excluído.
   *
   * @type {EventEmitter<CarteiraAtivo>}
   * @memberof CarteiraAtivoFormComponent
   */
  @Output() excluido = new EventEmitter<CarteiraAtivo>();

  /**
   * @description
   * EventEmitter que emite a operação cancelada.
   *
   * @type {EventEmitter}
   * @memberof CarteiraAtivoFormComponent
   */
  @Output() cancelado = new EventEmitter();

  /**
   * @description
   * Construtor que inicializa o componente com um objeto de item da carteira vazio.
   *
   * @memberof CarteiraAtivoFormComponent
   */
  constructor() {
    this.carteiraAtivo = {
      sigla: "",
      qtd: 0,
      vlUnitario: 0,
      vlInicial: 0,
      valor: 0,
      objetivo: 0,
    };
  }

  /**
   * @description
   * Método que emite os dados do item da carteira salvo quando o formulário é enviado.
   *
   * @memberof CarteiraAtivoFormComponent
   */
  onSubmit(): void {
    this.salvo.emit(this.carteiraAtivo);
  }

  /**
   * @description
   * Método que emite a operação cancelada quando o formulário é cancelado.
   *
   * @memberof CarteiraAtivoFormComponent
   */
  onCancelar(): void {
    this.cancelado.emit();
  }

  /**
   * @description
   * Método que emite os dados do item da carteira excluído quando o formulário é excluído.
   *
   * @memberof CarteiraAtivoFormComponent
   */
  onExcluir(): void {
    this.excluido.emit(this.carteiraAtivo);
  }

}