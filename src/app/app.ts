import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  AfterViewInit,
  ViewChild,
  HostBinding,
} from '@angular/core';

import { Color } from './core/models/color.model';
import { ColorService } from './core/services/color.service';
import { HistoryService } from './core/services/history.service';
import { KeyboardShortcutService } from './core/services/keyboard-shortcut.service';

import { ColorDisplayComponent } from './features/color-display/color-display.component';
import { GenerateButtonComponent, GenerateMode } from './features/generate-button/generate-button.component';
import { PaletteDisplayComponent } from './features/palette-display/palette-display.component';
import { HistoryPanelComponent } from './features/history-panel/history-panel.component';
import { ExportPanelComponent } from './features/export-panel/export-panel.component';
import { SwatchBarComponent } from './features/swatch-bar/swatch-bar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ColorDisplayComponent,
    GenerateButtonComponent,
    PaletteDisplayComponent,
    HistoryPanelComponent,
    ExportPanelComponent,
    SwatchBarComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements AfterViewInit {
  private readonly colorService   = inject(ColorService);
  private readonly historyService = inject(HistoryService);
  private readonly shortcuts      = inject(KeyboardShortcutService);

  @ViewChild(GenerateButtonComponent)
  private readonly generateBtn!: GenerateButtonComponent;

  // ─── State ───
  readonly currentColor   = signal<Color>(this.colorService.generateRandom());
  readonly currentPalette = signal<Color[]>([]);
  readonly historyOpen    = signal(false);
  readonly exportOpen     = signal(false);
  readonly isLocked       = signal(false);

  // ─── Host bindings — drives full-page background transition ───
  @HostBinding('style.--color-bg')
  get hostBg(): string {
    return this.currentColor().hex;
  }

  @HostBinding('style.--color-text-adaptive')
  get hostText(): string {
    return this.colorService.getAdaptiveTextColor(this.currentColor()) === 'light'
      ? '#ffffff'
      : '#111111';
  }

  /** T-25: 3-layer editorial background bound to the host element */
  @HostBinding('style.background')
  get hostBackground(): string {
    const hex = this.currentColor().hex;
    return [
      // Layer 3 — Vignette: dark edges frame the composition
      'radial-gradient(ellipse 120% 120% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)',
      // Layer 2 — Glow: off-center warm highlight simulates studio light
      `radial-gradient(ellipse 60% 50% at 50% 20%, ${hex}55 0%, transparent 70%)`,
      // Layer 1 — Base: the main color bleeding into a very dark background
      `radial-gradient(ellipse 100% 100% at 50% 50%, ${hex}CC 0%, ${hex}22 60%, #0d0d0d 100%)`,
    ].join(', ');
  }

  ngAfterViewInit(): void {
    this.shortcuts.register(' ',      () => this.generateBtn?.triggerGenerate());
    this.shortcuts.register('h',      () => this.toggleHistory());
    this.shortcuts.register('e',      () => this.toggleExport());
    this.shortcuts.register('l',      () => this.toggleLock());
    this.shortcuts.register('escape', () => this.closeAll());
  }

  // ─── Generate ───
  onGenerate(mode: GenerateMode): void {
    if (this.isLocked()) return; // palette is locked — ignore generation

    let color: Color;
    let palette: Color[];

    if (mode === 'random') {
      color   = this.colorService.generateRandom();
      palette = [color];
    } else {
      const seed = this.colorService.generateRandom();
      palette    = this.colorService.generateHarmonic(seed, mode);
      color      = palette[Math.floor(palette.length / 2)];
    }

    this.currentColor.set(color);
    this.currentPalette.set(palette);
    this.historyService.add(color);
  }

  // ─── Palette swatch selected ───
  onColorSelected(color: Color): void {
    this.currentColor.set(color);
    this.historyService.add(color);
  }

  // ─── Manual HSL/HEX color change ───
  onManualColorChange(event: { color: Color; isFinal: boolean }): void {
    const { color, isFinal } = event;
    this.currentColor.set(color);

    const mode = this.generateBtn?.selectedMode() || 'random';
    if (mode !== 'random') {
      const palette = this.colorService.generateHarmonic(color, mode);
      this.currentPalette.set(palette);
    } else {
      this.currentPalette.set([color]);
    }

    if (isFinal) {
      this.historyService.add(color);
    }
  }

  // ─── History restored ───
  onColorRestored(color: Color): void {
    this.currentColor.set(color);
    this.currentPalette.set([color]);
    this.historyOpen.set(false);
  }

  // ─── Panel toggles ───
  toggleHistory(): void {
    const next = !this.historyOpen();
    this.historyOpen.set(next);
    if (next) this.exportOpen.set(false);
  }

  toggleExport(): void {
    const next = !this.exportOpen();
    this.exportOpen.set(next);
    if (next) this.historyOpen.set(false);
  }

  // ─── Palette lock toggle ───
  toggleLock(): void {
    this.isLocked.update(v => !v);
  }

  closeAll(): void {
    this.historyOpen.set(false);
    this.exportOpen.set(false);
  }

  /** Palette to export: harmonic palette or just the current color */
  get exportPalette(): Color[] {
    const p = this.currentPalette();
    return p.length > 1 ? p : [this.currentColor()];
  }
}
