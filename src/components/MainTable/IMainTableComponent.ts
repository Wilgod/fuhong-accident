import { WebPartContext } from '@microsoft/sp-webpart-base';
export interface IMainTableComponentProps {
    context: WebPartContext;
    dateRange: {
        start: Date,
        end: Date
    },
    searchServiceUnit: string[];
    searchFormType: string[];
    searchFormStatus: string;
    searchExpired: boolean;
    searchKeyword: string;
    adminPermissionBoolean:boolean;
    serviceUnitList:any;
    permissionList:any;
    siteCollectionUrl:string;
    screenType:string;
}
