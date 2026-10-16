import './style.css';
import { renderShell } from './views/layout';
import { renderLanding } from './views/landing';
import { renderBooking } from './views/booking';
import { renderAdmin } from './views/admin';

function currentRoute(): string {
  return window.location.hash.replace('#', '') || 'home';
}

function render(): void {
  const app = document.querySelector<HTMLDivElement>('#app')!;
  const route = currentRoute();
  app.innerHTML = renderShell(route);
  const main = app.querySelector('main')!;

  if (route === 'book') renderBooking(main);
  else if (route === 'admin') renderAdmin(main);
  else renderLanding(main);

  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', render);
render();
