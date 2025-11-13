import { TestBed } from '@angular/core/testing';

import { Texture } from './texture';

describe('Texture', () => {
  let service: Texture;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Texture);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
