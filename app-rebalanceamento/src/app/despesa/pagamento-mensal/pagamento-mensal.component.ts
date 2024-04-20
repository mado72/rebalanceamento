import { Component, OnInit } from '@angular/core';
import { DespesaProgramada, Mes, Meses, Pagamento, PagamentoProgramado } from '../models/despesa';
import { DespesasService } from '../services/despesas.service';
import { PagamentosService } from '../services/pagamentos.service';
import { DateTime } from 'luxon';
import { combineLatest, map } from 'rxjs';

class PagamentoProgramadoItem extends PagamentoProgramado {
  alterado = false;
}

interface Total {
  pagamentos: number;
  pagamentosAntecipados: number;
  pagamentosRestantes: number;
  pagos: number;
}
@Component({
  selector: 'app-pagamento-mensal',
  templateUrl: './pagamento-mensal.component.html',
  styleUrls: ['./pagamento-mensal.component.scss']
})
export class PagamentoMensalComponent implements OnInit {

  readonly meses = Meses;

  mes: Meses = Meses.JANEIRO;

  pagamentos: PagamentoProgramadoItem[] = [];
  constructor(private despesasService: DespesasService, private pagamentosService: PagamentosService) { }

  ngOnInit(): void {
    const month = DateTime.now().month;
    this.mes = Object.values(Meses)[month - 1];

    this.obterListaPagamentos();
  }

  /**
   * Obtém a lista de pagamentos para o mês atual.
   *
   * @remarks
   * Este método recupera as despesas e os pagamentos programados para o mês atual,
   * e gera pagamentos para despesas sem pagamentos programados.
   */
  private obterListaPagamentos() {
    const despesasOb = this.despesasService.obterDespesas();
    const pagamentosOb = this.pagamentosService.obterPagamentosMes(this.mes);

    // Gera paagamentos para as despesas sem pagamentos programados
    combineLatest([despesasOb, pagamentosOb])
      .pipe(map(value => {

        const pagtosDespesaId = value[1].map(item => item.despesaProgramadaId);

        const novosPagamentos = value[0]
          .filter(despesa => {
            return pagtosDespesaId.indexOf(despesa.id || -1) < 0;
          })
          .map(item => {
            return Object.assign(new PagamentoProgramado(), {
              valor: item.valor,
              despesa: item,
              dataPagamento: new Date(),
            }) as Pagamento;
          });

        const mapIdDespesa = Object.fromEntries(value[0].map(item=>[item.id, item]));
        return value[1].concat(novosPagamentos)
          .map(pagto=>{
             const despesa = mapIdDespesa[pagto.despesaProgramadaId];
             return Object.assign(new PagamentoProgramadoItem(), {
               id: pagto.id,
               valor: pagto.valor,
               despesa: despesa,
               dataPagamento: pagto.dataPagamento,
             });
 
          });

      }))
      .subscribe(pagamentos => {
        this.pagamentos = pagamentos;
      });
  }

  get total() : Total {
    return this.pagamentos.map(pagamento=>{
      return {
        pagamentos: pagamento.valor,
        pagamentosAntecipados: pagamento.despesa.diaVencimento < 20? pagamento.valor : 0,
        pagamentosRestantes: pagamento.despesa.diaVencimento < 20? 0 : pagamento.valor,
        pagos: pagamento.pago ? pagamento.valor : 0
      } as Total
    })
    .reduce((acc, item)=>{
       return {
         pagamentos: acc.pagamentos + item.pagamentos,
         pagamentosAntecipados: acc.pagamentosAntecipados + item.pagamentosAntecipados,
         pagamentosRestantes: acc.pagamentosRestantes + item.pagamentosRestantes,
         pagos: acc.pagos + item.pagos
       };
     })
  }

  valorAlterado(pagamento: PagamentoProgramadoItem) {
    pagamento.alterado = true;
  }
}
