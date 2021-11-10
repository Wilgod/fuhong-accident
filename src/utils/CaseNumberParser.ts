import { FormFlow, getLastCaseNo } from "../api/FetchFuHongList";


// Fincial Year start 1st aprile, end 31st March

// export const getLastFormId = (latestItem: any[], key: string): number => {
//     const currentYear = new Date().getFullYear();
//     if (Array.isArray(latestItem) && latestItem.length > 0) {
//         const [data] = latestItem;
//         if (data[key]) {
//             const formIdSplit = data[key].split("-");
//             const isFormIdValid = formIdSplit.length === 3;
//             if (isFormIdValid) {
//                 const [type, year, id] = formIdSplit;
//                 if (year == currentYear) return parseInt(id);
//             }
//         }
//     }
//     return 0;
// }

// 53 -> 053
export const newFormIdParser = (id: number): string => {
    const numberInString = id.toLocaleString(undefined, { useGrouping: false, minimumIntegerDigits: 3 });
    return `${numberInString}`;
}

// 2021 - 2022 => 2122 
export const getCurrentFinancialYear = () => {
    const today = new Date();
    let result = "";
    if ((today.getMonth() + 1) <= 3) { // New Finicial Year start on 1st April
        const start = today.getFullYear() - 1;
        const end = today.getFullYear();
        result = `${start}`.substring(2) + `${end}`.substring(2);
    } else {
        const start = today.getFullYear();
        const end = today.getFullYear() + 1;
        result = `${start}`.substring(2) + `${end}`.substring(2);
    }
    return result;
}

// SUI-2122KHH053
// export const caseNumberParser = (caseType: string, serviceUnit: string, caseOrder: number) => {
//     const financialYear = getCurrentFinancialYear();
//     const stringCaseOrder = newFormIdParser(caseOrder);
//     return `${caseType}-${financialYear}${serviceUnit}${stringCaseOrder}`;
// }


const formFlowShortFormParser = (formFlow: FormFlow) => {
    switch (formFlow) {
        case FormFlow.SERVICE_USER_ACCIDENT:
            return "SUI";
        case FormFlow.OUTSIDER_ACCIDENT:
            return "PUI";
        case FormFlow.OTHER_INCIDENT:
            return "OIN";
        case FormFlow.SPECIAL_INCIDENT_ALLOWANCE:
            return "SID";
        case FormFlow.SPECIAL_INCIDENT_LICENSE:
            return "SIH";
        default:
            throw new Error("formFlowParser Error Exist");
    }
}

export const caseNumberFactory = async (formFlow: FormFlow, serviceUnit: string) => {
    try {
        const lastCase = await getLastCaseNo(formFlow); // case order number
        const currentFinancialYear = getCurrentFinancialYear();
        const caseType = formFlowShortFormParser(formFlow);
        if (lastCase && lastCase.CaseNumber) {
            const caseNumberSplit = lastCase.CaseNumber.split("-");
            if (caseNumberSplit.length === 2) {
                const [caseType, caseNumberRemain] = caseNumberSplit;
                const financialYear = caseNumberRemain.substring(0, 4);
                if (financialYear === currentFinancialYear) {
                    const caseOrder = parseInt(caseNumberRemain.substring(4 + lastCase.ServiceUnit.length));
                    if (isNaN(caseOrder) === false) {
                        return `${caseType}-${currentFinancialYear}${serviceUnit.toUpperCase()}${newFormIdParser(caseOrder + 1)}`;
                    }
                }
            }
        }

        // If there are no last case number / or new finicial year
        return `${caseType}-${currentFinancialYear}${serviceUnit.toUpperCase()}${newFormIdParser(1)}`;
    } catch (err) {
        console.error(err);
        throw new Error("caseNumberFactory error");
    }
}