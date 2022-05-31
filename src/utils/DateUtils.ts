import * as moment from 'moment';

export const addDays = (date: Date, dateToAdd) => {
    return new Date(date.setDate(date.getDate() + dateToAdd));
}

// Handle react-datepicker onChangeRaw
export const dateFieldRawHandler = (event, callback) => {
    let m = moment(event.target.value);
    if (m.isValid()) callback(m.toDate());
}

export function addBusinessDays(startDate: Date, numberOfDays: number) {
    startDate = new Date(startDate.getTime());
    let day = startDate.getDay();
    startDate.setDate(startDate.getDate() + numberOfDays + (day === 6 ? 2 : +!day) + (Math.floor((numberOfDays - 1 + (day % 6 || 1)) / 5) * 2));
    return startDate;
}

export function addMonths(date: Date, numberOfMonth: number) {
    return new Date(new Date(date.getTime()).setMonth(new Date(date.getTime()).getMonth() + numberOfMonth));
}

export function getfinancialYears(startDate: Date, endDate: Date) {
    let result: string[] = [];
    const startYear = startDate.getFullYear()
    const endYear = endDate.getFullYear();
    const distance = endYear - startYear;

    for (let i = 0; i > distance; i++) {
        const start = new Date(startDate.toISOString()).getFullYear() + i;
        const end = new Date(endDate.toISOString() + i + 1);
        const fYear = `${start}-${end}`;
        result.push(fYear);
    }

    return result;
}

export const getDateFinancialYear = (date: Date) => {
    const today = new Date(date.toISOString());
    let result = "";
    if ((today.getMonth() + 1) <= 3) { // New Financial Year start on 1st April
        const start = today.getFullYear() - 1;
        const end = today.getFullYear();
        result = `${start}-${end}`
    } else {
        const start = today.getFullYear();
        const end = today.getFullYear() + 1;
        result = `${start}-${end}`
    }
    return result;
}

export const getDateYear = (date: Date) => {
    const today = new Date(date.toISOString());
    let result = "";
    const start = today.getFullYear() - 1;
    const end = today.getFullYear();
    result = `${start}-${end}`
    return result;
}