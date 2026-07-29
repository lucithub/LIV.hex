import {
  Component,
  ChangeDetectionStrategy,
  computed,
  input,
  output,
  inject,
} from '@angular/core';
import { Color } from '../../core/models/color.model';
import { HistoryService } from '../../core/services/history.service';

@Component({
  selector: 'app-history-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './history-panel.component.html',
  styleUrl: './history-panel.component.css',
})
export class HistoryPanelComponent {
  private readonly historyService = inject(HistoryService);

  /** Controlled externally — parent opens/closes this panel */
  readonly isOpen = input<boolean>(false);

  /** Emits the color the user wants to restore */
  readonly colorRestored = output<Color>();

  /** Emits when the user closes the panel */
  readonly closed = output<void>();

  readonly history   = this.historyService.history;
  readonly hasItems  = computed(() => this.history().length > 0);
  readonly itemCount = computed(() => this.history().length);

  restore(color: Color): void {
    this.colorRestored.emit(color);
  }

  remove(id: string, event: Event): void {
    event.stopPropagation();
    this.historyService.remove(id);
  }

  clear(): void {
    this.historyService.clear();
  }

  close(): void {
    this.closed.emit();
  }
}
