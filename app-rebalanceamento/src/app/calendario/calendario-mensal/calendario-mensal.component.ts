import { Component, EventEmitter, Input, Output } from '@angular/core';
import { addDays, addMonths, endOfMonth, getDate, getDay, isSameDay, startOfMonth } from 'date-fns';
import { Evento } from '../calendario.model';

@Component({
  selector: 'app-calendario-mensal',
  templateUrl: './calendario-mensal.component.html',
  styleUrls: ['./calendario-mensal.component.scss']
})
export class CalendarioMensalComponent {

  @Input() dataSelecionada = new Date();

  @Input() eventos: Evento[] = [];

  @Output() eventoClicked = new EventEmitter<Evento>();

  @Output() dataClicked = new EventEmitter<Date>();

  constructor() {
    const colors = ['red','black','blue','green','yellow'];
    const now = new Date();

    for (let i = 0; i < 100; i++) {
      this.eventos.push({
        data: addDays(now, Math.random() * 30 - 15),
        titulo: `Evento ${i+1}`,
        descricao: `Descrição do evento ${i}`,
        cor:colors[Math.trunc(Math.random() * colors.length)],
      })
    }
  }

  get primeiroDiaMes() {
    return getDay(this.primeiraDataMes);
  }

  get primeiraDataMes() {
    return startOfMonth(this.dataSelecionada);
  }
  
  get ultimaDataMes() {
    return endOfMonth(this.dataSelecionada);
  }

  get diasNoMes() {
    return getDate(endOfMonth(this.dataSelecionada));
  }

  mesAnterior() {
    this.dataSelecionada = addMonths(this.dataSelecionada, -1);
  }

  mesPosterior() {
    this.dataSelecionada = addMonths(this.dataSelecionada, 1);
  }

  getData(linha: number, coluna: number): Date {
    const mes = this.dataSelecionada.getMonth();
    const ano = this.dataSelecionada.getFullYear();
    return new Date(ano, mes, (linha * 7) + coluna - this.primeiroDiaMes + 1);
  }

  getEventos(linha: number, coluna: number) {
    return this.eventos.filter(e => isSameDay(e.data, this.getData(linha, coluna)));
  }

  eventoClick(evento:Evento) {
    this.eventoClicked.emit(evento);
  }

  dataClick(data: Date) {
    this.dataSelecionada = data;
    this.dataClicked.emit(data);
    console.log(data);
  }

}
