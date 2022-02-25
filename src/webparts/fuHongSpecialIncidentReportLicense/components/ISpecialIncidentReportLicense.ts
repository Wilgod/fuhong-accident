import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Role } from "../../../utils/RoleParser";

export interface ISpecialIncidentReportLicenseProps {
    context: WebPartContext;
    styles: any;
    formSubmittedHandler(): void;
    currentUserRole: Role;
    formData: any;
    isPrintMode: boolean;
    siteCollectionUrl:string;
    departmentList:any;
}

export interface ISpecialIncidentReportLicenseStates {
    responsibleName: string;
    insuranceCaseNo: string;
    incidentTime:string;
    homesName: string;
    homesManagerName: string;
    homesManagerTel: string;
    unusalIncident: string;
    unusalIncideintGeneral: "";
    unusalIncideintIncident: "";
    police: boolean;
    policeReportNumber: string;
    policeDatetime: Date;
    policeInvestigate: boolean;
    policeInvestigateDate: Date;
    residentMissing: string;
    residentMissingReason: string;
    missingPoliceDate: Date;
    missingPoliceReportNo: string;
    found: boolean;
    foundDate: Date;
    notYetFoundDayCount: number;
    medicalRecords: string;
    ra_body: boolean;
    ra_mental: boolean;
    ra_negligent: boolean;
    ra_embezzleProperty: boolean;
    ra_abandoned: boolean;
    ra_sexualAssault: boolean;
    ra_other: boolean;
    ra_otherDescription: string;
    abuser: string;
    abuserDescription: string;
    referSocialWorker: boolean;
    referDate: Date;
    referServiceUnit: string;
    abuser_police: boolean;
    abuser_policeDate: Date;
    abuser_policeCaseNo: string;
    conflict: string;
    conflictDescription: string;
    conflict_policeDate: Date;
    conflict_policeCaseNo: string;
    medicalIncident: string;
    mi_description: string;
    otherIncident: string;
    other: boolean;
    otherDescription: string;
    residentName: string;
    residentAge: number;
    residentGender: string;
    residentRoomNo: string;
    reporterName:string;
    reporterJobTitle:string;
    reporterDate:Date;
    guardian: boolean;
    guardianName: string;
    guardianRelation: string;

    guardianDate: Date;
    guardianReason: string;
    guardianStaffName:string;
    guardianStaffJobTitle:string;
    affectedName: string;
    affectedIdCardNo: string;
    affectedGender: string
    affectedAge: number;
    affectedMedicalRecord: string;
    affectedDetail: string;
    affectedFollowUp: string;

}

export interface IErrorFields {

}