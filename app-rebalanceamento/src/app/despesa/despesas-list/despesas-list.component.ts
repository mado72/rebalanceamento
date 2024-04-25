import { Component, OnInit } from '@angular/core';
import { DateTime } from 'luxon';
import { DespesaRecorrenteImpl, Mes } from '../models/despesa.model';
import { DespesasService } from '../services/despesas.service';
import { toArray } from 'rxjs';

type Pagamentos = {[classe: string] : {[mes: string] : DespesaRecorrenteImpl | undefined}};

@Component({
  selector: 'app-despesas-list',
  templateUrl: './despesas-list.component.html',
  styleUrls: ['./despesas-list.component.scss']
})
export class DespesasListComponent implements OnInit {

  pagamentos : Pagamentos = {};

  constructor(private despesasService: DespesasService) {

  }

  ngOnInit(): void {
    const ateData = DateTime.now().endOf("year").toJSDate();
    const meses = Object.values(Mes);

    this.despesasService.obterDespesas().subscribe(despesas=>{
      despesas = despesas.flatMap(despesa=>{
        const projecao = despesa.programacaoDespesas(ateData);
        projecao.push(despesa);
        return projecao;
      });
      despesas.forEach(despesa=>{
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
    return Object.values(this.pagamentos[classe]).map(despesa=>despesa?.diaVencimento).sort((a,b)=>!a? (!b ? 0 : 1) : (!b ? -1 : a - b))[0];
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

}

