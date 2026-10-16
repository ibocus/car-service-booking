export type ServiceId =
  | 'general-service'
  | 'brakes'
  | 'tyres'
  | 'battery-electrical'
  | 'diagnostics'
  | 'clutch-gearbox'
  | 'other';

export interface Service {
  id: ServiceId;
  label: string;
  hint: string;
}

export type TimeSlot = 'morning' | 'midday' | 'afternoon';

export type JobStatus = 'new' | 'confirmed' | 'done' | 'cancelled';

export interface Job {
  ref: string;
  createdAt: string;
  status: JobStatus;
  serviceId: ServiceId;
  issue: string;
  vehicleMake: string;
  vehicleModel: string;
  vehiclePlate: string;
  date: string; // yyyy-mm-dd
  slot: TimeSlot;
  customerName: string;
  customerPhone: string;
  notes: string;
}

export const SERVICES: Service[] = [
  { id: 'general-service', label: 'Full service', hint: 'Oil, filters, the usual checks' },
  { id: 'brakes', label: 'Brakes', hint: 'Squeaking, grinding, or a check' },
  { id: 'tyres', label: 'Tyres & punctures', hint: 'Replace, repair, or rotate' },
  { id: 'battery-electrical', label: 'Battery & electrical', hint: "Won't start, lights, electrics" },
  { id: 'diagnostics', label: 'Warning light', hint: 'Engine light or a diagnostic read' },
  { id: 'clutch-gearbox', label: 'Clutch & gearbox', hint: 'Slipping, grinding, hard to shift' },
  { id: 'other', label: "Something else", hint: "Tell me what's wrong" },
];

export const TIME_SLOTS: { id: TimeSlot; label: string; hours: string }[] = [
  { id: 'morning', label: 'Morning', hours: '8am – 11am' },
  { id: 'midday', label: 'Midday', hours: '11am – 2pm' },
  { id: 'afternoon', label: 'Afternoon', hours: '2pm – 5pm' },
];

export const STATUS_LABEL: Record<JobStatus, string> = {
  new: 'New',
  confirmed: 'Confirmed',
  done: 'Done',
  cancelled: 'Cancelled',
};
