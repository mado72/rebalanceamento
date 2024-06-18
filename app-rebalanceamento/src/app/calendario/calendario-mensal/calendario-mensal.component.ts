import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { endOfMonth, getDay, isSameDay, isSameMonth, startOfMonth } from 'date-fns';
import { DataClicked, Evento } from '../calendario.model';
import { MatrizEventos } from 'src/app/transacao/services/calendario-evento.service';
import { TransacaoMatrizService } from 'src/app/transacao/services/transacao-matriz.service';

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

  @Output() dataSelecionadaChange = new EventEmitter<Date>();

  private _eventos!: MatrizEventos;

  private _celulas: CelConfig[][] = [];

  @Output() eventoClicked = new EventEmitter<Evento>();

  @Output() dataClicked = new EventEmitter<DataClicked>();

  @Input() eventoDetalheTemplate: TemplateRef<any> | undefined;

  @Input() templateListaEventos: TemplateRef<any> | undefined;

  @Input() templateDataConteudo: TemplateRef<any> | undefined;

  constructor(private matrizService: TransacaoMatrizService) { }

  get eventos() {
    return this._eventos;
  }

  @Input() set eventos(eventos: MatrizEventos) {
    this._eventos = eventos;
    const celulas = new Array(6);
    for (let iLinha = 0; iLinha < 6; iLinha++) {
      celulas[iLinha] = new Array(7);
      for (let iColuna = 0; iColuna < 7; iColuna++) {
        celulas[iLinha][iColuna] = this.obterCelConfig(iLinha, iColuna);
      }
    }
    this._celulas = celulas;
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

  get celulas() : CelConfig[][] {
    return this._celulas;
  }

  obterCelConfig(linha: number, coluna: number): CelConfig {
    const mes = this.dataSelecionada.getMonth();
    const ano = this.dataSelecionada.getFullYear();
    const dataCelula = new Date(ano, mes, (linha * 7) + coluna - this.primeiroDiaMes + 1);
    const dataNoMesCorrente = isSameMonth(this.dataSelecionada, dataCelula);

    return {
      mesCorrente: dataNoMesCorrente,
      fundo: dataNoMesCorrente ? 'white' : 'lightgray',
      eventos: this.matrizService.extrairItensMatrizData({matriz: this.eventos, data: dataCelula}),
      data: dataCelula
    }
  }

  eventoClick(evento:Evento) {
    this.eventoClicked.emit(evento);
  }

  dataClick(data: Date) {
    this.dataSelecionada = data;
    this.dataSelecionadaChange.emit(data);
  }
  
  menuContexto(data: Date, e: MouseEvent) {
    this.dataClicked.emit({data, event: e});
    e.preventDefault();
    e.stopPropagation();
  }

}
