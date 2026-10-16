import { SERVICES, TIME_SLOTS } from '../types';
import type { Job, ServiceId, TimeSlot } from '../types';
import { addJob, makeRef } from '../storage';
import { escapeHtml, formatDate, todayISO } from '../utils';
import { whatsappLink } from '../brand';

interface Draft {
  serviceId: ServiceId | null;
  issue: string;
  vehicleMake: string;
  vehicleModel: string;
  vehiclePlate: string;
  date: string;
  slot: TimeSlot | null;
  customerName: string;
  customerPhone: string;
  notes: string;
}

const TOTAL_STEPS = 4;

export function renderBooking(main: HTMLElement): void {
  const draft: Draft = {
    serviceId: null,
    issue: '',
    vehicleMake: '',
    vehicleModel: '',
    vehiclePlate: '',
    date: todayISO(),
    slot: null,
    customerName: '',
    customerPhone: '',
    notes: '',
  };

  let step = 0;
  let errors: Record<string, string> = {};
  let confirmedRef: string | null = null;

  function serviceLabel(): string {
    return SERVICES.find((s) => s.id === draft.serviceId)?.label ?? '';
  }

  function slotLabel(): string {
    const slot = TIME_SLOTS.find((t) => t.id === draft.slot);
    return slot ? `${slot.label}, ${slot.hours}` : '';
  }

  function validate(currentStep: number): boolean {
    errors = {};
    if (currentStep === 0 && !draft.serviceId) {
      errors.serviceId = "Pick what the job is, so it's on the card.";
    }
    if (currentStep === 1) {
      if (!draft.vehicleMake.trim()) errors.vehicleMake = 'Needed to know what you drive.';
      if (!draft.vehicleModel.trim()) errors.vehicleModel = 'Needed to know what you drive.';
    }
    if (currentStep === 2 && !draft.slot) {
      errors.slot = 'Pick a time window.';
    }
    if (currentStep === 3) {
      if (!draft.customerName.trim()) errors.customerName = "So I know who's booked in.";
      if (!/^[\d+()\s-]{7,}$/.test(draft.customerPhone.trim())) {
        errors.customerPhone = "That doesn't look like a phone number.";
      }
    }
    return Object.keys(errors).length === 0;
  }

  function progressHtml(): string {
    let bars = '';
    for (let i = 0; i < TOTAL_STEPS; i++) {
      bars += `<i class="${i <= step ? 'done' : ''}"></i>`;
    }
    return bars;
  }

  function stepService(): string {
    return `
      <div class="step">
        <h2>What's the job?</h2>
        <p class="step-hint">Pick the closest one — you can add detail after.</p>
        <div class="option-grid">
          ${SERVICES.map(
            (s) => `
            <button type="button" class="option-card${s.id === draft.serviceId ? ' selected' : ''}" data-service="${s.id}">
              <strong>${s.label}</strong>
              <span>${s.hint}</span>
            </button>`
          ).join('')}
        </div>
        ${errors.serviceId ? `<p class="field-error">${errors.serviceId}</p>` : ''}
        <div class="field">
          <label for="issue">Anything specific worth knowing? (optional)</label>
          <textarea id="issue" rows="2" placeholder="e.g. only happens when braking hard">${escapeHtml(draft.issue)}</textarea>
        </div>
      </div>
    `;
  }

  function stepVehicle(): string {
    return `
      <div class="step">
        <h2>Which car is it?</h2>
        <p class="step-hint">Make and model is enough — the plate just helps if you're not sure of the year.</p>
        <div class="field-row">
          <div class="field">
            <label for="vehicleMake">Make</label>
            <input id="vehicleMake" type="text" placeholder="Ford" value="${escapeHtml(draft.vehicleMake)}" />
            ${errors.vehicleMake ? `<p class="field-error">${errors.vehicleMake}</p>` : ''}
          </div>
          <div class="field">
            <label for="vehicleModel">Model</label>
            <input id="vehicleModel" type="text" placeholder="Fiesta" value="${escapeHtml(draft.vehicleModel)}" />
          </div>
        </div>
        <div class="field">
          <label for="vehiclePlate">Registration plate (optional)</label>
          <input id="vehiclePlate" type="text" placeholder="LD19 KPX" value="${escapeHtml(draft.vehiclePlate)}" />
        </div>
      </div>
    `;
  }

  function stepWhen(): string {
    return `
      <div class="step">
        <h2>When suits you?</h2>
        <p class="step-hint">A day and a rough window — you'll get a call or text when it's locked in.</p>
        <div class="field">
          <label for="date">Day</label>
          <input id="date" type="date" min="${todayISO()}" value="${draft.date}" />
        </div>
        <div class="field">
          <label>Time window</label>
          <div class="slot-grid">
            ${TIME_SLOTS.map(
              (t) => `
              <button type="button" class="slot-card${t.id === draft.slot ? ' selected' : ''}" data-slot="${t.id}">
                <strong>${t.label}</strong>
                <span>${t.hours}</span>
              </button>`
            ).join('')}
          </div>
          ${errors.slot ? `<p class="field-error">${errors.slot}</p>` : ''}
        </div>
      </div>
    `;
  }

  function stepContact(): string {
    return `
      <div class="step">
        <h2>Who's it for?</h2>
        <p class="step-hint">So there's a name and number on the card when it lands on WhatsApp.</p>
        <div class="field">
          <label for="customerName">Your name</label>
          <input id="customerName" type="text" placeholder="Dale Whitmore" value="${escapeHtml(draft.customerName)}" />
          ${errors.customerName ? `<p class="field-error">${errors.customerName}</p>` : ''}
        </div>
        <div class="field">
          <label for="customerPhone">Phone number</label>
          <input id="customerPhone" type="tel" placeholder="07700 900111" value="${escapeHtml(draft.customerPhone)}" />
          ${errors.customerPhone ? `<p class="field-error">${errors.customerPhone}</p>` : ''}
        </div>
        <div class="field">
          <label for="notes">Anything else? (optional)</label>
          <textarea id="notes" rows="2" placeholder="e.g. parking is tight on my road">${escapeHtml(draft.notes)}</textarea>
        </div>
      </div>
    `;
  }

  function stepReview(): string {
    return `
      <div class="step">
        <h2>Check the job card</h2>
        <p class="step-hint">This is exactly what gets sent — nothing more to type.</p>
        <div class="ticket review-ticket">
          <div class="ticket-row"><span class="k">Service</span><span class="v">${escapeHtml(serviceLabel())}</span></div>
          ${draft.issue.trim() ? `<div class="ticket-row"><span class="k">Notes on the job</span><span class="v">${escapeHtml(draft.issue)}</span></div>` : ''}
          <div class="ticket-row"><span class="k">Vehicle</span><span class="v">${escapeHtml(draft.vehicleMake)} ${escapeHtml(draft.vehicleModel)}${draft.vehiclePlate.trim() ? ` · ${escapeHtml(draft.vehiclePlate)}` : ''}</span></div>
          <div class="ticket-row"><span class="k">Wants</span><span class="v">${formatDate(draft.date)}, ${escapeHtml(slotLabel())}</span></div>
          <div class="ticket-row"><span class="k">Contact</span><span class="v">${escapeHtml(draft.customerName)} · ${escapeHtml(draft.customerPhone)}</span></div>
          ${draft.notes.trim() ? `<div class="ticket-row"><span class="k">Other notes</span><span class="v">${escapeHtml(draft.notes)}</span></div>` : ''}
        </div>
      </div>
    `;
  }

  function stepConfirm(): string {
    const waMessage = `New booking from the website: ${serviceLabel()} for ${draft.vehicleMake} ${draft.vehicleModel}, wants ${formatDate(draft.date)} ${slotLabel()}. Ref ${confirmedRef}.`;
    return `
      <div class="confirm-screen">
        <h2>Booked in.</h2>
        <p class="step-hint">Your reference is</p>
        <span class="confirm-ref">${confirmedRef}</span>
        <div class="confirm-note">
          In the live version, this is the point where the mechanic gets pinged on WhatsApp with the card above —
          already filled in, so the first message either of you sends is "see you then" instead of "what car is it".
        </div>
        <div class="btn-row" style="margin-top:22px">
          <a href="${whatsappLink(waMessage)}" target="_blank" rel="noopener" class="btn btn-ghost">Preview that WhatsApp →</a>
          <a href="#admin" class="btn btn-ghost">See it land on the job sheet →</a>
          <button type="button" class="btn btn-amber" data-again>Book another (demo)</button>
        </div>
      </div>
    `;
  }

  function paint(): void {
    if (step === 5) {
      main.innerHTML = `<div class="wizard">${stepConfirm()}</div>`;
      bindConfirmHandlers();
      return;
    }

    const labels = ['Job card', 'Vehicle', 'Timing', 'Your details', 'Review'];
    const body =
      step === 0
        ? stepService()
        : step === 1
          ? stepVehicle()
          : step === 2
            ? stepWhen()
            : step === 3
              ? stepContact()
              : stepReview();

    main.innerHTML = `
      <div class="wizard">
        <div class="job-card-label">${labels[step]} — step ${Math.min(step + 1, TOTAL_STEPS)} of ${TOTAL_STEPS}</div>
        <div class="progress">${progressHtml()}</div>
        ${body}
        <div class="wizard-nav">
          <button type="button" class="btn btn-ghost" data-back ${step === 0 ? 'disabled' : ''}>Back</button>
          <button type="button" class="btn btn-amber" data-next>${step === 4 ? 'Confirm booking' : 'Continue'}</button>
        </div>
      </div>
    `;
    bindStepHandlers();
  }

  function bindStepHandlers(): void {
    main.querySelectorAll<HTMLButtonElement>('[data-service]').forEach((btn) => {
      btn.addEventListener('click', () => {
        draft.serviceId = btn.dataset.service as ServiceId;
        paint();
      });
    });
    main.querySelectorAll<HTMLButtonElement>('[data-slot]').forEach((btn) => {
      btn.addEventListener('click', () => {
        draft.slot = btn.dataset.slot as TimeSlot;
        paint();
      });
    });

    const bind = (id: string, key: keyof Draft) => {
      const el = main.querySelector<HTMLInputElement | HTMLTextAreaElement>(`#${id}`);
      el?.addEventListener('input', () => {
        (draft[key] as string) = el.value;
      });
    };
    bind('issue', 'issue');
    bind('vehicleMake', 'vehicleMake');
    bind('vehicleModel', 'vehicleModel');
    bind('vehiclePlate', 'vehiclePlate');
    bind('date', 'date');
    bind('customerName', 'customerName');
    bind('customerPhone', 'customerPhone');
    bind('notes', 'notes');

    main.querySelector('[data-back]')?.addEventListener('click', () => {
      if (step > 0) {
        step -= 1;
        paint();
      }
    });
    main.querySelector('[data-next]')?.addEventListener('click', () => {
      if (!validate(step)) {
        paint();
        return;
      }
      if (step === 4) {
        const job: Job = {
          ref: makeRef(),
          createdAt: new Date().toISOString(),
          status: 'new',
          serviceId: draft.serviceId!,
          issue: draft.issue.trim(),
          vehicleMake: draft.vehicleMake.trim(),
          vehicleModel: draft.vehicleModel.trim(),
          vehiclePlate: draft.vehiclePlate.trim(),
          date: draft.date,
          slot: draft.slot!,
          customerName: draft.customerName.trim(),
          customerPhone: draft.customerPhone.trim(),
          notes: draft.notes.trim(),
        };
        addJob(job);
        confirmedRef = job.ref;
        step = 5;
      } else {
        step += 1;
      }
      paint();
    });
  }

  function bindConfirmHandlers(): void {
    main.querySelector('[data-again]')?.addEventListener('click', () => {
      step = 0;
      confirmedRef = null;
      draft.serviceId = null;
      draft.issue = '';
      draft.vehicleMake = '';
      draft.vehicleModel = '';
      draft.vehiclePlate = '';
      draft.date = todayISO();
      draft.slot = null;
      draft.customerName = '';
      draft.customerPhone = '';
      draft.notes = '';
      paint();
    });
  }

  paint();
}
