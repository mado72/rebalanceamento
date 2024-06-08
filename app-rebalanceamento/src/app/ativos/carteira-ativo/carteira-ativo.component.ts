import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CarteiraImpl, ICarteira, ICarteiraAtivo, Moeda, TipoAtivo } from '../model/ativos.model';
import { CarteiraService } from '../services/carteira.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CarteiraAtivoFormComponent } from '../carteira-ativo-form/carteira-ativo-form.component';
import { AlertService } from 'src/app/services/alert.service';

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
   * @descripción Construtor do CarteiraAtivoComponent.
   * @param {CarteiraService} _carteiraService - O serviço para gerenciar o portfólio.
   * @memberof CarteiraAtivoComponent
   */
  constructor(
    private _carteiraService: CarteiraService,
    private _alertService: AlertService,
    private modalService: NgbModal
  ) {}

  /**
   * @descripción O objeto do portfólio.
   * @type {CarteiraImpl}
   * @memberof CarteiraAtivoComponent
   */
  private _carteira!: CarteiraImpl;

  @Input() exibirLinkEdicaoCarteira = true;

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
  private _carteiraAtivoSelecionado?: ICarteiraAtivo;

  get carteiraAtivoSelecionado() {
    return this._carteiraAtivoSelecionado;
  }

  set carteiraAtivoSelecionado(value: ICarteiraAtivo | undefined) {
    this._carteiraAtivoSelecionado = value;

    if (!!value) {
      const modalRef = this.modalService.open(CarteiraAtivoFormComponent, { size: 'lg' });
      const component = modalRef.componentInstance as CarteiraAtivoFormComponent;
      component._carteiraAtivo = value;

      component.onCancelar.subscribe(() => modalRef.dismiss({action: 'cancelar'}));
      component.onExcluir.subscribe(carteiraAtivo => modalRef.close({action: 'excluir', carteiraAtivo}));
      component.onSalvar.subscribe(carteiraAtivo => modalRef.close({action: 'salvar', carteiraAtivo}));
      component.onTermoChanged.subscribe(termo=>{
        if (!!termo) {
          this._carteiraService.buscarAtivos(termo).subscribe(ativos=>
            component.ativos=ativos.filter(ativo=>
              (ativo.tipoAtivo===this.carteira.classe || ativo.tipoAtivo == TipoAtivo.REFERENCIA) 
              && (!ativo.moeda || ativo.moeda === this.carteira.moeda)));
        }
      })
      
      modalRef.result.then(result => {
        const ativo = result.carteiraAtivo as ICarteiraAtivo || undefined;

        if (['excluir', 'salvar'].includes(result.action)) {
          if (!ativo) {
            this._alertService.alert({
              mensagem: `Ativo não selecionado`,
              tipo: 'erro',
              titulo: 'Resultado da operação'
            });
            return;
          }
  
          this.carteira.items = this.carteira.items.filter(alocacao=>alocacao.ativoId != ativo.ativoId)
            .map(alocacao=>{
              const {['ativo']: removed, ...postData} = Object.assign({}, alocacao) ;
              return postData as ICarteiraAtivo;
            });

          const resultadoOperacao = (mensagem: string) => {
            this._alertService.alert({
              mensagem,
              tipo:'sucesso',
              titulo: 'Resultado da operação'
            });
          }

          if (result.action === 'excluir') {
            this._carteiraService.atualizarAlocacao(this.carteira).subscribe(()=>{
              resultadoOperacao('Ativo excluído com sucesso');
              this.obterAtivosCarteira();
            })
          } else {
            const {['ativo']: removed, ...postData} = Object.assign({}, ativo);
            this.carteira.items.push(postData as ICarteiraAtivo);
            
            this._carteiraService.atualizarAlocacao(this.carteira).subscribe(()=>{
              resultadoOperacao('Ativo atualizado com sucesso');
              this.obterAtivosCarteira();
            })
          }
        }
      
        delete this._carteiraAtivoSelecionado;
      }, ()=>{
        delete this._carteiraAtivoSelecionado;
      });
    }
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
      this.obterAtivosCarteira();
    }
  }

  private obterAtivosCarteira() {
    Promise.resolve().then(() => this._carteiraService.obterAlocacao(this.carteira).subscribe(items => {
      this.carteira.items = items;
    }));
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
        moeda: Moeda.REAL,
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
