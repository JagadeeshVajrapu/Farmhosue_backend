/** Generate a unique human-readable booking ID: VH-YYYYMMDD-XXXX */
export function generateBookingId(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `VH-${y}${m}${d}-${random}`;
}
