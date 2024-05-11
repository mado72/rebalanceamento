import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DespesaCalendarioComponent } from './despesa-calendario.component';

describe('DespesaCalendarioComponent', () => {
  let component: DespesaCalendarioComponent;
  let fixture: ComponentFixture<DespesaCalendarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DespesaCalendarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DespesaCalendarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
