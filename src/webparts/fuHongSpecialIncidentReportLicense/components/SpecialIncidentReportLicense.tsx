import * as React from 'react'
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import Header from "../../../components/Header/Header";
import "react-datepicker/dist/react-datepicker.css";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { WebPartContext } from '@microsoft/sp-webpart-base';
import AutosizeTextarea from "../../../components/AutosizeTextarea/AutosizeTextarea";
import { IErrorFields, ISpecialIncidentReportLicenseProps, ISpecialIncidentReportLicenseStates } from './ISpecialIncidentReportLicense';
import { inputProperties } from 'office-ui-fabric-react';
import { createIncidentFollowUpForm, createSpecialIncidentReportAllowance, createSpecialIncidentReportLicense, getSpecialIncidentReportLicenseAllAttachmentById, updateSpecialIncidentReportLicense, updateSpecialIncidentReportLicenseAttachmentById, deleteSpecialIncidentReportLicense } from '../../../api/PostFuHongList';
import { getDepartmentByShortName, getUserInfoByEmailInUserInfoAD, getAllServiceUnit } from '../../../api/FetchUser';
import useUserInfo from '../../../hooks/useUserInfo';
import { IUser } from '../../../interface/IUser';
import useDepartmentMangers from '../../../hooks/useDepartmentManagers';
import { pendingSmApprove, pendingSdApprove, adminUpdateInsuranceNumber, formInitial, formInitBySm } from "../../fuHongSpecialIncidentReportAllowance/permissionConfig";
import { addBusinessDays, addMonths, addDays } from '../../../utils/DateUtils';
import { caseNumberFactory } from '../../../utils/CaseNumberParser';
import { FormFlow, getInsuranceEMailRecords } from '../../../api/FetchFuHongList';
//import useServiceUnit from '../../../hooks/useServiceUnits';
import useUserInfoAD from '../../../hooks/useUserInfoAD';
import useSharePointGroup from '../../../hooks/useSharePointGroup';
import { IAttachmentFileInfo } from '@pnp/sp/attachments';
import { attachmentsFilesFormatParser } from '../../../utils/FilesParser';
import { notifySpecialIncidentLicense, notifyIncidentReject } from '../../../api/Notification';
import { postLog } from '../../../api/LogHelper';
import { generate } from '../../../api/SpecialIncidentReportLicensePrint';
import { Role } from '../../../utils/RoleParser';
import { sp } from "@pnp/sp";
import { Web } from "@pnp/sp/webs"
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { IItem } from "@pnp/sp/items";
import { IItemAddResult } from "@pnp/sp/items";
import { Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as fontawesome from '@fortawesome/free-solid-svg-icons';
import { getQueryParameterString } from '../../../utils/UrlQueryHelper';
export default function SpecialIncidentReportLicense({ context, styles, formSubmittedHandler, currentUserRole, formData, isPrintMode, siteCollectionUrl, departmentList, speicalIncidentReportWorkflow, print, permissionList }: ISpecialIncidentReportLicenseProps) {
    const type: string = getQueryParameterString("type");
    const [formStatus, setFormStatus] = useState("");
    const [formStage, setFormStage] = useState("");
    const [error, setError] = useState<IErrorFields>();
    const [serviceLocation, setServiceLocation] = useState("");
    const [userInfo, setCurrentUserEmail, spUserInfo] = useUserInfo(siteCollectionUrl);
    const [sdInfo, setSDEmail, spSdInfo] = useUserInfo(siteCollectionUrl);
    const [smInfo, setSMEmail, spSmInfo] = useUserInfo(siteCollectionUrl);
    const [reporter, setReporter, reporterPickerInfo] = useUserInfoAD(); // 填報人姓名
    const [reporterJobTitle, setReporterJobTitle] = useState("");
    //const [serviceUnitList, serviceUnit, setServiceUnit] = useServiceUnit();
    const [serviceUnit, setServiceUnit] = useState("");
    const [serviceUserUnitList, setServiceUserUnitList] = useState([]);
    const { departments, setHrDepartment } = useDepartmentMangers(siteCollectionUrl);
    const [selectDepartment, setSelectDepartment] = useState("");

    const [form, setForm] = useState<ISpecialIncidentReportLicenseStates>({
        abuser: "",
        abuserDescription: "",
        abuser_police: undefined,
        abuser_policeCaseNo: "",
        abuser_policeDate: null,
        affectedAge: null,
        affectedDetail: "",
        affectedFollowUp: "",
        affectedGender: "",
        affectedIdCardNo: "",
        affectedMedicalRecord: "",
        affectedName: "",
        conflict: "",
        conflictDescription: "",
        conflict_policeCaseNo: "",
        conflict_policeDate: null,
        establishedCase: null,
        found: undefined,
        foundDate: null,
        notYetFoundDayCount: null,
        medicalRecords: "",
        ra_body: false,
        ra_mental: false,
        ra_negligent: false,
        ra_embezzleProperty: false,
        ra_abandoned: false,
        ra_sexualAssault: false,
        ra_other: false,
        ra_otherDescription: "",
        guardian: undefined,
        guardianName: "",
        guardianRelation: "",
        guardianDate: null,
        guardianReason: "",
        guardianStaffName: "",
        guardianStaffJobTitle: "",
        homesManagerName: "",
        homesName: "",
        homesManagerTel: "",
        insuranceCaseNo: "",
        incidentTime: "",
        medicalIncident: "",
        mi_description: "",
        missingPoliceDate: null,
        missingPoliceReportNo: "",
        other: undefined,
        otherDescription: "",
        otherIncident: "",
        otherIncidentOthersDescription: "",
        police: undefined,
        policeDatetime: null,
        policeInvestigate: undefined,
        policeInvestigateDate: null,
        policeReportNumber: "",
        referDate: null,
        referServiceUnit: "",
        referSocialWorker: undefined,
        residentAge: null,
        residentGender: "",
        residentMissing: "",
        residentMissingReason: "",
        residentName: "",
        residentRoomNo: "",
        responsibleName: "",
        reporterName: "",
        reporterDate: null,
        reporterJobTitle: "",
        unusalIncideintGeneral: "",
        unusalIncideintIncident: "",
        unusalIncident: "",
        submitDate: null,
    });



    const [incidentTime, setIncidentTime] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);


    const [reportDate, setReportDate] = useState(null);
    const [smDate, setSmDate] = useState(null);
    const [smComment, setSmComment] = useState("");
    const [sdDate, setSdDate] = useState(null);
    const [sdComment, setSdComment] = useState("");

    const [notifyStaff, setNotifyStaff, notifyStaffPicker] = useUserInfoAD();
    const [spNotifyStaff, setNotifyStaffEmail] = useSharePointGroup();
    //const [extraFile, setExtraFile] = useState<FileList>(null);
    const [extraFile, setExtraFile] = useState([]);
    const [subpoenaFile, setSubpoenaFile] = useState([]);
    const [uploadedExtraFile, setUploadedExtraFile] = useState([]);
    const [uploadedSubpoenaFile, setUploadedSubpoenaFile] = useState([]);

    const [openModel, setOpenModel] = useState(false);
    const [openSubmitInsuranceModel, setOpenSubmitInsuranceModel] = useState(false);
    const [file, setFile] = useState(null);
    const [uploadButton, setUploadButton] = useState(true);
    const [filename, setFilename] = useState("Choose file");
    const [emailTo, setEmailTo] = useState("");
    const [emailBody, setEmailBody] = useState("");
    const [emailCc, setEmailCc] = useState("");
    const [sendInsuranceEmail, setSendInsuranceEmail] = useState(true);

    const [disabled1, setDisabled1] = useState(false);
    const [disabledEx1, setDisabledEx1] = useState(true);
    const [disabled2, setDisabled2] = useState(false);
    const [disabledEx2, setDisabledEx2] = useState(true);
    const [disabled3, setDisabled3] = useState(false);
    const [disabledEx3, setDisabledEx3] = useState(true);
    const [disabled4, setDisabled4] = useState(false);
    const [disabled5, setDisabled5] = useState(false);
    const [disabled6, setDisabled6] = useState(false);
    const [disabled7, setDisabled7] = useState(false);

    const incomingfile1 = (event) => {
        //const filename = event.target.files[0].name;
        let fileContent = [];
        for (let file of event.target.files) {
            fileContent.push(file)
        }

        setExtraFile(fileContent);
        //setFile(event.target.files[0]);
        //setUploadButton(false);
    }

    const incomingfile2 = (event) => {
        //const filename = event.target.files[0].name;
        let fileContent = [];
        for (let file of event.target.files) {
            fileContent.push(file)
        }

        setSubpoenaFile(fileContent);
        //setFile(event.target.files[0]);
        //setUploadButton(false);
    }
    const uploadFile = async (id: number) => {
        try {
            let att: IAttachmentFileInfo[] = [];
            if (extraFile && extraFile.length > 0) {
                for (let f of extraFile) {
                    att.push({
                        "name": `EXTRA-${f.name}`,
                        "content": f
                    })
                }
                /*att = [...att, {
                    "name": `EXTRA-${extraFile[0].name}`,
                    "content": extraFile[0]
                }];*/
            }

            if (form.unusalIncident === "UNUSAL_INCIDENT_COURT" && subpoenaFile && subpoenaFile.length > 0) {
                for (let f of subpoenaFile) {
                    att.push({
                        "name": `SUBPOENA-${f.name}`,
                        "content": f
                    })
                }
                // att = [...att, ...attachmentsFilesFormatParser(subpoenaFile, "SUBPOENA")];
                /*att = [...att, {
                    "name": `SUBPOENA-${subpoenaFile[0].name}`,
                    "content": subpoenaFile[0]
                }];*/
            }

            await updateSpecialIncidentReportLicenseAttachmentById(id, att);
        } catch (err) {
            console.error(err);
            throw new Error("uploadFile error");
        }

    }

    const CURRENT_USER: IUser = {
        email: context.pageContext.legacyPageContext.userEmail,
        name: context.pageContext.legacyPageContext.userDisplayName,
        id: context.pageContext.legacyPageContext.userId,
    }

    const UploadedFilesComponent = (files: any[]) => files.map((file, index) => {
        const fileName = file.FileName.substr(file.FileName.indexOf("-") + 1);
        return <li key={`${file.FileName}_${index}`}>
            <div className="d-flex">
                <span className="flex-grow-1 text-break">
                    <a href={file.ServerRelativeUrl} target={"_blank"} data-interception="off">{fileName}</a>
                </span>
                {/* <span style={{ fontSize: 18, fontWeight: 700, cursor: "pointer" }} onClick={() => removeHandler(index)}>
                    &times;
                </span> */}
            </div>
        </li>
    })


    const radioButtonHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setForm({ ...form, [name]: value });
    }

    const checkboxHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        const arr = form[name];
        let inputValue = ""
        if (value != arr) {
            inputValue = value
        }
        let police = form.police;
        let policeDatetime = form.policeDatetime;
        let policeReportNumber = form.policeReportNumber;
        let policeInvestigateDate = form.policeInvestigateDate;
        let policeInvestigate = form.policeInvestigate;

        if (name == 'unusalIncident') {
            if (inputValue == "") {
                setDisabled1(false);
                setDisabledEx1(true);
                setDisabled2(false);
                setDisabledEx2(true);
                setDisabled3(false);
                setDisabledEx3(true);
                setDisabled4(false);
                setDisabled5(false);
                setDisabled6(false);
                setDisabled7(false);
                police = undefined;
                policeDatetime = null;
                policeReportNumber = ""
                policeInvestigateDate = null;
                policeInvestigate = undefined
            } else {
                setDisabled1(false);
                setDisabledEx1(false);
                setDisabled2(true);
                setDisabledEx2(true);
                setDisabled3(true);
                setDisabledEx3(true);
                setDisabled4(true);
                setDisabled5(true);
                setDisabled6(true);
                setDisabled7(true);
            }

            let unusalIncideintGeneral = form.unusalIncideintGeneral;
            let unusalIncideintIncident = form.unusalIncideintIncident;
            if (value != "UNUSAL_INCIDENT_GENERAL" || (inputValue == "" && value == "UNUSAL_INCIDENT_GENERAL")) {
                unusalIncideintGeneral = ""
            }
            if (value != "UNUSAL_INCIDENT_OTHER" || (inputValue == "" && value == "UNUSAL_INCIDENT_OTHER")) {
                unusalIncideintIncident = "";
            }

            setForm({
                ...form,
                [name]: inputValue,
                //part 1
                ["unusalIncideintGeneral"]: unusalIncideintGeneral,
                ["unusalIncideintIncident"]: unusalIncideintIncident,
                ["police"]: police,
                ["policeDatetime"]: policeDatetime,
                ["policeReportNumber"]: policeReportNumber,
                ["policeInvestigateDate"]: policeInvestigateDate,
                ["policeInvestigate"]: policeInvestigate,
                //part 2
                ["residentMissing"]: "",
                ["missingPoliceDate"]: null,
                ["missingPoliceReportNo"]: "",
                ["foundDate"]: null,
                ["found"]: undefined,
                ["notYetFoundDayCount"]: null,
                ["medicalRecords"]: "",

                //part3
                ['abuser']: "",
                ['abuserDescription']: "",
                ['referSocialWorker']: undefined,
                ['referDate']: null,
                ['referServiceUnit']: "",
                //part 4
                ["conflict_policeDate"]: null,
                ["conflict_policeCaseNo"]: ""
            });
            if (value != "UNUSAL_INCIDENT_COURT") {
                setSubpoenaFile([])
            }
        } else if (name == 'residentMissing') {
            if (inputValue == "") {
                setDisabled1(false);
                setDisabledEx1(true);
                setDisabled2(false);
                setDisabledEx2(true);
                setDisabled3(false);
                setDisabled4(false);
                setDisabled5(false);
                setDisabled6(false);
                setDisabled7(false);
            } else {
                setDisabled1(true);
                setDisabledEx1(true);
                setDisabled2(false);
                setDisabledEx2(false);
                setDisabled3(true);
                setDisabled4(true);
                setDisabled5(true);
                setDisabled6(true);
                setDisabled7(true);
            }
            let residentMissingReason = form.residentMissingReason;
            if (value != "RESIDENT_MISSING_OUTSIDE" || (inputValue == "" && value == "RESIDENT_MISSING_OUTSIDE")) {
                residentMissingReason = ""
            }
            let found = form.found;
            let foundDate = form.foundDate;
            let notYetFoundDayCount = form.notYetFoundDayCount;
            let medicalRecords = form.medicalRecords;
            let missingPoliceDate = form.missingPoliceDate;
            let missingPoliceReportNo = form.missingPoliceReportNo;
            if (inputValue == "") {
                found = undefined;
                foundDate = null;
                notYetFoundDayCount = null;
                medicalRecords = "";
                missingPoliceDate = null,
                    missingPoliceReportNo = "";
            }
            setForm({
                ...form,
                [name]: inputValue,
                //part 1
                ["unusalIncident"]: "",
                ["unusalIncideintGeneral"]: "",
                ["unusalIncideintIncident"]: "",
                ["police"]: undefined,
                ["policeDatetime"]: null,
                ["policeReportNumber"]: "",
                ["policeInvestigateDate"]: null,
                ["policeInvestigate"]: undefined,
                //part 2
                ["residentMissingReason"]: residentMissingReason,
                ["missingPoliceDate"]: missingPoliceDate,
                ["missingPoliceReportNo"]: missingPoliceReportNo,
                ["foundDate"]: foundDate,
                ["found"]: found,
                ["notYetFoundDayCount"]: notYetFoundDayCount,
                ["medicalRecords"]: medicalRecords,
                //part3
                ['abuser']: "",
                ['abuserDescription']: "",
                ['referSocialWorker']: undefined,
                ['referDate']: null,
                ['referServiceUnit']: "",
                //part 4
                ["conflict_policeDate"]: null,
                ["conflict_policeCaseNo"]: ""
            });
            setSubpoenaFile([])
        } else if (name == 'abuser') {
            setForm({
                ...form,
                [name]: inputValue
            });
        } else if (name == 'conflict') {
            let conflictDescription = form.conflictDescription;
            let conflict_policeDate = form.conflict_policeDate;
            let conflict_policeCaseNo = form.conflict_policeCaseNo;
            if (inputValue == "") {
                conflictDescription = "";
                conflict_policeDate = null;
                conflict_policeCaseNo = ""
                setDisabled1(false);
                setDisabledEx1(true);
                setDisabled2(false);
                setDisabledEx2(true);
                setDisabled3(false);
                setDisabledEx3(true);
                setDisabled4(false);
                setDisabled5(false);
                setDisabled6(false);
                setDisabled7(false);
            } else {
                setDisabled1(true);
                setDisabledEx1(true);
                setDisabled2(true);
                setDisabledEx2(true);
                setDisabled3(true);
                setDisabledEx3(true);
                setDisabled4(false);
                setDisabled5(true);
                setDisabled6(true);
                setDisabled7(true);
            }
            setForm({
                ...form,
                [name]: inputValue,
                ["conflict_policeDate"]: null,
                ["conflictDescription"]: "",
                ["conflict_policeCaseNo"]: "",
                ["missingPoliceDate"]: null,
                ["missingPoliceReportNo"]: "",
                ["medicalRecords"]: ""
            });
        } else if (name == 'medicalIncident') {
            if (inputValue == "") {
                setDisabled1(false);
                setDisabledEx1(true);
                setDisabled2(false);
                setDisabledEx2(true);
                setDisabled3(false);
                setDisabledEx3(true);
                setDisabled4(false);
                setDisabled5(false);
                setDisabled6(false);
                setDisabled7(false);
            } else {
                setDisabled1(true);
                setDisabledEx1(true);
                setDisabled2(true);
                setDisabledEx2(true);
                setDisabled3(true);
                setDisabledEx3(true);
                setDisabled4(true);
                setDisabled5(false);
                setDisabled6(true);
                setDisabled7(true);
            }
            setForm({
                ...form,
                [name]: inputValue,
                //part2
                ["missingPoliceDate"]: null,
                ["missingPoliceReportNo"]: "",
                ["medicalRecords"]: "",
                //part3
                ['abuser']: "",
                ['abuserDescription']: "",
                ['referSocialWorker']: undefined,
                ['referDate']: null,
                ['referServiceUnit']: "",
                //part 4
                ["conflict_policeDate"]: null,
                ["conflict_policeCaseNo"]: ""
            });
        } else if (name == 'otherIncident') {
            if (inputValue == "") {
                setDisabled1(false);
                setDisabledEx1(true);
                setDisabled2(false);
                setDisabledEx2(true);
                setDisabled3(false);
                setDisabledEx3(true);
                setDisabled4(false);
                setDisabled5(false);
                setDisabled6(false);
                setDisabled7(false);
            } else {
                setDisabled1(true);
                setDisabledEx1(true);
                setDisabled2(true);
                setDisabledEx2(true);
                setDisabled3(true);
                setDisabledEx3(true);
                setDisabled4(true);
                setDisabled5(true);
                setDisabled6(false);
                setDisabled7(true);
            }
            setForm({
                ...form,
                [name]: inputValue,
                //part2
                ["missingPoliceDate"]: null,
                ["missingPoliceReportNo"]: "",
                ["medicalRecords"]: "",
                //part3
                ['abuser']: "",
                ['abuserDescription']: "",
                ['referSocialWorker']: undefined,
                ['referDate']: null,
                ['referServiceUnit']: "",
                //part 4
                ["conflict_policeDate"]: null,
                ["conflict_policeCaseNo"]: ""
            });
        } else if (name == 'otherIncident') {
            if (inputValue == "") {
                setDisabled1(false);
                setDisabledEx1(true);
                setDisabled2(false);
                setDisabledEx2(true);
                setDisabled3(false);
                setDisabledEx3(true);
                setDisabled4(false);
                setDisabled5(false);
                setDisabled6(false);
                setDisabled7(false);
            } else {
                setDisabled1(true);
                setDisabledEx1(true);
                setDisabled2(true);
                setDisabledEx2(true);
                setDisabled3(true);
                setDisabledEx3(true);
                setDisabled4(true);
                setDisabled5(true);
                setDisabled6(false);
                setDisabled7(true);
            }
            setForm({
                ...form,
                [name]: inputValue,
                //part2
                ["missingPoliceDate"]: null,
                ["missingPoliceReportNo"]: "",
                ["medicalRecords"]: "",
                //part3
                ['abuser']: "",
                ['abuserDescription']: "",
                ['referSocialWorker']: undefined,
                ['referDate']: null,
                ['referServiceUnit']: "",
                //part 4
                ["conflict_policeDate"]: null,
                ["conflict_policeCaseNo"]: ""
            });
        } else if (name == 'other') {
            if (inputValue == "") {
                setDisabled1(false);
                setDisabledEx1(true);
                setDisabled2(false);
                setDisabledEx2(true);
                setDisabled3(false);
                setDisabledEx3(true);
                setDisabled4(false);
                setDisabled5(false);
                setDisabled6(false);
                setDisabled7(false);
            } else {
                setDisabled1(true);
                setDisabledEx1(true);
                setDisabled2(true);
                setDisabledEx2(true);
                setDisabled3(true);
                setDisabledEx3(true);
                setDisabled4(true);
                setDisabled5(true);
                setDisabled6(false);
                setDisabled7(true);
            }
            setForm({
                ...form,
                [name]: inputValue,
                //part2
                ["missingPoliceDate"]: null,
                ["missingPoliceReportNo"]: "",
                ["medicalRecords"]: "",
                //part3
                ['abuser']: "",
                ['abuserDescription']: "",
                ['referSocialWorker']: undefined,
                ['referDate']: null,
                ['referServiceUnit']: "",
                //part 4
                ["conflict_policeDate"]: null,
                ["conflict_policeCaseNo"]: ""
            });
        }

    }

    const checkboxHandler1 = (event, value) => {
        const name = event.target.name;
        //const value = event.target.value;
        const arr = form[name];
        let inputValue = false
        if (value != arr) {
            inputValue = value
        }

        if (inputValue) {
            setForm({ ...form, [name]: true });
        } else {
            if (name == 'police') {
                setForm({
                    ...form,
                    [name]: false,
                    ["policeReportNumber"]: undefined,
                    ["policeDatetime"]: null,
                });
            } else if (name == 'policeInvestigate') {
                setForm({
                    ...form,
                    [name]: false,
                    ["policeInvestigateDate"]: undefined
                });
            }
        }
    }

    const checkboxHandler2 = (event, value) => {
        const name = event.target.name;
        //const value = event.target.value;
        const arr = form[name];
        let inputValue = false;

        if (value != arr) {
            inputValue = value;
            setDisabled1(true);
            setDisabledEx1(true);
            setDisabled2(true);
            setDisabledEx2(true);
            setDisabled3(true);
            setDisabledEx3(true);
            setDisabled4(true);
            setDisabled5(true);
            setDisabled6(true);
            setDisabled7(false);
            if (inputValue) {
                setForm({
                    ...form,
                    ["other"]: true,
                    //part2
                    ["missingPoliceDate"]: null,
                    ["missingPoliceReportNo"]: "",
                    ["medicalRecords"]: "",
                    //part3
                    ['abuser']: "",
                    ['abuserDescription']: "",
                    ['referSocialWorker']: undefined,
                    ['referDate']: null,
                    ['referServiceUnit']: "",
                    //part 4
                    ["conflict_policeDate"]: null,
                    ["conflict_policeCaseNo"]: ""
                });
            } else {
                setForm({ ...form, ["other"]: false });
            }
        } else {
            setDisabled1(false);
            setDisabledEx1(true);
            setDisabled2(false);
            setDisabledEx2(true);
            setDisabled3(false);
            setDisabledEx3(true);
            setDisabled4(false);
            setDisabled5(false);
            setDisabled6(false);
            setDisabled7(false);
            setForm({ ...form, ["other"]: undefined });
        }


    }
    const checkboxHandlerResidentAbuse = (event) => {
        const name = event.target.name;
        //const value = event.target.value;
        const arr = form[name];
        let trueTotal = 0;
        if (name == "ra_body") {
            if (!arr) {
                trueTotal++;
            }
            if (form.ra_mental || form.ra_negligent || form.ra_embezzleProperty || form.ra_abandoned || form.ra_sexualAssault || form.ra_other) {
                trueTotal++;
            }
        } else if (name == "ra_mental") {
            if (!arr) {
                trueTotal++;
            }
            if (form.ra_body || form.ra_negligent || form.ra_embezzleProperty || form.ra_abandoned || form.ra_sexualAssault || form.ra_other) {
                trueTotal++;
            }
        } else if (name == "ra_negligent") {
            if (!arr) {
                trueTotal++;
            }
            if (form.ra_body || form.ra_mental || form.ra_embezzleProperty || form.ra_abandoned || form.ra_sexualAssault || form.ra_other) {
                trueTotal++;
            }
        } else if (name == "ra_embezzleProperty") {
            if (!arr) {
                trueTotal++;
            }
            if (form.ra_body || form.ra_mental || form.ra_negligent || form.ra_abandoned || form.ra_sexualAssault || form.ra_other) {
                trueTotal++;
            }
        } else if (name == "ra_abandoned") {
            if (!arr) {
                trueTotal++;
            }
            if (form.ra_body || form.ra_mental || form.ra_negligent || form.ra_embezzleProperty || form.ra_sexualAssault || form.ra_other) {
                trueTotal++;
            }
        } else if (name == "ra_sexualAssault") {
            if (!arr) {
                trueTotal++;
            }
            if (form.ra_body || form.ra_mental || form.ra_negligent || form.ra_embezzleProperty || form.ra_abandoned || form.ra_other) {
                trueTotal++;
            }
        } else if (name == "ra_other") {
            if (!arr) {
                trueTotal++;
            }
            if (form.ra_body || form.ra_mental || form.ra_negligent || form.ra_embezzleProperty || form.ra_abandoned || form.ra_sexualAssault) {
                trueTotal++;
            }
        }

        if (trueTotal > 0) {
            setDisabled1(true);
            setDisabledEx1(true);
            setDisabled2(true);
            setDisabledEx2(true);
            setDisabled3(false);
            setDisabledEx3(false);
            setDisabled4(true);
            setDisabled5(true);
            setDisabled6(true);
            setDisabled7(true);
            setForm({
                ...form,
                [name]: !arr,
                ["unusalIncident"]: "",
                ["unusalIncideintGeneral"]: "",
                ["unusalIncideintIncident"]: "",
                ["police"]: undefined,
                ["policeDatetime"]: null,
                ["policeReportNumber"]: "",
                ["policeInvestigateDate"]: null,
                ["policeInvestigate"]: undefined,
                //part 2
                ["residentMissingReason"]: "",
                ["residentMissing"]: "",
                ["missingPoliceDate"]: null,
                ["missingPoliceReportNo"]: "",
                ["foundDate"]: null,
                ["found"]: undefined,
                ["notYetFoundDayCount"]: null,
                ["medicalRecords"]: "",
                //part 4
                ["conflict_policeDate"]: null,
                ["conflict_policeCaseNo"]: ""
            });
        } else {
            setDisabled1(false);
            setDisabledEx1(true);
            setDisabled2(false);
            setDisabledEx2(true);
            setDisabled3(false);
            setDisabledEx3(true);
            setDisabled4(false);
            setDisabled5(false);
            setDisabled6(false);
            setDisabled7(false);
            setForm({
                ...form,
                [name]: !arr,
                ["abuser"]: "",
                ["referSocialWorker"]: undefined,
                ["referDate"]: null,
                ["referServiceUnit"]: "",
                ["abuser_police"]: undefined,
                ["abuser_policeDate"]: null,
                ["abuser_policeCaseNo"]: "",
                ["establishedCase"]: null,
                ['abuserDescription']: "",


            });
        }


    }

    const inputFieldHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setForm({ ...form, [name]: value });
    }


    const dataFactory = () => {
        let body = {};
        let error = {};
        let msg = '';
        body["ServiceUnit"] = serviceUnit
        body["ServiceLocation"] = serviceUnit
        //經辦人 (負責督察姓名)
        if (form.responsibleName) {
            body["ResponsibleName"] = form.responsibleName;
        } else {
            error["ResponsibleName"] = true;
            msg += "請填寫經辦人 (負責督察姓名)\n";
        }

        //殘疾人士院舍名稱
        if (form.homesName) {
            body["HomesName"] = form.homesName;
        } else {
            error["HomesName"] = true;
            msg += "請填寫殘疾人士院舍名稱\n";
        }

        //殘疾人士院舍主管姓名
        if (form.homesManagerName) {
            body["HomesManagerName"] = form.homesManagerName;
        } else {
            error["HomesManagerName"] = true;
            msg += "請填寫殘疾人士院舍主管姓名\n";
        }

        //聯絡電話
        if (form.homesManagerTel) {
            body["HomesManagerTel"] = form.homesManagerTel;
        } else {
            error["HomesManagerTel"] = true;
            msg += "請填寫聯絡電話\n";
        }

        //事故發生日期
        if (incidentTime) {
            body["IncidentTime"] = incidentTime.toISOString();
        } else {
            error["IncidentTime"] = true;
            msg += "請填寫事故發生日期\n";
        }
        //(1) 住客不尋常死亡／事故導致住客嚴重受傷或死亡
        if (form.unusalIncident) {
            body["UnusalIncident"] = form.unusalIncident;
            body["Police"] = form.police;
            body["PoliceInvestigate"] = form.policeInvestigate;
        } else {
            body["UnusalIncident"] = "";
            body["UnusalIncideintGeneral"] = "";
            body["UnusalIncideintIncident"] = "";
            body["PoliceDatetime"] = null;
            body["PoliceReportNumber"] = "";
            body["PoliceInvestigateDate"] = null;
            body["Police"] = false;
            body["PoliceInvestigate"] = false;
        }

        //在院舍內發生事故及送院救治／送院後死亡
        if (form.unusalIncident === "UNUSAL_INCIDENT_GENERAL") {
            if (form.unusalIncideintGeneral) {
                body["UnusalIncideintGeneral"] = form.unusalIncideintGeneral;
            } else {
                error["UnusalIncideintGeneral"] = true;
                msg += "請填寫在院舍內發生事故及送院救治／送院後死亡\n";
            }
        }


        //其他不尋常死亡／受傷
        if (form.unusalIncident === "UNUSAL_INCIDENT_OTHER") {
            if (form.unusalIncideintIncident) {
                body["UnusalIncideintIncident"] = form.unusalIncideintIncident;
            } else {
                error["UnusalIncideintIncident"] = true;
                msg += "請填寫其他不尋常死亡／受傷\n";
            }
        }


        //1a)  已報警求助

        if (form.police === true) {
            if (form.policeDatetime) {
                body["PoliceDatetime"] = form.policeDatetime.toISOString();
            } else {
                error["PoliceDatetime"] = true;
                msg += "請填寫報警日期和時間\n";
            }
            if (form.policeReportNumber) {
                body["PoliceReportNumber"] = form.policeReportNumber;
            } else {
                error["PoliceReportNumber"] = true;
                msg += "請填寫報案編號\n";
            }
        } else if (form.police === undefined) {
            //error["Police"] = true;
        }

        //(1b) 警方到院舍調查日期及時間

        if (form.policeInvestigate === true) {
            if (form.policeInvestigateDate) {
                body["PoliceInvestigateDate"] = form.policeInvestigateDate.toISOString();
            } else {
                error["PoliceInvestigateDate"] = true;
                msg += "請填寫警方到院舍調查日期及時間\n";
            }
        } else if (form.policeInvestigate === undefined) {
            //error["PoliceInvestigate"] = true;
        }


        //(2) 住客失蹤以致需要報警求助 
        if (form.residentMissing) {
            body["ResidentMissing"] = form.residentMissing;
            if (form.residentMissing === "RESIDENT_MISSING_OUTSIDE") {
                if (form.residentMissingReason) {
                    body["ResidentMissingReason"] = form.residentMissingReason;
                } else {
                    error["ResidentMissingReason"] = true;
                    msg += "請填寫住客失蹤以致需要報警求助\n";
                }
            }
            if (form.missingPoliceDate) {
                body["MissingPoliceDate"] = form.missingPoliceDate.toISOString();
            } else {
                error["MissingPoliceDate"] = true;
                msg += "請填寫住客失蹤報警日期\n";
            }
            if (form.missingPoliceReportNo) {
                body["MissingPoliceReportNo"] = form.missingPoliceReportNo;
            } else {
                error["MissingPoliceReportNo"] = true;
                msg += "請填寫住客失蹤報警編號\n";
            }

        } else {
            body["ResidentMissing"] = "";
            body["ResidentMissingReason"] = "";
            body["MissingPoliceDate"] = null;
            body["MissingPoliceReportNo"] = "";
        }


        //(2a)
        body["Found"] = form.found;
        if (form.found === true) {
            if (form.foundDate) {
                body["FoundDate"] = form.foundDate.toISOString();
                body["NotYetFoundDayCount"] = null;
            } else {
                error["FoundDate"] = true;
                msg += "請填寫尋回日期\n";
            }
        } else if (form.found === false) {
            body["Found"] = false;
            body["FoundDate"] = null;
            if (form.notYetFoundDayCount) {
                body["NotYetFoundDayCount"] = form.notYetFoundDayCount;
            } else {
                error["NotYetFoundDayCount"] = true;
                msg += "請填寫由失蹤日計起至呈報日，已失蹤\n";
            }
        } else {
            body["Found"] = false;
            body["NotYetFoundDayCount"] = null;
            body["FoundDate"] = null;
        }

        //(2b) 失蹤住客病歷
        if (form.medicalRecords) {
            body["MedicalRecords"] = form.medicalRecords;
        } else {
            body["MedicalRecords"] = "";
            //error["MedicalRecords"] = true;
        }

        //(3) 院舍內證實／懷疑有住客受虐待／被侵犯私隱
        body["EstablishedCase"] = form.establishedCase
        body["RA_Body"] = form.ra_body;
        body["RA_Mental"] = form.ra_mental;
        body["RA_Negligent"] = form.ra_negligent;
        body["RA_EmbezzleProperty"] = form.ra_embezzleProperty;
        body["RA_Abandoned"] = form.ra_abandoned;
        body["RA_SexualAssault"] = form.ra_sexualAssault;
        body["RA_Other"] = form.ra_other;
        if (form.ra_other === true) {
            if (form.ra_otherDescription) {
                body["RA_OtherDescription"] = form.ra_otherDescription;
            } else {
                error["RA_OtherDescription"] = true;
                msg += "請填寫院舍內證實／懷疑有住客受虐待／被侵犯私隱\n";
            }
        }

        // {/* (3a) 施虐者／懷疑施虐者的身份 */}
        body["Abuser"] = form.abuser;
        body["AbuserDescription"] = form.abuserDescription;
        if (form.abuser) {
            body["Abuser"] = form.abuser;
            if (form.abuser === "ABUSER_OTHER") {
                if (form.abuserDescription) {
                    body["AbuserDescription"] = form.abuserDescription;
                } else {
                    error["AbuserDescription"] = true;
                    msg += "請填寫施虐者／懷疑施虐者的身份\n";
                }
            }
        }

        // {/* (3b)*/}


        if (form.referSocialWorker) {
            if (form.referDate) {
                body["ReferDate"] = form.referDate.toISOString();
            } else {
                error["ReferDate"] = true;
                msg += "請填寫轉介日期\n";
            }
            if (form.referServiceUnit) {
                body["ReferServiceUnit"] = form.referServiceUnit;
            }
        } else if (form.referSocialWorker === undefined) {
            body["ReferDate"] = form.referDate;
            body["ReferServiceUnit"] = form.referServiceUnit;
            body["ReferSocialWorker"] = false;
        }

        // {/* (3c)*/}
        body["Abuser_Police"] = form.abuser_police;
        if (form.abuser_police) {
            if (form.abuser_policeDate) {
                body["Abuser_PoliceDate"] = form.abuser_policeDate.toISOString();
            } else {
                error["Abuser_PoliceDate"] = true;
                msg += "請填寫報警日期\n";
            }
            if (form.abuser_policeCaseNo) {
                body["Abuser_PoliceCaseNo"] = form.abuser_policeCaseNo;
            } else {
                error["Abuser_PoliceCaseNo"] = true;
                msg += "請填寫報案編號\n";
            }
        } else if (form.abuser_police === undefined) {
            body["Abuser_Police"] = false;
        }

        //{/* (4) 院舍內有爭執事件以致需要報警求助 */}
        if (form.conflict) {
            body["Conflict"] = form.conflict;
            if (form.conflict === "DISPUTE_POLICE_OTHER") {
                if (form.conflictDescription) {
                    body["ConflictDescription"] = form.conflictDescription;
                } else {
                    error["ConflictDescription"] = form.conflictDescription;
                    msg += "請填寫院舍內有爭執事件以致需要報警求助\n";
                }
            }
            if (form.conflict_policeDate) {
                body["Conflict_PoliceDate"] = form.conflict_policeDate.toISOString();
            } else {
                error["Conflict_PoliceDate"] = true;
                msg += "請填寫報警日期\n";
            }
            if (form.conflict_policeCaseNo) {
                body["Conflict_PoliceCaseNo"] = form.conflict_policeCaseNo;
            } else {
                error["Conflict_PoliceCaseNo"] = true;
                msg += "請填寫報案編號\n";
            }
        } else {
            body["Conflict"] = "";
            body["ConflictDescription"] = "";
            body["Conflict_PoliceDate"] = null;
            body["Conflict_PoliceCaseNo"] = "";
        }




        // {/* (5) 嚴重醫療／藥物事故（須同時提交「藥物風險管理報告」） */}
        if (form.medicalIncident) {
            body["MedicalIncident"] = form.medicalIncident;
            if (form.medicalIncident === "SERIOUS_MEDICAL_INCIDENT_OTHER") {
                if (form.mi_description) {
                    body["MI_Description"] = form.mi_description;
                } else {
                    error["MI_Description"] = true;
                    msg += "請填寫嚴重醫療／藥物事故（須同時提交「藥物風險管理報告」）\n";
                }
            }
        } else {
            body["MedicalIncident"] = "";
            body["MI_Description"] = "";
        }

        //  {/* (6) 其他重大特別事故以致影響院舍日常運作 */}
        body["OtherIncident"] = form.otherIncident
        if (form.otherIncident == '') {
            body["OtherIncident"] = "";
            body["OtherIncidentOthersDescription"] = "";
        }
        if (form.otherIncident == "OTHER_INCIDENT_OTHERS") {
            if (form.otherIncidentOthersDescription == "") {
                error["OtherIncidentOthersDescription"] = true;
            } else {
                body["OtherIncidentOthersDescription"] = form.otherIncidentOthersDescription;
                msg += "請填寫其他重大特別事故以致影響院舍日常運作\n";
            }
        }

        //(7) 其他
        body["Other"] = form.other;
        if (form.other) {
            if (form.otherDescription) {
                body["OtherDescription"] = form.otherDescription;
            } else {
                error["OtherDescription"] = true;
                msg += "請填寫其他\n";
            }
        } else if (form.other === undefined) {
            body["OtherDescription"] = "";
        }

        //住客及家屬情況
        body["ResidentName"] = form.residentName;
        body["ResidentAge"] = form.residentAge;
        body["ResidentGender"] = form.residentGender;
        body["ResidentRoomNo"] = form.residentRoomNo;
        body["Guardian"] = form.guardian;
        if (form.guardian === true) {
            if (spNotifyStaff && spNotifyStaff.Id) {

                body["GuardianStaffId"] = spNotifyStaff.Id;
            }
        }
        body["GuardianName"] = form.guardianName;
        body["GuardianRelation"] = form.guardianRelation;
        body["GuardianReason"] = form.guardianReason;
        if (form.guardianDate) {
            body["GuarrdianDate"] = form.guardianDate.toISOString();
        }

        // //殘疾人士院舍特別事故報告 (附頁)
        body["AffectedName"] = form.affectedName;

        if (form.affectedIdCardNo == null || form.affectedIdCardNo == '') {
            //error["AffectedIdCardNo"] = true;
        } else if (form.affectedIdCardNo.charAt(0).search(/[^a-zA-Z]+/) != -1) {
            error["AffectedIdCardNo"] = true;
            msg += "請填寫身份證號碼\n";
        } else if (form.affectedIdCardNo.charAt(1).search(/[^0-9]+/) == -1) {
            let mNumber = form.affectedIdCardNo.substr(1, 6);
            if (mNumber.search(/[^0-9]+/) == -1) {
                if (form.affectedIdCardNo.charAt(7) != '(' || form.affectedIdCardNo.charAt(9) != ')') {
                    error["AffectedIdCardNo"] = true;
                } else {
                    body["AffectedIdCardNo"] = form.affectedIdCardNo;
                }

            } else {
                error["AffectedIdCardNo"] = true;
                msg += "請填寫身份證號碼\n";
            }

        } else {
            if (form.affectedIdCardNo.charAt(1).search(/[^a-zA-Z]+/) != -1) {
                error["AffectedIdCardNo"] = true;
                msg += "請填寫身份證號碼\n";
            } else {
                if (form.affectedIdCardNo.charAt(2).search(/[^0-9]+/) == -1) {
                    let mNumber = form.affectedIdCardNo.substr(2, 6);
                    if (mNumber.search(/[^0-9]+/) == -1) {
                        if (form.affectedIdCardNo.charAt(8) != '(' || form.affectedIdCardNo.charAt(10) != ')') {
                            error["AffectedIdCardNo"] = true;
                            msg += "請填寫身份證號碼\n";
                        } else {
                            body["AffectedIdCardNo"] = form.affectedIdCardNo;
                        }
                    } else {
                        error["AffectedIdCardNo"] = true;
                        msg += "請填寫身份證號碼\n";
                    }
                }
            }
        }
        body["AffectedGender"] = form.affectedGender;
        body["AffectedAge"] = form.affectedAge;
        body["AffectedMedicalRecord"] = form.affectedMedicalRecord;
        body["AffectedDetail"] = form.affectedDetail;
        body["AffectedFollowUp"] = form.affectedFollowUp;

        return [body, error, msg];
    }

    const submitHandler = (event) => {
        //event.preventDefault();
        const [body, error, msg] = dataFactory();
        body['SubmitDate'] = new Date().toISOString();
        body["ReporterId"] = CURRENT_USER.id;
        console.log(body);
        console.log(error);
        debugger
        if (Object.keys(error).length > 0) {
            setError(error);
            alert(msg);
        } else {
            if (formStatus === "SM_VOID") {
                let extraBody = {
                    "Status": "PENDING_SM_APPROVE"
                };
                if (CURRENT_USER.email === spSmInfo.Email) {
                    extraBody["Status"] = "PENDING_SD_APPROVE";
                    extraBody["SMDate"] = new Date().toISOString();
                    extraBody["SMComment"] = smComment;
                }
                updateSpecialIncidentReportLicense(formData.Id, {
                    ...body,
                    ...extraBody}).then(async (res) => {
                    await uploadFile(formData.Id);
                    notifySpecialIncidentLicense(context, formData.Id, 1, speicalIncidentReportWorkflow);
                    postLog({
                        AccidentTime: incidentTime.toISOString(),
                        Action: "提交",
                        CaseNumber: formData.CaseNumber,
                        FormType: "SIH",
                        RecordId: formData.Id,
                        ServiceUnit: serviceLocation,
                        Report: "特別事故報告(牌照事務處)"
                    }).catch(console.error);

                    formSubmittedHandler();
                }).catch(console.error);
            } else {
                caseNumberFactory(FormFlow.SPECIAL_INCIDENT_LICENSE, serviceLocation).then((caseNumber) => {
                    console.log(caseNumber)
                    const extraBody = {
                        "NextDeadline": addBusinessDays(new Date(), 3).toISOString(),
                        "Status": "PENDING_SM_APPROVE",
                        "Stage": "1",
                        "CaseNumber": caseNumber,
                        "SDId": spSdInfo.Id,
                        "SMId": spSmInfo.Id,
                        "SDDate": new Date().toISOString(),
                        "SMDate": new Date().toISOString(),
                        "ServiceLocation": serviceLocation
                    }

                    if (CURRENT_USER.email === spSmInfo.Email) {
                        extraBody["Status"] = "PENDING_SD_APPROVE";
                        extraBody["SMDate"] = new Date().toISOString();
                        extraBody["SMComment"] = smComment;
                    }

                    if (formStatus === "DRAFT") {
                        updateSpecialIncidentReportLicense(formData.Id, {
                            ...body,
                            ...extraBody
                        }).then(async (res) => {
                            await uploadFile(formData.Id);
                            if (extraBody["Status"] === "PENDING_SD_APPROVE") {
                                notifySpecialIncidentLicense(context, formData.Id, 1, speicalIncidentReportWorkflow);

                                postLog({
                                    AccidentTime: incidentTime.toISOString(),
                                    Action: "提交",
                                    CaseNumber: caseNumber,
                                    FormType: "SIH",
                                    RecordId: formData.Id,
                                    ServiceUnit: serviceLocation,
                                    Report: "特別事故報告(牌照事務處)"
                                }).catch(console.error);
                            } else {

                                postLog({
                                    AccidentTime: incidentTime.toISOString(),
                                    Action: "提交",
                                    CaseNumber: caseNumber,
                                    FormType: "SIH",
                                    RecordId: formData.Id,
                                    ServiceUnit: serviceLocation,
                                    Report: "特別事故報告(牌照事務處)"
                                }).catch(console.error);
                            }


                            formSubmittedHandler();
                        }).catch(console.error);
                    } else {
                        createSpecialIncidentReportLicense({
                            ...body,
                            ...extraBody
                        }).then(async (createSpecialIncidentReportLicenseRes) => {
                            await uploadFile(createSpecialIncidentReportLicenseRes.data.Id);
                            if (extraBody["Status"] === "PENDING_SM_APPROVE") {
                                notifySpecialIncidentLicense(context, createSpecialIncidentReportLicenseRes.data.Id, 1, speicalIncidentReportWorkflow);

                                postLog({
                                    AccidentTime: incidentTime.toISOString(),
                                    Action: "提交",
                                    CaseNumber: caseNumber,
                                    FormType: "SIH",
                                    RecordId: createSpecialIncidentReportLicenseRes.data.Id,
                                    ServiceUnit: serviceLocation,
                                    Report: "特別事故報告(牌照事務處)"
                                }).catch(console.error);

                            } else {
                                notifySpecialIncidentLicense(context, createSpecialIncidentReportLicenseRes.data.Id, 1, speicalIncidentReportWorkflow);
                                postLog({
                                    AccidentTime: incidentTime.toISOString(),
                                    Action: "提交",
                                    CaseNumber: caseNumber,
                                    FormType: "SIH",
                                    RecordId: createSpecialIncidentReportLicenseRes.data.Id,
                                    ServiceUnit: serviceLocation,
                                    Report: "特別事故報告(牌照事務處)"
                                }).catch(console.error);
                            }


                            formSubmittedHandler();
                        }).catch(console.error);
                    }
                }).catch(console.error);
            }
        }

    }

    const draftHandler = (event) => {
        event.preventDefault();
        const [body] = dataFactory()
        body["ReporterId"] = CURRENT_USER.id;
        body["SDId"] = spSdInfo.Id;
        body["SMId"] = spSmInfo.Id;
        let error = {};
        if (form.affectedIdCardNo != null && form.affectedIdCardNo != '') {
            if (form.affectedIdCardNo.charAt(0).search(/[^a-zA-Z]+/) != -1) {
                error["AffectedIdCardNo"] = true;
            }
            if (form.affectedIdCardNo.charAt(1).search(/[^0-9]+/) == -1) {
                let mNumber = form.affectedIdCardNo.substr(1, 6);
                if (mNumber.search(/[^0-9]+/) == -1) {
                    if (form.affectedIdCardNo.charAt(7) != '(' || form.affectedIdCardNo.charAt(9) != ')') {
                        error["AffectedIdCardNo"] = true;
                    } else {
                        body["AffectedIdCardNo"] = form.affectedIdCardNo;
                    }

                } else {
                    error["AffectedIdCardNo"] = true;
                }

            } else {
                if (form.affectedIdCardNo.charAt(1).search(/[^a-zA-Z]+/) != -1) {
                    error["AffectedIdCardNo"] = true;
                } else {
                    if (form.affectedIdCardNo.charAt(2).search(/[^0-9]+/) == -1) {
                        let mNumber = form.affectedIdCardNo.substr(2, 6);
                        if (mNumber.search(/[^0-9]+/) == -1) {
                            if (form.affectedIdCardNo.charAt(8) != '(' || form.affectedIdCardNo.charAt(10) != ')') {
                                error["AffectedIdCardNo"] = true;
                            } else {
                                body["AffectedIdCardNo"] = form.affectedIdCardNo;
                            }
                        } else {
                            error["AffectedIdCardNo"] = true;
                        }
                    }
                }
            }
        }

        console.log(body);
        console.log(error);
        if (Object.keys(error).length > 0) {
            setError(error);
            alert("提交錯誤");
        } else {
            if (formStatus === "DRAFT") {
                updateSpecialIncidentReportLicense(formData.Id, {
                    ...body,
                    "Status": "DRAFT",
                    "Title": "SIH"
                }).then(async (updateSpecialIncidentReportLicenseRes) => {
                    console.log(updateSpecialIncidentReportLicenseRes);
                    await uploadFile(formData.Id);
                    formSubmittedHandler();
                }).catch(console.error);
            } else {
                createSpecialIncidentReportLicense({
                    ...body,
                    "Status": "DRAFT",
                    "Title": "SIH"
                }).then(async (createSpecialIncidentReportLicenseRes) => {
                    await uploadFile(createSpecialIncidentReportLicenseRes.data.Id);
                    formSubmittedHandler();
                }).catch(console.error);
            }
        }


    }

    const deleteHandler = () => {
        deleteSpecialIncidentReportLicense(formData.Id).then(async (res) => {
            postLog({
                AccidentTime: incidentTime.toISOString(),
                Action: "刪除",
                CaseNumber: formData.CaseNumber,
                FormType: "SIH",
                RecordId: formData.Id,
                ServiceUnit: serviceLocation,
                Report: "特別事故報告(牌照事務處)"
            }).catch(console.error);

            formSubmittedHandler();
        }).catch(console.error);
    }

    const cancelHandler = () => {
        //implement 
        const path = context.pageContext.site.absoluteUrl + `/accident-and-incident/SitePages/Home.aspx`;
        window.open(path, "_self");
    }

    const adminSubmitHanlder = (checkEmail) => {
        //event.preventDefault();
        if (checkEmail) {
            getInsuranceEMailRecords(formData.CaseNumber, "SIH", formData.Id).then((res1) => {
                if (res1.length > 0) {
                    updateSpecialIncidentReportLicense(formData.Id, {
                        "InsuranceCaseNo": form.insuranceCaseNo
                    }).then(res => {
                        console.log(res);
                        postLog({
                            AccidentTime: incidentTime.toISOString(),
                            Action: "更新",
                            CaseNumber: formData.CaseNumber,
                            FormType: "SIH",
                            RecordId: formData.Id,
                            ServiceUnit: serviceLocation,
                            Report: "特別事故報告(牌照事務處)"
                        }).catch(console.error);
    
                        formSubmittedHandler();
                    }).catch(console.error);
                } else {
                    alert('請先發送EMail');
                    setOpenSubmitInsuranceModel(true);
                }
            });
        } else {
            updateSpecialIncidentReportLicense(formData.Id, {
                "InsuranceCaseNo": form.insuranceCaseNo
            }).then(res => {
                console.log(res);
                postLog({
                    AccidentTime: incidentTime.toISOString(),
                    Action: "更新",
                    CaseNumber: formData.CaseNumber,
                    FormType: "SIH",
                    RecordId: formData.Id,
                    ServiceUnit: serviceLocation,
                    Report: "特別事故報告(牌照事務處)"
                }).catch(console.error);

                formSubmittedHandler();
            }).catch(console.error);
        }
        

    }

    const sdApproveHandler = () => {

        if (confirm("確認批准 ?")) {

            createIncidentFollowUpForm({
                "ParentFormId": formData.Id,
                "CaseNumber": formData.CaseNumber,
                "SMId": formData.SMId,
                "SDId": formData.SDId,
                "Title": "事故跟進/結束報告 - 第1篇"
            }).then((incidentFollowUpRes) => {

                updateSpecialIncidentReportLicense(formData.Id, {
                    "NextDeadline": addMonths(new Date(), 1).toISOString(),
                    "ReminderDate": addDays(new Date(), 21).toISOString(),
                    "SDComment": sdComment,
                    "SDDate": new Date().toISOString(),
                    "Stage": "2",
                    "Status": "PENDING_SM_FILL_IN",
                    "FollowUpFormsId": {
                        "results": [incidentFollowUpRes.data.Id]
                    }
                }).then((otherIncidentReportRes) => {
                    console.log(otherIncidentReportRes);

                    postLog({
                        AccidentTime: incidentTime.toISOString(),
                        Action: "批准",
                        CaseNumber: formData.CaseNumber,
                        FormType: "SIH",
                        RecordId: formData.Id,
                        ServiceUnit: serviceLocation,
                        Report: "特別事故報告(牌照事務處)"
                    }).catch(console.error);
                    notifySpecialIncidentLicense(context, formData.Id, 2, speicalIncidentReportWorkflow);
                    formSubmittedHandler();
                });
            }).catch(console.error);
        }
    }

    const sdRejectHandler = () => {
        if (confirm("確認拒絕 ?")) {
            const [body, error] = dataFactory();

            updateSpecialIncidentReportLicense(formData.Id, {
                ...body,
                "Status": "PENDING_SM_APPROVE"
            }).then((res) => {
                console.log(res);
                notifyIncidentReject(context, formData.Id, 1, speicalIncidentReportWorkflow);
                postLog({
                    AccidentTime: incidentTime.toISOString(),
                    Action: "拒絕",
                    CaseNumber: formData.CaseNumber,
                    FormType: "SIH",
                    RecordId: formData.Id,
                    ServiceUnit: serviceLocation,
                    Report: "特別事故報告(牌照事務處)"
                }).catch(console.error);

                formSubmittedHandler();
            }).catch(console.error);

        }
    }

    const backToCMS =(e) => {
        const path = context.pageContext.site.absoluteUrl + `/accident-and-incident/SitePages/Home.aspx?navScreen=cms&keyword=`+form.affectedIdCardNo+`&type=cms`;
        window.open(path, "_self");
    }
    const smSubmitHandler = () => {
        const [body, error] = dataFactory();
        updateSpecialIncidentReportLicense(formData.Id, {
            ...body,
            "SMComment": smComment,
            "SMDate": new Date().toISOString(),

        }).then(res => {
            console.log(res);

            postLog({
                AccidentTime: incidentTime.toISOString(),
                Action: "提交至服務總監",
                CaseNumber: formData.CaseNumber,
                FormType: "SIH",
                RecordId: formData.Id,
                ServiceUnit: serviceLocation,
                Report: "特別事故報告(牌照事務處)"
            }).catch(console.error);

            formSubmittedHandler();
        }).catch(console.error);
    }

    const smApproveHandler = (event) => {
        event.preventDefault();
        console.log(formData.Id)
        if (confirm("確認批准 ?")) {
            const [body, error] = dataFactory();
            updateSpecialIncidentReportLicense(formData.Id, {
                ...body,
                "Status": "PENDING_SD_APPROVE",
                "SMDate": new Date().toISOString(),
                "SMComment": smComment
            }).then(res => {
                console.log(res);
                notifySpecialIncidentLicense(context, formData.Id, 1, speicalIncidentReportWorkflow);
                postLog({
                    AccidentTime: incidentTime.toISOString(),
                    Action: "批准",
                    CaseNumber: formData.CaseNumber,
                    FormType: "SIH",
                    RecordId: formData.Id,
                    ServiceUnit: serviceLocation,
                    Report: "特別事故報告(牌照事務處)"
                }).catch(console.error);

                formSubmittedHandler();
            }).catch(console.error);
        }
    }

    const smRejectHandler = () => {

        if (spSmInfo.Email === formData.Reporter.EMail) return;

        if (confirm("確認拒絕 ?")) {
            const [body, error] = dataFactory();
            debugger
            updateSpecialIncidentReportLicense(formData.Id, {
                ...body,
                "Status": "SM_VOID",
                "SMComment": smComment
            }).then((res) => {
                console.log(res);
                notifyIncidentReject(context, formData.Id, 1, speicalIncidentReportWorkflow);
                postLog({
                    AccidentTime: incidentTime.toISOString(),
                    Action: "拒絕",
                    CaseNumber: formData.CaseNumber,
                    FormType: "SIH",
                    RecordId: formData.Id,
                    ServiceUnit: serviceLocation,
                    Report: "特別事故報告(牌照事務處)"
                }).catch(console.error);

                formSubmittedHandler();
            }).catch(console.error);

        }
    }

    async function send() {

        let values: any = {};
        let emailBodyHtml = emailBody.replace(/\n/g, '<br/>');
        values['Title'] = "-";
        values['ServiceUnit'] = serviceLocation;
        values['RecordId'] = formData.Id;
        values['CaseNumber'] = formData.CaseNumber;
        values['FormType'] = "SIH";
        values['AccidentTime'] = incidentTime.toISOString();
        values['EmailTo'] = emailTo;
        values['EmailCC'] = emailCc;
        values['EmailBody'] = emailBodyHtml;
        const addItem: IItemAddResult = await Web(context.pageContext.web.absoluteUrl).lists.getByTitle("Insurance EMail Records").items.add(values);
        const item: IItem = sp.web.lists.getByTitle("Insurance EMail Records").items.getById(addItem.data.Id);
        await item.attachmentFiles.add(encodeURIComponent(filename), file);
        setOpenModel(false);
    }

    const incomingfile = (event) => {
        const filename = event.target.files[0].name;
        setFilename(filename);
        setFile(event.target.files[0]);
        setUploadButton(false);
    }

    async function getInsuranceRecord(formData) {
        const LIST_NAME = "Insurance EMail Records";
        const result = await Web(context.pageContext.web.absoluteUrl).lists.getByTitle(LIST_NAME).items.filter(`FormType eq 'SIH' and RecordId eq '` + formData.Id + `'`).get();
        if (result.length > 0) {
            setSendInsuranceEmail(false);
        }

    }

    const changeServiceUserUnit = (event) =>{
        let value = event.target.value;
        //setServiceUnitTC(value);
        setServiceUnit(value);
        debugger
        setServiceLocation(value);
        
    }

    const loadData = async () => {
        console.log(formData)
        if (formData) {

            setIncidentTime(new Date(formData.IncidentTime));
            setFormStatus(formData.Status);
            setFormStage(formData.Stage);

            if (formData.Status != "DRAFT") {
                setDisabled1(true);
                setDisabled2(true);
                setDisabled3(true);
                setDisabled4(true);
                setDisabled5(true);
                setDisabled6(true);
                setDisabled7(true);
            }
            setSmComment(formData.SMComment);
            if (formData.SMDate) {
                setSmDate(new Date(formData.SMDate));
            }

            setSdComment(formData.SDComment);
            if (formData.SDDate) {
                setSdDate(new Date(formData.SDDate));
            }

            if (formData.Reporter) {
                setReporter([{ secondaryText: formData.Reporter.EMail, id: formData.Reporter.Id }]);
            }
            debugger
            if (formData.SM) {
                setSMEmail(formData.SM.EMail)
            }

            if (formData.SD) {
                setSDEmail(formData.SD.EMail)
            }

            if (formData.ServiceUnit) {
                setServiceUnit(formData.ServiceUnit);
            }
            if (formData.SubmitDate) {
                setReportDate(new Date(formData.SubmitDate));
            }
            if (formData.GuardianStaff) {
                setNotifyStaff([formData.GuardianStaff]);
            }
            setServiceLocation(formData.ServiceLocation);
            let police = formData.Police;
            let policeInvestigate = formData.PoliceInvestigate;
            if (formData.UnusalIncident == null) {
                police = undefined;
                policeInvestigate = undefined;
            }
            let found = formData.Found;
            if (formData.ResidentMissing == null) {
                found = undefined;
            }
            let referSocialWorker = formData.ReferSocialWorker;
            let abuser_police = formData.Abuser_Police;
            let other = formData.Other ? true : undefined;

            if (!formData.RA_Body && !formData.RA_Mental && !formData.RA_Negligent && !formData.RA_EmbezzleProperty && !formData.RA_Aabandoned && !formData.RA_SexualAssault && !formData.RA_Other) {
                referSocialWorker = undefined;
                abuser_police = undefined;
            }
            if (formData.Status == 'DRAFT') {
                //
                if (formData.UnusalIncident == null && formData.ResidentMissing == null && formData.RA_Body == null && formData.RA_Mental == null && formData.RA_Negligent == null && formData.RA_EmbezzleProperty == null && formData.RA_Abandoned == null && formData.RA_Other == null &&
                    formData.Conflict == null && formData.MedicalIncident == null && formData.OtherIncident == null && !formData.Other) {

                } else {
                    if (formData.UnusalIncident == null) {
                        setDisabled1(true);
                    } else {
                        setDisabledEx1(false);
                    }
                    if (formData.ResidentMissing == null) {
                        setDisabled2(true);
                    } else {
                        setDisabledEx2(false);
                    }
                    if (!formData.RA_Body && !formData.RA_Mental && !formData.RA_Negligent && !formData.RA_EmbezzleProperty && !formData.RA_Abandoned && !formData.RA_Other) {
                        setDisabled3(true);
                    } else {
                        setDisabledEx3(false);
                    }
                    if (formData.Conflict == null) {
                        setDisabled4(true);
                    }
                    if (formData.MedicalIncident == null) {
                        setDisabled5(true);
                    }
                    if (formData.OtherIncident == null) {
                        setDisabled6(true);
                    }
                    if (!formData.Other) {
                        setDisabled7(true);
                    }
                }

            }
            setForm({
                ...form,
                abuser: formData.Abuser,
                abuserDescription: formData.AbuserDescription,
                abuser_police: abuser_police,
                abuser_policeCaseNo: formData.Abuser_PoliceCaseNo,
                abuser_policeDate: formData.Abuser_PoliceDate ? new Date(formData.Abuser_PoliceDate) : null,
                affectedAge: formData.AffectedAge,
                affectedDetail: formData.AffectedDetail,
                affectedFollowUp: formData.AffectedFollowUp,
                affectedGender: formData.AffectedGender,
                affectedIdCardNo: formData.AffectedIdCardNo,
                affectedMedicalRecord: formData.AffectedMedicalRecord,
                affectedName: formData.AffectedName,
                conflict: formData.Conflict,
                conflictDescription: formData.ConflictDescription,
                conflict_policeCaseNo: formData.Conflict_PoliceCaseNo,
                conflict_policeDate: formData.Conflict_PoliceDate ? new Date(formData.Conflict_PoliceDate) : null,
                establishedCase: formData.EstablishedCase,
                found: found,
                foundDate: formData.FoundDate ? new Date(formData.FoundDate) : null,
                guardian: formData.Guardian,
                guardianName: formData.GuardianName,
                guardianRelation: formData.GuardianRelation,
                guardianDate: formData.GuarrdianDate ? new Date(formData.GuarrdianDate) : null,
                guardianReason: formData.GuardianReason,
                insuranceCaseNo: formData.InsuranceCaseNo,
                incidentTime: formData.IncidentTime,
                homesManagerName: formData.HomesManagerName,
                homesManagerTel: formData.HomesManagerTel,
                homesName: formData.HomesName,
                medicalIncident: formData.MedicalIncident,
                medicalRecords: formData.MedicalRecords,
                mi_description: formData.MI_Description,
                missingPoliceDate: formData.MissingPoliceDate ? new Date(formData.MissingPoliceDate) : null,
                missingPoliceReportNo: formData.MissingPoliceReportNo,
                notYetFoundDayCount: formData.NotYetFoundDayCount,
                other: other,
                otherDescription: formData.OtherDescription,
                otherIncident: formData.OtherIncident,
                otherIncidentOthersDescription: formData.OtherIncidentOthersDescription,
                police: police,
                policeDatetime: formData.PoliceDatetime ? new Date(formData.PoliceDatetime) : null,
                policeInvestigate: policeInvestigate,
                policeInvestigateDate: formData.PoliceInvestigateDate ? new Date(formData.PoliceInvestigateDate) : null,
                policeReportNumber: formData.PoliceReportNumber,
                ra_abandoned: formData.RA_Abandoned,
                ra_body: formData.RA_Body,
                ra_embezzleProperty: formData.RA_EmbezzleProperty,
                ra_mental: formData.RA_Mental,
                ra_negligent: formData.RA_Negligent,
                ra_other: formData.RA_Other,
                ra_otherDescription: formData.RA_OtherDescription,
                ra_sexualAssault: formData.RA_SexualAssault,
                referDate: formData.ReferDate ? new Date(formData.ReferDate) : null,
                referServiceUnit: formData.ReferServiceUnit,
                referSocialWorker: referSocialWorker,
                residentAge: formData.ResidentAge,
                residentGender: formData.ResidentGender,
                residentMissing: formData.ResidentMissing,
                residentMissingReason: formData.ResidentMissingReason,
                residentName: formData.ResidentName,
                residentRoomNo: formData.ResidentRoomNo,
                responsibleName: formData.ResponsibleName,
                reporterDate: formData.Created,
                unusalIncideintGeneral: formData.UnusalIncideintGeneral,
                unusalIncideintIncident: formData.UnusalIncideintIncident,
                unusalIncident: formData.UnusalIncident,
                submitDate: formData.SubmitDate ? new Date(formData.SubmitDate) : null,
            })

            if (formData.Attachments) {
                getSpecialIncidentReportLicenseAllAttachmentById(formData.Id).then((attachementsRes) => {
                    let extra = [];
                    let subpoena = [];
                    attachementsRes.forEach((att) => {
                        const splitPosition = att.FileName.indexOf("-");
                        const attachmentType = att.FileName.substr(0, splitPosition);
                        if (attachmentType === "EXTRA") {
                            extra.push(att);
                        } else if (attachmentType === "SUBPOENA") {
                            subpoena.push(att);
                        }

                        setUploadedExtraFile(extra);
                        setUploadedSubpoenaFile(subpoena)
                    })
                }).catch(console.error);
            }

        }
    }

    async function getInsuranceEMailSetting() {
        try {
            const LIST_NAME = "Insurance Email Setting";
            const result = await Web(context.pageContext.web.absoluteUrl).lists.getByTitle(LIST_NAME).items.getAll();
            for (let r of result) {
                if (r.Title == 'To') {
                    setEmailTo(r.Email);
                }
                if (r.Title == 'Email Body') {
                    setEmailBody(r.Body);
                }
                if (r.Title == 'CC') {
                    setEmailCc(r.Email);
                }
            }
            return result;
        } catch (err) {
            console.error(err);
            throw new Error("get Orphan error");
        }
    }

    const emailToChangeHandler = (event) => {
        const value = event.target.value;
        setEmailTo(value)
    }

    const emailBodyChangeHandler = (event) => {
        const value = event.target.value;
        setEmailBody(value)
    }

    useEffect(() => {
        getAllServiceUnit(siteCollectionUrl).then((userUnitList) => {
            if (permissionList.indexOf('All') >= 0) {
                setServiceUserUnitList(userUnitList);
            } else {
                console.log('permissionList',permissionList);
                console.log('userUnitList',userUnitList);
                let filterList = [];
                for (let unit of userUnitList) {
                    let filterP = permissionList.filter(item => {return item == unit.su_Eng_name_display});
                    if (filterP.length > 0) {
                        filterList.push(unit);
                    }
                }
                debugger
                setServiceUserUnitList(filterList);
            }
            
            

        }).catch(console.error);
        setCurrentUserEmail(CURRENT_USER.email);
        getInsuranceEMailSetting();
    }, [])

    // Get current User info in ad
    useEffect(() => {
        if (formData) {
            loadData();
            getInsuranceRecord(formData);
        } else {
            setReporter([{ secondaryText: CURRENT_USER.email, id: CURRENT_USER.id }]);
        }
    }, [formData]);

    // Find SD && SM
    useEffect(() => {
        // if (userInfo && userInfo.hr_deptid) {
        //     setHrDepartment(userInfo.hr_deptid);
        // } else if (CURRENT_USER.email === "FHS.portal.dev@fuhong.hk") {
        //     setHrDepartment("CSWATC(D)");
        // }
        if (formInitial(currentUserRole, formStatus) && Array.isArray(serviceUserUnitList) && serviceUserUnitList.length > 0) {
        
            if (userInfo != null && userInfo != '') {
                if (formInitial(currentUserRole, formStatus)) {
                    //if (departmentList.length == 1) {
                    if (userInfo && userInfo.hr_deptid) {
                        
                        debugger
                        if (serviceUnit == '') {
                            setHrDepartment(userInfo.hr_deptid);
                            setServiceUnit(userInfo.hr_deptid);
                            setServiceLocation(userInfo.hr_location);
                        }
                        
                    }
                    //}

                }
            }
        }

    }, [userInfo, serviceUserUnitList]);

    useEffect(() => {
        if (selectDepartment != null && selectDepartment != '') {
            if (formInitial(currentUserRole, formStatus)) {
                if (serviceUnit == '') {
                    setServiceLocation(selectDepartment);
                    setServiceUnit(selectDepartment);
                    setHrDepartment(selectDepartment);
                }
                
            }
        }

    }, [selectDepartment]);

    // Get SD & SM
    useEffect(() => {
        if (formInitial(currentUserRole, formStatus)) {
            if (Array.isArray(departments) && departments.length) {

                const dept = departments[0];
                if (dept && dept.hr_deptmgr && dept.hr_deptmgr !== "[empty]" && formData == null) {
                    setSMEmail(dept.hr_deptmgr);
                }

                if (dept && dept.hr_sd && dept.hr_sd !== "[empty]" && formData == null) {
                    setSDEmail(dept.hr_sd);
                }
                //setForm({ ...form, homesName: dept.su_name_tc ? `扶康會${dept.su_name_tc }` : "", homesManagerTel: dept.su_phone || "" });
                setForm({ ...form, homesName: dept.su_name_tc ? `${dept.su_name_tc}` : "", homesManagerTel: dept.su_phone || "" });
            }
        }
    }, [departments]);

    useEffect(() => {
        if (smInfo) {
            setForm({ ...form, homesManagerName: smInfo.Name })
        }
    }, [smInfo])


    useEffect(() => {
        if (notifyStaff && notifyStaff.mail) {
            setNotifyStaffEmail(notifyStaff.mail)
        }
    }, [notifyStaff])

    useEffect(() => {
        if (spNotifyStaff) {
            setForm({
                ...form,
                guardianStaffName: spNotifyStaff.Title,
                guardianStaffJobTitle: spNotifyStaff.jobTitle
            });
        }
    }, [spNotifyStaff])

    useEffect(() => {
        if (reporter) {
            getUserInfoByEmailInUserInfoAD(siteCollectionUrl, reporter.mail).then((userInfosRes) => {

                if (Array.isArray(userInfosRes) && userInfosRes.length > 0) {
                    setReporterJobTitle(userInfosRes[0].hr_jobcode);
                }


            }).catch((err) => {
                console.error('getUserInfoByEmailInUserInfoAD error')
                console.error(err)
            });
        }
    }, [reporter])

    useEffect(() => {
        setHrDepartment(serviceUnit)
    }, [serviceUnit]);
    //console.log('departmentList',departmentList);
    //console.log('isPrintMode',isPrintMode);
    //console.log('reporter',reporter);
    console.log('pendingSmApprove', !pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo));
    console.log('formInitial', !formInitial(currentUserRole, formStatus));
    console.log('disabled1', disabled1);
    console.log('final', !pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus) && disabled1);
    console.log('extraFile', extraFile);

    return (
        <>

            {isPrintMode && <Header displayName="殘疾人士院舍特別事故報告" />}

            <div className={`container-fluid px-4 pt-3`}>
                <section className="mb-5">
                    {/* <div className="row">
                        <div className="col-12 font-weight-bold">
                            <h5>報告資料</h5>
                        </div>
                    </div> */}
                    <div className="row">
                        <div className="col-12">
                            <div className={`font-weight-bold mb-3`} style={{ fontSize: 15 }}>【須在事件<span className="text-danger">發生後的3個曆日（包括公眾假期）內</span>提交】</div>
                            {/* Only show in print form */}
                            {
                                isPrintMode ?
                                    <div className="">注意：請在合適方格內加上「&#10003;」號，並連同附頁／載有相關資料的自訂報告一併呈交</div>
                                    :
                                    <div className="">
                                        <div className="mb-1 text-secondary font-weight-bold">若有相關資料/自訂報告，請於此上載</div>
                                        <div className="input-group mb-3">
                                            <div className="custom-file">
                                                <input type="file" className="custom-file-input" name="subpoenaFile" id="subpoena-file" onChange={incomingfile1} //onChange={(event) => { setExtraFile }}
                                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus))} multiple />
                                                <label className={`custom-file-label ${styles.fileUploader}`} htmlFor="subpoena-file">{extraFile && extraFile.length > 0 ? `${extraFile[0].name}` : "請選擇文件 (如適用)"}</label>
                                            </div>
                                        </div>
                                        {extraFile.length > 0 &&
                                            <>
                                                {extraFile.map(item => {
                                                    return <div>{item.name}</div>
                                                })}
                                                <div className="input-group-append">
                                                    <button className="btn btn-outline-secondary btn-sm" type="button" onClick={() => setExtraFile([])}>清除</button>
                                                </div>
                                            </>
                                        }
                                        {uploadedExtraFile.length > 0 &&
                                            <aside>
                                                <h6>已上傳檔案</h6>
                                                <ul>{UploadedFilesComponent(uploadedExtraFile)}</ul>
                                            </aside>
                                        }
                                    </div>
                            }
                        </div>
                    </div>

                    <hr className="my-4" />

                    <div className="row">
                        <div className="col-12">
                            <p className={`${styles.fieldTitle}`}>致 : 社會福利署殘疾人士院舍牌照事務處 (註1)</p>
                            <p className={`${styles.fieldTitle}`} style={{ paddingLeft: '30px' }}> （傳真：2153 0071 及 電郵 : lorchdenq@swd.gov.hk）</p>
                            <p className={`${styles.fieldTitle}`} style={{ paddingLeft: '30px' }}> （查詢電話：2891 6379）</p>
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/* 經辦人 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>經辦人<span className="d-sm-inline d-md-block">(負責督察姓名)</span></label>
                        <div className="col-12 col-md-4">
                            <input type="text" className={`form-control ${(error && error['ResponsibleName']) ? "is-invalid" : ""}`} value={form.responsibleName} name={"responsibleName"} onChange={inputFieldHandler}
                                disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus))} />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/* 殘疾人士院舍名稱 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>殘疾人士院舍名稱</label>
                        <div className="col-12 col-xl-4">
                        <select className={`custom-select ${(error && error['ServiceUserUnit']) ? "is-invalid" : ""}`} value={serviceUnit} onChange={(event) => { changeServiceUserUnit(event) }}//setPatientServiceUnit(event.target.value)
                                disabled={type=='cms' ||(!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus))}
                            >
                                <option value={""} ></option>
                                {serviceUnit != "" && permissionList.indexOf('All') >= 0 &&
                                    serviceUserUnitList.map((item) => {
                                        console.log('serviceUnit1234',serviceUnit);

                                        return <option value={item.su_Eng_name_display} selected={serviceUnit != '' && item.su_Eng_name_display == serviceUnit}>{item.su_name_tc}</option>
                                    })
                                }
                                {serviceUnit == "" && permissionList.indexOf('All') >= 0 &&
                                    serviceUserUnitList.map((item) => {
                                        console.log('serviceUnit1234',serviceUnit);

                                        return <option value={item.su_Eng_name_display} selected={serviceUnit != '' && item.su_Eng_name_display == serviceUnit}>{item.su_name_tc}</option>
                                    })
                                }
                                {serviceUnit != "" && permissionList.indexOf('All') < 0 &&
                                    permissionList.map((item) => {
                                        let ser = serviceUserUnitList.filter(o => { return o.su_Eng_name_display == item });

                                        if (ser.length > 0) {
                                            return <option value={ser[0].su_Eng_name_display} selected={serviceUnit != '' && item.su_Eng_name_display == serviceUnit}>{ser[0].su_name_tc}</option>
                                        }

                                    })
                                }
                                {serviceUnit == "" && permissionList.indexOf('All') < 0 &&
                                    permissionList.map((item) => {
                                        let ser = serviceUserUnitList.filter(o => { return o.su_Eng_name_display == item });

                                        if (ser.length > 0) {
                                            return <option value={ser[0].su_Eng_name_display} selected={serviceUnit != '' && item.su_Eng_name_display == serviceUnit}>{ser[0].su_name_tc}</option>
                                        }

                                    })
                                }
                            </select>
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/* 殘疾人士院舍主管姓名 
                        disabled={!pendingSmApprove(CURRENT_USER.email,currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)}
                        */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>殘疾人士院舍主管<span className="d-sm-inline d-md-block">姓名</span></label>
                        <div className="col-12 col-md-4">
                            <input type="text" className={`form-control ${(error && error['HomesManagerName']) ? "is-invalid" : ""}`} value={form.homesManagerName} name="homesManagerName" onChange={inputFieldHandler}
                                disabled={true}
                            />
                        </div>
                        {/* 聯絡電話 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>聯絡電話</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className={`form-control ${(error && error['HomesManagerTel']) ? "is-invalid" : ""}`} value={form.homesManagerTel} name="homesManagerTel" onChange={inputFieldHandler}
                                disabled={true} />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/* 事故發生日期 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>事故發生日期</label>
                        <div className="col-12 col-md-4">
                            <DatePicker
                                className={`form-control ${(error && error['IncidentTime']) ? "is-invalid" : ""}`}
                                selected={incidentTime}
                                onChange={setIncidentTime}
                                showTimeSelect
                                timeFormat="p"
                                timeIntervals={15}
                                dateFormat="yyyy/MM/dd h:mm aa"
                                readOnly={!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)}
                            />
                        </div>
                        {
                            isPrintMode === false &&
                            <>
                                {/* 保險公司備案編號 */}
                                <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>保險公司備案編號</label>
                                <div className="col-12 col-md-4">
                                    <input type="text" className="form-control" value={form.insuranceCaseNo} name="insuranceCaseNo" onChange={inputFieldHandler}
                                        disabled={type=='cms' || !adminUpdateInsuranceNumber(currentUserRole, formStatus)} />
                                </div>
                            </>
                        }

                    </div>
                </section>

                <section className="mb-5">
                    <div className="form-row mb-3">
                        <div className="col-12 font-weight-bold">
                            <h5>特別事故類別</h5>
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/*(1) 住客不尋常死亡／事故導致住客嚴重受傷或死亡 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>(1) 住客不尋常死亡／重複受傷; 或其他事故導致住客死亡／嚴重受傷</label>
                        <div className={`col`}>

                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" name="unusalIncident" id="unusal-incident-general" value="UNUSAL_INCIDENT_GENERAL" onChange={checkboxHandler}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabled1} checked={form.unusalIncident === "UNUSAL_INCIDENT_GENERAL"} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="unusal-incident-general">在院舍內發生事故及送院救治／送院後死亡</label>
                            </div>
                            {
                                form.unusalIncident === "UNUSAL_INCIDENT_GENERAL" &&
                                <div className="">
                                    <div>請註明事件:</div>
                                    <AutosizeTextarea className={`form-control ${(error && error['UnusalIncideintGeneral']) ? "is-invalid" : ""}`} placeholder="請註明" value={form.unusalIncideintGeneral} name="unusalIncideintGeneral" onChange={inputFieldHandler}
                                        disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus))} />
                                </div>
                            }
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" name="unusalIncident" id="unusal-incident-suicide" value="UNUSAL_INCIDENT_SUICIDE" onChange={checkboxHandler}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabled1} checked={form.unusalIncident === "UNUSAL_INCIDENT_SUICIDE"} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="unusal-incident-suicide">在院舍內自殺及送院救治／送院後死亡</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" name="unusalIncident" id="unusal-incident-other" value="UNUSAL_INCIDENT_OTHER" onChange={checkboxHandler}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabled1} checked={form.unusalIncident === "UNUSAL_INCIDENT_OTHER"} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="unusal-incident-other">其他不尋常死亡／受傷</label>
                            </div>
                            {
                                form.unusalIncident === "UNUSAL_INCIDENT_OTHER" &&
                                <div className="">
                                    <div>請註明事件:</div>
                                    <AutosizeTextarea className={`form-control ${(error && error['UnusalIncideintIncident']) ? "is-invalid" : ""}`} placeholder="請註明" value={form.unusalIncideintIncident} name="unusalIncideintIncident" onChange={inputFieldHandler}
                                        disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus))} />
                                </div>
                            }
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" name="unusalIncident" id="unusal-incident-court" value="UNUSAL_INCIDENT_COURT" onChange={checkboxHandler}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabled1} checked={form.unusalIncident === "UNUSAL_INCIDENT_COURT"} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="unusal-incident-court">收到死因裁判法庭要求出庭的傳票<br />(請夾附傳票副本並在附頁說明詳情)</label>
                            </div>
                            {
                                form.unusalIncident === "UNUSAL_INCIDENT_COURT" &&
                                <>
                                    <div className="input-group mb-2">
                                        <div className="custom-file">
                                            <input type="file" className="custom-file-input" name="subpoenaFile" id="subpoena-file" onChange={incomingfile2} multiple// onChange={(event) => { setSubpoenaFile(event.target.files) }}
                                                disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus))} />
                                            <label className={`custom-file-label ${styles.fileUploader}`} htmlFor="subpoena-file">{subpoenaFile && subpoenaFile.length > 0 ? `${subpoenaFile[0].name}` : "請選擇文件 (如適用)"}</label>
                                        </div>
                                        {/*
                                            subpoenaFile && subpoenaFile.length > 0 &&
                                            <div className="input-group-append">
                                                <button className="btn btn-outline-secondary btn-sm" type="button" onClick={() => setSubpoenaFile(null)}
                                                    disabled={!pendingSmApprove(CURRENT_USER.email,currentUserRole, formStatus, formStage, spSmInfo) && formInitial(currentUserRole, formStatus)}>
                                                    清除
                                                </button>
                                            </div>
                                        */}
                                    </div>
                                    {subpoenaFile.length > 0 &&
                                        <>
                                            {subpoenaFile.map(item => {
                                                return <div>{item.name}</div>
                                            })}
                                            <div className="input-group-append">
                                                <button className="btn btn-outline-secondary btn-sm" type="button" onClick={() => setSubpoenaFile([])}
                                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && formInitial(currentUserRole, formStatus))}>
                                                    清除</button>
                                            </div>
                                        </>
                                    }
                                    {uploadedSubpoenaFile.length > 0 &&
                                        <aside>
                                            <h6>已上傳檔案</h6>
                                            <ul>{UploadedFilesComponent(uploadedSubpoenaFile)}</ul>
                                        </aside>
                                    }
                                </>
                            }
                        </div>
                    </div>
                    <div className="form-row mb-2" style={{ marginTop: '15px' }}>
                        {/* 報警求助 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>(1a)</label>
                        <div className={`col`}>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" name="police" id="police-true" onChange={(e) => checkboxHandler1(e, true)} checked={form.police === true}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabledEx1} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="police-true">已報警求助</label>
                            </div>
                            {
                                form.police &&
                                <>
                                    <div className="mb-1">
                                        <label>報警日期</label>
                                        <DatePicker className={`form-control ${(error && error['PoliceDatetime']) ? "is-invalid" : ""}`} selected={form.policeDatetime} dateFormat="yyyy/MM/dd" onChange={(date) => setForm({ ...form, policeDatetime: date })}
                                            readOnly={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus))} />
                                    </div>
                                    <div>
                                        <label>報案編號</label>
                                        <input className={`form-control ${(error && error['PoliceReportNumber']) ? "is-invalid" : ""}`} name="policeReportNumber" value={form.policeReportNumber} onChange={inputFieldHandler}
                                            disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus))} />
                                    </div>
                                </>
                            }
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" name="police" id="police-false" onChange={(e) => checkboxHandler1(e, false)} checked={form.police === false}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabledEx1} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="police-false">沒有報警求助</label>
                            </div>
                        </div>
                    </div>

                    <div className="form-row mb-2" style={{ marginTop: '15px' }}>
                        {/* 警方到院舍調查日期及時間 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>(1b) 警方到院舍調查日期及時間 (如適用)</label>
                        <div className={`col`}>
                            <div className="form-check">
                                <input className={"form-check-input"} type="checkbox" name="policeInvestigate" id="police-investigate-true" value={"true"} onChange={(e) => checkboxHandler1(e, true)} checked={form.policeInvestigate === true}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabledEx1} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="police-investigate-true">有</label>
                            </div>
                            {
                                form.policeInvestigate === true &&
                                <>
                                    <div className="mb-1">
                                        <label>調查日期和時間</label>
                                        <DatePicker className={`form-control ${(error && error['PoliceInvestigateDate']) ? "is-invalid" : ""}`} selected={form.policeInvestigateDate} dateFormat="yyyy/MM/dd  h:mm aa" showTimeSelect timeIntervals={15} onChange={(date) => setForm({ ...form, policeInvestigateDate: date })}
                                            readOnly={!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)} />
                                    </div>
                                </>
                            }
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" name="policeInvestigate" id="police-investigate-false" value={"false"} onChange={(e) => checkboxHandler1(e, false)} checked={form.policeInvestigate === false}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabledEx1} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="police-investigate-false">沒有</label>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="form-row mb-2" style={{ marginTop: '15px' }}>
                        {/* (2) 住客失蹤以致需要報警求助 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>(2) 住客失蹤以致需要報警求助</label>
                        <div className={`col ${(error && error['ResidentMissing']) ? styles.divInvalid : ""}`}>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" name="residentMissing" id="resident-missing-inside" value="RESIDENT_MISSING_INSIDE" checked={form.residentMissing === 'RESIDENT_MISSING_INSIDE'} onChange={checkboxHandler}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabled2} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="resident-missing-inside">住客擅自／在員工不知情下離開院舍</label>
                            </div>
                            <div className="form-check mb-2">
                                <input className="form-check-input" type="checkbox" name="residentMissing" id="resident-missing-outside" value="RESIDENT_MISSING_OUTSIDE" checked={form.residentMissing === 'RESIDENT_MISSING_OUTSIDE'} onChange={checkboxHandler}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabled2} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="resident-missing-outside">院外活動期間失蹤</label>
                            </div>
                            {
                                form.residentMissing === "RESIDENT_MISSING_OUTSIDE" &&
                                <div className={`px-3 ${(error && error['ResidentMissingReason']) ? styles.divInvalid : ""}`}>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="residentMissingReason" id="resident-missing-reason-vacation" value="RESIDENT_MISSING_REASON_VACATION" checked={form.residentMissingReason === 'RESIDENT_MISSING_REASON_VACATION'} onChange={radioButtonHandler}
                                            disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus))} />
                                        <label className={`form-check-label ${styles.labelColor}`} htmlFor="resident-missing-reason-vacation">回家度假期間</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="residentMissingReason" id="resident-missing-reason-voluntarily" value="RESIDENT_MISSING_REASON_VOLUNTARILY" checked={form.residentMissingReason === 'RESIDENT_MISSING_REASON_VOLUNTARILY'} onChange={radioButtonHandler}
                                            disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus))} />
                                        <label className={`form-check-label ${styles.labelColor}`} htmlFor="resident-missing-reason-voluntarily">自行外出活動</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="residentMissingReason" id="resident-missing-reason-home-out" value="RESIDENT_MISSING_REASON_HOME_OUT" checked={form.residentMissingReason === 'RESIDENT_MISSING_REASON_HOME_OUT'} onChange={radioButtonHandler}
                                            disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus))} />
                                        <label className={`form-check-label ${styles.labelColor}`} htmlFor="resident-missing-reason-home-out">院舍外出活動</label>
                                    </div>
                                </div>
                            }

                            <div className="mb-1">
                                <label>報警日期</label>
                                <DatePicker className={`form-control ${(error && error['MissingPoliceDate']) ? "is-invalid" : ""}`} selected={form.missingPoliceDate} dateFormat="yyyy/MM/dd" onChange={(date) => setForm({ ...form, missingPoliceDate: date })}
                                    readOnly={(!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabled2} />
                            </div>
                            <div>
                                <label>報警編號</label>
                                <AutosizeTextarea className={`form-control ${(error && error['MissingPoliceReportNo']) ? "is-invalid" : ""}`} value={form.missingPoliceReportNo} onChange={inputFieldHandler} name="missingPoliceReportNo"
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabled2} />
                            </div>
                        </div>
                    </div>

                    <div className="form-row mb-2" style={{ marginTop: '15px' }}>
                        {/* (2a) */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>(2a)</label>
                        <div className="col">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" name="residentMissingFound" id="resident-missing-found-true" onClick={() => setForm({ ...form, found: true })} checked={form.found === true}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabledEx2} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="resident-missing-found-true">已尋回</label>
                            </div>
                            {
                                form.found === true &&
                                <div className="d-flex align-items-center">
                                    <label className="mr-3">尋回日期</label>
                                    <DatePicker className={`form-control ${(error && error['FoundDate']) ? "is-invalid" : ""}`} selected={form.foundDate} dateFormat="yyyy/MM/dd" onChange={(date) => setForm({ ...form, foundDate: date })}
                                        readOnly={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus))} />
                                </div>
                            }
                            <div className="form-check">
                                <input className={`form-check-input`} type="checkbox" name="residentMissingFound" id="resident-missing-found-false" onClick={() => setForm({ ...form, found: false })} checked={form.found === false}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabledEx2} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="resident-missing-found-false">仍未尋回</label>
                            </div>
                            {
                                form.found === false &&
                                <div className="d-flex align-items-center">
                                    由失蹤日計起至呈報日，已失蹤
                                    <div className="input-group mb-3">
                                        <input type="number" className={`form-control ${(error && error['NotYetFoundDayCount']) ? "is-invalid" : ""}`} min={0} value={form.notYetFoundDayCount} onChange={(event) => setForm({ ...form, notYetFoundDayCount: +event.target.value })}
                                            disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus))} />
                                        <div className="input-group-append">
                                            <span className="input-group-text" id="basic-addon2">日</span>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>


                    <div className="form-row mb-2" style={{ marginTop: '15px' }}>
                        {/* (2b) 失蹤住客病歷 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>(2b) 失蹤住客病歷</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" name="medicalRecords" value={form.medicalRecords} onChange={inputFieldHandler}
                                disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabledEx2} />
                        </div>
                    </div>
                    <hr />
                    <div className="form-row mb-2" style={{ marginTop: '15px' }}>
                        {/* (3) 院舍內證實／懷疑有住客受虐待／被侵犯私隱 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>(3) 院舍內證實／懷疑有住客受虐待／被侵犯</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="ra_body" id="resident-abuse-body" onChange={checkboxHandlerResidentAbuse} checked={form.ra_body === true}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabled3} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="resident-abuse-body">身體虐待</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="ra_mental" id="resident-abuse-mental" onChange={checkboxHandlerResidentAbuse} checked={form.ra_mental === true}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabled3} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="resident-abuse-mental">精神虐待</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="ra_negligent" id="resident-abuse-negligent" onChange={checkboxHandlerResidentAbuse} checked={form.ra_negligent === true}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabled3} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="resident-abuse-negligent">疏忽照顧</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="ra_embezzleProperty" id="resident-abuse-embezzle-property" onChange={checkboxHandlerResidentAbuse} checked={form.ra_embezzleProperty === true}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabled3} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="resident-abuse-embezzle-property">侵吞財產</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="ra_abandoned" id="resident-abuse-abandoned" onChange={checkboxHandlerResidentAbuse} checked={form.ra_abandoned === true}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabled3} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="resident-abuse-abandoned">遺棄</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="ra_sexualAssault" id="resident-abuse-sexual-assault" onChange={checkboxHandlerResidentAbuse} checked={form.ra_sexualAssault === true}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabled3} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="resident-abuse-sexual-assault">非禮／性侵犯</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" name="ra_other" id="resident-abuse-other" onChange={checkboxHandlerResidentAbuse} checked={form.ra_other === true}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabled3} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="resident-abuse-other">其他</label>
                            </div>
                            {
                                form.ra_other &&
                                <AutosizeTextarea className={`form-control ${(error && error['RA_OtherDescription']) ? "is-invalid" : ""}`} placeholder="請註明" name="ra_otherDescription" value={form.ra_otherDescription} onChange={inputFieldHandler}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus))} />
                            }
                        </div>
                    </div>
                    <div className="form-row mb-2" style={{ marginTop: '15px' }}>
                        {/* (3a)*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>(3a)</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="establishedCase" id="establishedCase-true" checked={form.establishedCase === true} onClick={() => setForm({ ...form, establishedCase: true })}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabledEx3} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="establishedCase-true">已確立個案</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="establishedCase" id="establishedCase-false" checked={form.establishedCase === false} onClick={() => setForm({ ...form, establishedCase: false })}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabledEx3}  />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="establishedCase-false">懷疑個案</label>
                            </div>
                        </div>
                    </div>
                    <div className="form-row mb-2" style={{ marginTop: '15px' }}>

                        {/* (3b) 施虐者／懷疑施虐者的身份 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>(3b) 施虐者／懷疑施虐者／侵犯者的身份</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="abuser" id="abuser-staff" value="ABUSER_STAFF" onChange={checkboxHandler} checked={form.abuser === "ABUSER_STAFF"}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabledEx3}  />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="abuser-staff">員工</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="abuser" id="abuser-tenant" value="ABUSER_TENANT" onChange={checkboxHandler} checked={form.abuser === "ABUSER_TENANT"}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabledEx3}  />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="abuser-tenant">住客</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="abuser" id="abuser-guest" value="ABUSER_GUEST" onChange={checkboxHandler} checked={form.abuser === "ABUSER_GUEST"}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabledEx3}  />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="abuser-guest">訪客</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" name="abuser" id="abuser-other" value="ABUSER_OTHER" onChange={checkboxHandler} checked={form.abuser === "ABUSER_OTHER"}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabledEx3}  />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="abuser-other">其他</label>
                            </div>
                            {
                                form.abuser === "ABUSER_OTHER" &&
                                <AutosizeTextarea className={`form-control ${(error && error['AbuserDescription']) ? "is-invalid" : ""}`} placeholder="請註明" name="abuserDescription" value={form.abuserDescription} onChange={inputFieldHandler}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus))} />
                            }
                        </div>
                    </div>

                    <div className="form-row mb-2" style={{ marginTop: '15px' }}>
                        {/* (3c)*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>(3c)</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="referrals" id="referrals-false" checked={form.referSocialWorker === false} onClick={() => setForm({ ...form, referSocialWorker: false })}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabledEx3}  />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="referrals-false">沒有</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="referrals" id="referrals-true" checked={form.referSocialWorker === true} onClick={() => setForm({ ...form, referSocialWorker: true })}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabledEx3}  />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="referrals-true">已轉介社工</label>
                            </div>
                            {
                                form.referSocialWorker &&
                                <>
                                    <div className="">
                                        <label>轉介日期</label>
                                        <DatePicker className={`form-control ${(error && error['ReferDate']) ? "is-invalid" : ""}`} selected={form.referDate} dateFormat="yyyy/MM/dd" onChange={(date) => setForm({ ...form, referDate: date })}
                                            readOnly={!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)} />
                                    </div>
                                    <div className="">
                                        <label>服務單位</label>
                                        <input type="text" className={`form-control ${(error && error['ReferServiceUnit']) ? "is-invalid" : ""}`} name="referServiceUnit" value={form.referServiceUnit} onChange={inputFieldHandler}
                                            disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus))} />
                                    </div>
                                </>
                            }
                        </div>
                    </div>

                    <div className="form-row mb-2" style={{ marginTop: '15px' }}>
                        {/* (3d)*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>(3d)</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="residentAbusePolice" id="resident-abuse-police-false" checked={form.abuser_police === false} onClick={() => setForm({ ...form, abuser_police: false })}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabledEx3}  />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="resident-abuse-police-false">沒有</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="residentAbusePolice" id="resident-abuse-police-true" checked={form.abuser_police === true} onClick={() => setForm({ ...form, abuser_police: true })}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabledEx3}  />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="resident-abuse-police-true">已報警求助</label>
                            </div>
                            {
                                form.abuser_police &&
                                <>
                                    <div className="mb-1">
                                        <label>報警日期</label>
                                        <DatePicker className={`form-control ${(error && error['Abuser_PoliceDate']) ? "is-invalid" : ""}`} selected={form.abuser_policeDate} dateFormat="yyyy/MM/dd" onChange={(date) => setForm({ ...form, abuser_policeDate: date })}
                                            readOnly={!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)} />
                                    </div>
                                    <div>
                                        <label>報案編號</label>
                                        <input className={`form-control ${(error && error['Abuser_PoliceCaseNo']) ? "is-invalid" : ""}`} name="abuser_policeCaseNo" value={form.abuser_policeCaseNo} onChange={inputFieldHandler}
                                            disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus))} />
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                    <hr />
                    <div className="form-row mb-2" style={{ marginTop: '15px' }}>
                        {/* (4) 院舍內有爭執事件以致需要報警求助 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>(4) 院舍內有爭執事件以致需要報警求助</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="conflict" id="dispute-police-tenant-and-tenant" value="DISPUTE_POLICE_TENANT_AND_TENANT" checked={form.conflict === "DISPUTE_POLICE_TENANT_AND_TENANT"} onChange={checkboxHandler}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabled4} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="dispute-police-tenant-and-tenant">住客與住客</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="conflict" id="dispute-police-tenant-and-staff" value="DISPUTE_POLICE_TENANT_AND_STAFF" checked={form.conflict === "DISPUTE_POLICE_TENANT_AND_STAFF"} onChange={checkboxHandler}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabled4} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="dispute-police-tenant-and-staff">住客與員工</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="conflict" id="dispute-police-tenant-and-guest" value="DISPUTE_POLICE_TENANT_AND_GUEST" checked={form.conflict === "DISPUTE_POLICE_TENANT_AND_GUEST"} onChange={checkboxHandler}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabled4} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="dispute-police-tenant-and-guest">住客與訪客</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="conflict" id="dispute-police-staff-and-staff" value="DISPUTE_POLICE_STAFF_AND_STAFF" checked={form.conflict === "DISPUTE_POLICE_STAFF_AND_STAFF"} onChange={checkboxHandler}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabled4} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="dispute-police-staff-and-staff">員工與員工</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="conflict" id="dispute-police-staff-and-guest" value="DISPUTE_POLICE_STAFF_AND_GUEST" checked={form.conflict === "DISPUTE_POLICE_STAFF_AND_GUEST"} onChange={checkboxHandler}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabled4} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="dispute-police-staff-and-guest">員工與訪客</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="conflict" id="dispute-police-guest-and-guest" value="DISPUTE_POLICE_GUEST_AND_GUEST" checked={form.conflict === "DISPUTE_POLICE_GUEST_AND_GUEST"} onChange={checkboxHandler}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabled4} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="dispute-police-guest-and-guest">訪客與訪客</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="conflict" id="dispute-police-other" value="DISPUTE_POLICE_OTHER" checked={form.conflict === "DISPUTE_POLICE_OTHER"} onChange={checkboxHandler}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabled4} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="dispute-police-other">其他 (請註明)</label>
                            </div>
                            {
                                form.conflict === "DISPUTE_POLICE_OTHER" &&
                                <div className="">
                                    <AutosizeTextarea placeholder="請註明" className={`form-control  ${(error && error['ConflictDescription']) ? "is-invalid" : ""}`} value={form.conflictDescription} onChange={inputFieldHandler} name="conflictDescription"
                                        disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus))} />
                                </div>
                            }
                            <div className="mb-1">
                                <label>報警日期</label>
                                <DatePicker className={`form-control ${(error && error['Conflict_PoliceDate']) ? "is-invalid" : ""}`} selected={form.conflict_policeDate} dateFormat="yyyy/MM/dd" onChange={(date) => setForm({ ...form, conflict_policeDate: date })}
                                    readOnly={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabled4} />
                            </div>
                            <div>
                                <label>報案編號</label>
                                <input className={`form-control ${(error && error['Conflict_PoliceCaseNo']) ? "is-invalid" : ""}`} name="conflict_policeCaseNo" value={form.conflict_policeCaseNo} onChange={inputFieldHandler}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabled4} />
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="form-row mb-2" style={{ marginTop: '15px' }}>
                        {/* (5) 嚴重醫療／藥物事故（須同時提交「藥物風險管理報告」） */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>(5) 嚴重醫療／藥物事故（須同時提交「藥物風險管理報告」）</label>
                        <div className="col">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" name="medicalIncident" id="serious-medical-incident-mistake" value="SERIOUS_MEDICAL_INCIDENT_MISTAKE" checked={form.medicalIncident === "SERIOUS_MEDICAL_INCIDENT_MISTAKE"} onChange={checkboxHandler}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabled5} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="serious-medical-incident-mistake">住客誤服藥物引致入院接受檢查或治療</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" name="medicalIncident" id="serious-medical-incident-over-or-missed" value="SERIOUS_MEDICAL_INCIDENT_OVER_OR_MISSED" checked={form.medicalIncident === "SERIOUS_MEDICAL_INCIDENT_OVER_OR_MISSED"} onChange={checkboxHandler}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabled5} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="serious-medical-incident-over-or-missed">住客漏服或多服藥物引致入院接受檢查或治療</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" name="medicalIncident" id="serious-medical-incident-counter-drug" value="SERIOUS_MEDICAL_INCIDENT_COUNTER_DRUG" checked={form.medicalIncident === "SERIOUS_MEDICAL_INCIDENT_COUNTER_DRUG"} onChange={checkboxHandler}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabled5} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="serious-medical-incident-counter-drug">住客服用成藥或非處方藥物引致入院接受檢查或治療</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" name="medicalIncident" id="serious-medical-incident-other" value="SERIOUS_MEDICAL_INCIDENT_OTHER" checked={form.medicalIncident === "SERIOUS_MEDICAL_INCIDENT_OTHER"} onChange={checkboxHandler}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabled5} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="serious-medical-incident-other">其他</label>
                            </div>
                            {
                                form.medicalIncident === "SERIOUS_MEDICAL_INCIDENT_OTHER" &&
                                <div className="">
                                    <AutosizeTextarea placeholder="請註明" className={`form-control ${(error && error['MI_Description']) ? "is-invalid" : ""}`} name="mi_description" value={form.mi_description} onChange={inputFieldHandler}
                                        disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus))} />
                                </div>
                            }
                        </div>
                    </div>
                    <hr />
                    <div className="form-row mb-2" style={{ marginTop: '15px' }}>
                        {/* (6) 其他重大特別事故以致影響院舍日常運作 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>(6) 其他重大特別事故以致影響院舍日常運作</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="otherIncident" id="other-incident-power-supply" value="OTHER_INCIDENT_POWER_SUPPLY" checked={form.otherIncident === "OTHER_INCIDENT_POWER_SUPPLY"} onChange={checkboxHandler}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabled6} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="other-incident-power-supply">停止電力供應</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="otherIncident" id="other-incident-building" value="OTHER_INCIDENT_BUILDING" checked={form.otherIncident === "OTHER_INCIDENT_BUILDING"} onChange={checkboxHandler}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabled6} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="other-incident-building">樓宇破損或結構問題</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="otherIncident" id="other-incident-fire" value="OTHER_INCIDENT_FIRE" checked={form.otherIncident === "OTHER_INCIDENT_FIRE"} onChange={checkboxHandler}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabled6} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="other-incident-fire">火警</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="otherIncident" id="other-incident-water-supply" value="OTHER_INCIDENT_WATER_SUPPLY" checked={form.otherIncident === "OTHER_INCIDENT_WATER_SUPPLY"} onChange={checkboxHandler}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabled6} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="other-incident-water-supply">停止食水供應</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" name="otherIncident" id="other-incident-other" value="OTHER_INCIDENT_OTHER" checked={form.otherIncident === "OTHER_INCIDENT_OTHER"} onChange={checkboxHandler}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabled6} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="other-incident-other">水浸／山泥傾瀉／不明氣體／其他天災意外</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" name="otherIncident" id="other-incident-others" value="OTHER_INCIDENT_OTHERS" checked={form.otherIncident === "OTHER_INCIDENT_OTHERS"} onChange={checkboxHandler}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabled6} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="other-incident-others">其他(例如:嚴重員工事故)，請註明</label>
                            </div>
                            {
                                form.otherIncident === "OTHER_INCIDENT_OTHERS" &&
                                <div className="">
                                    <AutosizeTextarea className={`form-control ${(error && error['OtherIncidentOthersDescription']) ? "is-invalid" : ""}`} placeholder="請註明" value={form.otherIncidentOthersDescription} name="otherIncidentOthersDescription" onChange={inputFieldHandler}
                                        disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus))} />
                                </div>
                            }
                        </div>
                    </div>

                    <hr />
                    <div className="form-row mb-2" style={{ marginTop: '15px' }}>
                        {/* (7) 其他 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>(7) 其他 (例如 ： 嚴重資料外洩或可能引起傳媒關注的事故)</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="other" id="other-incident-true" checked={form.other === true} onChange={(e) => checkboxHandler2(e, true)}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabled7} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="other-incident-true">有</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="other" id="other-incident-false" checked={form.other === false} onChange={(e) => checkboxHandler2(e, false)}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)) || disabled7} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="other-incident-false">沒有</label>
                            </div>
                            {
                                form.other &&
                                <AutosizeTextarea placeholder="請註明" className={`form-control ${(error && error['OtherDescription']) ? "is-invalid" : ""}`} value={form.otherDescription} onChange={inputFieldHandler} name="otherDescription"
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus))} />
                            }
                        </div>
                    </div>
                </section>



                <section className="mb-5">
                    <div className="form-row mb-3">
                        <div className="col-12 font-weight-bold">
                            <h5>住客及家屬情況</h5>
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/* 住客姓名 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>住客姓名</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" name="residentName" value={form.residentName} onChange={inputFieldHandler}
                                disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus))} />
                        </div>
                        {/* 年齡 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>年齡</label>
                        <div className="col-12 col-md-4">
                            <input type="number" className="form-control" min={0} name="residentAge" value={form.residentAge} onChange={(event) => setForm({ ...form, residentAge: +event.target.value })}
                                disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus))} />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/* 住客性別 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>性別</label>
                        <div className="col-12 col-md-4">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="tenantGender" id="tenant-gender-male" value="TENANT_GENDER_MALE" onClick={() => setForm({ ...form, residentGender: "male" })} checked={form.residentGender === "male"}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus))} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="tenant-gender-male">男</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="tenantGender" id="tenant-gender-female" value="TENANT_GENDER_FEMALE" onClick={() => setForm({ ...form, residentGender: "female" })} checked={form.residentGender === "female"}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus))} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="tenant-gender-female">女</label>
                            </div>
                        </div>
                        {/* 房及床號 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>房及/或床號</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" value={form.residentRoomNo} onChange={inputFieldHandler} name="residentRoomNo"
                                disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus))} />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <div className="col">
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="notified" id="notified-true" value="NOTIFIED_TRUE" onClick={(event) => setForm({ ...form, guardian: true })} checked={form.guardian === true}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus))} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="notified-true">已通知住客監護人／保證人／家人／親屬／相關員工／轉介社工／其他相關住客／人士（註３）（可填寫多於一名）</label>
                            </div>
                            {
                                form.guardian === true &&
                                <>
                                    <div className="row my-2">
                                        {/* 姓名 */}
                                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>姓名</label>
                                        <div className="col-12 col-md-4">
                                            <input type="text" className="form-control" value={form.guardianName} name="guardianName" onChange={inputFieldHandler}
                                                disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus))} />
                                        </div>
                                        {/* 關係 */}
                                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>關係</label>
                                        <div className="col-12 col-md-4">
                                            <input type="text" className="form-control" value={form.guardianRelation} name="guardianRelation" onChange={inputFieldHandler}
                                                disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus))} />
                                        </div>
                                    </div>
                                    <div className="row mb-2">
                                        {/* 負責通知的員工姓名 */}
                                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>負責通知的員工姓名</label>
                                        <div className="col-12 col-md-4">
                                            {/* <input type="text" className="form-control" value={form.guardianStaff} name="guardianStaff" onChange={inputFieldHandler}
                                                disabled={!pendingSmApprove(CURRENT_USER.email,currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)} /> */}
                                            <PeoplePicker
                                                context={context}
                                                personSelectionLimit={1}
                                                showtooltip={false}
                                                principalTypes={[PrincipalType.User]}
                                                resolveDelay={1000}
                                                selectedItems={setNotifyStaff}
                                                defaultSelectedUsers={notifyStaff && [notifyStaff.mail]}
                                                disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus))}
                                            />
                                        </div>
                                        {/* 負責通知的員工職位 */}
                                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>負責通知的員工職位</label>
                                        <div className="col-12 col-md-4">
                                            {/* <input type="text" className="form-control" disabled={true} /> */}
                                            <input type="text" className="form-control" value={(notifyStaff && notifyStaff.jobTitle) || ""} disabled={true} />
                                        </div>
                                    </div>
                                    <div className="row mb-2">
                                        {/* 日期和時間 */}
                                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>日期和時間</label>
                                        <div className="col-12 col-md-4">
                                            <DatePicker
                                                className="form-control"
                                                selected={form.guardianDate}
                                                onChange={(date) => setForm({ ...form, guardianDate: date })}
                                                showTimeSelect
                                                timeFormat="p"
                                                timeIntervals={15}
                                                dateFormat="yyyy/MM/dd h:mm aa"
                                                readOnly={!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)}
                                            />
                                        </div>
                                    </div>
                                </>
                            }
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="notified" id="notified-false" value="NOTIFIED_FALSE" onClick={(event) => setForm({ ...form, guardian: false })} checked={form.guardian === false}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus))} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="notified-false">沒有通知住客監護人／保證人／家人／親屬／相關員工／轉介社工／其他相關住客／人士</label>
                            </div>
                            {
                                form.guardian === false &&
                                <>
                                    <label>原因:</label>
                                    <AutosizeTextarea className="form-control" placeholder="請註明" value={form.guardianReason} onChange={inputFieldHandler} name="guardianReason"
                                        disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus))} />
                                </>
                            }
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>填報人姓名</label>
                        <div className="col-12 col-md-4">
                            {/* <PeoplePicker
                                context={context}
                                personSelectionLimit={1}
                                showtooltip={false}
                                principalTypes={[PrincipalType.User]}
                                resolveDelay={1000} /> */}
                            <input className="form-control" value={reporter && reporter.displayName || ""} disabled />
                        </div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>填報人職位</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" value={reporter && (reporterJobTitle || "")} disabled={true} />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>填報日期</label>
                        <div className="col-12 col-md-4">
                            <DatePicker
                                className="form-control"
                                selected={reportDate}
                                onChange={(date) => setReportDate(date)}
                                dateFormat="yyyy/MM/dd"
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="form-row" style={{ fontSize: '16px', margin: '50px 0' }}>
                        <div className="col-12">
                            <p style={{ fontWeight: 'bold', textDecoration: 'underline' }}>註1</p>
                            <p>如屬社會福利署津助院舍， 請同時通知以下社會福利署單位：</p>
                            <p>(1)津貼組(傳真:2575 5632 及 電郵:suenq@swd.gov.hk); 及</p>
                            <p>(2)康復及醫務社會服務科 （傳真：2893 6983 及 電郵：rehabenq@swd.gov.hk）</p>
                            <p style={{ fontWeight: 'bold', textDecoration: 'underline' }}>註2</p>
                            <p>精神虐待是指危害或損害被虐者心理健康的行為／或態度，例如羞辱，喝罵，孤立，令他們長期陷於恐懼中，侵犯他們的私隱，及在不必要的情況下限制他們的活動範圍或活動自由等</p>
                            <p style={{ fontWeight: 'bold', textDecoration: 'underline' }}>註3</p>
                            <p>須在顧及個人私隱的前提下，向相關的住客／家屬／員工或其他相關人員通「報特別事故」的資料。</p>
                        </div>
                    </div>
                </section>

                <section className="mb-5">
                    <div className="form-row mb-3">
                        <div className="col-12 font-weight-bold">
                            <h5>殘疾人士院舍特別事故報告 (附頁)</h5>
                        </div>
                    </div>
                    <div className="row mt-3 mb-2">
                        <div className="col-12">
                            <span>(此附頁／載有相關資料的自訂報告須連同首兩頁的表格一併呈交)</span>
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>殘疾人士院舍名稱</label>
                        <div className="col-12 col-xl-4">
                        <select className={`custom-select ${(error && error['ServiceUserUnit']) ? "is-invalid" : ""}`} value={serviceUnit} onChange={(event) => { changeServiceUserUnit(event) }}//setPatientServiceUnit(event.target.value)
                                disabled={type=='cms' ||(!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus))}
                            >
                                <option value={""} ></option>
                                {serviceUnit != "" && permissionList.indexOf('All') >= 0 &&
                                    serviceUserUnitList.map((item) => {
                                        console.log('serviceUnit1234',serviceUnit);
                                        if (serviceUnit == 'JFP') {
                                            console.log('serviceUnit',serviceUnit);
                                            debugger
                                        }
                                        return <option value={item.su_Eng_name_display} selected={serviceUnit != '' && item.su_Eng_name_display == serviceUnit}>{item.su_name_tc}</option>
                                    })
                                }
                                {serviceUnit == "" && permissionList.indexOf('All') >= 0 &&
                                    serviceUserUnitList.map((item) => {
                                        console.log('serviceUnit1234',serviceUnit);

                                        return <option value={item.su_Eng_name_display} selected={serviceUnit != '' && item.su_Eng_name_display == serviceUnit}>{item.su_name_tc}</option>
                                    })
                                }
                                {serviceUnit != "" && permissionList.indexOf('All') < 0 &&
                                    permissionList.map((item) => {
                                        let ser = serviceUserUnitList.filter(o => { return o.su_Eng_name_display == item });

                                        if (ser.length > 0) {
                                            return <option value={ser[0].su_Eng_name_display} selected={serviceUnit != '' && item.su_Eng_name_display == serviceUnit}>{ser[0].su_name_tc}</option>
                                        }

                                    })
                                }
                                {serviceUnit == "" && permissionList.indexOf('All') < 0 &&
                                    permissionList.map((item) => {
                                        let ser = serviceUserUnitList.filter(o => { return o.su_Eng_name_display == item });

                                        if (ser.length > 0) {
                                            return <option value={ser[0].su_Eng_name_display} selected={serviceUnit != '' && item.su_Eng_name_display == serviceUnit}>{ser[0].su_name_tc}</option>
                                        }

                                    })
                                }
                            </select>
                        </div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>事故發生日期和時間</label>
                        <div className="col-12 col-md-4">
                            <DatePicker
                                className={`form-control ${(error && error['IncidentTime']) ? "is-invalid" : ""}`}
                                selected={incidentTime}
                                onChange={setIncidentTime}
                                showTimeSelect
                                timeFormat="p"
                                timeIntervals={15}
                                dateFormat="yyyy/MM/dd h:mm aa"
                                readOnly={!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus)}
                            />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>受影響住客姓名</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" name="affectedName" value={form.affectedName} onChange={inputFieldHandler}
                                disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus))} />
                        </div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>身份證號碼 (A123456(7))</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className={`form-control IdCard ${(error && error['AffectedIdCardNo']) ? "is-invalid" : ""}`} name="affectedIdCardNo" value={form.affectedIdCardNo} onChange={inputFieldHandler}
                                disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus))} />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/* 住客性別 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>性別</label>
                        <div className="col-12 col-md-4">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="affectedGender" id="attach-tenant-gender-male" value="male" onChange={radioButtonHandler} checked={form.affectedGender === "male"}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus))} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="attach-tenant-gender-male">男</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="affectedGender" id="attach-tenant-gender-female" value="female" onChange={radioButtonHandler} checked={form.affectedGender === "female"}
                                    disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus))} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="attach-tenant-gender-female">女</label>
                            </div>
                        </div>
                        {/* 年齡 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>年齡</label>
                        <div className="col-12 col-md-4">
                            <input type="number" className="form-control" min={0} name="affectedAge" value={form.affectedAge} onChange={(event) => setForm({ ...form, affectedAge: +event.target.value })}
                                disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus))} />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/* 住客病歷 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>住客病歷(如適用)</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" value={form.affectedMedicalRecord} name="affectedMedicalRecord" onChange={inputFieldHandler}
                                disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus))} />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/* 特別事故詳情／發生經過 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>特別事故詳情／發生經過</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" value={form.affectedDetail} name="affectedDetail" onChange={inputFieldHandler}
                                disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus))} />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/* 院舍跟進行動／預防事故再次發生的建議或措施 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>院舍跟進行動（包括但不限於相關醫療安排，舉行多專業個案會議，為有關住客訂定照顧計劃，保護其他住客的措施，回應外界團體（例如關注組，區議會，立法會）等的關注或查詢）及／或預防事故再次發生的建議或措施</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" value={form.affectedFollowUp} name="affectedFollowUp" onChange={inputFieldHandler}
                                disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus))} />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/* 填報人姓名 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>填報人姓名</label>
                        <div className="col-12 col-md-4">
                            {/* <PeoplePicker
                                context={context}
                                personSelectionLimit={1}
                                showtooltip={false}
                                principalTypes={[PrincipalType.User]}
                                resolveDelay={1000} /> */}
                            <input className="form-control" value={reporter && reporter.displayName || ""} disabled />
                        </div>
                        {/* 職位 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>職位</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" value={reporter && (reporterJobTitle || "")} disabled={true} />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>填報日期</label>
                        <div className="col-12 col-md-4">
                            <DatePicker
                                className="form-control"
                                selected={reportDate}
                                onChange={(date) => setReportDate(date)}
                                showTimeSelect
                                timeFormat="p"
                                timeIntervals={15}
                                dateFormat="yyyy/MM/dd"
                                readOnly
                            />
                        </div>
                    </div>
                </section>

                <hr className="my-4" />

                <section className="mb-5">
                    <div className="form-row mb-2">
                        <div className="col-12 font-weight-bold mb-2">
                            <span className={`${styles.fieldTitle} ${styles.fillIn}`}>[此欄由高級服務經理/服務經理填寫]</span>
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        {/* 服務經理姓名 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>高級服務經理/<span className="d-sm-inline d-md-block">服務經理姓名</span></label>
                        <div className="col-12 col-md-4">
                            {/*<input type="text" className="form-control" value={`${smInfo && smInfo.Lastname || ""} ${smInfo && smInfo.Firstname || ""}`.trim() || `${smInfo && smInfo.Name || ""}`} disabled={true} />*/}
                            {
                                formInitial(currentUserRole, formStatus) && Array.isArray(departments) && departments.length > 0 && departments[0].override === true ?
                                    <select className={`custom-select`} value={smInfo && smInfo.Email} onChange={(event => setSMEmail(event.target.value))}
                                        disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus))}>
                                        <option value={departments[0].hr_deptmgr}>{departments[0].hr_deptmgr}</option>
                                        <option value={departments[0].new_deptmgr}>{departments[0].new_deptmgr}</option>
                                    </select>
                                    :
                                    <input type="text" className="form-control" value={`${smInfo && smInfo.Lastname || ""} ${smInfo && smInfo.Firstname || ""}`.trim() || `${smInfo && smInfo.Name || ""}`} disabled={true} />
                            }
                        </div>
                        <label className={`col-12 col-md-1 col-form-label ${styles.fieldTitle} pt-xl-0`}>日期</label>
                        <div className="col-12 col-md-5">
                            <DatePicker className="form-control" selected={smDate} onChange={(date) => setSmDate(date)} dateFormat={"yyyy/MM/dd"} readOnly />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>高級服務經理/<span className="d-sm-inline d-md-block">服務經理評語</span></label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" value={smComment}
                                onChange={(event) => setSmComment(event.target.value)}
                                disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitBySm(CURRENT_USER.email, spSmInfo ? spSmInfo.Email : "", formStatus))} />
                        </div>
                    </div>
                    {
                        pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) &&
                        <div className="form-row mb-2">
                            <div className="col-12">
                                <div className="d-flex justify-content-center">
                                    <button className="btn btn-warning mr-3" onClick={smApproveHandler}>批准</button>
                                    <button className="btn btn-danger mr-3" onClick={smRejectHandler}>拒絕</button>
                                </div>
                            </div>
                        </div>
                    }
                </section>

                <hr className="my-4" />

                <section className="mb-5">
                    <div className="form-row mb-2">
                        <div className="col-12 font-weight-bold mb-2">
                            <span className={`${styles.fieldTitle} ${styles.fillIn}`}>[此欄由服務總監填寫]</span>
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/* SD */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>服務總監姓名</label>
                        <div className="col-12 col-md-4">
                            {/*<input type="text" className="form-control" value={`${sdInfo && sdInfo.Lastname || ""} ${sdInfo && sdInfo.Firstname || ""} `.trim() || `${sdInfo && sdInfo.Name || ""}`} disabled={true} />*/}
                            {
                                formInitial(currentUserRole, formStatus) && Array.isArray(departments) && departments.length > 0 && departments[0].override === true ?
                                    <select className={`custom-select`} value={sdInfo && sdInfo.Email} onChange={(event => setSDEmail(event.target.value))}
                                        disabled={type=='cms' || (!pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) && !formInitial(currentUserRole, formStatus))}
                                    >
                                        <option value={departments[0].hr_sd}>{departments[0].hr_sd}</option>
                                        <option value={departments[0].new_sd}>{departments[0].new_sd}</option>
                                    </select>
                                    :
                                    <input type="text" className="form-control" value={`${sdInfo && sdInfo.Lastname || ""} ${sdInfo && sdInfo.Firstname || ""} `.trim() || `${sdInfo && sdInfo.Name || ""}`} disabled={true} />
                            }
                        </div>
                        <label className={`col-12 col-md-1 col-form-label ${styles.fieldTitle} pt-xl-0`}>日期</label>
                        <div className="col-12 col-md-5">
                            <DatePicker className="form-control" dateFormat="yyyy/MM/dd" selected={sdDate} onChange={(date) => setSdDate(date)} readOnly />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>服務總監評語</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" value={sdComment} onChange={(event) => setSdComment(event.target.value)} disabled={type=='cms' || (!pendingSdApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSdInfo))} />
                        </div>
                    </div>
                    {/* <div className="form-row row mb-2">
                        <div className="col-12">
                            <button className="btn btn-primary">儲存評語</button>
                        </div>
                    </div> */}
                    {
                        pendingSdApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSdInfo) &&
                        <div className="form-row justify-content-center mb-2">
                            <div className="col-md-2 col-4">
                                <button className="btn btn-warning w-100" onClick={sdApproveHandler}>批准</button>
                            </div>
                            <div className="col-md-2 col-4">
                                <button className="btn btn-danger w-100" onClick={sdRejectHandler}>拒絕</button>
                            </div>
                        </div>
                    }
                </section>

                <hr className="my-4" />
                {type != 'cms' &&
                <section className="py-3">
                    <div className="row">
                        {
                            formInitial(currentUserRole, formStatus) &&
                            <div className='col-md-2 col-4 mb-2'>
                                <button className="btn btn-warning w-100" onClick={submitHandler}>提交</button>
                            </div>
                        }

                        {
                            adminUpdateInsuranceNumber(currentUserRole, formStatus) &&
                            <div className='col-md-2 col-4 mb-2'>
                                <button className="btn btn-warning w-100" onClick={() => adminSubmitHanlder(true)}>儲存</button>
                            </div>
                        }
                        {
                            pendingSmApprove(CURRENT_USER.email, currentUserRole, formStatus, formStage, spSmInfo) &&
                            <div className='col-md-2 col-4 mb-2'>
                                <button className="btn btn-warning w-100" onClick={smSubmitHandler}>儲存</button>
                            </div>
                        }

                        {
                            formInitial(currentUserRole, formStatus) && formStatus !== "SM_VOID" &&
                            <div className='col-md-2 col-4 mb-2'>
                                <button className="btn btn-success w-100" onClick={draftHandler}>草稿</button>
                            </div>
                        }

                        {
                            formInitial(currentUserRole, formStatus) &&
                            <div className='col-md-2 col-4 mb-2'>
                                <button className="btn btn-danger w-100" onClick={deleteHandler}>刪除</button>
                            </div>
                        }
                        <div className='col-md-2 col-4 mb-2'>
                            <button className="btn btn-secondary w-100" onClick={cancelHandler}>取消</button>
                        </div>
                        <div className='col-md-2 col-4 mb-2'>
                            <button className="btn btn-warning w-100" onClick={() => print()}>打印</button>
                        </div>
                        {formStage == '2' && adminUpdateInsuranceNumber(currentUserRole, formStatus) && sendInsuranceEmail &&
                            <>
                                <div className='col-md-2 col-4 mb-2'>
                                    <button className="btn btn-secondary w-100" onClick={() => setOpenModel(true)}>發送保險</button>
                                </div>
                            </>
                        }
                        {formStage == '2' && adminUpdateInsuranceNumber(currentUserRole, formStatus) && !sendInsuranceEmail &&
                            <>
                                <div className='col-md-2 col-4 mb-2'>
                                    <button className="btn btn-secondary w-100" disabled>發送保險(已發送)</button>
                                </div>
                            </>
                        }
                    </div>
                </section>
                }
                {/*type =='cms' &&
                <section className="py-3">
                    <div className="row">
                        <div className="col-md-2 col-4 mb-2">
                            <button className="btn btn-warning w-100" onClick={(event => backToCMS(event))}>返回</button>
                        </div>

                    </div>
                </section>
            */}
                {openModel &&

                    <Modal dialogClassName="formModal" show={openModel} size="lg" backdrop="static">
                        <Modal.Header>
                            <div style={{ height: '15px' }}>
                                <FontAwesomeIcon icon={fontawesome["faTimes"]} size="2x" style={{ float: 'right', cursor: 'pointer', position: 'absolute', top: '10px', right: '10px' }} onClick={() => setOpenModel(false)} />
                            </div>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="row" style={{ padding: '15px' }}>
                                <div className="col-12" >
                                    <input type="file" onChange={incomingfile} className="custom-file-input" />
                                    <label className="custom-file-label">{filename}</label>
                                </div>
                                <div className="col-12" style={{ padding: '0', margin: '10px 0' }}>
                                    <input type="text" onChange={emailToChangeHandler} className={`form-control`} value={emailTo} />
                                </div>
                                <div className="col-12" style={{ padding: '0', margin: '10px 0' }}>
                                    <textarea className={`form-control`} style={{ minHeight: '400px' }} value={emailBody} id="emailBody" onChange={emailBodyChangeHandler} />
                                </div>
                                <div className="col-12" style={{ padding: '0', margin: '10px 0' }}>
                                    <button className="btn btn-warning mr-3" disabled={uploadButton} onClick={() => send()}>發送</button>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>

                }
                {openSubmitInsuranceModel &&

                    <Modal dialogClassName="formModal" show={openSubmitInsuranceModel} size="lg" backdrop="static">
                        <Modal.Header>
                            <div style={{ height: '15px' }}>
                                <FontAwesomeIcon icon={fontawesome["faTimes"]} size="2x" style={{ float: 'right', cursor: 'pointer', position: 'absolute', top: '10px', right: '10px' }} onClick={() => setOpenSubmitInsuranceModel(false)} />
                            </div>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="row" style={{ padding: '15px' }}>

                                <div className="col-12" style={{ padding: '0', margin: '10px 0' }}>
                                    Submit Insurance Case No without sending email
                                </div>
                                <div className="col-12" style={{ padding: '0', margin: '10px 0' }}>
                                    <button className="btn btn-warning mr-3" onClick={() => adminSubmitHanlder(false)}>發送</button>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>

                    }
            </div>
        </>
    )
}
