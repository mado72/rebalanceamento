import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { carteiraProviders } from 'src/app/test/test.module';
import { TransacaoFormComponent } from '../transacao-form/transacao-form.component';
import { TransacaoModalComponent } from './transacao-modal.component';

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
      ],
      providers: [
        ...carteiraProviders
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
