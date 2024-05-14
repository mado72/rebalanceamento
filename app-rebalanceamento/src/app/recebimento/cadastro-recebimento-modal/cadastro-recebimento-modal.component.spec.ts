import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroRecebimentoModalComponent } from './cadastro-recebimento-modal.component';

describe('CadastroRecebimentoModalComponent', () => {
  let component: CadastroRecebimentoModalComponent;
  let fixture: ComponentFixture<CadastroRecebimentoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CadastroRecebimentoModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroRecebimentoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
