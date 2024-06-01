import { Component, OnInit } from '@angular/core';
import { CarteiraImpl } from '../model/ativos.model';
import { CarteiraService } from '../services/carteira.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-carteira-portifolio',
  templateUrl: './carteira-portifolio.component.html',
  styleUrls: ['./carteira-portifolio.component.scss']
})
export class CarteiraPortifolioComponent implements OnInit{
  carteiras!: CarteiraImpl[];

  carteiraSelecionada?: CarteiraImpl;

  constructor(
    private carteiraService: CarteiraService,
    private _route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const idCarteira = this._route.snapshot.params['carteira'];
    if (! idCarteira) {
      this.carteiraService.obterCarteiras().subscribe(carteiras=>this.carteiras = carteiras);
    }
    else {
      this.carteiraService.obterCarteira(idCarteira).subscribe(carteira=>carteira && (this.carteiras = [carteira]));
    }
  }

  adicionarCarteira() {
    this.carteiraSelecionada = new CarteiraImpl({});
  }

  editarCarteira(carteira: CarteiraImpl) {
    this.carteiraSelecionada = carteira;
    console.log(`Editar ${carteira.nome}`);
  }

  excluirCarteira(carteira: CarteiraImpl) {
    this.carteiraService.excluirCarteira(carteira).subscribe();
  }

  cancelarEdicaoCarteira() {
    delete this.carteiraSelecionada;
  }
  salvarEdicaoCarteira() {
    console.log(`Salvar ${this.carteiraSelecionada?.nome}`);
    if (this.carteiraSelecionada)
      this.carteiraService.salvarCarteira(this.carteiraSelecionada).subscribe(()=>{
        this.carteiraService.obterCarteiras().subscribe(carteiras=>this.carteiras = carteiras);
      });
    
    delete this.carteiraSelecionada;
  }

}
