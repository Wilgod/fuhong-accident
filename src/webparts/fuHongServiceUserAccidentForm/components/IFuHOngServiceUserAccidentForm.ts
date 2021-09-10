import { WebPartContext } from '@microsoft/sp-webpart-base';

interface IServiceUserAccidentFormStates {
    partientAcciedntScenario: string;
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
    patientWheelchair: string;
    accidentLocation: string;
    patientASD: string;
    intellectualDisability: string;
    personalFactorOtherRemark: string;
    enviromentalFactorOtherRemark: string;
    accidentDetail: string;
    treatmentAfterAccident: string;
    medicalArrangementHospital: string;
    medicalArrangementTreatment: string;
    stayInHospitalName: string;
    policeStation: string;
    policeReportNumber: string;
    contingenyMeasureRemark: string;
    contactFamilyRelationship: string;
    contactFamilyName: string;
    afterTreatmentDescription: string;
    scenarioOutsideActivityRemark: string;
    scenarioOtherRemark: string;
    injuredAreaOther: string;
    uncomfortableOtherRemark: string;
    uncomfortableDescription: string;
}

interface IServiceUserAccidentFormProps {
    context: WebPartContext;
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
}

export { IServiceUserAccidentFormStates, IErrorFields, IServiceUserAccidentFormProps }