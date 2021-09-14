import * as moment from 'moment';

export const addDays = (date: Date, dateToAdd) => {
    return new Date(date.setDate(date.getDate() + dateToAdd));
}

const setMintues = () => {

}

const setHours = () => {

}

// Handle react-datepicker onChangeRaw
export const dateFieldRawHandler = (event, callback) => {
    let m = moment(event.target.value);
    if (m.isValid()) callback(m.toDate());
}