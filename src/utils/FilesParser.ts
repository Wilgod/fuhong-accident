import { IAttachmentFileInfo } from "@pnp/sp/attachments";

export const attachmentsFilesFormatParser = (attachments: any[], additionalName: string): IAttachmentFileInfo[] => {
    let result: IAttachmentFileInfo[] = [];
    for (let i = 0; i < attachments.length; i++) {
        result.push({
            name: additionalName + "-" + attachments[i].name,
            content: attachments[i]
        });
    }
    return result;
}