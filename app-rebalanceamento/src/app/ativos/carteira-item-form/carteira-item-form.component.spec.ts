import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteiraItemFormComponent } from './carteira-item-form.component';

describe('CarteiraItemFormComponent', () => {
  let component: CarteiraItemFormComponent;
  let fixture: ComponentFixture<CarteiraItemFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarteiraItemFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarteiraItemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
