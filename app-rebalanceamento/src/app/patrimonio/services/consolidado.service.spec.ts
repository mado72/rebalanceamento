import { TestBed } from '@angular/core/testing';

import { ConsolidadoService } from './consolidado.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ConsolidadoService', () => {
  let service: ConsolidadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(ConsolidadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
