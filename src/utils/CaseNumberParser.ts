export const getLastFormId = (latestItem: any[], key: string): number => {
    const currentYear = new Date().getFullYear();
    if (Array.isArray(latestItem) && latestItem.length > 0) {
        const [data] = latestItem;
        if (data[key]) {
            const formIdSplit = data[key].split("-");
            const isFormIdValid = formIdSplit.length === 3;
            if (isFormIdValid) {
                const [type, year, id] = formIdSplit;
                if (year == currentYear) return parseInt(id);
            }
        }
    }
    return 0;
}

// 53 -> 053
export const newFormIdParser = (id: number): string => {
    const numberInString = id.toLocaleString(undefined, { useGrouping: false, minimumIntegerDigits: 3 });
    return `${numberInString}`;
}

// 2021 - 2022 => 2122 
export const finicalYearFactory = () => {
    const currentYear = new Date().getFullYear();
    const comingYear = currentYear + 1;
    return `${currentYear}`.substring(2) + `${comingYear}`.substring(2);
}

// SUI-2122KHH053
export const caseNumberParser = (caseType: string, serviceUnit: string, caseOrder: number) => {
    const financialYear = finicalYearFactory();
    const stringCaseOrder = newFormIdParser(caseOrder);
    return `${caseType}-${financialYear}${serviceUnit}${stringCaseOrder}`;
}