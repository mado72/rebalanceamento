import { TestBed } from '@angular/core/testing';

import { CarteiraService } from './carteira.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CarteiraService', () => {
  let service: CarteiraService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(CarteiraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
