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
export const pendingSmApprove = (context:any, currentUserRole: Role, status: string, stage: string, spSmInfo:any): boolean => {
    if (stage === "1" && status === "PENDING_SM_APPROVE" && spSmInfo != null && spSmInfo.Email == context.pageContext.legacyPageContext.userEmail) {
        return true;
    }
    return false;
}

//Stage 1 / PENDING_SD_APPROVE
export const pendingSdApprove = (context:any, currentUserRole: Role, status: string, stage: string, spSdInfo:any): boolean => {
    if (stage === "1" && status === "PENDING_SD_APPROVE" && spSdInfo != null && spSdInfo.Email == context.pageContext.legacyPageContext.userEmail) {
        return true;
    }
    return false;
}

export const adminUpdateInsuranceNumber = (currentUserRole: Role, status: string): boolean => {
    if (currentUserRole === Role.ADMIN && status !== "" && status !== "DRAFT") {
        return true;
    }
    return false;
}