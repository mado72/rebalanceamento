import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Ativo, CarteiraImpl, CarteiraItem } from '../model/ativos.model';

@Injectable({
  providedIn: 'root'
})
export class CarteiraService {
  
  private sequence = 0;

  private carteiras = new Array<CarteiraImpl>(); 

  constructor() { 
    const carteiras = new Array<CarteiraImpl>();
    for (let i = 0; i < 8; i++) {
      const id = ++this.sequence;
      const carteira = new CarteiraImpl(`Ativo ${id}`);
      carteira.id = id;
      carteiras.push(carteira)
    }
    this.carteiras = carteiras;
  }

  listarCarteiras(): Observable<CarteiraImpl[]> {
    return of(this.carteiras);
  }

  obterCarteira(id: number): Observable<CarteiraImpl | undefined> {
    if (!this.carteiras) return of(undefined);
    return of(this.carteiras.find(carteira => carteira.id === id));
  }
  obterAtivos(carteira: CarteiraImpl): Observable<CarteiraItem[]> {
    return of(Object.assign([] as CarteiraItem[], CARTEIRA.items))
  }

  salvarCarteira(carteira: CarteiraImpl): Observable<CarteiraImpl> {
    if (!carteira.id) {
      carteira.id = ++this.sequence;
      this.carteiras.push(carteira);
    }
    
    return of(carteira);
  }

  atualizarCarteira(carteira: CarteiraImpl): Observable<boolean> {
    return of(true);
  }

  private buildItemsCarteira(ativos: Ativo[]): CarteiraItem[] {
    throw new Error('Function not implemented.');
  }
}

const CARTEIRA = Object.assign(new CarteiraImpl("Ativos"), {
  items: [
    { ativo: { sigla: 'AAPL', qtd: 100, vlInicial: 10000, vlUnitario: 150, valor: 15000 }, objetivo: 0.10 },
    { ativo: { sigla: 'GOOGL', qtd: 50, vlUnitario: 250, valor: 12500 }, objetivo: 0.10 },
    { ativo: { sigla: 'MSFT', qtd: 75, vlUnitario: 200, valor: 15000 }, objetivo: 0.10 },
    { ativo: { sigla: 'AMZN', qtd: 25, vlUnitario: 300, valor: 7500 }, objetivo: 0.10 },
    { ativo: { sigla: 'TSLA', qtd: 50, vlUnitario: 500, valor: 25000 }, objetivo: 0.10 },
    { ativo: { sigla: 'NVDA', qtd: 75, vlUnitario: 225, valor: 16875 }, objetivo: 0.10 },
    { ativo: { sigla: 'FB', qtd: 100, vlUnitario: 175, valor: 17500 }, objetivo: 0.20 },
    { ativo: { sigla: 'INTC', qtd: 25, vlUnitario: 40, valor: 10000 }, objetivo: 0.20 }
  ]
})

