import { Component } from '@angular/core';
import { Despesa } from '../despesa/models/despesa';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  despesa: Despesa = { 
    id: null,
    valor: 100,
    diaVencimento: 1,
    paga: false,
    get pagamentoAntecipado() {
      return this.diaVencimento <= 20;
    }
  }

}
