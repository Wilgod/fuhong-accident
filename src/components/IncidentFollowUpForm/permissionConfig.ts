import { Role } from "../../utils/RoleParser";

//Stage 2 / Initial Form
export const initialForm = (currentUserRole: Role, parentStatus: string, stage: string, status): boolean => {
    if (stage === "2" && parentStatus === "PENDING_SM_FILL_IN" && !status) {
        return true;
    }
    return false;
}

//Stage 2 / PENDING_SM_FILL_IN
export const pendingSmFillIn = (context:any, currentUserRole: Role, status: string, stage: string, formTwentySixData:any): boolean => {
    if (stage === "2" && status === "PENDING_SM_FILL_IN" && formTwentySixData.SM.EMail == context.pageContext.legacyPageContext.userEmail) {
        return true;
    }
    return false;
}

//Stage 2 / PENDING_SD_APPROVE
export const pendingSdApprove = (context:any, currentUserRole: Role, status: string, stage: string, formTwentySixData:any): boolean => {
    if (stage === "2" && status === "PENDING_SD_APPROVE" && formTwentySixData.SD.EMail == context.pageContext.legacyPageContext.userEmail) {
        return true;
    }
    return false;
}