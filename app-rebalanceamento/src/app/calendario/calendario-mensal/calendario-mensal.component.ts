import { Component, EventEmitter, Input, Output } from '@angular/core';
import { addDays, addMonths, endOfMonth, getDate, getDay, isSameDay, isSameMonth, isWithinInterval, startOfMonth } from 'date-fns';
import { Evento } from '../calendario.model';

interface CelConfig {
  mesCorrente: boolean;
  fundo: string;
  eventos: Evento[];
  data: Date;
}

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

  constructor() { }

  get primeiroDiaMes() {
    return getDay(this.primeiraDataMes);
  }

  get primeiraDataMes() {
    return startOfMonth(this.dataSelecionada);
  }
  
  get ultimaDataMes() {
    return endOfMonth(this.dataSelecionada);
  }

  mesAnterior() {
    this.dataSelecionada = addMonths(this.dataSelecionada, -1);
  }

  mesPosterior() {
    this.dataSelecionada = addMonths(this.dataSelecionada, 1);
  }

  get celulas() : CelConfig[][] {
    console.log(`CelConfig`);
    const celulas = new Array(6);
    for (let iLinha = 0; iLinha < 6; iLinha++) {
      celulas[iLinha] = new Array(7);
      for (let iColuna = 0; iColuna < 7; iColuna++) {
        celulas[iLinha][iColuna] = this.obterCelConfig(iLinha, iColuna);
      }
    }
    return celulas;
  }

  obterCelConfig(linha: number, coluna: number): CelConfig {
    const mes = this.dataSelecionada.getMonth();
    const ano = this.dataSelecionada.getFullYear();
    const dataCelula = new Date(ano, mes, (linha * 7) + coluna - this.primeiroDiaMes + 1);
    const dataNoMesCorrente = isSameMonth(this.dataSelecionada, dataCelula);

    return {
      mesCorrente: dataNoMesCorrente,
      fundo: dataNoMesCorrente ? 'white' : 'lightgray',
      eventos: this.eventos.filter(e => isSameDay(e.data, dataCelula)),
      data: dataCelula
    }
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
