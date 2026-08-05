import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaletteDisplayComponent } from './palette-display.component';
import { Color } from '../../core/models/color.model';

function makeColor(id: string, hex: string): Color {
  return {
    id,
    hex,
    rgb: { r: 0, g: 0, b: 0 },
    hsl: { h: 0, s: 0, l: 0 },
    cmyk: { c: 0, m: 0, y: 0, k: 100 },
  };
}

describe('PaletteDisplayComponent', () => {
  let component: PaletteDisplayComponent;
  let fixture: ComponentFixture<PaletteDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaletteDisplayComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaletteDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute hasMultiple as false when palette is empty or has 1 color', () => {
    expect(component.hasMultiple()).toBe(false);

    fixture.componentRef.setInput('palette', [makeColor('1', '#FFFFFF')]);
    fixture.detectChanges();
    expect(component.hasMultiple()).toBe(false);
  });

  it('should compute hasMultiple as true when palette has 2 or more colors', () => {
    fixture.componentRef.setInput('palette', [
      makeColor('1', '#FF0000'),
      makeColor('2', '#00FF00'),
    ]);
    fixture.detectChanges();

    expect(component.hasMultiple()).toBe(true);
  });

  it('should determine isActive correctly', () => {
    const c1 = makeColor('c1', '#111111');
    const c2 = makeColor('c2', '#222222');

    fixture.componentRef.setInput('activeColorId', 'c1');
    fixture.detectChanges();

    expect(component.isActive(c1)).toBe(true);
    expect(component.isActive(c2)).toBe(false);
  });

  it('should emit colorSelected output when select is called', () => {
    const emitted: Color[] = [];
    component.colorSelected.subscribe(c => emitted.push(c));

    const color = makeColor('c1', '#FF0000');
    component.select(color);

    expect(emitted).toEqual([color]);
  });
});
