import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteiraAtivoFormComponent } from './carteira-ativo-form.component';

describe('CarteiraItemFormComponent', () => {
  let component: CarteiraAtivoFormComponent;
  let fixture: ComponentFixture<CarteiraAtivoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarteiraAtivoFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarteiraAtivoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
