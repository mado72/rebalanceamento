import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioMensalCelulaComponent } from './calendario-mensal-celula.component';

describe('CalendarioCelulaComponent', () => {
  let component: CalendarioMensalCelulaComponent;
  let fixture: ComponentFixture<CalendarioMensalCelulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendarioMensalCelulaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarioMensalCelulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
