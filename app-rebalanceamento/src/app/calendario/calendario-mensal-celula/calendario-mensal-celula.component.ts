import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  get color() {
    return ['red', 'green', 'yellow'][this.dia % 3];
  }

  public get led() {
    return `led-${this.color}`;
  }

  eventoClick(evento:Evento) {
    this.eventoClicked.emit(evento);
    console.log(evento);
  }

}
