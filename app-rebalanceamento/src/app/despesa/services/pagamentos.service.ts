import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Pagamento } from '../models/despesa';
import { DespesasService } from './despesas.service';

@Injectable({
  providedIn: 'root'
})
export class PagamentosService {

  constructor(private despesaService: DespesasService) { }

  obterPagamentos() : Observable<Pagamento[]> {
    return this.buildPagamentos();
  }

  private buildPagamentos(): Observable<Pagamento[]> {
    let contador = 0;

    return this.despesaService.getDespesas().pipe(
      map(despesasProgramadas=>{
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
      })
    );
  }
}
