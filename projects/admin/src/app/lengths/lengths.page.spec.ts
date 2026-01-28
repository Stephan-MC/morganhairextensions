import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LengthsPage } from './lengths.page';

describe('LengthsPage', () => {
  let component: LengthsPage;
  let fixture: ComponentFixture<LengthsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LengthsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LengthsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
