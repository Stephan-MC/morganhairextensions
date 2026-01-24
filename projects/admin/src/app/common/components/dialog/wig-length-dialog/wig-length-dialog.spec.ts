import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WigLengthDialog } from './wig-length-dialog';

describe('WigLengthDialog', () => {
  let component: WigLengthDialog;
  let fixture: ComponentFixture<WigLengthDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WigLengthDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WigLengthDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
