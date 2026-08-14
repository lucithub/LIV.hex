import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SwatchBarComponent } from './swatch-bar.component';
import { Color } from '../../core/models/color.model';

describe('SwatchBarComponent', () => {
  let component: SwatchBarComponent;
  let fixture: ComponentFixture<SwatchBarComponent>;

  const mockPalette: Color[] = [
    {
      id: 'color-1',
      hex: '#FF0000',
      rgb: { r: 255, g: 0, b: 0 },
      hsl: { h: 0, s: 100, l: 50 },
      cmyk: { c: 0, m: 100, y: 100, k: 0 },
    },
    {
      id: 'color-2',
      hex: '#00FF00',
      rgb: { r: 0, g: 255, b: 0 },
      hsl: { h: 120, s: 100, l: 50 },
      cmyk: { c: 100, m: 0, y: 100, k: 0 },
    },
    {
      id: 'color-3',
      hex: '#0000FF',
      rgb: { r: 0, g: 0, b: 255 },
      hsl: { h: 240, s: 100, l: 50 },
      cmyk: { c: 100, m: 100, y: 0, k: 0 },
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwatchBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SwatchBarComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('palette', mockPalette);
    fixture.componentRef.setInput('activeColorId', 'color-1');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should receive palette input', () => {
    expect(component.palette().length).toBe(3);
  });

  it('should emit colorSelected when onSelect is called', () => {
    const emitted: Color[] = [];
    component.colorSelected.subscribe(c => emitted.push(c));

    component.onSelect(mockPalette[1]);

    expect(emitted.length).toBe(1);
    expect(emitted[0].id).toBe('color-2');
  });

  it('should receive activeColorId input', () => {
    expect(component.activeColorId()).toBe('color-1');
  });
});
