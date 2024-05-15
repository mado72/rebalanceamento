import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DespesaProgramadaComponent } from './despesa-programada.component';

describe('DespesaProgramadaComponent', () => {
  let component: DespesaProgramadaComponent;
  let fixture: ComponentFixture<DespesaProgramadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DespesaProgramadaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DespesaProgramadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
