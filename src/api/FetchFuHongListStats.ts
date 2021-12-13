import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

interface ISearchCriteria {
    startDate: Date;
    endDate: Date;
    serviceUnits: string[];
}

// Stats
// Form 19 統計資料 - 年齡 
export async function getServiceUserAccidentAge(searchCriteria: ISearchCriteria) {
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
        console.log(filterQuery);
        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            .select("CaseNumber", "AccidentTime", "ServiceUserAge")
            .filter(filterQuery)
            .getAll();
        return items
    } catch (err) {
        console.error(err);
        throw new Error("");
    }
}
