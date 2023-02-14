import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions, HttpClient, MSGraphClient, AadHttpClient, HttpClientResponse } from '@microsoft/sp-http';
import { WebPartContext } from '@microsoft/sp-webpart-base';

//Form 19 Update User
export async function notifyUpdate(context: WebPartContext, workflowUrl:string,serviceUnit:string, groupBy, userInfo) {
    try {
        const CONFIG: ISPHttpClientOptions = {
            headers: {
                "Accept": "application/json;odata=verbose",
                "Content-Type": "application/json;odata=verbose",
                "OData-Version": "" //Really important to specify
            }, body: JSON.stringify({
                __metadata: { type: 'SP.Data.TestListItem' },
                "serviceUnit":serviceUnit,
                "groupBy":groupBy,
                "userEMail":userInfo.Email,
                "userTitle":userInfo.Title
            })
        };
        let result = await context.httpClient.post(workflowUrl, SPHttpClient.configurations.v1, CONFIG);
        return result;
    } catch (err) {
        console.error(err);
        throw new Error("notifyServiceUserAccident error");
    }
}

//Form 19 Update User Investigator
export async function notifyInvestigatorUpdate(context: WebPartContext, workflowUrl:string,serviceUnit:string, groupBy, userInfo) {
    try {
        const CONFIG: ISPHttpClientOptions = {
            headers: {
                "Accept": "application/json;odata=verbose",
                "Content-Type": "application/json;odata=verbose",
                "OData-Version": "" //Really important to specify
            }, body: JSON.stringify({
                __metadata: { type: 'SP.Data.TestListItem' },
                "serviceUnit":serviceUnit,
                "groupBy":groupBy,
                "userEMail":userInfo.mail,
                "userTitle":userInfo.displayName
            })
        };
        let result = await context.httpClient.post(workflowUrl, SPHttpClient.configurations.v1, CONFIG);
        return result;
    } catch (err) {
        console.error(err);
        throw new Error("notifyServiceUserAccident error");
    }
}



//Form 19
export async function notifyServiceUserAccident(context: WebPartContext, formId: number, stage: number, workflowUrl:string) {
    try {
        const CONFIG: ISPHttpClientOptions = {
            headers: {
                "Accept": "application/json;odata=verbose",
                "Content-Type": "application/json;odata=verbose",
                "OData-Version": "" //Really important to specify
            }, body: JSON.stringify({
                __metadata: { type: 'SP.Data.TestListItem' },
                "id": formId,
                "stage": stage,
                "comment":"",
                "approval":""
            })
        };
        await context.httpClient.post(workflowUrl, SPHttpClient.configurations.v1, CONFIG);
    } catch (err) {
        console.error(err);
        throw new Error("notifyServiceUserAccident error");
    }
}

export async function notifyServiceUserAccidentReject(context: WebPartContext, formId: number, stage: number, workflowUrl:string) {
    try {
        const CONFIG: ISPHttpClientOptions = {
            headers: {
                "Accept": "application/json;odata=verbose",
                "Content-Type": "application/json;odata=verbose",
                "OData-Version": "" //Really important to specify
            }, body: JSON.stringify({
                __metadata: { type: 'SP.Data.TestListItem' },
                "id": formId,
                "stage": stage,
                "comment":"",
                "approval":"Reject"
            })
        };
        await context.httpClient.post(workflowUrl, SPHttpClient.configurations.v1, CONFIG);
    } catch (err) {
        console.error(err);
        throw new Error("notifyServiceUserAccident error");
    }
}

//Form 19
export async function notifyServiceUserAccidentSMSDComment(context: WebPartContext, formId: number, stage: number, workflowUrl:string) {
    try {
        const CONFIG: ISPHttpClientOptions = {
            headers: {
                "Accept": "application/json;odata=verbose",
                "Content-Type": "application/json;odata=verbose",
                "OData-Version": "" //Really important to specify
            }, body: JSON.stringify({
                __metadata: { type: 'SP.Data.TestListItem' },
                "id": formId,
                "stage": stage,
                "comment": "Comment",
                "approval":""
            })
        };
        await context.httpClient.post(workflowUrl, SPHttpClient.configurations.v1, CONFIG);
    } catch (err) {
        console.error(err);
        throw new Error("notifyServiceUserAccident error");
    }
}


// form 22
export async function notifyOutsiderAccident(context: WebPartContext, formId: number, stage: number, workflowUrl:string) {
    try {
        const CONFIG: ISPHttpClientOptions = {
            headers: {
                "Accept": "application/json;odata=verbose",
                "Content-Type": "application/json;odata=verbose",
                "OData-Version": "" //Really important to specify
            }, body: JSON.stringify({
                __metadata: { type: 'SP.Data.TestListItem' },
                "id": formId,
                "stage": stage,
                "comment": "",
                "approval":""
            })
        };
        await context.httpClient.post(workflowUrl, SPHttpClient.configurations.v1, CONFIG);
        //await context.httpClient.post(OUTSIDER_ACCIDENT, SPHttpClient.configurations.v1, CONFIG);
    } catch (err) {
        console.error(err);
        throw new Error("notifyOutsiderAccident error");
    }
}

