import { Component, OnInit } from '@angular/core';
import { CarteiraImpl } from '../model/ativos.model';
import { CarteiraService } from '../services/carteira.service';

@Component({
  selector: 'app-carteira-list',
  templateUrl: './carteira-list.component.html',
  styleUrls: ['./carteira-list.component.scss']
})
export class CarteiraListComponent implements OnInit{
  carteira?: CarteiraImpl;

  constructor(private carteiraService: CarteiraService) {

  }

  ngOnInit(): void {
      this.carteiraService.obterCarteira().subscribe(carteira=>this.carteira = carteira);
  }

  get totais() {
    return this.carteira?.items
      .map(item=>{
        return {
          resultado: item.ativo.vlInicial ? item.ativo.valor - item.ativo.vlInicial: 0,
          vlInicial: item.ativo.vlInicial || 0,
          valor: item.ativo.valor
        }
      })
      .reduce((acc, item)=>{
        return {
          resultado: acc.resultado + item.resultado,
          vlInicial: (acc.vlInicial + item.vlInicial || 0),
          valor: acc.valor + item.valor
        }
      })
  }

}
