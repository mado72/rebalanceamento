import { Component, Input, OnInit } from '@angular/core';
import { CarteiraImpl, CarteiraItem } from '../model/ativos.model';
import { CarteiraService } from '../services/carteira.service';

@Component({
  selector: 'app-carteira',
  templateUrl: './carteira.component.html',
  styleUrls: ['./carteira.component.scss']
})
export class CarteiraComponent implements OnInit {
  
  private _carteira!: CarteiraImpl;

  carteiraItem?: CarteiraItem;

  constructor(private carteiraService: CarteiraService) {

  }

  ngOnInit(): void {
  }
  
  get carteira(): CarteiraImpl {
    return this._carteira;
  }
  
  @Input()
  set carteira(carteira: CarteiraImpl) {
    this._carteira = carteira;
    if (!! carteira) {
      Promise.resolve().then(()=>this.carteiraService.obterAtivos(carteira).subscribe(items=>this.carteira.items = items));
    }
  }

  salvarCarteiraItem(carteiraItem: CarteiraItem) {
    console.log(carteiraItem);
    delete this.carteiraItem;
    this.carteira.items.find(item=>item.ativo.sigla === carteiraItem.ativo.sigla) || this.carteira.items.push(carteiraItem);
    // this.carteiraService.salvarCarteiraItem(item).subscribe(item=>this.carteiraItem = item);
  }

  adicionarAtivo() {
    this.carteiraItem = {
      ativo: {
        sigla: "",
        qtd: 0,
        valor: 0,
        vlUnitario: 0,
        vlInicial: 0,
      },
      objetivo: 0,
    }
  }

  excluirAtivo(carteiraItem: CarteiraItem): void {
    this.carteira.items = this.carteira.items.filter(item=>item.ativo.sigla!== carteiraItem.ativo.sigla);
    delete this.carteiraItem;
    // this.carteiraService.excluirCarteiraItem(carteiraItem).subscribe(()=>this.carteira.items = this.carteira.items.filter(item=>item.ativo.sigla!== carteiraItem.ativo.sigla));
  }

  ativoSelecionado(carteiraItem: CarteiraItem): void {
    this.carteiraItem = carteiraItem;
  }

}
