import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransacaoCalendarComponent } from './transacao-calendar.component';

describe('TransacaoCalendarComponent', () => {
  let component: TransacaoCalendarComponent;
  let fixture: ComponentFixture<TransacaoCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransacaoCalendarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransacaoCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
