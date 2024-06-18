import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatrimonioProjecaoComponent } from './patrimonio-projecao.component';
import { carteiraProviders, transacaoProviders } from 'src/app/test/test.module';
import { CapitalizePipe } from 'src/app/util/capitalize.pipe';
import { AbsolutePipe } from 'src/app/util/absolute.pipe';

describe('PatrimonioProjecaoComponent', () => {
  let component: PatrimonioProjecaoComponent;
  let fixture: ComponentFixture<PatrimonioProjecaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
        PatrimonioProjecaoComponent,
        CapitalizePipe,
        AbsolutePipe
      ],
      providers: [
        ...carteiraProviders,
        ...transacaoProviders
      ]
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
