import { Role } from "../../utils/RoleParser";

//Stage 2 / Initial Form
export const initialForm = (userEMail:any, currentUserRole: Role, parentStatus: string, stage: string, status, formTwentySixData:any): boolean => {
    if (stage === "2" && parentStatus === "PENDING_SM_FILL_IN" && !status && formTwentySixData.SM.EMail == userEMail) {
        return true;
    }
    return false;
}

//Stage 2 / PENDING_SM_FILL_IN
export const pendingSmFillIn = (userEMail:any, currentUserRole: Role, status: string, stage: string, formTwentySixData:any): boolean => {
    console.log("stage",stage, " status", status, " formTwentySixData.length ",Object.keys(formTwentySixData).length )
    if (formTwentySixData.length > 0) {
        console.log("formTwentySixData.SM.EMail",formTwentySixData.SM.EMail , " userEMail",userEMail)
    }
    if (stage === "2" && status === "PENDING_SM_FILL_IN" && Object.keys(formTwentySixData).length > 0 && formTwentySixData.SM.EMail == userEMail) {
        return true;
    }
    return false;
}

//Stage 2 / PENDING_SD_APPROVE
export const pendingSdApprove = (userEMail:any, currentUserRole: Role, status: string, stage: string, formTwentySixData:any): boolean => {
    console.log('formTwentySixData',formTwentySixData)
    if (stage === "2" && status === "PENDING_SD_APPROVE" && Object.keys(formTwentySixData).length > 0 && formTwentySixData.SD.EMail == userEMail) {
        return true;
    }
    return false;
}