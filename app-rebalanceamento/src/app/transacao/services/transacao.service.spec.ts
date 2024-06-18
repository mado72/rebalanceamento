import { TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TransacaoFormComponent } from '../transacao-form/transacao-form.component';
import { TransacaoService } from './transacao.service';
import { ToastrModule } from 'ngx-toastr';

describe('TransacaoService', () => {
  let service: TransacaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          {
            path: 'transacao',
            component: TransacaoFormComponent
          }
        ]),
        ToastrModule.forRoot()
      ]
    });
    service = TestBed.inject(TransacaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
