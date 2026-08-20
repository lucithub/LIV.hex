import {
  Component,
  ChangeDetectionStrategy,
  output,
  signal,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FeedbackService } from '../../core/services/feedback.service';
import { FeedbackType } from '../../core/models/feedback.model';

type ModalState = 'idle' | 'submitting' | 'success' | 'error';

@Component({
  selector: 'app-feedback-modal',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './feedback-modal.component.html',
  styleUrl: './feedback-modal.component.css',
})
export class FeedbackModalComponent {
  private readonly feedbackService = inject(FeedbackService);

  readonly closed = output<void>();

  readonly state = signal<ModalState>('idle');
  readonly feedbackType = signal<FeedbackType>('general');
  readonly message = signal('');
  readonly email = signal('');

  readonly typeOptions: { value: FeedbackType; label: string; icon: string }[] = [
    { value: 'bug',         label: 'Bug',         icon: '🐛' },
    { value: 'improvement', label: 'Improvement',  icon: '💡' },
    { value: 'general',     label: 'General',      icon: '💬' },
  ];

  get isValid(): boolean {
    return this.message().trim().length > 0;
  }

  selectType(type: FeedbackType): void {
    this.feedbackType.set(type);
  }

  onSubmit(): void {
    if (!this.isValid || this.state() === 'submitting') return;

    this.state.set('submitting');

    this.feedbackService
      .submitFeedback({
        type: this.feedbackType(),
        message: this.message(),
        email: this.email() || undefined,
      })
      .subscribe({
        next: () => this.state.set('success'),
        error: () => this.state.set('error'),
      });
  }

  close(): void {
    this.closed.emit();
  }

  reset(): void {
    this.state.set('idle');
    this.feedbackType.set('general');
    this.message.set('');
    this.email.set('');
  }
}
