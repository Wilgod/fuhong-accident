import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IAccidentFollowUpRepotFormProps {
    context: WebPartContext;
    styles: any;
    formType: string;

}

export interface IAccidentFollowUpRepotFormStates {
    formType: string;
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
    sptComment: string;
    sdComment: string;
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
//EnvFactorAssistiveEquipment
//PersonalFactorOther
//PersonalFactorOtherRemark
