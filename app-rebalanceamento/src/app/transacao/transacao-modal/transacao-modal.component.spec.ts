import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransacaoModalComponent } from './transacao-modal.component';
import { TransacaoFormComponent } from '../transacao-form/transacao-form.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('TransacaoModalComponent', () => {
  let component: TransacaoModalComponent;
  let fixture: ComponentFixture<TransacaoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
        TransacaoModalComponent,
        TransacaoFormComponent
      ],
      imports: [
        CommonModule,
        FormsModule,
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransacaoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
