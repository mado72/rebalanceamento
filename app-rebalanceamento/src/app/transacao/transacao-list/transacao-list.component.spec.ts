import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { TipoTransacao, TransacaoImpl } from '../models/transacao.model';
import { MatrizTransacoes, TransacaoMatrizService } from '../services/transacao-matriz.service';
import { TransacaoService } from '../services/transacao.service';
import { TransacaoListComponent } from './transacao-list.component';
import { PopupMenuComponent } from 'src/app/util/popup-menu/popup-menu.component';


class MockedMatrizService {
 
  matriz: MatrizTransacoes = new Map([
    ["Transacao 1", 
      {
        0: [],
        1: [new TransacaoImpl({
          descricao: 'Transacao 1',
          valor: 100,
          tipoTransacao: TipoTransacao.DEBITO,
          dataInicial: new Date(2020, 1, 18)
        })],
        2: [],
        3: [new TransacaoImpl({
          descricao: 'Transacao 1',
          valor: 100,
          tipoTransacao: TipoTransacao.DEBITO,
          dataInicial: new Date(2020, 3, 11)
        })],
        4: [],
        5: [new TransacaoImpl({
          descricao: 'Transacao 1',
          valor: 100,
          tipoTransacao: TipoTransacao.DEBITO,
          dataInicial: new Date(2020, 5, 31)
        })]
      }
    ],
    ["Transacao 2", 
    {
        0: [],
        1: [new TransacaoImpl({
          descricao: 'Transacao 2',
          valor: 100,
          tipoTransacao: TipoTransacao.TRANSFERENCIA,
          dataInicial: new Date(2020, 1, 18)
        })],
        2: [],
        3: [],
        4: [],
        5: [
          new TransacaoImpl({
            descricao: 'Transacao 2',
            valor: 100,
            tipoTransacao: TipoTransacao.TRANSFERENCIA,
            dataInicial: new Date(2020, 5, 12)
          }),
          new TransacaoImpl({
            descricao: 'Transacao 2',
            valor: 200,
            tipoTransacao: TipoTransacao.TRANSFERENCIA,
            dataInicial: new Date(2020, 5, 13)
          })
        ]
      }
    ]
  ]);
    
  obterTransacoes(): Observable<MatrizTransacoes> {
    return of(this.matriz);
  }
  rotulos(matriz: MatrizTransacoes) {
    return new Array(...matriz.keys());
  }

  totalMes() {
    return 100;
  }
}

describe('TransacaoListComponent', () => {
  let component: TransacaoListComponent;
  let fixture: ComponentFixture<TransacaoListComponent>;
  let mockMatrizService: MockedMatrizService;
  let mockTransacaoService: TransacaoService;

  beforeEach(async () => {
    mockMatrizService = new MockedMatrizService();
    // mockTransacaoService = jasmine.createSpyObj(TransacaoService);

    await TestBed.configureTestingModule({
      declarations: [
        TransacaoListComponent
      ],
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot({
          positionClass: 'toast-bottom-right'
        }),
        FormsModule,
        CommonModule,
        PopupMenuComponent
      ],
      providers: [
        { provide: TransacaoMatrizService, useValue: mockMatrizService },
        { provide: TransacaoService, useValue: mockTransacaoService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransacaoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('as transações devem ser representadas por linhas e células', () => {
    component.obterTransacoes();
    expect(component.linhas.length).toBe(2);
    
    const linha1 = component.linhas[0];
    expect(linha1.celulas.length).toBe(6);
    
    expect(linha1.celulas[1].transacoes.length).toBe(1);
    expect(linha1.celulas[3].transacoes.length).toBe(1);
    expect(component.linhas[1].celulas[5].transacoes.length).toBe(2);

  })
});
