import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagamentoMensalComponent } from './pagamento-mensal.component';

describe('PagamentoMensalComponent', () => {
  let component: PagamentoMensalComponent;
  let fixture: ComponentFixture<PagamentoMensalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagamentoMensalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagamentoMensalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
