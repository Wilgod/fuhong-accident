import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions, HttpClient, MSGraphClient, AadHttpClient, HttpClientResponse } from '@microsoft/sp-http';
import { WebPartContext } from '@microsoft/sp-webpart-base';

// form 19
const SERVICE_USER_ACCIDENT = "https://prod-26.southeastasia.logic.azure.com:443/workflows/2b5b78b3a41d4e2e8344861a660b75f6/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=0dZlZlIyRLgUivA0CjR3WmEDZwYHl4OWS8xtSJMKvwU";
// form 22
const OUTSIDER_ACCIDENT = "https://prod-25.southeastasia.logic.azure.com:443/workflows/0682e9e95a7e4ae6bcaa41bdf8685cb2/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=N6HKhU9dIoy2296cMNgKrT1C_MO8V7Ypi-QEthikYpg";
// form 24
const SPEICAL_INCIDENT_REPORT_LICENSE = "https://prod-22.southeastasia.logic.azure.com:443/workflows/b7f9ae2e910f4f928b6d6df3f9635110/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=06CWh3aLcZ6W4Mr459u1un2zk6ekx3XLVyFWIfcEZ2k";
// form 25
const SPEICAL_INCIDENT_REPORT_ALLOWANCE = "https://prod-30.southeastasia.logic.azure.com:443/workflows/8e7d363bd409461faaee8c5c2a85200f/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=LBlIfgLzoFOF8bTOHP23qs4MhKTKDktJ2jk2Q3N_q4U";
// form 23 
const OTHER_INCIDENT_REPORT = "https://prod-29.southeastasia.logic.azure.com:443/workflows/b63eae455f434a2c83dd0371ea4aa083/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=BuDseSvFRuKDCijnsGD3xv97UHx77dtkVeYeKLfRNkE";

//Form 19
export async function notifyServiceUserAccident(context: WebPartContext, formId: number) {
    try {
        const CONFIG: ISPHttpClientOptions = {
            headers: {
                "Accept": "application/json;odata=verbose",
                "Content-Type": "application/json;odata=verbose",
                "OData-Version": "" //Really important to specify
            }, body: JSON.stringify({
                __metadata: { type: 'SP.Data.TestListItem' },
                "id": formId
            })
        };
        await context.httpClient.post(SERVICE_USER_ACCIDENT, SPHttpClient.configurations.v1, CONFIG);
    } catch (err) {
        console.error(err);
        throw new Error("notifyServiceUserAccident error");
    }
}
// form 22
export async function notifyOutsiderAccident(context: WebPartContext, formId: number) {
    try {
        const CONFIG: ISPHttpClientOptions = {
            headers: {
                "Accept": "application/json;odata=verbose",
                "Content-Type": "application/json;odata=verbose",
                "OData-Version": "" //Really important to specify
            }, body: JSON.stringify({
                __metadata: { type: 'SP.Data.TestListItem' },
                "id": formId
            })
        };
        await context.httpClient.post(OUTSIDER_ACCIDENT, SPHttpClient.configurations.v1, CONFIG);
    } catch (err) {
        console.error(err);
        throw new Error("notifyOutsiderAccident error");
    }
}

// form 24
export async function notifySpecialIncidentLicense(context: WebPartContext, formId: number) {
    try {
        const CONFIG: ISPHttpClientOptions = {
            headers: {
                "Accept": "application/json;odata=verbose",
                "Content-Type": "application/json;odata=verbose",
                "OData-Version": "" //Really important to specify
            }, body: JSON.stringify({
                __metadata: { type: 'SP.Data.TestListItem' },
                "id": formId
            })
        };
        await context.httpClient.post(SPEICAL_INCIDENT_REPORT_LICENSE, SPHttpClient.configurations.v1, CONFIG);
    } catch (err) {
        console.error(err);
        throw new Error("notifySpecialIncidentLicense error");
    }
}
// form 25
export async function notifySpecialIncidentAllowance(context: WebPartContext, formId: number) {
    try {
        const CONFIG: ISPHttpClientOptions = {
            headers: {
                "Accept": "application/json;odata=verbose",
                "Content-Type": "application/json;odata=verbose",
                "OData-Version": "" //Really important to specify
            }, body: JSON.stringify({
                __metadata: { type: 'SP.Data.TestListItem' },
                "id": formId
            })
        };
        await context.httpClient.post(SPEICAL_INCIDENT_REPORT_ALLOWANCE, SPHttpClient.configurations.v1, CONFIG);
    } catch (err) {
        console.error(err);
        throw new Error("notifyIncidentReportAllownace error");
    }
}

// form 23
export async function notifyOtherIncident(context: WebPartContext, formId: number) {
    try {
        const CONFIG: ISPHttpClientOptions = {
            headers: {
                "Accept": "application/json;odata=verbose",
                "Content-Type": "application/json;odata=verbose",
                "OData-Version": "" //Really important to specify
            }, body: JSON.stringify({
                __metadata: { type: 'SP.Data.TestListItem' },
                "id": formId
            })
        };
        await context.httpClient.post(OTHER_INCIDENT_REPORT, SPHttpClient.configurations.v1, CONFIG);
    } catch (err) {
        console.error(err);
        throw new Error("notifyOtherIncident error");
    }
}