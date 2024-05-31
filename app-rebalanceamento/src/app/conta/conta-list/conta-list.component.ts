import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Conta } from '../model/conta.model';
import { Moeda, MoedaSigla } from 'src/app/ativos/model/ativos.model';

@Component({
  selector: 'app-conta-list',
  templateUrl: './conta-list.component.html',
  styleUrls: ['./conta-list.component.scss']
})
export class ContaListComponent {

  @Input() contas = new Array<Conta>();

  @Output() contaClicked = new EventEmitter<Conta>();

  constructor() { }


  sigla(moeda: Moeda): string {
    return MoedaSigla[moeda];
  }

  get totais() {
    const total = this.contas.map(conta=>conta.saldo).reduce((acc,vl)=>acc+=vl, 0);
    return {
      total
    }
  }

  contaClick(conta: Conta): void {
    this.contaClicked.emit(conta);
  }


}
