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

        let filterQuery = `Status ne 'DRAFT'`;
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
            .select("CaseNumber", "AccidentTime")
            .filter(filterQuery)
            .getAll();
        return items
    } catch (err) {
        console.error(err);
        throw new Error("getServiceUserAccident error")
    }
}

export async function getNewOutsiderAccident(searchCriteria: ISearchCriteria) {
    try {
        const LIST_NAME = "Outsider Accident Form";

        let filterQuery = `Status ne 'DRAFT'`;
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
            .select("CaseNumber", "AccidentTime")
            .filter(filterQuery)
            .getAll();
        return items
    } catch (err) {
        console.error(err);
        throw new Error("getNewOutsiderAccident error")
    }
}

export async function getNewSpecialIncidentReportLicense(searchCriteria: ISearchCriteria) {
    try {
        const LIST_NAME = "Special Incident Report License";
        let filterQuery = `Status ne 'DRAFT'`;
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
            .select("CaseNumber", "IncidentTime")
            .filter(filterQuery)
            .getAll();
        return items;

    } catch (err) {
        console.error(err);
        throw new Error("getNewSpecialIncidentReportLicense error")
    }
}

export async function getNewSpecialIncidentReportAllowance(searchCriteria: ISearchCriteria) {
    try {
        const LIST_NAME = "Special Incident Report Allowance";
        let filterQuery = `Status ne 'DRAFT'`;
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
            .select("CaseNumber", "IncidentTime")
            .filter(filterQuery)
            .getAll();
        return items

    } catch (err) {
        console.error(err);
        throw new Error("getNewSpecialIncidentReportAllowance error")
    }
}

export async function getNewOtherIncidentReport(searchCriteria: ISearchCriteria) {
    try {
        const LIST_NAME = "Other Incident Report";
        let filterQuery = `Status ne 'DRAFT'`;
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
            .select("CaseNumber", "IncidentTime")
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

        let filterQuery = `Status eq 'CLOSED'`;
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
            .select("CaseNumber", "AccidentTime", "ServiceUserAge", "ServiceUserGender", "Intelligence", "ASD", "ObserveEnvironmentFactor", "ObservePersonalFactor")
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

        let filterQuery = `Status eq 'CLOSED'`;
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

        let filterQuery = `Status eq 'CLOSED'`;
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
            .select("CaseNumber", "IncidentTime")
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

        let filterQuery = `Status eq 'CLOSED'`;
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
            .select("CaseNumber", "IncidentTime", "IncidentCategory", "Abusive_Body", "Abusive_Sexual", "Abusive_Mental", "Abusive_Negligent", "Abusive_Other")
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
        const LIST_NAME = "Accident Report Form";

        let filterQuery = `Title eq 'SERVICE_USER'`;
        // filterQuery = `${filterQuery} and AccidentTime ge '${searchCriteria.startDate.toISOString()}' and AccidentTime le '${searchCriteria.endDate.toISOString()}'`;
        filterQuery = `${filterQuery} and ReceivedDate ge '${searchCriteria.startDate.toISOString()}' and ReceivedDate le '${searchCriteria.endDate.toISOString()}'`;

        // if (Array.isArray(searchCriteria.serviceUnits) && searchCriteria.serviceUnits.indexOf("ALL") === -1 && searchCriteria.serviceUnits.length > 0) {
        //     let su = "";
        //     searchCriteria.serviceUnits.forEach((item, index) => {
        //         if (index === 0) {
        //             su = `ServiceLocation eq '${item}'`;
        //         } else {
        //             su += `ServiceLocation eq '${item}'`;
        //         }

        //         if (index !== searchCriteria.serviceUnits.length - 1) {
        //             su = `${su} or `;
        //         }
        //     })
        //     filterQuery = `${filterQuery} and (${su})`;
        // }

        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            .select("CaseNumber", "AccidentNatureFall", "AccidentNatureChok", "AccidentNatureBehavior", "AccidentNatureEnvFactor", "AccidentNatureOther", "Create")
            .filter(filterQuery)
            .getAll();
        console.log(items);
        return items
    } catch (err) {
        console.error(err);
        throw new Error("getServiceUserAccidentAge error");
    }
}

// Form 20 統計資料 for 外界人士意外
export async function getAccidentReportStatsForOutsiders(searchCriteria: ISearchCriteria) {
    try {
        const LIST_NAME = "Accident Report Form";

        let filterQuery = `Title eq 'OUTSIDERS'`;
        // filterQuery = `${filterQuery} and AccidentTime ge '${searchCriteria.startDate.toISOString()}' and AccidentTime le '${searchCriteria.endDate.toISOString()}'`;
        filterQuery = `${filterQuery} and ReceivedDate ge '${searchCriteria.startDate.toISOString()}' and ReceivedDate le '${searchCriteria.endDate.toISOString()}'`;

        // if (Array.isArray(searchCriteria.serviceUnits) && searchCriteria.serviceUnits.indexOf("ALL") === -1 && searchCriteria.serviceUnits.length > 0) {
        //     let su = "";
        //     searchCriteria.serviceUnits.forEach((item, index) => {
        //         if (index === 0) {
        //             su = `ServiceLocation eq '${item}'`;
        //         } else {
        //             su += `ServiceLocation eq '${item}'`;
        //         }

        //         if (index !== searchCriteria.serviceUnits.length - 1) {
        //             su = `${su} or `;
        //         }
        //     })
        //     filterQuery = `${filterQuery} and (${su})`;
        // }

        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            .select("CaseNumber", "AccidentNatureFall", "AccidentNatureChok", "AccidentNatureBehavior", "AccidentNatureEnvFactor", "AccidentNatureOther",
                "EnvFactorSlipperyGround", "EnvFactorUnevenGround", "EnvFactorObstacleItems", "EnvFactorInsufficientLight", "EnvFactorNotEnoughSpace", "EnvFactorNoise", "EnvFactorCollision", "EnvFactorHurtByOthers", "EnvFactorAssistiveEquipment", "EnvFactorOther",
                "PersonalFactorEmotional", "PersonalFactorImpatient", "PersonalFactorChok", "PersonalFactorUnsteadyWalk", "PersonalFactorTwitch", "PersonalFactorOther")
            .filter(filterQuery)
            .getAll();
        console.log(items);
        return items
    } catch (err) {
        console.error(err);
        throw new Error("getServiceUserAccidentAge error");
    }
}