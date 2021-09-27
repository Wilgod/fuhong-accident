import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";


export async function getServiceUnits() {
    try {
        const LIST_NAME = "Service Units";
        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items.getAll();
        return items;
    } catch (err) {
        console.error(err);
        throw new Error("getServiceUnit failed");
    }
}

export async function getServiceUnitByShortForm(serviceUnitShortForm: string) {
    try {
        const LIST_NAME = "Service Units";
        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items.filter(`ShortForm eq '${serviceUnitShortForm}'`).top(1).get();
        return items;
    } catch (err) {
        console.log(err);
        throw new Error("getServiceUnitByShortForm failed");
    }
}

export enum FormFlow {
    SERVICE_USER_ACCIDENT,
}

const formFlowParser = (formFlow: FormFlow) => {
    switch (formFlow) {
        case FormFlow.SERVICE_USER_ACCIDENT:
            return "Service User Accident";
        default:
            throw new Error("formFlowParser Error Exist");
    }
}

export async function getLastCaseNo(formFlow: FormFlow) {
    try {
        const LIST_NAME = formFlowParser(formFlow);
        const item = await sp.web.lists.getByTitle(LIST_NAME).items.filter("Status ne 'DRAFT'").select("Status", "CaseNumber", "Created").orderBy("Created", false).top(1).get();
        console.log(item)
        if (item.length > 0) return item[0];
        return null;
    } catch (err) {
        console.error(err);
        throw new Error("getLastCaseNo failed");
    }
}

// Form 19
export async function getServiceUserAccident() {
    try {
        const LIST_NAME = "Service User Accident";
        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            .getAll();

        return items;
    } catch (err) {
        console.error(err);
        throw new Error("getServiceUserAccident failed");
    }
}

export async function getServiceUserAccidentById(id: number) {
    try {
        const LIST_NAME = "Service User Accident";
        const item = await sp.web.lists.getByTitle(LIST_NAME).items
            .getById(id).select("*", "Author/Id", "Author/EMail", 'Author/Title', "ContactFamilyStaff/Id", "ContactFamilyStaff/EMail", 'ContactFamilyStaff/Title', "SD/Id", "SD/EMail", 'SD/Title', "SPT/Id", "SPT/EMail", 'SPT/Title', "SM/Id", "SM/EMail", 'SM/Title', "Investigator/Id", "Investigator/EMail", "Investigator/Title")
            .expand("Author", "ContactFamilyStaff", "SM", "SPT", "SD", "Investigator").get();

        return item;
    } catch (err) {
        console.error(err);
        throw new Error("getServiceUserAccidentById failed");
    }
}


// Form 20
export async function getAccidentReportFormById(formId: number) {
    try {
        const LIST_NAME = "Accident Report Form";
        const item = await sp.web.lists.getByTitle(LIST_NAME).items
            .getById(formId).select("*", "Author/Id", "Author/EMail", 'Author/Title', "SPT/Id", "SPT/EMail", 'SPT/Title', "SM/Id", "SM/EMail", 'SM/Title', "Investigator/Id", "Investigator/EMail", 'Investigator/Title')
            .expand("Author", "SM", "SPT", "Investigator").get();

        return item;
    } catch (err) {
        console.error(err);
        throw new Error("getAccidentReportFormById failed");
    }
}

// form 21
export async function getAccidentFollowUpFormById(formId: number) {
    try {
        const LIST_NAME = "Accident Follow Up Form";
        const item = await sp.web.lists.getByTitle(LIST_NAME).items
            .getById(formId).select("*", "Author/Id", "Author/EMail", 'Author/Title', "SPT/Id", "SPT/EMail", 'SPT/Title', "SM/Id", "SM/EMail", 'SM/Title', "SD/Id", "SD/EMail", 'SD/Title')
            .expand("Author", "SM", "SPT", "SD").get();

        return item;
    } catch (err) {
        console.error(err);
        throw new Error("getAccidentFollowUpFormById failed");
    }
}