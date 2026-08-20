import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FeedbackModalComponent } from './feedback-modal.component';
import { vi } from 'vitest';

describe('FeedbackModalComponent', () => {
  let component: FeedbackModalComponent;
  let fixture: ComponentFixture<FeedbackModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedbackModalComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedbackModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start in idle state', () => {
    expect(component.state()).toBe('idle');
  });

  it('should be invalid when message is empty', () => {
    component.message.set('');
    expect(component.isValid).toBe(false);
  });

  it('should be valid when message has content', () => {
    component.message.set('This is a test message');
    expect(component.isValid).toBe(true);
  });

  it('should update feedbackType when selectType is called', () => {
    component.selectType('bug');
    expect(component.feedbackType()).toBe('bug');

    component.selectType('improvement');
    expect(component.feedbackType()).toBe('improvement');
  });

  it('should emit closed output when close is called', () => {
    const emitSpy = vi.spyOn(component.closed, 'emit');

    component.close();

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  it('should reset all state when reset is called', () => {
    component.feedbackType.set('bug');
    component.message.set('Some text');
    component.email.set('a@b.com');
    component.state.set('success' as any);

    component.reset();

    expect(component.state()).toBe('idle');
    expect(component.feedbackType()).toBe('general');
    expect(component.message()).toBe('');
    expect(component.email()).toBe('');
  });

  it('should NOT submit when message is empty', () => {
    component.message.set('');
    component.onSubmit();
    expect(component.state()).toBe('idle');
  });
});
