import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ICarteiraAtivo } from '../model/ativos.model';

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
   * @type {ICarteiraAtivo}
   * @memberof CarteiraAtivoFormComponent
   */
  _carteiraAtivo!: ICarteiraAtivo;

  get carteiraAtivo(): ICarteiraAtivo {
    return this._carteiraAtivo;
  }

  @Input()
  set carteiraAtivo(value: ICarteiraAtivo) {
    this._carteiraAtivo = Object.assign({} as ICarteiraAtivo, value);
  }

  /**
   * @description
   * EventEmitter que emite os dados do item da carteira salvo.
   *
   * @type {EventEmitter<ICarteiraAtivo>}
   * @memberof CarteiraAtivoFormComponent
   */
  @Output() salvo = new EventEmitter<ICarteiraAtivo>();

  /**
   * @description
   * EventEmitter que emite os dados do item da carteira excluído.
   *
   * @type {EventEmitter<ICarteiraAtivo>}
   * @memberof CarteiraAtivoFormComponent
   */
  @Output() excluido = new EventEmitter<ICarteiraAtivo>();

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
      ativo: {
        sigla: "",
        nome: "",
      },
      quantidade: 0,
      vlAtual: 0,
      vlInicial: 0,
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