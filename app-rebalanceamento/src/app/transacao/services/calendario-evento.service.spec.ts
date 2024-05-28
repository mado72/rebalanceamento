import { TestBed } from '@angular/core/testing';

import { CalendarioEventoService } from './calendario-evento.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('CalendarioEventoService', () => {
  let service: CalendarioEventoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot({})
      ]
    });
    service = TestBed.inject(CalendarioEventoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
