import { TestBed } from '@angular/core/testing';

import { CalendarioEventoService } from './calendario-evento.service';

describe('CalendarioEventoService', () => {
  let service: CalendarioEventoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalendarioEventoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
