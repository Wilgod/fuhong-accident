import { WebPartContext } from '@microsoft/sp-webpart-base';
import { Role } from '../../../utils/RoleParser';

interface IServiceUserAccidentFormStates {
    patientAcciedntScenario: string;
    injuredArea: string[];
    uncomfortable: string[];
    behaviorSwitch: string;
    behavior: string[];
    envFactor: string[];
    personalFactor: string[];
    arrangement: string;
    isStayInHospital: string;
    police: string;
    contingencyMeasure: string;
    cctv: string;
    photo: string;
    serviceUserUncomfort: string;
    accidentLocation: string;
    personalFactorOtherRemark: string;
    enviromentalFactorOtherRemark: string;
    accidentDetail: string;
    treatmentAfterAccident: string;
    medicalArrangementHospital: string;
    medicalArrangementTreatment: string;
    stayInHospitalName: string;
    policeStation: string;
    policeReportNumber: string;
    contingencyMeasureRemark: string;
    contactFamilyRelationship: string;
    contactFamilyName: string;
    afterTreatmentDescription: string;
    scenarioOutsideActivityRemark: string;
    scenarioOtherRemark: string;
    injuredAreaOther: string;
    uncomfortableOtherRemark: string;
    uncomfortableDescription: string;
    behaviorOtherRemark: string;
    serviceCategory:string;
    
}

interface IServiceUserAccidentFormProps {
    context: WebPartContext;
    currentUserRole: Role
    formData: any;
    formSubmittedHandler(): void;
    isPrintMode: boolean;
    siteCollectionUrl:string;
    permissionList:any;
    serviceUserAccidentWorkflow:string;
    print:any;
    cmsUserWorkflow:string;
}

interface IErrorFields {
    
}

export { IServiceUserAccidentFormStates, IErrorFields, IServiceUserAccidentFormProps }