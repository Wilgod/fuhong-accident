import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { Web } from "@pnp/sp/webs";
import { ISearchCriteria } from "../hooks/useFetchAllForms";


export async function getUpdateUserWorkflow(siteCollectionUrl) {
    try {
        //const web = Web(siteCollectionUrl);
        const LIST_NAME = "Workflow Setting";
        const item = await sp.web.lists.getByTitle(LIST_NAME).items.filter("Title eq 'SERVICE_USER_ACCIDENT_UPDATE'").top(1).getAll();
        if (item.length > 0) return item[0].Url;
        return null;
    } catch (err) {
        console.error(err);
        throw new Error("getLastCaseNo failed");
    }
}

export async function getServiceUserAccidentWorkflow() {
    try {
        const LIST_NAME = "Workflow Setting";
        const item = await sp.web.lists.getByTitle(LIST_NAME).items.filter("Title eq 'SERVICE_USER_ACCIDENT'").top(1).getAll();
        if (item.length > 0) return item[0];
        return null;
    } catch (err) {
        console.error(err);
        throw new Error("getLastCaseNo failed");
    }
}

export async function getOutsiderAccidentWorkflow() {
    try {
        const LIST_NAME = "Workflow Setting";
        const item = await sp.web.lists.getByTitle(LIST_NAME).items.filter("Title eq 'OUTSIDER_ACCIDENT'").top(1).getAll();
        if (item.length > 0) return item[0];
        return null;
    } catch (err) {
        console.error(err);
        throw new Error("getLastCaseNo failed");
    }
}

export async function getSpeicalIncidentReportLicenseWorkflow() {
    try {
        const LIST_NAME = "Workflow Setting";
        const item = await sp.web.lists.getByTitle(LIST_NAME).items.filter("Title eq 'SPEICAL_INCIDENT_REPORT_LICENSE'").top(1).getAll();
        if (item.length > 0) return item[0];
        return null;
    } catch (err) {
        console.error(err);
        throw new Error("getLastCaseNo failed");
    }
}

export async function getSpeicalIncidentReportAllowanceWorkflow() {
    try {
        const LIST_NAME = "Workflow Setting";
        const item = await sp.web.lists.getByTitle(LIST_NAME).items.filter("Title eq 'SPEICAL_INCIDENT_REPORT_ALLOWANCE'").top(1).getAll();
        if (item.length > 0) return item[0];
        return null;
    } catch (err) {
        console.error(err);
        throw new Error("getLastCaseNo failed");
    }
}

export async function getOtherIncidentReportWorkflow() {
    try {
        const LIST_NAME = "Workflow Setting";
        const item = await sp.web.lists.getByTitle(LIST_NAME).items.filter("Title eq 'OTHER_INCIDENT_REPORT'").top(1).getAll();
        if (item.length > 0) return item[0];
        return null;
    } catch (err) {
        console.error(err);
        throw new Error("getLastCaseNo failed");
    }
}

export async function getCMSUserWorkflow() {
    try {
        const LIST_NAME = "Workflow Setting";
        const item = await sp.web.lists.getByTitle(LIST_NAME).items.filter("Title eq 'CMS_USER'").top(1).getAll();
        if (item.length > 0) return item[0];
        return null;
    } catch (err) {
        console.error(err);
        throw new Error("getLastCaseNo failed");
    }
}

export async function getCMSUserInformationIdWorkflow() {
    try {
        const LIST_NAME = "Workflow Setting";
        const item = await sp.web.lists.getByTitle(LIST_NAME).items.filter("Title eq 'CMS_USERINFORMATIONID'").top(1).getAll();
        if (item.length > 0) return item[0];
        return null;
    } catch (err) {
        console.error(err);
        throw new Error("getLastCaseNo failed");
    }
}

export async function getCMSUserInformationWorkflow() {
    try {
        const LIST_NAME = "Workflow Setting";
        const item = await sp.web.lists.getByTitle(LIST_NAME).items.filter("Title eq 'CMS_USERINFORMATION'").top(1).getAll();
        if (item.length > 0) return item[0];
        return null;
    } catch (err) {
        console.error(err);
        throw new Error("getLastCaseNo failed");
    }
}

