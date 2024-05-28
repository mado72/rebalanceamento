import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarteiraAtivoFormComponent } from './carteira-ativo-form.component';

describe('CarteiraAtivoFormComponent', () => {
  let component: CarteiraAtivoFormComponent;
  let fixture: ComponentFixture<CarteiraAtivoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarteiraAtivoFormComponent ],
      imports: [ 
        CommonModule,
        FormsModule
      ]
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
