import { Component, OnInit } from '@angular/core';
import { Conta, TipoConta } from '../model/conta.model';
import { ContaService } from '../services/conta.service';
import { Moeda, MoedaSigla } from 'src/app/ativos/model/ativos.model';

@Component({
  selector: 'app-saldos',
  templateUrl: './saldos.component.html',
  styleUrls: ['./saldos.component.scss']
})
export class SaldosComponent implements OnInit {
  contas = new Array<Conta>();

  contaSelecionada?: Conta;

  constructor (private _contaService: ContaService) {}

  ngOnInit(): void {
    this._contaService.listarContas().subscribe(contas => this.contas = contas);
  }

  sigla(moeda: Moeda): string {
    return MoedaSigla[moeda];
  }

  get totais() {
    const total = this.contas.map(conta=>conta.saldo).reduce((acc,vl)=>acc+=vl);
    return {
      total
    }
  }

  editarConta(conta: Conta): void {
    this.contaSelecionada = conta;
  }

  adicionarConta() {
    this.contaSelecionada = {
      nome: '',
      saldo: 0,
      tipo: TipoConta.CORRENTE,
      moeda: Moeda.REAL
    }
  }

  cancelar() {
    delete this.contaSelecionada;
  }

  excluirConta(conta: Conta) {
    this._contaService.excluirConta(conta).subscribe(()=>{
      this._contaService.listarContas().subscribe(contas => this.contas = contas);
    });
    delete this.contaSelecionada;
  }

  salvarConta(conta: Conta) { 
    this._contaService.salvarConta(conta).subscribe(()=>{
      delete this.contaSelecionada;
      this._contaService.listarContas().subscribe(contas => this.contas = contas);
    });
  }

}
