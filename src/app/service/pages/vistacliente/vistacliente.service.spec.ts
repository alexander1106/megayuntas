import { TestBed } from '@angular/core/testing';

import { VistaclienteService } from './vistacliente.service';

describe('VistaclienteService', () => {
  let service: VistaclienteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VistaclienteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
