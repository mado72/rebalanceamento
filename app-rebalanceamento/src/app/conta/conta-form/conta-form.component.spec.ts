import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContaFormComponent } from './conta-form.component';
import { TipoConta } from '../model/conta.model';
import { Moeda } from 'src/app/ativos/model/ativos.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('ContaFormComponent', () => {
  let component: ContaFormComponent;
  let fixture: ComponentFixture<ContaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContaFormComponent ],
      imports: [
        CommonModule,
        FormsModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContaFormComponent);
    component = fixture.componentInstance;
    component.conta = {
      id: 1,
      conta: 'teste',
      saldo: 100,
      tipo: TipoConta.CORRENTE,
      moeda: Moeda.REAL
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
