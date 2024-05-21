import { Component } from '@angular/core';
import { Mes, Periodicidade, TransacaoImpl } from '../models/transacao.model';
import { TransacaoService } from '../services/transacao.service';
import { AlertService } from 'src/app/services/alert.service';
import { endOfMonth, endOfYear, getDate, getMonth, set, startOfDay, startOfMonth, startOfYear } from 'date-fns';

type Lancamentos = {[classe: string] : {[mes: string] : TransacaoImpl | undefined}};

@Component({
  selector: 'app-transacao-list',
  templateUrl: './transacao-list.component.html',
  styleUrls: ['./transacao-list.component.scss']
})
export class TransacaoListComponent {

  private transacoes: TransacaoImpl[] = [];

  lancamentos : Lancamentos = {};

  private _visao!: Periodicidade;

  constructor(
    private _transacaoService: TransacaoService,
    private _alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.obterTransacoes();
  }

  public get visao(): Periodicidade {
    return this._visao;
  }
  public set visao(value: Periodicidade) {
    this._visao = value;

    this.transacoes.forEach(transacao => {
      const descricao = transacao.descricao || 'Não classificado';
      let periodo;
      switch (this.visao) {
        case Periodicidade.SEMANAL:
        case Periodicidade.QUINZENAL:
        case Periodicidade.MENSAL:
          periodo = getDate(transacao.dataInicial);
          break;
        case Periodicidade.TRIMESTRAL:
        case Periodicidade.SEMESTRAL:
        case Periodicidade.ANUAL:
        default:
          periodo = Object.keys(Mes)[getMonth(transacao.dataInicial)-1];
          break;
      }
      this.lancamentos[descricao] = this.lancamentos[descricao] || {};
      this.lancamentos[descricao][periodo] = transacao;
    });
  }

  get tiposPeriodo() {
    return [Periodicidade.ANUAL, Periodicidade.SEMESTRAL, Periodicidade.TRIMESTRAL, Periodicidade.MENSAL, Periodicidade.QUINZENAL, Periodicidade.SEMANAL];
  }
  
  private obterTransacoes() {
    const ateData = endOfYear(new Date());
    const iniData = startOfYear(ateData);
    this.lancamentos = {};

    this._transacaoService.obterTransacoes().subscribe(transacoes => {
      this.transacoes = transacoes.flatMap(transacao => {
        const projecao = transacao.programacaoTransacoes({inicio: iniData, fim: ateData});
        projecao.push(transacao);
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
        const primeiroDia = startOfDay(set(new Date(), {month: mes, date: 1}));
        const ultimoDia = endOfMonth(primeiroDia);
        return [...Array(getDate(ultimoDia))].map((_d,index)=>index+1).map(d=>d.toString() as string);
      case Periodicidade.TRIMESTRAL:
      case Periodicidade.SEMESTRAL:
      case Periodicidade.ANUAL:
        default:
        return Object.keys(Mes);
    }
  }

  get classesTransacao() {
    return Object.keys(this.lancamentos)
  }

  diaInicial(classe: string) {
    return Object.values(this.lancamentos[classe]).map(transacao=>!!transacao ? getDate(transacao.dataInicial):undefined).sort(this.comparePagamentos())[0];
  }

  private comparePagamentos(): (a: number | undefined, b: number | undefined) => number {
    return (a, b) => !a ? (!b ? 0 : 1) : (!b ? -1 : a - b);
  }

  get periodosCorrente() {
    switch (this.visao) {
      case Periodicidade.SEMANAL:
      case Periodicidade.QUINZENAL:
      case Periodicidade.MENSAL:
        const mes = Object.keys(Periodicidade).indexOf(this.periodoCorrente);
        const primeiroDia = startOfMonth(set(new Date, {month: mes}));
        const ultimoDia = endOfMonth(primeiroDia);
        return [...Array(getDate(ultimoDia))].map(d=>d+1).map(d=>d.toString() as string);
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
        return getDate(new Date()).toString();
      case Periodicidade.TRIMESTRAL:
      case Periodicidade.SEMESTRAL:
      case Periodicidade.ANUAL:
        default:
          const mesCorrente = getMonth(new Date())-1;
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
        return parseInt(periodo) < getDate(new Date());
      case Periodicidade.TRIMESTRAL:
      case Periodicidade.SEMESTRAL:
      case Periodicidade.ANUAL:
        default:
          return parseInt(periodo) < getMonth(new Date())-1;
    }
  }
  
  get totaisClasse() {
    const totais : {[classe: string] : number} = {};
    Object.keys(this.lancamentos).forEach(classe=>{
      totais[classe] = Object.values(this.lancamentos[classe])
          .map(transacao=>transacao?.valor)
          .reduce((acc, vl) => acc = (acc || 0) + (vl || 0)) || 0;
    });
    return totais;
  }
  
  get totaisMes() {
    const totais : {[mes: string] : number} = {};
    Object.values(this.lancamentos).forEach(pagamento=>{
      Object.keys(pagamento).forEach(mes=>{
        totais[mes] = (totais[mes] || 0) + (pagamento[mes]?.valor || 0);
      });
    });
    return totais;
  }

  get totais() {
    return Object.values(this.totaisMes).reduce((acc,vl)=>acc+=vl, 0);
  }

  editarTransacao(transacao: TransacaoImpl, titulo: string) {
    console.log(`Abrir Formulário Transação`)
    this._transacaoService.editarTransacao(transacao, titulo).subscribe(()=>{
      console.log(`Atualizando transações`)
      this.obterTransacoes();
    })
  }

  criarTransacao() {
    this.editarTransacao(new TransacaoImpl({}), "Criar transação");
  }
}

