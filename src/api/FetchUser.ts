import * as React from 'react'
import { useState, useEffect } from 'react';
import { MSGraphClient } from '@microsoft/sp-http';
import { sp } from "@pnp/sp";
import { Web } from "@pnp/sp/webs"
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { graph } from "@pnp/graph";
import "@pnp/graph/users";

export async function getUserInfoByEmail(email: string) {
    const result = await sp.web.siteUsers.getByEmail(email).get();
    console.log(result);
}

export async function getUserAdByGraph(email: string) {
    try {
        const matchingUser = await graph.users.getById(email)();
        return matchingUser;
    } catch (err) {
        console.error(err);
        throw Error("Get User AD By Graph error");
    }

}