export async function getAdmin() {
    try {
        const LIST_NAME = "Admin";
        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            .select("*", "Admin/Id", "Admin/EMail", 'Admin/Title')
            .expand("Admin")
            .get()
        return items;
    } catch (err) {
        console.log(err);
        throw new Error("getAdmin error")
    }
}

export async function getUserInfo(siteCollectionUrl, email) {
    try {
        const web = Web(siteCollectionUrl);
        const LIST_NAME = "UserInfoAD";
        const items: any[] = await web.lists.getByTitle(LIST_NAME).items.filter(`Email eq '`+email+ `'`).getAll()
        return items;
    } catch (err) {
        console.log(err);
        throw new Error("getAdmin error")
    }
}

export async function getAdminRight() {
    try {
        const LIST_NAME = "Admin";
        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items.select('*', 'Admin/EMail').expand('Admin').getAll();
        return items;
    } catch (err) {
        console.log(err);
        throw new Error("getAdmin error")
    }
}

export async function getAccessRight() {
    try {
        const LIST_NAME = "Access Rights";
        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items.getAll()
        return items;
    } catch (err) {
        console.log(err);
        throw new Error("getAdmin error")
    }
}

export async function getSMSDMapping(siteCollectionUrl,deptId) {
    try {
        const web = Web(siteCollectionUrl);
        const LIST_NAME = "SM SD Mapping";
        const items: any[] = await web.lists.getByTitle(LIST_NAME).items.filter(`Title eq '`+deptId+`'`).get()
        return items;
    } catch (err) {
        console.log(err);
        throw new Error("getAdmin error")
    }
}

export async function getAllSMSDMapping(siteCollectionUrl) {
    try {
        const web = Web(siteCollectionUrl);
        const LIST_NAME = "SM SD Mapping";
        const items: any[] = await web.lists.getByTitle(LIST_NAME).items.getAll();
        let distinct = [];
        for (let item of items) {
            if (distinct.length == 0) {
                distinct.push(item);
            } else {
                let newDistinct = distinct.filter(item1 => item1.su_Eng_name_display == item.su_Eng_name_display);
                if (newDistinct.length == 0) {
                    distinct.push(item);
                }
            }
        }
        return distinct;
    } catch (err) {
        console.log(err);
        throw new Error("getAdmin error")
    }
}

