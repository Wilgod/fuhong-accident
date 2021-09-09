import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

export async function postServiceUserAccident(body: any) {
    try {
        const LIST_NAME = "Service User Accident";
        const result = await sp.web.lists.getByTitle(LIST_NAME).items.add({ "Status": "SAVE" })
        console.log(result);
    } catch (err) {
        console.error(err);
    }
}