import { Component, Input } from '@angular/core';
import { addDays, addMonths, endOfMonth, getDate, getDay, isSameDay, startOfMonth } from 'date-fns';
import { Evento } from '../calendario.model';

@Component({
  selector: 'app-calendario-mensal',
  templateUrl: './calendario-mensal.component.html',
  styleUrls: ['./calendario-mensal.component.scss']
})
export class CalendarioMensalComponent {

  @Input() dataSelecionada = new Date();

  eventos: Evento[] = [{
    data: addDays(new Date(), -20),
    titulo: 'Evento 1',
    cor: 'blue'
  },{
    data: addDays(new Date(), -10),
    titulo: 'Evento 2',
    cor:'red'
  },{
    data: addDays(new Date(), -5),
    titulo: 'Evento 3',
    cor: 'green'
  },{
    data: new Date(),
    titulo: 'Evento 4',
    cor: 'yellow'
  },{
    data: addDays(new Date(), 10),
    titulo: 'Evento 5',
    cor: 'orange'
  },{
    data: addDays(new Date(), 10),
    titulo: 'Evento 6',
    cor: 'purple'
  },{
    data: addDays(new Date(), 10),
    titulo: 'Evento 7',
    cor: 'cyan'
  }]

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

}
