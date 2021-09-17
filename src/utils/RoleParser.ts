export enum Role {
    SENIOR_PHYSIOTHERAPIST,
    SERVICE_DIRECTOR,
    SERVICE_MANAGER,
    INVESTIGATOR,
    ADMIN,
    PROFESSIONAL
}


// jobTitle to role
export const jobTitleParser = (jobTitle: string): Role => {
    switch (jobTitle) {
        case "Senior Physiotherapist":
        case "SPT": // for testing
            return Role.SENIOR_PHYSIOTHERAPIST;
        case "Service Director":
        case "SD": // for testing
            return Role.SERVICE_DIRECTOR;
        case "Service Manager":
        case "SM":// for testing
            return Role.SERVICE_MANAGER
        case "Investigator":
            return Role.INVESTIGATOR;
        case "Admin":
            return Role.ADMIN;
        default:
            return Role.PROFESSIONAL;
    }
}