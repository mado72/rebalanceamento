import { TestBed } from '@angular/core/testing';

import { AlertService } from './alert.service';
import { ToastrModule } from 'ngx-toastr';

describe('AlertService', () => {
  let service: AlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ToastrModule.forRoot({
          positionClass :'toast-bottom-right'
        })
      ]
    });
    service = TestBed.inject(AlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
