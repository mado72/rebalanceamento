import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransacaoModalComponent } from './transacao-modal.component';

describe('TransacaoModalComponent', () => {
  let component: TransacaoModalComponent;
  let fixture: ComponentFixture<TransacaoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransacaoModalComponent ]
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
