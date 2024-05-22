import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { PainelComponent } from '../painel/painel.component';
import { SaldosComponent } from '../conta/saldos/saldos.component';
import { CarteiraPortifolioComponent } from '../ativos/carteira-portifolio/carteira-portifolio.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CarteiraAtivoComponent } from '../ativos/carteira-ativo/carteira-ativo.component';
import { CarteiraListaAtivosComponent } from '../ativos/carteira-lista-ativos/carteira-lista-ativos.component';

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
        CarteiraListaAtivosComponent
      ],
      imports: [
        RouterTestingModule,
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
