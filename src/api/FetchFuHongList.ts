import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { ISearchCriteria } from "../hooks/useFetchAllForms";
import { filter } from "lodash";


export async function getServiceUnits() {
    try {
        const LIST_NAME = "Service Units";
        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items.orderBy("ShortForm", true).get();
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
    OUTSIDER_ACCIDENT,
    OTHER_INCIDENT,
    SPECIAL_INCIDENT_ALLOWANCE,
    SPECIAL_INCIDENT_LICENSE
}

const formFlowParser = (formFlow: FormFlow) => {
    switch (formFlow) {
        case FormFlow.SERVICE_USER_ACCIDENT:
            return "Service User Accident";
        case FormFlow.OUTSIDER_ACCIDENT:
            return "Outsider Accident Form";
        case FormFlow.OTHER_INCIDENT:
            return "Other Incident Report";
        case FormFlow.SPECIAL_INCIDENT_ALLOWANCE:
            return "Special Incident Report Allowance";
        case FormFlow.SPECIAL_INCIDENT_LICENSE:
            return "Special Incident Report License";
        default:
            throw new Error("formFlowParser Error Exist");
    }
}

export async function getLastCaseNo(formFlow: FormFlow) {
    try {
        const LIST_NAME = formFlowParser(formFlow);
        const item = await sp.web.lists.getByTitle(LIST_NAME).items.filter("Status ne 'DRAFT'").select("Status", "CaseNumber", "Created", "ServiceUnit", "ServiceLocation").orderBy("Created", false).top(1).get();
        if (item.length > 0) return item[0];
        return null;
    } catch (err) {
        console.error(err);
        throw new Error("getLastCaseNo failed");
    }
}

// Form 19
export async function getServiceUserAccident(spId: number, searchCriteria?: ISearchCriteria) {
    try {
        const LIST_NAME = "Service User Accident";
        let filterQuery = `(SMId eq ${spId} or SDId eq ${spId} or AuthorId eq ${spId} or InvestigatorId eq ${spId} or SPTId eq ${spId}) and Status ne 'DRAFT'`;
        if (searchCriteria) {

            if (searchCriteria.keyword) {
                filterQuery = `${filterQuery} and (InsuranceCaseNo eq '${searchCriteria.keyword}' or CaseNumber eq '${searchCriteria.keyword}')`;
            }

            if (searchCriteria.formStatus) {
                if (searchCriteria.formStatus === "PROCESSING") {
                    filterQuery = `${filterQuery} and Status ne 'CLOSED'`;
                } else if (searchCriteria.formStatus === "CLOSED") {
                    filterQuery = `${filterQuery} and Status eq 'CLOSED'`;
                }
            }

            if (Array.isArray(searchCriteria.serviceUnits) && searchCriteria.serviceUnits.indexOf("ALL") === -1) {
                let su = "";
                searchCriteria.serviceUnits.forEach((item, index) => {
                    if (index === 0) {
                        su = `ServiceUnit eq '${item}'`;
                    } else {
                        su += `ServiceUnit eq '${item}'`;
                    }

                    if (index !== searchCriteria.serviceUnits.length - 1) {
                        su = `${su} or `;
                    }
                })
                filterQuery = `${filterQuery} and (${su})`;
            }

            if (searchCriteria.startDate && searchCriteria.endDate) {
                //start < AccidentTime < end
                filterQuery = `${filterQuery} and AccidentTime ge '${searchCriteria.startDate.toISOString()}' and AccidentTime le '${searchCriteria.endDate.toISOString()}'`;
            }
        }

        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            .filter(filterQuery)
            .getAll();

        return items;
    } catch (err) {
        console.error(err);
        throw new Error("getServiceUserAccident failed");
    }
}

export async function getServiceUserAccidentBySPId(spId: number) {
    try {
        const LIST_NAME = "Service User Accident";
        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items.
            filter(`(SMId eq ${spId} or SDId eq ${spId} or AuthorId eq ${spId} or InvestigatorId eq ${spId}) and Status ne 'CLOSED'`)
            .select("*", "Author/Id", "Author/EMail", 'Author/Title', "SD/Id", "SD/EMail", 'SD/Title', "SPT/Id", "SPT/EMail", 'SPT/Title', "SM/Id", "SM/EMail", 'SM/Title', "Investigator/Id", "Investigator/EMail", "Investigator/Title")
            .expand("SM", "SD", "SPT", "Author", "Investigator")
            .getAll();

        return items;
    } catch (err) {
        console.error(err);
        throw new Error("getServiceUserAccidentBySPId failed");
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

export async function getAllAccidentFollowUpFormByParentId(parentId: number) {
    try {
        const LIST_NAME = "Accident Follow Up Form";
        const item = await sp.web.lists.getByTitle(LIST_NAME).items
            .filter(`ParentFormId eq ${parentId}`)
            .select("*", "Author/Id", "Author/EMail", 'Author/Title', "SPT/Id", "SPT/EMail", 'SPT/Title', "SM/Id", "SM/EMail", 'SM/Title', "SD/Id", "SD/EMail", 'SD/Title')
            .expand("Author", "SM", "SPT", "SD")
            .orderBy("Created", false)
            .get();
        return item;
    } catch (err) {
        console.error(err);
        throw new Error("getAllAccidentFollowUpFormByParentId failed");
    }
}

export async function getAllAccidentFollowUpFormByCaseNumber(caseNumber: string) {
    try {
        const LIST_NAME = "Accident Follow Up Form";
        const item = await sp.web.lists.getByTitle(LIST_NAME).items
            .filter(`CaseNumber eq '${caseNumber}'`)
            .select("*", "Author/Id", "Author/EMail", 'Author/Title', "SM/Id", "SM/EMail", 'SM/Title', "SD/Id", "SD/EMail", 'SD/Title')
            .expand("Author", "SM", "SD")
            .orderBy("Created", false)
            .get();
        return item;
    } catch (err) {
        console.error(err);
        throw new Error("getAllAccidentFollowUpFormByCaseNumber failed");
    }
}

// Form 22
export async function getOutsiderAccident(spId: number, searchCriteria?: ISearchCriteria) {
    try {
        const LIST_NAME = "Outsider Accident Form";
        let filterQuery = `(SMId eq ${spId} or SDId eq ${spId} or AuthorId eq ${spId} or InvestigatorId eq ${spId} or SPTId eq ${spId}) and Status ne 'DRAFT'`;
        if (searchCriteria) {
            if (searchCriteria.keyword) {
                filterQuery = `${filterQuery} and (InsuranceCaseNo eq '${searchCriteria.keyword}' or CaseNumber eq '${searchCriteria.keyword}')`;
            }

            if (searchCriteria.keyword) {
                filterQuery = `${filterQuery} and (InsuranceCaseNo eq '${searchCriteria.keyword}' or CaseNumber eq '${searchCriteria.keyword}')`;
            }

            if (searchCriteria.formStatus) {
                if (searchCriteria.formStatus === "PROCESSING") {
                    filterQuery = `${filterQuery} and Status ne 'CLOSED'`;
                } else if (searchCriteria.formStatus === "CLOSED") {
                    filterQuery = `${filterQuery} and Status eq 'CLOSED'`;
                }
            }

            if (Array.isArray(searchCriteria.serviceUnits) && searchCriteria.serviceUnits.indexOf("ALL") === -1) {
                let su = "";
                searchCriteria.serviceUnits.forEach((item, index) => {
                    if (index === 0) {
                        su = `ServiceUnit eq '${item}'`;
                    } else {
                        su += `ServiceUnit eq '${item}'`;
                    }

                    if (index !== searchCriteria.serviceUnits.length - 1) {
                        su = `${su} or `;
                    }
                })
                filterQuery = `${filterQuery} and (${su})`;
            }

            if (searchCriteria.startDate && searchCriteria.endDate) {
                //start < AccidentTime < end
                filterQuery = `${filterQuery} and AccidentTime ge '${searchCriteria.startDate.toISOString()}' and AccidentTime le '${searchCriteria.endDate.toISOString()}'`;
            }
        }
        console.log(filterQuery);
        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            .filter(filterQuery)
            .getAll();

        return items;
    } catch (err) {
        console.error(err);
        throw new Error("getServiceUserAccident failed");
    }
}

export async function getOutsiderAccidentBySPId(spId: number) {
    try {
        const LIST_NAME = "Outsider Accident Form";
        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            .filter(`(SMId eq ${spId} or SDId eq ${spId} or AuthorId eq ${spId} or InvestigatorId eq ${spId}) and Status ne 'CLOSED'`)
            .select("*", "Author/Id", "Author/EMail", 'Author/Title', "SD/Id", "SD/EMail", 'SD/Title', "SPT/Id", "SPT/EMail", 'SPT/Title', "SM/Id", "SM/EMail", 'SM/Title', "Investigator/Id", "Investigator/EMail", "Investigator/Title")
            .expand("SM", "SD", "SPT", "Author", "Investigator")
            .getAll();

        return items;
    } catch (err) {
        console.error(err);
        throw new Error("getOutsiderAccidentBySPId failed");
    }
}


export async function getOutsiderAccidentById(id: number) {
    try {
        const LIST_NAME = "Outsider Accident Form";
        const item = await sp.web.lists.getByTitle(LIST_NAME).items
            .getById(id).select("*", "Author/Id", "Author/EMail", 'Author/Title', "SD/Id", "SD/EMail", 'SD/Title', "SPT/Id", "SPT/EMail", 'SPT/Title', "SM/Id", "SM/EMail", 'SM/Title', "Investigator/Id", "Investigator/EMail", "Investigator/Title")
            .expand("Author", "SM", "SPT", "SD", "Investigator").get();

        return item;
    } catch (err) {
        console.error(err);
        throw new Error("getOutsiderAccidentById failed");
    }
}

//Form 23
export async function getOtherIncidentReport(spId: number, searchCriteria?: ISearchCriteria) {
    try {
        const LIST_NAME = "Other Incident Report";
        let filterQuery = `(SMId eq ${spId} or SDId eq ${spId} or AuthorId eq ${spId}) and Status ne 'DRAFT'`;
        if (searchCriteria) {

            if (searchCriteria.keyword) {
                filterQuery = `${filterQuery} and (InsuranceCaseNo eq '${searchCriteria.keyword}' or CaseNumber eq '${searchCriteria.keyword}')`;
            }

            if (searchCriteria.formStatus) {
                if (searchCriteria.formStatus === "PROCESSING") {
                    filterQuery = `${filterQuery} and Status ne 'CLOSED'`;
                } else if (searchCriteria.formStatus === "CLOSED") {
                    filterQuery = `${filterQuery} and Status eq 'CLOSED'`;
                }
            }

            if (Array.isArray(searchCriteria.serviceUnits) && searchCriteria.serviceUnits.indexOf("ALL") === -1) {
                let su = "";
                searchCriteria.serviceUnits.forEach((item, index) => {
                    if (index === 0) {
                        su = `ServiceUnit eq '${item}'`;
                    } else {
                        su += `ServiceUnit eq '${item}'`;
                    }

                    if (index !== searchCriteria.serviceUnits.length - 1) {
                        su = `${su} or `;
                    }
                })
                filterQuery = `${filterQuery} and (${su})`;
            }

            if (searchCriteria.startDate && searchCriteria.endDate) {
                //start < AccidentTime < end
                filterQuery = `${filterQuery} and IncidentTime ge '${searchCriteria.startDate.toISOString()}' and IncidentTime le '${searchCriteria.endDate.toISOString()}'`;
            }
        }
        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            .filter(filterQuery)
            .getAll();

        return items;
    } catch (err) {
        console.error(err);
        throw new Error("getServiceUserAccident failed");
    }
}

export async function getOtherIncidentReportBySPId(spId: number) {
    try {
        const LIST_NAME = "Other Incident Report";
        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            .filter(`(SMId eq ${spId} or SDId eq ${spId} or AuthorId eq ${spId}) and Status ne 'CLOSED'`)
            .select("*", "Author/Id", "Author/EMail", 'Author/Title', "SD/Id", "SD/EMail", 'SD/Title', "SM/Id", "SM/EMail", 'SM/Title',)
            .expand("SM", "SD", "Author")
            .getAll();

        return items;
    } catch (err) {
        console.error(err);
        throw new Error("getOtherIncidentReportBySPId failed");
    }
}

export async function getOtherIncidentReportById(id: number) {
    try {
        const LIST_NAME = "Other Incident Report";
        const items = await sp.web.lists.getByTitle(LIST_NAME).items
            .getById(id).select("*", "Author/Id", "Author/EMail", 'Author/Title', "PreparationStaff/Id", "PreparationStaff/EMail", 'PreparationStaff/Title', "SM/Id", "SM/EMail", 'SM/Title', "SD/Id", "SD/EMail", 'SD/Title',)
            .expand("Author", "SM", "PreparationStaff", "SD").get();

        return items;
    } catch (err) {
        console.error(err);
        throw new Error("getOtherIncidentReportById failed");
    }
}

//Form 24
export async function getSpecialIncidentReportLicense(spId: number, searchCriteria?: ISearchCriteria) {
    try {
        const LIST_NAME = "Special Incident Report License";
        let filterQuery = `(SMId eq ${spId} or SDId eq ${spId} or AuthorId eq ${spId}) and Status ne 'DRAFT'`;
        if (searchCriteria) {

            if (searchCriteria.keyword) {
                filterQuery = `${filterQuery} and (InsuranceCaseNo eq '${searchCriteria.keyword}' or CaseNumber eq '${searchCriteria.keyword}')`;
            }

            if (searchCriteria.formStatus) {
                if (searchCriteria.formStatus === "PROCESSING") {
                    filterQuery = `${filterQuery} and Status ne 'CLOSED'`;
                } else if (searchCriteria.formStatus === "CLOSED") {
                    filterQuery = `${filterQuery} and Status eq 'CLOSED'`;
                }
            }

            if (Array.isArray(searchCriteria.serviceUnits) && searchCriteria.serviceUnits.indexOf("ALL") === -1) {
                let su = "";
                searchCriteria.serviceUnits.forEach((item, index) => {
                    if (index === 0) {
                        su = `ServiceUnit eq '${item}'`;
                    } else {
                        su += `ServiceUnit eq '${item}'`;
                    }

                    if (index !== searchCriteria.serviceUnits.length - 1) {
                        su = `${su} or `;
                    }
                })
                filterQuery = `${filterQuery} and (${su})`;
            }

            if (searchCriteria.startDate && searchCriteria.endDate) {
                //start < AccidentTime < end
                filterQuery = `${filterQuery} and IncidentTime ge '${searchCriteria.startDate.toISOString()}' and IncidentTime le '${searchCriteria.endDate.toISOString()}'`;
            }
        }
        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            .filter(filterQuery)
            .getAll();
        return items;
    } catch (err) {
        console.error(err);
        throw new Error("getSpecialIncidentReportLicenseBySPId failed");
    }
}

export async function getSpecialIncidentReportLicenseBySPId(spId: number) {
    try {
        const LIST_NAME = "Special Incident Report License";
        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            .filter(`(SMId eq ${spId} or SDId eq ${spId} or AuthorId eq ${spId}) and Status ne 'CLOSED'`)
            .select("*", "Author/Id", "Author/EMail", 'Author/Title', "SD/Id", "SD/EMail", 'SD/Title', "SM/Id", "SM/EMail", 'SM/Title',)
            .expand("SM", "SD", "Author")
            .getAll();

        return items;
    } catch (err) {
        console.error(err);
        throw new Error("getSpecialIncidentReportLicenseBySPId failed");
    }
}

export async function getSpecialIncidentReportLicenseById(id: number) {
    try {
        const LIST_NAME = "Special Incident Report License";
        const items = await sp.web.lists.getByTitle(LIST_NAME).items
            .getById(id).select("*", "Author/Id", "Author/EMail", 'Author/Title', "SD/Id", "SD/EMail", "SM/Id", "SM/EMail", 'SM/Title', "GuardianStaff/Id", "GuardianStaff/EMail", 'GuardianStaff/Title')
            .expand("Author", "SM", "SD", "GuardianStaff").get();

        return items;
    } catch (err) {
        console.error(err);
        throw new Error("getSpecialIncidentReportLicenseById failed");
    }
}

//Form 25
export async function getSpecialIncidentReportAllowance(spId: number, searchCriteria?: ISearchCriteria) {
    try {
        const LIST_NAME = "Special Incident Report Allowance";
        let filterQuery = `(SMId eq ${spId} or SDId eq ${spId} or AuthorId eq ${spId}) and Status ne 'DRAFT'`;
        if (searchCriteria) {

            if (searchCriteria.keyword) {
                filterQuery = `${filterQuery} and (CaseNumber eq '${searchCriteria.keyword}')`;
            }

            if (searchCriteria.formStatus) {
                if (searchCriteria.formStatus === "PROCESSING") {
                    filterQuery = `${filterQuery} and Status ne 'CLOSED'`;
                } else if (searchCriteria.formStatus === "CLOSED") {
                    filterQuery = `${filterQuery} and Status eq 'CLOSED'`;
                }
            }

            if (Array.isArray(searchCriteria.serviceUnits) && searchCriteria.serviceUnits.indexOf("ALL") === -1) {
                let su = "";
                searchCriteria.serviceUnits.forEach((item, index) => {
                    if (index === 0) {
                        su = `ServiceUnit eq '${item}'`;
                    } else {
                        su += `ServiceUnit eq '${item}'`;
                    }

                    if (index !== searchCriteria.serviceUnits.length - 1) {
                        su = `${su} or `;
                    }
                })
                filterQuery = `${filterQuery} and (${su})`;
            }

            if (searchCriteria.startDate && searchCriteria.endDate) {
                //start < IncidentTime < end
                filterQuery = `${filterQuery} and IncidentTime ge '${searchCriteria.startDate.toISOString()}' and IncidentTime le '${searchCriteria.endDate.toISOString()}'`;
            }
        }
        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            .filter(filterQuery)
            .getAll();

        return items;
    } catch (err) {
        console.error(err);
        throw new Error("getSpecialIncidentReportAllowance failed");
    }
}

export async function getSpecialIncidentReportAllowanceBySPId(spId: number) {
    try {
        const LIST_NAME = "Special Incident Report Allowance";
        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            .filter(`(SMId eq ${spId} or SDId eq ${spId} or AuthorId eq ${spId}) and Status ne 'CLOSED'`)
            .select("*", "Author/Id", "Author/EMail", 'Author/Title', "SD/Id", "SD/EMail", 'SD/Title', "SM/Id", "SM/EMail", 'SM/Title',)
            .expand("SM", "SD", "Author")
            .getAll();

        return items;
    } catch (err) {
        console.error(err);
        throw new Error("getSpecialIncidentReportAllowanceBySPId failed");
    }
}



export async function getSpecialIncidentReportAllowanceById(id: number) {
    try {
        const LIST_NAME = "Special Incident Report Allowance";
        const items = await sp.web.lists.getByTitle(LIST_NAME).items
            .getById(id)
            .select("*", "Author/Id", "Author/EMail", 'Author/Title', "SD/Id", "SD/EMail", "SM/Id", "SM/EMail", 'SM/Title')
            .expand("Author", "SM", "SD",)
            .get();

        return items;
    } catch (err) {
        console.error(err);
        throw new Error("getSpecialIncidentReportAllowanceById failed");
    }
}

//Form 26
export async function getIncidentFollowUpFormById(id: number) {
    try {
        const LIST_NAME = "Special Incident Report Allowance";
        const item = await sp.web.lists.getByTitle(LIST_NAME).items
            .getById(id).select("*", "Author/Id", "Author/EMail", 'Author/Title', "SD/Id", "SD/EMail", "SM/Id", "SM/EMail", 'SM/Title')
            .expand("Author", "SM", "SD",).get();

        return item;
    } catch (err) {
        console.error(err);
        throw new Error("getServiceUserAccident failed");
    }
}

export async function getAllIncidentFollowUpFormByParentId(parentId: number) {
    try {
        const LIST_NAME = "Incident Follow Up Form";
        const item = await sp.web.lists.getByTitle(LIST_NAME).items
            .filter(`ParentFormId eq ${parentId}`)
            .select("*", "Author/Id", "Author/EMail", 'Author/Title', "SM/Id", "SM/EMail", 'SM/Title', "SD/Id", "SD/EMail", 'SD/Title')
            .expand("Author", "SM", "SD")
            .orderBy("Created", false)
            .get();
        return item;
    } catch (err) {
        console.error(err);
        throw new Error("getAllIncidentFollowUpFormByParentId failed");
    }
}

export async function getAllIncidentFollowUpFormByCaseNumber(caseNumber: string) {
    try {
        const LIST_NAME = "Incident Follow Up Form";
        const item = await sp.web.lists.getByTitle(LIST_NAME).items
            .filter(`CaseNumber eq '${caseNumber}'`)
            .select("*", "Author/Id", "Author/EMail", 'Author/Title', "SM/Id", "SM/EMail", 'SM/Title', "SD/Id", "SD/EMail", 'SD/Title')
            .expand("Author", "SM", "SD")
            .orderBy("Created", false)
            .get();
        return item;
    } catch (err) {
        console.error(err);
        throw new Error("getAllIncidentFollowUpFormByCaseNumber failed");
    }
}