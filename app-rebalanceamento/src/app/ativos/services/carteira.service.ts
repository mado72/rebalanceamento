import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { AtivoImpl, CarteiraImpl, IAtivo, ICarteira, ICarteiraAtivo, Moeda, TipoAtivo } from '../model/ativos.model';


type Alocacao = {
  _id?: number;
  nome: string,
  ativos: ICarteiraAtivo[];
  objetivo: number;
  tipoAtivo: TipoAtivo;
  moeda?: Moeda;
}

@Injectable({
  providedIn: 'root'
})
export class CarteiraService {
  
  constructor(
    private _http: HttpClient
  ) { }

  obterCarteiras(filtro?: {moeda?: Moeda, classe?: string}): Observable<CarteiraImpl[]> {
    let params = new HttpParams();
    if (!! filtro?.moeda) {
      params.append('moeda', filtro?.moeda);
    }
    if (!! filtro?.classe) {
      params.append('classe', filtro?.classe);
    }
    return this._http.get<ICarteira[]>(`${environment.apiUrl}/carteira`, { params })
      .pipe(
        map(carteiras=>carteiras.map(carteira=> new CarteiraImpl(carteira)))
      )
  }

  obterCarteira(id: string): Observable<CarteiraImpl | undefined> {
    return this._http.get<ICarteira>(`${environment.apiUrl}/carteira/${id}`)
      .pipe(
        map(carteira=> carteira? new CarteiraImpl(carteira) : undefined)
      )
  }

  obterTodosAtivos() : Observable<AtivoImpl[]> {
    return this._http.get<IAtivo[]>(`${environment.apiUrl}/ativo`)
      .pipe(
        map(ativos=>ativos.map(ativo=>new AtivoImpl(ativo)))
      )
  }

  obterAlocacao(carteira: CarteiraImpl): Observable<ICarteiraAtivo[]> {
    return this._http.get<Alocacao>(`${environment.apiUrl}/carteira/${carteira._id}/alocacao`)
      .pipe(
        map(alocacao=>{
          return alocacao.ativos;
        })
      )
    // TODO COntinuar depuração para listar os ativos da carteira
  }
  
  salvarCarteira(carteira: CarteiraImpl): Observable<CarteiraImpl> {
    return this._http.post<ICarteira>(`${environment.apiUrl}/carteira`, carteira)
      .pipe(
        map(carteira => new CarteiraImpl(carteira))
      );
  }
  
  atualizarCarteira(carteira: CarteiraImpl): Observable<boolean> {
    return this._http.put<ICarteira>(`${environment.apiUrl}/carteira`, carteira)
      .pipe(
        map(carteira => carteira? true : false)
      )
  }
  
  excluirCarteira(carteira: CarteiraImpl) {
    return this._http.delete<ICarteira>(`${environment.apiUrl}/carteira/${carteira._id}`)
      .pipe(
        map(carteira => carteira? true : false)
      )
  }
}
