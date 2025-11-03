import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WigPage } from './wig.page';

describe('WigPage', () => {
  let component: WigPage;
  let fixture: ComponentFixture<WigPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WigPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WigPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
