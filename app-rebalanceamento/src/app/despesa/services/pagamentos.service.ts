import { Injectable } from '@angular/core';
import { Observable, filter, map, of, tap } from 'rxjs';
import { DespesasService } from './despesas.service';

@Injectable({
  providedIn: 'root'
})
export class PagamentosService {
/*
  private pagamentos: Pagamento[] = [];

  constructor(private despesaService: DespesasService) { }

  obterPagamentos() : Observable<Pagamento[]> {
    if (this.pagamentos.length > 0) return of(this.pagamentos);

    return this.buildPagamentos().pipe(
      tap(pagamentos=>{this.pagamentos = pagamentos})
    );
  }

  private buildPagamentos(): Observable<Pagamento[]> {
    let contador = 0;

    return this.despesaService.obterDespesas().pipe(
      map(despesasProgramadas=>{
        return despesasProgramadas.map(dp => {
            const dpId = dp.id || 0;
            const id = dpId * 1000 + ++contador;
            const dateOrNull = 100 * Math.random() % 2 == 0 ? new Date(): null;
            return {
              id: id,
              despesaProgramadaId: dpId,
              valor: dp.valor || 0,
              dataPagamento: dateOrNull,
              pago: false
            };
          });
      })
    );
  }

  obterPagamentosMes(mes: Mes): Observable<Pagamento[]> {
    const mesIdx = Object.values(Mes).indexOf(mes);
    return this.obterPagamentos().pipe(
      map((pagamentos)=>{
        return pagamentos.filter((pagto)=>{
          return pagto.dataPagamento && pagto.dataPagamento.getMonth() === mesIdx;
        });
      })
    )
  }

  salvarPagamentos(pagamentos: PagamentoProgramado[]): Observable<string> {
    this.pagamentos = pagamentos;
    return of('Salvo com sucesso!');
  }
  */
}
