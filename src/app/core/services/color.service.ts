import { Injectable } from '@angular/core';
import { Color, ColorCmyk, ColorHsl, ColorRgb, HarmonicType } from '../models/color.model';

@Injectable({ providedIn: 'root' })
export class ColorService {

  // ─────────────────────────────────────────────
  // Public API
  // ─────────────────────────────────────────────

  /**
   * Generates a random Color with aesthetically pleasing constraints:
   * - Saturation: 50–90% (avoids muddy / greyed-out colors)
   * - Lightness:  30–70% (avoids too-dark / too-washed-out colors)
   */
  generateRandom(): Color {
    const h = Math.floor(Math.random() * 360);
    const s = Math.floor(Math.random() * 41) + 50;  // 50–90
    const l = Math.floor(Math.random() * 41) + 30;  // 30–70
    return this.fromHsl({ h, s, l });
  }

  /**
   * Generates a harmonic palette based on a seed Color.
   * Returns an array of 3–5 colors depending on the harmonic type.
   */
  generateHarmonic(base: Color, type: HarmonicType): Color[] {
    const { h, s, l } = base.hsl;

    switch (type) {
      case 'analogous':
        return [
          this.fromHsl({ h: this.wrapHue(h - 60), s, l }),
          this.fromHsl({ h: this.wrapHue(h - 30), s, l }),
          base,
          this.fromHsl({ h: this.wrapHue(h + 30), s, l }),
          this.fromHsl({ h: this.wrapHue(h + 60), s, l }),
        ];

      case 'complementary':
        return [
          base,
          this.fromHsl({ h: this.wrapHue(h + 180), s, l }),
        ];

      case 'monochromatic':
        return [
          this.fromHsl({ h, s, l: this.clampLightness(l - 30) }),
          this.fromHsl({ h, s, l: this.clampLightness(l - 15) }),
          base,
          this.fromHsl({ h, s, l: this.clampLightness(l + 15) }),
          this.fromHsl({ h, s, l: this.clampLightness(l + 30) }),
        ];

      case 'triadic':
        return [
          base,
          this.fromHsl({ h: this.wrapHue(h + 120), s, l }),
          this.fromHsl({ h: this.wrapHue(h + 240), s, l }),
        ];
    }
  }

  // ─────────────────────────────────────────────
  // Factory: build a Color from HSL
  // ─────────────────────────────────────────────

  fromHsl(hsl: ColorHsl): Color {
    const rgb = this.hslToRgb(hsl);
    return {
      id: crypto.randomUUID(),
      hex: this.rgbToHex(rgb),
      rgb,
      hsl,
      cmyk: this.rgbToCmyk(rgb),
    };
  }

  fromHex(hex: string): Color {
    const rgb = this.hexToRgb(hex);
    const hsl = this.rgbToHsl(rgb);
    return {
      id: crypto.randomUUID(),
      hex: hex.toUpperCase(),
      rgb,
      hsl,
      cmyk: this.rgbToCmyk(rgb),
    };
  }

  // ─────────────────────────────────────────────
  // Conversions
  // ─────────────────────────────────────────────

  hslToRgb({ h, s, l }: ColorHsl): ColorRgb {
    const sn = s / 100;
    const ln = l / 100;
    const c = (1 - Math.abs(2 * ln - 1)) * sn;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = ln - c / 2;

    let r = 0, g = 0, b = 0;
    if      (h < 60)  { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else              { r = c; g = 0; b = x; }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255),
    };
  }

  rgbToHsl({ r, g, b }: ColorRgb): ColorHsl {
    const rn = r / 255, gn = g / 255, bn = b / 255;
    const max = Math.max(rn, gn, bn);
    const min = Math.min(rn, gn, bn);
    const delta = max - min;
    const l = (max + min) / 2;

    let h = 0, s = 0;

    if (delta !== 0) {
      s = delta / (1 - Math.abs(2 * l - 1));

      if      (max === rn) h = ((gn - bn) / delta) % 6;
      else if (max === gn) h = (bn - rn) / delta + 2;
      else                 h = (rn - gn) / delta + 4;

      h = Math.round(h * 60);
      if (h < 0) h += 360;
    }

    return {
      h,
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }

  rgbToHex({ r, g, b }: ColorRgb): string {
    const toHex = (n: number) => n.toString(16).padStart(2, '0').toUpperCase();
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  hexToRgb(hex: string): ColorRgb {
    const clean = hex.replace('#', '');
    return {
      r: parseInt(clean.slice(0, 2), 16),
      g: parseInt(clean.slice(2, 4), 16),
      b: parseInt(clean.slice(4, 6), 16),
    };
  }

  rgbToCmyk({ r, g, b }: ColorRgb): ColorCmyk {
    const rn = r / 255, gn = g / 255, bn = b / 255;
    const k = 1 - Math.max(rn, gn, bn);

    if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };

    return {
      c: Math.round(((1 - rn - k) / (1 - k)) * 100),
      m: Math.round(((1 - gn - k) / (1 - k)) * 100),
      y: Math.round(((1 - bn - k) / (1 - k)) * 100),
      k: Math.round(k * 100),
    };
  }

  // ─────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────

  private wrapHue(h: number): number {
    return ((h % 360) + 360) % 360;
  }

  private clampLightness(l: number): number {
    return Math.min(95, Math.max(5, l));
  }
}
