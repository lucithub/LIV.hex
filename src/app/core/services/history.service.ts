import { Injectable, signal } from '@angular/core';
import { Color } from '../models/color.model';

const STORAGE_KEY = 'livhex-history';
const MAX_HISTORY = 50;

@Injectable({ providedIn: 'root' })
export class HistoryService {
  private readonly _history = signal<Color[]>(this.rehydrate());

  /** Public read-only view of the history signal */
  readonly history = this._history.asReadonly();

  /**
   * Prepends a color to the history.
   * Deduplicates by id, and enforces the 50-item cap.
   */
  add(color: Color): void {
    this._history.update(prev => {
      const deduplicated = prev.filter(c => c.id !== color.id);
      const next = [color, ...deduplicated].slice(0, MAX_HISTORY);
      this.persist(next);
      return next;
    });
  }

  /** Removes a single color by id. */
  remove(id: string): void {
    this._history.update(prev => {
      const next = prev.filter(c => c.id !== id);
      this.persist(next);
      return next;
    });
  }

  /** Clears the full history from memory and localStorage. */
  clear(): void {
    this._history.set([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch { /* storage unavailable */ }
  }

  // ─────────────────────────────────────────────
  // Persistence helpers
  // ─────────────────────────────────────────────

  private persist(colors: Color[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(colors));
    } catch { /* storage full or unavailable — fail silently */ }
  }

  private rehydrate(): Color[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Color[]) : [];
    } catch {
      return [];
    }
  }
}
