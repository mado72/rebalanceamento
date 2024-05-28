import { AfterViewInit, Component, EventEmitter, HostBinding, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { getDate, getDay, isSameDay, isWithinInterval } from 'date-fns';
import { Evento } from '../calendario.model';

@Component({
  selector: 'app-calendario-mensal-celula',
  templateUrl: './calendario-mensal-celula.component.html',
  styleUrls: ['./calendario-mensal-celula.component.scss']
})
export class CalendarioMensalCelulaComponent {

  @Input() dataSelecionada!: Date;

  @Input() data!: Date;

  @Input() primeiraDataMes!: Date;

  @Input() ultimaDataMes!: Date;

  @Input() eventos: Evento[] = [];

  @Input() mesCorrente = false;

  @Output() eventoClicked = new EventEmitter<Evento>();

  @ViewChild('defaultDetalhes') defaultDetalhes!: TemplateRef<any>;

  @Input() tipMinWidth = "160px";

  @Input() templateDetalhes: TemplateRef<any> | undefined;

  constructor() { 
  }

  get mesmaDataSelecionada() {
    return isSameDay(this.data, this.dataSelecionada);
  }

  get diaCorrente() {
    return isSameDay(this.data, new Date());
  }

  get diaSemana() {
    return getDay(this.data)
  }

  get dia() {
    return getDate(this.data)
  }

  eventoClick(evento:Evento) {
    this.eventoClicked.emit(evento);
  }

}
