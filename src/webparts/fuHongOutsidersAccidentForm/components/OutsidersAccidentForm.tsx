import * as React from 'react'
import { useEffect, useState } from 'react';
import DatePicker from "react-datepicker";
import Header from "../../../components/Header/Header";
import "react-datepicker/dist/react-datepicker.css";
import styles from './FuHongOutsidersAccidentForm.module.scss';
import "./custom.css";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as moment from 'moment';
import StyledDropzone from "../../../components/Dropzone/Dropzone";
import AutosizeTextarea from "../../../components/AutosizeTextarea/AutosizeTextarea";
import { IOutsidersAccidentFormStates, IErrorFields } from './IFuHongOutsidersAccidentForm';
import useUserInfoAD from '../../../hooks/useUserInfoAD';
import { IUser } from '../../../interface/IUser';
import useServiceUnit from '../../../hooks/useServiceUnits';
import { createAccidentReportForm, createOutsiderAccidentForm, getOutsidersAccidentAllAttachmentById, updateOutsiderAccidentFormById, updateOutsidersAccidentFormAttachmentById } from '../../../api/PostFuHongList';
import useUserInfo from '../../../hooks/useUserInfo';
import useDepartmentMangers from '../../../hooks/useDepartmentManagers';
import { caseNumberFactory } from '../../../utils/CaseNumberParser';
import { FormFlow, getOutsiderAccidentById } from '../../../api/FetchFuHongList';
import { Role } from '../../../utils/RoleParser';
import useSharePointGroup from '../../../hooks/useSharePointGroup';
import useSPT from '../../../hooks/useSPT';
import { formInitBySm, formInitial, pendingSmApprove, pendingSptApproveForSD, pendingSptApproveForSPT } from '../../fuHongServiceUserAccidentForm/permissionConfig';
import { addBusinessDays, addMonths } from '../../../utils/DateUtils';
import { attachmentsFilesFormatParser } from '../../../utils/FilesParser';

if (document.getElementById('workbenchPageContent') != null) {
    document.getElementById('workbenchPageContent').style.maxWidth = '1920px';
}

if (document.querySelector('.CanvasZone') != null) {
    (document.querySelector('.CanvasZone') as HTMLElement).style.maxWidth = '1920px';
}
interface IOutsidersAccidentFormProps {
    context: WebPartContext;
    currentUserRole: Role,
    formSubmittedHandler(): void;
    formData: any
}

