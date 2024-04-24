import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteiraAtivoComponent } from './carteira-ativo.component';

describe('CarteiraComponent', () => {
  let component: CarteiraAtivoComponent;
  let fixture: ComponentFixture<CarteiraAtivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarteiraAtivoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarteiraAtivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
