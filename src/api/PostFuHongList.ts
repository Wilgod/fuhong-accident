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

export async function updateOutsidersAccidentFormAttachmentById(id: number, attachments: IAttachmentFileInfo[]) {
    try {
        const LIST_NAME = "Outsider Accident Form";
        const result = await sp.web.lists.getByTitle(LIST_NAME).items.getById(id).attachmentFiles.addMultiple(attachments);
        return true;
    } catch (err) {
        console.error(err);
        throw new Error("updateOutsidersAccidentFormAttachmentById failed");
    }
}

export async function getOutsidersAccidentAllAttachmentById(id: number) {
    try {
        const LIST_NAME = "Outsider Accident Form";
        const result = await sp.web.lists.getByTitle(LIST_NAME).items.getById(id).attachmentFiles();
        return result;
    } catch (err) {
        console.error(err);
        throw new Error("getOutsidersAccidentFormById failed");
    }
}

export async function updateSpecialIncidentReportLicenseAttachmentById(id: number, attachments: IAttachmentFileInfo[]) {
    try {
        const LIST_NAME = "Special Incident Report License";
        const result = await sp.web.lists.getByTitle(LIST_NAME).items.getById(id).attachmentFiles.addMultiple(attachments);
        return true;
    } catch (err) {
        console.error(err);
        throw new Error("updateOutsidersAccidentFormAttachmentById failed");
    }
}

export async function getSpecialIncidentReportLicenseAllAttachmentById(id: number) {
    try {
        const LIST_NAME = "Special Incident Report License";
        const result = await sp.web.lists.getByTitle(LIST_NAME).items.getById(id).attachmentFiles();
        return result;
    } catch (err) {
        console.error(err);
        throw new Error("getSpecialIncidentReportLicenseAllAttachmentById failed");
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
//delete
export async function deleteServiceUserAccidentById(id: number) {
    try {
        const LIST_NAME = "Service User Accident";
        await sp.web.lists.getByTitle(LIST_NAME).items.getById(id).delete();
        return result;
    } catch (err) {
        console.error(err);
        throw new Error("deleteServiceUserAccidentById failed");
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

// Form 22
// Create
export async function createOutsiderAccidentForm(body: any) {
    try {
        const LIST_NAME = "Outsider Accident Form";
        const result = await sp.web.lists.getByTitle(LIST_NAME).items.add(body);
        return result;
    } catch (err) {
        console.error(err);
        throw new Error("createOutsiderAccidentForm failed");
    }
}

// Update 
export async function updateOutsiderAccidentFormById(id: number, body: any) {
    try {
        const LIST_NAME = "Outsider Accident Form";
        const result = await sp.web.lists.getByTitle(LIST_NAME).items.getById(id).update(body);
        return result;
    } catch (err) {
        console.error(err);
        throw new Error("updateServiceUserAccidentById failed");
    }
}
//delete
export async function deleteOutsiderAccidentFormById(id: number) {
    try {
        const LIST_NAME = "Outsider Accident Form";
        await sp.web.lists.getByTitle(LIST_NAME).items.getById(id).delete();
        return result;
    } catch (err) {
        console.error(err);
        throw new Error("deleteOutsiderAccidentFormById failed");
    }
}
//Form 23
//Create
export async function createOtherIncidentReport(body: any) {
    try {
        const LIST_NAME = "Other Incident Report";
        const result = await sp.web.lists.getByTitle(LIST_NAME).items.add(body);
        return result;
    } catch (err) {
        console.error(err);
        throw new Error("createOtherIncidentReport failed");
    }
}

//Update
export async function updateOtherIncidentReport(id: number, body: any) {
    try {
        const LIST_NAME = "Other Incident Report";
        const result = await sp.web.lists.getByTitle(LIST_NAME).items.getById(id).update(body);
        return result;
    } catch (err) {
        console.error(err);
        throw new Error("updateOtherIncidentReport failed");
    }
}
//delete
export async function deleteOtherIncidentReport(id: number) {
    try {
        const LIST_NAME = "Other Incident Report";
        await sp.web.lists.getByTitle(LIST_NAME).items.getById(id).delete();
        return result;
    } catch (err) {
        console.error(err);
        throw new Error("deleteOtherIncidentReport failed");
    }
}
//Form 24
//Create
export async function createSpecialIncidentReportLicense(body: any) {
    try {
        const LIST_NAME = "Special Incident Report License";
        const result = await sp.web.lists.getByTitle(LIST_NAME).items.add(body);
        return result;
    } catch (err) {
        console.error(err);
        throw new Error("createSpecialIncidentReportLicense failed");
    }
}

//Update
export async function updateSpecialIncidentReportLicense(id: number, body: any) {
    try {
        const LIST_NAME = "Special Incident Report License";
        const result = await sp.web.lists.getByTitle(LIST_NAME).items.getById(id).update(body);
        return result;
    } catch (err) {
        console.error(err);
        throw new Error("updateSpecialIncidentReportLicense failed");
    }
}

//delete
export async function deleteSpecialIncidentReportLicense(id: number) {
    try {
        const LIST_NAME = "Special Incident Report License";
        await sp.web.lists.getByTitle(LIST_NAME).items.getById(id).delete();
        return result;
    } catch (err) {
        console.error(err);
        throw new Error("deleteSpecialIncidentReportLicense failed");
    }
}

//Form 25
//Create
export async function createSpecialIncidentReportAllowance(body: any) {
    try {
        const LIST_NAME = "Special Incident Report Allowance";
        const result = await sp.web.lists.getByTitle(LIST_NAME).items.add(body);
        return result;
    } catch (err) {
        console.error(err);
        throw new Error("createSpecialIncidentReportAllowance failed");
    }
}

//Update
export async function updateSpecialIncidentReportAllowance(id: number, body: any) {
    try {
        const LIST_NAME = "Special Incident Report Allowance";
        const result = await sp.web.lists.getByTitle(LIST_NAME).items.getById(id).update(body);
        return result;
    } catch (err) {
        console.error(err);
        throw new Error("updateSpecialIncidentReportAllowance failed");
    }
}

//delete
export async function deleteSpecialIncidentReportAllowance(id: number) {
    try {
        const LIST_NAME = "Special Incident Report Allowance";
        await sp.web.lists.getByTitle(LIST_NAME).items.getById(id).delete();
        return result;
    } catch (err) {
        console.error(err);
        throw new Error("deleteSpecialIncidentReportAllowance failed");
    }
} 
//Form 26
//Create
export async function createIncidentFollowUpForm(body: any) {
    try {
        const LIST_NAME = "Incident Follow Up Form";
        const result = await sp.web.lists.getByTitle(LIST_NAME).items.add(body);
        return result;
    } catch (err) {
        console.error(err);
        throw new Error("createIncidentFollowUpForm failed");
    }
}

//Update
export async function updateIncidentFollowUpForm(id: number, body: any) {
    try {
        const LIST_NAME = "Incident Follow Up Form";
        const result = await sp.web.lists.getByTitle(LIST_NAME).items.getById(id).update(body);
        return result;
    } catch (err) {
        console.error(err);
        throw new Error("updateIncidentFollowUpForm failed");
    }
}


export async function updateInsuranceNumber(id: number, InsuranceCaseNo: string) {
    try {
        const LIST_NAME = "Insurance EMail Records";
        let values: any = {};
        values['InsuranceCaseNo'] = InsuranceCaseNo;
        const result = await sp.web.lists.getByTitle(LIST_NAME).items.getById(id).update(values);
        return result;
    } catch (err) {
        console.error(err);
        throw new Error("update Insurance EMail Records failed");
    }
}