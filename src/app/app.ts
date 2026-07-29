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

  ngAfterViewInit(): void {
    this.shortcuts.register(' ',      () => this.generateBtn?.triggerGenerate());
    this.shortcuts.register('h',      () => this.toggleHistory());
    this.shortcuts.register('e',      () => this.toggleExport());
    this.shortcuts.register('escape', () => this.closeAll());
  }

  // ─── Generate ───
  onGenerate(mode: GenerateMode): void {
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
