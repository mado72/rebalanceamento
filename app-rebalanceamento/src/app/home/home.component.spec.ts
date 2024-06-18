import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { CarteiraAtivoComponent } from '../ativos/carteira-ativo/carteira-ativo.component';
import { CarteiraListaAtivosComponent } from '../ativos/carteira-lista-ativos/carteira-lista-ativos.component';
import { CarteiraPortifolioComponent } from '../ativos/carteira-portifolio/carteira-portifolio.component';
import { SaldosComponent } from '../conta/saldos/saldos.component';
import { PainelComponent } from '../painel/painel.component';
import { FluxoCaixaPrevisaoComponent } from '../patrimonio/fluxo-caixa-previsao/fluxo-caixa-previsao.component';
import { allProviders } from '../test/test.module';
import { HomeComponent } from './home.component';
import { ContaListComponent } from '../conta/conta-list/conta-list.component';
import { CapitalizePipe } from '../util/capitalize.pipe';
import { AbsolutePipe } from '../util/absolute.pipe';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
        HomeComponent,
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
        RouterTestingModule,
      ],
      providers: [
        ...allProviders
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
