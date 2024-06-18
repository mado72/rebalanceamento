import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Conta, TipoConta } from '../model/conta.model';
import { Moeda, MoedaSigla } from 'src/app/ativos/model/ativos.model';

@Component({
  selector: 'app-conta-list',
  templateUrl: './conta-list.component.html',
  styleUrls: ['./conta-list.component.scss']
})
export class ContaListComponent {
  
  contasListadas: Conta[] = [];
  
  private _contas = new Array<Conta>();

  public get contas() {
    return this._contas;
  }

  @Input()
  public set contas(value) {
    this._contas = value;
    this.atualizarListaContas();
  }

  @Output() contaClicked = new EventEmitter<Conta>();

  readonly tiposConta: TipoConta[] = Object.values(TipoConta);

  tiposContaSelecionados: TipoConta[] = Object.values(TipoConta);

  sigla(moeda: Moeda): string {
    return MoedaSigla[moeda];
  }

  get totais() {
    if (! this.contasListadas.length) return 0;
    return this.contasListadas.map(conta=>conta.saldoReal || 0).reduce((acc,vl)=>acc+=vl, 0);
  }

  atualizarListaContas () {
    this.contasListadas = this.contas.filter(conta=>this.tiposContaSelecionados.includes(conta.tipo));
  }

  contaClick(conta: Conta): void {
    this.contaClicked.emit(conta);
  }

  tipoContaAlternar(tipoConta: TipoConta) {
    if (this.tipoContaAtivo(tipoConta)) {
      this.tiposContaSelecionados = this.tiposContaSelecionados.filter(tipo=>tipo !== tipoConta)
    }
    else {
      this.tiposContaSelecionados.push(tipoConta)
    }
    this.atualizarListaContas();
  }

  tipoContaAtivo(tipoConta: TipoConta) {
    return this.tiposContaSelecionados.includes(tipoConta);
  }

    

}
