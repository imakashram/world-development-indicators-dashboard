import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorldDevelopmentIndicatorDashboardPage } from './world-development-indicator-dashboard.page';

describe('WorldDevelopmentIndicatorDashboardPage', () => {
  let component: WorldDevelopmentIndicatorDashboardPage;
  let fixture: ComponentFixture<WorldDevelopmentIndicatorDashboardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WorldDevelopmentIndicatorDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
