import type { Job } from './types';

const STORAGE_KEY = 'fmz:jobs';

function todayPlus(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function seedJobs(): Job[] {
  return [
    {
      ref: 'FMZ-7F2K',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
      status: 'new',
      serviceId: 'brakes',
      issue: 'Grinding noise braking at low speed',
      vehicleMake: 'Ford',
      vehicleModel: 'Fiesta',
      vehiclePlate: 'LD19 KPX',
      date: todayPlus(1),
      slot: 'morning',
      customerName: 'Dale Whitmore',
      customerPhone: '+44 7700 900111',
      notes: '',
    },
    {
      ref: 'FMZ-3M8Q',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 44).toISOString(),
      status: 'confirmed',
      serviceId: 'general-service',
      issue: '',
      vehicleMake: 'Vauxhall',
      vehicleModel: 'Corsa',
      vehiclePlate: 'LR68 CVN',
      date: todayPlus(2),
      slot: 'afternoon',
      customerName: 'Priya Shah',
      customerPhone: '+44 7700 900222',
      notes: 'Parking is tight on her road, call when 5 mins away.',
    },
    {
      ref: 'FMZ-9D4L',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 70).toISOString(),
      status: 'done',
      serviceId: 'tyres',
      issue: 'Slow puncture, front left',
      vehicleMake: 'Toyota',
      vehicleModel: 'Yaris',
      vehiclePlate: 'KY17 DFG',
      date: todayPlus(-1),
      slot: 'midday',
      customerName: 'Marcus Oduya',
      customerPhone: '+44 7700 900333',
      notes: '',
    },
    {
      ref: 'FMZ-1X6B',
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      status: 'new',
      serviceId: 'diagnostics',
      issue: 'Engine light came on this morning, car still drives fine',
      vehicleMake: 'Volkswagen',
      vehicleModel: 'Golf',
      vehiclePlate: 'MA21 TRL',
      date: todayPlus(3),
      slot: 'morning',
      customerName: 'Elena Novak',
      customerPhone: '+44 7700 900444',
      notes: '',
    },
  ];
}

export function loadJobs(): Job[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seeded = seedJobs();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
  try {
    return JSON.parse(raw) as Job[];
  } catch {
    return seedJobs();
  }
}

export function saveJobs(jobs: Job[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
}

export function addJob(job: Job): void {
  const jobs = loadJobs();
  jobs.unshift(job);
  saveJobs(jobs);
}

export function updateJobStatus(ref: string, status: Job['status']): void {
  const jobs = loadJobs().map((j) => (j.ref === ref ? { ...j, status } : j));
  saveJobs(jobs);
}

export function resetDemoData(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function makeRef(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 4; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `FMZ-${s}`;
}
