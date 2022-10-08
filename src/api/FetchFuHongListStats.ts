import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

export interface ISearchCriteria {
    startDate: Date;
    endDate: Date;
    serviceUnits: string[];
}

// Stats
// General 新發生意外或事故
export async function getNewServiceUserAccident(searchCriteria: ISearchCriteria) {
    try {
        const LIST_NAME = "Service User Accident";

        let filterQuery = `Status ne 'DRAFT' and Stage ne '1'`;
        filterQuery = `${filterQuery} and AccidentTime ge '${searchCriteria.startDate.toISOString()}' and AccidentTime le '${searchCriteria.endDate.toISOString()}'`;

        if (Array.isArray(searchCriteria.serviceUnits) && searchCriteria.serviceUnits.indexOf("ALL") === -1 && searchCriteria.serviceUnits.length > 0) {
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

        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            .select("CaseNumber", "AccidentTime","ServiceUserUnit")
            .filter(filterQuery)
            .getAll();
        return items
    } catch (err) {
        console.error(err);
        throw new Error("getServiceUserAccident error")
    }
}


// Dashboard 新發生意外或事故
export async function getDashboardServiceUserAccident(searchCriteria: ISearchCriteria, startDate: Date, endDate: Date) {
    try {
        const LIST_NAME = "Service User Accident";

        let filterQuery = `Status ne 'DRAFT' and Stage ne '1'`;
        filterQuery = `${filterQuery} and AccidentTime ge '${startDate.toISOString()}' and AccidentTime le '${endDate.toISOString()}'`;

        if (Array.isArray(searchCriteria.serviceUnits) && searchCriteria.serviceUnits.indexOf("ALL") === -1 && searchCriteria.serviceUnits.length > 0) {
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

        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            .select("CaseNumber", "AccidentTime","ServiceUserUnit")
            .filter(filterQuery)
            .getAll();
        return items
    } catch (err) {
        console.error(err);
        throw new Error("getServiceUserAccident error")
    }
}


// General 新發生意外或事故
export async function getNewOutsiderAccident(searchCriteria: ISearchCriteria) {
    try {
        const LIST_NAME = "Outsider Accident Form";

        let filterQuery = `Status ne 'DRAFT' and Stage ne '1'`;
        filterQuery = `${filterQuery} and AccidentTime ge '${searchCriteria.startDate.toISOString()}' and AccidentTime le '${searchCriteria.endDate.toISOString()}'`;

        if (Array.isArray(searchCriteria.serviceUnits) && searchCriteria.serviceUnits.indexOf("ALL") === -1 && searchCriteria.serviceUnits.length > 0) {
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

        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            .select("CaseNumber", "AccidentTime", "ServiceUnit")
            .filter(filterQuery)
            .getAll();
        return items
    } catch (err) {
        console.error(err);
        throw new Error("getNewOutsiderAccident error")
    }
}

// Dashboard 新發生意外或事故
export async function getDashboardOutsiderAccident(searchCriteria: ISearchCriteria, startDate: Date, endDate: Date) {
    try {
        const LIST_NAME = "Outsider Accident Form";

        let filterQuery = `Status ne 'DRAFT' and Stage ne '1'`;
        filterQuery = `${filterQuery} and AccidentTime ge '${startDate.toISOString()}' and AccidentTime le '${endDate.toISOString()}'`;

        if (Array.isArray(searchCriteria.serviceUnits) && searchCriteria.serviceUnits.indexOf("ALL") === -1 && searchCriteria.serviceUnits.length > 0) {
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

        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            .select("CaseNumber", "AccidentTime", "ServiceUnit")
            .filter(filterQuery)
            .getAll();
        return items
    } catch (err) {
        console.error(err);
        throw new Error("getNewOutsiderAccident error")
    }
}

// General 新發生意外或事故
export async function getNewSpecialIncidentReportLicense(searchCriteria: ISearchCriteria) {
    try {
        const LIST_NAME = "Special Incident Report License";
        let filterQuery = `Status ne 'DRAFT' and Stage ne '1'`;
        filterQuery = `${filterQuery} and IncidentTime ge '${searchCriteria.startDate.toISOString()}' and IncidentTime le '${searchCriteria.endDate.toISOString()}'`;

        if (Array.isArray(searchCriteria.serviceUnits) && searchCriteria.serviceUnits.indexOf("ALL") === -1 && searchCriteria.serviceUnits.length > 0) {
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

        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            .select("CaseNumber", "IncidentTime", "ServiceUnit")
            .filter(filterQuery)
            .getAll();
        return items;

    } catch (err) {
        console.error(err);
        throw new Error("getNewSpecialIncidentReportLicense error")
    }
}

// Dashboard 新發生意外或事故
export async function getDashboardSpecialIncidentReportLicense(searchCriteria: ISearchCriteria, startDate: Date, endDate: Date) {
    try {
        const LIST_NAME = "Special Incident Report License";
        let filterQuery = `Status ne 'DRAFT' and Stage ne '1'`;
        filterQuery = `${filterQuery} and IncidentTime ge '${startDate.toISOString()}' and IncidentTime le '${endDate.toISOString()}'`;

        if (Array.isArray(searchCriteria.serviceUnits) && searchCriteria.serviceUnits.indexOf("ALL") === -1 && searchCriteria.serviceUnits.length > 0) {
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

        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            .select("CaseNumber", "IncidentTime", "ServiceUnit")
            .filter(filterQuery)
            .getAll();
        return items;

    } catch (err) {
        console.error(err);
        throw new Error("getNewSpecialIncidentReportLicense error")
    }
}

// General 新發生意外或事故
export async function getNewSpecialIncidentReportAllowance(searchCriteria: ISearchCriteria) {
    try {
        const LIST_NAME = "Special Incident Report Allowance";
        let filterQuery = `Status ne 'DRAFT' and Stage ne '1'`;
        filterQuery = `${filterQuery} and IncidentTime ge '${searchCriteria.startDate.toISOString()}' and IncidentTime le '${searchCriteria.endDate.toISOString()}'`;

        if (Array.isArray(searchCriteria.serviceUnits) && searchCriteria.serviceUnits.indexOf("ALL") === -1 && searchCriteria.serviceUnits.length > 0) {
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

        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            .select("CaseNumber", "IncidentTime", "ServiceUnit")
            .filter(filterQuery)
            .getAll();
        return items

    } catch (err) {
        console.error(err);
        throw new Error("getNewSpecialIncidentReportAllowance error")
    }
}


// Dashboard 新發生意外或事故
export async function getDashboardSpecialIncidentReportAllowance(searchCriteria: ISearchCriteria, startDate: Date, endDate: Date) {
    try {
        const LIST_NAME = "Special Incident Report Allowance";
        let filterQuery = `Status ne 'DRAFT' and Stage ne '1'`;
        filterQuery = `${filterQuery} and IncidentTime ge '${startDate.toISOString()}' and IncidentTime le '${endDate.toISOString()}'`;

        if (Array.isArray(searchCriteria.serviceUnits) && searchCriteria.serviceUnits.indexOf("ALL") === -1 && searchCriteria.serviceUnits.length > 0) {
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

        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            .select("CaseNumber", "IncidentTime", "ServiceUnit")
            .filter(filterQuery)
            .getAll();
        return items

    } catch (err) {
        console.error(err);
        throw new Error("getNewSpecialIncidentReportAllowance error")
    }
}

// General 新發生意外或事故
export async function getNewOtherIncidentReport(searchCriteria: ISearchCriteria) {
    try {
        const LIST_NAME = "Other Incident Report";
        let filterQuery = `Status ne 'DRAFT' and Stage ne '1'`;
        filterQuery = `${filterQuery} and IncidentTime ge '${searchCriteria.startDate.toISOString()}' and IncidentTime le '${searchCriteria.endDate.toISOString()}'`;

        if (Array.isArray(searchCriteria.serviceUnits) && searchCriteria.serviceUnits.indexOf("ALL") === -1 && searchCriteria.serviceUnits.length > 0) {
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

        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            .select("CaseNumber", "IncidentTime", "ServiceUnit")
            .filter(filterQuery)
            .getAll();

        return items;
    } catch (err) {
        console.error(err);
        throw new Error("getNewOtherIncidentReport error")
    }
}

// Dashboard 新發生意外或事故
export async function getDashboardOtherIncidentReport(searchCriteria: ISearchCriteria, startDate: Date, endDate: Date) {
    try {
        const LIST_NAME = "Other Incident Report";
        let filterQuery = `Status ne 'DRAFT' and Stage ne '1'`;
        filterQuery = `${filterQuery} and IncidentTime ge '${startDate.toISOString()}' and IncidentTime le '${endDate.toISOString()}'`;

        if (Array.isArray(searchCriteria.serviceUnits) && searchCriteria.serviceUnits.indexOf("ALL") === -1 && searchCriteria.serviceUnits.length > 0) {
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

        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            .select("CaseNumber", "IncidentTime", "ServiceUnit")
            .filter(filterQuery)
            .getAll();

        return items;
    } catch (err) {
        console.error(err);
        throw new Error("getNewOtherIncidentReport error")
    }
}

// Stats
// Form 19 統計資料 
export async function getServiceUserStats(searchCriteria: ISearchCriteria) {
    try {
        const LIST_NAME = "Service User Accident";

        let filterQuery = `Status ne 'DRAFT' and Stage ne '1'`;
        filterQuery = `${filterQuery} and AccidentTime ge '${searchCriteria.startDate.toISOString()}' and AccidentTime le '${searchCriteria.endDate.toISOString()}'`;

        if (Array.isArray(searchCriteria.serviceUnits) && searchCriteria.serviceUnits.indexOf("ALL") === -1 && searchCriteria.serviceUnits.length > 0) {
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

        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            .select("CaseNumber", "AccidentTime", "ServiceUserAge", "ServiceUserUnit", "ServiceUserGender", "Intelligence", "ASD", "ObserveEnvironmentFactor", "ObservePersonalFactor")
            .filter(filterQuery)
            .getAll();
        return items
    } catch (err) {
        console.error(err);
        throw new Error("getServiceUserAccidentAge error");
    }
}
// Form 22 統計資料
export async function getOutsiderStats(searchCriteria: ISearchCriteria) {
    try {
        const LIST_NAME = "Outsider Accident Form";

        let filterQuery = `Status ne 'DRAFT' and Stage ne '1'`;
        filterQuery = `${filterQuery} and AccidentTime ge '${searchCriteria.startDate.toISOString()}' and AccidentTime le '${searchCriteria.endDate.toISOString()}'`;

        if (Array.isArray(searchCriteria.serviceUnits) && searchCriteria.serviceUnits.indexOf("ALL") === -1 && searchCriteria.serviceUnits.length > 0) {
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

        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            .select("CaseNumber", "AccidentTime", "EnvSlipperyGround", "EnvUnevenGround", "EnvObstacleItems", "EnvInsufficientLight", "EnvNotEnoughSpace", "EnvAcousticStimulation", "EnvCollidedByOthers", "EnvHurtByOthers", "EnvImproperEquip", "EnvOther")
            .filter(filterQuery)
            .getAll();
        return items
    } catch (err) {
        console.error(err);
        throw new Error("getServiceUserAccidentAge error");
    }
}

// Form 24 stats
export async function getLicenseStats(searchCriteria: ISearchCriteria) {
    try {
        const LIST_NAME = "Special Incident Report License";

        let filterQuery = `Status ne 'DRAFT' and Stage ne '1'`;
        filterQuery = `${filterQuery} and IncidentTime ge '${searchCriteria.startDate.toISOString()}' and IncidentTime le '${searchCriteria.endDate.toISOString()}'`;

        if (Array.isArray(searchCriteria.serviceUnits) && searchCriteria.serviceUnits.indexOf("ALL") === -1 && searchCriteria.serviceUnits.length > 0) {
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

        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            .select("CaseNumber", "IncidentTime","ServiceUnit","UnusalIncident", "ResidentMissing", "Conflict", "MedicalIncident", "OtherIncident", "Other","RA_Body", "RA_Mental", "RA_Negligent", "RA_EmbezzleProperty", "RA_Abandoned", "RA_SexualAssault", "RA_Other")
            .filter(filterQuery)
            .getAll();
        return items
    } catch (err) {
        console.error(err);
        throw new Error("getServiceUserAccidentAge error");
    }
}

// Form 25 stats
export async function getAllowanceStats(searchCriteria: ISearchCriteria) {
    try {
        const LIST_NAME = "Special Incident Report Allowance";

        let filterQuery = `Status ne 'DRAFT' and Stage ne '1'`;
        filterQuery = `${filterQuery} and IncidentTime ge '${searchCriteria.startDate.toISOString()}' and IncidentTime le '${searchCriteria.endDate.toISOString()}'`;

        if (Array.isArray(searchCriteria.serviceUnits) && searchCriteria.serviceUnits.indexOf("ALL") === -1 && searchCriteria.serviceUnits.length > 0) {
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

        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            .select("CaseNumber", "IncidentTime","ServiceUnit", "IncidentCategory", "Abusive_Body", "Abusive_Sexual", "Abusive_Mental", "Abusive_Negligent", "Abusive_Other", "Created")
            .filter(filterQuery)
            .getAll();
        console.log(items)
        return items
    } catch (err) {
        console.error(err);
        throw new Error("getServiceUserAccidentAge error");
    }
}

// Form 20 統計資料 
export async function getAccidentReportStats(searchCriteria: ISearchCriteria) {
    try {
        const LIST_NAME = "Service User Accident";

        let filterQuery = `Status ne 'DRAFT' and Stage ne '1'`;
        filterQuery = `${filterQuery} and AccidentTime ge '${searchCriteria.startDate.toISOString()}' and AccidentTime le '${searchCriteria.endDate.toISOString()}'`;

        if (Array.isArray(searchCriteria.serviceUnits) && searchCriteria.serviceUnits.indexOf("ALL") === -1 && searchCriteria.serviceUnits.length > 0) {
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

        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            .select("CaseNumber", "AccidentTime", "ServiceUserUnit", "ServiceUserAge", "ServiceUserGender", "Intelligence", "ASD", "ObserveEnvironmentFactor", "ObservePersonalFactor","AccidentReportFormId")
            .filter(filterQuery)
            .getAll();



        const LIST_NAME1 = "Accident Report Form";

        let filterQuery1 = `Title eq 'SERVICE_USER'`;
        // filterQuery = `${filterQuery} and AccidentTime ge '${searchCriteria.startDate.toISOString()}' and AccidentTime le '${searchCriteria.endDate.toISOString()}'`;
        filterQuery1 = `${filterQuery1} and ReceivedDate ge '${searchCriteria.startDate.toISOString()}' and ReceivedDate le '${searchCriteria.endDate.toISOString()}'`;

        const items1: any[] = await sp.web.lists.getByTitle(LIST_NAME1).items
            .select("CaseNumber", "AccidentNatureFall", "AccidentNatureChok", "AccidentNatureBehavior", "AccidentNatureEnvFactor", "AccidentNatureOther", "Created", "Id")
            .filter(filterQuery1)
            .getAll();

        for (let serviceUser of items) {
            for (let accident of items1) {
                if (serviceUser.AccidentReportFormId != null) {
                    if (serviceUser.AccidentReportFormId == accident.Id) {
                        serviceUser["AccidentNatureFall"] = accident.AccidentNatureFall;
                        serviceUser["AccidentNatureChok"] = accident.AccidentNatureChok;
                        serviceUser["AccidentNatureBehavior"] = accident.AccidentNatureBehavior;
                        serviceUser["AccidentNatureEnvFactor"] = accident.AccidentNatureEnvFactor;
                        serviceUser["AccidentNatureOther"] = accident.AccidentNatureOther;
                    }
                }
                
            }
        }
        return items
    } catch (err) {
        console.error(err);
        throw new Error("getServiceUserAccidentAge error");
    }
}

// Form 20 統計資料 for 外界人士意外
export async function getAccidentReportStatsForOutsiders(searchCriteria: ISearchCriteria) {
    try {
        const LIST_NAME = "Outsider Accident Form";

        let filterQuery = `Status ne 'DRAFT' and Stage ne '1'`;
        filterQuery = `${filterQuery} and AccidentTime ge '${searchCriteria.startDate.toISOString()}' and AccidentTime le '${searchCriteria.endDate.toISOString()}'`;

        if (Array.isArray(searchCriteria.serviceUnits) && searchCriteria.serviceUnits.indexOf("ALL") === -1 && searchCriteria.serviceUnits.length > 0) {
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

        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            .select("CaseNumber", "AccidentTime", "ServiceUnit","EnvSlipperyGround", "EnvUnevenGround", "EnvObstacleItems", "EnvInsufficientLight", "EnvNotEnoughSpace", "EnvAcousticStimulation", "EnvCollidedByOthers", "EnvHurtByOthers", "EnvImproperEquip", "EnvOther", "AccidentReportFormId")
            .filter(filterQuery)
            .getAll();


        //const filterItem = items.filter(item => {return item.AccidentReportFormId != null});
        const LIST_NAME1 = "Accident Report Form";

        let filterQuery1 = `Title eq 'OUTSIDERS'`;
        // filterQuery = `${filterQuery} and AccidentTime ge '${searchCriteria.startDate.toISOString()}' and AccidentTime le '${searchCriteria.endDate.toISOString()}'`;
        filterQuery1 = `${filterQuery1} and ReceivedDate ge '${searchCriteria.startDate.toISOString()}' and ReceivedDate le '${searchCriteria.endDate.toISOString()}'`;

        const items1: any[] = await sp.web.lists.getByTitle(LIST_NAME1).items
            .select("CaseNumber", "AccidentNatureFall", "AccidentNatureChok", "AccidentNatureBehavior", "AccidentNatureEnvFactor", "AccidentNatureOther",
            "EnvFactorSlipperyGround", "EnvFactorUnevenGround", "EnvFactorObstacleItems", "EnvFactorInsufficientLight", "EnvFactorNotEnoughSpace", "EnvFactorNoise", "EnvFactorCollision", "EnvFactorHurtByOthers", "EnvFactorAssistiveEquipment", "EnvFactorOther",
            "PersonalFactorEmotional", "PersonalFactorImpatient", "PersonalFactorChok", "PersonalFactorUnsteadyWalk", "PersonalFactorTwitch", "PersonalFactorOther", "Created", "Id")
            .filter(filterQuery1)
            .getAll();

        for (let outsiderUser of items) {
            for (let accident of items1) {
                if (outsiderUser.AccidentReportFormId != null) {
                    if (outsiderUser.AccidentReportFormId == accident.Id) {
                        outsiderUser["AccidentNatureFall"] = accident.AccidentNatureFall;
                        outsiderUser["AccidentNatureChok"] = accident.AccidentNatureChok;
                        outsiderUser["AccidentNatureBehavior"] = accident.AccidentNatureBehavior;
                        outsiderUser["AccidentNatureEnvFactor"] = accident.AccidentNatureEnvFactor;
                        outsiderUser["AccidentNatureOther"] = accident.AccidentNatureOther;

                        outsiderUser["EnvFactorSlipperyGround"] = accident.EnvFactorSlipperyGround;
                        outsiderUser["EnvFactorUnevenGround"] = accident.EnvFactorUnevenGround;
                        outsiderUser["EnvFactorObstacleItems"] = accident.EnvFactorObstacleItems;
                        outsiderUser["EnvFactorInsufficientLight"] = accident.EnvFactorInsufficientLight;
                        outsiderUser["EnvFactorNotEnoughSpace"] = accident.EnvFactorNotEnoughSpace;
                        outsiderUser["EnvFactorNoise"] = accident.EnvFactorNoise;
                        outsiderUser["EnvFactorCollision"] = accident.EnvFactorCollision;
                        outsiderUser["EnvFactorHurtByOthers"] = accident.EnvFactorHurtByOthers;
                        outsiderUser["EnvFactorAssistiveEquipment"] = accident.EnvFactorAssistiveEquipment;
                        outsiderUser["EnvFactorOther"] = accident.EnvFactorOther;

                        outsiderUser["PersonalFactorEmotional"] = accident.PersonalFactorEmotional;
                        outsiderUser["PersonalFactorImpatient"] = accident.PersonalFactorImpatient;
                        outsiderUser["PersonalFactorChok"] = accident.PersonalFactorChok;
                        outsiderUser["PersonalFactorUnsteadyWalk"] = accident.PersonalFactorUnsteadyWalk;
                        outsiderUser["PersonalFactorTwitch"] = accident.PersonalFactorTwitch;
                        outsiderUser["PersonalFactorOther"] = accident.PersonalFactorOther;
                    }
                }
                
            }
        }
        return items
    } catch (err) {
        console.error(err);
        throw new Error("getServiceUserAccidentAge error");
    }
}