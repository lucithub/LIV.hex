import {
  Component,
  ChangeDetectionStrategy,
  computed,
  input,
  signal,
  inject,
} from '@angular/core';
import { Color } from '../../core/models/color.model';
import { ColorService } from '../../core/services/color.service';

interface FormatChip {
  label: string;
  value: string;
}

@Component({
  selector: 'app-color-display',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './color-display.component.html',
  styleUrl: './color-display.component.css',
})
export class ColorDisplayComponent {
  private readonly colorService = inject(ColorService);

  readonly color = input.required<Color>();

  /** 'light' = use white text, 'dark' = use dark text */
  readonly textStyle = computed(() =>
    this.colorService.getAdaptiveTextColor(this.color())
  );

  readonly wcag = computed(() => {
    const bg = this.color();
    const fg =
      this.textStyle() === 'light'
        ? this.colorService.fromHsl({ h: 0, s: 0, l: 100 })
        : this.colorService.fromHsl({ h: 0, s: 0, l: 0 });
    const ratio = this.colorService.getContrastRatio(bg, fg);
    return {
      rating: this.colorService.getWcagRating(ratio),
      ratio,
    };
  });

  readonly formats = computed<FormatChip[]>(() => {
    const c = this.color();
    return [
      { label: 'HEX',  value: c.hex },
      { label: 'RGB',  value: `rgb(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b})` },
      { label: 'HSL',  value: `hsl(${c.hsl.h}, ${c.hsl.s}%, ${c.hsl.l}%)` },
      { label: 'CMYK', value: `cmyk(${c.cmyk.c}%, ${c.cmyk.m}%, ${c.cmyk.y}%, ${c.cmyk.k}%)` },
    ];
  });

  private readonly copiedLabel = signal<string | null>(null);

  isCopied(label: string): boolean {
    return this.copiedLabel() === label;
  }

  async copy(value: string, label: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(value);
      this.copiedLabel.set(label);
      setTimeout(() => this.copiedLabel.set(null), 1500);
    } catch {
      /* Clipboard API unavailable */
    }
  }
}
