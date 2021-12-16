import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

export interface ILog {
    CaseNumber: string;
    AccidentTime: string;
    ServiceUnit: string;
    FormType: string;
    Report: string;
    Action: string;
    RecordId: number;
}

export interface ISearchCriteria {
    startDate: Date;
    endDate: Date;
    searchText: string;
    serviceUnits: string[];
    status: string;
    formType: string[]
}


export async function postLog(body: ILog) {
    try {
        const LIST_NAME = "Log";
        const result = await sp.web.lists.getByTitle(LIST_NAME).items.add(body);
        return result;
    } catch (err) {
        console.error(err);
        throw new Error('postLog error');
    }
}

export async function getLog(searchCriteria: ISearchCriteria) {
    try {
        console.log(searchCriteria);
        const LIST_NAME = "Log";
        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            .select("*", "Author/Id", "Author/EMail", 'Author/Title')
            .expand("Author")
            .getAll();

        return items.sort((a, b) => {
            const aTime = new Date(a.AccidentTime).getTime();
            const bTime = new Date(b.AccidentTime).getTime();
            return bTime - aTime;
        });
    } catch (err) {
        console.error(err);
        throw new Error('getLog error');
    }
}