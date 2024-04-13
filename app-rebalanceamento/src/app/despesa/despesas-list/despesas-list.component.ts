import { Component, OnInit } from '@angular/core';
import { DespesaProgramada, Meses, Pagamento, obterMes } from '../models/despesa';

@Component({
  selector: 'app-despesas-list',
  templateUrl: './despesas-list.component.html',
  styleUrls: ['./despesas-list.component.scss']
})
export class DespesasListComponent implements OnInit {

  matriz = new Map<Meses, Pagamento[]>();

  ngOnInit(): void {
    Object.values(Meses).forEach((mes)=>{
      this.matriz.set(mes, this.getPagamentos());
    });
  }

  private getPagamentos(): Pagamento[] {
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

  get pagamentos() {
    const a : {[key: string] : {[id: string] : Pagamento}} = {};
    Object.values(Meses).forEach((mes)=>{
      const pagamentos = this.matriz.get(mes) || [];
      if (!a[mes]) {
        a[mes] = {};
      }
      pagamentos.forEach(pagto=>{
        a[mes][pagto.despesaProgramadaId] = pagto;
      })
    });
    return a;
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