export async function notifyOutsiderAccidentSMSDComment(context: WebPartContext, formId: number, stage: number, workflowUrl:string) {
    try {
        const CONFIG: ISPHttpClientOptions = {
            headers: {
                "Accept": "application/json;odata=verbose",
                "Content-Type": "application/json;odata=verbose",
                "OData-Version": "" //Really important to specify
            }, body: JSON.stringify({
                __metadata: { type: 'SP.Data.TestListItem' },
                "id": formId,
                "stage": stage,
                "comment": "Comment",
                "approval":""
            })
        };
        await context.httpClient.post(workflowUrl, SPHttpClient.configurations.v1, CONFIG);
        //await context.httpClient.post(OUTSIDER_ACCIDENT, SPHttpClient.configurations.v1, CONFIG);
    } catch (err) {
        console.error(err);
        throw new Error("notifyOutsiderAccident error");
    }
}

export async function notifyOutsiderAccidentReject(context: WebPartContext, formId: number, stage: number, workflowUrl:string) {
    try {
        const CONFIG: ISPHttpClientOptions = {
            headers: {
                "Accept": "application/json;odata=verbose",
                "Content-Type": "application/json;odata=verbose",
                "OData-Version": "" //Really important to specify
            }, body: JSON.stringify({
                __metadata: { type: 'SP.Data.TestListItem' },
                "id": formId,
                "stage": stage,
                "comment":"",
                "approval":"Reject"
            })
        };
        await context.httpClient.post(workflowUrl, SPHttpClient.configurations.v1, CONFIG);
    } catch (err) {
        console.error(err);
        throw new Error("notifyServiceUserAccident error");
    }
}

// form 24
export async function notifySpecialIncidentLicense(context: WebPartContext, formId: number, stage: number,workflowUrl:string) {
    try {
        const CONFIG: ISPHttpClientOptions = {
            headers: {
                "Accept": "application/json;odata=verbose",
                "Content-Type": "application/json;odata=verbose",
                "OData-Version": "" //Really important to specify
            }, body: JSON.stringify({
                __metadata: { type: 'SP.Data.TestListItem' },
                "id": formId,
                "stage": stage,
                "approval":""
            })
        };
        //await context.httpClient.post(SPEICAL_INCIDENT_REPORT_LICENSE, SPHttpClient.configurations.v1, CONFIG);
        await context.httpClient.post(workflowUrl, SPHttpClient.configurations.v1, CONFIG);
    } catch (err) {
        console.error(err);
        throw new Error("notifySpecialIncidentLicense error");
    }
}
// form 25
export async function notifySpecialIncidentAllowance(context: WebPartContext, formId: number, stage: number,workflowUrl:string) {
    
    try {
        const CONFIG: ISPHttpClientOptions = {
            headers: {
                "Accept": "application/json;odata=verbose",
                "Content-Type": "application/json;odata=verbose",
                "OData-Version": "" //Really important to specify
            }, body: JSON.stringify({
                __metadata: { type: 'SP.Data.TestListItem' },
                "id": formId,
                "stage": stage,
                "approval":""
            })
        };
        //await context.httpClient.post(SPEICAL_INCIDENT_REPORT_ALLOWANCE, SPHttpClient.configurations.v1, CONFIG);
        await context.httpClient.post(workflowUrl, SPHttpClient.configurations.v1, CONFIG);
    } catch (err) {
        console.error(err);
        throw new Error("notifyIncidentReportAllownace error");
    }
}

// form 23
export async function notifyOtherIncident(context: WebPartContext, formId: number, stage: number,workflowUrl:string) {
    try {
        const CONFIG: ISPHttpClientOptions = {
            headers: {
                "Accept": "application/json;odata=verbose",
                "Content-Type": "application/json;odata=verbose",
                "OData-Version": "" //Really important to specify
            }, body: JSON.stringify({
                __metadata: { type: 'SP.Data.TestListItem' },
                "id": formId,
                "stage": stage,
                "approval":""
            })
        };
        //await context.httpClient.post(OTHER_INCIDENT_REPORT, SPHttpClient.configurations.v1, CONFIG);
        await context.httpClient.post(workflowUrl, SPHttpClient.configurations.v1, CONFIG);
    } catch (err) {
        console.error(err);
        throw new Error("notifyOtherIncident error");
    }
}
// form 23, 24, 25 Reject
export async function notifyIncidentReject(context: WebPartContext, formId: number, stage: number,workflowUrl:string) {
    try {
        const CONFIG: ISPHttpClientOptions = {
            headers: {
                "Accept": "application/json;odata=verbose",
                "Content-Type": "application/json;odata=verbose",
                "OData-Version": "" //Really important to specify
            }, body: JSON.stringify({
                __metadata: { type: 'SP.Data.TestListItem' },
                "id": formId,
                "stage": stage,
                "approval":"Reject"
            })
        };
        //await context.httpClient.post(OTHER_INCIDENT_REPORT, SPHttpClient.configurations.v1, CONFIG);
        await context.httpClient.post(workflowUrl, SPHttpClient.configurations.v1, CONFIG);
    } catch (err) {
        console.error(err);
        throw new Error("notifyOtherIncident error");
    }
}


export async function postCMSWorkflowGetUser(context: WebPartContext, serviceLocation:string, workflowUrl:string) {
    try {
        const CONFIG: ISPHttpClientOptions = {
            headers: {
                "Accept": "application/json;odata=verbose",
                "Content-Type": "application/json;odata=verbose",
                "OData-Version": "" //Really important to specify
            }, body: JSON.stringify({
                __metadata: { type: 'SP.Data.TestListItem' },
                "ServiceLocation": serviceLocation
            })
        };
        let userList = await context.httpClient.post(workflowUrl, SPHttpClient.configurations.v1, CONFIG).then((response: SPHttpClientResponse) => {
            return response.json();
          });
        return userList
    } catch (err) {
        console.error(err);
        throw new Error("notifyServiceUserAccident error");
    }
}