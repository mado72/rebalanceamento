import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AtivoImpl, ICarteira, Moeda, TipoAtivo, TipoObjetoReferenciado } from '../model/ativos.model';
import { CarteiraService } from '../services/carteira.service';

class ReferenciaCarteira {
  id: string;
  tipo: TipoObjetoReferenciado;
  nome: string;
  constructor(id: string, tipo: TipoObjetoReferenciado, nome: string) {
    this.id = id;
    this.tipo = tipo;
    this.nome = nome;
  }
}

@Component({
  selector: 'app-ativo-modal',
  templateUrl: './ativo-modal.component.html',
  styleUrls: ['./ativo-modal.component.scss']
})
export class AtivoModalComponent implements OnInit {

  @Input() ativo!: AtivoImpl;

  @Output() onClose = new EventEmitter<any>();

  @Output() onSave = new EventEmitter<AtivoImpl>();

  @Output() onRemove = new EventEmitter<AtivoImpl>();

  readonly moedas = Object.values(Moeda);

  readonly tipos = Object.values(TipoAtivo);

  readonly tipoAtivoRef = TipoAtivo.REFERENCIA;

  readonly tipoRefCarteira = TipoObjetoReferenciado.CARTEIRA;

  carteiras: ICarteira[] = [];

  constructor(
    private _carteiraService: CarteiraService
  ) { }

  ngOnInit(): void {
      if (this.ativo.referencia?.id) {
        this.obterCarteiras();
      }
  }

  close() {
    this.onClose.emit();
  }

  save() {
    this.onSave.emit(this.ativo);
  }

  remove() {
    this.onRemove.emit(this.ativo);
  }

  obterCarteiras() {
    this._carteiraService.obterCarteiras().subscribe(carteiras => {
      this.carteiras = carteiras;
    });
  }

  get carteiraReferenciaId() {
    return this.ativo.referencia?.id;
  }

  set carteiraReferenciaId(id: string | undefined) {
    this.ativo.referencia = id ? {
      id,
      tipo: TipoObjetoReferenciado.CARTEIRA
    } : undefined;
  }

}
