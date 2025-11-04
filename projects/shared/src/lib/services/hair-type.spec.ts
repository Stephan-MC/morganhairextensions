import { TestBed } from '@angular/core/testing';

import { HairType } from './hair-type';

describe('HairType', () => {
  let service: HairType;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HairType);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
