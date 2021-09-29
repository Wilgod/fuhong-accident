import { WebPartContext } from '@microsoft/sp-webpart-base';
import { Role } from '../../utils/RoleParser';


export interface IAccidentFollowUpFormProps {
    context: WebPartContext;
    formType: string;
    styles: any;
    currentUserRole: Role;
    parentFormData: any;
    formSubmittedHandler(): void;
}

export interface IAccidentFollowUpFormStates {
    followUpMeasures: string;
    executionPeriod: string;
    remark: string;
    accidentalFollowUpContinue: string;
}

//FormType
//FollowUpMeasures
//ExecutionPeriod
//Remark
//AccidentalFollowUpContinue
//SM
//SMDate
//SPT
//SPTDate
//SPTComment
//SD
//SDDate
//SDComment
