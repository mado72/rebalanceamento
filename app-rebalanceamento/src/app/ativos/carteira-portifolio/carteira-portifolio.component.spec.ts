import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteiraPortifolioComponent } from './carteira-portifolio.component';
import { CarteiraAtivoComponent } from '../carteira-ativo/carteira-ativo.component';
import { CarteiraListaAtivosComponent } from '../carteira-lista-ativos/carteira-lista-ativos.component';
import { carteiraProviders, utilProviders } from 'src/app/test/test.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('CarteiraPortifolioComponent', () => {
  let component: CarteiraPortifolioComponent;
  let fixture: ComponentFixture<CarteiraPortifolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
        CarteiraPortifolioComponent,
        CarteiraAtivoComponent,
        CarteiraListaAtivosComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'carteira', component: CarteiraPortifolioComponent },
          { path: 'carteira/ativo', component: CarteiraAtivoComponent },
          { path: 'carteira/lista-ativos', component: CarteiraListaAtivosComponent }
        ])
      ],
      providers: [
        ...carteiraProviders,
        ...utilProviders,
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarteiraPortifolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
