


export function formatDate(date: Date | string) {
    const newDate = new Date(date)
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const datePart = newDate.toLocaleDateString('en-GB', options);
    const timePart = newDate.toLocaleTimeString('en-GB', { hour12: true });
    return `${datePart} ${timePart}`;
}


export function formatDateWithoutTime(date: Date | string){
    const newDate = new Date(date)
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const datePart = newDate.toLocaleDateString('en-GB', options);
    return datePart
}

export function formatTime(date: Date, timezone: string) {
    const timePart = date.toLocaleTimeString('en-GB', {
        hour12: true, 
        timeZone: timezone
    });
    return timePart
}

export function convertEpochToLocalTime(epochTime: number, timezone: string){
    const date = new Date(epochTime);
    return new Intl.DateTimeFormat(undefined, {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    }).format(date);    
}