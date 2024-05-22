import { TestBed } from '@angular/core/testing';

import { RecebimentosService } from './recebimentos.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('RecebimentosService', () => {
  let service: RecebimentosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot({
          positionClass :'toast-bottom-right'
        })
      ]
    });
    service = TestBed.inject(RecebimentosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
