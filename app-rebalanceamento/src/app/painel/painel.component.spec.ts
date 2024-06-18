import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PainelComponent } from './painel.component';
import { SaldosComponent } from '../conta/saldos/saldos.component';
import { CarteiraPortifolioComponent } from '../ativos/carteira-portifolio/carteira-portifolio.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CarteiraAtivoComponent } from '../ativos/carteira-ativo/carteira-ativo.component';
import { CarteiraListaAtivosComponent } from '../ativos/carteira-lista-ativos/carteira-lista-ativos.component';
import { ContaService } from '../conta/services/conta.service';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../services/alert.service';
import { CarteiraService } from '../ativos/services/carteira.service';
import { ConsolidadoService } from '../patrimonio/services/consolidado.service';
import { FluxoCaixaPrevisaoComponent } from '../patrimonio/fluxo-caixa-previsao/fluxo-caixa-previsao.component';
import { TransacaoService } from '../transacao/services/transacao.service';
import { ContaListComponent } from '../conta/conta-list/conta-list.component';
import { Observable, of } from 'rxjs';
import { Conta, IConta } from '../conta/model/conta.model';
import { TransacaoImpl } from '../transacao/models/transacao.model';
import { CarteiraImpl } from '../ativos/model/ativos.model';
import { CapitalizePipe } from '../util/capitalize.pipe';
import { AbsolutePipe } from '../util/absolute.pipe';

class ContaServiceMock {

  obterContas(_params: any) : Observable<Conta[]> {
    return of([]);
  }
}

class CarteiraServiceMock {
  obterCarteiras(_params: any) : Observable<CarteiraImpl[]> {
    return of([]);
  }
}

class ConsolidadoServiceMock {

}
class AlertServiceMock {

}
class NgbModalMock {

}
class ActivatedRouteMock {
  snapshot = {
    params : {

    },
    data : {

    }
  }
}
class TransacaoServiceMock {
  obterTransacoesIntervalo(params: any): Observable<TransacaoImpl[]> {
    return of([]);
  }
}


describe('PainelComponent', () => {
  let component: PainelComponent;
  let fixture: ComponentFixture<PainelComponent>;
  let contaServiceMock = new ContaServiceMock();
  let consolidadoServiceMock = new ConsolidadoServiceMock();
  let alertServiceMock = new AlertServiceMock();
  let ngbModalMock = new NgbModalMock();
  let activatedRouteMock = new ActivatedRouteMock();
  let carteiraServiceMock = new CarteiraServiceMock();
  let transacaoServiceMock = new TransacaoServiceMock();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
        PainelComponent, 
        SaldosComponent, 
        CarteiraPortifolioComponent,
        CarteiraAtivoComponent,
        CarteiraListaAtivosComponent,
        FluxoCaixaPrevisaoComponent,
        ContaListComponent,
        CapitalizePipe,
        AbsolutePipe
      ],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'painel', component: PainelComponent },
          { path: 'conta', component: SaldosComponent },
          { path: 'ativos', component: CarteiraPortifolioComponent }
        ])
      ],
      providers: [
        { provide: ContaService, useValue: contaServiceMock},
        { provide: ConsolidadoService, useValue: consolidadoServiceMock},
        { provide: AlertService, useValue: alertServiceMock},
        { provide: NgbModal, useValue: ngbModalMock},
        { provide: ActivatedRoute, useValue: activatedRouteMock},
        { provide: CarteiraService, useValue: carteiraServiceMock},
        { provide: TransacaoService, useValue: transacaoServiceMock}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PainelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
