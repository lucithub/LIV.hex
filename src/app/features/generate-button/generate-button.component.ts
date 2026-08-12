import {
  Component,
  ChangeDetectionStrategy,
  signal,
  output,
} from '@angular/core';
import { HarmonicType } from '../../core/models/color.model';

export type GenerateMode = 'random' | HarmonicType;

interface ModeOption {
  value: GenerateMode;
  label: string;
  shortLabel: string;
}

@Component({
  selector: 'app-generate-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './generate-button.component.html',
  styleUrl: './generate-button.component.css',
})
export class GenerateButtonComponent {
  /** Emits the selected GenerateMode when the user clicks Generate or presses Space */
  readonly generate = output<GenerateMode>();

  readonly modes: ModeOption[] = [
    { value: 'random',         label: 'Random',          shortLabel: 'Random'  },
    { value: 'analogous',      label: 'Analogous',       shortLabel: 'Analog'  },
    { value: 'complementary',  label: 'Complementary',   shortLabel: 'Comp'    },
    { value: 'duotone',        label: 'Duotone',         shortLabel: 'Duo'     },
    { value: 'monochromatic',  label: 'Monochromatic',   shortLabel: 'Mono'    },
    { value: 'triadic',        label: 'Triadic',         shortLabel: 'Triadic' },
  ];

  readonly selectedMode = signal<GenerateMode>('random');
  readonly isAnimating   = signal(false);

  selectMode(mode: GenerateMode): void {
    this.selectedMode.set(mode);
  }

  onGenerate(): void {
    if (this.isAnimating()) return;
    this.isAnimating.set(true);
    setTimeout(() => this.isAnimating.set(false), 400);
    this.generate.emit(this.selectedMode());
  }

  /** Can be called externally (e.g. from KeyboardShortcutService in T-12) */
  triggerGenerate(): void {
    this.onGenerate();
  }
}
