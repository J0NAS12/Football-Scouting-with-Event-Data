import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PossessionSummaryComponent } from './possession-summary.component';

describe('PossessionSummaryComponent', () => {
  let component: PossessionSummaryComponent;
  let fixture: ComponentFixture<PossessionSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PossessionSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PossessionSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
