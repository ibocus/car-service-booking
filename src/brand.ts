// Swap these three when pitching a specific garage — nothing else in the app
// needs to change.
export const BRAND_NAME = 'FMZ';
export const BRAND_TAGLINE = 'Car service & repairs';
// Demo number — wa.me links use it, but no message actually sends.
export const WHATSAPP_NUMBER = '447700900123';

export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
