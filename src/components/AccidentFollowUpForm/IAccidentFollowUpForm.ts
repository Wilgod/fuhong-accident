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
    formTwentyData:any;
    formTwentyOneData:any;
    workflow:string;
    changeFormTwentyOneDataSelected:any;
    serviceUnitList:any;
    print:any;
}

export interface IAccidentFollowUpFormStates {
    accidentalFollowUpContinue: boolean;
}

export interface IFollowUpAction {
    action: string;
    date: string;
    remark: string;
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
