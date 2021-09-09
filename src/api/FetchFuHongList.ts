import * as React from 'react'
import { useState, useEffect } from 'react';
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";


export async function getServiceUnit() {
    try {
        const LIST_NAME = "Service Units";
        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items.get();
        return items;
    } catch (err) {
        console.error(err);
        throw new Error("Fetch failed");
    }
}

export async function getServiceUserAccident() {
    try {
        const LIST_NAME = "Service User Accident";
        const items: any[] = await sp.web.lists.getByTitle(LIST_NAME).items.get();
        return items;
    } catch (err) {
        console.error(err);
        throw new Error("Fetch failed");
    }
}