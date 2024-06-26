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
  getDate,
  getMonth,
  isSameMonth,
  parse,
  setDate,
  startOfMonth
} from 'date-fns';
import { Subject } from 'rxjs';
import { CalendarColors, DataClicked, Evento } from 'src/app/calendario/calendario.model';
import { Mes, TransacaoImpl } from 'src/app/transacao/models/transacao.model';
import { PopupMenuComponent } from 'src/app/util/popup-menu/popup-menu.component';
import { CalendarioEventoService, MatrizEventos } from '../services/calendario-evento.service';
import { MatrizLinhaType, TransacaoMatrizService } from '../services/transacao-matriz.service';
import { TransacaoService } from '../services/transacao.service';
import { ContaService } from 'src/app/conta/services/conta.service';
import { Conta, TipoConta } from 'src/app/conta/model/conta.model';

interface Saldo {
  inicio: number;
  transacoes: number;
  fim: number;
}

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

  eventos: MatrizEventos = new Map<string, MatrizLinhaType<Evento>>();

  saldos: Saldo[] = [];

  eventosContexto: Evento[] = [];

  refresh = new Subject<void>();

  _viewDate: Date = new Date();

  private _saldoInicial = 0;

  constructor(
    private _contaService: ContaService,
    private _calendarioService: CalendarioEventoService,
    private _transacaoService: TransacaoService,
    private _matrizService: TransacaoMatrizService
  ) { }

  get saldoInicial() {
    return this._saldoInicial;
  }

  set saldoInicial(valor: number) {
    this._saldoInicial = valor;
    this.calcularSaldos();
  }

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
    this.atualizarSaldos();
  }

  obterEventos() {
    const inicio = startOfMonth(addMonths(this.viewDate, -1))
    const fim = endOfMonth(this.viewDate);

    this._calendarioService.obterEventos({ inicio, fim }).subscribe(matriz => {
      console.log({ inicio, fim })
      this.eventos = matriz;
      this.calcularSaldos();
    })
  }
  
  private atualizarSaldos() {
    Promise.resolve().then(() => {
      this._contaService.obterContas().subscribe(contas => {

        this.saldoInicial = contas
          .filter(conta=>[TipoConta.CORRENTE, TipoConta.POUPANCA].includes(conta.tipo))
          .reduce((acc, conta) => acc += conta.saldo, 0);

      });
    })
  }

  private calcularSaldos() {
    const fim = endOfMonth(this.viewDate);
    this.saldos = new Array(getDate(fim)).fill(undefined).map(_ => ({ inicio: 0, transacoes: 0, fim: 0 }) as Saldo);
    this.saldos[0].inicio = this.saldoInicial;

    this.saldos.forEach((saldo, index) => {
      const eventos = this._matrizService.extrairItensMatrizData({ matriz: this.eventos, data: setDate(this.viewDate, index + 1) });
      saldo.transacoes = eventos.map(evento => evento.meta as TransacaoImpl)
        .reduce((acc, transacao) => acc += transacao.valorTransacao, 0);

      if (index > 0) {
        saldo.inicio = this.saldos[index - 1].fim;
      }
      saldo.fim = saldo.inicio + saldo.transacoes;
    });
  }

  dataNoMesSelecionado(data: Date) {
    return isSameMonth(data, this._viewDate);
  }

  get meses() {
    return Object.values(Mes);
  }

  get mes() {
    return this.meses[getMonth(this.viewDate) - 1];
  }

  handleEvent(evento: Evento): void {
    this.modalData = { evento };
    this._transacaoService.editarTransacao(this.modalData.evento.meta, 'Editar transação').subscribe(() => {
      this.obterEventos();
    })
  }

  deleteEvent(eventToDelete: Evento) {
  }

  criarEvento() {
    const transacao = new TransacaoImpl({ dataInicial: this.viewDate });
    this._transacaoService.editarTransacao(transacao, 'Criar transação').subscribe((transacao) => {
      this.obterEventos();
    })
  }

  abrirPopup(e: DataClicked) {
    this.eventosContexto = this._matrizService.extrairItensMatrizData({ matriz: this.eventos, data: this.viewDate })

    this.menu.open(e.event);
    this.viewDate = e.data;
  }
}
