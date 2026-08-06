import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorDisplayComponent } from './color-display.component';
import { ColorService } from '../../core/services/color.service';
import { Color } from '../../core/models/color.model';
import { vi } from 'vitest';

describe('ColorDisplayComponent', () => {
  let component: ColorDisplayComponent;
  let fixture: ComponentFixture<ColorDisplayComponent>;
  let colorService: ColorService;
  let mockColor: Color;

  beforeEach(async () => {
    mockColor = {
      id: 'test-id',
      hex: '#FF8800',
      rgb: { r: 255, g: 136, b: 0 },
      hsl: { h: 30, s: 100, l: 50 },
      cmyk: { c: 0, m: 47, y: 100, k: 0 },
    };

    await TestBed.configureTestingModule({
      imports: [ColorDisplayComponent],
      providers: [ColorService],
    }).compileComponents();

    colorService = TestBed.inject(ColorService);
    fixture = TestBed.createComponent(ColorDisplayComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('color', mockColor);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute adaptive text style', () => {
    const textStyle = component.textStyle();
    expect(['light', 'dark']).toContain(textStyle);
  });

  it('should list format chips', () => {
    const formats = component.formats();
    expect(formats.length).toBeGreaterThanOrEqual(4);
    expect(formats.map(f => f.label)).toEqual(expect.arrayContaining(['HEX', 'RGB', 'HSL', 'CMYK']));
  });

  // ── Manual adjustments ───────────────────────────────────────────────────

  describe('HEX input manual editing', () => {
    it('should emit colorChanged output with isFinal=false on valid onHexInput', () => {
      const emitted: any[] = [];
      component.colorChanged.subscribe(ev => emitted.push(ev));

      component.onHexInput('00ff00');

      expect(emitted.length).toBe(1);
      expect(emitted[0].isFinal).toBe(false);
      expect(emitted[0].color.hex).toBe('#00FF00');
    });

    it('should expand 3-digit HEX and emit onHexInput', () => {
      const emitted: any[] = [];
      component.colorChanged.subscribe(ev => emitted.push(ev));

      component.onHexInput('f00');

      expect(emitted.length).toBe(1);
      expect(emitted[0].color.hex).toBe('#FF0000');
    });

    it('should NOT emit output on invalid onHexInput', () => {
      const emitted: any[] = [];
      component.colorChanged.subscribe(ev => emitted.push(ev));

      component.onHexInput('invalid-color');

      expect(emitted.length).toBe(0);
    });

    it('should emit colorChanged output with isFinal=true on valid onHexBlur', () => {
      const emitted: any[] = [];
      component.colorChanged.subscribe(ev => emitted.push(ev));

      const mockInput = { value: '#0000FF' } as HTMLInputElement;
      component.onHexBlur(mockInput);

      expect(emitted.length).toBe(1);
      expect(emitted[0].isFinal).toBe(true);
      expect(emitted[0].color.hex).toBe('#0000FF');
    });

    it('should revert input element value on invalid onHexBlur', () => {
      const emitted: any[] = [];
      component.colorChanged.subscribe(ev => emitted.push(ev));

      const mockInput = { value: 'invalid-hex' } as HTMLInputElement;
      component.onHexBlur(mockInput);

      expect(emitted.length).toBe(0);
      expect(mockInput.value).toBe('#FF8800'); // reset to component's current color hex
    });
  });

  describe('HSL sliders manual editing', () => {
    it('should emit colorChanged output with isFinal=false on slider input', () => {
      const emitted: any[] = [];
      component.colorChanged.subscribe(ev => emitted.push(ev));

      const mockEvent = { target: { value: '180' } } as unknown as Event;
      component.onHslSliderInput(mockEvent, 'h');

      expect(emitted.length).toBe(1);
      expect(emitted[0].isFinal).toBe(false);
      expect(emitted[0].color.hsl.h).toBe(180);
    });

    it('should emit colorChanged output with isFinal=true on slider change', () => {
      const emitted: any[] = [];
      component.colorChanged.subscribe(ev => emitted.push(ev));

      const mockEvent = { target: { value: '80' } } as unknown as Event;
      component.onHslSliderChange(mockEvent, 's');

      expect(emitted.length).toBe(1);
      expect(emitted[0].isFinal).toBe(true);
      expect(emitted[0].color.hsl.s).toBe(80);
    });
  });
});
