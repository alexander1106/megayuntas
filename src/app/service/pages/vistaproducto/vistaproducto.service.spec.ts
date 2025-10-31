import { TestBed } from '@angular/core/testing';

import { VistaproductoService } from './vistaproducto.service';

describe('VistaproductoService', () => {
  let service: VistaproductoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VistaproductoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
