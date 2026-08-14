import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
} from '@angular/core';
import { Color } from '../../core/models/color.model';

@Component({
  selector: 'app-swatch-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './swatch-bar.component.html',
  styleUrl: './swatch-bar.component.css',
})
export class SwatchBarComponent {
  readonly palette = input.required<Color[]>();
  readonly activeColorId = input<string>('');

  /** Emits the selected color when a swatch is clicked */
  readonly colorSelected = output<Color>();

  onSelect(color: Color): void {
    this.colorSelected.emit(color);
  }
}
