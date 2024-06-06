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
    private _carteiraService: CarteiraService,
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
      this._carteiraService.obterCarteiras().subscribe(carteiras=>this.carteiras = carteiras);
    }
    else {
      this._carteiraService.obterCarteira(this.idCarteira).subscribe(carteira=>carteira && (this.carteiras = [carteira]));
    }
  }

  adicionarCarteira() {
    this.editarCarteira(new CarteiraImpl({}));
  }

  editarCarteira(carteira: CarteiraImpl) {
    this.carteiraSelecionada = carteira;

    this._carteiraService.editarCarteira(carteira).subscribe((result)=>{
      delete this.carteiraSelecionada;
      if (!!result) {
        this.obterCarteiras();
      }
    });
  }

  excluirCarteira(carteira: CarteiraImpl) {
    this._carteiraService.excluirCarteira(carteira).subscribe(()=>{
      this._alertService.alert({
        titulo: 'Resultado da operação',
        mensagem: 'Carteira excluída',
        tipo: 'sucesso'
      })
      this.obterCarteiras();
  });
  }

}
