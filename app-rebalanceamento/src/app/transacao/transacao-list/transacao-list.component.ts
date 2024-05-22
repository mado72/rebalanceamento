import { Component, ViewChild } from '@angular/core';
import { endOfMonth, endOfYear, getDate, getMonth, set, startOfDay, startOfMonth, startOfYear } from 'date-fns';
import { AlertService } from 'src/app/services/alert.service';
import { Mes, Periodicidade, TipoTransacao, TransacaoImpl } from '../models/transacao.model';
import { TransacaoService } from '../services/transacao.service';
import { PopupMenuComponent } from 'src/app/util/popup-menu/popup-menu.component';

class Lancamentos {
  transacoes: TransacaoImpl[] = [];
  push(transacoes: TransacaoImpl) {
    this.transacoes.push(transacoes);
  }
  get total() {
    return this.transacoes
      .filter(transacao=>[TipoTransacao.DEBITO, TipoTransacao.CREDITO].includes(transacao.tipoTransacao))
      .reduce((total, transacao) => Lancamentos.somaTransacao({total, transacao}), 0);
  }
  get unico() {
    return this.transacoes.length < 2;
  }
  static somaTransacao = ({total, transacao} : {total: number, transacao: TransacaoImpl}) => {
    return total + (transacao.tipoTransacao == TipoTransacao.DEBITO? 1 : -1) * transacao.valor;
  }
}

type LancamentosMatriz = {[classe: string] : {[mes: string] : Lancamentos | undefined}};


@Component({
  selector: 'app-transacao-list',
  templateUrl: './transacao-list.component.html',
  styleUrls: ['./transacao-list.component.scss']
})
export class TransacaoListComponent {

  @ViewChild(PopupMenuComponent) menu!: PopupMenuComponent;

  private transacoes: TransacaoImpl[] = [];

  matriz : LancamentosMatriz = {};

  popupTransacoes : TransacaoImpl[] = [];

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
          periodo = Object.keys(Mes)[getMonth(transacao.dataInicial)];
          break;
      }
      this.matriz[descricao] = this.matriz[descricao] || {};
      const lancamento = this.matriz[descricao];
      if (!lancamento[periodo]) {
        lancamento[periodo] = new Lancamentos();
      }
      lancamento[periodo]?.push(transacao);
    });
  }

  get tiposPeriodo() {
    return [Periodicidade.ANUAL, Periodicidade.SEMESTRAL, Periodicidade.TRIMESTRAL, Periodicidade.MENSAL, Periodicidade.QUINZENAL, Periodicidade.SEMANAL];
  }

  classeLancamento(transacao: TransacaoImpl) {
    return transacao && {
      liquidado: !!transacao.dataLiquidacao,
      debito: transacao.tipoTransacao == TipoTransacao.DEBITO,
      credito: transacao.tipoTransacao == TipoTransacao.CREDITO,
      projecao: !transacao._id,
      transferencia: transacao.tipoTransacao == TipoTransacao.TRANSFERENCIA,
      semorigem: !transacao.origem
    } || {}
  }
  
  private obterTransacoes() {
    const ateData = endOfYear(new Date());
    const iniData = startOfYear(ateData);
    this.matriz = {};

    this._transacaoService.obterTransacoes().subscribe(transacoes => {
      console.log(`Transacoes matriz:`, transacoes)
      this.transacoes = transacoes
        
        .filter(transacao=>transacao.descricao === "Fundação")

        .sort((a,b)=>1000 * (getDate(a.dataInicial) - getDate(b.dataInicial)) + a.descricao.localeCompare(b.descricao))
        .flatMap(transacao => {
          const projecao = transacao.programacaoTransacoes({inicio: iniData, fim: ateData});
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
    return Object.keys(this.matriz)
  }

  diaInicial(classe: string) {
    return Object.values(this.matriz[classe])
      .map(lancamentos=>!!lancamentos ? getDate(lancamentos.transacoes[0]?.dataInicial):undefined)
      .sort((a, b) => !a ? (!b ? 0 : 1) : (!b ? -1 : a - b))[0];
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
  
  get totaisClasse() {
    const totais : {[classe: string] : number} = {};
    Object.keys(this.matriz).forEach(classe=>{
      totais[classe] = Object.values(this.matriz[classe])
          .filter(lancamentos=>lancamentos?.total)
          .flatMap(lancamentos=>lancamentos?.total || 0)
          .reduce((acc, vl) => acc += vl);
    });
    return totais;
  }
  
  get totaisMes() {
    const totais : {[mes: string] : number} = {};

    Object.values(this.matriz)
      .forEach(lancamentosMes=>{
        Object.entries(lancamentosMes).forEach(entry=>{
          totais[entry[0]] = (totais[entry[0]] || 0) + (entry[1]?.total || 0);
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

  abrirPopupTransacoes(transacoes: any, e: MouseEvent) {
    console.log(transacoes.map((transacao:TransacaoImpl)=>{
      return {
        id: transacao._id,
        descricao: transacao.descricao,
        valor: transacao.valor,
        tipoTransacao: transacao.tipoTransacao,
        periodicidade: transacao.periodicidade,
        dataInicial: transacao.dataInicial,
      }
    }));
    this.popupTransacoes = transacoes;
    this.menu.open(e)
  }
}

