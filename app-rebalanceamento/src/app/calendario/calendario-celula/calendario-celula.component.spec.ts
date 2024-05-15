import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioCelulaComponent } from './calendario-celula.component';

describe('CalendarioCelulaComponent', () => {
  let component: CalendarioCelulaComponent;
  let fixture: ComponentFixture<CalendarioCelulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendarioCelulaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarioCelulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
