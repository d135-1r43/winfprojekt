import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

// Lichtkegel, der dem Mauszeiger über Karten folgt.
// Setzt --mx/--my auf dem Element, die eigentliche Darstellung macht das CSS.
const SELECTOR = '[data-spotlight], .pagination-nav__link';

if (ExecutionEnvironment.canUseDOM) {
  document.addEventListener(
    'pointermove',
    (event) => {
      const target = (event.target as Element | null)?.closest?.(SELECTOR) as HTMLElement | null;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      target.style.setProperty('--my', `${event.clientY - rect.top}px`);
    },
    {passive: true},
  );
}
