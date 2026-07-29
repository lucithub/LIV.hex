import {
  Component,
  ChangeDetectionStrategy,
  computed,
  input,
  output,
} from '@angular/core';
import { Color } from '../../core/models/color.model';

@Component({
  selector: 'app-palette-display',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './palette-display.component.html',
  styleUrl: './palette-display.component.css',
})
export class PaletteDisplayComponent {
  /** Full harmonic palette to display */
  readonly palette = input<Color[]>([]);

  /** Id of the currently active (main) color */
  readonly activeColorId = input<string | null>(null);

  /** Emits the color the user clicked on */
  readonly colorSelected = output<Color>();

  /** Only render when there are 2 or more colors (harmonic mode) */
  readonly hasMultiple = computed(() => this.palette().length > 1);

  isActive(color: Color): boolean {
    return this.activeColorId() === color.id;
  }

  select(color: Color): void {
    this.colorSelected.emit(color);
  }
}
