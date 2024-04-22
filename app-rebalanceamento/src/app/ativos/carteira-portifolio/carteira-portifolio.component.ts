import { Component, OnInit } from '@angular/core';
import { CarteiraImpl } from '../model/ativos.model';
import { CarteiraService } from '../services/carteira.service';

@Component({
  selector: 'app-carteira-portifolio',
  templateUrl: './carteira-portifolio.component.html',
  styleUrls: ['./carteira-portifolio.component.scss']
})
export class CarteiraListComponent implements OnInit{
  carteiras!: CarteiraImpl[];

  carteiraSelecionada?: CarteiraImpl;

  constructor(private carteiraService: CarteiraService) {

  }

  ngOnInit(): void {
      this.carteiraService.listarCarteiras().subscribe(carteiras=>this.carteiras = carteiras);
  }

  adicionarCarteira() {
    this.carteiraSelecionada = new CarteiraImpl('Nova Carteira');
  }

  editarCarteira(carteira: CarteiraImpl) {
    this.carteiraSelecionada = carteira;
    console.log(`Editar ${carteira.nome}`);
  }

  excluirCarteira(carteira: CarteiraImpl) {
    console.log(`Excluir ${carteira.nome}`);
  }

  cancelarEdicaoCarteira() {
    delete this.carteiraSelecionada;
  }
  salvarEdicaoCarteira() {
    console.log(`Salvar ${this.carteiraSelecionada?.nome}`);
    if (this.carteiraSelecionada)
      this.carteiraService.salvarCarteira(this.carteiraSelecionada).subscribe(()=>{
        this.carteiraService.listarCarteiras().subscribe(carteiras=>this.carteiras = carteiras);
      });
    
    delete this.carteiraSelecionada;
  }

}
