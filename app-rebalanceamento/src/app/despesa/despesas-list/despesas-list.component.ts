import { Component, OnInit } from '@angular/core';
import { DespesaProgramada, Meses, Pagamento, obterMes } from '../models/despesa.model';
import { DateTime } from 'luxon';
import { DespesasService } from '../services/despesas.service';
import { Observable, map } from 'rxjs';
import { PagamentosService } from '../services/pagamentos.service';

@Component({
  selector: 'app-despesas-list',
  templateUrl: './despesas-list.component.html',
  styleUrls: ['./despesas-list.component.scss']
})
export class DespesasListComponent implements OnInit {

  pagamentos : {[key: string] : {[id: string] : Pagamento}} = {};

  constructor(private despesasService: DespesasService, private pagamentosService: PagamentosService) {

  }

  ngOnInit(): void {
    this.pagamentosService.obterPagamentos().subscribe(auxPagamentos=>{
      auxPagamentos.sort(()=>Math.random() - 0.5);
      Object.keys(Meses).forEach((mes)=>{
        if (!this.pagamentos[mes]) {
          this.pagamentos[mes] ={};
        }
        auxPagamentos.forEach(pagto=>{
          this.pagamentos[mes][pagto.despesaProgramadaId] = pagto;
        })
      });
    });
  }

  get meses() {
    return Object.keys(Meses);
  }

  get despesasProgramadas() {
    return this.despesasService.obterDespesas();
  }

  get mesCorrente() {
    const mesCorrente = DateTime.now().month - 1;
    return Object.values(Meses).find((v,i)=>i == mesCorrente);
  }

  tipo(v: any) {
    return typeof v;
  }

  anteriorMesCorrente(mes: any) {
    const meses = this.meses;
    const atual = this.mesCorrente || Meses.JANEIRO;
    const idxMes = meses.indexOf(mes);
    const idxAtual = meses.indexOf(atual);
    return idxMes < idxAtual;
  }

}

