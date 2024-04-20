import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagamentoProgramado } from '../models/despesa';
import { PagamentoMensalComponent } from './pagamento-mensal.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

describe('PagamentoMensalComponent', () => {
  let component: PagamentoMensalComponent;
  let fixture: ComponentFixture<PagamentoMensalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagamentoMensalComponent ],
      imports: [
        FormsModule,
        CommonModule,
        BrowserModule,
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagamentoMensalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve ordenar os pagamentos', ()=>{

    let pagamentosProgramados: PagamentoProgramado[] = Object.assign([
      {
        id: 1,
        valor: 1000,
        dataPagamento: new Date('2022-01-01'),
        despesa: {
          diaVencimento: 1,
        },
        pago: false
      },
      {
        id: 2,
        valor: 500,
        dataPagamento: new Date('2022-01-02'),
        despesa: {
          diaVencimento: 2,
        },
        pago: true
      },
      {
        id: 3,
        valor: 1500,
        dataPagamento: new Date('2022-01-03'),
        despesa: {
          diaVencimento: 3,
        },
        pago: false
      },
      {
        id: 4,
        valor: 750,
        dataPagamento: new Date('2022-01-04'),
        despesa: {
          diaVencimento: 4,
        },
        pago: true
      },
      {
        id: 5,
        valor: 2000,
        despesa: {
          diaVencimento: 5,
        },
        dataPagamento: new Date('2022-01-05'),
        pago: false
      }
    ]);
    let aux = pagamentosProgramados.map(item=>item.id);
    expect(aux).toEqual([1,2,3,4,5]);

    pagamentosProgramados = component.ordenarPagamentos(pagamentosProgramados) as PagamentoProgramado[];
    aux = pagamentosProgramados.map(item=>item.id);
    console.log(aux)
    expect(aux).toEqual([1,3,5,2,4]);
  })
});
