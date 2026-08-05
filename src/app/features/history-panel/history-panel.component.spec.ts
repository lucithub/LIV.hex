import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryPanelComponent } from './history-panel.component';
import { HistoryService } from '../../core/services/history.service';
import { Color } from '../../core/models/color.model';

function makeColor(id: string, hex: string): Color {
  return {
    id,
    hex,
    rgb: { r: 0, g: 0, b: 0 },
    hsl: { h: 0, s: 0, l: 0 },
    cmyk: { c: 0, m: 0, y: 0, k: 100 },
  };
}

describe('HistoryPanelComponent', () => {
  let component: HistoryPanelComponent;
  let fixture: ComponentFixture<HistoryPanelComponent>;
  let historyService: HistoryService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [HistoryPanelComponent],
      providers: [HistoryService],
    }).compileComponents();

    historyService = TestBed.inject(HistoryService);
    fixture = TestBed.createComponent(HistoryPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => localStorage.clear());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reflect history state from HistoryService', () => {
    expect(component.hasItems()).toBe(false);
    expect(component.itemCount()).toBe(0);

    historyService.add(makeColor('1', '#FF0000'));
    fixture.detectChanges();

    expect(component.hasItems()).toBe(true);
    expect(component.itemCount()).toBe(1);
  });

  it('should emit colorRestored when restore is called', () => {
    const emitted: Color[] = [];
    component.colorRestored.subscribe(c => emitted.push(c));

    const color = makeColor('1', '#FF0000');
    component.restore(color);

    expect(emitted).toEqual([color]);
  });

  it('should remove item from historyService when remove is called', () => {
    const color = makeColor('1', '#FF0000');
    historyService.add(color);
    expect(component.itemCount()).toBe(1);

    const mockEvent = { stopPropagation: () => {} } as Event;
    component.remove('1', mockEvent);

    expect(component.itemCount()).toBe(0);
  });

  it('should clear history when clear is called', () => {
    historyService.add(makeColor('1', '#FF0000'));
    historyService.add(makeColor('2', '#00FF00'));
    expect(component.itemCount()).toBe(2);

    component.clear();
    expect(component.itemCount()).toBe(0);
  });

  it('should emit closed output when close is called', () => {
    let called = false;
    component.closed.subscribe(() => { called = true; });

    component.close();
    expect(called).toBe(true);
  });
});
