import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PainelComponent } from './painel.component';
import { SaldosComponent } from '../conta/saldos/saldos.component';
import { CarteiraPortifolioComponent } from '../ativos/carteira-portifolio/carteira-portifolio.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CarteiraAtivoComponent } from '../ativos/carteira-ativo/carteira-ativo.component';
import { CarteiraListaAtivosComponent } from '../ativos/carteira-lista-ativos/carteira-lista-ativos.component';

describe('PainelComponent', () => {
  let component: PainelComponent;
  let fixture: ComponentFixture<PainelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
        PainelComponent, 
        SaldosComponent, 
        CarteiraPortifolioComponent,
        CarteiraAtivoComponent,
        CarteiraListaAtivosComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'painel', component: PainelComponent },
          { path: 'conta', component: SaldosComponent },
          { path: 'ativos', component: CarteiraPortifolioComponent }
        ])
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
