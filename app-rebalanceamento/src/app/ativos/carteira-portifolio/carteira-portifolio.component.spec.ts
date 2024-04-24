import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteiraPortifolioComponent } from './carteira-portifolio.component';

describe('CarteiraListComponent', () => {
  let component: CarteiraPortifolioComponent;
  let fixture: ComponentFixture<CarteiraPortifolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarteiraPortifolioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarteiraPortifolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
