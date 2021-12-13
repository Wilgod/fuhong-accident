import { MSGraphClient } from '@microsoft/sp-http';
import { sp, extractWebUrl } from "@pnp/sp";
import { Web } from "@pnp/sp/webs"
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { graph } from "@pnp/graph";
import "@pnp/graph/users";

import { IContextInfo } from "@pnp/sp/sites";

export async function getUserInfoByEmail(email: string) {
    try {
        const result = await sp.web.siteUsers.getByEmail(email).get();
        return result;
    } catch (err) {
        console.error(err);
        throw new Error("getUserInfoByEmail error");
    }
}

export async function getUserInfoByEmailInUserInfoAD(email: string) {
    try {
        const LIST_NAME = "UserInfoAD";
        const URL = "https://fuhongsociety.sharepoint.com/sites/Portal";
        const result = await Web(URL).lists.getByTitle(LIST_NAME).items.filter(`Email eq '${email}'`).top(1).get();
        return result;
    } catch (err) {
        console.error(err);
        throw new Error("getUserInfoByEmailInUserInfoAD error");
    }
}

export async function getDepartmentByShortName(shortName: string) {
    try {
        const LIST_NAME = "SM SD Mapping";
        const URL = "https://fuhongsociety.sharepoint.com/sites/FHS.Portal.dev";
        const result = await Web(URL).lists.getByTitle(LIST_NAME).items.filter(`Title eq '${shortName}'`).top(1).orderBy("Modified", false).get();
        return result;
    } catch (err) {
        console.error(err);
        throw new Error("getDepartmentByShortName error");
    }
}

export async function getAllServiceUnit() {
    try {
        const LIST_NAME = "SM SD Mapping";
        const URL = "https://fuhongsociety.sharepoint.com/sites/FHS.Portal.dev";
        const result = await Web(URL).lists.getByTitle(LIST_NAME).items.select("Title", "su_name_tc", "location").orderBy("Title", true).top(300).get();
        return result;
    } catch (err) {
        console.error(err);
        throw new Error("getDepartmentByShortName error");
    }
}


export async function getUserAdByGraph(email: string) {
    try {
        const matchingUser = await graph.users.getById(email)();
        return matchingUser;
    } catch (err) {
        console.error(err);
        throw new Error("Get User AD By Graph error");
    }
}

// SM
export async function getServiceManagersByGraph() {
    try {
        const result = await graph.users.filter(`jobTitle eq 'Service Manager' or jobTitle eq 'Senior Service Manager'`).get();

        return result;
    } catch (err) {
        console.error(err);
        throw new Error("Get User AD By Graph error");
    }
}

// SD
export async function getServiceDirectorsByGraph() {
    try {
        const result = await graph.users.filter(`jobTitle eq 'Service Director'`).get();

        return result;
    } catch (err) {
        console.error(err);
        throw new Error("getServiceDirectorsByGraph error");
    }
}

// SPT
export async function getSeniorPhysiotherapistByGraph() {
    try {
        let query = `jobTitle eq 'Senior Physiotherapist'`

        // Testing account
        if (true) {
            query += ` or mail eq 't_cms_spt@fuhong.org'`;
        }
        const result = await graph.users.filter(query).get();
        return result;
    } catch (err) {
        console.error(err);
        throw new Error("getSeniorPhysiotherapistByGraph error");
    }
}
