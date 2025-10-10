


export function formatDate(date: Date) {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const datePart = date.toLocaleDateString('en-GB', options);
    const timePart = date.toLocaleTimeString('en-GB', { hour12: true });
    return `${datePart} ${timePart}`;
}
