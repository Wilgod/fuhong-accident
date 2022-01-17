import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Role } from "../../../utils/RoleParser";

export interface ISpecialIncidentReportAllowanceProps {
    context: WebPartContext;
    styles: any;
    formSubmittedHandler(): void;
    currentUserRole: Role;
    formData: any;
    isPrintMode: boolean;
    siteCollectionUrl:string;
}

export interface IAccidentCategoryAbuseDetails {
    status: string;
    person: string;
}

export interface ISpecialIncidentReportAllowanceStates {
    toDepartment: string;
    incidentLocation: string;
    incidentDescription: string;
    mediaReports: boolean;
    serviceUserGenderOne: string;
    serviceUserGenderTwo: string;
    serviceUserGenderThree: string;
    serviceUserAgeOne: number;
    serviceUserAgeTwo: number;
    serviceUserAgeThree: number;
    staffGenderOne: string;
    staffGenderTwo: string;
    staffGenderThree: string;
    staffPositionOne: string;
    staffPositionTwo: string;
    staffPositionThree: string;
    police: boolean;
    policeReportNumber: string;
    policeDescription: string;
    guardian: boolean;
    guardianDescription: string;
    guardianRelationship: string;
    guardianStaff: string;
    medicalArrangement: boolean;
    medicalArrangmentDetail: string;
    carePlan: boolean;
    carePlanYesDescription: string;
    carePlanNoDescription: string;
    needResponse: boolean;
    needResponseDetail: string;
    immediateFollowUp: string;
    followUpPlan: string;
    accidentCategory: string;
    abusive_body: boolean;
    abusive_sexual: boolean;
    abusive_mental: boolean;
    abusive_negligent: boolean;
    abusive_other: boolean;
    abusiveDescription: string;
}

export interface IErrorFields {

}