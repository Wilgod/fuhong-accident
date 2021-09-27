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
    return new Date(new Date(date.getTime()).setMonth(new Date(date.getTime()).getMonth() + 1));
}