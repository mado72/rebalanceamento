import { TestBed } from '@angular/core/testing';

import { TransacaoMatrizService } from './transacao-matriz.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('TransacaoMatrizService', () => {
  let service: TransacaoMatrizService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot()
      ]
    });
    service = TestBed.inject(TransacaoMatrizService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
