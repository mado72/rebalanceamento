import { Component, Input } from '@angular/core';
import { getDate, isSameDay, isWithinInterval } from 'date-fns';
import { Evento } from '../calendario.model';

@Component({
  selector: 'app-calendario-celula',
  templateUrl: './calendario-celula.component.html',
  styleUrls: ['./calendario-celula.component.scss']
})
export class CalendarioCelulaComponent {

  @Input() dataSelecionada!: Date;

  @Input() data!: Date;

  @Input() primeiraDataMes!: Date;

  @Input() ultimaDataMes!: Date;

  @Input() eventos: Evento[] = [];

  get mesmaDataSelecionada() {
    return isSameDay(this.data, this.dataSelecionada);
  }

  get diaCorrente() {
    return isSameDay(this.data, new Date());
  }

  get diaNoMesCorrente() {
    return isWithinInterval(this.data, {start: this.primeiraDataMes, end: this.ultimaDataMes});
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

}
