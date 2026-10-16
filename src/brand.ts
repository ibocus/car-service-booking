// Swap these three when pitching a specific garage — nothing else in the app
// needs to change.
export const BRAND_NAME = 'Street Auto Care';
export const BRAND_TAGLINE = 'Mobile mechanic, Luton & around';
// Demo number — wa.me links use it, but no message actually sends.
export const WHATSAPP_NUMBER = '447700900123';

export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
