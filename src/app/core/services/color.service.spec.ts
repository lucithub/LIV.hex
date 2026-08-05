import { TestBed } from '@angular/core/testing';
import { ColorService } from './color.service';
import { Color, ColorHsl, ColorRgb } from '../models/color.model';

describe('ColorService', () => {
  let service: ColorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColorService);
  });

  // ── generateRandom ────────────────────────────────────────────────────────

  describe('generateRandom', () => {
    it('should return a Color with a valid hex', () => {
      const color = service.generateRandom();
      expect(color.hex).toMatch(/^#[0-9A-F]{6}$/);
    });

    it('should return a Color with saturation between 50 and 90', () => {
      // Run multiple times because it's random
      for (let i = 0; i < 20; i++) {
        const color = service.generateRandom();
        expect(color.hsl.s).toBeGreaterThanOrEqual(50);
        expect(color.hsl.s).toBeLessThanOrEqual(90);
      }
    });

    it('should return a Color with lightness between 30 and 70', () => {
      for (let i = 0; i < 20; i++) {
        const color = service.generateRandom();
        expect(color.hsl.l).toBeGreaterThanOrEqual(30);
        expect(color.hsl.l).toBeLessThanOrEqual(70);
      }
    });

    it('should return a Color with a unique id', () => {
      const a = service.generateRandom();
      const b = service.generateRandom();
      expect(a.id).not.toBe(b.id);
    });
  });

  // ── fromHsl / fromHex ─────────────────────────────────────────────────────

  describe('fromHsl', () => {
    it('should build white from hsl(0, 0, 100)', () => {
      const color = service.fromHsl({ h: 0, s: 0, l: 100 });
      expect(color.hex).toBe('#FFFFFF');
      expect(color.rgb).toEqual({ r: 255, g: 255, b: 255 });
    });

    it('should build black from hsl(0, 0, 0)', () => {
      const color = service.fromHsl({ h: 0, s: 0, l: 0 });
      expect(color.hex).toBe('#000000');
      expect(color.rgb).toEqual({ r: 0, g: 0, b: 0 });
    });

    it('should build pure red from hsl(0, 100, 50)', () => {
      const color = service.fromHsl({ h: 0, s: 100, l: 50 });
      expect(color.hex).toBe('#FF0000');
    });

    it('should build pure green from hsl(120, 100, 50)', () => {
      const color = service.fromHsl({ h: 120, s: 100, l: 50 });
      expect(color.hex).toBe('#00FF00');
    });

    it('should build pure blue from hsl(240, 100, 50)', () => {
      const color = service.fromHsl({ h: 240, s: 100, l: 50 });
      expect(color.hex).toBe('#0000FF');
    });

    it('should populate cmyk on the returned Color', () => {
      const color = service.fromHsl({ h: 0, s: 100, l: 50 });
      expect(color.cmyk).toBeDefined();
      expect(color.cmyk.c).toBe(0);
      expect(color.cmyk.m).toBe(100);
      expect(color.cmyk.y).toBe(100);
      expect(color.cmyk.k).toBe(0);
    });
  });

  describe('fromHex', () => {
    it('should parse a lowercase hex string', () => {
      const color = service.fromHex('#ff8800');
      expect(color.hex).toBe('#FF8800');
      expect(color.rgb.r).toBe(255);
      expect(color.rgb.g).toBe(136);
      expect(color.rgb.b).toBe(0);
    });

    it('should parse an uppercase hex string', () => {
      const color = service.fromHex('#ABCDEF');
      expect(color.rgb.r).toBe(171);
      expect(color.rgb.g).toBe(205);
      expect(color.rgb.b).toBe(239);
    });
  });

  // ── hslToRgb ─────────────────────────────────────────────────────────────

  describe('hslToRgb', () => {
    it('should convert pure red', () => {
      expect(service.hslToRgb({ h: 0, s: 100, l: 50 })).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('should convert pure green', () => {
      expect(service.hslToRgb({ h: 120, s: 100, l: 50 })).toEqual({ r: 0, g: 255, b: 0 });
    });

    it('should convert pure blue', () => {
      expect(service.hslToRgb({ h: 240, s: 100, l: 50 })).toEqual({ r: 0, g: 0, b: 255 });
    });

    it('should convert white', () => {
      expect(service.hslToRgb({ h: 0, s: 0, l: 100 })).toEqual({ r: 255, g: 255, b: 255 });
    });

    it('should convert black', () => {
      expect(service.hslToRgb({ h: 0, s: 0, l: 0 })).toEqual({ r: 0, g: 0, b: 0 });
    });
  });

  // ── rgbToHsl ─────────────────────────────────────────────────────────────

  describe('rgbToHsl', () => {
    it('should convert pure red', () => {
      expect(service.rgbToHsl({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 100, l: 50 });
    });

    it('should convert white', () => {
      const hsl = service.rgbToHsl({ r: 255, g: 255, b: 255 });
      expect(hsl.l).toBe(100);
      expect(hsl.s).toBe(0);
    });

    it('should convert black', () => {
      const hsl = service.rgbToHsl({ r: 0, g: 0, b: 0 });
      expect(hsl.l).toBe(0);
    });
  });

  // ── rgbToHex / hexToRgb ───────────────────────────────────────────────────

  describe('rgbToHex', () => {
    it('should produce uppercase hex with # prefix', () => {
      expect(service.rgbToHex({ r: 255, g: 0, b: 0 })).toBe('#FF0000');
    });

    it('should pad single-digit values', () => {
      expect(service.rgbToHex({ r: 0, g: 0, b: 0 })).toBe('#000000');
    });
  });

  describe('hexToRgb', () => {
    it('should parse #FFFFFF to white', () => {
      expect(service.hexToRgb('#FFFFFF')).toEqual({ r: 255, g: 255, b: 255 });
    });

    it('should parse lowercase hex', () => {
      expect(service.hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
    });
  });

  // ── rgbToCmyk ────────────────────────────────────────────────────────────

  describe('rgbToCmyk', () => {
    it('should convert white to cmyk(0,0,0,0)', () => {
      expect(service.rgbToCmyk({ r: 255, g: 255, b: 255 })).toEqual({ c: 0, m: 0, y: 0, k: 0 });
    });

    it('should convert black to cmyk(0,0,0,100)', () => {
      expect(service.rgbToCmyk({ r: 0, g: 0, b: 0 })).toEqual({ c: 0, m: 0, y: 0, k: 100 });
    });

    it('should convert red to cmyk(0,100,100,0)', () => {
      expect(service.rgbToCmyk({ r: 255, g: 0, b: 0 })).toEqual({ c: 0, m: 100, y: 100, k: 0 });
    });
  });

  // ── generateHarmonic ─────────────────────────────────────────────────────

  describe('generateHarmonic', () => {
    let base: Color;

    beforeEach(() => {
      base = service.fromHsl({ h: 60, s: 70, l: 50 });
    });

    it('analogous should return 5 colors', () => {
      expect(service.generateHarmonic(base, 'analogous').length).toBe(5);
    });

    it('complementary should return 2 colors and the complement is 180° away', () => {
      const palette = service.generateHarmonic(base, 'complementary');
      expect(palette.length).toBe(2);
      expect(palette[1].hsl.h).toBe(240); // 60 + 180
    });

    it('monochromatic should return 5 colors with the same hue', () => {
      const palette = service.generateHarmonic(base, 'monochromatic');
      expect(palette.length).toBe(5);
      palette.forEach(c => expect(c.hsl.h).toBe(base.hsl.h));
    });

    it('triadic should return 3 colors spaced 120° apart', () => {
      const palette = service.generateHarmonic(base, 'triadic');
      expect(palette.length).toBe(3);
      expect(palette[1].hsl.h).toBe(180); // 60 + 120
      expect(palette[2].hsl.h).toBe(300); // 60 + 240
    });

    it('wrapHue should handle values > 360', () => {
      const redBase = service.fromHsl({ h: 350, s: 70, l: 50 });
      const palette = service.generateHarmonic(redBase, 'complementary');
      // 350 + 180 = 530 → wrapped to 170
      expect(palette[1].hsl.h).toBe(170);
    });
  });

  // ── getContrastRatio / getAdaptiveTextColor / getWcagRating ─────────────

  describe('contrast', () => {
    it('black on white should have ratio ≈ 21', () => {
      const white = service.fromHsl({ h: 0, s: 0, l: 100 });
      const black = service.fromHsl({ h: 0, s: 0, l: 0 });
      const ratio = service.getContrastRatio(white, black);
      expect(ratio).toBeCloseTo(21, 0);
    });

    it('white on white should have ratio 1', () => {
      const white = service.fromHsl({ h: 0, s: 0, l: 100 });
      expect(service.getContrastRatio(white, white)).toBe(1);
    });

    it('getAdaptiveTextColor: light background → dark text', () => {
      const lightColor = service.fromHsl({ h: 50, s: 80, l: 80 });
      expect(service.getAdaptiveTextColor(lightColor)).toBe('dark');
    });

    it('getAdaptiveTextColor: dark background → light text', () => {
      const darkColor = service.fromHsl({ h: 220, s: 60, l: 20 });
      expect(service.getAdaptiveTextColor(darkColor)).toBe('light');
    });

    it('getWcagRating: ratio ≥ 7 → AAA', () => {
      expect(service.getWcagRating(7.0)).toBe('AAA');
      expect(service.getWcagRating(10)).toBe('AAA');
    });

    it('getWcagRating: 4.5 ≤ ratio < 7 → AA', () => {
      expect(service.getWcagRating(4.5)).toBe('AA');
      expect(service.getWcagRating(6.9)).toBe('AA');
    });

    it('getWcagRating: ratio < 4.5 → fail', () => {
      expect(service.getWcagRating(4.4)).toBe('fail');
      expect(service.getWcagRating(1)).toBe('fail');
    });
  });
});
