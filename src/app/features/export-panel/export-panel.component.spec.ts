import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExportPanelComponent } from './export-panel.component';
import { Color } from '../../core/models/color.model';

function makeColor(hex: string): Color {
  return {
    id: crypto.randomUUID(),
    hex,
    rgb: { r: 255, g: 0, b: 0 },
    hsl: { h: 0, s: 100, l: 50 },
    cmyk: { c: 0, m: 100, y: 100, k: 0 },
  };
}

describe('ExportPanelComponent', () => {
  let component: ExportPanelComponent;
  let fixture: ComponentFixture<ExportPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExportPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default format to css', () => {
    expect(component.selectedFormat()).toBe('css');
  });

  it('should change format when selectFormat is called', () => {
    component.selectFormat('tailwind');
    expect(component.selectedFormat()).toBe('tailwind');
  });

  it('should generate valid CSS export code', () => {
    fixture.componentRef.setInput('palette', [makeColor('#FF0000')]);
    fixture.detectChanges();

    component.selectFormat('css');
    const code = component.exportedCode();

    expect(code).toContain(':root {');
    expect(code).toContain('--livhex-1: #FF0000;');
    expect(code).toContain('--livhex-1-rgb: 255, 0, 0;');
    expect(code).toContain('--livhex-1-hsl: 0deg 100% 50%;');
  });

  it('should generate valid Tailwind export code', () => {
    fixture.componentRef.setInput('palette', [makeColor('#FF0000')]);
    fixture.detectChanges();

    component.selectFormat('tailwind');
    const code = component.exportedCode();

    expect(code).toContain("// tailwind.config.js");
    expect(code).toContain("'livhex-1': '#FF0000'");
  });

  it('should generate valid JSON export code', () => {
    fixture.componentRef.setInput('palette', [makeColor('#FF0000')]);
    fixture.detectChanges();

    component.selectFormat('json');
    const code = component.exportedCode();
    const parsed = JSON.parse(code);

    expect(parsed.length).toBe(1);
    expect(parsed[0].hex).toBe('#FF0000');
  });

  it('should emit closed output when close is called', () => {
    let called = false;
    component.closed.subscribe(() => { called = true; });

    component.close();
    expect(called).toBe(true);
  });
});
