import { TestBed } from '@angular/core/testing';

import { VistaconsultaService } from './vistaconsulta.service';

describe('VistaconsultaService', () => {
  let service: VistaconsultaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VistaconsultaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
