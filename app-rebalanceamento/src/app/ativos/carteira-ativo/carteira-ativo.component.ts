import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CarteiraImpl, ICarteiraAtivo } from '../model/ativos.model';
import { CarteiraService } from '../services/carteira.service';

@Component({
  selector: 'app-carteira-ativo',
  templateUrl: './carteira-ativo.component.html',
  styleUrls: ['./carteira-ativo.component.scss']
})
/**
 * @descripción Componente para gerenciar um portfólio de ativos.
 * @class CarteiraAtivoComponent
 */
export class CarteiraAtivoComponent {
  
  /**
   * @descripción O objeto do portfólio.
   * @type {CarteiraImpl}
   * @memberof CarteiraAtivoComponent
   */
  private _carteira!: CarteiraImpl;

  /**
   * @descripción Emissor de eventos para editar o portfólio.
   * @type {EventEmitter<CarteiraImpl>}
   * @memberof CarteiraAtivoComponent
   */
  @Output() onEditarCarteira = new EventEmitter<CarteiraImpl>();

  /**
   * @descripción Emissor de eventos para excluir o portfólio.
   * @type {EventEmitter<CarteiraImpl>}
   * @memberof CarteiraAtivoComponent
   */
  @Output() onExcluirCarteira = new EventEmitter<CarteiraImpl>();

  /**
   * @descripción O item selecionado do portfólio.
   * @type {ICarteiraAtivo}
   * @memberof CarteiraAtivoComponent
   */
  carteiraAtivoSelecionado?: ICarteiraAtivo;

  /**
   * @descripción Construtor do CarteiraAtivoComponent.
   * @param {CarteiraService} carteiraService - O serviço para gerenciar o portfólio.
   * @memberof CarteiraAtivoComponent
   */
  constructor(private carteiraService: CarteiraService) {
  }
  
  /**
   * @descripção Obtém o objeto do portfólio.
   * @returns {CarteiraImpl} O objeto do portfólio.
   * @memberof CarteiraAtivoComponent
   */
  get carteira(): CarteiraImpl {
    return this._carteira;
  }
  
  /**
   * @descripção Define o objeto do portfólio.
   * @param {CarteiraImpl} carteira - O objeto do portfólio a ser definido.
   * @memberof CarteiraAtivoComponent
   */
  @Input()
  set carteira(carteira: CarteiraImpl) {
    this._carteira = carteira;
    if (!! carteira) {
      // TODO Refletir os itens atualizados nos totais de carteira-lista-ativos
      Promise.resolve().then(()=>this.carteiraService.obterAlocacao(carteira).subscribe(items=>{
        this.carteira.items = items;
      }));
    }
  }

  /**
   * @descripção Salva um item do portfólio.
   * @param {ICarteiraAtivo} carteiraAtivo - O item do portfólio a ser salvo.
   * @memberof CarteiraAtivoComponent
   */
  salvarCarteiraItem(carteiraAtivo: ICarteiraAtivo) {
    console.log(carteiraAtivo);
    delete this.carteiraAtivoSelecionado;
    const idx = this.carteira.items.findIndex(item=>item.ativo.sigla === carteiraAtivo.ativo.sigla);
    if (idx < 0) {
      this.carteira.items.push(carteiraAtivo);
    }
    else {
      this.carteira.items[idx] = carteiraAtivo;
    }
    
    // this.carteiraService.salvarCarteiraItem(item).subscribe(item=>this.carteiraAtivo = item);
  }

  /**
   * @descripção Adiciona um novo item ao portfólio.
   * @memberof CarteiraAtivoComponent
   */
  adicionarAtivo() {
    this.carteiraAtivoSelecionado = {
      ativo: {
        sigla: "",
        nome: "",
      },
      quantidade: 0,
      vlAtual: 0,
      vlInicial: 0,
      objetivo: 0,
    }
  }

  /**
   * @descripção Exclui um item do portfólio.
   * @param {ICarteiraAtivo} carteiraAtivo - O item do portfólio a ser excluído.
   * @memberof CarteiraAtivoComponent
   */
  excluirAtivo(carteiraAtivo: ICarteiraAtivo): void {
    this.carteira.items = this.carteira.items.filter(item=>item.ativo.sigla!== carteiraAtivo.ativo.sigla);
    delete this.carteiraAtivoSelecionado;
    // this.carteiraService.excluirCarteiraItem(carteiraAtivo).subscribe(()=>this.carteira.items = this.carteira.items.filter(item=>item.sigla!== carteiraAtivo.sigla));
  }

  /**
   * @descripção Cancela a edição de um item do portfólio.
   * @memberof CarteiraAtivoComponent
   */
  cancelarEdicaoAtivo() {
    delete this.carteiraAtivoSelecionado;
  }

  /**
   * @descripção Seleciona um item do portfólio para edição.
   * @param {ICarteiraAtivo} carteiraAtivo - O item do portfólio a ser selecionado.
   * @memberof CarteiraAtivoComponent
   */
  ativoSelecionado(carteiraAtivo: ICarteiraAtivo): void {
    this.carteiraAtivoSelecionado = Object.assign({} as ICarteiraAtivo, carteiraAtivo);
  }

  /**
   * @descripção Emite evento para editar o portfólio.
   * @memberof CarteiraAtivoComponent
   */
  editarCarteira() {
    this.onEditarCarteira.emit(this.carteira);
  }

  /**
   * @descripção Emite evento para exclui o portfólio.
   * @memberof CarteiraAtivoComponent
   */
  excluirCarteira() {
    this.onExcluirCarteira.emit(this.carteira);
  }

}
