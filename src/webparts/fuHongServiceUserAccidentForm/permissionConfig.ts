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
export const pendingSmApprove = (userEmail:any, currentUserRole: Role, status: string, stage: string, sm:any): boolean => {

    if (stage === "1" && status === "PENDING_SM_APPROVE" && sm != null && sm.Email == userEmail) {
        return true;
    }
    return false;
}

// Stage 1 / PENDING_SPT_APPROVE
export const pendingSptApproveForSPT = (userEmail:any, currentUserRole: Role, status: string, stage: string, sPhysicalTherapyEmail:string): boolean => {
    if (stage === "1" && status === "PENDING_SPT_APPROVE" && sPhysicalTherapyEmail == userEmail) {
        return true;
    }
    /*if (stage === "1" && status === "PENDING_SPT_APPROVE" && currentUserRole === Role.SENIOR_PHYSIOTHERAPIST) {
        return true;
    }*/
    return false;
}

//Stage 1 / PENDING_SPT_APPROVE
export const pendingSptApproveForSD = (userEmail:any, currentUserRole: Role, status: string, stage: string, sptDate:Date, sdInfo:any): boolean => {
    if ((stage === "1" && status === "PENDING_SPT_APPROVE" && sdInfo != null && sdInfo.Email == userEmail) || (stage === "2" && status === "PENDING_INVESTIGATE" &&  sdInfo != null && sdInfo.Email == userEmail && new Date(sptDate.setDate(sptDate.getDate() + 7)) > new Date())) {
        return true;
    }
    return false;
}
// ------------------------------------------
// Stage 2 / PENDING_INVESTIGATE
export const pendingInvestigate = (userEmail:any, investigator: any, status: string, stage: string): boolean => {
    console.log('stage', stage + ', status', status + ', investigator.mail' + investigator);
    if (stage === "2" && status === "PENDING_INVESTIGATE" && investigator != null && investigator.mail == userEmail) {
        return true;
    }
    return false;
}

//Stage 2 /PENDING_SPT_APPROVE
export const stageTwoPendingSptApprove = (userEmail:any, currentUserRole: Role, status: string, stage: string, formTwentyData:any): boolean => {
    //console.log('stage', stage + ', status : ', status + ', userEmail :',context.pageContext.legacyPageContext.userEmail)
    if (stage === "2" && status === "PENDING_SPT_APPROVE" && formTwentyData.SPT.EMail == userEmail) {
        return true;
    }
    return false;
}

//Stage 2 /PENDING_SPT_APPROVE
export const stageTwoPendingSptApproveForSM = (userEmail:any, currentUserRole: Role, status: string, stage: string,sptDate:Date, formTwentyData:any): boolean => {
    let newSptDate = null
    if (sptDate !=null) {
        newSptDate = new Date(sptDate.getFullYear(),sptDate.getMonth(),sptDate.getDate());
    }
    if ((stage === "2" && status === "PENDING_SPT_APPROVE" && formTwentyData.SM.EMail == userEmail) || (stage === "3" && status === "PENDING_SM_FILL_IN" && (newSptDate == null || (newSptDate != null && new Date(newSptDate.setDate(newSptDate.getDate() + 7)) > new Date())) && formTwentyData.SM.EMail == userEmail)) {
        return true;
    }
    return false;
}

//Stage 3 / PENDING_SM_FILL_IN
export const stageThreePendingSmFillIn = (userEmail:any, currentUserRole: Role, status: string, stage: string, formTwentyOneData:any): boolean => {
    if (stage === "3" && status === "PENDING_SM_FILL_IN" && formTwentyOneData.SM.EMail == userEmail) {
        return true;
    }
    return false;
}


//Stage 3 / PENDING_SD_APPROVE
export const stageThreePendingSdApprove = (userEmail:any, currentUserRole: Role, status: string, stage: string, formTwentyOneData:any): boolean => {
    if (stage === "3" && status === "PENDING_SD_APPROVE" && formTwentyOneData.SD.EMail == userEmail) {
        return true;
    }
    return false;
}

//Stage 3 / PENDING_SD_APPROVE
export const stageThreePendingSdApproveForSpt = (userEmail:any, currentUserRole: Role, status: string, stage: string, formTwentyOneData:any, accidentFollowUpFormList:any, selectedAccidentFollowUpFormId:number): boolean => {
    
    if (accidentFollowUpFormList.length > 0 && selectedAccidentFollowUpFormId != null) {
        const data= accidentFollowUpFormList.filter((item) => item.ID === selectedAccidentFollowUpFormId);
        if (stage === "3" && data[0].SMDate !=null && formTwentyOneData.SPT.EMail == userEmail && (data[0].SDDate == null || new Date(new Date(data[0].SDDate).setDate(new Date(data[0].SDDate).getDate() + 7)) > new Date())) {
            return true;
        }
    }
    
    return false;
}