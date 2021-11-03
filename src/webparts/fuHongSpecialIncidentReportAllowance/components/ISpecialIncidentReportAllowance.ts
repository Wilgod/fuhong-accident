import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ISpecialIncidentReportAllowanceProps {
    context: WebPartContext;
    styles: any;
    formSubmittedHandler(): void;
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
    abusiveNature: string;
}
