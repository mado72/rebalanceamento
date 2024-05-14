import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import {
  addDays,
  addHours,
  endOfDay,
  endOfMonth,
  format,
  getTime,
  isSameDay,
  isSameMonth,
  startOfDay,
  subDays
} from 'date-fns';
import { DateTime } from 'luxon';
import { Subject, map, mergeAll, tap } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { Mes, TipoTransacao, TransacaoImpl } from 'src/app/transacao/models/transacao.model';
import { TransacaoService } from '../services/transacao.service';

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

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  modalData!: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh = new Subject<void>();

  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = true;

  _viewDate: Date = new Date();

  constructor(
    private _modalService: NgbModal, 
    private _alertService: AlertService,
    private _transacaoService: TransacaoService,
  ) {}

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
    const ateData = endOfMonth(this.viewDate);
    this.events.splice(0);
    this._transacaoService.obterTransacoes()
      .pipe(
        mergeAll(),
        map(transacao=>!!transacao.dataLancamento ? [transacao] : transacao.programacaoTransacoes(ateData)),
        mergeAll(),
        tap(transacao=>{
          console.log(`transacao: ${transacao._id}, ${transacao.descricao}, ${format(transacao.dataInicial, 'yyyy-MM-dd')}, ${transacao.dataLancamento && format(transacao.dataLancamento, 'yyyy-MM-dd')}`);
        }),
        map(transacao => this.converterParaEvento(transacao))
      )
      .subscribe({
        next: (evento) => {
          this.events.push(evento);
        }
      });
  }

  get meses() {
    return Object.values(Mes);
  }

  get mes() {
    return this.meses[DateTime.fromJSDate(this.viewDate).month-1];
  }

  converterParaEvento(transacao: TransacaoImpl) : CalendarEvent {
    const color : ColorType = 
        transacao.tipoTransacao == TipoTransacao.DEBITO 
            ? !! transacao.dataLancamento ? 'green' : !! transacao._id ? 'red' : 'yellow'
            : !! transacao.dataLancamento ? 'blue' : !! transacao._id ? 'purple' : 'yellow' ;
    return {
      start: transacao.dataLancamento || transacao.dataInicial,
      title: transacao.descricao,
      color: colors[color],
      meta: transacao
    }
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    console.log('dayClicked');
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
      console.log(this.viewDate);
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this._modalService.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors['red'],
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  editar() {
    this._transacaoService.editarTransacao(this.modalData.event.meta, 'Editar despesa').subscribe(()=>{
      this.obterEventos();
    })
  }
}
