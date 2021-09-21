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

}

interface IServiceUserAccidentFormProps {
    context: WebPartContext;
    currentUserRole: Role
}

interface IErrorFields {
    accidentTime?: string;
    accidentLocation?: string;
    intellectualDisability?: string;
    partientAcciedntScenario?: string;
    scenarioOutsideActivityRemark?: string;
    scenarioOtherRemark?: string;
    injuredArea?: string;
    injuredAreaOther?: string;
    serviceUserUncomfort?: string;
    uncomfortable?: string;
    uncomfortableDescription?: string;
    uncomfortableOtherRemark?: string;
    behaviorSwitch?: string;
    behavior?: string;
    behaviorOtherRemark?: string;
    photo?: string; // CCTV
    photoChoice?: string;
    cctv?: string;
    envFactor?: string;
    evnFactorOtherRemark?: string;
    personalFactor?: string;
    personalFactorOtherRemark?: string;
    accidentDetail?: string;
    treatmentAfterAccident?: string;
    arrangement?: string;
    medicalArrangementHospital?: string;
    medicalArrangementTreatment?: string;
    isStayInHospital?: string;
    isStayInHospitalName?: string;
    police?: string;
    policeReportNumber?: string;
    policeStation?: string;
    contingencyMeasure?: string;
    contingencyMeasureRemark?: string;
    contactFamilyRelationship?: string;
    contactFamilyName?: string;
    afterTreatmentDescription?: string;
}

export { IServiceUserAccidentFormStates, IErrorFields, IServiceUserAccidentFormProps }