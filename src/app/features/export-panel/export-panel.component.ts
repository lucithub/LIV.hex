import {
  Component,
  ChangeDetectionStrategy,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { Color } from '../../core/models/color.model';

export type ExportFormat = 'css' | 'tailwind' | 'json';

interface FormatTab {
  value: ExportFormat;
  label: string;
}

@Component({
  selector: 'app-export-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './export-panel.component.html',
  styleUrl: './export-panel.component.css',
})
export class ExportPanelComponent {
  readonly isOpen  = input<boolean>(false);
  readonly palette = input<Color[]>([]);
  readonly closed  = output<void>();

  readonly tabs: FormatTab[] = [
    { value: 'css',      label: 'CSS'      },
    { value: 'tailwind', label: 'Tailwind' },
    { value: 'json',     label: 'JSON'     },
  ];

  readonly selectedFormat = signal<ExportFormat>('css');
  readonly isCopied       = signal(false);

  readonly exportedCode = computed(() => {
    const colors = this.palette();
    switch (this.selectedFormat()) {
      case 'css':      return this.toCss(colors);
      case 'tailwind': return this.toTailwind(colors);
      case 'json':     return this.toJson(colors);
    }
  });

  selectFormat(format: ExportFormat): void {
    this.selectedFormat.set(format);
    this.isCopied.set(false);
  }

  async copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.exportedCode());
      this.isCopied.set(true);
      setTimeout(() => this.isCopied.set(false), 1500);
    } catch { /* Clipboard API unavailable */ }
  }

  close(): void {
    this.closed.emit();
  }

  // ─────────────────────────────────────────────
  // Format builders
  // ─────────────────────────────────────────────

  private toCss(colors: Color[]): string {
    const vars = colors.map((c, i) => [
      `  --livhex-${i + 1}: ${c.hex};`,
      `  --livhex-${i + 1}-rgb: ${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b};`,
      `  --livhex-${i + 1}-hsl: ${c.hsl.h}deg ${c.hsl.s}% ${c.hsl.l}%;`,
    ].join('\n')).join('\n');
    return `:root {\n${vars}\n}`;
  }

  private toTailwind(colors: Color[]): string {
    const entries = colors
      .map((c, i) => `      'livhex-${i + 1}': '${c.hex}',`)
      .join('\n');
    return [
      '// tailwind.config.js',
      'module.exports = {',
      '  theme: {',
      '    extend: {',
      '      colors: {',
      entries,
      '      },',
      '    },',
      '  },',
      '};',
    ].join('\n');
  }

  private toJson(colors: Color[]): string {
    const data = colors.map(c => ({
      hex:  c.hex,
      rgb:  c.rgb,
      hsl:  c.hsl,
      cmyk: c.cmyk,
    }));
    return JSON.stringify(data, null, 2);
  }
}
