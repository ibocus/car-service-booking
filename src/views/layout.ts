import { BRAND_NAME, BRAND_TAGLINE } from '../brand';

export function renderShell(route: string): string {
  const link = (href: string, label: string) =>
    `<a href="${href}" class="${route === href.replace('#', '') || (route === 'home' && href === '#') ? 'is-active' : ''}">${label}</a>`;

  return `
    <div class="topbar">
      <div class="wrap">
        <a href="#" class="wordmark">${BRAND_NAME} <small>${BRAND_TAGLINE}</small></a>
        <nav>
          ${link('#', 'Home')}
          ${link('#book', 'Book a service')}
          ${link('#admin', 'Job sheet (staff)')}
        </nav>
      </div>
    </div>
    <main></main>
    <footer>
      <div class="wrap">Proof of concept — bookings here stay on this device and nothing is really sent.</div>
    </footer>
  `;
}
