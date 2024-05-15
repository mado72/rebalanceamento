import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Mes } from '../models/despesa.model';
import { DespesasListComponent } from './despesas-list.component';
import { DespesasService } from '../services/despesas.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule, provideRouter, withDebugTracing, withRouterConfig } from '@angular/router';

@Component({
  template: ''
})
class DummyComponent {
}

describe('DespesasListComponent', () => {
  let component: DespesasListComponent;
  let fixture: ComponentFixture<DespesasListComponent>;
  let despesasService: DespesasService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DespesasListComponent],
      imports: [
        FormsModule, 
        CommonModule, 
        BrowserModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        {
          provide: 'ActivatedRoute',
          useValue: {
            snapshot: {
              queryParams: {
                mes: Mes.JANEIRO
              }
            }
          }
        }
      ],
    })
      .compileComponents();

    despesasService = TestBed.inject(DespesasService);
    TestBed.inject(ActivatedRoute);

    fixture = TestBed.createComponent(DespesasListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve conter 12 listas de pagamentos', () => {

    const entries = Object.values(component.pagamentos);
    expect(entries.length).toBe(12);

    entries.forEach(entry => {
      expect(Object.keys(entry).length).toBeGreaterThan(0);
      const pagamentos = entry["1"];
      expect(pagamentos).toBeTruthy();
    });
  });

  it('deve obter o pagamento para um mes aleatório', () => {
    component.ngOnInit();
    Object.values(Mes).forEach(mes => {
      let pagamentos = component.pagamentos[mes];
      debugger;
      expect(pagamentos).toBeTruthy();
      expect(pagamentos[1]).toBeTruthy();
    });
  });
});
