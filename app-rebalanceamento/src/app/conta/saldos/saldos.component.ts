import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { endOfMonth, format, isSameMonth, parse, startOfMonth } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { Moeda } from 'src/app/ativos/model/ativos.model';
import { ConsolidadoService } from 'src/app/patrimonio/services/consolidado.service';
import { AlertService } from 'src/app/services/alert.service';
import { ContaFormComponent } from '../conta-form/conta-form.component';
import { Conta, TipoConta } from '../model/conta.model';
import { ContaService } from '../services/conta.service';

@Component({
  selector: 'app-saldos',
  templateUrl: './saldos.component.html',
  styleUrls: ['./saldos.component.scss']
})
export class SaldosComponent implements OnInit {
  contas = new Array<Conta>();

  private _contaSelecionada?: Conta | undefined;

  botoesControle: boolean = false;

  private _mesCorrente!: Date;

  get mesSelecionado() {
    return format(this.mesCorrente, "MMMM", { locale: ptBR });
  }

  constructor (
    private _contaService: ContaService,
    private _patrimonioService: ConsolidadoService,
    private _alertService: AlertService,
    private _modalService: NgbModal,
    private _route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const pBotaoAdicionar = this._route.snapshot.data["botoesControle"];
    if (pBotaoAdicionar !== undefined) {
      this.botoesControle = pBotaoAdicionar;
    }
    this.mesCorrente = new Date();

    // TODO Adiiconar função para pegar os saldos históricos.
  }

  get mesCorrente() {
    return this._mesCorrente;
  }

  set mesCorrente(mesCorrente: Date) {
    this._mesCorrente = mesCorrente;

    if (isSameMonth(this._mesCorrente, new Date())) {
      this._contaService.obterContas().subscribe(contas => {
        if (! this.botoesControle) {
          contas = contas.filter(conta=> conta.tipo != TipoConta.CARTAO)
        }
        this.contas = contas
      });
    }
    else {
      const inicio = startOfMonth(this._mesCorrente);
      this._patrimonioService.obterConsolidados({inicio, fim: endOfMonth(inicio)}).subscribe(consolidados=>{
        const consolidadoMap = new Map(consolidados.map(consolidado=> [consolidado.idRef, consolidado]));
        this.contas.forEach(c=>{
          const consolidado = consolidadoMap.get(c._id as string);
          c.saldo = consolidado?.valor || 0;
        });
      })
    }
  }

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

  editarConta(conta: Conta): void {
    this.contaSelecionada = conta;
  }

  adicionarConta() {
    this.contaSelecionada = {
      conta: '',
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
      this._contaService.obterContas().subscribe(contas => this.contas = contas);
    });
    delete this.contaSelecionada;
  }

  private contaSalva() {
    delete this.contaSelecionada;
    this._alertService.alert({
      tipo: 'sucesso',
      mensagem: 'Conta salva com sucesso!',
      titulo: 'Resultado da operação'
    });
  }

  salvarConta(conta: Conta) { 
    if (isSameMonth(this.mesCorrente, new Date())) {
      this._contaService.salvarConta(conta).subscribe(()=>{
        this.contaSalva();
        this._contaService.obterContas().subscribe(contas => this.contas = contas);
      });
    }
    else {
      const anoMes = Number(format(this.mesCorrente, 'yyyyMM'));
      const contas = this.contas.filter(item=>item.conta != conta.conta);
      contas.push(conta);
      this._patrimonioService.definirConsolidadosContas(contas, anoMes).subscribe(()=>{
        this.contaSalva();
        this.mesCorrente = this.mesCorrente; // Para forçar atualização
      })
    }
  }

  get mesStr() {
    return format(this.mesCorrente, 'yyyy-MM');
  }

  set mesStr(value: string) {
    this.mesCorrente = parse(value, 'yyyy-MM', new Date());
  }

}
