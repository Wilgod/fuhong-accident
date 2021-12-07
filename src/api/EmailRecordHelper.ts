import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";


export async function getEmailRecords() {
    try {
        const LIST_NAME = "Insurance EMail Records";
        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            .select("*", "Author/Id", "Author/EMail", 'Author/Title')
            .expand("Author")
            .getAll();
        console.log(items);
        return items;
    } catch (err) {
        console.error(err);
        throw new Error('getLog error');
    }
}