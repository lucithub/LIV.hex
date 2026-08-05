import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { vi } from 'vitest';
import { KeyboardShortcutService } from './keyboard-shortcut.service';

/** Dispatch a KeyboardEvent on document */
function pressKey(doc: Document, key: string, target?: HTMLElement): void {
  const event = new KeyboardEvent('keydown', { key, bubbles: true });
  if (target) {
    Object.defineProperty(event, 'target', { value: target });
    target.dispatchEvent(event);
  } else {
    doc.dispatchEvent(event);
  }
}

describe('KeyboardShortcutService', () => {
  let service: KeyboardShortcutService;
  let doc: Document;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeyboardShortcutService);
    doc = TestBed.inject(DOCUMENT);
  });

  afterEach(() => {
    service.ngOnDestroy();
  });

  // ── register / basic dispatch ─────────────────────────────────────────────

  it('should call a registered handler when the key is pressed', () => {
    const handler = vi.fn();
    service.register('h', handler);

    pressKey(doc, 'h');

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should be case-insensitive for key registration', () => {
    const handler = vi.fn();
    service.register('H', handler);   // registered as uppercase

    pressKey(doc, 'h');              // dispatched as lowercase

    expect(handler).toHaveBeenCalled();
  });

  it('should call the Space handler when Space is pressed', () => {
    const handler = vi.fn();
    service.register(' ', handler);

    pressKey(doc, ' ');

    expect(handler).toHaveBeenCalled();
  });

  it('should call the Escape handler when Escape is pressed', () => {
    const handler = vi.fn();
    service.register('Escape', handler);

    pressKey(doc, 'Escape');

    expect(handler).toHaveBeenCalled();
  });

  it('should NOT call a handler for an unregistered key', () => {
    const handler = vi.fn();
    service.register('h', handler);

    pressKey(doc, 'z');

    expect(handler).not.toHaveBeenCalled();
  });

  // ── unregister ────────────────────────────────────────────────────────────

  it('should stop calling a handler after unregister', () => {
    const handler = vi.fn();
    service.register('e', handler);
    service.unregister('e');

    pressKey(doc, 'e');

    expect(handler).not.toHaveBeenCalled();
  });

  // ── isTyping guard ────────────────────────────────────────────────────────

  it('should NOT call a handler when the target is an INPUT element', () => {
    const handler = vi.fn();
    service.register('h', handler);

    const input = doc.createElement('input');
    doc.body.appendChild(input);

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'h', bubbles: true }));

    expect(handler).not.toHaveBeenCalled();
    doc.body.removeChild(input);
  });

  it('should NOT call a handler when the target is a TEXTAREA element', () => {
    const handler = vi.fn();
    service.register('h', handler);

    const textarea = doc.createElement('textarea');
    doc.body.appendChild(textarea);

    textarea.dispatchEvent(new KeyboardEvent('keydown', { key: 'h', bubbles: true }));

    expect(handler).not.toHaveBeenCalled();
    doc.body.removeChild(textarea);
  });

  it('should NOT call a handler when the target is a SELECT element', () => {
    const handler = vi.fn();
    service.register('h', handler);

    const select = doc.createElement('select');
    doc.body.appendChild(select);

    select.dispatchEvent(new KeyboardEvent('keydown', { key: 'h', bubbles: true }));

    expect(handler).not.toHaveBeenCalled();
    doc.body.removeChild(select);
  });

  it('should NOT call a handler when the target is a contenteditable element', () => {
    const handler = vi.fn();
    service.register('h', handler);

    const div = doc.createElement('div');
    div.contentEditable = 'true';
    div.setAttribute('contenteditable', 'true');
    doc.body.appendChild(div);

    div.dispatchEvent(new KeyboardEvent('keydown', { key: 'h', bubbles: true }));

    expect(handler).not.toHaveBeenCalled();
    doc.body.removeChild(div);
  });

  // ── cleanup ────────────────────────────────────────────────────────────────

  it('should remove the global listener on ngOnDestroy', () => {
    const handler = vi.fn();
    service.register('h', handler);

    service.ngOnDestroy();

    pressKey(doc, 'h');

    expect(handler).not.toHaveBeenCalled();
  });
});