export default function OutsidersAccidentForm({ context, formSubmittedHandler, currentUserRole, formData }: IOutsidersAccidentFormProps) {
    const [error, setError] = useState<IErrorFields>();
    const [formStatus, setFormStatus] = useState("");
    const [formStage, setFormStage] = useState("");
    const [formId, setFormId] = useState(null);
    const [reportDate, setReportDate] = useState(new Date());
    const [accidentTime, setAccidentTime] = useState(new Date());
    const [cctvRecordReceiveDate, setCctvRecordReceiveDate] = useState(new Date());
    const [hospitalArriveTime, setHospitalArriveTime] = useState(new Date());
    const [hospitalLeaveTime, setHospitalLeaveTime] = useState(new Date());
    const [policeDatetime, setPoliceDatetime] = useState(new Date());
    const [smDate, setSmDate] = useState(new Date());
    const [sdDate, setSdDate] = useState(new Date());
    const [sptDate, setSptDate] = useState(new Date());
    const [smComment, setSmComment] = useState("");
    const [sdComment, setSdComment] = useState("");
    const [sptComment, setSptComment] = useState("");
    const [sPhysicalTherapy, setSPhysicalTherapyEmail, sPhysicalTherapyEmail] = useSharePointGroup(); // [此欄由高級物理治療師填寫]
    const [investigator, setInvestigator, investigatorPickerInfo] = useUserInfoAD(); // [調查]

    const [userInfo, setCurrentUserEmail, spUserInfo] = useUserInfo();
    const [sdInfo, setSDEmail, spSdInfo] = useUserInfo();
    const [smInfo, setSMEmail, spSmInfo] = useUserInfo();
    const { departments, setHrDepartment } = useDepartmentMangers();
    const [sptList] = useSPT();
    const [familyContactDate, setFamilyContactDate] = useState(new Date());
    const [selectedPhotoRecordFiles, setSelectedPhotoRecordFiles] = useState([]);
    const [uploadedPhotoRecordFiles, setUploadedPhotoRecordFiles] = useState([]);
    const [form, setForm] = useState<IOutsidersAccidentFormStates>({
        accidentDetail: "",
        accidentLocation: "",
        cctvRecord: null,
        envAcousticStimulation: false,
        envCollidedByOthers: false,
        envHurtByOthers: false,
        envImproperEquip: false,
        envInsufficientLight: false,
        envNotEnoughSpace: false,
        envObstacleItems: false,
        envOtherDescription: "",
        envSlipperyGround: false,
        envUnevenGround: false,
        envOther: false,
        familyContact: undefined,
        familyRelationship: "",
        medicalArrangement: "",
        medicalArrangementHospital: "",
        otherFactor: "",
        photoRecord: undefined,
        police: undefined,
        policeStation: "",
        serviceUnit: "",
        serviceUserAge: 0,
        serviceUserGender: "",
        serviceUserIdentity: "",
        serviceUserIdentityOther: "",
        serviceUserNameEN: "",
        serviceUserNameTC: "",
        witness: undefined,
        witnessName: "",
        witnessPhone: "",
        insuranceCaseNo: ""
    });

    const [reporter, setReporter, reporterPickerInfo] = useUserInfoAD(); // 填報人姓名
    const [serviceUnitList, serviceUnit, setServiceUnit] = useServiceUnit();


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

    // const checkboxHandler = (event) => {
    //     const name = event.target.name;
    //     const value = event.target.value;
    //     const arr = form[name];
    //     if (Array.isArray(arr)) {
    //         if (arr.indexOf(value) > -1) {
    //             const result = arr.filter((item) => item !== value);
    //             setForm({ ...form, [name]: result });
    //         } else {
    //             setForm({ ...form, [name]: [...arr, value] });
    //         }
    //     }
    // }

    const selectionHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setForm({ ...form, [name]: value });
    }

    const inputFieldHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setForm({ ...form, [name]: value });
    }

    const checkboxBoolHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setForm({ ...form, [name]: !form[name] });
    }

    const dataFactory = (status: string) => {
        const body = {};
        const error: IErrorFields = {};


        if (serviceUnit) {
            body["ServiceUnit"] = serviceUnit
        } else {
            error["ServiceUnit"] = true;
        }

        // user info 
        if (form.serviceUserNameTC) {
            body["ServiceUserNameTC"] = form.serviceUserNameTC;
        } else {
            error["ServiceUserNameTC"] = true;
        }

        if (form.serviceUserNameEN) {
            body["ServiceUserNameEN"] = form.serviceUserNameEN;
        } else {
            error["ServiceUserNameEN"] = true;
        }

        if (form.serviceUserAge) {
            body["ServiceUserAge"] = form.serviceUserAge;
        } else {
            error["ServiceUserAge"] = true;
        }

        if (form.serviceUserGender) {
            body["ServiceUserGender"] = form.serviceUserGender;
        } else {
            error["ServiceUserGender"] = true;
        }

        if (form.serviceUserIdentity) {
            body["ServiceUserIdentity"] = form.serviceUserIdentity;
            if (form.serviceUserIdentity === "others") {
                if (form.serviceUserIdentityOther) {
                    body["ServiceUserIdentityOther"] = form.serviceUserIdentityOther;
                } else {
                    error["ServiceUserIdentity"] = true;
                }
            }
        } else {
            error["ServiceUserIdentity"] = true;
        }

        body["AccidentTime"] = accidentTime.toISOString();
        if (form.accidentLocation) {
            body["AccidentLocation"] = form.accidentLocation;
        } else {
            error["AccidentLocation"] = true;
        }

        // 環境因素
        body["EnvSlipperyGround"] = form.envSlipperyGround;
        body["EnvUnevenGround"] = form.envUnevenGround;
        body["EnvObstacleItems"] = form.envObstacleItems;
        body["EnvInsufficientLight"] = form.envInsufficientLight;
        body["EnvNotEnoughSpace"] = form.envNotEnoughSpace;
        body["EnvAcousticStimulation"] = form.envAcousticStimulation;
        body["EnvCollidedByOthers"] = form.envCollidedByOthers;
        body["EnvHurtByOthers"] = form.envHurtByOthers;
        body["EnvImproperEquip"] = form.envImproperEquip;

        body["EnvOther"] = form.envOther;
        if (form.envOther === true) {
            if (form.envOtherDescription) {
                body["EnvOtherDescription"] = form.envOtherDescription;
            } else {
                error["EnvOtherDescription"] === true;
            }
        } else if (form.envOther === undefined) {
            error["EnvOther"] = true;
        }

        //其他因素
        body["OtherFactor"] = form.otherFactor;

        //事發過程
        body["AccidentDetail"] = form.accidentDetail;

        //意外事件有否證人目擊事故發生經過?
        body["Witness"] = form.witness;
        if (form.witness === true) {
            if (form.witnessName) {
                body["WitnessName"] = form.witnessName;
            } else {
                error["WitnessName"] = true;
            }

            if (form.witnessPhone) {
                body["WitnessPhone"] = form.witnessPhone;
            } else {
                error["WitnessPhone"] = true;
            }
        } else if (form.witness === undefined) {
            error["Witness"] = true;
        }
        // 相片
        body["PhotoRecord"] = form.photoRecord;
        if (form.photoRecord === true) {
            // Implement
            // selectedPhotoRecordFiles
        } else if (form.photoRecord === undefined) {
            error["PhotoRecord"] = true;
        }

        // CCTV
        body["CctvRecord"]
        if (form.cctvRecord === true) {
            body["CctvRecordReceiveDate"] = cctvRecordReceiveDate.toISOString();
        } else if (form.cctvRecord === undefined) {
            error["CctvRecord"] = true;
        }

        // 就診安排
        if (form.medicalArrangement) {
            body["MedicalArrangement"] = form.medicalArrangement;
            // 急症室
            if (form.medicalArrangement === "ARRANGEMENT_EMERGENCY_DEPARTMENT") {
                if (form.medicalArrangementHospital) {
                    body["MedicalArrangementHospital"] = form.medicalArrangementHospital;
                } else {
                    error["MedicalArrangementHospital"] = true;
                }
                body["HospitalArriveTime"] = hospitalArriveTime.toISOString();
                body["HospitalLeaveTime"] = hospitalLeaveTime.toISOString();
            }
        } else {
            error["MedicalArrangement"] = true;
        }

        //報警處理
        body["Police"] = form.police;
        if (form.police === true) {
            body["PoliceDatetime"] = policeDatetime.toISOString();

            if (form.policeStation) {
                body["PoliceStation"] = form.policeStation;
            } else {
                error["PoliceStation"] = true;
            }
        } else if (form.police === undefined) {
            error["Police"] = true;
        }
        //家屬聯絡
        body["FamilyContact"] = form.familyContact;
        if (form.familyContact === true) {
            body["FamilyContactDate"] = familyContactDate.toISOString();
            if (form.familyRelationship) {
                body["FamilyRelationship"] = form.familyRelationship;
            } else {
                error["FamilyRelationship"] = true;
            }
        } else if (form.familyContact === undefined) {
            error["FamilyContact"] = true;
        }

        // 高級服務經理/服務經理
        body["SMId"] = spSmInfo.Id;
        // 服務總監
        body["SDId"] = spSdInfo.Id;
        // 高級物理治療師
        if (sPhysicalTherapy) {
            body["SPTId"] = sPhysicalTherapy.Id;
        } else {
            //error implementation
            error["spt"] = "請選擇";
        }

        if (currentUserRole === Role.SERVICE_MANAGER && status === "SUBMIT") {
            body["SMApproved"] = true;
            body["Status"] = "PENDING_SPT_APPROVE";
            body["NextDeadline"] = addBusinessDays(new Date(), 3).toISOString();
        } else if (status === "SUBMIT") {
            body["Status"] = "PENDING_SM_APPROVE";
            body["NextDeadline"] = addBusinessDays(new Date(), 3).toISOString();
        } else if (status === "DRAFT") {
            // body["Status"] = "DRAFT";
        }

        body["Stage"] = "1";
        return [body, error];
    }

    const submitHandler = (event) => {
        event.preventDefault();
        const [body, error] = dataFactory("SUBMIT");
        console.log(body);
        console.log(error);
        if (currentUserRole === Role.ADMIN) {
            updateOutsiderAccidentFormById(formId, {
                "InsuranceCaseNo": form.insuranceCaseNo
            }).then((res) => {
                // Update form to stage 1-2
                // Trigger notification workflow
                console.log(res);
                formSubmittedHandler();
            }).catch(console.error);
        } else if (pendingSptApproveForSD(currentUserRole, formStatus, formStage)) {
            updateOutsiderAccidentFormById(formId, {
                "SDComment": sdComment,
                "SDDate": sdDate.toISOString(),
            }).then((res) => {
                // Update form to stage 1-2
                // Trigger notification workflow
                console.log(res);
                formSubmittedHandler();
            }).catch(console.error);
        } else {

            // Draft update havent implement
            caseNumberFactory(FormFlow.OUTSIDER_ACCIDENT, serviceUnit).then((caseNubmer) => {
                console.log(caseNubmer);
                let extraBody = {
                    "CaseNumber": caseNubmer,
                    "Title": "PUI"
                }

                if (CURRENT_USER.email === spSmInfo.Email) {
                    extraBody["SMApproved"] = true;
                    extraBody["SMComment"] = smComment;
                    extraBody["SMDate"] = new Date().toISOString();
                    extraBody["NextDeadline"] = addBusinessDays(new Date(), 3).toISOString();
                    extraBody["Status"] = "PENDING_SPT_APPROVE";
                }

                if (formStatus === "DRAFT") {
                    updateOutsiderAccidentFormById(formData.Id, {
                        ...body,
                        ...extraBody
                    }).then(async (updateOutsiderAccidentFormByIdRes) => {
                        console.log(updateOutsiderAccidentFormByIdRes)
                        // Photo upload implement
                        let att = [];
                        if (form.photoRecord === true && selectedPhotoRecordFiles.length > 0) {
                            att = [...attachmentsFilesFormatParser(selectedPhotoRecordFiles, "CCTV")];
                        }

                        if (att.length > 0) {
                            await updateOutsidersAccidentFormAttachmentById(formData.Id, att).then((updateOutsidersAccidentFormAttachmentByIdRes) => {
                                if (updateOutsidersAccidentFormAttachmentByIdRes) {
                                    console.log(updateOutsidersAccidentFormAttachmentByIdRes);
                                }
                            }).catch(console.error);
                        }
                        formSubmittedHandler();
                    })
                } else {
                    createOutsiderAccidentForm({
                        ...body,
                        ...extraBody
                    }).then(async createOutsiderAccidentFormRes => {
                        if (createOutsiderAccidentFormRes && createOutsiderAccidentFormRes.data && createOutsiderAccidentFormRes.data.Id) {
                            console.log(createOutsiderAccidentFormRes);
                            // Photo upload implement
                            let att = [];
                            if (form.photoRecord === true && selectedPhotoRecordFiles.length > 0) {
                                att = [...attachmentsFilesFormatParser(selectedPhotoRecordFiles, "CCTV")];
                            }

                            if (att.length > 0) {
                                await updateOutsidersAccidentFormAttachmentById(createOutsiderAccidentFormRes.data.Id, att).then((updateOutsidersAccidentFormAttachmentByIdRes) => {
                                    if (updateOutsidersAccidentFormAttachmentByIdRes) {
                                        console.log(updateOutsidersAccidentFormAttachmentByIdRes)
                                    }
                                }).catch(console.error);
                            }
                        }

                        formSubmittedHandler();
                    }).catch(console.error);
                }
            }).catch(console.error);

        }
    }


    // const adminSubmitHanlder = (event) => {
    //     event.preventDefault();
    // }

    const draftHandler = (event) => {
        event.preventDefault();
        const [body] = dataFactory("DRAFT");
        if (formStatus === "DRAFT") {
            updateOutsiderAccidentFormById(formData.Id, {
                ...body,
                "Title": "PUI",
                "Status": "DRAFT"
            }).then(async (updateOutsiderAccidentFormByIdRes) => {

                let att = [];

                if (form.photoRecord === true && selectedPhotoRecordFiles.length > 0) {
                    att = [...attachmentsFilesFormatParser(selectedPhotoRecordFiles, "CCTV")];
                }

                if (att.length > 0) {
                    await updateOutsidersAccidentFormAttachmentById(formData.Id, att).then((updateOutsidersAccidentFormAttachmentByIdRes) => {
                        if (updateOutsidersAccidentFormAttachmentByIdRes) {
                            console.log(updateOutsidersAccidentFormAttachmentByIdRes)
                        }
                    }).catch(console.error);
                }

                formSubmittedHandler();
            }).catch(console.error);
        } else {
            createOutsiderAccidentForm({
                ...body,
                "Title": "PUI",
                "Status": "DRAFT"
            }).then(async (createOutsiderAccidentFormRes) => {
                console.log(createOutsiderAccidentFormRes);
                if (createOutsiderAccidentFormRes && createOutsiderAccidentFormRes.data && createOutsiderAccidentFormRes.data.Id) {
                    let att = [];

                    if (form.photoRecord === true && selectedPhotoRecordFiles.length > 0) {
                        att = [...attachmentsFilesFormatParser(selectedPhotoRecordFiles, "CCTV")];
                    }

                    if (att.length > 0) {
                        await updateOutsidersAccidentFormAttachmentById(createOutsiderAccidentFormRes.data.Id, att).then((updateOutsidersAccidentFormAttachmentByIdRes) => {
                            if (updateOutsidersAccidentFormAttachmentByIdRes) {
                                console.log(updateOutsidersAccidentFormAttachmentByIdRes)
                            }
                        }).catch(console.error);
                    }
                }
                formSubmittedHandler();
            }).catch(console.error);
        }
    }

    function cancelHandler() {
        const path = context.pageContext.site.absoluteUrl + `/accident-and-incident/SitePages/Home.aspx`;
        window.open(path, "_self");
    }

    const smApproveHandler = (event) => {
        if (confirm("確認批准 ?")) {
            const [body, error] = dataFactory("");

            if (Object.keys(error).length > 0) {
                setError(error);
            } else {
                updateOutsiderAccidentFormById(formId, {
                    ...body,
                    "SMApproved": true,
                    "SMComment": smComment,
                    "SMDate": smDate.toISOString(),
                    "NextDeadline": addBusinessDays(new Date(), 3).toISOString(),
                    "Status": "PENDING_SPT_APPROVE"
                }).then((res) => {
                    // Update form to stage 1-2
                    // Trigger notification workflow
                    console.log(res);
                    formSubmittedHandler();
                }).catch(console.error);
            }
        }
    }

    const smRejectHandler = (event) => {
        if (confirm("確認拒絕 ?")) {
            if (spSmInfo.Email === formData.Author.EMail) return;
            const body = {
                "SMApproved": false,
                "SMComment": smComment,
                "SMDate": smDate.toISOString(),
                "Status": ""
            };
            updateOutsiderAccidentFormById(formId, body).then(() => formSubmittedHandler()).catch(console.error);
        }
    }

    const sptApproveHandler = (event) => {
        if (confirm("確認批准 ?")) {
            const [body, error] = dataFactory("");
            if (Object.keys(error).length > 0) {
                setError(error);
            } else {
                if (Array.isArray(investigatorPickerInfo) && investigatorPickerInfo.length > 0) {
                    const serviceAccidentUserFormBody = {
                        ...body,
                        "SPTApproved": true,
                        "SPTComment": sptComment,
                        "SPTDate": sptDate.toISOString(),
                        "InvestigatorId": investigatorPickerInfo[0].id,
                        "Status": "PENDING_INVESTIGATE",
                        "Stage": "2",
                        "NextDeadline": addMonths(new Date(), 1).toISOString()
                    };
                    updateOutsiderAccidentFormById(formId, serviceAccidentUserFormBody).then((formOneResponse) => {
                        // Create form 20, switch to stage 2]
                        if (formOneResponse) {
                            getOutsiderAccidentById(formId).then((outsiderAccidentForm) => {
                                if (outsiderAccidentForm && outsiderAccidentForm.CaseNumber && outsiderAccidentForm.Id) {
                                    let accidentTime = outsiderAccidentForm.AccidentTime
                                    const accidentReportFormBody = {
                                        "CaseNumber": outsiderAccidentForm.CaseNumber,
                                        "ParentFormId": outsiderAccidentForm.Id,
                                        "EstimatedFinishDate": new Date(new Date(accidentTime).setMonth(new Date(accidentTime).getMonth() + 1)), //預估完成分析日期 意外發生日期+1 month
                                        "ReceivedDate": new Date().toISOString(), // 交付日期
                                        "SPTId": outsiderAccidentForm.SPTId,
                                        "SMId": outsiderAccidentForm.SMId,
                                        "InvestigatorId": outsiderAccidentForm.InvestigatorId
                                    }
                                    createAccidentReportForm(accidentReportFormBody).then((formTwoResponse) => {
                                        // Trigger notification workflow


                                        //AccidentReportForm
                                        if (formTwoResponse && formTwoResponse.data && formTwoResponse.data.Id) {

                                            updateOutsiderAccidentFormById(formId, { "AccidentReportFormId": formTwoResponse.data.Id }).then((res) => {
                                                console.log(res)
                                                formSubmittedHandler()
                                            }).catch(console.error);
                                        }
                                    })
                                }
                            }).catch(console.error);
                        }
                    });
                } else {
                    // error implementation
                }
            }
        }
    }

    const sptRejectHandler = (event) => {
        if (confirm("確認拒絕 ?")) {
            const body = {
                "SPTApproved": false,
                "SPTComment": sptComment,
                "SPTDate": new Date().toISOString(),
                "InvestigatorId": investigatorPickerInfo[0].id,
                "Status": "PENDING_SM_APPROVE"
            };
            updateOutsiderAccidentFormById(formId, body).then(() => {
                formSubmittedHandler();
            }).catch(console.error);
        }
    }

    const loadData = async (data: any) => {

        if (data) {
            setFormId(data.Id);
            setFormStatus(data.Status);
            setFormStage(data.Stage);

            setSmComment(data.SMComment);
            if (data.SMDate) {
                setSmDate(new Date(data.SMDate));
            }

            setSdComment(data.SDComment)
            if (data.SDDate) {
                setSdDate(new Date(data.SDDate));
            }

            setSptComment(data.SPTComment)
            if (data.SPTDate) {
                setSptDate(new Date(data.SPTDate));
            }

            setServiceUnit(data.ServiceUnit);

            setAccidentTime(new Date(data.AccidentTime));

            if (data.Author) {
                setReporter([{ secondaryText: data.Author.EMail, id: data.Author.Id }]);
            }

            if (data.Created) {
                setReportDate(new Date(data.Created));
            }

            if (data.Investigator) {
                setInvestigator([{ secondaryText: data.Investigator.EMail, id: data.Investigator.Id }]);
            }

            if (data.SPT) {
                setSPhysicalTherapyEmail(data.SPT.EMail)
                // setSptDate(new Date(data.SPTDate));
            }

            if (data.SM) {
                setSMEmail(data.SM.EMail);
                // setServiceManagerEmail(data.SM.EMail);
                //    setSmDate(new Date(data.SMDate));
            }

            if (data.SD) {
                setSDEmail(data.SD.EMail);
                // setServiceDirectorEmail(data.SD.EMail);
                //setSdDate(new Date(data.SDDate));
            }

            if (data.Attachments) {
                // getServiceUserAccidentAllAttachmentById(data.Id).then((value) => {
                //     console.log(value)
                // }).catch(console.error);
            }

            setFamilyContactDate(new Date(data.FamilyContactDate));
            setPoliceDatetime(new Date(data.PoliceDatetime));
            setForm({
                accidentDetail: data.AccidentDetail,
                accidentLocation: data.AccidentLocation,
                cctvRecord: data.CctvRecord,
                envAcousticStimulation: data.EnvAcousticStimulation,
                envCollidedByOthers: data.EnvCollidedByOthers,
                envHurtByOthers: data.EnvHurtByOthers,
                envImproperEquip: data.EnvImproperEquip,
                envInsufficientLight: data.EnvInsufficientLight,
                envNotEnoughSpace: data.EnvNotEnoughSpace,
                envObstacleItems: data.EnvObstacleItems,
                envOther: data.EnvOther,
                envOtherDescription: data.EnvOtherDescription,
                envSlipperyGround: data.EnvSlipperyGround,
                envUnevenGround: data.EnvUnevenGround,
                familyContact: data.FamilyContact,
                familyRelationship: data.FamilyRelationship,
                insuranceCaseNo: data.InsuranceCaseNo || "",
                medicalArrangement: data.MedicalArrangement,
                medicalArrangementHospital: data.MedicalArrangementHospital,
                otherFactor: data.OtherFactor,
                photoRecord: data.PhotoRecord,
                police: data.Police,
                policeStation: data.PoliceStation,
                serviceUnit: data.ServiceUnit,
                serviceUserAge: data.ServiceUserAge,
                serviceUserGender: data.ServiceUserGender,
                serviceUserIdentity: data.ServiceUserIdentity,
                serviceUserIdentityOther: data.ServiceUserIdentityOther,
                serviceUserNameEN: data.ServiceUserNameEN,
                serviceUserNameTC: data.ServiceUserNameTC,
                witness: data.Witness,
                witnessName: data.WitnessName,
                witnessPhone: data.WitnessPhone
            })
        }

        if (data.Attachments) {
            getOutsidersAccidentAllAttachmentById(data.Id).then((attchementsRes) => {
                let cctvAttachment = [];
                attchementsRes.forEach((att) => {
                    const splitPosition = att.FileName.indexOf("-");
                    const attachmentType = att.FileName.substr(0, splitPosition)
                    if (attachmentType === "CCTV") {
                        cctvAttachment.push(att);
                    }
                });
                setUploadedPhotoRecordFiles(cctvAttachment);
            }).catch(console.error)
        }
    }

    useEffect(() => {
        if (formData) {
            loadData(formData);
        } else {
            setReporter([{ secondaryText: CURRENT_USER.email, id: CURRENT_USER.id }]);
        }
    }, [formData]);

    // Get current User info in ad
    useEffect(() => {
        setCurrentUserEmail(CURRENT_USER.email);
    }, []);

    // Find SD && SM
    useEffect(() => {
        // Testing data;
        if (CURRENT_USER.email === "FHS.portal.dev@fuhong.hk") {
            setHrDepartment("CHH");
            setServiceUnit("CHH");
            return;
        }

        if (userInfo && userInfo.hr_deptid) {
            setHrDepartment(userInfo.hr_deptid);
            setServiceUnit(userInfo.hr_deptid);
        }
    }, [userInfo]);

    // Get SD & SM
    useEffect(() => {
        if (Array.isArray(departments) && departments.length) {
            const dept = departments[0];
            if (dept && dept.hr_deptmgr && dept.hr_deptmgr !== "[empty]") {
                setSMEmail(dept.hr_deptmgr);
            }

            if (dept && dept.hr_sd && dept.hr_sd !== "[empty]") {
                setSDEmail(dept.hr_sd);
            }
        }
    }, [departments]);

    useEffect(() => {
        if (Array.isArray(sptList) && sptList.length > 0) {
            setSPhysicalTherapyEmail(sptList[0].mail);
        }
    }, [sptList]);

    return (
        <>
            <div>
                <Header displayName="外界人士意外填報表(一)" />
            </div>
            <div className="container-fluid px-4 pt-3">
                <section className="mb-5">
                    {/* <div className="row">
                        <div className="col-12 font-weight-bold">
                            <h5>檔案編號</h5>
                        </div>
                    </div> */}
                    <div className="form-row mb-2">
                        {/* 服務單位 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>服務單位</label>
                        <div className="col-12 col-md-4">
                            {/* <select className="form-control" value={serviceUnit} onChange={(event) => setServiceUnit(event.target.value)}>
                                <option>請選擇服務單位</option>
                                {serviceUnitList.map((unit) => {
                                    return <option value={unit.ShortForm}>{`${unit.ShortForm} - ${unit.Title}`}</option>
                                })}
                            </select> */}
                            <input type="text" className="form-control" value={serviceUnit || ""} disabled />
                        </div>
                        {/* 保險公司備案編號 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>保險公司備案編號</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" name="insuranceCaseNo" value={form.insuranceCaseNo} onChange={inputFieldHandler} disabled={currentUserRole !== Role.ADMIN} />
                        </div>
                    </div>
                </section>

                <section className="mb-5">
                    <div className="form-row mb-3">
                        <div className="col-12 font-weight-bold">
                            <h5>基本資料</h5>
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/* 服務使用者姓名 (中文)*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>姓名 (中文)</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" name="serviceUserNameTC" value={form.serviceUserNameTC} onChange={inputFieldHandler} disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)} />
                        </div>
                        {/* 服務使用者姓名 (英文)*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>姓名 (英文)</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" name="serviceUserNameEN" value={form.serviceUserNameEN} onChange={inputFieldHandler} disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)} />
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        {/* 年齡*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>年齡</label>
                        <div className="col-12 col-md-4">
                            <input type="number" className="form-control" name="ServiceUserAge" value={form.serviceUserAge} onChange={(evnet) => setForm({ ...form, serviceUserAge: +evnet.target.value })} disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)} />
                        </div>
                        {/* 性別*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>性別</label>
                        <div className="col-12 col-md-4 d-flex align-items-center">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" id="gender-male" onClick={() => setForm({ ...form, serviceUserGender: "male" })} checked={form.serviceUserGender === "male"} disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="gender-male">男</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" id="gender-female" onClick={() => setForm({ ...form, serviceUserGender: "female" })} checked={form.serviceUserGender === "female"} disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="gender-female">女</label>
                            </div>
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        {/* 身份*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>身份</label>
                        <div className="col-12 col-md-4">
                            <select className="form-control" name="serviceUserIdentity" value={form.serviceUserIdentity} onChange={selectionHandler} disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)}>
                                <option value="">請選擇</option>
                                <option value="visitor">訪客</option>
                                <option value="family">家屬</option>
                                <option value="volunter">義工</option>
                                <option value="intern">實習學生</option>
                                <option value="others">其他</option>
                            </select>
                            {
                                form.serviceUserIdentity === "others" &&
                                <div className="mt-2">
                                    <input type="text" className="form-control" placeholder="請註明" name="serviceUserIdentityOther" value={form.serviceUserIdentityOther} onChange={inputFieldHandler} disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)} />
                                </div>
                            }
                        </div>
                        {/* 意外發生日期*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>意外發生日期和時間</label>
                        <div className="col-12 col-md-4">
                            <DatePicker
                                className="form-control"
                                selected={accidentTime}
                                onChange={(date) => setAccidentTime(date)}
                                showTimeSelect
                                timeFormat="p"
                                timeIntervals={15}
                                dateFormat="yyyy/MM/dd h:mm aa"
                                readOnly={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)}
                            />
                        </div>
                    </div>


                    <div className="form-row mb-2">
                        {/* 地點 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>地點</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" name="accidentLocation" value={form.accidentLocation} onChange={inputFieldHandler} disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)} />
                        </div>
                    </div>
                </section>

                <section className="mb-5">
                    <div className="form-row mb-3">
                        <div className="col-12 font-weight-bold">
                            <h5>意外事件紀錄</h5>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 font-weight-bold">
                            <h6>初步觀察的意外成因</h6>
                        </div>
                    </div>
                    <div className="pl-3">
                        <div className="form-row mb-4">
                            {/* (2.1.1) 環境因素 */}
                            <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>環境因素</label>
                            <div className="col">
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="checkbox" name="envSlipperyGround" id="ENV-SLIPPERY-GROUND" checked={form.envSlipperyGround === true} onClick={checkboxBoolHandler} disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)} />
                                    <label className={`form-check-label ${styles.labelColor}`} htmlFor="ENV-SLIPPERY-GROUND">地面濕滑</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="checkbox" name="envUnevenGround" id="ENV-UNEVEN-GROUND" value="ENV_UNEVEN_GROUND" checked={form.envUnevenGround === true} onClick={checkboxBoolHandler} disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)} />
                                    <label className={`form-check-label ${styles.labelColor}`} htmlFor="ENV-UNEVEN-GROUND">地面不平</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="checkbox" name="envObstacleItems" id="ENV-OBSTACLE-ITEMS" value="ENV_OBSTACLE_ITEMS" checked={form.envObstacleItems === true} onClick={checkboxBoolHandler} disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)} />
                                    <label className={`form-check-label ${styles.labelColor}`} htmlFor="ENV-OBSTACLE-ITEMS">障礙物品</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="checkbox" name="envInsufficientLight" id="ENV-INSUFFICIENT-LIGHT" value="ENV_INSUFFICIENT_LIGHT" checked={form.envInsufficientLight === true} onClick={checkboxBoolHandler} disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)} />
                                    <label className={`form-check-label ${styles.labelColor}`} htmlFor="ENV-INSUFFICIENT-LIGHT">光線不足</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="checkbox" name="envNotEnoughSpace" id="ENV-NOT-ENOUGH-SPACE" value="ENV_NOT_ENOUGH_SPACE" checked={form.envNotEnoughSpace === true} onClick={checkboxBoolHandler} disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)} />
                                    <label className={`form-check-label ${styles.labelColor}`} htmlFor="ENV-NOT-ENOUGH-SPACE">空間不足</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="checkbox" name="envAcousticStimulation" id="ENV-ACOUSTIC-STIMULATION" value="ENV_ACOUSTIC_STIMULATION" checked={form.envAcousticStimulation === true} onClick={checkboxBoolHandler} disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)} />
                                    <label className={`form-check-label ${styles.labelColor}`} htmlFor="ENV-ACOUSTIC-STIMULATION">聲響刺激</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="checkbox" name="envCollidedByOthers" id="ENV-COLLIDED-BY-OTHERS" value="ENV_COLLIDED_BY_OTHERS" checked={form.envCollidedByOthers === true} onClick={checkboxBoolHandler} disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)} />
                                    <label className={`form-check-label ${styles.labelColor}`} htmlFor="ENV-COLLIDED-BY-OTHERS">被別人碰撞</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="checkbox" name="envHurtByOthers" id="ENV-HURT-BY-OTHERS" value="ENV_HURT_BY_OTHERS" checked={form.envHurtByOthers === true} onClick={checkboxBoolHandler} disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)} />
                                    <label className={`form-check-label ${styles.labelColor}`} htmlFor="ENV-HURT-BY-OTHERS">被別人傷害</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="checkbox" name="envImproperEquip" id="ENV-IMPROPER-USE-OF-ASSISTIVE-EQUIPMENT" checked={form.envImproperEquip === true} value="ENV_IMPROPER_USE_OF_ASSISTIVE_EQUIPMENT" onClick={checkboxBoolHandler} disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)} />
                                    <label className={`form-check-label ${styles.labelColor}`} htmlFor="ENV-IMPROPER-USE-OF-ASSISTIVE-EQUIPMENT">輔助器材使用不當 (如輪椅／便椅未上鎖)</label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" name="envOther" id="ENV-OTHER" value="ENV_OTHER" checked={form.envOther === true} onClick={checkboxBoolHandler} disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)} />
                                    <label className={`form-check-label ${styles.labelColor}`} htmlFor="ENV-OTHER">其他</label>
                                </div>
                                {
                                    form.envOther &&
                                    <div className="">
                                        <AutosizeTextarea className="form-control" placeholder="請註明" name={"envOtherDescription"} value={form.envOtherDescription} onChange={inputFieldHandler} disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)} />
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="form-row mb-4">
                            {/* (2.1.2) 其他因素 */}
                            <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>其他因素</label>
                            <div className="col">
                                <AutosizeTextarea className="form-control" name="otherFactor" value={form.otherFactor} onChange={inputFieldHandler} disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)} />
                            </div>
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/*(2.2)  事發過程 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>事發過程</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" name="accidentDetail" value={form.accidentDetail} onChange={inputFieldHandler} disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)} />
                        </div>
                    </div>

                    <div className="form-row mb-4">
                        {/*(2.3)  意外事件有否證人證人目擊事故發生經過? */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>意外事件有否證人目擊事故發生經過?</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="witness" id="witness-true" value="witness-true" onClick={() => setForm({ ...form, witness: true })} checked={form.witness === true} disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="witness-true">有</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="witness" id="witness-false" value="witness-false" onClick={() => setForm({ ...form, witness: false })} checked={form.witness === false} disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="witness-false">沒有</label>
                            </div>
                            {
                                form.witness === true &&
                                <>
                                    <div>
                                        <label className="form-label">證人姓名</label>
                                        <input type="text" className="form-control" name="witnessName" value={form.witnessName} onChange={inputFieldHandler} disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)} />
                                    </div>
                                    <div>
                                        <label className="form-label">聯絡電話</label>
                                        <input type="text" className="form-control" name="witnessPhone" value={form.witnessPhone} onChange={inputFieldHandler} disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)} />
                                    </div>
                                </>
                            }
                        </div>
                    </div>

                    <div className="form-row mb-4">
                        {/*(2.4)  相片及CCTV紀錄*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>相片及CCTV紀錄</label>
                        <div className="col">
                            <div className={styles.buttonLabel}>相片</div>
                            <div className="pl-2">
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="photoRecord" id="photo-true" value="PHOTO_TRUE" onClick={() => setForm({ ...form, photoRecord: true })} checked={form.photoRecord === true} disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)} />
                                    <label className={`form-check-label ${styles.labelColor}`} htmlFor="photo-true">有 (上載照片)</label>
                                </div>
                                {
                                    form.photoRecord &&
                                    <>
                                        <StyledDropzone selectedFiles={setSelectedPhotoRecordFiles} />
                                        {
                                            uploadedPhotoRecordFiles.length > 0 &&
                                            <aside>
                                                <h6>已上存檔案</h6>
                                                <ul>
                                                    {UploadedFilesComponent(uploadedPhotoRecordFiles)}
                                                </ul>
                                            </aside>
                                        }
                                    </>
                                }
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="photoRecord" id="photo-false" value="PHOTO_FALSE" onClick={() => setForm({ ...form, photoRecord: false })} checked={form.photoRecord === false} disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)} />
                                    <label className={`form-check-label ${styles.labelColor}`} htmlFor="photo-false">未能提供</label>
                                </div>
                            </div>
                            <div className={`${styles.buttonLabel} mt-3`}>CCTV紀錄</div>
                            <div className="pl-2">
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="cctv" id="cctv-true" value="CCTV_TRUE" onClick={() => setForm({ ...form, cctvRecord: true })} checked={form.cctvRecord === true} disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)} />
                                    <label className={`form-check-label ${styles.labelColor}`} htmlFor="cctv-true">有 (註: 三個工作天內交總辦事處)</label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="cctv" id="cctv-false" value="CCTV_FALSE" onClick={() => setForm({ ...form, cctvRecord: false })} checked={form.cctvRecord === false} disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)} />
                                    <label className={`form-check-label ${styles.labelColor}`} htmlFor="cctv-false">未能提供</label>
                                </div>
                                {
                                    form.cctvRecord &&
                                    <div className="row no-gutters">
                                        <label className={`col-form-label ${styles.fieldTitle} mr-0 mr-md-2`}>收到日期</label>
                                        <div className="col">
                                            <DatePicker className="form-control" dateFormat="yyyy/MM/dd" selected={cctvRecordReceiveDate} onChange={(date) => setCctvRecordReceiveDate(date)} readOnly={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)} />
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mb-5">
                    <div className="form-row mb-2">
                        <div className="col-12 font-weight-bold mb-2">
                            <h5>意外事件後之處理</h5>
                        </div>
                    </div>
                    <div className="form-row mb-4">
                        {/*(3.1)  就診安排*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>就診安排</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="medicalArrangement" id="ARRANGEMENT_DOCTOR_VISIT" value="ARRANGEMENT_DOCTOR_VISIT" onClick={radioButtonHandler} checked={form.medicalArrangement === "ARRANGEMENT_DOCTOR_VISIT"} disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="ARRANGEMENT_DOCTOR_VISIT">醫生到診</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="medicalArrangement" id="ARRANGEMENT_OUTPATIENT" value="ARRANGEMENT_OUTPATIENT" onClick={radioButtonHandler} checked={form.medicalArrangement === "ARRANGEMENT_OUTPATIENT"} disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="ARRANGEMENT_OUTPATIENT">門診</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="medicalArrangement" id="ARRANGEMENT_EMERGENCY_DEPARTMENT" value="ARRANGEMENT_EMERGENCY_DEPARTMENT" onClick={radioButtonHandler} checked={form.medicalArrangement === "ARRANGEMENT_EMERGENCY_DEPARTMENT"} disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="ARRANGEMENT_EMERGENCY_DEPARTMENT">急症室</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="medicalArrangement" id="ARRANGEMENT_EMERGENCY_REJECT" value="ARRANGEMENT_EMERGENCY_REJECT" onClick={radioButtonHandler} checked={form.medicalArrangement === "ARRANGEMENT_EMERGENCY_REJECT"} disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="ARRANGEMENT_EMERGENCY_REJECT">拒絕就診</label>
                            </div>
                            {
                                form.medicalArrangement === "ARRANGEMENT_EMERGENCY_DEPARTMENT" &&
                                <>
                                    <div className="">
                                        <label className="form-label">醫院名稱</label>
                                        <input type="text" className="form-control" value={form.medicalArrangementHospital} name="medicalArrangementHospital" onChange={inputFieldHandler} disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)} />
                                    </div>
                                    <div className="">
                                        <label className="form-label">到達時間</label>
                                        <DatePicker
                                            className="form-control"
                                            selected={hospitalArriveTime}
                                            onChange={(date) => setHospitalArriveTime(date)}
                                            showTimeSelect
                                            timeFormat="p"
                                            timeIntervals={15}
                                            dateFormat="yyyy/MM/dd h:mm aa"
                                            readOnly={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)}
                                        />
                                    </div>
                                    <div className="">
                                        <label className="form-label">離開時間</label>
                                        <DatePicker
                                            className="form-control"
                                            selected={hospitalLeaveTime}
                                            onChange={(date) => setHospitalLeaveTime(date)}
                                            showTimeSelect
                                            timeFormat="p"
                                            timeIntervals={15}
                                            dateFormat="yyyy/MM/dd h:mm aa"
                                            readOnly={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)}
                                        />
                                    </div>
                                </>
                            }

                        </div>
                    </div>

                    <div className="form-row mb-4">
                        {/* (3.2) 報警處理 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>報警處理</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="police" id="police-true" value="police-true" onClick={() => setForm({ ...form, police: true })} checked={form.police === true} disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="police-true">有</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="police" id="police-false" value="police-false" onClick={() => setForm({ ...form, police: false })} checked={form.police === false} disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="police-false">沒有</label>
                            </div>
                            {
                                form.police === true &&
                                <>
                                    <div>
                                        <label className="form-label">日期和時間</label>
                                        <DatePicker
                                            className="form-control"
                                            selected={policeDatetime}
                                            onChange={(date) => setPoliceDatetime(date)}
                                            showTimeSelect
                                            timeFormat="p"
                                            timeIntervals={15}
                                            dateFormat="yyyy/MM/dd h:mm aa"
                                            readOnly={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)}
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">警署名稱</label>
                                        <input type="text" className="form-control" name="policeStation" value={form.policeStation} onChange={inputFieldHandler} disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)} />
                                    </div>
                                </>
                            }
                        </div>
                    </div>

                    <div className="form-row mb-4">
                        {/* (3.3) 家屬聯絡 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>家屬聯絡</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="familyContact" id="family-true" value="family-true" onClick={() => setForm({ ...form, familyContact: true })} checked={form.familyContact === true} disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="family-true">有</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="familyContact" id="family-false" value="family-false" onClick={() => setForm({ ...form, familyContact: false })} checked={form.familyContact === false} disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="family-false">沒有</label>
                            </div>
                            {
                                form.familyContact === true &&
                                <>
                                    <div>
                                        <label className="form-label">通知家屬日期及時間</label>
                                        <DatePicker
                                            className="form-control"
                                            selected={familyContactDate}
                                            onChange={(date) => setFamilyContactDate(date)}
                                            showTimeSelect
                                            timeFormat="p"
                                            timeIntervals={15}
                                            dateFormat="yyyy/MM/dd h:mm aa"
                                            readOnly={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)}
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">與傷者關係</label>
                                        <input type="text" className="form-control" name="familyRelationship" value={form.familyRelationship} onChange={inputFieldHandler} disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)} />
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                </section>

                <hr className="my-3" />

                <section className="mb-5">
                    <div className="form-row mb-2">
                        {/* 填報人姓名 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>填報人姓名</label>
                        <div className="col-12 col-md-4">
                            {/* <PeoplePicker
                                context={context}
                                titleText=""
                                showtooltip={false}
                                personSelectionLimit={1}
                                ensureUser={true}
                                isRequired={false}
                                selectedItems={setReporter}
                                showHiddenInUI={false}
                                defaultSelectedUsers={
                                    reporter && [reporter.mail]
                                } /> */}
                            <input className="form-control" value={reporter && reporter.displayName || ""} disabled />
                        </div>
                        <label className={`col-12 col-md-1 col-form-label ${styles.fieldTitle} pt-xl-0`}>日期</label>
                        <div className="col-12 col-md-5">
                            <DatePicker className="form-control" dateFormat="yyyy/MM/dd" selected={reportDate} onChange={(date) => setReportDate(date)} readOnly />
                        </div>
                    </div>
                    {/* 職級 */}
                    <div className="form-row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>職級</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" value={reporter && (reporter.jobTitle || "")} disabled={true} />
                        </div>
                    </div>
                </section>

                <hr className="my-3" />

                <section className="mb-5">
                    <div className="form-row mb-2">
                        <div className="col-12 font-weight-bold mb-2">
                            <span className={styles.fieldTitle}>[此欄由高級服務經理/服務經理填寫]</span>
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        {/* 服務經理姓名 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>高級服務經理/<span className="d-sm-inline d-md-block">服務經理姓名</span></label>
                        <div className="col-12 col-md-4">
                            {/* <PeoplePicker
                                context={context}
                                titleText=""
                                showtooltip={false}
                                personSelectionLimit={1}
                                ensureUser={true}
                                isRequired={false}
                                selectedItems={(e) => { console }}
                                showHiddenInUI={false} /> */}
                            {
                                Array.isArray(departments) && departments.length > 0 && departments[0].override === true ?
                                    <select className={`custom-select`} value={smInfo && smInfo.Email} onChange={(event => setSMEmail(event.target.value))}
                                        disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)}>
                                        <option value={departments[0].hr_deptmgr}>{departments[0].hr_deptmgr}</option>
                                        <option value={departments[0].new_deptmgr}>{departments[0].new_deptmgr}</option>
                                    </select>
                                    :
                                    <input type="text" className="form-control" value={`${smInfo && smInfo.Lastname || ""} ${smInfo && smInfo.Firstname || ""}`.trim() || `${smInfo && smInfo.Name || ""}`} disabled={true} />
                            }
                        </div>
                        <label className={`col-12 col-md-1 col-form-label ${styles.fieldTitle} pt-xl-0`}>日期</label>
                        <div className="col-12 col-md-5">
                            <DatePicker className="form-control" selected={smDate} onChange={(date) => setSmDate(date)} dateFormat="yyyy/MM/dd" readOnly />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>高級服務經理/<span className="d-sm-inline d-md-block">服務經理評語</span></label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" value={smComment} onChange={(event) => setSmComment(event.target.value)}
                                disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitBySm(CURRENT_USER.email, spSmInfo ? spSmInfo.Email : "", formStatus)} />
                        </div>
                    </div>
                    {
                        pendingSmApprove(currentUserRole, formStatus, formStage) &&
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

                <hr className="my-3" />

                <section className="mb-4">
                    <div className="form-row mb-2">
                        <div className="col-12 font-weight-bold mb-2">
                            <span className={styles.fieldTitle}>[此欄由服務總監填寫]</span>
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/* SD */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>服務總監姓名</label>
                        <div className="col-12 col-md-4">
                            {/* <PeoplePicker
                                context={context}
                                titleText=""
                                showtooltip={false}
                                personSelectionLimit={1}
                                ensureUser={true}
                                isRequired={false}
                                selectedItems={(e) => { console }}
                                showHiddenInUI={false} /> */}
                            {
                                Array.isArray(departments) && departments.length > 0 && departments[0].override === true ?
                                    <select className={`custom-select`} value={sdInfo && sdInfo.Email} onChange={(event => setSDEmail(event.target.value))}
                                        disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)}
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
                            <AutosizeTextarea className="form-control" value={sdComment} onChange={(event) => setSdComment(event.target.value)} disabled={!pendingSptApproveForSD(currentUserRole, formStatus, formStage)} />
                        </div>
                    </div>
                    {/* <div className="form-row row mb-2">
                        <div className="col-12">
                            <button className="btn btn-primary">儲存評語</button>
                        </div>
                    </div> */}
                </section>

                <hr className="my-3" />

                <section className="mb-4">
                    <div className="form-row mb-2">
                        <div className="col-12 font-weight-bold mb-2">
                            <span className={styles.fieldTitle}>[此欄由高級物理治療師填寫]</span>
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        {/* 高級物理治療師姓名 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>高級物理治療師姓名</label>
                        <div className="col-12 col-md-4">
                            <select className={`custom-select  `} value={sPhysicalTherapyEmail} onChange={(event) => setSPhysicalTherapyEmail(event.target.value)}
                                disabled={!pendingSmApprove(currentUserRole, formStatus, formStage) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(currentUserRole, formStatus, formStage)}>
                                {
                                    sptList.map((spt) => {
                                        return <option value={spt.mail}>{spt.displayName}</option>
                                    })
                                }
                            </select>
                        </div>
                        {/* 日期 */}
                        <label className={`col-12 col-md-1 col-form-label ${styles.fieldTitle} pt-xl-0`}>日期</label>
                        <div className="col-12 col-md-5">
                            <DatePicker className="form-control" dateFormat="yyyy/MM/dd" selected={sptDate} onChange={(date) => setSptDate(date)} readOnly />
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        {/* 評語 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>高級物理治療師評語</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" value={sptComment} onChange={(event) => setSptComment(event.target.value)} disabled={!pendingSptApproveForSPT(currentUserRole, formStatus, formStage)} />
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        {/* 「意外報告 (二)」交由 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pl-0 pt-xl-0 `}>｢意外報告 (二)｣交由</label>
                        <div className="col-12 col-md-4">
                            {
                                !pendingSptApproveForSPT(currentUserRole, formStatus, formStage) ?
                                    <input type="text" className="form-control" value={(investigator && investigator.displayName) || ""} disabled />
                                    :
                                    <PeoplePicker
                                        context={context}
                                        titleText=""
                                        showtooltip={false}
                                        personSelectionLimit={1}
                                        ensureUser={true}
                                        isRequired={false}
                                        selectedItems={setInvestigator}
                                        showHiddenInUI={false}
                                        defaultSelectedUsers={investigator && [investigator.mail]}
                                        disabled={!pendingSptApproveForSPT(currentUserRole, formStatus, formStage)}
                                    />
                            }
                        </div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} px-0`}>填寫</label>
                    </div>
                    {
                        pendingSptApproveForSPT(currentUserRole, formStatus, formStage) &&
                        <div className="form-row mb-2">
                            <div className="col-12">
                                <div className="d-flex justify-content-center">
                                    <button className="btn btn-warning mr-3" onClick={sptApproveHandler}>批准</button>
                                    <button className="btn btn-danger mr-3" onClick={sptRejectHandler}>拒絕</button>
                                </div>
                            </div>
                        </div>
                    }

                </section>

                <hr className="my-4" />


                <section className="py-3">
                    <div className="d-flex justify-content-center" style={{ gap: 10 }}>
                        {
                            (
                                formInitial(currentUserRole, formStatus) ||
                                pendingSptApproveForSD(currentUserRole, formStatus, formStage) ||
                                currentUserRole === Role.ADMIN)
                            &&
                            <button className="btn btn-warning" onClick={submitHandler}>提交</button>
                        }
                        {
                            formInitial(currentUserRole, formStatus) &&
                            <button className="btn btn-success" onClick={draftHandler}>草稿</button>
                        }
                        <button className="btn btn-secondary" onClick={() => cancelHandler()}>取消</button>
                    </div>
                </section>

            </div>
        </>
    )
}
