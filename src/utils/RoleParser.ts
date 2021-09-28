export enum Role {
    SENIOR_PHYSIOTHERAPIST,
    SERVICE_DIRECTOR,
    SERVICE_MANAGER,
    INVESTIGATOR,
    ADMIN,
    GENERAL,
    CEO,
}


// jobTitle to role // For testing
export const jobTitleParser = (jobTitle: string): Role => {

    switch (jobTitle) {
        case "Senior Physiotherapist":
        case "SPT": // for testing
            return Role.SENIOR_PHYSIOTHERAPIST;
        case "Service Director":
        case "SD": // for testing
            return Role.SERVICE_DIRECTOR;
        case "Senior Service Manger":
        case "Service Manager":
        case "SM":// for testing
            return Role.SERVICE_MANAGER
        case "Investigator":
            return Role.INVESTIGATOR;
        case "Admin":
            return Role.ADMIN;
        default:
            return Role.GENERAL;
    }
}

export const jobTitleParser2 = (jobTitle: string) => {
    if (jobTitle) {
        jobTitle = jobTitle.toLowerCase();

        if (stringChecker(jobTitle, "service manager")) {
            return Role.SERVICE_MANAGER;
        } else if (stringChecker(jobTitle, "service director")) {
            return Role.SERVICE_DIRECTOR;
        } else if (stringChecker(jobTitle, "senior physiotherapist")) {
            return Role.SENIOR_PHYSIOTHERAPIST;
        } else if (stringChecker(jobTitle, "admin")) {
            return Role.ADMIN;
        } else if (stringChecker(jobTitle, "ceo")) {
            return Role.CEO
        } else if (stringChecker(jobTitle, "social worker")) {
            return Role.GENERAL;
        } else if (stringChecker(jobTitle, "nurse")) {
            return Role.GENERAL;
        } else if (stringChecker(jobTitle, "occupational therapist")) {
            return Role.GENERAL;
        } else if (stringChecker(jobTitle, "warden")) {
            return Role.GENERAL;
        } else if (stringChecker(jobTitle, "physiotherapist")) {
            return Role.GENERAL
        } else {
            return Role.GENERAL
        }
    }
}

const stringChecker = (text: string, targetText: string): boolean => {
    if (text && targetText) return text.indexOf(targetText) > -1;
    return false
}