import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteiraListaAtivosComponent } from './carteira-lista-ativos.component';
import { CarteiraAtivoComponent } from '../carteira-ativo/carteira-ativo.component';
import { CarteiraPortifolioComponent } from '../carteira-portifolio/carteira-portifolio.component';

describe('CarteiraListaAtivosComponent', () => {
  let component: CarteiraListaAtivosComponent;
  let fixture: ComponentFixture<CarteiraListaAtivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
        CarteiraListaAtivosComponent, 
        CarteiraAtivoComponent ,
        CarteiraPortifolioComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarteiraListaAtivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
