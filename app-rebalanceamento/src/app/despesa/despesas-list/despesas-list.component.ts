import { Component, OnInit } from '@angular/core';
import { DespesaProgramada, Meses, Pagamento, obterMes } from '../models/despesa';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-despesas-list',
  templateUrl: './despesas-list.component.html',
  styleUrls: ['./despesas-list.component.scss']
})
export class DespesasListComponent implements OnInit {

  pagamentos : {[key: string] : {[id: string] : Pagamento}} = {};

  ngOnInit(): void {
    const auxPagamentos = this.buildPagamentos();
    Object.keys(Meses).forEach((mes)=>{
      if (!this.pagamentos[mes]) {
        this.pagamentos[mes] ={};
      }
      auxPagamentos.forEach(pagto=>{
        this.pagamentos[mes][pagto.despesaProgramadaId] = pagto;
      })
    });
  }

  private buildPagamentos(): Pagamento[] {
    let contador = 0;
    return despesasProgramadas.map(dp => {
      const dpId = dp.id || 0;
      const id = dpId * 1000 + ++contador;
      const dateOrNull = 100 * Math.random() % 2 == 0 ? new Date(): null;
      return {
        id: id,
        despesaProgramadaId: dpId,
        valor: dp.valor || 0,
        dataPagamento: dateOrNull
      };
    });
  }

  get meses() {
    return Object.keys(Meses);
  }

  get despesasProgramadas() {
    return despesasProgramadas;
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

const despesasProgramadas: Partial<DespesaProgramada>[] = [
  {
    id: 1,
    nome: 'Aluguel',
    valor: 1200.00,
    diaVencimento: 10,
  },
  {
    id: 2,
    nome: 'Plano de Saúde',
    valor: 250.00,
    diaVencimento: 5
  },
  {
    id: 3,
    nome: 'Internet e Luz',
    valor: 200.00,
    diaVencimento: 20
  },
  {
    id: 4,
    nome: 'Telefone Celular',
    valor: 80.00,
    diaVencimento: 15
  },
  {
    id: 5,
    nome: 'Supermercado',
    valor: 500.00,
    diaVencimento: 25
  },
  {
    id: 6,
    nome: 'Academia',
    valor: 100.00,
    diaVencimento: 7
  },
  {
    id: 7,
    nome: 'Streaming',
    valor: 50.00,
    diaVencimento: 1
  },
  {
    id: 8,
    nome: 'Transporte',
    valor: 300.00,
    diaVencimento: 18
  },
  {
    id: 9,
    nome: 'Lazer',
    valor: 200.00,
    diaVencimento: 22
  },
  {
    id: 10,
    nome: 'Outros',
    valor: 150.00,
    diaVencimento: 30
  }
];
