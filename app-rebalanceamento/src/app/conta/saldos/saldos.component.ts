import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Moeda, MoedaSigla } from 'src/app/ativos/model/ativos.model';
import { ContaFormComponent } from '../conta-form/conta-form.component';
import { Conta, TipoConta } from '../model/conta.model';
import { ContaService } from '../services/conta.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-saldos',
  templateUrl: './saldos.component.html',
  styleUrls: ['./saldos.component.scss']
})
export class SaldosComponent implements OnInit {
  contas = new Array<Conta>();

  private _contaSelecionada?: Conta | undefined;

  constructor (
    private _contaService: ContaService,
    private _alertService: AlertService,
    private _modalService: NgbModal
  ) {}

  public get contaSelecionada(): Conta | undefined {
    return this._contaSelecionada;
  }

  public set contaSelecionada(value: Conta | undefined) {
    this._contaSelecionada = value;
    if (this._contaSelecionada) {
      const modalRef = this._modalService.open(ContaFormComponent, { size: 'lg' });
      const component = modalRef.componentInstance as ContaFormComponent;
      component.conta = this._contaSelecionada;
      component.onCancelar.subscribe((ev: any) => {
        modalRef.dismiss(ev);
        delete this._contaSelecionada;
      });
      component.onSalvarConta.subscribe(conta => {
        this.salvarConta(conta);
        modalRef.close('Salvar');
      });
      component.onExcluirConta.subscribe(conta=>{
        this.excluirConta(conta);
        modalRef.close('Excluir');
      })
    }
  }

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
      this._alertService.alert({
        tipo: 'sucesso',
        mensagem: 'Conta excluída com sucesso!',
        titulo: 'Resultado da operação'
      })
      this._contaService.listarContas().subscribe(contas => this.contas = contas);
    });
    delete this.contaSelecionada;
  }

  salvarConta(conta: Conta) { 
    this._contaService.salvarConta(conta).subscribe(()=>{
      delete this.contaSelecionada;
      this._alertService.alert({
        tipo: 'sucesso',
        mensagem: 'Conta salva com sucesso!',
        titulo: 'Resultado da operação'
      })
      this._contaService.listarContas().subscribe(contas => this.contas = contas);
    });
  }

}
