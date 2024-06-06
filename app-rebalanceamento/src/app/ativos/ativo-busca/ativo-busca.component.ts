import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction, catchError, debounceTime, distinctUntilChanged, map, of, skipWhile, switchMap, tap } from 'rxjs';
import { AtivoImpl, IAtivo } from '../model/ativos.model';

@Component({
  selector: 'app-ativo-busca',
  templateUrl: './ativo-busca.component.html',
  styleUrls: ['./ativo-busca.component.scss']
})
export class AtivoBuscaComponent {
  constructor() {}
  
  termo: string = '';

  buscando: boolean = false;
  
  buscaFalhou: boolean = false;
  
  onTermoChanged = new EventEmitter<string>();
  
  ativos: IAtivo[] = [];

  @Input() provedor!: (termo: string) => Observable<IAtivo[]>;

  @Output() ativoSelecionado = new EventEmitter<IAtivo>();

  formatar = (value: any) => value._id? value.nome : value;

  buscarAtivo: OperatorFunction<string, readonly IAtivo[]> = ($text: Observable<string>) => 
    $text.pipe(
      skipWhile((termo)=>termo.length < 3),
      debounceTime(200),
      distinctUntilChanged(),
      tap(() => this.buscando = true),

      switchMap((termo)=>of(termo)
        .pipe(
          tap((termo) => {
            this.buscaFalhou = false;
            this.onTermoChanged.emit(termo);
          }),
          switchMap(() => this.provedor(termo)),
          map(ativos=>this.ativos = ativos),
          catchError(()=>{
            this.buscando = false;
            this.buscaFalhou = true;
            return of([]);
          }),
          tap(()=>this.buscando = false)
        ))
    )
  
  selecionarAtivo($event: NgbTypeaheadSelectItemEvent<IAtivo>) {
    this.ativoSelecionado.emit($event.item);
    this.termo = '';
  }

}