/*export async function getServiceUnits() {
    try {
        const LIST_NAME = "Service Units";
        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items.orderBy("ShortForm", true).getAll();
        return items;
    } catch (err) {
        console.error(err);
        throw new Error("getServiceUnit failed");
    }
}*/

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
        let filterQuery = `(SMId eq ${spId} or SDId eq ${spId} or ReporterId eq ${spId} or InvestigatorId eq ${spId} or SPTId eq ${spId}) and Status ne 'DRAFT'`;
        if (searchCriteria) {

            if (searchCriteria.keyword) {
                filterQuery = `${filterQuery} and (InsuranceCaseNo eq '${searchCriteria.keyword}' or CaseNumber eq '${searchCriteria.keyword}' or ServiceUserNameEN eq '${searchCriteria.keyword}' or ServiceUserNameCN eq '${searchCriteria.keyword}')`;
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
                        su = `ServiceUserUnit eq '${item}'`;
                    } else {
                        su += `ServiceUserUnit eq '${item}'`;
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

export async function getServiceUserAccidentWithoutDarft() {
    try {
        const LIST_NAME = "Service User Accident";
        let filterQuery = `Status ne 'DRAFT'`;
        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            .filter(filterQuery)
            .getAll();

        return items;
    } catch (err) {
        console.error(err);
        throw new Error("getServiceUserAccident failed");
    }
}


export async function getAllServiceUserAccident() {
    try {
        const LIST_NAME = "Service User Accident";
        //let filterQuery = `Status ne 'DRAFT' and Status ne 'CLOSED'`;
        let filterQuery = `Status ne 'CLOSED'`;
        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            .filter(filterQuery)
            .select("*", "Reporter/Id", "Reporter/EMail", 'Reporter/Title', "SD/Id", "SD/EMail", 'SD/Title', "SPT/Id", "SPT/EMail", 'SPT/Title', "SM/Id", "SM/EMail", 'SM/Title', "Investigator/Id", "Investigator/EMail", "Investigator/Title")
            .expand("SM", "SD", "SPT", "Reporter", "Investigator")
            .getAll();

        return items;
    } catch (err) {
        console.error(err);
        throw new Error("getAllServiceUserAccident failed");
    }
}

export async function getAllServiceUserAccidentWithClosed() {
    try {
        const LIST_NAME = "Service User Accident";
        let filterQuery = `Status ne 'DRAFT'`;
        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            .filter(filterQuery)
            .select("*", "Reporter/Id", "Reporter/EMail", 'Reporter/Title', "SD/Id", "SD/EMail", 'SD/Title', "SPT/Id", "SPT/EMail", 'SPT/Title', "SM/Id", "SM/EMail", 'SM/Title', "Investigator/Id", "Investigator/EMail", "Investigator/Title")
            .expand("SM", "SD", "SPT", "Reporter", "Investigator")
            .getAll();

        return items;
    } catch (err) {
        console.error(err);
        throw new Error("getAllServiceUserAccident failed");
    }
}

export async function getServiceUserAccidentBySPId(spId: number,permissionList:any[]) {
    try {
        const LIST_NAME = "Service User Accident";
        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items.
            //filter(`(SMId eq ${spId} or SDId eq ${spId} or AuthorId eq ${spId} or InvestigatorId eq ${spId} or SPTId eq ${spId}) and Status ne 'CLOSED'`)
            filter(`Status ne 'CLOSED'`)
            .select("*", "Reporter/Id", "Reporter/EMail", 'Reporter/Title', "SD/Id", "SD/EMail", 'SD/Title', "SPT/Id", "SPT/EMail", 'SPT/Title', "SM/Id", "SM/EMail", 'SM/Title', "Investigator/Id", "Investigator/EMail", "Investigator/Title")
            .expand("SM", "SD", "SPT", "Reporter", "Investigator")
            .getAll();
        return items.filter((item) => {
            if (item.Status === "DRAFT") {
                if (item.ReporterId === spId) {
                    return true
                } else {
                    return false
                }
            } else {
                let admin = permissionList.filter(p => {return p == 'All'});
                if (admin.length > 0) {
                    return true;
                } else {
                    let permission = permissionList.filter(p => {return p == item.ServiceUserUnit});
                    return permission.length > 0
                }
            }
        });
    } catch (err) {
        console.error(err);
        throw new Error("getServiceUserAccidentBySPId failed");
    }
}


export async function getServiceUserAccidentById(id: number) {
    try {
        const LIST_NAME = "Service User Accident";
        const item = await sp.web.lists.getByTitle(LIST_NAME).items
            .getById(id).select("*", "Author/Id", "Author/EMail", 'Author/Title', "Reporter/Id", "Reporter/EMail", 'Reporter/Title', "ContactFamilyStaff/Id", "ContactFamilyStaff/EMail", 'ContactFamilyStaff/Title', "SD/Id", "SD/EMail", 'SD/Title', "SPT/Id", "SPT/EMail", 'SPT/Title', "SM/Id", "SM/EMail", 'SM/Title', "Investigator/Id", "Investigator/EMail", "Investigator/Title")
            .expand("Reporter", "ContactFamilyStaff", "SM", "SPT", "SD", "Investigator","Author").get();
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

export async function getAllAccidentReportForm() {
    try {
        const LIST_NAME = "Accident Report Form";
        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
        .select("*", "Author/Id", "Author/EMail", 'Author/Title', "SPT/Id", "SPT/EMail", 'SPT/Title', "SM/Id", "SM/EMail", 'SM/Title', "Investigator/Id", "Investigator/EMail", 'Investigator/Title')
        .expand("Author", "SM", "SPT", "Investigator")
        .getAll();

        return items;
    } catch (err) {
        console.error(err);
        throw new Error("getAllAccidentReportForm failed");
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

export async function getAllAccidentFollowUpForm() {
    try {
        const LIST_NAME = "Accident Follow Up Form";
        const item = await sp.web.lists.getByTitle(LIST_NAME).items
            .select("*", "Author/Id", "Author/EMail", 'Author/Title', "SPT/Id", "SPT/EMail", 'SPT/Title', "SM/Id", "SM/EMail", 'SM/Title', "SD/Id", "SD/EMail", 'SD/Title', "Investigator/Id", "Investigator/EMail", 'Investigator/Title')
            .expand("Author", "SM", "SPT", "SD","Investigator")
            .getAll();

        return item;
    } catch (err) {
        console.error(err);
        throw new Error("getAllAccidentReportForm failed");
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
            .select("*", "Author/Id", "Author/EMail", 'Author/Title', "SM/Id", "SM/EMail", 'SM/Title', "SD/Id", "SD/EMail", 'SD/Title', "SPT/Id", "SPT/EMail", 'SPT/Title')
            .expand("Author", "SM", "SD", "SPT")
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
        let filterQuery = `(SMId eq ${spId} or SDId eq ${spId} or ReporterId eq ${spId} or InvestigatorId eq ${spId} or SPTId eq ${spId}) and Status ne 'DRAFT'`;
        if (searchCriteria) {
            if (searchCriteria.keyword) {
                filterQuery = `${filterQuery} and (InsuranceCaseNo eq '${searchCriteria.keyword}' or CaseNumber eq '${searchCriteria.keyword}' or ServiceUserNameTC eq '${searchCriteria.keyword}' or ServiceUserNameEN eq '${searchCriteria.keyword}')`;
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
                        su = `ServiceLocation eq '${item}'`;
                    } else {
                        su += `ServiceLocation eq '${item}'`;
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


export async function getAllOutsiderAccident() {
    try {
        const LIST_NAME = "Outsider Accident Form";
        let filterQuery = `Status ne 'DRAFT' and Status ne 'CLOSED'`;
        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            .filter(filterQuery)
            .select("*", "Reporter/Id", "Reporter/EMail", 'Reporter/Title', "SD/Id", "SD/EMail", 'SD/Title', "SPT/Id", "SPT/EMail", 'SPT/Title', "SM/Id", "SM/EMail", 'SM/Title', "Investigator/Id", "Investigator/EMail", "Investigator/Title")
            .expand("SM", "SD", "SPT", "Reporter", "Investigator")
            .getAll();

        return items;


    } catch (err) {
        console.error(err);
        throw new Error("getOutsiderAccidentBySPId failed");
    }
}

export async function getAllOutsiderAccidentWithClosed() {
    try {
        const LIST_NAME = "Outsider Accident Form";
        let filterQuery = `Status ne 'DRAFT'`;
        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            .filter(filterQuery)
            .select("*", "Reporter/Id", "Reporter/EMail", 'Reporter/Title', "SD/Id", "SD/EMail", 'SD/Title', "SPT/Id", "SPT/EMail", 'SPT/Title', "SM/Id", "SM/EMail", 'SM/Title', "Investigator/Id", "Investigator/EMail", "Investigator/Title")
            .expand("SM", "SD", "SPT", "Reporter", "Investigator")
            .getAll();

        return items;


    } catch (err) {
        console.error(err);
        throw new Error("getOutsiderAccidentBySPId failed");
    }
}

export async function getOutsiderAccidentBySPId(spId: number) {
    try {
        const LIST_NAME = "Outsider Accident Form";
        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            //.filter(`(SMId eq ${spId} or SDId eq ${spId} or ReporterId eq ${spId} or InvestigatorId eq ${spId} or SPTId eq ${spId}) and Status ne 'CLOSED'`)
            .select("*", "Reporter/Id", "Reporter/EMail", 'Reporter/Title', "SD/Id", "SD/EMail", 'SD/Title', "SPT/Id", "SPT/EMail", 'SPT/Title', "SM/Id", "SM/EMail", 'SM/Title', "Investigator/Id", "Investigator/EMail", "Investigator/Title")
            .expand("SM", "SD", "SPT", "Reporter", "Investigator")
            .getAll();
        return items.filter((item) => {
            if (item.Status === "DRAFT") {
                if (item.ReporterId === spId || item.AuthorId === spId) {
                    return true
                } else {
                    return false
                }
            } else {
                return true
            }
        });

    } catch (err) {
        console.error(err);
        throw new Error("getOutsiderAccidentBySPId failed");
    }
}


export async function getOutsiderAccidentById(id: number) {
    try {
        const LIST_NAME = "Outsider Accident Form";
        const item = await sp.web.lists.getByTitle(LIST_NAME).items
            .getById(id).select("*", "Reporter/Id", "Reporter/EMail", 'Reporter/Title', "SD/Id", "SD/EMail", 'SD/Title', "SPT/Id", "SPT/EMail", 'SPT/Title', "SM/Id", "SM/EMail", 'SM/Title', "Investigator/Id", "Investigator/EMail", "Investigator/Title")
            .expand("Reporter", "SM", "SPT", "SD", "Investigator").get();

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
        let filterQuery = `(SMId eq ${spId} or SDId eq ${spId} or ReporterId eq ${spId}) and Status ne 'DRAFT'`;
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
                        su = `ServiceLocation eq '${item}'`;
                    } else {
                        su += `ServiceLocation eq '${item}'`;
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

export async function getAllOtherIncidentReport() {
    try {
        const LIST_NAME = "Other Incident Report";
        let filterQuery = `Status ne 'DRAFT' and Status ne 'CLOSED'`;
        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            .filter(filterQuery)
            .select("*", "Reporter/Id", "Reporter/EMail", 'Reporter/Title', "SD/Id", "SD/EMail", 'SD/Title', "SM/Id", "SM/EMail", 'SM/Title',)
            .expand("SM", "SD", "Reporter")
            .getAll();

        return items;


    } catch (err) {
        console.error(err);
        throw new Error("getAllOtherIncidentReport failed");
    }
}

export async function getAllOtherIncidentReportWithClosed() {
    try {
        const LIST_NAME = "Other Incident Report";
        let filterQuery = `Status ne 'DRAFT'`;
        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            .filter(filterQuery)
            .select("*", "Reporter/Id", "Reporter/EMail", 'Reporter/Title', "SD/Id", "SD/EMail", 'SD/Title', "SM/Id", "SM/EMail", 'SM/Title',)
            .expand("SM", "SD", "Reporter")
            .getAll();

        return items;


    } catch (err) {
        console.error(err);
        throw new Error("getAllOtherIncidentReport failed");
    }
}

export async function getOtherIncidentReportBySPId(spId: number) {
    try {
        const LIST_NAME = "Other Incident Report";
        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            //.filter(`(SMId eq ${spId} or SDId eq ${spId} or Reporter eq ${spId} or AuthorId eq ${spId}) and Status ne 'CLOSED'`)
            .select("*", "Reporter/Id", "Reporter/EMail", 'Reporter/Title', "SD/Id", "SD/EMail", 'SD/Title', "SM/Id", "SM/EMail", 'SM/Title',)
            .expand("SM", "SD", "Reporter")
            .getAll();

        return items.filter((item) => {
            if (item.Status === "DRAFT") {
                if (item.ReporterId === spId || item.AuthorId === spId) {
                    return true
                } else {
                    return false
                }
            } else {
                return true
            }
        });
    } catch (err) {
        console.error(err);
        throw new Error("getOtherIncidentReportBySPId failed");
    }
}

export async function getOtherIncidentReportById(id: number) {
    try {
        const LIST_NAME = "Other Incident Report";
        const items = await sp.web.lists.getByTitle(LIST_NAME).items
            .getById(id).select("*", "Reporter/Id", "Reporter/EMail", 'Reporter/Title', "PreparationStaff/Id", "PreparationStaff/EMail", 'PreparationStaff/Title', "SM/Id", "SM/EMail", 'SM/Title', "SD/Id", "SD/EMail", 'SD/Title',)
            .expand("Reporter", "SM", "PreparationStaff", "SD").get();

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
        let filterQuery = `(SMId eq ${spId} or SDId eq ${spId} or ReporterId eq ${spId}) and Status ne 'DRAFT'`;
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
                        su = `ServiceLocation eq '${item}'`;
                    } else {
                        su += `ServiceLocation eq '${item}'`;
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

export async function getAllSpecialIncidentReportLicense() {
    try {
        const LIST_NAME = "Special Incident Report License";
        let filterQuery = `Status ne 'DRAFT' and Status ne 'CLOSED'`;
        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            .filter(filterQuery)
            .select("*", "Reporter/Id", "Reporter/EMail", 'Reporter/Title', "SD/Id", "SD/EMail", 'SD/Title', "SM/Id", "SM/EMail", 'SM/Title',)
            .expand("SM", "SD", "Reporter")
            .getAll();

        return items;


    } catch (err) {
        console.error(err);
        throw new Error("getAllSpecialIncidentReportLicense failed");
    }
}

export async function getAllSpecialIncidentReportLicenseWithClosed() {
    try {
        const LIST_NAME = "Special Incident Report License";
        let filterQuery = `Status ne 'DRAFT'`;
        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            .filter(filterQuery)
            .select("*", "Reporter/Id", "Reporter/EMail", 'Reporter/Title', "SD/Id", "SD/EMail", 'SD/Title', "SM/Id", "SM/EMail", 'SM/Title',)
            .expand("SM", "SD", "Reporter")
            .getAll();

        return items;


    } catch (err) {
        console.error(err);
        throw new Error("getAllSpecialIncidentReportLicense failed");
    }
}


export async function getSpecialIncidentReportLicenseBySPId(spId: number) {
    try {
        const LIST_NAME = "Special Incident Report License";
        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            .filter(`(SMId eq ${spId} or SDId eq ${spId} or ReporterId eq ${spId}) and Status ne 'CLOSED'`)
            .select("*", "Reporter/Id", "Reporter/EMail", 'Reporter/Title', "SD/Id", "SD/EMail", 'SD/Title', "SM/Id", "SM/EMail", 'SM/Title',)
            .expand("SM", "SD", "Reporter")
            .getAll();

        return items.filter((item) => {
            if (item.Status === "DRAFT") {
                if (item.ReporterId === spId) {
                    return true
                } else {
                    return false
                }
            } else {
                return true
            }
        });
    } catch (err) {
        console.error(err);
        throw new Error("getSpecialIncidentReportLicenseBySPId failed");
    }
}

export async function getSpecialIncidentReportLicenseById(id: number) {
    try {
        const LIST_NAME = "Special Incident Report License";
        const items = await sp.web.lists.getByTitle(LIST_NAME).items
            .getById(id).select("*", "Reporter/Id", "Reporter/EMail", 'Reporter/Title', "SD/Id", "SD/EMail", "SM/Id", "SM/EMail", 'SM/Title', "GuardianStaff/Id", "GuardianStaff/EMail", 'GuardianStaff/Title')
            .expand("Reporter", "SM", "SD", "GuardianStaff").get();

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
        let filterQuery = `(SMId eq ${spId} or SDId eq ${spId} or ReporterId eq ${spId}) and Status ne 'DRAFT'`;
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
                        su = `ServiceLocation eq '${item}'`;
                    } else {
                        su += `ServiceLocation eq '${item}'`;
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

export async function getAllSpecialIncidentReportAllowance() {
    try {
        const LIST_NAME = "Special Incident Report Allowance";
        let filterQuery = `Status ne 'DRAFT' and Status ne 'CLOSED'`;
        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            .filter(filterQuery)
            .select("*", "Reporter/Id", "Reporter/EMail", 'Reporter/Title', "SD/Id", "SD/EMail", 'SD/Title', "SM/Id", "SM/EMail", 'SM/Title',)
            .expand("SM", "SD", "Reporter")
            .getAll();

        return items;


    } catch (err) {
        console.error(err);
        throw new Error("getAllSpecialIncidentReportAllowance failed");
    }
}

export async function getAllSpecialIncidentReportAllowanceWithClosed() {
    try {
        const LIST_NAME = "Special Incident Report Allowance";
        let filterQuery = `Status ne 'DRAFT'`;
        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            .filter(filterQuery)
            .select("*", "Reporter/Id", "Reporter/EMail", 'Reporter/Title', "SD/Id", "SD/EMail", 'SD/Title', "SM/Id", "SM/EMail", 'SM/Title',)
            .expand("SM", "SD", "Reporter")
            .getAll();

        return items;


    } catch (err) {
        console.error(err);
        throw new Error("getAllSpecialIncidentReportAllowance failed");
    }
}

export async function getSpecialIncidentReportAllowanceBySPId(spId: number) {
    try {
        const LIST_NAME = "Special Incident Report Allowance";
        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            //.filter(`(SMId eq ${spId} or SDId eq ${spId} or ReporterId eq ${spId} or AuthorId eq ${spId}) and Status ne 'CLOSED'`)
            .select("*", "Reporter/Id", "Reporter/EMail", 'Reporter/Title', "SD/Id", "SD/EMail", 'SD/Title', "SM/Id", "SM/EMail", 'SM/Title',)
            .expand("SM", "SD", "Reporter")
            .getAll();

        return items.filter((item) => {
            if (item.Status === "DRAFT") {
                if (item.ReporterId === spId || item.AuthorId === spId) {
                    return true
                } else {
                    return false
                }
            } else {
                return true
            }
        });
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
            .select("*", "Reporter/Id", "Reporter/EMail", 'Reporter/Title', "SD/Id", "SD/EMail", "SM/Id", "SM/EMail", 'SM/Title')
            .expand("Reporter", "SM", "SD",)
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
        const LIST_NAME = "Incident Follow Up Form";
        const item = await sp.web.lists.getByTitle(LIST_NAME).items
            .getById(id).select("*", "Author/Id", "Author/EMail", 'Author/Title', "SD/Id", "SD/EMail", "SM/Id", "SM/EMail", 'SM/Title')
            .expand("Author", "SM", "SD",).get();

        return item;
    } catch (err) {
        console.error(err);
        throw new Error("getServiceUserAccident failed");
    }
}

export async function getAllIncidentFollowUpForm() {
    try {
        const LIST_NAME = "Incident Follow Up Form";
        let filterQuery = `Status ne 'CLOSED'`;
        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            .filter(filterQuery)
            .select("*", "Author/Id", "Author/EMail", 'Author/Title', "SD/Id", "SD/EMail", 'SD/Title', "SM/Id", "SM/EMail", 'SM/Title',)
            .expand("SM", "SD", "Author")
            .getAll();

        return items;


    } catch (err) {
        console.error(err);
        throw new Error("getAllSpecialIncidentReportAllowance failed");
    }
}

export async function getAllIncidentFollowUpFormWithClosed() {
    try {
        const LIST_NAME = "Incident Follow Up Form";
        let filterQuery = `Status ne 'DRAFT'`;
        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            .filter(filterQuery)
            .select("*", "Author/Id", "Author/EMail", 'Author/Title', "SD/Id", "SD/EMail", 'SD/Title', "SM/Id", "SM/EMail", 'SM/Title',)
            .expand("SM", "SD", "Author")
            .getAll();

        return items;


    } catch (err) {
        console.error(err);
        throw new Error("getAllSpecialIncidentReportAllowance failed");
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


export async function getInsuranceEMailRecords(caseNumber: string, formType:string, recordId:number) {
    try {
        const LIST_NAME = "Insurance EMail Records";
        const item = await sp.web.lists.getByTitle(LIST_NAME).items
            .filter(`CaseNumber eq '${caseNumber}' and FormType eq '${formType}' and RecordId eq '${recordId}'`)
            .get();
        return item;
    } catch (err) {
        console.error(err);
        throw new Error("getAllIncidentFollowUpFormByCaseNumber failed");
    }
}