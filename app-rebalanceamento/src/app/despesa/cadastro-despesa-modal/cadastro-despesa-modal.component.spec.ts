import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroDespesaModalComponent } from './cadastro-despesa-modal.component';

describe('CadastroDespesaModalComponent', () => {
  let component: CadastroDespesaModalComponent;
  let fixture: ComponentFixture<CadastroDespesaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CadastroDespesaModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroDespesaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
