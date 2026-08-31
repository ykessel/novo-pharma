export function formatPrice(cents: number): string {
  return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
}
