import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroDespesaModalComponent } from './cadastro-despesa-modal.component';
import { DespesaFormComponent } from '../despesa-form/despesa-form.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('CadastroDespesaModalComponent', () => {
  let component: CadastroDespesaModalComponent;
  let fixture: ComponentFixture<CadastroDespesaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
        CadastroDespesaModalComponent,
        DespesaFormComponent
      ],
      imports: [
        CommonModule,
        FormsModule
      ]
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
