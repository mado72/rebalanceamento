import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CarteiraFormComponent } from '../carteira-form/carteira-form.component';
import { CarteiraImpl } from '../model/ativos.model';
import { CarteiraService } from '../services/carteira.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-carteira-portifolio',
  templateUrl: './carteira-portifolio.component.html',
  styleUrls: ['./carteira-portifolio.component.scss']
})
export class CarteiraPortifolioComponent implements OnInit{
  carteiras!: CarteiraImpl[];

  carteiraSelecionada?: CarteiraImpl;

  idCarteira?: string;

  constructor(
    private carteiraService: CarteiraService,
    private _alertService: AlertService,
    private _route: ActivatedRoute,
    private _modal: NgbModal
  ) {}

  ngOnInit(): void {
    this.idCarteira = this._route.snapshot.params['carteira'];
    this.obterCarteiras();
  }

  obterCarteiras() {
    if (! this.idCarteira) {
      this.carteiraService.obterCarteiras().subscribe(carteiras=>this.carteiras = carteiras);
    }
    else {
      this.carteiraService.obterCarteira(this.idCarteira).subscribe(carteira=>carteira && (this.carteiras = [carteira]));
    }
  }

  adicionarCarteira() {
    this.editarCarteira(new CarteiraImpl({}));
  }

  editarCarteira(carteira: CarteiraImpl) {
    this.carteiraSelecionada = carteira;

    const modalRef = this._modal.open(CarteiraFormComponent, { size: 'lg' });
    const component = modalRef.componentInstance as CarteiraFormComponent;

    component.onSalvar.subscribe((carteira) => {
      modalRef.close({action: 'salvar', carteira: carteira});
    });
    component.onCancelar.subscribe(() => {
      modalRef.dismiss('cancelar');
    });
    component.carteira = carteira;
    
    modalRef.result.then((result)=>{
      if (result.action === 'salvar') {
        this.salvarEdicaoCarteira(result.carteira);
      }
      this.cancelarEdicaoCarteira();
    }, ()=>{
      this.cancelarEdicaoCarteira();
    })

    console.log(`Editar ${carteira.nome}`);
  }

  excluirCarteira(carteira: CarteiraImpl) {
    this.carteiraService.excluirCarteira(carteira).subscribe(()=>{
      this._alertService.alert({
        titulo: 'Resultado da operação',
        mensagem: 'Carteira excluída',
        tipo: 'sucesso'
      })
      this.obterCarteiras();
  });
  }

  cancelarEdicaoCarteira() {
    delete this.carteiraSelecionada;
  }
  salvarEdicaoCarteira(carteira: CarteiraImpl) {
    console.log(`Salvar ${carteira.nome}`);
    if (!! carteira._id) {
      this.carteiraService.atualizarCarteira(carteira).subscribe(()=>{
        this._alertService.alert({
          titulo: 'Resultado da operação',
          mensagem: 'Carteira atualizada',
          tipo: 'sucesso'
        })
        this.obterCarteiras();
      });
    }
    else {
      this.carteiraService.salvarCarteira(carteira).subscribe(()=>{
        this._alertService.alert({
          titulo: 'Resultado da operação',
          mensagem: 'Carteira criada',
          tipo: 'sucesso'
        })
        this.obterCarteiras();
      });
    }
    delete this.carteiraSelecionada;
  }

}
