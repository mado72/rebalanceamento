import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CarteiraItem } from '../model/ativos.model';

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
   * @type {CarteiraItem}
   * @memberof CarteiraAtivoFormComponent
   */
  @Input() carteiraItem: CarteiraItem;

  /**
   * @description
   * EventEmitter que emite os dados do item da carteira salvo.
   *
   * @type {EventEmitter<CarteiraItem>}
   * @memberof CarteiraAtivoFormComponent
   */
  @Output() salvo = new EventEmitter<CarteiraItem>();

  /**
   * @description
   * EventEmitter que emite os dados do item da carteira excluído.
   *
   * @type {EventEmitter<CarteiraItem>}
   * @memberof CarteiraAtivoFormComponent
   */
  @Output() excluido = new EventEmitter<CarteiraItem>();

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
    this.carteiraItem = {
      ativo: {
        sigla: "",
        qtd: 0,
        vlUnitario: 0,
        vlInicial: 0,
        valor: 0
      },
      objetivo: 0,
    };
  }

  /**
   * @description
   * Hook de vida que é chamado após as propriedades de dados vinculadas do diretivo terem sido inicializadas.
   *
   * @memberof CarteiraAtivoFormComponent
   */
  ngOnInit(): void {
  }

  /**
   * @description
   * Método que emite os dados do item da carteira salvo quando o formulário é enviado.
   *
   * @memberof CarteiraAtivoFormComponent
   */
  onSubmit(): void {
    this.salvo.emit(this.carteiraItem);
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
    this.excluido.emit(this.carteiraItem);
  }

}