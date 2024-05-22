import { TestBed } from '@angular/core/testing';

import { DespesasService } from './despesas.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('DespesasService', () => {
  let service: DespesasService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot({
          positionClass: 'toast-bottom-right'
        })
      ]
    });
    service = TestBed.inject(DespesasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
