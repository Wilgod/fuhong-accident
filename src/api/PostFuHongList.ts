import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { IAttachmentFileInfo } from "@pnp/sp/attachments";
import "@pnp/sp/attachments";
import { IList } from "@pnp/sp/lists";
import { result } from "lodash";

export async function updateServiceUserAccidentAttachmentById(id: number, attachments: IAttachmentFileInfo[]) {
    try {
        const LIST_NAME = "Service User Accident";
        const result = await sp.web.lists.getByTitle(LIST_NAME).items.getById(id).attachmentFiles.addMultiple(attachments);
        return true;
    } catch (err) {
        console.error(err);
        throw new Error("updateServiceUserAccidentAttachmentById failed");
    }
}

export async function getServiceUserAccidentAllAttachmentById(id: number) {
    try {
        const LIST_NAME = "Service User Accident";
        const result = await sp.web.lists.getByTitle(LIST_NAME).items.getById(id).attachmentFiles();
        return result;
    } catch (err) {
        console.error(err);
        throw new Error("getServiceUserAccidentAllAttachmentById failed");
    }
}

// Form 19
// Create
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