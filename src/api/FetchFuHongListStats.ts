import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

// Stats
// Form 19 統計資料 - 年齡 
export async function getServiceUserAccidentAge() {
    try {
        const LIST_NAME = "Service User Accident";
        const filterQuery = `Status eq 'CLOSED'`;
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
