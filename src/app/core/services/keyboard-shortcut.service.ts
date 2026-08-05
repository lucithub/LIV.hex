import { Injectable, OnDestroy, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

type ShortcutHandler = () => void;

/**
 * Global keyboard shortcut registry.
 * Register handlers by key name (case-insensitive).
 * Handlers are NOT called when the user is typing in an input/textarea/select/contenteditable.
 */
@Injectable({ providedIn: 'root' })
export class KeyboardShortcutService implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly handlers = new Map<string, ShortcutHandler>();
  private readonly boundListener: (e: KeyboardEvent) => void;

  constructor() {
    this.boundListener = this.onKeydown.bind(this);
    this.document.addEventListener('keydown', this.boundListener);
  }

  ngOnDestroy(): void {
    this.document.removeEventListener('keydown', this.boundListener);
  }

  /** Register a handler for a specific key (e.g. ' ', 'h', 'e', 'Escape') */
  register(key: string, handler: ShortcutHandler): void {
    this.handlers.set(key.toLowerCase(), handler);
  }

  /** Unregister a handler by key */
  unregister(key: string): void {
    this.handlers.delete(key.toLowerCase());
  }

  private onKeydown(event: KeyboardEvent): void {
    if (this.isTyping(event)) return;

    const handler = this.handlers.get(event.key.toLowerCase());
    if (handler) {
      event.preventDefault();
      handler();
    }
  }

  private isTyping(event: KeyboardEvent): boolean {
    const target = event.target as HTMLElement;
    if (!target) return false;

    const tag = target.tagName?.toUpperCase();
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
      return true;
    }

    return (
      Boolean(target.isContentEditable) ||
      target.getAttribute?.('contenteditable') === 'true' ||
      target.getAttribute?.('contenteditable') === '' ||
      Boolean(target.closest?.('[contenteditable="true"], [contenteditable=""]'))
    );
  }
}
