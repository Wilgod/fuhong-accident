import { WebPartContext } from '@microsoft/sp-webpart-base';
import { Role } from '../../utils/RoleParser';

export interface IAccidentFollowUpRepotFormProps {
    context: WebPartContext;
    styles: any;
    formType: string;
    currentUserRole: Role;
    parentFormData: any;
    formSubmittedHandler(): void;
    isPrintMode: boolean;
    formTwentyData:any;
    workflow:string;
    serviceUnitList:any
    print:any;
}

export interface IAccidentFollowUpRepotFormStates {
    accidentNatureFall: boolean;
    accidentNatureChok: boolean;
    accidentNatureBehavior: boolean;
    accidentNatureEnvFactor: boolean;
    accidentNatureOther: boolean;
    accidentalNatureOtherRemark: string;
    envFactorSlipperyGround: boolean;
    envFactorUnevenGround: boolean;
    envFactorObstacleItems: boolean;
    envFactorInsufficientLight: boolean;
    envFactorNotEnoughSpace: boolean;
    envFactorNoise: boolean;
    envFactorCollision: boolean;
    envFactorHurtByOthers: boolean;
    envFactorAssistiveEquipment: boolean;
    envFactorOther: boolean;
    envFactorOtherRemark: string;
    personalFactorEmotional: boolean;
    personalFactorImpatient: boolean;
    personalFactorChok: boolean;
    personalFactorUnsteadyWalk: boolean;
    personalFactorTwitch: boolean;
    personalFactorOther: boolean;
    personalFactorOtherRemark: string;
    accidentalDiscovery: string;
    accidentCauseFactor: string;
    suggestion: string;
}

export interface IAccidentFollowUpReportFormError {

}

//AccidentNatureFall
//AccidentNatureChok
//AccidentNatureBehavior
//AccidentNatureEnvFactor
//AccidentNatureOther
//EnvFactorSlipperyGround
//EnvFactorUnevenGround
//EnvFactorObstacleItems
//EnvFactorInsufficientLight
//EnvFactorNotEnoughSpace
//EnvFactorAssistiveEquipment
//EnvFactorNoise
//EnvFactorCollision
//EnvFactorHurtByOthers
//EvnFactorOther
//EnvFactorOtherRemark
//PersonalFactorEmotional
//PersonalFactorImpatient
//PersonalFactorChok
//PersonalFactorUnsteadyWalk
//PersonalFactorTwitch
//PersonalFactorOther
//PersonalFactorOtherRemark
