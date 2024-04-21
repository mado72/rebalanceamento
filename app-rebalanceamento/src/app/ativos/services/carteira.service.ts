import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Ativo, CarteiraImpl, CarteiraItem } from '../model/ativos.model';

@Injectable({
  providedIn: 'root'
})
export class CarteiraService {
  
  private carteira!: CarteiraImpl;

  constructor() { }

  obterCarteira(): Observable<CarteiraImpl> {
    if (this.carteira) return of(this.carteira);
    this.carteira = Object.assign(new CarteiraImpl(""), CARTEIRA);
    return of(this.carteira)
  }

  private buildItemsCarteira(ativos: Ativo[]): CarteiraItem[] {
    throw new Error('Function not implemented.');
  }
}

const CARTEIRA = Object.assign(new CarteiraImpl("Ativos"), {
  items: [
    { ativo: { ativo: 'AAPL', qtd: 100, vlInicial: 10000, vlUnitario: 150, valor: 15000 }, objetivo: 0.10 },
    { ativo: { ativo: 'GOOGL', qtd: 50, vlUnitario: 250, valor: 12500 }, objetivo: 0.10 },
    { ativo: { ativo: 'MSFT', qtd: 75, vlUnitario: 200, valor: 15000 }, objetivo: 0.10 },
    { ativo: { ativo: 'AMZN', qtd: 25, vlUnitario: 300, valor: 7500 }, objetivo: 0.10 },
    { ativo: { ativo: 'TSLA', qtd: 50, vlUnitario: 500, valor: 25000 }, objetivo: 0.10 },
    { ativo: { ativo: 'NVDA', qtd: 75, vlUnitario: 225, valor: 16875 }, objetivo: 0.10 },
    { ativo: { ativo: 'FB', qtd: 100, vlUnitario: 175, valor: 17500 }, objetivo: 0.20 },
    { ativo: { ativo: 'INTC', qtd: 25, vlUnitario: 40, valor: 10000 }, objetivo: 0.20 }
  ]
})

