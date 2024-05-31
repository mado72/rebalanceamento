import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatrimonioProjecaoComponent } from './patrimonio-projecao.component';

describe('PatrimonioProjecaoComponent', () => {
  let component: PatrimonioProjecaoComponent;
  let fixture: ComponentFixture<PatrimonioProjecaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatrimonioProjecaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatrimonioProjecaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
