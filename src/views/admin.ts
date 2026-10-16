import { SERVICES, STATUS_LABEL, TIME_SLOTS } from '../types';
import type { Job, JobStatus } from '../types';
import { loadJobs, resetDemoData, updateJobStatus } from '../storage';
import { escapeHtml, formatDate } from '../utils';
import { whatsappLink } from '../brand';

type Filter = 'all' | JobStatus;

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'new', label: 'New' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'done', label: 'Done' },
  { id: 'cancelled', label: 'Cancelled' },
];

export function renderAdmin(main: HTMLElement): void {
  let filter: Filter = 'all';

  function serviceLabel(id: Job['serviceId']): string {
    return SERVICES.find((s) => s.id === id)?.label ?? id;
  }

  function slotLabel(id: Job['slot']): string {
    const slot = TIME_SLOTS.find((t) => t.id === id);
    return slot ? `${slot.label} (${slot.hours})` : id;
  }

  function actionsFor(job: Job): string {
    if (job.status === 'new') {
      return `
        <button type="button" class="btn btn-amber" data-advance="${job.ref}" data-to="confirmed">Confirm</button>
        <button type="button" class="btn btn-ghost" data-advance="${job.ref}" data-to="cancelled">Decline</button>
      `;
    }
    if (job.status === 'confirmed') {
      return `
        <button type="button" class="btn btn-amber" data-advance="${job.ref}" data-to="done">Mark done</button>
        <button type="button" class="btn btn-ghost" data-advance="${job.ref}" data-to="cancelled">Cancel</button>
      `;
    }
    return '';
  }

  function jobCard(job: Job): string {
    const waMessage = `Hi ${job.customerName}, confirming your ${serviceLabel(job.serviceId)} booking (${job.ref}) for ${formatDate(job.date)}, ${slotLabel(job.slot)}.`;
    return `
      <div class="job status-${job.status}">
        <div class="job-main">
          <div class="job-top">
            <span class="job-ref">${job.ref}</span>
            <span class="status-chip status-${job.status}">${STATUS_LABEL[job.status]}</span>
          </div>
          <div class="job-service">${escapeHtml(serviceLabel(job.serviceId))}</div>
          <div class="job-meta">${escapeHtml(job.vehicleMake)} ${escapeHtml(job.vehicleModel)}${job.vehiclePlate ? ` · ${escapeHtml(job.vehiclePlate)}` : ''} — ${formatDate(job.date)}, ${slotLabel(job.slot)}</div>
          <div class="job-customer">
            ${escapeHtml(job.customerName)} ·
            <a href="tel:${escapeHtml(job.customerPhone.replace(/\s/g, ''))}">${escapeHtml(job.customerPhone)}</a> ·
            <a href="${whatsappLink(waMessage)}" target="_blank" rel="noopener">WhatsApp</a>
          </div>
          ${job.issue ? `<div class="job-meta">Issue: ${escapeHtml(job.issue)}</div>` : ''}
          ${job.notes ? `<div class="job-meta">Note: ${escapeHtml(job.notes)}</div>` : ''}
        </div>
        <div class="job-actions">${actionsFor(job)}</div>
      </div>
    `;
  }

  function paint(): void {
    const all = loadJobs().sort((a, b) => (a.date + a.slot).localeCompare(b.date + b.slot));
    const jobs = filter === 'all' ? all : all.filter((j) => j.status === filter);

    main.innerHTML = `
      <div class="admin wrap">
        <div class="admin-head">
          <h1>Job sheet</h1>
          <span class="job-meta">${all.length} job${all.length === 1 ? '' : 's'} on the books</span>
        </div>
        <div class="filter-row">
          ${FILTERS.map(
            (f) => `<button type="button" class="filter-chip${f.id === filter ? ' is-active' : ''}" data-filter="${f.id}">${f.label}</button>`
          ).join('')}
        </div>
        ${
          jobs.length
            ? `<div class="job-list">${jobs.map(jobCard).join('')}</div>`
            : `<div class="empty-state">No jobs in this view yet — book one from the customer side to see it land here.</div>`
        }
        <div class="reset-row">
          Demo data lives in this browser only. <button type="button" data-reset>Reset to sample jobs</button>
        </div>
      </div>
    `;

    main.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach((btn) => {
      btn.addEventListener('click', () => {
        filter = btn.dataset.filter as Filter;
        paint();
      });
    });
    main.querySelectorAll<HTMLButtonElement>('[data-advance]').forEach((btn) => {
      btn.addEventListener('click', () => {
        updateJobStatus(btn.dataset.advance!, btn.dataset.to as JobStatus);
        paint();
      });
    });
    main.querySelector('[data-reset]')?.addEventListener('click', () => {
      resetDemoData();
      paint();
    });
  }

  paint();
}
