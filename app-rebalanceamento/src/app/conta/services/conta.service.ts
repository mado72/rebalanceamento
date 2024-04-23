import { Injectable } from '@angular/core';
import { Conta, TipoConta } from '../model/conta.model';
import { Moeda } from 'src/app/ativos/model/ativos.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContaService {
  private contas: Conta[] = [];
  private sequence = 0;
  
  constructor() { }
  
  listarContas() : Observable<Conta[]> {
    if (!!this.contas.length) return of(this.contas);
    this.contas = Object.assign([] as Conta[], CONTAS);
    return of(this.contas);
  }  

  salvarConta(conta: Conta) {
    if (!conta.id) {
      conta.id = ++this.sequence;
      this.contas.push(conta);
    }
    else {
      let idx = this.contas.findIndex(item=> item.id === conta.id);
      this.contas[idx] = conta;
    }
    return of(true);
  }

  excluirConta(conta: Conta) {
    this.contas = this.contas.filter(c => c.id!== conta.id);
    return of(true);
  }

}

const CONTAS : Conta[] = [{
  id: 1,
  nome: 'Nu Bank',
  saldo: 1000,
  tipo: TipoConta.CORRENTE,
  moeda: Moeda.REAL
},{
  id: 2,
  nome: 'Itau',
  saldo: 1000,
  tipo: TipoConta.CORRENTE,
  moeda: Moeda.REAL
},{
  id: 3,
  nome: 'Nomad',
  saldo: 1000,
  tipo: TipoConta.CORRENTE,
  moeda: Moeda.DOLAR
}, {
  id: 4,
  nome: 'XP',
  saldo: 50,
  tipo: TipoConta.CORRENTE,
  moeda: Moeda.REAL
}, {
  id: 5,
  nome: 'XP Inv.',
  saldo: 50,
  tipo: TipoConta.INVESITMENTO,
  moeda: Moeda.REAL
}
];