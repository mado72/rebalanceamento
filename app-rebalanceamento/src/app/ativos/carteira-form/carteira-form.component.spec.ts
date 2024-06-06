import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteiraFormComponent } from './carteira-form.component';
import { CarteiraImpl, Moeda, TipoAtivo } from '../model/ativos.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('CarteiraFormComponent', () => {
  let component: CarteiraFormComponent;
  let fixture: ComponentFixture<CarteiraFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
        CarteiraFormComponent,
      ],
      imports: [
        CommonModule,
        FormsModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarteiraFormComponent);
    component = fixture.componentInstance;
    component.carteira = new CarteiraImpl({
      nome: 'Carteira',
      objetivo: 0.10,
      classe: TipoAtivo.ACAO,
      moeda: Moeda.REAL,
      items: []
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
