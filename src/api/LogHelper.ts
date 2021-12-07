import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

export async function postLog(body: {
    CaseNumber: string;
    AccidentTime: string;
    ServiceUnit: string;
    FormType: string;
    Report: string;
    Action: string;
}) {
    try {
        const LIST_NAME = "Log";
        const result = await sp.web.lists.getByTitle(LIST_NAME).items.add(body);
        return result;
    } catch (err) {
        console.error(err);
        throw new Error('postLog error');
    }
}

export async function getLog() {
    try {
        const LIST_NAME = "Log";
        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            .select("*", "Author/Id", "Author/EMail", 'Author/Title')
            .expand("Author")
            .getAll();

        return items;
    } catch (err) {
        console.error(err);
        throw new Error('getLog error');
    }
}