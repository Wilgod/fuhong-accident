import { WebPartContext } from '@microsoft/sp-webpart-base';
import { StringIterator } from 'lodash';
import { Role } from '../../../utils/RoleParser';

export interface IOtherIncidentReportProps {
    context: WebPartContext;
    styles: any;
    formSubmittedHandler(): void;
    currentUserRole: Role;
    formData: any;
    isPrintMode: boolean;
    siteCollectionUrl:string;
    workflow:string;
}

export interface IOtherIncidentReportStates {
    insuranceCaseNo: string;
    incidentLocation: string;
    mediaReports: boolean;
    mediaReportsDescription: string;
    incidentDescription: string;
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
    policeDescription: string;
    policeReportNumber: string;
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
    preparationStaffPhone: string;
}

export interface IErrorFields {

}