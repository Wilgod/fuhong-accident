import { WebPartContext } from '@microsoft/sp-webpart-base';
import { Role } from '../../utils/RoleParser';


export interface IAccidentFollowUpFormProps {
    context: WebPartContext;
    formType: string;
    styles: any;
    currentUserRole: Role;
    parentFormData: any;
    formSubmittedHandler(): void;
    isPrintMode: boolean;
}

export interface IAccidentFollowUpFormStates {
    followUpMeasures: string;
    executionPeriod: string;
    remark: string;
    accidentalFollowUpContinue: boolean;
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
