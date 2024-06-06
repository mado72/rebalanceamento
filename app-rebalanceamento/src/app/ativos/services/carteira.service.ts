import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { AtivoImpl, CarteiraImpl, IAtivo, ICarteira, ICarteiraAtivo, Moeda, TipoAtivo } from '../model/ativos.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CarteiraFormComponent } from '../carteira-form/carteira-form.component';
import { AlertService } from 'src/app/services/alert.service';


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
    private _http: HttpClient,
    private _modalService: NgbModal,
    private _alertService: AlertService
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

  obterAlocacao(carteira: ICarteira): Observable<ICarteiraAtivo[]> {
    return this._http.get<Alocacao>(`${environment.apiUrl}/carteira/${carteira._id}/alocacao`)
      .pipe(
        map(alocacao=>{
          return alocacao.ativos;
        })
      )
  }

  atualizarAlocacao(carteria: ICarteira): Observable<ICarteiraAtivo[]> {
    return this._http.post<Alocacao>(`${environment.apiUrl}/carteira/${carteria._id}/alocacao`, carteria.items)
      .pipe(
        map(alocacao=>{
          return alocacao.ativos;
        })
      )
  }
  
  salvarCarteira(carteira: ICarteira): Observable<CarteiraImpl> {
    return this._http.post<ICarteira>(`${environment.apiUrl}/carteira`, carteira)
      .pipe(
        map(carteira => new CarteiraImpl(carteira))
      );
  }
  
  atualizarCarteira(carteira: ICarteira): Observable<boolean> {
    return this._http.put<ICarteira>(`${environment.apiUrl}/carteira`, carteira)
      .pipe(
        map(carteira => carteira? true : false)
      )
  }
  
  excluirCarteira(carteira: ICarteira) {
    return this._http.delete<ICarteira>(`${environment.apiUrl}/carteira/${carteira._id}`)
      .pipe(
        map(carteira => carteira? true : false)
      )
  }

  buscarAtivos(termo: string) {
    return this._http.get<IAtivo[]>(`${environment.apiUrl}/ativo?nome=${termo}`)
  }

  atualizarAtivo(ativo: AtivoImpl) {
    return this._http.put<IAtivo>(`${environment.apiUrl}/ativo`, ativo)
      .pipe(
        map(ativo => new AtivoImpl(ativo))
      )
  }

  salvarAtivo(ativo: AtivoImpl) {
    if (ativo._id !== undefined) {
      return this.atualizarAtivo(ativo);
    }
    
    return this._http.post<IAtivo>(`${environment.apiUrl}/ativo`, ativo)
      .pipe(
        map(ativo => new AtivoImpl(ativo))
      )
  }

  removerAtivo(ativo: AtivoImpl) {
    return this._http.delete<IAtivo>(`${environment.apiUrl}/ativo/${ativo._id}`)
      .pipe(
        map(ativo => new AtivoImpl(ativo))
      )
  }

  editarCarteira(carteira: CarteiraImpl) : Observable<CarteiraImpl|void> {
    const ob = new Observable<CarteiraImpl|void>((observer:Observer<CarteiraImpl|void>) => {
      
      const modalRef = this._modalService.open(CarteiraFormComponent, { size: 'lg' });
      const component = modalRef.componentInstance as CarteiraFormComponent;
  
      component.onSalvar.subscribe((carteira) => {
        modalRef.close({action: 'salvar', carteira: carteira});
      });
      component.onCancelar.subscribe(() => {
        modalRef.dismiss('cancelar');
      });
      component.carteira = carteira;
      
      modalRef.result.then((result)=>{
        if (result.action === 'salvar') {
          this.salvarEdicaoCarteira(result.carteira);
          observer.next(result.carteira);
          observer.complete();
        }
      }, ()=>{
        this._alertService.alert({
          titulo: 'Resultado da operação',
          mensagem: 'Operação cancelada',
          tipo: 'common'
        });
        observer.next();
        observer.complete
      })

    });
    return ob;
  }

  salvarEdicaoCarteira(carteira: CarteiraImpl) {
    console.log(`Salvar ${carteira.nome}`);
    if (!! carteira._id) {
      this.atualizarCarteira(carteira).subscribe(()=>{
        this._alertService.alert({
          titulo: 'Resultado da operação',
          mensagem: 'Carteira atualizada',
          tipo: 'sucesso'
        })
      });
    }
    else {
      this.salvarCarteira(carteira).subscribe(()=>{
        this._alertService.alert({
          titulo: 'Resultado da operação',
          mensagem: 'Carteira criada',
          tipo: 'sucesso'
        })
      });
    }
  }

}
