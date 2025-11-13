import { TestBed } from '@angular/core/testing';

import { Length } from './length';

describe('Length', () => {
  let service: Length;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Length);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
