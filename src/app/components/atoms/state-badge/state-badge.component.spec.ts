import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StateBadgeComponent } from './state-badge.component';

describe('StateBadgeComponent', () => {
  let component: StateBadgeComponent;
  let fixture: ComponentFixture<StateBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StateBadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StateBadgeComponent);
    component = fixture.componentInstance;
  });

  describe('CSS class resolution', () => {
    it('should apply badge-new class for new state', () => {
      fixture.componentRef.setInput('state', 'new');
      fixture.detectChanges();

      const span = fixture.nativeElement.querySelector('span');
      expect(span.classList.contains('badge-new')).toBe(true);
      expect(span.classList.contains('badge')).toBe(true);
    });

    it('should apply badge-active class for active state', () => {
      fixture.componentRef.setInput('state', 'active');
      fixture.detectChanges();

      const span = fixture.nativeElement.querySelector('span');
      expect(span.classList.contains('badge-active')).toBe(true);
    });

    it('should apply badge-resolved class for resolved state', () => {
      fixture.componentRef.setInput('state', 'resolved');
      fixture.detectChanges();

      const span = fixture.nativeElement.querySelector('span');
      expect(span.classList.contains('badge-resolved')).toBe(true);
    });

    it('should apply badge-closed class for closed state', () => {
      fixture.componentRef.setInput('state', 'closed');
      fixture.detectChanges();

      const span = fixture.nativeElement.querySelector('span');
      expect(span.classList.contains('badge-closed')).toBe(true);
    });

    it('should default to badge-new for unknown state', () => {
      fixture.componentRef.setInput('state', 'invalid');
      fixture.detectChanges();

      const span = fixture.nativeElement.querySelector('span');
      expect(span.classList.contains('badge-new')).toBe(true);
    });
  });

  describe('label capitalization', () => {
    it('should capitalize new to New', () => {
      fixture.componentRef.setInput('state', 'new');
      fixture.detectChanges();

      const span = fixture.nativeElement.querySelector('span');
      expect(span.textContent).toBe('New');
    });

    it('should capitalize active to Active', () => {
      fixture.componentRef.setInput('state', 'active');
      fixture.detectChanges();

      const span = fixture.nativeElement.querySelector('span');
      expect(span.textContent).toBe('Active');
    });

    it('should capitalize resolved to Resolved', () => {
      fixture.componentRef.setInput('state', 'resolved');
      fixture.detectChanges();

      const span = fixture.nativeElement.querySelector('span');
      expect(span.textContent).toBe('Resolved');
    });

    it('should capitalize closed to Closed', () => {
      fixture.componentRef.setInput('state', 'closed');
      fixture.detectChanges();

      const span = fixture.nativeElement.querySelector('span');
      expect(span.textContent).toBe('Closed');
    });
  });

  describe('DOM structure', () => {
    it('should render span with badge base class', () => {
      fixture.componentRef.setInput('state', 'new');
      fixture.detectChanges();

      const span = fixture.nativeElement.querySelector('span');
      expect(span).toBeTruthy();
      expect(span.classList.contains('badge')).toBe(true);
    });

    it('should render single span element', () => {
      fixture.componentRef.setInput('state', 'new');
      fixture.detectChanges();

      const spans = fixture.nativeElement.querySelectorAll('span');
      expect(spans.length).toBe(1);
    });
  });

  describe('reactivity', () => {
    it('should update badge class when state changes', () => {
      fixture.componentRef.setInput('state', 'new');
      fixture.detectChanges();

      let span = fixture.nativeElement.querySelector('span');
      expect(span.classList.contains('badge-new')).toBe(true);

      fixture.componentRef.setInput('state', 'active');
      fixture.detectChanges();

      span = fixture.nativeElement.querySelector('span');
      expect(span.classList.contains('badge-active')).toBe(true);
      expect(span.classList.contains('badge-new')).toBe(false);
    });

    it('should update label when state changes', () => {
      fixture.componentRef.setInput('state', 'new');
      fixture.detectChanges();

      let span = fixture.nativeElement.querySelector('span');
      expect(span.textContent).toBe('New');

      fixture.componentRef.setInput('state', 'resolved');
      fixture.detectChanges();

      span = fixture.nativeElement.querySelector('span');
      expect(span.textContent).toBe('Resolved');
    });
  });

  describe('edge cases', () => {
    it('should handle empty string state', () => {
      fixture.componentRef.setInput('state', '');
      fixture.detectChanges();

      const span = fixture.nativeElement.querySelector('span');
      expect(span.classList.contains('badge-new')).toBe(true);
    });

    it('should handle whitespace in state', () => {
      fixture.componentRef.setInput('state', '  active  ');
      fixture.detectChanges();

      const span = fixture.nativeElement.querySelector('span');
      expect(span.classList.contains('badge-new')).toBe(true);
    });

    it('should handle uppercase state (case-sensitive)', () => {
      fixture.componentRef.setInput('state', 'ACTIVE');
      fixture.detectChanges();

      const span = fixture.nativeElement.querySelector('span');
      expect(span.classList.contains('badge-new')).toBe(true);
    });
  });
});
