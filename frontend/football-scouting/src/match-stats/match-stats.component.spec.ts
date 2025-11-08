import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchStatsComponent } from './match-stats.component';

describe('MatchStatsComponent', () => {
  let component: MatchStatsComponent;
  let fixture: ComponentFixture<MatchStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
