import { Component, signal, computed, HostBinding } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  /** Active background color (will be driven by ColorService in T-04+) */
  readonly bgColor = signal('#1a1a1a');
  readonly textColor = signal<'light' | 'dark'>('light');

  @HostBinding('style.--color-bg')
  get hostBg(): string {
    return this.bgColor();
  }

  @HostBinding('style.--color-text-adaptive')
  get hostText(): string {
    return this.textColor() === 'light' ? '#ffffff' : '#111111';
  }
}
