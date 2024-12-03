import dayjs from 'dayjs'

export const dateFormatTemplate = 'DD/MM/YYYY';

export let timestampToString = (timestamp) => {
    const date = dayjs.unix(timestamp/1000);
    return date.format(dateFormatTemplate);
}

export let timestampToDate = (timestamp) => {
    console.log(timestamp)
    if (timestamp == null || timestamp==="" || isNaN(timestamp)) {
        return "";
    }
    let dateInString = timestampToString(timestamp)
    return dayjs(dateInString, dateFormatTemplate)
}

export let templateToTimestamp = (date) => {
    return dayjs(date).unix()*1000;
}

export let isDatePreviousToToday = (date) => {
    return dayjs().isAfter(date);
}