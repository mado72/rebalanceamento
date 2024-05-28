import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecebimentoListComponent } from './recebimento-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('RecebimentoListComponent', () => {
  let component: RecebimentoListComponent;
  let fixture: ComponentFixture<RecebimentoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecebimentoListComponent ],
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot({
          positionClass :'toast-bottom-right'
        })
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecebimentoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
