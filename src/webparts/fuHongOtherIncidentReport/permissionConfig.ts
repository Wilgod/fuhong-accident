import { Role } from "../../utils/RoleParser";

// Draft / init
export const formInitial = (currentUserRole: Role, status: string): boolean => {
    // if ((status === "" || status === "DRAFT") && (currentUserRole === Role.GENERAL || currentUserRole === Role.SERVICE_MANAGER)) {
    //     return true;
    // }
    if ((status === "" || status === "DRAFT" || status ==="SM_VOID")) {
        return true;
    }
    return false;
}

export const formInitBySm = (currentUserEmail: string, smEmail: string, status: string): boolean => {
    if ((status === "" || status === "DRAFT") && currentUserEmail === smEmail) {
        return true;
    }
    return false;
}

//Stage 1 / PENDING_SM_APPROVE
export const pendingSmApprove = (context:any , status: string, stage: string, smInfo:any): boolean => {
    if (stage === "1" && status === "PENDING_SM_APPROVE" && smInfo !=undefined && smInfo.Email != null && smInfo.Email == context.pageContext.legacyPageContext.userEmail) {
        return true;
    }
    return false;
}

//Stage 1 / PENDING_SD_APPROVE
export const pendingSdApprove = (context: any, status: string, stage: string, sdInfo:any): boolean => {
    if (stage === "1" && status === "PENDING_SD_APPROVE" && sdInfo !=undefined && sdInfo.Email != null && sdInfo.Email == context.pageContext.legacyPageContext.userEmail) {
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