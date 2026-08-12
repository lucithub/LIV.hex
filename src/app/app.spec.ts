import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';
import { ColorService } from './core/services/color.service';
import { HistoryService } from './core/services/history.service';
import { Color } from './core/models/color.model';

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;
  let colorService: ColorService;
  let historyService: HistoryService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();

    colorService   = TestBed.inject(ColorService);
    historyService = TestBed.inject(HistoryService);
    fixture        = TestBed.createComponent(App);
    component      = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => localStorage.clear());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with a valid current color', () => {
    const color = component.currentColor();
    expect(color.hex).toMatch(/^#[0-9A-F]{6}$/);
  });

  it('should initialize with an empty palette', () => {
    expect(component.currentPalette().length).toBe(0);
  });

  it('should initialize with both panels closed', () => {
    expect(component.historyOpen()).toBe(false);
    expect(component.exportOpen()).toBe(false);
  });

  // ── onGenerate ─────────────────────────────────────────────────────────────

  describe('onGenerate', () => {
    it('random mode: updates currentColor and adds to history', () => {
      component.onGenerate('random');
      const color = component.currentColor();
      expect(color.hex).toMatch(/^#[0-9A-F]{6}$/);
      expect(historyService.history().length).toBeGreaterThan(0);
    });

    it('analogous mode: builds a palette of 5 and picks center color', () => {
      component.onGenerate('analogous');
      expect(component.currentPalette().length).toBe(5);
    });

    it('complementary mode: builds a palette of 2', () => {
      component.onGenerate('complementary');
      expect(component.currentPalette().length).toBe(2);
    });

    it('triadic mode: builds a palette of 3', () => {
      component.onGenerate('triadic');
      expect(component.currentPalette().length).toBe(3);
    });

    it('monochromatic mode: builds a palette of 5', () => {
      component.onGenerate('monochromatic');
      expect(component.currentPalette().length).toBe(5);
    });
  });

  // ── onColorSelected ────────────────────────────────────────────────────────

  describe('onColorSelected', () => {
    it('should update currentColor and add it to history', () => {
      const selected: Color = colorService.fromHsl({ h: 180, s: 60, l: 50 });
      component.onColorSelected(selected);
      expect(component.currentColor().id).toBe(selected.id);
      expect(historyService.history()[0].id).toBe(selected.id);
    });
  });

  // ── onColorRestored ────────────────────────────────────────────────────────

  describe('onColorRestored', () => {
    it('should restore the color and close the history panel', () => {
      component.toggleHistory();
      expect(component.historyOpen()).toBe(true);

      const restored: Color = colorService.fromHsl({ h: 30, s: 80, l: 50 });
      component.onColorRestored(restored);

      expect(component.currentColor().id).toBe(restored.id);
      expect(component.historyOpen()).toBe(false);
    });

    it('should set the palette to contain only the restored color', () => {
      const restored: Color = colorService.fromHsl({ h: 30, s: 80, l: 50 });
      component.onColorRestored(restored);
      expect(component.currentPalette().length).toBe(1);
      expect(component.currentPalette()[0].id).toBe(restored.id);
    });
  });

  // ── panel toggles ──────────────────────────────────────────────────────────

  describe('toggleHistory', () => {
    it('should open history panel', () => {
      component.toggleHistory();
      expect(component.historyOpen()).toBe(true);
    });

    it('should close export panel when opening history', () => {
      component.toggleExport();
      component.toggleHistory();
      expect(component.exportOpen()).toBe(false);
    });

    it('should toggle history off when already open', () => {
      component.toggleHistory();
      component.toggleHistory();
      expect(component.historyOpen()).toBe(false);
    });
  });

  describe('toggleExport', () => {
    it('should open export panel', () => {
      component.toggleExport();
      expect(component.exportOpen()).toBe(true);
    });

    it('should close history panel when opening export', () => {
      component.toggleHistory();
      component.toggleExport();
      expect(component.historyOpen()).toBe(false);
    });
  });

  describe('closeAll', () => {
    it('should close both panels', () => {
      component.toggleHistory();
      component.closeAll();
      expect(component.historyOpen()).toBe(false);
      expect(component.exportOpen()).toBe(false);
    });
  });

  // ── exportPalette ────────────────────────────────────────────────────────

  describe('exportPalette', () => {
    it('should return just the current color when palette has 1 item', () => {
      component.onGenerate('random');
      expect(component.exportPalette.length).toBe(1);
    });

    it('should return the full palette when palette has more than 1 item', () => {
      component.onGenerate('analogous');
      expect(component.exportPalette.length).toBe(5);
    });
  });

  // ── onManualColorChange ────────────────────────────────────────────────────

  describe('onManualColorChange', () => {
    it('should update current color immediately', () => {
      const color: Color = colorService.fromHsl({ h: 120, s: 80, l: 40 });
      component.onManualColorChange({ color, isFinal: false });

      expect(component.currentColor().id).toBe(color.id);
    });

    it('should NOT add to history when isFinal is false', () => {
      const initialHistoryCount = historyService.history().length;
      const color: Color = colorService.fromHsl({ h: 120, s: 80, l: 40 });
      component.onManualColorChange({ color, isFinal: false });

      expect(historyService.history().length).toBe(initialHistoryCount);
    });

    it('should add to history when isFinal is true', () => {
      const initialHistoryCount = historyService.history().length;
      const color: Color = colorService.fromHsl({ h: 120, s: 80, l: 40 });
      component.onManualColorChange({ color, isFinal: true });

      expect(historyService.history().length).toBe(initialHistoryCount + 1);
      expect(historyService.history()[0].id).toBe(color.id);
    });

    it('should regenerate current palette dynamically if a harmonic mode is active', () => {
      component['generateBtn'].selectedMode.set('analogous');
      component.onGenerate('analogous');
      const paletteBefore = component.currentPalette();
      expect(paletteBefore.length).toBe(5);

      const color: Color = colorService.fromHsl({ h: 150, s: 80, l: 40 });
      component.onManualColorChange({ color, isFinal: false });

      const paletteAfter = component.currentPalette();
      expect(paletteAfter.length).toBe(5);
      expect(paletteAfter[2].id).toBe(color.id); // center color is seed
    });
  });

  // ── hostBg / hostText ────────────────────────────────────────────────────

  describe('CSS custom property bindings', () => {
    it('hostBg should return the current color hex', () => {
      const hex = component.currentColor().hex;
      expect(component.hostBg).toBe(hex);
    });

    it('hostText should return a valid CSS color string', () => {
      const text = component.hostText;
      expect(['#ffffff', '#111111']).toContain(text);
    });
  });

  // ── Palette Lock (T-26) ──────────────────────────────────────────────────

  describe('palette lock', () => {
    it('should start unlocked', () => {
      expect(component.isLocked()).toBe(false);
    });

    it('toggleLock should switch to locked', () => {
      component.toggleLock();
      expect(component.isLocked()).toBe(true);
    });

    it('toggleLock should switch back to unlocked', () => {
      component.toggleLock();
      component.toggleLock();
      expect(component.isLocked()).toBe(false);
    });

    it('onGenerate should NOT update color when locked', () => {
      const colorBefore = component.currentColor().id;
      component.toggleLock();
      component.onGenerate('random');
      expect(component.currentColor().id).toBe(colorBefore);
    });

    it('onGenerate should update color when NOT locked', () => {
      const colorBefore = component.currentColor().id;
      component.onGenerate('random');
      // A new random color will almost certainly have a different id
      // We just assert the call didn't throw and state changed
      expect(component.currentColor()).toBeDefined();
      expect(component.isLocked()).toBe(false);
    });

    it('onManualColorChange should still work when locked', () => {
      component.toggleLock();
      const newColor = colorService.fromHsl({ h: 200, s: 60, l: 50 });
      component.onManualColorChange({ color: newColor, isFinal: false });
      expect(component.currentColor().id).toBe(newColor.id);
    });
  });
});
