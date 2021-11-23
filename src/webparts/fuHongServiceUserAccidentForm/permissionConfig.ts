import { Role } from "../../utils/RoleParser";

// Draft / init
export const formInitial = (currentUserRole: Role, status: string): boolean => {
    // if ((status === "" || status === "DRAFT") && (currentUserRole === Role.GENERAL || currentUserRole === Role.SERVICE_MANAGER)) {
    //     return true;
    // }
    if ((status === "" || status === "DRAFT")) {
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
export const pendingSmApprove = (currentUserRole: Role, status: string, stage: string): boolean => {
    if (stage === "1" && status === "PENDING_SM_APPROVE" && currentUserRole === Role.SERVICE_MANAGER) {
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
export const pendingSptApproveForSD = (currentUserRole: Role, status: string, stage: string): boolean => {
    if (stage === "1" && status === "PENDING_SPT_APPROVE" && currentUserRole === Role.SERVICE_DIRECTOR) {
        return true;
    }
    return false;
}
// ------------------------------------------
// Stage 2 / PENDING_INVESTIGATE
export const pendingInvestigate = (currentUserRole: Role, status: string, stage: string): boolean => {
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
export const stageTwoPendingSptApproveForSM = (currentUserRole: Role, status: string, stage: string): boolean => {
    if (stage === "2" && status === "PENDING_SPT_APPROVE" && currentUserRole === Role.SERVICE_MANAGER) {
        return true;
    }
    return false;
}

//Stage 3 / PENDING_SM_FILL_IN
export const stageThreePendingSmFillIn = (currentUserRole: Role, status: string, stage: string): boolean => {
    if (stage === "3" && status === "PENDING_SM_FILL_IN" && currentUserRole === Role.SERVICE_MANAGER) {
        return true;
    }
    return false;
}


//Stage 3 / PENDING_SD_APPROVE
export const stageThreePendingSdApprove = (currentUserRole: Role, status: string, stage: string): boolean => {
    if (stage === "3" && status === "PENDING_SD_APPROVE" && currentUserRole === Role.SERVICE_DIRECTOR) {
        return true;
    }
    return false;
}

//Stage 3 / PENDING_SD_APPROVE
export const stageThreePendingSdApproveForSpt = (currentUserRole: Role, status: string, stage: string): boolean => {
    if (stage === "3" && status === "PENDING_SD_APPROVE" && currentUserRole === Role.SENIOR_PHYSIOTHERAPIST) {
        return true;
    }
    return false;
}