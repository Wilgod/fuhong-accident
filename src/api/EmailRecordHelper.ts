import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";


export async function getEmailRecords(permission) {
    try {
        const LIST_NAME = "Insurance EMail Records";
        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items
            .select("*", "Author/Id", "Author/EMail", 'Author/Title')
            .expand("Author")
            .getAll();
        console.log(items);
        let allData = [];
        if (permission.indexOf('All') >= 0) {
            allData = items;
        } else {
            for (let item of items) {
                let add = false;
                for (let p of permission) {
                    if (item.ServiceUnit == p) {
                        add = true;
                    }
                }
                if (add) {
                    allData.push(item);
                }
            }
            
        }
        return allData;
    } catch (err) {
        console.error(err);
        throw new Error('getLog error');
    }
}