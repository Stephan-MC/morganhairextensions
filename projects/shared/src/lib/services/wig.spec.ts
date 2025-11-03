import { TestBed } from '@angular/core/testing';

import { Wig } from './wig';

describe('Wig', () => {
  let service: Wig;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Wig);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
