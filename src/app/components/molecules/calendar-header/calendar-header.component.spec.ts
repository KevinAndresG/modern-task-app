import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarHeaderComponent } from './calendar-header.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';

describe('CalendarHeaderComponent', () => {
  let component: CalendarHeaderComponent;
  let fixture: ComponentFixture<CalendarHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarHeaderComponent);
    component = fixture.componentInstance;
  });

  describe('rendering', () => {
    it('should render header with flex layout', () => {
      fixture.componentRef.setInput('monthLabel', 'April 2026');
      fixture.componentRef.setInput('collapsed', false);
      fixture.detectChanges();

      const header = fixture.nativeElement.querySelector('div');
      expect(header.classList.contains('flex')).toBe(true);
      expect(header.classList.contains('items-center')).toBe(true);
      expect(header.classList.contains('justify-between')).toBe(true);
    });

    it('should render logo icon div', () => {
      fixture.componentRef.setInput('monthLabel', 'April 2026');
      fixture.componentRef.setInput('collapsed', false);
      fixture.detectChanges();

      const icon = fixture.nativeElement.querySelector('.w-8.h-8');
      expect(icon).toBeTruthy();
    });

    it('should render title text "Deadlines"', () => {
      fixture.componentRef.setInput('monthLabel', 'April 2026');
      fixture.componentRef.setInput('collapsed', false);
      fixture.detectChanges();

      const title = fixture.nativeElement.textContent;
      expect(title).toContain('Deadlines');
    });

    it('should display month label', () => {
      fixture.componentRef.setInput('monthLabel', 'April 2026');
      fixture.componentRef.setInput('collapsed', false);
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain('April 2026');
    });
  });

  describe('collapse toggle button', () => {
    it('should render toggle button', () => {
      fixture.componentRef.setInput('monthLabel', 'April 2026');
      fixture.componentRef.setInput('collapsed', false);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button');
      expect(button).toBeTruthy();
    });

    it('should display Hide text when not collapsed', () => {
      fixture.componentRef.setInput('monthLabel', 'April 2026');
      fixture.componentRef.setInput('collapsed', false);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button');
      expect(button.textContent).toContain('Hide');
    });

    it('should display Show text when collapsed', () => {
      fixture.componentRef.setInput('monthLabel', 'April 2026');
      fixture.componentRef.setInput('collapsed', true);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button');
      expect(button.textContent).toContain('Show');
    });

    it('should have btn-secondary class', () => {
      fixture.componentRef.setInput('monthLabel', 'April 2026');
      fixture.componentRef.setInput('collapsed', false);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button');
      expect(button.classList.contains('btn-secondary')).toBe(true);
    });

    it('should set aria-expanded attribute correctly', () => {
      fixture.componentRef.setInput('monthLabel', 'April 2026');
      fixture.componentRef.setInput('collapsed', false);
      fixture.detectChanges();

      let button = fixture.nativeElement.querySelector('button');
      expect(button.getAttribute('aria-expanded')).toBe('true');

      fixture.componentRef.setInput('collapsed', true);
      fixture.detectChanges();

      button = fixture.nativeElement.querySelector('button');
      expect(button.getAttribute('aria-expanded')).toBe('false');
    });
  });

  describe('toggle icon rotation', () => {
    it('should rotate chevron icon when not collapsed', () => {
      fixture.componentRef.setInput('monthLabel', 'April 2026');
      fixture.componentRef.setInput('collapsed', false);
      fixture.detectChanges();

      const svg = fixture.nativeElement.querySelector('button svg');
      expect(svg.style.transform).toContain('rotate(180deg)');
    });

    it('should not rotate chevron icon when collapsed', () => {
      fixture.componentRef.setInput('monthLabel', 'April 2026');
      fixture.componentRef.setInput('collapsed', true);
      fixture.detectChanges();

      const svg = fixture.nativeElement.querySelector('button svg');
      expect(svg.style.transform).toContain('rotate(0deg)');
    });
  });

  describe('event emission', () => {
    it('should emit toggleCollapse event when button clicked', () => {
      fixture.componentRef.setInput('monthLabel', 'April 2026');
      fixture.componentRef.setInput('collapsed', false);
      fixture.detectChanges();

      const emitSpy = vi.spyOn(component.toggleCollapse, 'emit');

      const button = fixture.nativeElement.querySelector('button');
      button.click();

      expect(emitSpy).toHaveBeenCalled();
    });

    it('should emit event without payload', () => {
      fixture.componentRef.setInput('monthLabel', 'April 2026');
      fixture.componentRef.setInput('collapsed', false);
      fixture.detectChanges();

      let emittedValue: any;
      component.toggleCollapse.subscribe((val: any) => {
        emittedValue = val;
      });

      const button = fixture.nativeElement.querySelector('button');
      button.click();

      expect(emittedValue).toBeUndefined();
    });
  });

  describe('reactivity', () => {
    it('should update month label when input changes', () => {
      fixture.componentRef.setInput('monthLabel', 'April 2026');
      fixture.componentRef.setInput('collapsed', false);
      fixture.detectChanges();

      let text = fixture.nativeElement.textContent;
      expect(text).toContain('April 2026');

      fixture.componentRef.setInput('monthLabel', 'May 2026');
      fixture.detectChanges();

      text = fixture.nativeElement.textContent;
      expect(text).toContain('May 2026');
      expect(text).not.toContain('April 2026');
    });

    it('should update button text when collapsed input changes', () => {
      fixture.componentRef.setInput('monthLabel', 'April 2026');
      fixture.componentRef.setInput('collapsed', false);
      fixture.detectChanges();

      let button = fixture.nativeElement.querySelector('button');
      expect(button.textContent).toContain('Hide');

      fixture.componentRef.setInput('collapsed', true);
      fixture.detectChanges();

      button = fixture.nativeElement.querySelector('button');
      expect(button.textContent).toContain('Show');
    });
  });

  describe('accessibility', () => {
    it('should have aria-controls attribute', () => {
      fixture.componentRef.setInput('monthLabel', 'April 2026');
      fixture.componentRef.setInput('collapsed', false);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button');
      expect(button.getAttribute('aria-controls')).toBe('calendar-body');
    });

    it('button should have type button', () => {
      fixture.componentRef.setInput('monthLabel', 'April 2026');
      fixture.componentRef.setInput('collapsed', false);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button');
      expect(button.getAttribute('type')).toBe('button');
    });
  });

  describe('styling', () => {
    it('should have correct logo styling classes', () => {
      fixture.componentRef.setInput('monthLabel', 'April 2026');
      fixture.componentRef.setInput('collapsed', false);
      fixture.detectChanges();

      const logo = fixture.nativeElement.querySelector('.w-8.h-8');
      expect(logo.classList.contains('rounded-2xl')).toBe(true);
      expect(logo.classList.contains('flex')).toBe(true);
      expect(logo.classList.contains('items-center')).toBe(true);
      expect(logo.classList.contains('justify-center')).toBe(true);
      expect(logo.classList.contains('flex-shrink-0')).toBe(true);
    });

    it('should have correct button styling classes', () => {
      fixture.componentRef.setInput('monthLabel', 'April 2026');
      fixture.componentRef.setInput('collapsed', false);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button');
      expect(button.classList.contains('flex')).toBe(true);
      expect(button.classList.contains('items-center')).toBe(true);
      expect(button.classList.contains('gap-1.5')).toBe(true);
      expect(button.classList.contains('cursor-pointer')).toBe(true);
    });
  });
});
