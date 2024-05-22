import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransacaoFormComponent } from './transacao-form.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('TransacaoFormComponent', () => {
  let component: TransacaoFormComponent;
  let fixture: ComponentFixture<TransacaoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransacaoFormComponent ],
      imports: [
        CommonModule,
        FormsModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransacaoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
