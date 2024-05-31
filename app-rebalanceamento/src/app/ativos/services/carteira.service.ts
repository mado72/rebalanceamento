import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CarteiraImpl, ICarteiraAtivo } from '../model/ativos.model';

@Injectable({
  providedIn: 'root'
})
export class CarteiraService {
  
  private sequenceCarteira = 0;
  
  private carteiras = new Array<CarteiraImpl>(); 
  
  constructor() { 
    const carteiras = new Array<CarteiraImpl>();
    for (let i = 0; i < 2; i++) {
      const id = ++this.sequenceCarteira;
      const carteira = new CarteiraImpl(`Carteira ${id}`, .2);
      carteira.id = id;
      this.obterAtivos(carteira).subscribe(items=>carteira.items = items);
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
  obterAtivos(carteira: CarteiraImpl): Observable<ICarteiraAtivo[]> {
    const items =(Object.assign([] as ICarteiraAtivo[], CARTEIRA.items)).sort(()=>Math.random()-0.5);
    return of(items);
  }
  
  salvarCarteira(carteira: CarteiraImpl): Observable<CarteiraImpl> {
    if (!carteira.id) {
      carteira.id = ++this.sequenceCarteira;
      this.carteiras.push(carteira);
    }
    else {
      const index = this.carteiras.findIndex(c => c.id === carteira.id);
      this.carteiras[index] = carteira;
    }
    
    return of(carteira);
  }
  
  atualizarCarteira(carteira: CarteiraImpl): Observable<boolean> {
    return of(true);
  }
  excluirCarteira(carteira: CarteiraImpl) {
    const idx = this.carteiras.indexOf(carteira);
    if (idx < 0) return of(false);
    this.carteiras.splice(idx, 1);
    return of(true);
  }
}

const CARTEIRA = Object.assign(new CarteiraImpl("Ativos"), {
  items: [
    {sigla: 'AAPL', qtd: 100, vlInicial: 10000, vlUnitario: 150, valor: 15000 , objetivo: 0.10 },
    {sigla: 'GOOGL', qtd: 50, vlUnitario: 250, valor: 12500 , objetivo: 0.10 },
    {sigla: 'MSFT', qtd: 75, vlUnitario: 200, valor: 15000 , objetivo: 0.10 },
    {sigla: 'AMZN', qtd: 25, vlUnitario: 300, valor: 7500 , objetivo: 0.10 },
    {sigla: 'TSLA', qtd: 50, vlUnitario: 500, valor: 25000 , objetivo: 0.10 },
    {sigla: 'NVDA', qtd: 75, vlUnitario: 225, valor: 16875 , objetivo: 0.10 },
    {sigla: 'FB', qtd: 100, vlUnitario: 175, valor: 17500 , objetivo: 0.20 },
    {sigla: 'INTC', qtd: 25, vlUnitario: 40, valor: 10000 , objetivo: 0.20 }
  ]
})

