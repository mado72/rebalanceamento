import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AtivoImpl } from '../model/ativos.model';

@Component({
  selector: 'app-ativo-modal',
  templateUrl: './ativo-modal.component.html',
  styleUrls: ['./ativo-modal.component.scss']
})
export class AtivoModalComponent {

  @Input() ativo!: AtivoImpl;

  @Output() onClose = new EventEmitter<any>();

  @Output() onSave = new EventEmitter<AtivoImpl>();

  constructor() { }

  close() {
    this.onClose.emit();
  }

  save() {
    this.onSave.emit(this.ativo);
  }

}
