import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FluxoCaixaPrevisaoComponent } from './fluxo-caixa-previsao.component';

describe('FluxoCaixaPrevisaoComponent', () => {
  let component: FluxoCaixaPrevisaoComponent;
  let fixture: ComponentFixture<FluxoCaixaPrevisaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FluxoCaixaPrevisaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FluxoCaixaPrevisaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
