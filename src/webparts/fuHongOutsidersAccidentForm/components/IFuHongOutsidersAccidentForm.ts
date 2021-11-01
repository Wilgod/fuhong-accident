import { WebPartContext } from '@microsoft/sp-webpart-base';
import { StringIterator } from 'lodash';
import { Role } from '../../../utils/RoleParser';

export interface IOutsidersAccidentFormStates {
    serviceUnit: string;
    serviceUserNameTC: string;
    serviceUserNameEN: string;
    serviceUserAge: number;
    serviceUserGender: string;
    serviceUserIdentity: string;
    serviceUserIdentityOther: string;
    accidentLocation: string;
    envSlipperyGround: boolean;
    envUnevenGround: boolean;
    envObstacleItems: boolean;
    envInsufficientLight: boolean;
    envNotEnoughSpace: boolean;
    envAcousticStimulation: boolean;
    envCollidedByOthers: boolean;
    envHurtByOthers: boolean;
    envImproperEquip: boolean;
    envOther: boolean;
    envOtherDescription: string;
    otherFactor: string;
    accidentDetail: string;
    witness: boolean;
    witnessName: string;
    witnessPhone: string;
    photoRecord: boolean;
    cctvRecord: boolean;
    medicalArrangement: string;
    medicalArrangementHospital: string;
    police: boolean;
    policeStation: string;
    familyContact: boolean;
    familyRelationship: string;
    insuranceCaseNo: string;
}

export interface IErrorFields {

}