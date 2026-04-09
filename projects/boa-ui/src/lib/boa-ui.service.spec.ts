import { TestBed } from '@angular/core/testing';

import { BoaUiService } from './boa-ui.service';

describe('BoaUiService', () => {
  let service: BoaUiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoaUiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
