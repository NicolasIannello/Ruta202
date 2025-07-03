import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmergencyNoticeComponent } from './emergency-notice.component';

describe('EmergencyNoticeComponent', () => {
  let component: EmergencyNoticeComponent;
  let fixture: ComponentFixture<EmergencyNoticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmergencyNoticeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmergencyNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
