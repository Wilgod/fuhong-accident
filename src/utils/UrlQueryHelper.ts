import { UrlQueryParameterCollection } from '@microsoft/sp-core-library';

export const getQueryParameterNumber = (targetValue: string) => {
    const queryParms = new UrlQueryParameterCollection(window.location.href);
    const value = queryParms.getValue(targetValue);
    if (value) return parseInt(value);
    return null;
}

export const getQueryParameterString = (targetValue: string) => {
    const queryParms = new UrlQueryParameterCollection(window.location.href);
    const value = queryParms.getValue(targetValue);
    return value;
}
