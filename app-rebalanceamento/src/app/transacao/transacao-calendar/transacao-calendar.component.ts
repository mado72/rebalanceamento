import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventColor } from 'calendar-utils';
import {
  addMonths,
  endOfMonth,
  format,
  getTime,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth
} from 'date-fns';
import { DateTime } from 'luxon';
import { Subject, from, map, mergeAll, of, reduce, toArray } from 'rxjs';
import { Evento } from 'src/app/calendario/calendario.model';
import { AlertService } from 'src/app/services/alert.service';
import { Mes, TipoTransacao, TransacaoImpl } from 'src/app/transacao/models/transacao.model';
import { TransacaoService } from '../services/transacao.service';
import { CalendarioEventoService } from '../services/calendario-evento.service';

type ColorType = 'red' | 'green' | 'blue' | 'yellow' | 'purple';

const colors: Record<ColorType, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
  green: {
    primary: '#0fe308',
    secondary: '#bcfdba',
  },
  purple: {
    primary: '#663399',
    secondary: '#D8BFD8',
  }
};

@Component({
  selector: 'app-transacao-calendar',
  templateUrl: './transacao-calendar.component.html',
  styleUrls: ['./transacao-calendar.component.scss']
})
export class TransacaoCalendarComponent implements OnInit {

  num: number = 1;

  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;

  modalData!: {
    evento: Evento;
  };

  eventos: Evento[] = [];

  refresh = new Subject<void>();

  _viewDate: Date = new Date();

  constructor(
    private _modalService: NgbModal, 
    private _alertService: AlertService,
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
    const changed = getTime(startOfDay(this._viewDate)) != getTime(startOfDay(value));
    this._viewDate = value;
    if (changed) {
      this.obterEventos();
    }
  }

  ngOnInit() {
    this.obterEventos();
  }

  obterEventos() {
    console.log(`Obter eventos...`);
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

  converterParaEvento(transacao: TransacaoImpl) : Evento {
    const color : ColorType = 
        transacao.tipoTransacao == TipoTransacao.DEBITO 
            ? !! transacao.dataLiquidacao ? 'green' : !! transacao._id ? 'red' : 'yellow'
            : !! transacao.dataLiquidacao ? 'blue' : !! transacao._id ? 'purple' : 'yellow' ;
    return {
      data: transacao.dataLiquidacao || transacao.dataInicial,
      titulo: transacao.descricao,
      descricao: transacao.descricao,
      cor: colors[color].primary,
      meta: transacao
    }
  }

  handleEvent(evento: Evento): void {
    this.modalData = { evento };
    this._modalService.open(this.modalContent, { size: 'lg' });
  }

  deleteEvent(eventToDelete: Evento) {
  }

  editar() {
    this._transacaoService.editarTransacao(this.modalData.evento.meta, 'Editar despesa').subscribe(()=>{
      this.obterEventos();
    })
  }
}
