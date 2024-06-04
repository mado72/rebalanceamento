import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaldosComponent } from './saldos.component';
import { RouterTestingModule } from '@angular/router/testing';
import { carteiraProviders, patrimonioProviders, utilProviders } from 'src/app/test/test.module';
import { ContaListComponent } from '../conta-list/conta-list.component';
import { CapitalizePipe } from 'src/app/util/capitalize.pipe';
import { AbsolutePipe } from 'src/app/util/absolute.pipe';

describe('SaldosComponent', () => {
  let component: SaldosComponent;
  let fixture: ComponentFixture<SaldosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
        SaldosComponent,
        ContaListComponent,
        CapitalizePipe,
        AbsolutePipe
      ],
      imports: [
        RouterTestingModule
      ],
      providers: [
        ...carteiraProviders,
        ...patrimonioProviders,
        ...utilProviders
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaldosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
