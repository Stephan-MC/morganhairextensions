import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WigCard } from './wig-card';

describe('WigCard', () => {
  let component: WigCard;
  let fixture: ComponentFixture<WigCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WigCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WigCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
