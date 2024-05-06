import { Component, OnInit, inject } from '@angular/core';
import { DateTime } from 'luxon';
import { DespesaRecorrenteImpl, Mes, Periodicidade } from '../models/despesa.model';
import { DespesasService } from '../services/despesas.service';
import { toArray } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CadastroDespesaModalComponent } from '../cadastro-despesa-modal/cadastro-despesa-modal.component';

type Pagamentos = {[classe: string] : {[mes: string] : DespesaRecorrenteImpl | undefined}};

@Component({
  selector: 'app-despesas-list',
  templateUrl: './despesas-list.component.html',
  styleUrls: ['./despesas-list.component.scss']
})
export class DespesasListComponent implements OnInit {

  private despesas: DespesaRecorrenteImpl[] = [];

  pagamentos : Pagamentos = {};

  private _visao!: Periodicidade;

  private modalService = inject(NgbModal);

  constructor(private despesasService: DespesasService) {}

  ngOnInit(): void {
    this.obterDespesas();
  }

  public get visao(): Periodicidade {
    return this._visao;
  }
  public set visao(value: Periodicidade) {
    this._visao = value;

    this.despesas.forEach(despesa => {
      const descricao = despesa.descricao || 'Não classificado';
      let periodo;
      switch (this.visao) {
        case Periodicidade.SEMANAL:
        case Periodicidade.QUINZENAL:
        case Periodicidade.MENSAL:
          periodo = DateTime.fromJSDate(despesa.dataVencimento).day.toString();
          break;
        case Periodicidade.TRIMESTRAL:
        case Periodicidade.SEMESTRAL:
        case Periodicidade.ANUAL:
        default:
          periodo = Object.keys(Mes)[DateTime.fromJSDate(despesa.dataVencimento).month-1];
          break;
      }
      this.pagamentos[descricao] = this.pagamentos[descricao] || {};
      this.pagamentos[descricao][periodo] = despesa;
    });
  }

  get tiposPeriodo() {
    return [Periodicidade.ANUAL, Periodicidade.SEMESTRAL, Periodicidade.TRIMESTRAL, Periodicidade.MENSAL, Periodicidade.QUINZENAL, Periodicidade.SEMANAL];
  }
  
  private obterDespesas() {
    const ateData = DateTime.now().endOf("year").toJSDate();
    this.pagamentos = {};

    this.despesasService.obterDespesas().subscribe(despesas => {
      this.despesas = despesas.flatMap(despesa => {
        const projecao = despesa.programacaoDespesas(ateData);
        projecao.push(despesa);
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
    return Object.keys(this.pagamentos)
  }

  diaVencimento(classe: string) {
    return Object.values(this.pagamentos[classe]).map(despesa=>despesa?.diaVencimento).sort(this.comparePagamentos())[0];
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
    Object.keys(this.pagamentos).forEach(classe=>{
      totais[classe] = Object.values(this.pagamentos[classe])
          .map(despesa=>despesa?.valor)
          .reduce((acc, vl) => acc = (acc || 0) + (vl || 0)) || 0;
    });
    return totais;
  }
  
  get totaisMes() {
    const totais : {[mes: string] : number} = {};
    Object.values(this.pagamentos).forEach(pagamento=>{
      Object.keys(pagamento).forEach(mes=>{
        totais[mes] = (totais[mes] || 0) + (pagamento[mes]?.valor || 0);
      });
    });
    return totais;
  }

  get totais() {
    return Object.values(this.totaisMes).reduce((acc,vl)=>acc+=vl, 0);
  }

  abrirDespesaForm(despesa: DespesaRecorrenteImpl, titulo: string) {
    const modalRef = this.modalService.open(CadastroDespesaModalComponent, { size: 'lg' });
    const component = modalRef.componentInstance as CadastroDespesaModalComponent;
    component.onCancelar.subscribe((ev: any) => modalRef.dismiss(ev));
    component.onSalvar.subscribe((ev: any) => modalRef.close(ev));
    component.despesa = despesa;
    component.titulo = titulo;

    modalRef.result.then((result) => {
      this.despesasService.salvarDespesa(result as DespesaRecorrenteImpl).subscribe(() => this.obterDespesas());
    }, (reason) => {
      console.log(`Dismissed ${reason}`);
    });
  }
}

