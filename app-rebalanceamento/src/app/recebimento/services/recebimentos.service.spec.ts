import { TestBed } from '@angular/core/testing';

import { RecebimentosService } from './recebimentos.service';

describe('RecebimentosService', () => {
  let service: RecebimentosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecebimentosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
