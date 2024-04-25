import { Component, OnInit } from '@angular/core';
import { DespesaRecorrenteImpl, IDespesaRecorrente, Mes } from '../models/despesa.model';
import { DespesasService } from '../services/despesas.service';
import { PagamentosService } from '../services/pagamentos.service';
import { DateTime } from 'luxon';
import { combineLatest, map } from 'rxjs';

class Pagamento extends DespesaRecorrenteImpl {
  antecipado = false;

  constructor(val: IDespesaRecorrente, antecipado: boolean) {
    super(val);
    this.antecipado = antecipado;
  }

  get dtPagamento() {
    return this.dataPagamento ? DateTime.fromJSDate(this.dataPagamento) : undefined;
  }

  compare(pagamento: Pagamento): number {
    const diffVencimento = this.diaVencimento - pagamento.diaVencimento;
    if (diffVencimento == 0) {
      if (!!this.dtPagamento) {
        return ! pagamento.dtPagamento ? 1 : this.dtPagamento.diff(pagamento.dtPagamento).days;
      }
      return !! pagamento.dtPagamento ? -1 : this.descricao.localeCompare(pagamento.descricao);
    }
    return diffVencimento;
  }

  get pago() {
    return !! this.dataPagamento;
  }

  set pago(val: boolean) {
    
    if (!val) {
      this.dataPagamento = undefined;
    }
    else if (!this.dataPagamento) {
      this.dataPagamento = new Date();
    }

  }
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

  readonly meses = Mes;

  mes: Mes = Mes.JANEIRO;

  pagamentos: Pagamento[] = [];
  constructor(private despesasService: DespesasService) { }

  ngOnInit(): void {
    const month = DateTime.now().month;
    this.mes = Object.values(Mes)[month - 1];

    this.recuperarPagamentos();
  }

  /**
   * Obtém a lista de pagamentos para o mês atual.
   *
   * @remarks
   * Este método recupera as despesas e os pagamentos programados para o mês atual,
   * e gera pagamentos para despesas sem pagamentos programados.
   */
  recuperarPagamentos() {
    this.despesasService.obterDespesas()
     .pipe(
        map(despesas => despesas.map(d => new Pagamento(d, d.diaVencimento < 20)))
      )
      .subscribe(pagamentos => {
        this.ordenarPagamentos(pagamentos);
        this.pagamentos = pagamentos;
      });
  }
    
  ordenarPagamentos(pagamentos: Pagamento[]) {
    return pagamentos.sort((a,b)=>{
      return a.compare(b)
    });
  }

  get total() : Total {
    return this.pagamentos.map(pagamento=>{
      return {
        pagamentos: pagamento.valor,
        pagamentosAntecipados: !pagamento.dtPagamento &&  pagamento.antecipado? pagamento.valor : 0,
        pagamentosRestantes: !pagamento.dtPagamento ? pagamento.antecipado? 0 : pagamento.valor : 0,
        pagos: !! pagamento.dtPagamento ? pagamento.valor : 0
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

  valorAlterado(pagamento: Pagamento) {
    pagamento.dataPagamento = new Date();
  }

  salvarAlteracoes() {
    console.warn(`Falta implementar salvar alteracoes`);
  }

}
