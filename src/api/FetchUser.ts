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
    try {
        const result = await sp.web.siteUsers.getByEmail(email).get();
        return result;
    } catch (err) {
        console.error(err);
        throw Error("getUserInfoByEmail error");
    }
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
// SM
export async function getServiceManagersByGraph() {
    try {
        const result = await graph.users.filter(`jobTitle eq 'Service Manager' or jobTitle eq 'Senior Service Manager'`).get();

        return result;
    } catch (err) {
        console.error(err);
        throw Error("Get User AD By Graph error");
    }
}

// SD
export async function getServiceDirectorsByGraph() {
    try {
        const result = await graph.users.filter(`jobTitle eq 'Service Director'`).get();

        return result;
    } catch (err) {
        console.error(err);
        throw Error("Get User AD By Graph error");
    }
}

// SPT
export async function getSeniorPhysiotherapistByGraph() {
    try {
        const result = await graph.users.filter(`jobTitle eq 'Senior Physiotherapist'`).get();

        return result;
    } catch (err) {
        console.error(err);
        throw Error("Get User AD By Graph error");
    }
}