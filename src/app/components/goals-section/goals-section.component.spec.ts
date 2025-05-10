import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalsSectionComponent } from './goals-section.component';

describe('GoalsSectionComponent', () => {
  let component: GoalsSectionComponent;
  let fixture: ComponentFixture<GoalsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoalsSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoalsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
