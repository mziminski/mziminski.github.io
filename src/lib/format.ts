export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(date);
}

export function externalLabel(label: string) {
  return `${label} (opens in a new tab)`;
}
