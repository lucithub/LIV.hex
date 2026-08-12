export type HarmonicType = 'analogous' | 'complementary' | 'duotone' | 'monochromatic' | 'triadic';

export interface ColorRgb {
  r: number;
  g: number;
  b: number;
}

export interface ColorHsl {
  h: number;
  s: number;
  l: number;
}

export interface ColorCmyk {
  c: number;
  m: number;
  y: number;
  k: number;
}

export interface Color {
  id: string;
  hex: string;
  rgb: ColorRgb;
  hsl: ColorHsl;
  cmyk: ColorCmyk;
}
