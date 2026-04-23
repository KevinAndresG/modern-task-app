import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarLegendComponent } from './calendar-legend.component';
import { StateDotComponent } from '../../atoms/state-dot/state-dot.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('CalendarLegendComponent', () => {
  let component: CalendarLegendComponent;
  let fixture: ComponentFixture<CalendarLegendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarLegendComponent, StateDotComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('rendering', () => {
    it('should render legend container with correct classes', () => {
      const container = fixture.nativeElement.querySelector('div');
      expect(container.classList.contains('flex')).toBe(true);
      expect(container.classList.contains('flex-wrap')).toBe(true);
      expect(container.classList.contains('items-center')).toBe(true);
      expect(container.classList.contains('gap-x-5')).toBe(true);
    });

    it('should render exactly 4 legend items (new, active, resolved, closed)', () => {
      const items = fixture.nativeElement.querySelectorAll('.flex.items-center.gap-1\\.5');
      expect(items.length).toBe(4);
    });

    it('should render state-dot component for each item', () => {
      const dots = fixture.debugElement.queryAll(By.directive(StateDotComponent));
      expect(dots.length).toBe(4);
    });

    it('should render label text for each item', () => {
      const labels = fixture.nativeElement.querySelectorAll('span.text-xs');
      expect(labels.length).toBeGreaterThanOrEqual(4);

      const labelTexts = Array.from(labels)
        .slice(0, 4)
        .map((el: any) => el.textContent.trim());
      expect(labelTexts).toEqual(['New', 'Active', 'Resolved', 'Closed']);
    });
  });

  describe('state-dot integration', () => {
    it('should pass correct state to each state-dot', () => {
      const dots = fixture.debugElement.queryAll(By.directive(StateDotComponent));
      const states = dots.map(dot => dot.componentInstance.state());

      expect(states).toEqual(['new', 'active', 'resolved', 'closed']);
    });

    it('should set size to md for all dots', () => {
      const dots = fixture.debugElement.queryAll(By.directive(StateDotComponent));
      dots.forEach(dot => {
        expect(dot.componentInstance.size()).toBe('md');
      });
    });

    it('should render dots with correct colors', () => {
      const dots = fixture.debugElement.queryAll(By.directive(StateDotComponent));
      const expectedRgb = ['rgb(124, 109, 250)', 'rgb(251, 191, 36)', 'rgb(52, 211, 153)', 'rgb(148, 163, 184)'];

      dots.forEach((dot, index) => {
        const span = dot.nativeElement.querySelector('span');
        expect(span.style.background.toLowerCase()).toContain(expectedRgb[index]);
      });
    });
  });

  describe('styling', () => {
    it('should have border-top style attribute', () => {
      const container = fixture.nativeElement.querySelector('div');
      const borderStyle = container.getAttribute('style');
      expect(borderStyle).toContain('border-top');
    });

    it('should have margin-top and padding-top', () => {
      const container = fixture.nativeElement.querySelector('div');
      expect(container.classList.contains('mt-5')).toBe(true);
      expect(container.classList.contains('pt-4')).toBe(true);
    });

    it('should label text have muted color', () => {
      const labels = fixture.nativeElement.querySelectorAll('span.text-xs');
      labels.forEach((label: any) => {
        expect(label.style.color).toBe('var(--clay-muted)');
      });
    });
  });

  describe('accessibility', () => {
    it('should have semantic structure', () => {
      const container = fixture.nativeElement.querySelector('div');
      expect(container).toBeTruthy();
    });

    it('should display labels in proper order', () => {
      const labels = fixture.nativeElement.querySelectorAll('span.text-xs.font-semibold');
      const texts = Array.from(labels).map((el: any) => el.textContent.trim());

      expect(texts[0]).toBe('New');
      expect(texts[1]).toBe('Active');
      expect(texts[2]).toBe('Resolved');
      expect(texts[3]).toBe('Closed');
    });
  });

  describe('component items', () => {
    it('should expose items constant', () => {
      expect(component.items).toBeDefined();
      expect(component.items.length).toBe(4);
    });

    it('should have correct item structure', () => {
      const firstItem = component.items[0];
      expect(firstItem.label).toBe('New');
      expect(firstItem.state).toBe('new');
    });

    it('should maintain item order', () => {
      const expectedOrder = ['New', 'Active', 'Resolved', 'Closed'];
      const actualOrder = component.items.map(item => item.label);
      expect(actualOrder).toEqual(expectedOrder);
    });
  });
});
