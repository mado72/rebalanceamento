import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CarteiraImpl, CarteiraItem } from '../model/ativos.model';

@Component({
  selector: 'app-carteira-lista-ativos',
  templateUrl: './carteira-lista-ativos.component.html',
  styleUrls: ['./carteira-lista-ativos.component.scss']
})
export class CarteiraListaAtivosComponent {

  private _carteira! : CarteiraImpl;

  @Output() itemClicado = new EventEmitter<CarteiraItem>();

  get carteira(): CarteiraImpl {
    return this._carteira;
  }
  
  @Input()
  set carteira(carteira: CarteiraImpl) {
    this._carteira = carteira;
  }

  selecionar(item: CarteiraItem): void {
    this.itemClicado.emit(item);
  }

  get totais() {
    const totais = (this.carteira.items || [])
      .map(item => {
        return {
          resultado: item.ativo.vlInicial ? item.ativo.valor - item.ativo.vlInicial : 0,
          objetivo: item.objetivo,
          vlInicial: item.ativo.vlInicial || 0,
          valor: item.ativo.valor
        };
      });
    if (!totais.length) {
      return {
        resultado: 0,
        objetivo: 0,
        vlInicial: 0,
        valor: 0
      }
    }
    return totais.reduce((acc, item)=>{
        return {
          resultado: acc.resultado + item.resultado,
          objetivo: acc.objetivo + item.objetivo,
          vlInicial: (acc.vlInicial + item.vlInicial || 0),
          valor: acc.valor + item.valor
        }
      })
  }
}
