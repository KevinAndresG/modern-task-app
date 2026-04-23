import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StateDotComponent } from './state-dot.component';

describe('StateDotComponent', () => {
  let component: StateDotComponent;
  let fixture: ComponentFixture<StateDotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StateDotComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StateDotComponent);
    component = fixture.componentInstance;
  });

  describe('color computation', () => {
    it('should render new state with correct color', () => {
      fixture.componentRef.setInput('state', 'new');
      fixture.detectChanges();

      const span = fixture.nativeElement.querySelector('span');
      expect(span.style.background.toLowerCase()).toContain('rgb(124, 109, 250)');
    });

    it('should render active state with yellow', () => {
      fixture.componentRef.setInput('state', 'active');
      fixture.detectChanges();

      const span = fixture.nativeElement.querySelector('span');
      expect(span.style.background.toLowerCase()).toContain('rgb(251, 191, 36)');
    });

    it('should render resolved state with green', () => {
      fixture.componentRef.setInput('state', 'resolved');
      fixture.detectChanges();

      const span = fixture.nativeElement.querySelector('span');
      expect(span.style.background.toLowerCase()).toContain('rgb(52, 211, 153)');
    });

    it('should render closed state with gray', () => {
      fixture.componentRef.setInput('state', 'closed');
      fixture.detectChanges();

      const span = fixture.nativeElement.querySelector('span');
      expect(span.style.background.toLowerCase()).toContain('rgb(148, 163, 184)');
    });

    it('should default to new color for unknown state', () => {
      fixture.componentRef.setInput('state', 'unknown');
      fixture.detectChanges();

      const span = fixture.nativeElement.querySelector('span');
      expect(span.style.background.toLowerCase()).toContain('rgb(124, 109, 250)');
    });
  });

  describe('size computation', () => {
    it('should render xs size as 5px', () => {
      fixture.componentRef.setInput('state', 'new');
      fixture.componentRef.setInput('size', 'xs');
      fixture.detectChanges();

      const span = fixture.nativeElement.querySelector('span');
      expect(span.style.width).toBe('5px');
      expect(span.style.height).toBe('5px');
    });

    it('should render sm size as 6px (default)', () => {
      fixture.componentRef.setInput('state', 'new');
      fixture.detectChanges();

      const span = fixture.nativeElement.querySelector('span');
      expect(span.style.width).toBe('6px');
      expect(span.style.height).toBe('6px');
    });

    it('should render md size as 7px', () => {
      fixture.componentRef.setInput('state', 'new');
      fixture.componentRef.setInput('size', 'md');
      fixture.detectChanges();

      const span = fixture.nativeElement.querySelector('span');
      expect(span.style.width).toBe('7px');
      expect(span.style.height).toBe('7px');
    });
  });

  describe('glow shadow', () => {
    it('should compute glow shadow from color', () => {
      fixture.componentRef.setInput('state', 'active');
      fixture.detectChanges();

      const span = fixture.nativeElement.querySelector('span');
      expect(span.style.boxShadow).toContain('0 0 6px #FBBF24');
    });

    it('should append 80 (hex) opacity to glow color', () => {
      fixture.componentRef.setInput('state', 'resolved');
      fixture.detectChanges();

      const span = fixture.nativeElement.querySelector('span');
      // Glow format: "0 0 6px [color]80"
      expect(span.style.boxShadow).toContain('0 0 6px #34D39980');
    });
  });

  describe('DOM structure', () => {
    it('should render single span element', () => {
      fixture.componentRef.setInput('state', 'new');
      fixture.detectChanges();

      const spans = fixture.nativeElement.querySelectorAll('span');
      expect(spans.length).toBe(1);
    });

    it('should have rounded-full and flex-shrink-0 classes', () => {
      fixture.componentRef.setInput('state', 'new');
      fixture.detectChanges();

      const span = fixture.nativeElement.querySelector('span');
      expect(span.classList.contains('rounded-full')).toBe(true);
      expect(span.classList.contains('flex-shrink-0')).toBe(true);
    });

    it('should have block display class', () => {
      fixture.componentRef.setInput('state', 'new');
      fixture.detectChanges();

      const span = fixture.nativeElement.querySelector('span');
      expect(span.classList.contains('block')).toBe(true);
    });
  });

  describe('reactivity', () => {
    it('should update color when state input changes', () => {
      fixture.componentRef.setInput('state', 'new');
      fixture.detectChanges();

      let span = fixture.nativeElement.querySelector('span');
      expect(span.style.background.toLowerCase()).toContain('rgb(124, 109, 250)');

      fixture.componentRef.setInput('state', 'active');
      fixture.detectChanges();

      span = fixture.nativeElement.querySelector('span');
      expect(span.style.background.toLowerCase()).toContain('rgb(251, 191, 36)');
    });

    it('should update size when size input changes', () => {
      fixture.componentRef.setInput('state', 'new');
      fixture.componentRef.setInput('size', 'xs');
      fixture.detectChanges();

      let span = fixture.nativeElement.querySelector('span');
      expect(span.style.width).toBe('5px');

      fixture.componentRef.setInput('size', 'md');
      fixture.detectChanges();

      span = fixture.nativeElement.querySelector('span');
      expect(span.style.width).toBe('7px');
    });
  });
});
