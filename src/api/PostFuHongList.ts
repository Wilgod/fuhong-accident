import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";


// Form 19
// Crate
export async function createServiceUserAccident(body: any) {
    try {
        const LIST_NAME = "Service User Accident";
        const result = await sp.web.lists.getByTitle(LIST_NAME).items.add(body);
        return result;
    } catch (err) {
        console.error(err);
        throw new Error("createServiceUserAccident failed");
    }
}
// Update
export async function updateServiceUserAccidentById(id: number, body: any) {
    try {
        const LIST_NAME = "Service User Accident";
        const result = await sp.web.lists.getByTitle(LIST_NAME).items.getById(id).update(body);
        return result;
    } catch (err) {
        console.error(err);
        throw new Error("updateServiceUserAccidentById failed");
    }
}

// form 20
export async function createAccidentReportForm(body: any) {
    try {
        const LIST_NAME = "Accident Report Form";
        const result = await sp.web.lists.getByTitle(LIST_NAME).items.add(body);
        return result;
    } catch (err) {
        console.error(err);
        throw new Error("createAccidentFollowUpRepotForm failed");
    }
}
//form 20
export async function updateAccidentReportFormById(id: number, body: any) {
    try {
        const LIST_NAME = "Accident Report Form";
        const result = await sp.web.lists.getByTitle(LIST_NAME).items.getById(id).update(body);
        return result;
    } catch (err) {
        console.error(err);
        throw new Error("updateServiceUserAccidentById failed");
    }
}


// form 21 
export async function createAccidentFollowUpRepotForm(body: any) {
    try {
        const LIST_NAME = "Accident Follow Up Form";
        const result = await sp.web.lists.getByTitle(LIST_NAME).items.add(body);
        return result;
        return result;
    } catch (err) {
        console.error(err);
        throw new Error("createAccidentFollowUpRepotForm failed");
    }
}

// form 21
export async function updateAccidentFollowUpRepotFormById(id: number, body: any) {
    try {
        const LIST_NAME = "Accident Follow Up Form";
        const result = await sp.web.lists.getByTitle(LIST_NAME).items.getById(id).update(body);

        return result;
    } catch (err) {
        console.error(err);
        throw new Error("updateAccidentFollowUpRepotForm failed");
    }
}