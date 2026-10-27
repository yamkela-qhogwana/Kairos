// Formats a sale's end date into a short "time left" label for a badge —
// e.g. "2d left", "5h left", "12m left". Returns null once the sale has
// actually ended (or there's no end date), so callers can just hide the
// badge rather than show something like "-3h left".
export function formatTimeLeft(endsAt: string | null): string | null {
  if (!endsAt) return null;

  const msLeft = new Date(endsAt).getTime() - Date.now();
  if (msLeft <= 0) return null;

  const minutes = Math.floor(msLeft / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d left`;
  if (hours > 0) return `${hours}h left`;
  return `${Math.max(minutes, 1)}m left`;
}
