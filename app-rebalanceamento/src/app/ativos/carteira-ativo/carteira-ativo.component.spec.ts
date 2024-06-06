import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteiraAtivoComponent } from './carteira-ativo.component';
import { carteiraProviders, utilProviders } from 'src/app/test/test.module';

describe('CarteiraAtivoComponent', () => {
  let component: CarteiraAtivoComponent;
  let fixture: ComponentFixture<CarteiraAtivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarteiraAtivoComponent ],
      providers: [
        ...carteiraProviders,
        ...utilProviders
      ]
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
