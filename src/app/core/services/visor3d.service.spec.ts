import { TestBed } from '@angular/core/testing';

import { Visor3dService } from './visor3d.service';

describe('Visor3dService', () => {
  let service: Visor3dService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Visor3dService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
