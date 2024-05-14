import { Component } from '@angular/core';
import { DateTime } from 'luxon';
import { RecebimentoImpl } from '../models/recebimento.model';
import { RecebimentosService } from '../services/recebimentos.service';
import { AlertService } from 'src/app/services/alert.service';
import { getDate, getDay } from 'date-fns';
import { Periodicidade, Mes, TransacaoImpl } from 'src/app/transacao/models/transacao.model';

type TransacaoMatriz = {[classe: string] : {[mes: string] : RecebimentoImpl | undefined}};

@Component({
  selector: 'app-recebimento-list',
  templateUrl: './recebimento-list.component.html',
  styleUrls: ['./recebimento-list.component.scss']
})
export class RecebimentoListComponent {

  private recebimentos: RecebimentoImpl[] = [];

  matriz : TransacaoMatriz = {};

  private _visao!: Periodicidade;

  constructor(
    private _recebimentosService: RecebimentosService,
    private _alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.obterRecebimentos();
  }

  public get visao(): Periodicidade {
    return this._visao;
  }
  public set visao(value: Periodicidade) {
    this._visao = value;

    this.recebimentos.forEach(despesa => {
      const descricao = despesa.descricao || 'Não classificado';
      let periodo;
      switch (this.visao) {
        case Periodicidade.SEMANAL:
        case Periodicidade.QUINZENAL:
        case Periodicidade.MENSAL:
          periodo = DateTime.fromJSDate(despesa.dataInicial).day.toString();
          break;
        case Periodicidade.TRIMESTRAL:
        case Periodicidade.SEMESTRAL:
        case Periodicidade.ANUAL:
        default:
          periodo = Object.keys(Mes)[DateTime.fromJSDate(despesa.dataInicial).month-1];
          break;
      }
      this.matriz[descricao] = this.matriz[descricao] || {};
      this.matriz[descricao][periodo] = despesa;
    });
  }

  get tiposPeriodo() {
    return [Periodicidade.ANUAL, Periodicidade.SEMESTRAL, Periodicidade.TRIMESTRAL, Periodicidade.MENSAL, Periodicidade.QUINZENAL, Periodicidade.SEMANAL];
  }
  
  private obterRecebimentos() {
    const ateData = DateTime.now().endOf("year").toJSDate();
    this.matriz = {};

    this._recebimentosService.obterRecebimentos().subscribe(recebimentos => {
      this.recebimentos = recebimentos.flatMap(recebimento => {
        const projecao = recebimento.programacaoInstancias(ateData);
        projecao.push(recebimento);
        return projecao;
      });
      this.visao = Periodicidade.ANUAL;
    });
  }

  get periodos() {
    switch (this.visao) {
      case Periodicidade.SEMANAL:
      case Periodicidade.QUINZENAL:
      case Periodicidade.MENSAL:
        const mes = Object.keys(Periodicidade).indexOf(this.periodoCorrente);
        const primeiroDia = DateTime.now().set({month: mes, day: 1});
        const ultimoDia = primeiroDia.endOf('month');
        return [...Array(ultimoDia.day)].map((_d,index)=>index+1).map(d=>d.toString() as string);
      case Periodicidade.TRIMESTRAL:
      case Periodicidade.SEMESTRAL:
      case Periodicidade.ANUAL:
        default:
        return Object.keys(Mes);
    }
  }

  get classesDespesas() {
    return Object.keys(this.matriz)
  }

  private compareTransacoes(): (a: number | undefined, b: number | undefined) => number {
    return (a, b) => !a ? (!b ? 0 : 1) : (!b ? -1 : a - b);
  }

  diaVencimento(classe: string) {
    return Object.values(this.matriz[classe])
        .map(recebimento=>getDate(recebimento?.dataInicial || 0))
        .sort((a, b) => !a ? (!b ? 0 : 1) : (!b ? -1 : a - b));
  }

  private compareRecebimentos(): (a: number | undefined, b: number | undefined) => number {
    return (a, b) => !a ? (!b ? 0 : 1) : (!b ? -1 : a - b);
  }

  get periodosCorrente() {
    switch (this.visao) {
      case Periodicidade.SEMANAL:
      case Periodicidade.QUINZENAL:
      case Periodicidade.MENSAL:
        const mes = Object.keys(Periodicidade).indexOf(this.periodoCorrente);
        const primeiroDia = DateTime.local(DateTime.now().year, mes, 1);
        const ultimoDia = primeiroDia.endOf('month');
        return [...Array(ultimoDia.day)].map(d=>d+1).map(d=>d.toString() as string);
      case Periodicidade.TRIMESTRAL:
      case Periodicidade.SEMESTRAL:
      case Periodicidade.ANUAL:
        default:
        return Object.keys(Mes);
    }
  }
  
  get periodoCorrente() {
    switch (this.visao) {
      case Periodicidade.SEMANAL:
      case Periodicidade.QUINZENAL:
      case Periodicidade.MENSAL:
        return DateTime.now().day.toString();
      case Periodicidade.TRIMESTRAL:
      case Periodicidade.SEMESTRAL:
      case Periodicidade.ANUAL:
        default:
          const mesCorrente = DateTime.now().month - 1;
          return Object.values(Mes)[mesCorrente];
    }
  }
  
  tipo(v: any) {
    return typeof v;
  }
  
  anteriorMesCorrente(periodo: any) {
    switch (this.visao) {
      case Periodicidade.SEMANAL:
      case Periodicidade.QUINZENAL:
      case Periodicidade.MENSAL:
        return parseInt(periodo) < DateTime.now().day;
      case Periodicidade.TRIMESTRAL:
      case Periodicidade.SEMESTRAL:
      case Periodicidade.ANUAL:
        default:
          return parseInt(periodo) < DateTime.now().month - 1;
    }
  }
  
  get totaisClasse() {
    const totais : {[classe: string] : number} = {};
    Object.keys(this.matriz).forEach(classe=>{
      totais[classe] = Object.values(this.matriz[classe])
          .map(despesa=>despesa?.valor)
          .reduce((acc, vl) => acc = (acc || 0) + (vl || 0)) || 0;
    });
    return totais;
  }
  
  get totaisMes() {
    const totais : {[mes: string] : number} = {};
    Object.values(this.matriz).forEach(pagamento=>{
      Object.keys(pagamento).forEach(mes=>{
        totais[mes] = (totais[mes] || 0) + (pagamento[mes]?.valor || 0);
      });
    });
    return totais;
  }

  get totais() {
    return Object.values(this.totaisMes).reduce((acc,vl)=>acc+=vl, 0);
  }

  abrirDespesaForm(despesa: RecebimentoImpl, titulo: string) {
    // this._recebimentosService.abrirDespesaForm(despesa, titulo).subscribe(()=>{
    //   console.log(`Atualizando despesas`)
    //   this.obterRecebimentos();
    // })
  }
}

