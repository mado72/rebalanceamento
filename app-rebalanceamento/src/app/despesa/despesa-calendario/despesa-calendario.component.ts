import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  setMonth,
  addHours,
  getMonth,
  getYear,
} from 'date-fns';
import { Subject, map, mergeAll } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import { DespesaRecorrenteImpl, Mes } from '../models/despesa.model';
import { AlertService } from 'src/app/services/alert.service';
import { DespesasService } from '../services/despesas.service';
import { DateTime } from 'luxon';

type ColorType = 'red' | 'green' | 'blue' | 'yellow';

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
};


@Component({
  selector: 'app-despesa-calendario',
  templateUrl: './despesa-calendario.component.html',
  styleUrls: ['./despesa-calendario.component.scss']
})
export class DespesaCalendarioComponent implements OnInit {

  num: number = 1;

  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

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

  events: CalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      color: { ...colors['red'] },
      actions: this.actions,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
    {
      start: startOfDay(new Date()),
      title: 'An event with no end date',
      color: { ...colors['yellow'] },
      actions: this.actions,
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
      color: { ...colors['blue'] },
      allDay: true,
    },
    {
      start: addHours(startOfDay(new Date()), 2),
      end: addHours(new Date(), 2),
      title: 'A draggable and resizable event',
      color: { ...colors['yellow'] },
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
  ];

  activeDayIsOpen: boolean = true;

  constructor(
    private modal: NgbModal, 
    private alertService: AlertService,
    private despesaService: DespesasService,
  ) {}

  ngOnInit(): void {
    this.obterEventos();
  }
  
  obterEventos() {
    this.events = [];
    this.despesaService.obterDespesasParaAno(getYear(this.viewDate))
      .pipe(
        mergeAll(),
        map(despesa => this.converterParaEvento(despesa))
      )
      .subscribe({
        next: (evento) => {
          this.events.push(evento);
        },
        complete: () => this.dayClicked({date: new Date(), events: []})

      });
  }

  get meses() {
    return Object.values(Mes);
  }

  get mes() {
    return this.meses[DateTime.fromJSDate(this.viewDate).month-1];
  }

  converterParaEvento(despesa: DespesaRecorrenteImpl) : CalendarEvent {
    const color : ColorType = !! despesa.dataPagamento ? 'green' : !! despesa._id ? 'red' : 'yellow';
    return {
      start: despesa.dataPagamento || despesa.dataVencimento,
      title: despesa.descricao,
      color: colors[color],
      meta: despesa
    }
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
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
    this.modal.open(this.modalContent, { size: 'lg' });
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
    this.despesaService.abrirDespesaForm(this.modalData.event.meta, 'Editar despesa').subscribe(()=>{
      this.obterEventos();
    })
  }
}
