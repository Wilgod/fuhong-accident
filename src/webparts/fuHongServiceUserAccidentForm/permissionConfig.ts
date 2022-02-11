import { Role } from "../../utils/RoleParser";

// Draft / init
export const formInitial = (currentUserRole: Role, status: string): boolean => {
    // if ((status === "" || status === "DRAFT") && (currentUserRole === Role.GENERAL || currentUserRole === Role.SERVICE_MANAGER)) {
    //     return true;
    // }
    if ((status === "" || status === "DRAFT" || status === "SM_VOID")) {
        return true;
    }
    return false;
}

//Draft / init
export const formInitBySm = (currentUserEmail: string, smEmail: string, status: string): boolean => {
    if ((status === "" || status === "DRAFT") && currentUserEmail === smEmail) {
        return true;
    }
    return false;
}

//Stage 1 / PENDING_SM_APPROVE
export const pendingSmApprove = (context:any, currentUserRole: Role, status: string, stage: string, sm:any): boolean => {

    if (stage === "1" && status === "PENDING_SM_APPROVE" && currentUserRole === Role.SERVICE_MANAGER && sm != null && sm.Email == context.pageContext.legacyPageContext.userEmail) {
        return true;
    }
    return false;
}

// Stage 1 / PENDING_SPT_APPROVE
export const pendingSptApproveForSPT = (currentUserRole: Role, status: string, stage: string): boolean => {
    if (stage === "1" && status === "PENDING_SPT_APPROVE" && currentUserRole === Role.SENIOR_PHYSIOTHERAPIST) {
        return true;
    }
    return false;
}

//Stage 1 / PENDING_SPT_APPROVE
export const pendingSptApproveForSD = (currentUserRole: Role, status: string, stage: string, sptDate:Date): boolean => {
    debugger;
    if ((stage === "1" && status === "PENDING_SPT_APPROVE" && currentUserRole === Role.SERVICE_DIRECTOR) || (stage === "2" && status === "PENDING_INVESTIGATE" && currentUserRole === Role.SERVICE_DIRECTOR && new Date(sptDate.setDate(sptDate.getDate() + 7)) > new Date())) {
        return true;
    }
    return false;
}
// ------------------------------------------
// Stage 2 / PENDING_INVESTIGATE
export const pendingInvestigate = (context:any, currentUserRole: Role, status: string, stage: string): boolean => {
    if (stage === "2" && status === "PENDING_INVESTIGATE" && currentUserRole === Role.INVESTIGATOR) {
        return true;
    }
    return false;
}

//Stage 2 /PENDING_SPT_APPROVE
export const stageTwoPendingSptApprove = (currentUserRole: Role, status: string, stage: string): boolean => {
    if (stage === "2" && status === "PENDING_SPT_APPROVE" && currentUserRole === Role.SENIOR_PHYSIOTHERAPIST) {
        return true;
    }
    return false;
}

//Stage 2 /PENDING_SPT_APPROVE
export const stageTwoPendingSptApproveForSM = (context:any, currentUserRole: Role, status: string, stage: string,sptDate:Date, formTwentyData:any): boolean => {
    debugger
    if ((stage === "2" && status === "PENDING_SPT_APPROVE" && currentUserRole === Role.SERVICE_MANAGER && formTwentyData.SM.EMail == context.pageContext.legacyPageContext.userEmail) || (stage === "3" && status === "PENDING_SM_FILL_IN" && currentUserRole === Role.SERVICE_MANAGER && new Date(sptDate.setDate(sptDate.getDate() + 7)) > new Date() && formTwentyData.SM.EMail == context.pageContext.legacyPageContext.userEmail)) {
        return true;
    }
    return false;
}

//Stage 3 / PENDING_SM_FILL_IN
export const stageThreePendingSmFillIn = (context:any, currentUserRole: Role, status: string, stage: string, formTwentyOneData:any): boolean => {
    if (stage === "3" && status === "PENDING_SM_FILL_IN" && currentUserRole === Role.SERVICE_MANAGER && formTwentyOneData.SM.EMail == context.pageContext.legacyPageContext.userEmail) {
        return true;
    }
    return false;
}


//Stage 3 / PENDING_SD_APPROVE
export const stageThreePendingSdApprove = (context:any, currentUserRole: Role, status: string, stage: string, formTwentyOneData:any): boolean => {
    debugger
    if (stage === "3" && status === "PENDING_SD_APPROVE" && currentUserRole === Role.SERVICE_DIRECTOR && formTwentyOneData.SD.EMail == context.pageContext.legacyPageContext.userEmail) {
        return true;
    }
    return false;
}

//Stage 3 / PENDING_SD_APPROVE
export const stageThreePendingSdApproveForSpt = (context:any, currentUserRole: Role, status: string, stage: string, formTwentyOneData:any): boolean => {
    if (stage === "3" && status === "PENDING_SD_APPROVE" && currentUserRole === Role.SENIOR_PHYSIOTHERAPIST && formTwentyOneData.SPT.EMail == context.pageContext.legacyPageContext.userEmail) {
        return true;
    }
    return false;
}