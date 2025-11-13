import { TestBed } from '@angular/core/testing';

import { Lace } from './lace';

describe('Lace', () => {
  let service: Lace;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Lace);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
