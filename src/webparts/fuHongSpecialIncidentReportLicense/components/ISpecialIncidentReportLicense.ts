import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ISpecialIncidentReportLicenseProps {
    context: WebPartContext;
    styles: any;
    formSubmittedHandler(): void;
}

export interface ISpecialIncidentReportLicenseStates {
    unusalIncident: string;
    police: boolean;
    policeInvestigate: string;
    residentMissing: string;
    residentMissingReason: string;
    residentMissingFound: string;
    residentAbuse: string[];
    abuser: string;
    referrals: string;
    residentAbusePolice: string;
    disputePolice: string;
    seriousMedicalIncident: string;
    otherSeriousIncident: string;
    otherIncident: string;
    tenantGender: string;
    notified: String;
}