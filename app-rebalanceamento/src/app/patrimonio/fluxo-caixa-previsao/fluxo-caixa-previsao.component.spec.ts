import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FluxoCaixaPrevisaoComponent } from './fluxo-caixa-previsao.component';
import { carteiraProviders, patrimonioProviders, transacaoProviders } from 'src/app/test/test.module';

describe('FluxoCaixaPrevisaoComponent', () => {
  let component: FluxoCaixaPrevisaoComponent;
  let fixture: ComponentFixture<FluxoCaixaPrevisaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FluxoCaixaPrevisaoComponent ],
      providers: [
        ...carteiraProviders,
        ...transacaoProviders,
        ...patrimonioProviders]
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
