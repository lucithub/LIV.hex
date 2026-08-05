import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorDisplayComponent } from './color-display.component';
import { ColorService } from '../../core/services/color.service';
import { Color } from '../../core/models/color.model';

describe('ColorDisplayComponent', () => {
  let component: ColorDisplayComponent;
  let fixture: ComponentFixture<ColorDisplayComponent>;
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
});
