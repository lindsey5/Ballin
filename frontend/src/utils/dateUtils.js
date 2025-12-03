export const formatDate = (date) => {
  if (!date) return '';

  const d = typeof date === 'string' ? new Date(date) : date;

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');

  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Convert 0 to 12 for 12 AM

  const formattedHours = String(hours).padStart(2, '0');

  return `${year}-${month}-${day} ${formattedHours}:${minutes} ${ampm}`;
};

export const formatDateYYYYMMDD = (date) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d)) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export function get_date_range(filter) {
  const now = new Date();
  let startDate = null;
  let endDate = null;

  switch (filter) {
    case "Today":
      startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(now);
      endDate.setHours(23, 59, 59, 999);
      break;

    case "This Week":
      // Today (end)
      endDate = new Date(now);
      endDate.setHours(23, 59, 59, 999);

      // Last 6 days (start)
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);
      break;

    case "This Month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );
      break;

    case "This Year":
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(
        now.getFullYear(),
        11,
        31,
        23,
        59,
        59,
        999
      );
      break;

    case "All":
      startDate = null;
      endDate = null;
      break;

    default:
      startDate = null;
      endDate = null;
  }

  return {
    startDate: startDate ? startDate.toISOString() : null,
    endDate: endDate ? endDate.toISOString() : null,
  };
}
