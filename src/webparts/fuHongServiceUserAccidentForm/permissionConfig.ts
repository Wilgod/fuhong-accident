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
export const pendingSptApproveForSPT = (context:any, currentUserRole: Role, status: string, stage: string, sPhysicalTherapyEmail:string): boolean => {
    if (stage === "1" && status === "PENDING_SPT_APPROVE" && sPhysicalTherapyEmail == context.pageContext.legacyPageContext.userEmail) {
        return true;
    }
    /*if (stage === "1" && status === "PENDING_SPT_APPROVE" && currentUserRole === Role.SENIOR_PHYSIOTHERAPIST) {
        return true;
    }*/
    return false;
}

//Stage 1 / PENDING_SPT_APPROVE
export const pendingSptApproveForSD = (context:any, currentUserRole: Role, status: string, stage: string, sptDate:Date, sdInfo:any): boolean => {
    if ((stage === "1" && status === "PENDING_SPT_APPROVE" && sdInfo != null && sdInfo.Email == context.pageContext.legacyPageContext.userEmail) || (stage === "2" && status === "PENDING_INVESTIGATE" &&  sdInfo != null && sdInfo.Email == context.pageContext.legacyPageContext.userEmail && new Date(sptDate.setDate(sptDate.getDate() + 7)) > new Date())) {
        return true;
    }
    return false;
}
// ------------------------------------------
// Stage 2 / PENDING_INVESTIGATE
export const pendingInvestigate = (context:any, investigator: any, status: string, stage: string): boolean => {
    if (stage === "2" && status === "PENDING_INVESTIGATE" && investigator != null && investigator.mail == context.pageContext.legacyPageContext.userEmail) {
        return true;
    }
    return false;
}

//Stage 2 /PENDING_SPT_APPROVE
export const stageTwoPendingSptApprove = (context:any, currentUserRole: Role, status: string, stage: string, formTwentyData:any): boolean => {
    //console.log('stage', stage + ', status : ', status + ', userEmail :',context.pageContext.legacyPageContext.userEmail)
    if (stage === "2" && status === "PENDING_SPT_APPROVE" && formTwentyData.SPT.EMail == context.pageContext.legacyPageContext.userEmail) {
        return true;
    }
    return false;
}

//Stage 2 /PENDING_SPT_APPROVE
export const stageTwoPendingSptApproveForSM = (context:any, currentUserRole: Role, status: string, stage: string,sptDate:Date, formTwentyData:any): boolean => {
    let newSptDate = null
    if (sptDate !=null) {
        newSptDate = new Date(sptDate.getFullYear(),sptDate.getMonth(),sptDate.getDate());
    }
    if ((stage === "2" && status === "PENDING_SPT_APPROVE" && formTwentyData.SM.EMail == context.pageContext.legacyPageContext.userEmail) || (stage === "3" && status === "PENDING_SM_FILL_IN" && (newSptDate == null || (newSptDate != null && new Date(newSptDate.setDate(newSptDate.getDate() + 7)) > new Date())) && formTwentyData.SM.EMail == context.pageContext.legacyPageContext.userEmail)) {
        return true;
    }
    return false;
}

//Stage 3 / PENDING_SM_FILL_IN
export const stageThreePendingSmFillIn = (context:any, currentUserRole: Role, status: string, stage: string, formTwentyOneData:any): boolean => {
    if (stage === "3" && status === "PENDING_SM_FILL_IN" && formTwentyOneData.SM.EMail == context.pageContext.legacyPageContext.userEmail) {
        return true;
    }
    return false;
}


//Stage 3 / PENDING_SD_APPROVE
export const stageThreePendingSdApprove = (context:any, currentUserRole: Role, status: string, stage: string, formTwentyOneData:any): boolean => {
    if (stage === "3" && status === "PENDING_SD_APPROVE" && formTwentyOneData.SD.EMail == context.pageContext.legacyPageContext.userEmail) {
        return true;
    }
    return false;
}

//Stage 3 / PENDING_SD_APPROVE
export const stageThreePendingSdApproveForSpt = (context:any, currentUserRole: Role, status: string, stage: string, formTwentyOneData:any, accidentFollowUpFormList:any, selectedAccidentFollowUpFormId:number): boolean => {
    
    if (accidentFollowUpFormList.length > 0 && selectedAccidentFollowUpFormId != null) {
        const data= accidentFollowUpFormList.filter((item) => item.ID === selectedAccidentFollowUpFormId);
        if (stage === "3" && data[0].SMDate !=null && formTwentyOneData.SPT.EMail == context.pageContext.legacyPageContext.userEmail && (data[0].SDDate == null || new Date(new Date(data[0].SDDate).setDate(new Date(data[0].SDDate).getDate() + 7)) > new Date())) {
            return true;
        }
    }
    
    return false;
}