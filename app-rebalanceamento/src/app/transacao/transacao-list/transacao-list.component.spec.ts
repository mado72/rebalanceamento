import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { transacaoProviders } from 'src/app/test/test.module';
import { PopupMenuComponent } from 'src/app/util/popup-menu/popup-menu.component';
import { TransacaoListComponent } from './transacao-list.component';
import { TipoAtivo } from 'src/app/ativos/model/ativos.model';
import { MatrizType } from '../services/transacao-matriz.service';
import { TransacaoImpl } from '../models/transacao.model';

class LinhaMock {

  matriz = {} as MatrizType<TransacaoImpl>;

  celulas = new Array(12);

  diaInicial?: number;

  constructor() {
  }

  get total() {
    return 0;
  }

  get nomeTransacao() {
    return 'Nome Transacao'
  }
}

describe('TransacaoListComponent', () => {
  let component: TransacaoListComponent;
  let fixture: ComponentFixture<TransacaoListComponent>;
  let linha = new LinhaMock()

  beforeEach(async () => {
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
        ...transacaoProviders
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransacaoListComponent);

    component = fixture.componentInstance;
    spyOn(component, 'obterCelula').and.returnValue({
      classe: {
        credito: false,
        debito: false,
        liquidado: false,
        projecao: false,
        transferencia: false
      },
      transacoes: [],
      linha: linha ,
      mes:1,
      nomeTransacao: 'Nome',
      total: 0,
      ehUnico: false
    });

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
