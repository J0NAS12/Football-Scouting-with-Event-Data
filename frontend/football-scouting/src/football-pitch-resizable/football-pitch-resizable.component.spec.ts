import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FootballPitchResizableComponent } from './football-pitch-resizable.component';

describe('FootballPitchResizableComponent', () => {
  let component: FootballPitchResizableComponent;
  let fixture: ComponentFixture<FootballPitchResizableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FootballPitchResizableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FootballPitchResizableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
