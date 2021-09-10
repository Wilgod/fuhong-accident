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

export const newFormIdParser = (type: string, id: number): string => {
    if (!type || !id) return null;
    id += 1
    const currentYear = new Date().getFullYear();
    const numberInString = id.toLocaleString(undefined, { useGrouping: false, minimumIntegerDigits: 6 });
    return `${type}-${currentYear}-${numberInString}`;
}
