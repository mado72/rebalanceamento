import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioMensalComponent } from './calendario-mensal.component';

describe('CalendarioMensalComponent', () => {
  let component: CalendarioMensalComponent;
  let fixture: ComponentFixture<CalendarioMensalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendarioMensalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarioMensalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
