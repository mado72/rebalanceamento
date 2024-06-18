import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransacaoFormComponent } from './transacao-form.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContaService } from 'src/app/conta/services/conta.service';
import { Observable, of } from 'rxjs';
import { Conta } from 'src/app/conta/model/conta.model';

class ContaServiceMock {
  obterContas(_params: any): Observable<Conta[]> {
    return of([])
  }
}

describe('TransacaoFormComponent', () => {
  let component: TransacaoFormComponent;
  let fixture: ComponentFixture<TransacaoFormComponent>;
  let contaServiceMock = new ContaServiceMock();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransacaoFormComponent ],
      imports: [
        CommonModule,
        FormsModule
      ],
      providers: [
        { provide: ContaService, useValue: contaServiceMock }
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
