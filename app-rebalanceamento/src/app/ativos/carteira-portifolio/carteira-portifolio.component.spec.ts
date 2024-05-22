import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteiraPortifolioComponent } from './carteira-portifolio.component';
import { CarteiraAtivoComponent } from '../carteira-ativo/carteira-ativo.component';
import { CarteiraListaAtivosComponent } from '../carteira-lista-ativos/carteira-lista-ativos.component';

describe('CarteiraPortifolioComponent', () => {
  let component: CarteiraPortifolioComponent;
  let fixture: ComponentFixture<CarteiraPortifolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
        CarteiraPortifolioComponent,
        CarteiraAtivoComponent,
        CarteiraListaAtivosComponent
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
