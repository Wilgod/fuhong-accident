import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

// select servicenumber and chinese name only
export async function getServiceUserList() {
    try {
        const LIST_NAME = "Service User";
        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items.select("ServiceNumber", "NameCN", "ID").orderBy("ServiceNumber").getAll();
        return items;
    } catch (err) {
        console.error(err);
        throw new Error("getServiceUserList failed");
    }
}

export async function getServiceUserByServiceNumber(serviceNumber: string) {
    try {
        const LIST_NAME = "Service User";
        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items.filter(`ServiceNumber eq '${serviceNumber}'`).get();
        return items;
    } catch (err) {
        console.error(err);
        throw new Error("getServiceUserByServiceNumber failed");
    }
}

export async function getServiceUserByID(ID: number) {
    try {
        const LIST_NAME = "Service User";
        const items = await sp.web.lists.getByTitle(LIST_NAME).items.getById(ID).get();
        return items;
    } catch (err) {
        console.error(err);
        throw new Error("getServiceUserByID failed");
    }
}
