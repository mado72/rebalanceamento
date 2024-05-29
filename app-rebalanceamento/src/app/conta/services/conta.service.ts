import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Conta, IConta } from '../model/conta.model';

@Injectable({
  providedIn: 'root'
})
export class ContaService {
  private contas: Conta[] = [];

  constructor(
    private _http: HttpClient
  ) { }

  listarContas(): Observable<Conta[]> {
    return this._http.get<IConta[]>(`${environment.apiUrl}/conta`).pipe(
      map(contas=>contas.map(item=>new Conta(item)).sort((a,b)=>a.conta.localeCompare(b.conta)))
    );
  }

  salvarConta(conta: Conta) {
    if (!conta._id) {
      return this._http.post<Conta>(`${environment.apiUrl}/conta`, conta)
        .pipe(
          map(item => item._id != undefined)
        )
    }
    return this._http.put<Conta>(`${environment.apiUrl}/conta`, conta)
      .pipe(
        map(item => item._id != undefined)
      )
  }

  excluirConta(conta: Conta) {
    return this._http.delete<IConta>(`${environment.apiUrl}/conta/${conta._id}`)
     .pipe(
        map(item => new Conta(item))
      );
  }

}
