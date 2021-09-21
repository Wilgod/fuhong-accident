import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";


export async function getServiceUnits() {
    try {
        const LIST_NAME = "Service Units";
        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items.get();
        return items;
    } catch (err) {
        console.error(err);
        throw new Error("getServiceUnit failed");
    }
}

// Form 19
export async function getServiceUserAccident() {
    try {
        const LIST_NAME = "Service User Accident";
        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items.getAll();
        console.log(items);
        return items;
    } catch (err) {
        console.error(err);
        throw new Error("getServiceUserAccident failed");
    }
}

export async function getServiceUserAccidentById(id: number) {
    try {
        const LIST_NAME = "Service User Accident";
        const item = await sp.web.lists.getByTitle(LIST_NAME).items.getById(id).get();
        //  console.log(item);
        return item;
    } catch (err) {
        console.error(err);
        throw new Error("getServiceUserAccidentById failed");
    }
}

export async function getLastCaseNo() {
    try {
        const LIST_NAME = "Service User Accident";
        const item = await sp.web.lists.getByTitle(LIST_NAME).items.orderBy("Created", false).top(1).get();
        //  console.log(item);
        return item;
    } catch (err) {
        console.error(err);
        throw new Error("getServiceUserAccidentById failed");
    }
}

// Form 20