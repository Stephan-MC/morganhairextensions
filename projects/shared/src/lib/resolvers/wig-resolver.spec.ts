import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { wigResolver } from './wig-resolver';

describe('wigResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => wigResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
