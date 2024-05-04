import { Component, OnInit, inject } from '@angular/core';
import { DateTime } from 'luxon';
import { DespesaRecorrenteImpl, Mes } from '../models/despesa.model';
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

  pagamentos : Pagamentos = {};

  private modalService = inject(NgbModal);

  constructor(private despesasService: DespesasService) {}

  ngOnInit(): void {
    this.obterDespesas();
  }
  
  private obterDespesas() {
    const ateData = DateTime.now().endOf("year").toJSDate();
    this.pagamentos = {};

    this.despesasService.obterDespesas().subscribe(despesas => {
      despesas = despesas.flatMap(despesa => {
        const projecao = despesa.programacaoDespesas(ateData);
        projecao.push(despesa);
        return projecao;
      });
      despesas.forEach(despesa => {
        const descricao = despesa.descricao || 'Não classificado';
        const mesVencimento = despesa.mesVencimento;
        if (!!mesVencimento) {
          this.pagamentos[descricao] = this.pagamentos[descricao] || {};
          this.pagamentos[descricao][mesVencimento] = despesa;
        }
      });
    });
  }

  get meses() {
    return Object.keys(Mes);
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

  get mesCorrente() {
    const mesCorrente = DateTime.now().month - 1;
    return Object.values(Mes)[mesCorrente];
  }

  tipo(v: any) {
    return typeof v;
  }

  anteriorMesCorrente(mes: any) {
    const meses = this.meses;
    const atual = this.mesCorrente || Mes.JANEIRO;
    const idxMes = meses.indexOf(mes);
    const idxAtual = meses.indexOf(atual);
    return idxMes < idxAtual;
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

