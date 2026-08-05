import { TestBed } from '@angular/core/testing';
import { HistoryService } from './history.service';
import { Color } from '../models/color.model';

/** Minimal Color factory to avoid import of ColorService in tests */
function makeColor(overrides: Partial<Color> = {}): Color {
  return {
    id: crypto.randomUUID(),
    hex: '#FF8800',
    rgb: { r: 255, g: 136, b: 0 },
    hsl: { h: 30, s: 100, l: 50 },
    cmyk: { c: 0, m: 47, y: 100, k: 0 },
    ...overrides,
  };
}

describe('HistoryService', () => {
  let service: HistoryService;

  beforeEach(() => {
    // Clear localStorage before each test to guarantee isolation
    localStorage.clear();

    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoryService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  // ── initial state ────────────────────────────────────────────────────────

  it('should start with an empty history when localStorage is empty', () => {
    expect(service.history().length).toBe(0);
  });

  // ── add ──────────────────────────────────────────────────────────────────

  describe('add', () => {
    it('should prepend a color to the history', () => {
      const c1 = makeColor({ hex: '#111111' });
      const c2 = makeColor({ hex: '#222222' });

      service.add(c1);
      service.add(c2);

      expect(service.history()[0].hex).toBe('#222222');
      expect(service.history()[1].hex).toBe('#111111');
    });

    it('should deduplicate by id (move to front on re-add)', () => {
      const c = makeColor();
      service.add(c);
      service.add(c);

      expect(service.history().length).toBe(1);
    });

    it('should cap history at 50 entries', () => {
      for (let i = 0; i < 55; i++) {
        service.add(makeColor({ hex: `#${i.toString(16).padStart(6, '0')}` }));
      }
      expect(service.history().length).toBe(50);
    });

    it('should persist to localStorage after add', () => {
      const c = makeColor();
      service.add(c);
      const stored = JSON.parse(localStorage.getItem('livhex-history') ?? '[]') as Color[];
      expect(stored.length).toBe(1);
      expect(stored[0].hex).toBe(c.hex);
    });
  });

  // ── remove ───────────────────────────────────────────────────────────────

  describe('remove', () => {
    it('should remove a color by id', () => {
      const c = makeColor();
      service.add(c);
      service.remove(c.id);
      expect(service.history().length).toBe(0);
    });

    it('should be a no-op for an unknown id', () => {
      service.add(makeColor());
      service.remove('non-existent-id');
      expect(service.history().length).toBe(1);
    });

    it('should persist after remove', () => {
      const c = makeColor();
      service.add(c);
      service.remove(c.id);
      const stored = JSON.parse(localStorage.getItem('livhex-history') ?? '[]') as Color[];
      expect(stored.length).toBe(0);
    });
  });

  // ── clear ────────────────────────────────────────────────────────────────

  describe('clear', () => {
    it('should empty the history signal', () => {
      service.add(makeColor());
      service.add(makeColor());
      service.clear();
      expect(service.history().length).toBe(0);
    });

    it('should remove the entry from localStorage', () => {
      service.add(makeColor());
      service.clear();
      expect(localStorage.getItem('livhex-history')).toBeNull();
    });
  });

  // ── rehydration ──────────────────────────────────────────────────────────

  it('should rehydrate from localStorage on init', () => {
    const c = makeColor({ hex: '#AABBCC' });
    localStorage.setItem('livhex-history', JSON.stringify([c]));

    // Re-create the service so the constructor runs the rehydrate() call
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const fresh = TestBed.inject(HistoryService);

    expect(fresh.history().length).toBe(1);
    expect(fresh.history()[0].hex).toBe('#AABBCC');
  });

  it('should start empty when localStorage contains invalid JSON', () => {
    localStorage.setItem('livhex-history', '{not-valid-json}');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const fresh = TestBed.inject(HistoryService);

    expect(fresh.history().length).toBe(0);
  });
});
