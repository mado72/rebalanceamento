import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AtivoImpl, Moeda, TipoAtivo } from '../model/ativos.model';

@Component({
  selector: 'app-ativo-modal',
  templateUrl: './ativo-modal.component.html',
  styleUrls: ['./ativo-modal.component.scss']
})
export class AtivoModalComponent {

  @Input() ativo!: AtivoImpl;

  @Output() onClose = new EventEmitter<any>();

  @Output() onSave = new EventEmitter<AtivoImpl>();

  @Output() onRemove = new EventEmitter<AtivoImpl>();

  readonly moedas = Object.values(Moeda);

  readonly tipos = Object.values(TipoAtivo);

  constructor() { }

  close() {
    this.onClose.emit();
  }

  save() {
    this.onSave.emit(this.ativo);
  }

  remove() {
    this.onRemove.emit(this.ativo);
  }

}
