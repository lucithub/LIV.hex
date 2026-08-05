import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenerateButtonComponent, GenerateMode } from './generate-button.component';
import { vi } from 'vitest';

describe('GenerateButtonComponent', () => {
  let component: GenerateButtonComponent;
  let fixture: ComponentFixture<GenerateButtonComponent>;

  beforeEach(async () => {
    vi.useFakeTimers();
    await TestBed.configureTestingModule({
      imports: [GenerateButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GenerateButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default selectedMode to random', () => {
    expect(component.selectedMode()).toBe('random');
  });

  it('should change selectedMode when selectMode is called', () => {
    component.selectMode('analogous');
    expect(component.selectedMode()).toBe('analogous');
  });

  it('should emit selectedMode on generate output when onGenerate is called', () => {
    const emitted: GenerateMode[] = [];
    component.generate.subscribe(mode => emitted.push(mode));

    component.selectMode('triadic');
    component.onGenerate();

    expect(emitted).toEqual(['triadic']);
    vi.advanceTimersByTime(400);
  });

  it('should set isAnimating to true temporarily on generate', () => {
    component.onGenerate();
    expect(component.isAnimating()).toBe(true);

    vi.advanceTimersByTime(400);
    expect(component.isAnimating()).toBe(false);
  });

  it('should ignore duplicate triggers while animating', () => {
    const spy = vi.fn();
    component.generate.subscribe(spy);

    component.onGenerate();
    component.onGenerate(); // Second call while animating

    expect(spy).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(400);
  });

  it('should trigger generate when triggerGenerate is called', () => {
    const spy = vi.fn();
    component.generate.subscribe(spy);

    component.triggerGenerate();
    expect(spy).toHaveBeenCalledWith('random');
    vi.advanceTimersByTime(400);
  });
});
