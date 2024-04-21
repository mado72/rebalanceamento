import { Component, Input, OnInit } from '@angular/core';
import { CarteiraImpl } from '../model/ativos.model';
import { CarteiraService } from '../services/carteira.service';

@Component({
  selector: 'app-carteira',
  templateUrl: './carteira.component.html',
  styleUrls: ['./carteira.component.scss']
})
export class CarteiraComponent implements OnInit {
  
  _carteira!: CarteiraImpl;

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

  get totais() {
    const totais = (this.carteira.items || [])
      .map(item => {
        return {
          resultado: item.ativo.vlInicial ? item.ativo.valor - item.ativo.vlInicial : 0,
          vlInicial: item.ativo.vlInicial || 0,
          valor: item.ativo.valor
        };
      });
    if (!totais.length) {
      return {
        resultado: 0,
        vlInicial: 0,
        valor: 0
      }
    }
    return totais.reduce((acc, item)=>{
        return {
          resultado: acc.resultado + item.resultado,
          vlInicial: (acc.vlInicial + item.vlInicial || 0),
          valor: acc.valor + item.valor
        }
      })
  }

}
