import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {
  addMonths,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  parse,
  startOfMonth
} from 'date-fns';
import { DateTime } from 'luxon';
import { Subject } from 'rxjs';
import { CalendarColors, DataClicked, Evento } from 'src/app/calendario/calendario.model';
import { Mes, TransacaoImpl } from 'src/app/transacao/models/transacao.model';
import { PopupMenuComponent } from 'src/app/util/popup-menu/popup-menu.component';
import { CalendarioEventoService } from '../services/calendario-evento.service';
import { TransacaoService } from '../services/transacao.service';

@Component({
  selector: 'app-transacao-calendar',
  templateUrl: './transacao-calendar.component.html',
  styleUrls: ['./transacao-calendar.component.scss'],
})
export class TransacaoCalendarComponent implements OnInit {

  num: number = 1;

  readonly novaTransacaoLed = CalendarColors.green;

  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;
  @ViewChild(PopupMenuComponent) menu!: PopupMenuComponent;

  modalData!: {
    evento: Evento;
  };

  eventos: Evento[] = [];

  eventosContexto: Evento[] = [];

  refresh = new Subject<void>();

  _viewDate: Date = new Date();

  constructor(
    private _calendarioService: CalendarioEventoService,
    private _transacaoService: TransacaoService
  ) {}

  mesAnterior() {
    this.viewDate = addMonths(this.viewDate, -1);
  }

  mesPosterior() {
    this.viewDate = addMonths(this.viewDate, 1);
  }

  hoje() {
    this.viewDate = new Date();
  }

  get viewDate() {
    return this._viewDate;
  }

  set viewDate(value: Date) {
    const changed = !isSameMonth(this._viewDate, value);
    this._viewDate = value;
    if (changed) {
      this.obterEventos();
    }
  }

  get viewDateStr() {
    return format(this.viewDate, 'yyyy-MM');
  }

  set viewDateStr(s: string) {
    this.viewDate = parse(s, 'yyyy-MM', this.viewDate);
  }

  ngOnInit() {
    this.obterEventos();
  }

  obterEventos() {
    const inicio = startOfMonth(this.viewDate)
    const fim = endOfMonth(this.viewDate);
    this._calendarioService.obterEventos({inicio, fim}).subscribe(eventos=>this.eventos=eventos);
  }

  get meses() {
    return Object.values(Mes);
  }

  get mes() {
    return this.meses[DateTime.fromJSDate(this.viewDate).month-1];
  }

  handleEvent(evento: Evento): void {
    this.modalData = { evento };
    this._transacaoService.editarTransacao(this.modalData.evento.meta, 'Editar transação').subscribe(()=>{
      this.obterEventos();
    })
  }

  deleteEvent(eventToDelete: Evento) {
  }

  criarEvento() {
    const transacao = new TransacaoImpl({dataInicial: this.viewDate});
    this._transacaoService.editarTransacao(transacao, 'Criar transação').subscribe((transacao)=>{
      this.obterEventos();
    })
  }

  abrirPopup(e: DataClicked) {
    this.eventosContexto = this.eventos.filter(evento=>isSameDay(e.data, evento.data))
    this.menu.open(e.event);
    this.viewDate = e.data;
  }
}
