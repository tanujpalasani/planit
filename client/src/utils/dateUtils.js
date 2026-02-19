export function todayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(dateString, days) {
  const date = new Date(`${dateString}T00:00:00`);
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isPastDate(dateString) {
  if (!dateString) return false;
  return dateString < todayString();
}

export function isWithinNextDays(dateString, days) {
  if (!dateString) return false;
  const today = todayString();
  const futureString = addDays(today, days);
  return dateString >= today && dateString <= futureString;
}

export function sortByDateAsc(a, b) {
  if (!a || !b) return 0;
  return a.localeCompare(b);
}
