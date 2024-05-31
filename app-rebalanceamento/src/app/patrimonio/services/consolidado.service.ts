import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { format } from 'date-fns';
import { Observable, map } from 'rxjs';
import { IConta } from 'src/app/conta/model/conta.model';
import { environment } from 'src/environments/environment.development';
import { Consolidado, IConsolidado, TipoConsolidado } from '../models/patrimonio.model';

@Injectable({
  providedIn: 'root'
})
export class ConsolidadoService {

  constructor(private _http: HttpClient) { }

  obterConsolidados({inicio, fim, tipo}: {inicio?: Date, fim?: Date, tipo?: TipoConsolidado}): Observable<Consolidado[]> {
    let url = `${environment.apiUrl}/consolidado`;
    if (!!tipo) {
      url += `/tipo/${tipo}`;
    }
    url += this.preparaIntervalosData({inicio, fim});

    return this._http.get<IConsolidado[]>(url).pipe(
      map(consolidados => consolidados.map(consolidado => new Consolidado(consolidado)))
    )
  }

  definirConsolidados(consolidados: IConsolidado[]) {
    const url = `${environment.apiUrl}/consolidado`;
    let params : {[key: string]: string | number} = {};

    return this._http.post<Map<string, number | {[idx:number]: string}[]>>(url, consolidados, {params});
  }

  definirConsolidadosContas(contas: IConta[], anoMes: number) {
    const consolidados = contas.map(conta=> { return {
      idRef: conta._id as string,
      tipo: TipoConsolidado.CONTA,
      anoMes: anoMes,
      valor: conta.saldo
    }});
    return this.definirConsolidados(consolidados);
  }

  private preparaIntervalosData({inicio, fim}: {inicio?: Date, fim?: Date}) {
    const params = [];
    if (!!inicio) {
      params.push(`inicio=${format(inicio, 'yyyyMM')}`);
    }
    if (!!fim) {
      params.push(`fim=${format(fim, 'yyyyMM')}`);
    }
    if (params.length > 0) {
      return `?${params.join('&')}`;
    }
    return '';
  }

}
