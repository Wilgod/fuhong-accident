export const caseNumberToFormNameParser = (caseType) => {
    switch (caseType) {
        case "SUI":
            return "服務使用者意外";
        case "PUI":
            return "外界人士意外";
        case "SIH":
            return "特別事故(牌照事務處)";
        case "SID":
            return "特別事故(津貼科)";
        case "OIN":
            return "其他事故";
        default:
            return "";
    }
}

/*export const caseNumberToSitePageParser = (caseType) => {
    switch (caseType) {
        case "SUI":
            return "ServiceUserAccident.aspx";
        case "PUI":
            return "OutsidersAccident.aspx";
        case "SID":
            return "SpecialIncidentReportAllowance.aspx";
        case "SIH":
            return "SpecialIncidentReportLicense.aspx";
        case "OIN":
            return "OtherIncidentReport.aspx";
        default:
            return "";
    }
}*/

export const caseNumberToSitePageParser = (caseType) => {
    switch (caseType) {
        case "SUI":
            return "ServiceUserAccident";
        case "PUI":
            return "OutsidersAccident";
        case "SID":
            return "SpecialIncidentReportAllowance";
        case "SIH":
            return "SpecialIncidentReportLicense";
        case "OIN":
            return "OtherIncidentReport";
        default:
            return "";
    }
}

