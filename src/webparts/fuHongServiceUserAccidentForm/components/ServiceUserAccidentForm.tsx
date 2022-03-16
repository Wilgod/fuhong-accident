import * as React from 'react'
import { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Header from "../../../components/Header/Header";
import styles from "./FuHongServiceUserAccidentForm.module.scss";
import "./custom.css";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import * as moment from 'moment';
import AutosizeTextarea from "../../../components/AutosizeTextarea/AutosizeTextarea";
import StyledDropzone from "../../../components/Dropzone/Dropzone";
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { FormFlow, getServiceUnits, getServiceUserAccident, getServiceUserAccidentById } from '../../../api/FetchFuHongList';
import { createAccidentReportForm, createServiceUserAccident, getServiceUserAccidentAllAttachmentById, updateServiceUserAccidentAttachmentById, updateServiceUserAccidentById } from '../../../api/PostFuHongList';
import { caseNumberFactory } from '../../../utils/CaseNumberParser';
import { IServiceUserAccidentFormStates, IErrorFields, IServiceUserAccidentFormProps } from './IFuHOngServiceUserAccidentForm';
import { IUser } from '../../../interface/IUser';
import { addBusinessDays, addDays, addMonths, dateFieldRawHandler } from '../../../utils/DateUtils';
import useUserInfoAD from '../../../hooks/useUserInfoAD';
import { getSeniorPhysiotherapistByGraph, getServiceDirectorsByGraph, getServiceManagersByGraph, getUserInfoByEmail,getDepartmentBySuEngNameDisplay } from '../../../api/FetchUser';
import { Role } from '../../../utils/RoleParser';
import { getServiceUserList } from '../../../api/FetchServiceUser';
import useServiceUser from '../../../hooks/useServiceUser';
import { intellectualDisabilityParser } from '../../../utils/IntellectualDisabilityParser';
import { getQueryParameterNumber } from '../../../utils/UrlQueryHelper';
import useServiceUnit from '../../../hooks/useServiceUnits';
import useSPT from '../../../hooks/useSPT';
import useSharePointGroup from '../../../hooks/useSharePointGroup';
import { attachmentsFilesFormatParser } from '../../../utils/FilesParser';
import { formInitial, pendingSmApprove, pendingSptApproveForSPT, pendingSptApproveForSD, formInitBySm } from '../permissionConfig';
import useUserInfo from '../../../hooks/useUserInfo';
import useDepartmentMangers from '../../../hooks/useDepartmentManagers';
import { ContactFolder } from '@pnp/graph/contacts';
import useServiceUnit2 from '../../../hooks/useServiceUser2';
import { notifyServiceUserAccident, notifyServiceUserAccidentSMSDComment, notifyServiceUserAccidentReject } from '../../../api/Notification';
import { ILog, postLog } from '../../../api/LogHelper';

if (document.getElementById('workbenchPageContent') != null) {
    document.getElementById('workbenchPageContent').style.maxWidth = '1920px';
}

if (document.querySelector('.CanvasZone') != null) {
    (document.querySelector('.CanvasZone') as HTMLElement).style.maxWidth = '1920px';
}

export default function ServiceUserAccidentForm({ context, currentUserRole, formData, formSubmittedHandler, isPrintMode, siteCollectionUrl, permissionList, serviceUserAccidentWorkflow }: IServiceUserAccidentFormProps) {
    const [formStatus, setFormStatus] = useState("");
    const [formStage, setFormStage] = useState("");
    const [formId, setFormId] = useState(null);
    const [accidentTime, setAccidentTime] = useState(null); // AccidentTime
    const [cctvRecordReceiveDate, setCctvRecordReceiveDate] = useState(null); // CCTV record receive date
    const [medicalArrangementDate, setMedicalArrangementDate] = useState(null);
    const [policeDate, setPoliceDate] = useState(null);
    const [contactFamilyDate, setContactFamilyDate] = useState(null);
    const [contactStaff, setContactStaff, contactStaffPickerInfo] = useUserInfoAD();//負責通知家屬的職員姓名
    const [reporter, setReporter, reporterPickerInfo] = useUserInfoAD(); // 填報人姓名
    // const [serviceManager, setServiceManagerEmail, serviceManagerEmail] = useSharePointGroup(); //[此欄由高級服務經理/服務經理填寫]
    // const [serviceDirector, setServiceDirectorEmail, serviceDirectorEmail] = useSharePointGroup(); // [此欄由服務總監填寫]
    const [sPhysicalTherapy, setSPhysicalTherapyEmail, sPhysicalTherapyEmail] = useSharePointGroup(); // [此欄由高級物理治療師填寫]
    const [investigator, setInvestigator, investigatorPickerInfo] = useUserInfoAD(); // [調查]
    const [serviceUserList, serviceUser, serviceUserRecordId, setServiceUserRecordId] = useServiceUser();

    const [serviceUserUnitList, patientServiceUnit, setPatientServiceUnit] = useServiceUnit2(siteCollectionUrl);
    const [serviceUnit, setServiceUnit] = useState("");
    const [serviceLocation, setServiceLocation] = useState("");
    const [sptList] = useSPT(siteCollectionUrl);
    const [insuranceNumber, setInsuranceNumber] = useState("");
    const [injuryFiles, setInjuryFiles] = useState([]);
    const [uploadedInjuryFiles, setUploadedInjuryFiles] = useState([]);
    const [selectedCctvPhoto, setSelectedCctvPhoto] = useState([]);
    const [uploadedCctvPhoto, setUploadedCctvPhoto] = useState([]);
    const [userInfo, setCurrentUserEmail, spUserInfo] = useUserInfo(siteCollectionUrl);
    const [sdInfo, setSDEmail, spSdInfo] = useUserInfo(siteCollectionUrl);
    const [smInfo, setSMEmail, spSmInfo] = useUserInfo(siteCollectionUrl);
    const { departments, setHrDepartment } = useDepartmentMangers(siteCollectionUrl);


    const [serviceUserNameEN, setServiceUserNameEN] = useState("");
    const [serviceUserNameCN, setServiceUserNameCN] = useState("");
    const [serviceUserAge, setServiceUserAge] = useState(0);
    const [serviceUserGender, setServiceUserGender] = useState("");
    const [serviceUserId, setServiceUserId] = useState("");
    const [serviceCategory, setServiceCategory] = useState("");
    const [wheelchair, setWheelchair] = useState<boolean>(undefined);
    const [asd, setAsd] = useState<boolean>(undefined);
    const [intelligence, setIntelligence] = useState("");

    const [form, setForm] = useState<IServiceUserAccidentFormStates>({
        patientAcciedntScenario: "",
        injuredArea: [],
        uncomfortable: [],
        behaviorSwitch: "",
        behavior: [],
        envFactor: [],
        personalFactor: [],
        arrangement: "",
        isStayInHospital: "",
        police: "",
        contingencyMeasure: "",
        cctv: "",
        photo: "",
        serviceUserUncomfort: "",
        accidentLocation: "",
        personalFactorOtherRemark: "",
        enviromentalFactorOtherRemark: "",
        accidentDetail: "",
        treatmentAfterAccident: "",
        medicalArrangementHospital: "",
        medicalArrangementTreatment: "",
        stayInHospitalName: "",
        policeReportNumber: "",
        policeStation: "",
        contingencyMeasureRemark: "",
        contactFamilyRelationship: "",
        contactFamilyName: "",
        afterTreatmentDescription: "",
        scenarioOutsideActivityRemark: "",
        scenarioOtherRemark: "",
        injuredAreaOther: "",
        uncomfortableDescription: "",
        uncomfortableOtherRemark: "",
        behaviorOtherRemark: "",
    });
    const [sdComment, setSdComment] = useState("");
    const [sdDate, setSdDate] = useState(null);
    const [sptComment, setSptComment] = useState("");
    const [sptDate, setSptDate] = useState(null);
    const [smComment, setSmComment] = useState("");
    const [smDate, setSmDate] = useState(null);
    const [reportedDate, setReportedDate] = useState(null);
    const [error, setError] = useState<IErrorFields>({});

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

    const textHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        if (name) {
            setForm({ ...form, [name]: value });
        }
    }

    const radioButtonHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setForm({ ...form, [name]: value });
    }

    const checkboxHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        const arr = form[name];
        if (Array.isArray(arr)) {
            if (arr.indexOf(value) > -1) {
                const result = arr.filter((item) => item !== value);
                setForm({ ...form, [name]: result });
            } else {
                setForm({ ...form, [name]: [...arr, value] });
            }
        }
    }
    //request body parser and validation
    const dataFactory = (status: string) => {
        const body = {};
        const error = {};

        // Service User info
        body["ServiceUserNameEN"] = serviceUserNameEN;
        body["ServiceUserNameCN"] = serviceUserNameCN;
        body["ServiceUserAge"] = serviceUserAge;
        body["ServiceUserGender"] = serviceUserGender;
        body["ServiceUserId"] = serviceUserId;
        body["ServiceCategory"] = serviceCategory;
        body["Wheelchair"] = wheelchair;
        body["ASD"] = asd;
        body["Intelligence"] = intelligence;

        if (serviceUserRecordId !== null && isNaN(serviceUserRecordId) === false) {
            body["ServiceUser"] = serviceUserRecordId;
        } else {
            error["ServiceUser"] = true;
        }
        //填寫人服務單位
        body["ServiceUnit"] = serviceUnit;

        if (patientServiceUnit) {
            body["ServiceUserUnit"] = patientServiceUnit
        } else {
            error["ServiceUserUnit"] = true;
        }
        

        //意外發生日期和時間
        if (accidentTime) {
            body["AccidentTime"] = accidentTime.toISOString();
        } else {
            error["AccidentTime"] = true;
        }

        //意外發生地點
        if (form.accidentLocation) {
            body["AccidentLocation"] = form.accidentLocation;
        } else {
            error["AccidentLocation"] = true;
        }

        //智力障礙程度
        // if (form.intellectualDisability) {
        //     body["intellectualDisability"] = form.intellectualDisability;
        // } else {
        //     error.intellectualDisability = "INTELLECTUAL_DISABILITY_ERROR"
        // }

        //服務使用者意外時情況
        if (form.patientAcciedntScenario) {
            body["Circumstance"] = form.patientAcciedntScenario;

            if (form.patientAcciedntScenario === "SCENARIO_OUTSIDE_ACTIVITY")
                if (form.scenarioOutsideActivityRemark) {
                    body["CircumstanceLocation"] = form.scenarioOutsideActivityRemark.trim();
                } else {
                    error["CircumstanceLocation"] = true;
                }
            if (form.patientAcciedntScenario === "SCENARIO_OTHER") {
                if (form.scenarioOtherRemark) {
                    body["CircumstanceOtherRemark"] = form.scenarioOtherRemark.trim();
                } else {
                    error["CircumstanceOtherRemark"] = true;
                }
            }
        } else {
            error["Circumstance"] = true;
        }

        //服務使用者受傷部位
        if (form.injuredArea.length > 0) {
            body["InjuredArea"] = JSON.stringify(form.injuredArea);

            if (form.injuredArea.indexOf("INJURY_OTHER") > -1) {
                if (form.injuredArea) {
                    body["InjuredAreaOtherRemark"] = form.injuredAreaOther;
                } else {
                    error["InjuredAreaOtherRemark"] = true;
                }
            }
        } else {
            error["InjuredArea"] = true;
        }

        //服務使用者意外後有否身體不適/受傷
        if (form.serviceUserUncomfort) {
            body["UnwellAfterInjured"] = form.serviceUserUncomfort;

            if (form.serviceUserUncomfort === "SERVICE_USER_UNCOMFORT_TRUE") {
                if (form.uncomfortable.length > 0) {
                    body["UnwellAfterInjuredChoices"] = JSON.stringify(form.uncomfortable);

                    if (form.uncomfortable.indexOf("UNCOMFORTABLE_OTHER") > -1) {
                        if (form.uncomfortableOtherRemark) {
                            body["UnwellAfterInjuredOther"] = form.uncomfortableOtherRemark;
                        } else {
                            error["UnwellAfterInjuredOther"] = true;
                        }
                    }

                    if (form.uncomfortableDescription) {
                        body["UnwellAfterInjuredDescription"] = form.uncomfortableDescription;
                    } else {
                        error["UnwellAfterInjuredDescription"] = true;
                    }
                } else {
                    error["UnwellAfterInjuredChoices"] = true;
                }
            } else if (form.serviceUserUncomfort === "SERVICE_USER_UNCOMFORT_FALSE") {
                // do nothing
            }
        } else {
            error["UnwellAfterInjured"] = true;
        }

        //服務使用者有否出現不安全的行為
        if (form.behaviorSwitch) {
            body["UnsafeBehaviors"] = form.behaviorSwitch;
            if (form.behaviorSwitch === "BEHAVIOR_SWITCH_TRUE") {

                if (form.behavior.length > 0) {
                    body["UnsafeBehaviorsChoices"] = JSON.stringify(form.behavior);

                    if (form.behavior.indexOf("BEHAVIOR_OTHER") > -1) {
                        if (form.behaviorOtherRemark) {
                            body["UnsafeBehaviorsOther"] = form.behaviorOtherRemark;
                        } else {
                            error["UnsafeBehaviorsOther"] = true;
                        }
                    }
                } else {
                    error["UnsafeBehaviorsChoices"] = true;
                }
            }
        } else {
            error["UnsafeBehaviors"] = true;
        }

        //相片及CCTV紀錄
        if (form.photo) {
            body["PhotoRecord"] = form.photo === "PHOTO_TRUE";
            // if (form.photo === "PHOTO_TRUE") {
            //     if (selectedCctvPhoto.length === 0) {
            //         error.photo = "請上傳照片";
            //     }
            // }
        } else {
            error["PhotoRecord"] = true;
        }

        if (form.cctv) {
            body["CctvRecord"] = form.cctv === "CCTV_TRUE";
            if (form.cctv === "CCTV_TRUE") {
                body["CctvRecordReceiveDate"] = cctvRecordReceiveDate.toISOString();
            }
        } else {
            error["CctvRecord"] = true;
        }

        // 環境因素
        if (form.envFactor.length > 0) {
            body["ObserveEnvironmentFactor"] = JSON.stringify(form.envFactor);
            if (form.envFactor.indexOf("ENV_OTHER") > -1) {
                if (form.enviromentalFactorOtherRemark) {
                    body["ObserveEnvironmentFactorOther"] = form.enviromentalFactorOtherRemark.trim();
                } else {
                    error["ObserveEnvironmentFactorOther"] = true;
                }
            }
        } else {
            error["ObserveEnvironmentFactor"] = true;
        }

        //個人因素
        if (form.personalFactor.length > 0) {
            body["ObservePersonalFactor"] = JSON.stringify(form.personalFactor);
            if (form.personalFactor.indexOf("PERSONAL_OTHER") > -1) {
                if (form.personalFactorOtherRemark) {
                    body["ObservePersonalFactorOther"] = form.personalFactorOtherRemark.trim();
                } else {
                    error["ObservePersonalFactorOther"] = true;
                }
            }
        } else {
            error["ObservePersonalFactor"] = true;
        }

        //事發過程
        if (form.accidentDetail) {
            body["AccidentDetail"] = form.accidentDetail.trim();
        } else {
            error["AccidentDetail"] = true;
        }

        //服務單位即時治療/處理
        if (form.treatmentAfterAccident) {
            body["TreatmentAfterAccident"] = form.treatmentAfterAccident.trim();
        } else {
            error["TreatmentAfterAccident"] = true;
        }

        //就診安排
        if (form.arrangement) {
            body["MedicalArrangement"] = form.arrangement;
            //醫院名稱
            if (form.arrangement.indexOf("ARRANGEMENT_EMERGENCY_DEPARTMENT") > -1) {
                if (form.medicalArrangementHospital) {
                    body["MedicalArrangementHospital"] = form.medicalArrangementHospital.trim();
                } else {
                    error["MedicalArrangementHospital"] = true;
                }
                

                //到達時間
                if (medicalArrangementDate) {
                    body["MedicalArrangementDate"] = medicalArrangementDate.toISOString();
                } else {
                    error["MedicalArrangementDate"] = true;
                }
                

                // 提供予服務使用者的治療
                if (form.medicalArrangementTreatment) {
                    body["MedicalArrangementTreatment"] = form.medicalArrangementTreatment.trim();
                } else {
                    error["MedicalArrangementTreatment"] = true;
                }
            }

        } else {
            error["MedicalArrangement"] = true;
        }

        //是否在醫院留醫
        if (form.isStayInHospital) {
            body["StayInHospital"] = form.isStayInHospital;
            //醫院名稱
            if (form.isStayInHospital === "IS_STAY_IN_HOSPITAL_TRUE") {
                if (form.stayInHospitalName) {
                    body["StayInHospitalName"] = form.stayInHospitalName;
                } else {
                    error["StayInHospitalName"] = true;
                }
            }
        } else {
            error["StayInHospital"] = true;
        }

        //報警處理
        if (form.police) {
            body["CalledPolice"] = form.police === "POLICE_TRUE";
            if (form.police === "POLICE_TRUE") {
                //日期和時間
                if (policeDate) {
                    body["CalledPoliceDate"] = policeDate.toISOString();
                } else {
                    error["CalledPoliceDate"] = true;
                }
                

                //報案編號
                if (form.policeReportNumber) {
                    body["CalledPoliceReportNumber"] = form.policeReportNumber.trim();
                } else {
                    error["CalledPoliceReportNumber"] = true;
                }

                //警署
                if (form.policeStation) {
                    body["CalledPoliceStation"] = form.policeStation.trim();
                } else {
                    error["CalledPoliceStation"] = true;
                }
            }
        } else {
            error["CalledPolice"] = true;
        }

        //意外後中心即時應變措施 
        if (form.contingencyMeasure) {
            body["ContingencyMeasure"] = form.contingencyMeasure;
            if (form.contingencyMeasure === "CONTINGENCY_MEASURE_TRUE") {
                if (form.contingencyMeasureRemark) {
                    body["ContingencyMeasureRemark"] = form.contingencyMeasureRemark.trim();
                } else {
                    error["ContingencyMeasureRemark"] = true;
                }
            }
        } else {
            error["ContingencyMeasure"] = true;
        }

        //通知家屬日期和時間
        if (contactFamilyDate) {
            body["ContactFamilyDate"] = contactFamilyDate.toISOString();
        } else {
            error["ContactFamilyDate"] = true;
        }
        

        //與服務使用者關係
        if (form.contactFamilyRelationship) {
            body["ContactFamilyRelationship"] = form.contactFamilyRelationship.trim();
        } else {
            error["ContactFamilyRelationship"] = true;
        }

        //家屬姓名
        if (form.contactFamilyName) {
            body["ContactFamilyName"] = form.contactFamilyName.trim();
        } else {
            error["ContactFamilyName"] = true;
        }
        //負責通知家屬的職員姓名
        if (contactStaffPickerInfo && contactStaffPickerInfo.length > 0) {
            const [contactStaffObj] = contactStaffPickerInfo;
            body["ContactFamilyStaffId"] = contactStaffObj.id;
        }

        //服務使用者經診治後情況
        if (form.afterTreatmentDescription) {
            body["AfterTreatmentDescription"] = form.afterTreatmentDescription.trim();
        } else {
            error["AfterTreatmentDescription"] = true;
        }


        // 高級服務經理/服務經理
        if (spSmInfo) {
            body["SMId"] = spSmInfo.Id;
        } else {
            error["SMId"] = true;
        }
        
        // if (serviceManager) {
        //     body["SMId"] = spSmInfo.Id;
        // } else {
        //     // error implemenetation
        //     error.serviceManager = "請選擇";
        // }

        // 服務總監
        debugger
        if (spSmInfo) {
            body["SDId"] = spSdInfo.Id;
        } else {
            error["SDId"] = true;
        }
        
        // if (serviceDirector) {
        //     body["SDId"] = spSmInfo.Id;
        // } else {
        //     // error implemenetation
        //     error.serviceDirector = "請選擇";
        // }

        // 高級物理治療師
        if (sPhysicalTherapy) {
            body["SPTId"] = sPhysicalTherapy.Id;
        } else {
            //error implementation
            error["SPTId"] = true;
        }

        if (currentUserRole === Role.SERVICE_MANAGER && status === "SUBMIT") {
            body["SMApproved"] = true;
            body["Status"] = "PENDING_SPT_APPROVE";
            body["NextDeadline"] = addBusinessDays(new Date(), 3).toISOString();
            body["SubmitDate"] = new Date();
        } else if (status === "SUBMIT") {
            body["Status"] = "PENDING_SM_APPROVE";
            body["NextDeadline"] = addBusinessDays(new Date(), 3).toISOString();
            body["SubmitDate"] = new Date();
        } else if (status === "DRAFT") {
            // body["Status"] = "DRAFT";
        }

        body["Stage"] = "1";
        return [body, error];
    }

    const draftHandler = (event) => {
        event.preventDefault();
        const [body] = dataFactory("DRAFT");
        if (formStatus === "DRAFT") {
            updateServiceUserAccidentById(formData.Id, {
                ...body,
                "Title": "SUI",
                "Status": "DRAFT"
            }).then(async (updateServiceUserAccidentByIdRes) => {
                console.log(updateServiceUserAccidentByIdRes);
                let att = [];
                if (form.photo === "PHOTO_TRUE" && selectedCctvPhoto.length > 0) {
                    att = [...attachmentsFilesFormatParser(selectedCctvPhoto, "CCTV")];
                }

                if (injuryFiles.length > 0) {
                    att = [...att, ...attachmentsFilesFormatParser(injuryFiles, "INJURY")];
                }

                if (att.length > 0) {
                    // Do seomething
                    await updateServiceUserAccidentAttachmentById(formData.Id, att).then(updateServiceUserAccidentAttachmentByIdRes => {
                        if (updateServiceUserAccidentAttachmentByIdRes) {
                            // Do something
                        }
                    }).catch(console.error);
                }

                formSubmittedHandler();
            }).catch(console.error);
        } else {
            createServiceUserAccident({
                ...body,
                "Title": "SUI",
                "Status": "DRAFT"
            }).then(async (createServiceUserAccidentRes) => {

                console.log(createServiceUserAccidentRes);
                if (createServiceUserAccidentRes && createServiceUserAccidentRes.data && createServiceUserAccidentRes.data.Id) {
                    let att = [];

                    if (form.photo === "PHOTO_TRUE" && selectedCctvPhoto.length > 0) {
                        att = [...attachmentsFilesFormatParser(selectedCctvPhoto, "CCTV")];
                    }

                    if (injuryFiles.length > 0) {
                        att = [...att, ...attachmentsFilesFormatParser(injuryFiles, "INJURY")];
                    }

                    if (att.length > 0) {
                        // Do seomething
                        await updateServiceUserAccidentAttachmentById(createServiceUserAccidentRes.data.Id, att).then(updateServiceUserAccidentAttachmentByIdRes => {
                            if (updateServiceUserAccidentAttachmentByIdRes) {
                                // Do something
                            }
                        }).catch(console.error);
                    }
                }

                formSubmittedHandler();
            }).catch(console.error);
        }
    }

    const submitHandler = (event) => {
        event.preventDefault();
        if (currentUserRole === Role.ADMIN) {
            updateServiceUserAccidentById(formId, {
                "InsuranceCaseNo": insuranceNumber
            }).then((res) => {
                // Update form to stage 1-2
                // Trigger notification workflow
                console.log(res);
                postLog({
                    AccidentTime: formData.AccidentTime,
                    Action: "更新",
                    CaseNumber: formData.CaseNumber,
                    FormType: "SUI",
                    Report: "服務使用者意外填報表(一)",
                    ServiceUnit: formData.ServiceLocation,
                    RecordId: formData.Id
                }).catch(console.error);

                formSubmittedHandler();
            }).catch(console.error);
        } else if (pendingSptApproveForSD(context,currentUserRole, formStatus, formStage, sptDate,sdInfo)) {
            updateServiceUserAccidentById(formId, {
                "SDComment": sdComment,
                "SDDate": new Date().toISOString(),
            }).then((res) => {
                // Update form to stage 1-2
                // Trigger notification workflow
                console.log(res);
                notifyServiceUserAccidentSMSDComment(context, formData.Id, 1, serviceUserAccidentWorkflow);
                postLog({
                    AccidentTime: formData.AccidentTime,
                    Action: "評語",
                    CaseNumber: formData.CaseNumber,
                    FormType: "SUI",
                    Report: "服務使用者意外填報表(一)",
                    ServiceUnit: formData.ServiceLocation,
                    RecordId: formData.Id
                }).catch(console.error);


                formSubmittedHandler();
            }).catch(console.error);
        } else {
            let [body, error] = dataFactory("SUBMIT");
            console.log(error);
            if (Object.keys(error).length > 0) {
                setError(error);
            } else {
                if (formStatus === "SM_VOID") {
                    updateServiceUserAccidentById(formData.Id, {
                        ...body,
                        "Status": "PENDING_SM_APPROVE"
                    }).then(async (updateServiceUserAccidentByIdRes) => {
                        let att = [];
                        if (form.photo === "PHOTO_TRUE" && selectedCctvPhoto.length > 0) {
                            att = [...attachmentsFilesFormatParser(selectedCctvPhoto, "CCTV")];
                        }
    
                        if (injuryFiles.length > 0) {
                            att = [...att, ...attachmentsFilesFormatParser(injuryFiles, "INJURY")];
                        }
    
                        if (att.length > 0) {
                            // Do seomething
                            await updateServiceUserAccidentAttachmentById(formData.Id, att).then(updateServiceUserAccidentAttachmentByIdRes => {
                                if (updateServiceUserAccidentAttachmentByIdRes) {
                                    // Do something
                                }
                            }).catch(console.error);
                        }
                        notifyServiceUserAccident(context, formData.Id, 1, serviceUserAccidentWorkflow);
                        postLog({
                            AccidentTime: formData.AccidentTime,
                            Action: "提交至服務經理",
                            CaseNumber: formData.CaseNumber,
                            FormType: "SUI",
                            Report: "服務使用者意外填報表(一)",
                            ServiceUnit: formData.ServiceLocation,
                            RecordId: formData.Id
                        }).catch(console.error);
                        formSubmittedHandler();
                    }).catch(console.error);
                } else {
                    caseNumberFactory(FormFlow.SERVICE_USER_ACCIDENT, serviceLocation).then((caseNumber) => {
                        console.log(caseNumber)
                        let extraBody = {
                            "CaseNumber": caseNumber,
                            "Title": "SUI",
                            "ServiceLocation": serviceLocation,
                            "Status": "PENDING_SM_APPROVE"
                        };
    
    
    
                        //SM Auto approve go to next step
                        if (CURRENT_USER.email === spSmInfo.Email) {
                            extraBody["SMApproved"] = true;
                            extraBody["SMComment"] = smComment;
                            extraBody["SMDate"] = new Date().toISOString();
                            extraBody["NextDeadline"] = addBusinessDays(new Date(), 3).toISOString();
                            extraBody["Status"] = "PENDING_SPT_APPROVE"
                        }
    
                        if (formStatus === "DRAFT") {
                            updateServiceUserAccidentById(formData.Id, {
                                ...body,
                                ...extraBody
                            }).then(async (updateServiceUserAccidentByIdRes) => {
                                let att = [];
                                if (form.photo === "PHOTO_TRUE" && selectedCctvPhoto.length > 0) {
                                    att = [...attachmentsFilesFormatParser(selectedCctvPhoto, "CCTV")];
                                }
    
                                if (injuryFiles.length > 0) {
                                    att = [...att, ...attachmentsFilesFormatParser(injuryFiles, "INJURY")];
                                }
    
                                if (att.length > 0) {
                                    // Do seomething
                                    await updateServiceUserAccidentAttachmentById(formData.Id, att).then(updateServiceUserAccidentAttachmentByIdRes => {
                                        if (updateServiceUserAccidentAttachmentByIdRes) {
                                            // Do something
                                        }
                                    }).catch(console.error);
                                }
                                //if (extraBody["Status"] === "PENDING_SPT_APPROVE") {
                                    notifyServiceUserAccident(context, formData.Id, 1, serviceUserAccidentWorkflow);
                                //}
    
    
                                postLog({
                                    AccidentTime: accidentTime.toISOString(),
                                    Action: "提交",
                                    CaseNumber: caseNumber,
                                    FormType: "SUI",
                                    RecordId: formData.Id,
                                    Report: "服務使用者意外填報表(一)",
                                    ServiceUnit: serviceLocation
                                })
    
                                formSubmittedHandler();
                            }).catch(console.error);
                        } else {
                            console.log("body : ",body);
                            console.log("extraBody : ",extraBody);
                            createServiceUserAccident({
                                ...body,
                                ...extraBody
                            }).then(async (createServiceUserAccidentRes) => {
    
                                if (createServiceUserAccidentRes && createServiceUserAccidentRes.data && createServiceUserAccidentRes.data.Id) {
    
                                    // Attachement
                                    let att = [];
                                    if (form.photo === "PHOTO_TRUE" && selectedCctvPhoto.length > 0) {
                                        att = [...attachmentsFilesFormatParser(selectedCctvPhoto, "CCTV")];
                                    }
    
                                    if (injuryFiles.length > 0) {
                                        att = [...att, ...attachmentsFilesFormatParser(injuryFiles, "INJURY")];
                                    }
    
                                    if (att.length > 0) {
                                        // Do seomething
                                        await updateServiceUserAccidentAttachmentById(createServiceUserAccidentRes.data.Id, att).then(updateServiceUserAccidentAttachmentByIdRes => {
                                            if (updateServiceUserAccidentAttachmentByIdRes) {
                                                // Do something
                                            }
                                        }).catch(console.error);
                                    }
                                }
                                //if (extraBody["Status"] === "PENDING_SPT_APPROVE") {
                                    notifyServiceUserAccident(context, createServiceUserAccidentRes.data.Id, 1, serviceUserAccidentWorkflow);
                                //}
    
                                postLog({
                                    AccidentTime: accidentTime.toISOString(),
                                    Action: "提交",
                                    CaseNumber: caseNumber,
                                    FormType: "SUI",
                                    RecordId: createServiceUserAccidentRes.data.Id,
                                    Report: "服務使用者意外填報表(一)",
                                    ServiceUnit: serviceLocation
                                }).catch(console.error);
    
                                formSubmittedHandler();
                            }).catch(console.error);
                        }
                    }).catch(console.error);
                }
            }
            
        }
    }
    const cancelHandler = () => {
        //implement 
        const path = context.pageContext.site.absoluteUrl + `/accident-and-incident/SitePages/Home.aspx`;
        window.open(path, "_self");
    }

    const smApproveHandler = () => {
        const [body, error] = dataFactory("");
        // const body2 = {
        //     "SMApproved": true,
        //     "SDComment": sdComment.trim(),
        //     "SMDate": smDate.toISOString(),
        //     "NextDeadline": addBusinessDays(new Date(), 3).toISOString(),
        //     "Status": "PENDING_SPT_APPROVE"
        // };
        if (confirm("確認批准 ?")) {


            updateServiceUserAccidentById(formId, {
                ...body,
                "SMApproved": true,
                "SMComment": smComment,
                "SMDate": new Date().toISOString(),
                "NextDeadline": addBusinessDays(new Date(), 3).toISOString(),
                "Status": "PENDING_SPT_APPROVE"
            }).then((res) => {
                // Update form to stage 1-2
                // Trigger notification workflow
                console.log(res);
                notifyServiceUserAccident(context, formData.Id, 1, serviceUserAccidentWorkflow);

                postLog({
                    AccidentTime: accidentTime.toISOString(),
                    Action: "批准",
                    CaseNumber: formData.CaseNumber,
                    FormType: "SUI",
                    Report: "服務使用者意外填報表(一)",
                    ServiceUnit: serviceLocation,
                    RecordId: formData.Id
                }).catch(console.error);

                formSubmittedHandler();
            }).catch(console.error);

        }
    }

    const smRejectHandler = () => {
        if (spSmInfo.Email === formData.Author.EMail) return;
        if (confirm("確認拒絕 ?")) {
            const body = {
                "SMApproved": false,
                "SMComment": smComment,
                "SMDate": new Date().toISOString(),
                "Status": "SM_VOID"
            };
            updateServiceUserAccidentById(formId, body).then((res) => {
                console.log(res);
                notifyServiceUserAccident(context, formData.Id, 1, serviceUserAccidentWorkflow);
                postLog({
                    AccidentTime: accidentTime.toISOString(),
                    Action: "拒絕",
                    CaseNumber: formData.CaseNumber,
                    FormType: "SUI",
                    Report: "服務使用者意外填報表(一)",
                    ServiceUnit: serviceLocation,
                    RecordId: formData.Id
                }).catch(console.error);
                formSubmittedHandler()
            }).catch(console.error);
        }
    }

    const sptApproveHandler = () => {
        if (confirm("確認批准 ?")) {
            const [body, error] = dataFactory("");

            if (Array.isArray(investigatorPickerInfo) && investigatorPickerInfo.length > 0) {
                const serviceAccidentUserFormBody = {
                    ...body,
                    "SPTApproved": true,
                    "SPTComment": sptComment,
                    "SPTDate": new Date().toISOString(),
                    "InvestigatorId": investigatorPickerInfo[0].id,
                    "Status": "PENDING_INVESTIGATE",
                    "Stage": "2",
                    "NextDeadline": addMonths(new Date(), 1).toISOString()
                };
                updateServiceUserAccidentById(formId, serviceAccidentUserFormBody).then((formOneResponse) => {
                    // Create form 20, switch to stage 2]
                    if (formOneResponse) {
                        getServiceUserAccidentById(formId).then((serviceUserAccidentForm) => {
                            if (serviceUserAccidentForm && serviceUserAccidentForm.CaseNumber && serviceUserAccidentForm.Id) {
                                let accidentTime = serviceUserAccidentForm.AccidentTime
                                const accidentReportFormBody = {
                                    "CaseNumber": serviceUserAccidentForm.CaseNumber,
                                    "ParentFormId": serviceUserAccidentForm.Id,
                                    "EstimatedFinishDate": new Date(new Date(accidentTime).setMonth(new Date(accidentTime).getMonth() + 1)), //預估完成分析日期 意外發生日期+1 month
                                    "ReceivedDate": new Date().toISOString(), // 交付日期
                                    "SPTId": serviceUserAccidentForm.SPTId,
                                    "SMId": serviceUserAccidentForm.SMId,
                                    "InvestigatorId": serviceUserAccidentForm.InvestigatorId
                                }
                                createAccidentReportForm(accidentReportFormBody).then((formTwoResponse) => {
                                    // Trigger notification workflow


                                    //AccidentReportForm
                                    if (formTwoResponse && formTwoResponse.data && formTwoResponse.data.Id) {

                                        updateServiceUserAccidentById(formId, { "AccidentReportFormId": formTwoResponse.data.Id }).then((res) => {
                                            console.log(res)

                                            notifyServiceUserAccident(context, formData.Id, 1, serviceUserAccidentWorkflow);
                                            formSubmittedHandler()
                                        }).catch(console.error);
                                    }

                                    postLog({
                                        AccidentTime: accidentTime.toISOString(),
                                        Action: "批准",
                                        CaseNumber: formData.CaseNumber,
                                        FormType: "SUI",
                                        Report: "服務使用者意外填報表(一)",
                                        ServiceUnit: serviceLocation,
                                        RecordId: formData.Id
                                    }).catch(console.error);

                                })
                            }
                        }).catch(console.error);
                    }
                });

            }
        }
    }

    const sptRejectHandler = () => {
        if (confirm("確認拒絕 ?")) {

            const body = {
                "SPTApproved": false,
                "SPTComment": sptComment,
                "SPTDate": new Date().toISOString(),
                "Status": "PENDING_SM_APPROVE"
            };
            updateServiceUserAccidentById(formData.Id, body).then((res) => {
                console.log(res);
                // Trigger notification workflow
                
                postLog({
                    AccidentTime: accidentTime.toISOString(),
                    Action: "拒絕",
                    CaseNumber: formData.CaseNumber,
                    FormType: "SUI",
                    Report: "服務使用者意外填報表(一)",
                    ServiceUnit: serviceLocation,
                    RecordId: formData.Id
                }).catch(console.error);
                notifyServiceUserAccidentReject(context, formData.Id, 1, serviceUserAccidentWorkflow);
                formSubmittedHandler();
            }).catch(console.error);
        }
    }

    const loadData = async (data: any) => {
        
        if (data) {

            setServiceUserNameCN(data.ServiceUserNameCN);
            setServiceUserNameEN(data.ServiceUserNameEN);
            setServiceUserAge(data.ServiceUserAge);
            setServiceUserGender(data.ServiceUserGender);
            setServiceUserId(data.ServiceUserId);
            setServiceCategory(data.ServiceCategory);
            setWheelchair(data.Wheelchair);
            setIntelligence(data.Intelligence);
            setAsd(data.ASD);

            setInsuranceNumber(data.InsuranceCaseNo);
            setFormId(data.Id);
            setFormStatus(data.Status);
            setFormStage(data.Stage);

            /*if (data.ServiceUnit) {
                setServiceUnit(data.ServiceUserUnit);
            }*/

            if (data.ServiceUserUnit) {
                setPatientServiceUnit(data.ServiceUserUnit);
            }

            setForm({
                accidentDetail: data.AccidentDetail || "",
                accidentLocation: data.AccidentLocation || "",
                afterTreatmentDescription: data.AfterTreatmentDescription || "",
                behaviorSwitch: data.UnsafeBehaviors || "",
                behavior: JSON.parse(data.UnsafeBehaviorsChoices) || [],
                behaviorOtherRemark: data.UnsafeBehaviorsOther || "",
                serviceUserUncomfort: data.UnwellAfterInjured,
                uncomfortable: JSON.parse(data.UnwellAfterInjuredChoices) || [],
                uncomfortableDescription: data.UnwellAfterInjuredDescription,
                uncomfortableOtherRemark: data.UnwellAfterInjuredOther,
                cctv: data.CctvRecord ? "CCTV_TRUE" : "CCTV_FALSE",
                photo: data.PhotoRecord ? "PHOTO_TRUE" : "PHOTO_FALSE",
                contactFamilyName: data.ContactFamilyName,
                contactFamilyRelationship: data.ContactFamilyRelationship,
                personalFactor: JSON.parse(data.ObservePersonalFactor) || [],
                personalFactorOtherRemark: data.ObservePersonalFactorOther,
                envFactor: JSON.parse(data.ObserveEnvironmentFactor) || [],
                enviromentalFactorOtherRemark: data.ObserveEnvironmentFactorOther,
                contingencyMeasure: data.ContingencyMeasure,
                contingencyMeasureRemark: data.ContingencyMeasureRemark,
                injuredArea: JSON.parse(data.InjuredArea) || [],
                injuredAreaOther: data.InjuredAreaOtherRemark,
                arrangement: data.MedicalArrangement || "",
                medicalArrangementHospital: data.MedicalArrangementHospital,
                medicalArrangementTreatment: data.MedicalArrangementTreatment,
                isStayInHospital: data.StayInHospital,
                stayInHospitalName: data.StayInHospitalName,
                police: data.CalledPolice ? "POLICE_TRUE" : "POLICE_FALSE",
                policeStation: data.CalledPoliceStation,
                policeReportNumber: data.CalledPoliceReportNumber,
                treatmentAfterAccident: data.TreatmentAfterAccident,
                patientAcciedntScenario: data.Circumstance,
                scenarioOtherRemark: data.CircumstanceOtherRemark,
                scenarioOutsideActivityRemark: data.CircumstanceLocation
            });

            setSmComment(data.SMComment);
            if (data.SMDate) {
                setSmDate(new Date(data.SMDate));
            }
            setSdComment(data.SDComment);
            if (data.SDDate) {
                setSdDate(new Date(data.SDDate));
            }
            setSptComment(data.SPTComment);
            if (data.SPTDate) {
                setSptDate(new Date(data.SPTDate));
            }

            setAccidentTime(new Date(data.AccidentTime));

            //setAccidentTime

            // Service Unit
            setServiceUnit(data.ServiceUnit);

            //Service User
            setServiceUserRecordId(data.ServiceUser);

            //Contact Family Staff
            if (data.ContactFamilyStaff && data.ContactFamilyStaff.EMail) {
                setContactStaff([{ secondaryText: data.ContactFamilyStaff.EMail, id: data.ContactFamilyStaff.Id }]);
            }


            //Created By whom
            if (data.Author) {
                setReporter([{ secondaryText: data.Author.mail, id: data.AuthorId }]);
            }

            if (data.Created) {
                setReportedDate(new Date(data.Created));
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

            if (data.Investigator) {
                setInvestigator([{ secondaryText: data.Investigator.EMail, id: data.Investigator.Id }]);
            }

            if (data.Attachments) {
                getServiceUserAccidentAllAttachmentById(data.Id).then((attchementsRes) => {
                    let injuryAttachments = [];
                    let cctvAttachments = [];
                    attchementsRes.forEach((att) => {
                        const splitPosition = att.FileName.indexOf("-");
                        const attachmentType = att.FileName.substr(0, splitPosition)
                        if (attachmentType === "CCTV") {
                            cctvAttachments.push(att);
                        } else if (attachmentType === "INJURY") {
                            injuryAttachments.push(att);
                        };
                    });

                    setUploadedInjuryFiles(injuryAttachments);
                    setUploadedCctvPhoto(cctvAttachments);
                }).catch(console.error);
            }
        }
    }

    useEffect(() => {
        if (Array.isArray(sptList) && sptList.length > 0) {
            //setSPhysicalTherapyEmail(sptList[0].mail);
        }
    }, [sptList]);
    
    useEffect(() => {
        
        if (formData) {
            setTimeout(() => {
                loadData(formData);
            },1000)
            //loadData(formData);
        } else {
            if (userInfo && userInfo.hr_deptid) {
                setHrDepartment(userInfo.hr_deptid);
                setServiceUnit(userInfo.hr_deptid);
                setServiceLocation(userInfo.hr_location);
                setPatientServiceUnit(userInfo.hr_deptid);
            }
            setReporter([{ secondaryText: CURRENT_USER.email, id: CURRENT_USER.id }]);
        }
    }, [formData]);

    // Get current User info in ad
    useEffect(() => {
        setCurrentUserEmail(CURRENT_USER.email);
        // setCurrentUserEmail("ade.leung@fuhong.org");
    }, []);

    // Find SD && SM
    useEffect(() => {
        // Testing data;
        if (formInitial(currentUserRole, formStatus)) {
            if (CURRENT_USER.email === "FHS.portal.dev@fuhong.hk") {
                setHrDepartment("CHH");
                setServiceUnit("CHH");
                setPatientServiceUnit("CHH")
                return;
            }

            
        }
    }, [userInfo]);

    // Get SD & SM
    useEffect(() => {
        if (formInitial(currentUserRole, formStatus)) {
            if (Array.isArray(departments) && departments.length) {
                const dept = departments[0];
                setServiceLocation(dept.location);
                if (dept && dept.hr_deptmgr && dept.hr_deptmgr !== "[empty]") {
                    setSMEmail(dept.hr_deptmgr);
                }

                if (dept && dept.hr_sd && dept.hr_sd !== "[empty]") {
                    setSDEmail(dept.hr_sd);
                }
            }
        }
    }, [departments])

    useEffect(() => {
        setHrDepartment(patientServiceUnit)
        /*getDepartmentBySuEngNameDisplay(patientServiceUnit).then((res) => {
            if (Array.isArray(res) && res.length) {
                const dept = res[0];

            }
        }).catch(console.error);*/
    }, [patientServiceUnit])


    useEffect(() => {
        if (formData && serviceUserRecordId === -1) {
            setServiceUserNameCN(formData.ServiceUserNameCN);
            setServiceUserNameEN(formData.ServiceUserNameEN);
            setServiceUserAge(formData.ServiceUserAge);
            setServiceUserGender(formData.ServiceUserGender);
            setServiceUserId(formData.ServiceUserId);
            setServiceCategory(formData.ServiceCategory);
            setWheelchair(formData.Wheelchair);
            setIntelligence(formData.Intelligence);
            setAsd(formData.ASD);
        } else if (serviceUserRecordId === -1) {
            setServiceUserNameCN("");
            setServiceUserNameEN("");
            setServiceUserAge(0);
            setServiceUserGender("");
            setServiceUserId("");
            setServiceCategory("");
            setWheelchair(undefined);
            setIntelligence("");
            setAsd(undefined);
        } else {
            if (serviceUser) {
                setServiceUserNameCN(serviceUser.NameCN);
                setServiceUserNameEN(serviceUser.NameEN);
                setServiceUserAge(serviceUser.Age);
                setServiceUserGender(serviceUser.Gender);
                setServiceUserId(serviceUser.ServiceNumber);
                setServiceCategory(serviceUser.ServiceType);
                setWheelchair(serviceUser.Wheelchair);
                setIntelligence(serviceUser.IntellectualDisability);
                setAsd(serviceUser.ASD);
            }
        }
    }, [serviceUser, serviceUserRecordId]);
    
    return (
        <>
            {
                isPrintMode && <Header displayName="服務使用者意外填報表(一)" />
            }

            <div className={`${styles.backgroundColor} container-fluid px-4 pt-4`}>
                <section className="mb-5">
                    <div className="form-row mb-2">
                        {/* 服務單位 */}
                        <label className={`col-12 col-xl-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>服務單位</label>
                        <div className="col-12 col-xl-4">
                            {/* <select className={`custom-select  ${error.serviceUnit ? "is-invalid" : ""}`} value={serviceUnit} onChange={(event) => setServiceUnit(event.target.value)}
                                disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, smInfo)}>
                                <option>請選擇服務單位</option>
                                {serviceUnitList.map((unit) => {
                                    return <option value={unit.ShortForm}>{`${unit.ShortForm} - ${unit.Title}`}</option>
                                })}
                            </select> */}
                            {/* <input type="text" className="form-control" value={userInfo && userInfo.hr_location || ""} disabled /> */}
                            {/* <input type="text" className="form-control" value={serviceUnit || ""} disabled /> */}
                            <select className={`custom-select ${(error && error['ServiceUserUnit'] ) ? "is-invalid": ""}`} value={patientServiceUnit} onChange={(event) => { setPatientServiceUnit(event.target.value) }}
                                disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)}
                            >
                                <option value={""} ></option>
                                {permissionList.indexOf('All') >=0 &&
                                    serviceUserUnitList.map((item) => {
                                        return <option value={item.su_Eng_name_display} selected={item.su_Eng_name_display == serviceUnit}>{item.su_Eng_name_display}</option>
                                    })
                                }
                                {permissionList.indexOf('All') < 0 && 
                                    permissionList.map((item) => {
                                        return <option value={item} selected={item == serviceUnit}>{item}</option>
                                    })
                                }
                            </select>
                        </div>
                        {/* 保險公司備案編號 */}
                        <label className={`col-12 col-xl-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>保險公司備案編號</label>
                        <div className="col-12 col-xl-4">
                            <input type="text" className="form-control" name={insuranceNumber} value={insuranceNumber} onChange={(event) => setInsuranceNumber(event.target.value)} disabled={currentUserRole !== Role.ADMIN} />
                        </div>
                    </div>
                </section>

                {/* <hr className="my-4" /> */}

                <section className="mb-5">
                    <div className="form-row mb-3">
                        <div className="col-12 font-weight-bold">
                            <h5>服務使用者資料</h5>
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <label className={`col-12 col-xl-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>服務使用者</label>
                        <div className="col-12 col-xl-4">
                            <select className={`custom-select ${(error && error['ServiceUser'] ) ? "is-invalid": ""}`} value={serviceUserRecordId} onChange={(event) => setServiceUserRecordId(+event.target.value)}
                                disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)}>
                                <option>請選擇服務使用者</option>
                                {
                                    serviceUserList.map((user) => {
                                        return <option value={user.ID}>{`${user.ServiceNumber} - ${user.NameCN}`}</option>
                                    })
                                }
                                <option value={-1}>沒有服務使用者紀錄</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        {/* 服務使用者姓名 (英文)*/}
                        <label className={`col-12 col-xl-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>服務使用者姓名<span className="d-sm-inline d-xl-block">(英文)</span></label>
                        <div className="col-12 col-xl-4">
                            <input type="text" className="form-control"
                                //  value={serviceUser ? serviceUser.NameEN : ""} 
                                value={serviceUserNameEN}
                                onChange={(event) => setServiceUserNameEN(event.target.value)}
                                disabled={serviceUserRecordId !== -1 || !pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)}
                            />
                        </div>
                        {/* 服務使用者姓名 (中文)*/}
                        <label className={`col-12 col-xl-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>服務使用者姓名<span className="d-sm-inline d-xl-block">(中文)</span></label>
                        <div className="col-12 col-xl-4">
                            <input type="text" className="form-control"
                                // value={serviceUser ? serviceUser.NameCN : ""}
                                value={serviceUserNameCN}
                                onChange={(event) => setServiceUserNameCN(event.target.value)}
                                disabled={serviceUserRecordId !== -1 || !pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)}
                            />
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        {/* 年齡*/}
                        <label className={`col-12 col-xl-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>年齡</label>
                        <div className="col-12 col-xl-4">
                            <input type="number" className="form-control" min={0}
                                // value={serviceUser ? serviceUser.Age : 0}
                                value={serviceUserAge}
                                onChange={(event) => setServiceUserAge(+event.target.value)}
                                disabled={serviceUserRecordId !== -1 || !pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)}
                            />
                        </div>
                        {/* 性別*/}
                        <label className={`col-12 col-xl-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>性別</label>
                        <div className="col-12 col-xl-4 pt-xl-0">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input form-check-lg" type="radio" name="patientGender" id="gender-male" value="male"
                                    // checked={serviceUser && serviceUser.Gender === "Male"}
                                    checked={serviceUserGender === "Male"}
                                    onClick={() => setServiceUserGender("Male")}
                                    disabled={serviceUserRecordId !== -1 || !pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)}
                                />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="gender-male">男</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="patientGender" id="gender-female" value="female"
                                    //  checked={serviceUser && serviceUser.Gender === "Female"} 
                                    checked={serviceUserGender === "Female"}
                                    onClick={() => setServiceUserGender("Female")}
                                    disabled={serviceUserRecordId !== -1 || !pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)}
                                />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="gender-female">女</label>
                            </div>
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        {/* 服務使用者檔案號碼*/}
                        <label className={`col-12 col-xl-2 col-form-label ${styles.fieldTitle} pt-xl-0 pr-xl-0`}>服務使用者檔案號碼</label>
                        <div className="col-12 col-xl-4">
                            <input type="text" className="form-control"
                                // value={serviceUser ? serviceUser.ServiceNumber : ""} 
                                value={serviceUserId}
                                onChange={(event) => setServiceUserId(event.target.value)}
                                disabled={serviceUserRecordId !== -1 || !pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)}
                            />
                        </div>
                        {/* 接受服務類別*/}
                        <label className={`col-12 col-xl-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>接受服務類別</label>
                        <div className="col-12 col-xl-4">
                            <input type="text" className="form-control"
                                // value={serviceUser ? serviceUser.ServiceType : ""}
                                value={serviceCategory}
                                onChange={(event) => setServiceCategory(event.target.value)}
                                disabled={serviceUserRecordId !== -1 || !pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)}
                            />
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        {/* 意外發生日期*/}
                        <label className={`col-12 col-xl-2 col-form-label ${styles.fieldTitle} pt-xl-0 pr-xl-0`}>意外發生日期和時間</label>
                        <div className="col-12 col-xl-4">
                            <DatePicker
                                className={`form-control ${(error && error['ServiceUserUnit'] ) ? "is-invalid": ""}`}
                                selected={accidentTime}
                                onChange={setAccidentTime}
                                onChangeRaw={(event) => dateFieldRawHandler(event, setAccidentTime)}
                                maxDate={new Date()}
                                showTimeSelect
                                timeFormat="p"
                                timeIntervals={15}
                                dateFormat="yyyy/MM/dd h:mm aa"
                                readOnly={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)}
                            />
                        </div>
                        {/* 意外發生地點*/}
                        <label className={`col-12 col-xl-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>意外發生地點</label>
                        <div className="col-12 col-xl-4">
                            <input type="text" className={`form-control ${(error && error['AccidentLocation'] ) ? "is-invalid": ""}`} name="accidentLocation" value={form.accidentLocation} onChange={textHandler}
                                disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                            {/* {error.accidentLocation && <div className="text-danger">{"請填寫"}</div>} */}
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        {/* 是否使用輪椅*/}
                        <label className={`col-12 col-xl-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>是否使用輪椅</label>
                        <div className="col-12 col-xl-4">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="patientWheelchair" id="wheelchair-true" value="true"
                                    // checked={serviceUser && serviceUser.Wheelchair === true}
                                    checked={wheelchair === true}
                                    onClick={() => setWheelchair(true)}
                                    disabled={serviceUserRecordId !== -1 || !pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)}
                                />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="wheelchair-true">是</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="patientWheelchair" id="wheelchair-false" value="false"
                                    // checked={serviceUser && (serviceUser.Wheelchair === false || serviceUser.Wheelchair === null)}
                                    checked={wheelchair === false}
                                    onClick={(event) => setWheelchair(false)}
                                    disabled={serviceUserRecordId !== -1 || !pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)}
                                />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="wheelchair-false">否</label>
                            </div>
                        </div>

                        {/* 自閉症譜系障礙(ASD) */}
                        <label className={`col-12 col-xl-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>自閉症譜系障礙(ASD)</label>
                        <div className="col-12 col-xl-4">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="patientASD" id="asd_true" value="ASD_TRUE"
                                    // checked={serviceUser && (serviceUser.ASD === true)}
                                    checked={asd === true}
                                    onClick={() => setAsd(true)}
                                    disabled={serviceUserRecordId !== -1 || !pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)}
                                />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="asd_true">是</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="patientASD" id="asd_false" value="ASD_FALSE"
                                    // checked={serviceUser && (serviceUser.ASD === false || serviceUser.ASD === null)} 
                                    checked={asd === false}
                                    onClick={() => setAsd(false)}
                                    disabled={serviceUserRecordId !== -1 || !pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)}
                                />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="asd_false">否</label>
                            </div>
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        {/* 智力障礙程度 */}
                        <label className={`col-12 col-xl-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>智力障礙程度</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="intellectualDisability" id="intellectual-disability-mild" value="INTELLECTUAL_DISABILITY_MILD"
                                    // checked={serviceUser && serviceUser.IntellectualDisability === "MILD"}
                                    checked={intelligence === "MILD"}
                                    onChange={() => setIntelligence("MILD")}
                                    disabled={serviceUserRecordId !== -1 || !pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)}
                                />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="intellectual-disability-mild">輕度</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="intellectualDisability" id="intellectual-disability-moderate" value="INTELLECTUAL_DISABILITY_MODERATE"
                                    checked={intelligence === "MODERATE"}
                                    onChange={() => setIntelligence("MODERATE")}
                                    disabled={serviceUserRecordId !== -1 || !pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)}
                                />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="intellectual-disability-moderate">中度</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="intellectualDisability" id="intellectual-disability-severe" value="INTELLECTUAL_DISABILITY_SEVERE"
                                    // checked={serviceUser && serviceUser.IntellectualDisability === "SEVERE"}
                                    checked={intelligence === "SEVERE"}
                                    onChange={() => setIntelligence("SEVERE")}
                                    disabled={serviceUserRecordId !== -1 || !pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)}
                                />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="intellectual-disability-severe">嚴重</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="intellectualDisability" id="intellectual-disability-extreme-severe" value="INTELLECTUAL_DISABILITY_EXTREME_SEVERE"
                                    // checked={serviceUser && serviceUser.IntellectualDisability === "EXTREME_SEVERE"}
                                    checked={intelligence === "EXTREME_SEVERE"}
                                    onChange={() => setIntelligence("EXTREME_SEVERE")}
                                    disabled={serviceUserRecordId !== -1 || !pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)}
                                />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="intellectual-disability-extreme-severe">極度嚴重</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="intellectualDisability" id="intellectual-disability-unknown" value="INTELLECTUAL_DISABILITY_UNKNOWN"
                                    // checked={serviceUser && (serviceUser.IntellectualDisability === "UNKNOWN" || serviceUser.IntellectualDisability === null)}
                                    // checked={serviceUser && (serviceUser.IntellectualDisability === "UNKNOWN" || serviceUser.IntellectualDisability === null)}
                                    checked={intelligence === "UNKNOWN" || intelligence === null}
                                    onChange={() => setIntelligence("UNKNOWN")}
                                    disabled={serviceUserRecordId !== -1 || !pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)}
                                />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="intellectual-disability-unknown">不知</label>
                            </div>
                            {/* {error.intellectualDisability && <div className="text-danger">{error.intellectualDisability}</div>} */}
                        </div>
                    </div>
                </section>

                <section className="mb-5">
                    <div className="form-row mb-3">
                        <div className="col-12 font-weight-bold">
                            <h5>意外事件紀錄</h5>
                        </div>
                    </div>

                    <div className="form-row mb-4">
                        {/* 1.1 服務使用者意外時情況*/}
                        <label className={`col-12 col-xl-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>服務使用者意外時情況</label>

                        <div className={`col ${(error && error['Circumstance'] ) ? styles.divInvalid: ""}`}>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="patientAcciedntScenario" id="scenario-sleep" value="SCENARIO_SLEEPING" onClick={radioButtonHandler} checked={form.patientAcciedntScenario === ("SCENARIO_SLEEPING")} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="scenario-sleep">睡覺</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="patientAcciedntScenario" id="scenario-dinning" value="SCENARIO_DINNING" onClick={radioButtonHandler} checked={form.patientAcciedntScenario === ("SCENARIO_DINNING")} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="scenario-dinning">進食</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="patientAcciedntScenario" id="scenario-wash" value="SCENARIO_WASHING" onClick={radioButtonHandler} checked={form.patientAcciedntScenario === ("SCENARIO_WASHING")} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="scenario-wash">梳洗</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="patientAcciedntScenario" id="scenario-toliet" value="SCENARIO_TOLIET" onClick={radioButtonHandler} checked={form.patientAcciedntScenario === ("SCENARIO_TOLIET")} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="scenario-toliet">如廁</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="patientAcciedntScenario" id="scenario-bath" value="SCENARIO_BATHING" onClick={radioButtonHandler} checked={form.patientAcciedntScenario === ("SCENARIO_BATHING")} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="scenario-bath">洗澡</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="patientAcciedntScenario" id="scenario-walk" value="SCENARIO_WALKING" onClick={radioButtonHandler} checked={form.patientAcciedntScenario === ("SCENARIO_WALKING")} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="scenario-walk">步行期間</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="patientAcciedntScenario" id="scenario_inside_activity" value="SCENARIO_INSIDE_ACTIVITY" onClick={radioButtonHandler} checked={form.patientAcciedntScenario === ("SCENARIO_INSIDE_ACTIVITY")} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="scenario_inside_activity">參與服務單位內活動</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="patientAcciedntScenario" id="scenario_outside_activity" value="SCENARIO_OUTSIDE_ACTIVITY" onClick={radioButtonHandler} checked={form.patientAcciedntScenario === ("SCENARIO_OUTSIDE_ACTIVITY")} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="scenario_outside_activity">外出活動期間(請註明地點)</label>
                            </div>
                            {
                                form.patientAcciedntScenario === "SCENARIO_OUTSIDE_ACTIVITY" &&
                                <div className="">
                                    <AutosizeTextarea className={`form-control ${(error && error['CircumstanceLocation'] ) ? "is-invalid": ""}`} placeholder={"請註明"} name="scenarioOutsideActivityRemark" value={form.scenarioOutsideActivityRemark} onChange={textHandler} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                </div>
                            }
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="patientAcciedntScenario" id="scenario_other" value="SCENARIO_OTHER" onClick={radioButtonHandler} checked={form.patientAcciedntScenario === ("SCENARIO_OTHER")} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="scenario_other">其他 (請註明)</label>
                            </div>
                            {
                                form.patientAcciedntScenario === "SCENARIO_OTHER" &&
                                <div className="">
                                    <AutosizeTextarea className={`form-control ${(error && error['CircumstanceOtherRemark'] ) ? "is-invalid": ""}`} placeholder={"請註明"} name="scenarioOtherRemark" value={form.scenarioOtherRemark} onChange={textHandler} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                </div>
                            }
                        </div>

                        {/* 1.2 服務使用者受傷部位*/}
                        <label className={`col-12 col-xl-2 col-form-label ${styles.fieldTitle} pt-xl-0 pr-xl-0  `}>
                            服務使用者受傷部位<span className="d-sm-inline d-xl-block">(請上載相片 - 如有)</span>
                        </label>
                        <div className={`col ${(error && error['InjuredArea'] ) ? styles.divInvalid: ""}`}>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="injuredArea" id="injury-head" value="INJURY_HEAD" onClick={checkboxHandler} checked={form.injuredArea.indexOf("INJURY_HEAD") > -1} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="injury-head">頭部</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="injuredArea" id="injury-neck" value="INJURY_NECK" onClick={checkboxHandler} checked={form.injuredArea.indexOf("INJURY_NECK") > -1} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="injury-neck">頸部</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="injuredArea" id="injury-body" value="INJURY_BODY" onClick={checkboxHandler} checked={form.injuredArea.indexOf("INJURY_BODY") > -1} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="injury-body">軀幹</label>
                            </div>
                            <div className="form-check form-check-inline ">
                                <input className="form-check-input" type="checkbox" name="injuredArea" id="injury-upper-limb" value="INJURY_UPPER_LIMB" onClick={checkboxHandler} checked={form.injuredArea.indexOf("INJURY_UPPER_LIMB") > -1} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="injury-upper-limb">上肢</label>
                            </div>
                            <div className="form-check form-check-inline ">
                                <input className="form-check-input" type="checkbox" name="injuredArea" id="injury-lower-limb" value="INJURY_LOWER_LIMB" onClick={checkboxHandler} checked={form.injuredArea.indexOf("INJURY_LOWER_LIMB") > -1} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="injury-lower-limb">下肢</label>
                            </div>
                            <div className="form-check mb-2">
                                <input className="form-check-input" type="checkbox" name="injuredArea" id="injury-other" value="INJURY_OTHER" onClick={checkboxHandler} checked={form.injuredArea.indexOf("INJURY_OTHER") > -1} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="injury-other">其他 (請註明)</label>
                            </div>
                            {
                                form.injuredArea.indexOf("INJURY_OTHER") > -1 &&
                                <div className="mb-2">
                                    <AutosizeTextarea className={`form-control ${(error && error['InjuredAreaOtherRemark'] ) ? "is-invalid": ""}`} placeholder="請註明" value={form.injuredAreaOther} name="injuredAreaOther" onChange={textHandler} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                </div>
                            }
                            {
                                form.injuredArea.length > 0 &&
                                <>
                                    <StyledDropzone selectedFiles={setInjuryFiles} />
                                    {
                                        uploadedInjuryFiles.length > 0 &&
                                        <aside>
                                            <h6>已上傳檔案</h6>
                                            <ul>{UploadedFilesComponent(uploadedInjuryFiles)}</ul>
                                        </aside>
                                    }
                                </>
                            }
                        </div>
                    </div>

                    {/* <div className="form-group row mb-4">

                    </div> */}

                    <div className="form-row mb-4">
                        {/* 1.3 服務使用者意外後有否身體不適/受傷*/}
                        <label className={`col-12 col-xl-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>服務使用者意外後有否身體不適/受傷 </label>
                        <div className={`col ${(error && error['UnwellAfterInjured'] ) ? styles.divInvalid: ""}`}>

                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="serviceUserUncomfort" id="service-user-uncomfort-true" value="SERVICE_USER_UNCOMFORT_TRUE" onClick={radioButtonHandler} checked={form.serviceUserUncomfort === "SERVICE_USER_UNCOMFORT_TRUE"} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="service-user-uncomfort-true">有</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="serviceUserUncomfort" id="service-user-uncomfort-false" value="SERVICE_USER_UNCOMFORT_FALSE" onClick={radioButtonHandler} checked={form.serviceUserUncomfort === "SERVICE_USER_UNCOMFORT_FALSE"} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="service-user-uncomfort-false">沒有</label>
                            </div>
                            {
                                form.serviceUserUncomfort === "SERVICE_USER_UNCOMFORT_TRUE" &&
                                <div className={`${(error && error['UnwellAfterInjuredChoices'] ) ? styles.divInvalid: ""}`}>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="checkbox" name="uncomfortable" id="uncomfortable-bleeding" value="UNCOMFORTABLE_BLEEDING" onClick={checkboxHandler} checked={form.uncomfortable.indexOf("UNCOMFORTABLE_BLEEDING") > -1} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                        <label className={`form-check-label ${styles.labelColor}`} htmlFor="uncomfortable-bleeding">流血</label>
                                    </div>
                                    <div className="form-check form-check-inline ">
                                        <input className="form-check-input" type="checkbox" name="uncomfortable" id="uncomfortable-bruise" value="UNCOMFORTABLE_BRUISE" onClick={checkboxHandler} checked={form.uncomfortable.indexOf("UNCOMFORTABLE_BRUISE") > -1} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                        <label className={`form-check-label ${styles.labelColor}`} htmlFor="uncomfortable-bruise">瘀腫</label>
                                    </div>
                                    <div className="form-check form-check-inline ">
                                        <input className="form-check-input" type="checkbox" name="uncomfortable" id="uncomfortable-fracture" value="UNCOMFORTABLE_FRACTURE" onClick={checkboxHandler} checked={form.uncomfortable.indexOf("UNCOMFORTABLE_FRACTURE") > -1} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                        <label className={`form-check-label ${styles.labelColor}`} htmlFor="uncomfortable-fracture">骨折</label>
                                    </div>
                                    <div className="form-check form-check-inline ">
                                        <input className="form-check-input" type="checkbox" name="uncomfortable" id="uncomfortable-dizzy" value="UNCOMFORTABLE_DIZZY" onClick={checkboxHandler} checked={form.uncomfortable.indexOf("UNCOMFORTABLE_DIZZY") > -1} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                        <label className={`form-check-label ${styles.labelColor}`} htmlFor="uncomfortable-dizzy">暈眩</label>
                                    </div>
                                    <div className="form-check form-check-inline ">
                                        <input className="form-check-input" type="checkbox" name="uncomfortable" id="uncomfortable-shock" value="UNCOMFORTABLE_SHOCK" onClick={checkboxHandler} checked={form.uncomfortable.indexOf("UNCOMFORTABLE_SHOCK") > -1} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                        <label className={`form-check-label ${styles.labelColor}`} htmlFor="uncomfortable-shock">休克/失去知覺</label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" name="uncomfortable" id="uncomfortable-other" value="UNCOMFORTABLE_OTHER" onClick={checkboxHandler} checked={form.uncomfortable.indexOf("UNCOMFORTABLE_OTHER") > -1} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                        <label className={`form-check-label ${styles.labelColor}`} htmlFor="uncomfortable-other">其他 (請註明)</label>
                                    </div>
                                    {
                                        form.uncomfortable.indexOf("UNCOMFORTABLE_OTHER") > -1 &&
                                        <div className="">
                                            <AutosizeTextarea className={`form-control ${(error && error['UnwellAfterInjuredOther'] ) ? "is-invalid": ""}`} placeholder="請註明" name="uncomfortableOtherRemark" value={form.uncomfortableOtherRemark} onChange={textHandler} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                        </div>
                                    }
                                    <div className="my-2">
                                        <label className={`form-check-label ${styles.buttonLabel}`} htmlFor="uncomfortable-injury">受傷情況</label>
                                    </div>
                                    <div className="">
                                        <AutosizeTextarea className={`form-control ${(error && error['UnwellAfterInjuredDescription'] ) ? "is-invalid": ""}`} name="uncomfortableDescription" value={form.uncomfortableDescription} onChange={textHandler} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                    </div>
                                </div>
                            }
                        </div>

                        {/* 1.4 服務使用者有否出現不安全的行為*/}
                        <label className={`col-12 col-xl-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>服務使用者有否出現不安全的行為 </label>
                        <div className={`col ${(error && error['UnsafeBehaviors'] ) ? styles.divInvalid: ""}`}>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="behaviorSwitch" id="behavior-switch-true" value="BEHAVIOR_SWITCH_TRUE" onClick={radioButtonHandler} checked={form.behaviorSwitch === "BEHAVIOR_SWITCH_TRUE"} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="behavior-switch-true">有</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="behaviorSwitch" id="behavior-switch-false" value="BEHAVIOR_SWITCH_FALSE" onClick={radioButtonHandler} checked={form.behaviorSwitch === "BEHAVIOR_SWITCH_FALSE"} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="behavior-switch-false">沒有</label>
                            </div>
                            {
                                form.behaviorSwitch === "BEHAVIOR_SWITCH_TRUE" &&
                                <div className={`${(error && error['UnsafeBehaviorsChoices'] ) ? styles.divInvalid: ""}`}>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="checkbox" name="behavior" id="behavior-others" value="BEHAVIOR_OTHERS" onClick={checkboxHandler} checked={form.behavior.indexOf("BEHAVIOR_OTHERS") > -1} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                        <label className={`form-check-label ${styles.labelColor}`} htmlFor="behavior-others">傷害他人的動作</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="checkbox" name="behavior" id="behavior-self" value="BEHAVIOR_SELF" onClick={checkboxHandler} checked={form.behavior.indexOf("BEHAVIOR_SELF") > -1} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                        <label className={`form-check-label ${styles.labelColor}`} htmlFor="behavior-self">傷害自已的動作</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="checkbox" name="behavior" id="behavior-getoff" value="BEHAVIOR_GETOFF" onClick={checkboxHandler} checked={form.behavior.indexOf("BEHAVIOR_GETOFF") > -1} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                        <label className={`form-check-label ${styles.labelColor}`} htmlFor="behavior-getoff">除去身上的醫療器材</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="checkbox" name="behavior" id="behavior-reject" value="BEHAVIOR_REJECT" onClick={checkboxHandler} checked={form.behavior.indexOf("BEHAVIOR_REJECT") > -1} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                        <label className={`form-check-label ${styles.labelColor}`} htmlFor="behavior-reject">拒絕使用輔助器材</label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" name="behavior" id="behavior-other" value="BEHAVIOR_OTHER" onClick={checkboxHandler} checked={form.behavior.indexOf("BEHAVIOR_OTHER") > -1} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                        <label className={`form-check-label ${styles.labelColor}`} htmlFor="behavior-other">其他 (請註明)</label>
                                    </div>
                                    {
                                        form.behavior.indexOf("BEHAVIOR_OTHER") > -1 &&
                                        <div className="">
                                            <AutosizeTextarea className={`form-control ${(error && error['UnsafeBehaviorsOther'] ) ? "is-invalid": ""}`} placeholder="請註明" name="behaviorOtherRemark" value={form.behaviorOtherRemark} onChange={textHandler} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                        </div>
                                    }
                                </div>
                            }
                        </div>
                    </div>

                    {/* <div className="form-group row mb-4">

                    </div> */}

                    <div className="form-row mb-4">
                        {/* 1.5 相片及CCTV紀錄*/}
                        <label className={`col-12 col-xl-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>相片及CCTV紀錄</label>
                        <div className={`col ${(error && error['PhotoRecord'] ) ? styles.divInvalid: ""}`}>
                            <div className={styles.buttonLabel}>相片</div>
                            <div className="pl-4">
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="photo" id="photo-true" value="PHOTO_TRUE" onClick={radioButtonHandler} checked={form.photo === "PHOTO_TRUE"} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                    <label className={`form-check-label ${styles.labelColor}`} htmlFor="photo-true">有 (上載照片)</label>
                                </div>
                                {
                                    form.photo === "PHOTO_TRUE" &&
                                    <>
                                        <StyledDropzone selectedFiles={setSelectedCctvPhoto} />
                                        {
                                            uploadedInjuryFiles.length > 0 &&
                                            <aside>
                                                <h6>已上存檔案</h6>
                                                <ul>{UploadedFilesComponent(uploadedCctvPhoto)}</ul>
                                            </aside>
                                        }
                                        {/* {error.photo && <div className="text-danger">{error.photo}</div>} */}
                                    </>
                                }
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="photo" id="photo-false" value="PHOTO_FALSE" onClick={radioButtonHandler} checked={form.photo === "PHOTO_FALSE"} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                    <label className={`form-check-label ${styles.labelColor}`} htmlFor="photo-false">未能提供</label>
                                </div>
                            </div>

                            <div className={`${styles.buttonLabel} mt-3`} >CCTV紀錄</div>
                            <div className={`pl-4  ${(error && error['CctvRecord'] ) ? styles.divInvalid: ""}`}>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="cctv" id="cctv-true" value="CCTV_TRUE" onClick={radioButtonHandler} checked={form.cctv === "CCTV_TRUE"} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                    <label className={`form-check-label ${styles.labelColor}`} htmlFor="cctv-true">有 (註: 三個工作天內交總辦事處)</label>
                                </div>
                                {
                                    form.cctv === "CCTV_TRUE" &&
                                    <div className="form-row no-gutters">
                                        <label className={`col-form-label ${styles.fieldTitle} mr-0 mr-md-2`}>收到日期</label>
                                        <div className="col">
                                            <DatePicker className="form-control" dateFormat="yyyy/MM/dd" selected={cctvRecordReceiveDate} onChange={setCctvRecordReceiveDate} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                        </div>
                                    </div>
                                }
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="cctv" id="cctv-false" value="CCTV_FALSE" onClick={radioButtonHandler} checked={form.cctv === "CCTV_FALSE"} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                    <label className={`form-check-label ${styles.labelColor}`} htmlFor="cctv-false">未能提供</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mb-5">
                    <div className="form-row mb-3">
                        <div className="col-12 font-weight-bold">
                            <h5>初步觀察的意外成因</h5>
                        </div>
                    </div>
                    <div className="form-row mb-4">
                        {/*  (2.1(a))  環境因素 */}
                        <label className={`col-12 col-xl-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>環境因素</label>
                        <div className={`col ${(error && error['ObserveEnvironmentFactor'] ) ? styles.divInvalid: ""}`}>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="envFactor" id="ENV-SLIPPERY-GROUND" value="ENV_SLIPPERY_GROUND" onClick={checkboxHandler} checked={form.envFactor.indexOf("ENV_SLIPPERY_GROUND") > -1} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="ENV-SLIPPERY-GROUND">地面濕滑</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="envFactor" id="ENV-UNEVEN-GROUND" value="ENV_UNEVEN_GROUND" onClick={checkboxHandler} checked={form.envFactor.indexOf("ENV_UNEVEN_GROUND") > -1} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="ENV-UNEVEN-GROUND">地面不平</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="envFactor" id="ENV-OBSTACLE-ITEMS" value="ENV_OBSTACLE_ITEMS" onClick={checkboxHandler} checked={form.envFactor.indexOf("ENV_OBSTACLE_ITEMS") > -1} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="ENV-OBSTACLE-ITEMS">障礙物品</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="envFactor" id="ENV-INSUFFICIENT-LIGHT" value="ENV_INSUFFICIENT_LIGHT" onClick={checkboxHandler} checked={form.envFactor.indexOf("ENV_INSUFFICIENT_LIGHT") > -1} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="ENV-INSUFFICIENT-LIGHT">光線不足</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="envFactor" id="ENV-NOT-ENOUGH-SPACE" value="ENV_NOT_ENOUGH_SPACE" onClick={checkboxHandler} checked={form.envFactor.indexOf("ENV_NOT_ENOUGH_SPACE") > -1} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="ENV-NOT-ENOUGH-SPACE">空間不足</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="envFactor" id="ENV-ACOUSTIC-STIMULATION" value="ENV_ACOUSTIC_STIMULATION" onClick={checkboxHandler} checked={form.envFactor.indexOf("ENV_ACOUSTIC_STIMULATION") > -1} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="ENV-ACOUSTIC-STIMULATION">聲響刺激</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="envFactor" id="ENV-COLLIDED-BY-OTHERS" value="ENV_COLLIDED_BY_OTHERS" onClick={checkboxHandler} checked={form.envFactor.indexOf("ENV_COLLIDED_BY_OTHERS") > -1} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="ENV-COLLIDED-BY-OTHERS">被別人碰撞</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="envFactor" id="ENV-HURT-BY-OTHERS" value="ENV_HURT_BY_OTHERS" onClick={checkboxHandler} checked={form.envFactor.indexOf("ENV_HURT_BY_OTHERS") > -1} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="ENV-HURT-BY-OTHERS">被別人傷害</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="envFactor" id="ENV-IMPROPER-USE-OF-ASSISTIVE-EQUIPMENT" value="ENV_IMPROPER_USE_OF_ASSISTIVE_EQUIPMENT" onClick={checkboxHandler} checked={form.envFactor.indexOf("ENV_IMPROPER_USE_OF_ASSISTIVE_EQUIPMENT") > -1} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="ENV-IMPROPER-USE-OF-ASSISTIVE-EQUIPMENT">輔助器材使用不當 (如輪椅／便椅未上鎖)</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" name="envFactor" id="ENV-OTHER" value="ENV_OTHER" onClick={checkboxHandler} checked={form.envFactor.indexOf("ENV_OTHER") > -1} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="ENV-OTHER">其他 (請註明)</label>
                            </div>
                            {
                                form.envFactor.indexOf("ENV_OTHER") > -1 &&
                                <div className="">
                                    <AutosizeTextarea className={`form-control ${(error && error['ObserveEnvironmentFactorOther'] ) ? "is-invalid": ""}`} placeholder="請註明" value={form.enviromentalFactorOtherRemark} name={"enviromentalFactorOtherRemark"} onChange={textHandler} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                </div>
                            }
                        </div>
                    </div>

                    <div className="form-row mb-4">
                        {/* (2.1(b)) 個人因素 */}
                        <label className={`col-12 col-xl-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>個人因素</label>
                        <div className={`col ${(error && error['ObservePersonalFactor'] ) ? styles.divInvalid: ""}`}>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="personalFactor" id="PERSONAL-EMOTIONAL-INSTABILITY" value="PERSONAL_EMOTIONAL_INSTABILITY" onClick={checkboxHandler} checked={form.personalFactor.indexOf("PERSONAL_EMOTIONAL_INSTABILITY") > -1} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="PERSONAL-EMOTIONAL-INSTABILITY">情緒不穩</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="personalFactor" id="PERSONAL-HEARTBROKEN" value="PERSONAL_HEARTBROKEN" onClick={checkboxHandler} checked={form.personalFactor.indexOf("PERSONAL_HEARTBROKEN") > -1} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="PERSONAL-HEARTBROKEN">心急致傷</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="personalFactor" id="PERSONAL-CHOKING" value="PERSONAL_CHOKING" onClick={checkboxHandler} checked={form.personalFactor.indexOf("PERSONAL_CHOKING") > -1} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="PERSONAL-CHOKING">進食時哽塞</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="personalFactor" id="PERSONAL-UNSTEADY-WALKING" value="PERSONAL_UNSTEADY_WALKING" onClick={checkboxHandler} checked={form.personalFactor.indexOf("PERSONAL_UNSTEADY_WALKING") > -1} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="PERSONAL-UNSTEADY-WALKING">步履不穩</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="personalFactor" id="PERSONAL-TWITCH" value="PERSONAL_TWITCH" onClick={checkboxHandler} checked={form.personalFactor.indexOf("PERSONAL_TWITCH") > -1} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="PERSONAL-TWITCH">抽搐</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" name="personalFactor" id="PERSONAL-OTHER" value="PERSONAL_OTHER" onClick={checkboxHandler} checked={form.personalFactor.indexOf("PERSONAL_OTHER") > -1} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="PERSONAL-OTHER">其他</label>
                            </div>
                            {
                                form.personalFactor.indexOf("PERSONAL_OTHER") > -1 &&
                                <div className="">
                                    <AutosizeTextarea className={`form-control ${(error && error['ObservePersonalFactorOther'] ) ? "is-invalid": ""}`} placeholder="請註明" name="personalFactorOtherRemark" value={form.personalFactorOtherRemark} onChange={textHandler} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                </div>
                            }
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        {/* (2.2) 事發過程 */}
                        <label className={`col-12 col-xl-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>事發過程</label>
                        <div className="col">
                            <label htmlFor="procedure" className={styles.labelColor} style={{ fontWeight: 500, fontSize: 15 }}>請註明事發地點附近之員工當時執行的職務</label>
                            <AutosizeTextarea className={`form-control ${(error && error['AccidentDetail'] ) ? "is-invalid": ""}`} id="procedure" name="accidentDetail" value={form.accidentDetail} onChange={textHandler} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                            {/* {error.accidentDetail && <div className="text-danger">{error.accidentDetail}</div>} */}
                        </div>
                    </div>
                </section>

                <section className="mb-5">
                    <div className="form-row mb-3">
                        <div className="col-12 font-weight-bold">
                            <h5>意外事件後之治療處理</h5>
                        </div>
                    </div>
                    <div className="form-row mb-4">
                        {/* 3.1 服務單位即時治療/處理 */}
                        <label className={`col-12 col-xl-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>服務單位即時治療/處理</label>
                        <div className="col">
                            <AutosizeTextarea className={`form-control ${(error && error['TreatmentAfterAccident'] ) ? "is-invalid": ""}`} id="procedure" name="treatmentAfterAccident" value={form.treatmentAfterAccident} onChange={textHandler} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                            {/* {error.treatmentAfterAccident && <div className="text-danger">{error.treatmentAfterAccident}</div>} */}
                        </div>
                    </div>

                    <div className="form-row mb-4">
                        {/* 3.2 就診安排*/}
                        <label className={`col-12 col-xl-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>就診安排</label>
                        <div className={`col ${(error && error['MedicalArrangement'] ) ? styles.divInvalid: ""}`}>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="arrangement" id="ARRANGEMENT_DOCTOR_VISIT" value="ARRANGEMENT_DOCTOR_VISIT" onClick={radioButtonHandler} checked={form.arrangement === "ARRANGEMENT_DOCTOR_VISIT"} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="ARRANGEMENT_DOCTOR_VISIT">醫生到診</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="arrangement" id="ARRANGEMENT_OUTPATIENT" value="ARRANGEMENT_OUTPATIENT" onClick={radioButtonHandler} checked={form.arrangement === "ARRANGEMENT_OUTPATIENT"} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="ARRANGEMENT_OUTPATIENT">門診</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="arrangement" id="ARRANGEMENT_EMERGENCY_DEPARTMENT" value="ARRANGEMENT_EMERGENCY_DEPARTMENT" onClick={radioButtonHandler} checked={form.arrangement === "ARRANGEMENT_EMERGENCY_DEPARTMENT"} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="ARRANGEMENT_EMERGENCY_DEPARTMENT">急症室</label>
                            </div>
                            {
                                form.arrangement === "ARRANGEMENT_EMERGENCY_DEPARTMENT" &&
                                <>
                                    <div className="mt-2" style={{ fontSize: 15 }}>
                                        <label className="form-label">醫院名稱</label>
                                        <input type="text" className={`form-control ${(error && error['MedicalArrangementHospital'] ) ? "is-invalid": ""}`} name="medicalArrangementHospital" value={form.medicalArrangementHospital} onChange={textHandler} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                    </div>
                                    <div className="mt-1" style={{ fontSize: 15 }}>
                                        <label className="form-label">到達時間</label>
                                        <DatePicker
                                            className={`form-control ${(error && error['MedicalArrangementDate'] ) ? "is-invalid": ""}`}
                                            selected={medicalArrangementDate}
                                            onChange={setMedicalArrangementDate}
                                            showTimeSelect
                                            timeFormat="p"
                                            timeIntervals={15}
                                            dateFormat="yyyy/MM/dd h:mm aa"
                                            readOnly={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)}
                                        />
                                    </div>
                                    <div className="mt-1" style={{ fontSize: 15 }}>
                                        <label className="form-label">提供予服務使用者的治療</label>
                                        <AutosizeTextarea className={`form-control ${(error && error['MedicalArrangementTreatment'] ) ? "is-invalid": ""}`} name="medicalArrangementTreatment" value={form.medicalArrangementTreatment} onChange={textHandler} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                    </div>
                                </>
                            }
                        </div>
                    </div>

                    <div className="form-row mb-4">
                        {/* 3.3 是否在醫院留醫 */}
                        <label className={`col-12 col-xl-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>是否在醫院留醫</label>
                        <div className={`col ${(error && error['StayInHospital'] ) ? styles.divInvalid: ""}`}>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="isStayInHospital" id="is-stay-in-hospital-true" value="IS_STAY_IN_HOSPITAL_TRUE" onClick={radioButtonHandler} checked={form.isStayInHospital === "IS_STAY_IN_HOSPITAL_TRUE"} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="is-stay-in-hospital-true">是</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="isStayInHospital" id="is-stay-in-hospital-false" value="IS_STAY_IN_HOSPITAL_FALSE" onClick={radioButtonHandler} checked={form.isStayInHospital === "IS_STAY_IN_HOSPITAL_FALSE"} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="is-stay-in-hospital-false">否</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="isStayInHospital" id="is-stay-in-hospital-not-applicable" value="IS_STAY_IN_HOSPITAL_NOT_APPLICABLE" onClick={radioButtonHandler} checked={form.isStayInHospital === "IS_STAY_IN_HOSPITAL_NOT_APPLICABLE"} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="is-stay-in-hospital-not-applicable">不適用</label>
                            </div>
                            {
                                form.isStayInHospital === "IS_STAY_IN_HOSPITAL_TRUE" &&
                                <div className="mt-2">
                                    <label className="form-label">醫院名稱</label>
                                    <input type="text" className={`form-control ${(error && error['StayInHospitalName'] ) ? "is-invalid": ""}`} name="stayInHospitalName" value={form.stayInHospitalName} onChange={textHandler} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                </div>
                            }
                        </div>
                    </div>

                    <div className="form-row mb-4">
                        {/* 3.4 報警處理 */}
                        <label className={`col-12 col-xl-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>報警處理</label>
                        <div className={`col ${(error && error['CalledPolice'] ) ? styles.divInvalid: ""}`}>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="police" id="police-true" value="POLICE_TRUE" onClick={radioButtonHandler} checked={form.police === "POLICE_TRUE"} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="police-true">需要</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="police" id="police-false" value="POLICE_FALSE" onClick={radioButtonHandler} checked={form.police === "POLICE_FALSE"} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="police-false">不需要</label>
                            </div>
                            {
                                form.police === "POLICE_TRUE" &&
                                <>
                                    <div>
                                        <label className="form-label">日期和時間</label>
                                        {/* <input type="datetime-local" className="form-control" /> */}
                                        <DatePicker
                                            className={`form-control ${(error && error['CalledPoliceDate'] ) ? "is-invalid": ""}`}
                                            selected={policeDate}
                                            onChange={setPoliceDate}
                                            showTimeSelect
                                            timeFormat="p"
                                            timeIntervals={15}
                                            dateFormat="yyyy/MM/dd h:mm aa"
                                            readOnly={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)}
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">報案編號</label>
                                        <input type="text" className={`form-control ${(error && error['CalledPoliceReportNumber'] ) ? "is-invalid": ""}`} name="policeReportNumber" value={form.policeReportNumber} onChange={textHandler} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                    </div>
                                    <div>
                                        <label className="form-label">警署</label>
                                        <input type="text" className={`form-control ${(error && error['CalledPoliceStation'] ) ? "is-invalid": ""}`} name="policeStation" value={form.policeStation} onChange={textHandler} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                    </div>
                                </>
                            }
                        </div>
                    </div>

                    <div className="form-row mb-4">
                        {/* 3.5 意外後中心即時應變措施 */}
                        <label className={`col-12 col-xl-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>意外後中心即時應變措施</label>
                        <div className={`col ${(error && error['ContingencyMeasure'] ) ? styles.divInvalid: ""}`}>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="contingencyMeasure" id="contingency-measure-true" value="CONTINGENCY_MEASURE_TRUE" onClick={radioButtonHandler} checked={form.contingencyMeasure === "CONTINGENCY_MEASURE_TRUE"} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="contingency-measure-true">有</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="contingencyMeasure" id="contingency-measure-false" value="CONTINGENCY_MEASURE_FALSE" onClick={radioButtonHandler} checked={form.contingencyMeasure === "CONTINGENCY_MEASURE_FALSE"} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="contingency-measure-false">沒有</label>
                            </div>
                            {
                                form.contingencyMeasure === "CONTINGENCY_MEASURE_TRUE" &&
                                <div>
                                    <AutosizeTextarea className={`form-control ${(error && error['ContingencyMeasureRemark'] ) ? "is-invalid": ""}`} name="contingencyMeasureRemark" value={form.contingencyMeasureRemark} placeholder="請註明" onChange={textHandler} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                                </div>
                            }
                        </div>
                    </div>
                </section>

                <section className="mb-5">
                    <div className="form-row mb-3">
                        <div className="col-12 font-weight-bold">
                            <h5>家屬聯絡</h5>
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/* 4.1 通知家屬日期及時間 */}
                        <label className={`col-12 col-xl-2 col-form-label ${styles.fieldTitle} pt-xl-0 pr-xl-0`}>通知家屬日期和時間</label>
                        <div className="col-12 col-xl-4">
                            <DatePicker
                                className={`form-control ${(error && error['ContactFamilyDate'] ) ? "is-invalid": ""}`}
                                selected={contactFamilyDate}
                                onChange={setContactFamilyDate}
                                onChangeRaw={(event) => dateFieldRawHandler(event, setContactFamilyDate)}
                                maxDate={new Date()}
                                showTimeSelect
                                timeFormat="p"
                                timeIntervals={15}
                                dateFormat="yyyy/MM/dd h:mm aa"
                                readOnly={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)}
                            />
                        </div>
                        {/* 與服務使用者關係 */}
                        <label className={`col-12 col-xl-2 col-form-label ${styles.fieldTitle} ${styles.textOverflowInline} pt-xl-0`}>與服務使用者關係</label>
                        <div className="col-12 col-xl-4">
                            <input type="text" className={`form-control ${(error && error['ContactFamilyRelationship'] ) ? "is-invalid": ""}`} name="contactFamilyRelationship" value={form.contactFamilyRelationship} onChange={textHandler} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                            {/* {error.contactFamilyRelationship && <div className="text-danger">{error.contactFamilyRelationship}</div>} */}
                        </div>
                    </div>

                    <div className="form-row mb-4">
                        {/* (4.2)  家屬姓名 */}
                        <label className={`col-12 col-xl-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>家屬姓名</label>
                        <div className="col-12 col-xl-4">
                            <input type="text" className={`form-control ${(error && error['ContactFamilyName'] ) ? "is-invalid": ""}`} name="contactFamilyName" value={form.contactFamilyName} onChange={textHandler} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                            {/* {error.contactFamilyName && <div className="text-danger">{error.contactFamilyName}</div>} */}
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        {/*(4.3) 負責通知家屬的職員姓名 */}
                        <label className={`col-12 col-xl-2 col-form-label ${styles.fieldTitle} pr-xl-0 pt-xl-0`}>負責通知家屬的職員姓名</label>
                        <div className="col-12 col-xl-4">
                            {
                                formId && (!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)) ?
                                    <input type="text" className="form-control" value={(contactStaff && contactStaff.displayName) || ""} disabled={true} />
                                    :
                                    <PeoplePicker
                                        context={context}
                                        titleText=""
                                        showtooltip={false}
                                        personSelectionLimit={1}
                                        ensureUser={true}
                                        isRequired={false}
                                        selectedItems={setContactStaff}
                                        showHiddenInUI={false}
                                        defaultSelectedUsers={contactStaff && [contactStaff.mail]}
                                    />
                            }
                        </div>
                        {/* 職位 */}
                        <label className={`col-12 col-xl-1 col-form-label ${styles.fieldTitle} pt-xl-0`}>職位</label>
                        <div className="col-12 col-xl-5">
                            <input type="text" className="form-control" onChange={textHandler} value={(contactStaff && contactStaff.jobTitle) || ""} disabled={true} />
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        {/* (4.4) 服務使用者經治後情況 */}
                        <label className={`col-12 col-xl-2 col-form-label ${styles.fieldTitle} pt-xl-0 pr-xl-0`}>服務使用者經診治後情況</label>
                        <div className="col">
                            <AutosizeTextarea className={`form-control ${(error && error['AfterTreatmentDescription'] ) ? "is-invalid": ""}`} name="afterTreatmentDescription" value={form.afterTreatmentDescription} onChange={textHandler}
                                disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                            {/* {error.afterTreatmentDescription && <div className="text-danger">{error.afterTreatmentDescription}</div>} */}
                        </div>
                    </div>
                </section>

                <hr className="my-4" />

                <section className="mb-5">
                    <div className="form-row mb-2">
                        {/* 填報人姓名 */}
                        <label className={`col-12 col-xl-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>填報人姓名</label>
                        <div className="col-12 col-xl-4">
                            {
                                formId && (!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)) ?
                                    <input type="text" className="form-control" value={(reporter && reporter.displayName) || ""} disabled={true} />
                                    :
                                    // <PeoplePicker
                                    //     context={context}
                                    //     titleText=""
                                    //     showtooltip={false}
                                    //     personSelectionLimit={1}
                                    //     ensureUser={true}
                                    //     isRequired={false}
                                    //     selectedItems={setReporter}
                                    //     showHiddenInUI={false}
                                    //     defaultSelectedUsers={
                                    //         reporter && [reporter.mail]
                                    //     } />
                                    <input className="form-control" value={reporter && reporter.displayName || ""} disabled />
                            }
                        </div>
                        <label className={`col-12 col-xl-1 col-form-label ${styles.fieldTitle} pt-xl-0`}>日期</label>
                        <div className="col-12 col-xl-5">
                            <DatePicker className="form-control" dateFormat="yyyy/MM/dd" selected={reportedDate} onChange={(date) => setReportedDate(date)} readOnly />
                        </div>
                    </div>
                    {/* 職級 */}
                    <div className="form-row mb-2">
                        <label className={`col-12 col-xl-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>職級</label>
                        <div className="col-12 col-xl-4">
                            <input type="text" className="form-control" value={reporter && (reporter.jobTitle || "")} disabled={true} />
                        </div>
                        <label className={`col-12 col-xl-1 col-form-label ${styles.fieldTitle} pt-xl-0`}>服務單位</label>
                        <div className="col-12 col-xl-5">
                            <input type="text" className="form-control" value={serviceUnit || ""} disabled />
                        </div>
                    </div>
                </section>

                <hr className="my-4" />

                <section className="mb-5">
                    <div className="form-row mb-2">
                        <div className="col-12 font-weight-bold mb-2">
                            <span className={styles.fieldTitle}>[此欄由高級服務經理/服務經理填寫]</span>
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/* 高級服務經理/服務經理姓名 */}
                        <label className={`col-12 col-xl-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>高級服務經理/<span className="d-sm-inline d-xl-block">服務經理姓名</span></label>
                        <div className={`col-12 col-xl-4 ${(error && error['SMId'] ) ? styles.divInvalid: ""}`}>
                            {/* <PeoplePicker
                                context={context}
                                titleText=""
                                showtooltip={false}
                                personSelectionLimit={1}
                                ensureUser={true}
                                isRequired={false}
                                selectedItems={setServiceManger}
                                showHiddenInUI={false}
                                defaultSelectedUsers={serviceManger && [serviceManger.mail]}
                            /> */}
                            {/* <select className={`custom-select  ${error.serviceManager ? "is-invalid" : ""}`} value={serviceManagerEmail} onChange={(event) => setServiceManagerEmail(event.target.value)} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)}>
                                <option>請選擇服務經理</option>
                                {
                                    smList.map((sm) => {
                                        return <option value={sm.mail}>{sm.displayName}</option>
                                    })
                                }
                            </select> */}

                            {
                                formInitial(currentUserRole, formStatus) && Array.isArray(departments) && departments.length > 0 && departments[0].override === true ?
                                    <select className={`custom-select`} value={smInfo && smInfo.Email} onChange={(event => setSMEmail(event.target.value))}
                                        disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)}>
                                        <option value={departments[0].hr_deptmgr}>{departments[0].hr_deptmgr}</option>
                                        <option value={departments[0].new_deptmgr}>{departments[0].new_deptmgr}</option>
                                    </select>
                                    :
                                    <input type="text" className="form-control" value={`${smInfo && smInfo.Lastname || ""} ${smInfo && smInfo.Firstname || ""}`.trim() || `${smInfo && smInfo.Name || ""}`} disabled={true} />
                            }
                        </div>
                        <label className={`col-12 col-xl-1 col-form-label ${styles.fieldTitle} pt-xl-0`}>日期</label>
                        <div className="col-12 col-xl-5">
                            <DatePicker className="form-control" dateFormat="yyyy/MM/dd" selected={smDate} onChange={setSmDate} readOnly />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <label className={`col-12 col-xl-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>高級服務經理/<span className="d-sm-inline d-xl-block">服務經理評語</span></label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" value={smComment} onChange={(event) => setSmComment(event.target.value)}
                                disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitBySm(CURRENT_USER.email, spSmInfo ? spSmInfo.Email : "", formStatus)} />
                        </div>
                    </div>
                    {
                        pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) &&
                        <div className="form-row my-2">
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
                            <span className={styles.fieldTitle}>[此欄由服務總監填寫]</span>
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/* SD */}
                        <label className={`col-12 col-xl-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>服務總監姓名</label>
                        <div className={`col-12 col-xl-4 ${(error && error['SDId'] ) ? styles.divInvalid: ""}`}>
                            {/* <PeoplePicker
                                context={context}
                                showtooltip={false}
                                personSelectionLimit={1}
                                ensureUser={true}
                                isRequired={false}
                                selectedItems={setServiceDirector}
                                showHiddenInUI={false}
                                defaultSelectedUsers={serviceDirector && [serviceDirector.mail]}
                            /> */}
                            {/* <select className={`custom-select  ${error.serviceDirector ? "is-invalid" : ""}`} value={serviceDirectorEmail} onChange={(event) => setServiceDirectorEmail(event.target.value)} disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)}>
                                <option>請選擇服務總監</option>
                                {
                                    sdList.map((sd) => {
                                        return <option value={sd.mail}>{sd.displayName}</option>
                                    })
                                }
                            </select> */}
                            {
                                formInitial(currentUserRole, formStatus) && Array.isArray(departments) && departments.length > 0 && departments[0].override === true ?
                                    <select className={`custom-select`} value={sdInfo && sdInfo.Email} onChange={(event => setSDEmail(event.target.value))}
                                        disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)}
                                    >
                                        <option value={departments[0].hr_sd}>{departments[0].hr_sd}</option>
                                        <option value={departments[0].new_sd}>{departments[0].new_sd}</option>
                                    </select>
                                    :
                                    <input type="text" className="form-control" value={`${sdInfo && sdInfo.Lastname || ""} ${sdInfo && sdInfo.Firstname || ""} `.trim() || `${sdInfo && sdInfo.Name || ""}`} disabled={true} />
                            }
                        </div>
                        <label className={`col-12 col-xl-1 col-form-label ${styles.fieldTitle} pt-xl-0`}>日期</label>
                        <div className="col-12 col-xl-5">
                            <DatePicker className="form-control" dateFormat="yyyy/MM/dd" selected={sdDate} onChange={setSdDate} readOnly />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <label className={`col-12 col-xl-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>服務總監評語</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" value={sdComment} onChange={(event) => setSdComment(event.target.value)} disabled={!pendingSptApproveForSD(context,currentUserRole, formStatus, formStage, sptDate,sdInfo)} />
                        </div>
                    </div>
                    {/* <div className="form-group row mb-2">
                        <div className="col-12">
                            <button className="btn btn-primary">儲存評語</button>
                        </div>
                    </div> */}
                </section>

                <hr className="my-4" />

                <section className="mb-5">
                    <div className="form-row mb-2">
                        <div className="col-12 font-weight-bold mb-2">
                            <span className={styles.fieldTitle}>[此欄由高級物理治療師填寫]</span>
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        {/* 高級物理治療師姓名 */}
                        <label className={`col-12 col-xl-2 col-form-label ${styles.fieldTitle} pt-xl-0 pr-xl-0`}>高級物理治療師姓名</label>
                        <div className="col-12 col-xl-4">
                            {/* <PeoplePicker
                                context={context}
                                titleText=""
                                showtooltip={false}
                                personSelectionLimit={1}
                                ensureUser={true}
                                isRequired={false}
                                selectedItems={setSPhysicalTherapy}
                                showHiddenInUI={false}
                                defaultSelectedUsers={sPhysicalTherapy && [sPhysicalTherapy.mail]}
                            /> */}
                            <select className={`custom-select  ${(error && error['SPTId'] ) ? "is-invalid": ""}`} value={sPhysicalTherapyEmail} onChange={(event) => setSPhysicalTherapyEmail(event.target.value)}
                                disabled={!pendingSmApprove(context, currentUserRole, formStatus, formStage, smInfo) && !formInitial(currentUserRole, formStatus) && !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)}>
                                    <option value={""} ></option>
                                {
                                    sptList.map((spt) => {
                                        console.log('spt mail :'+ spt.Email + ', ' + (spt.Email == sPhysicalTherapyEmail));
                                        return <option value={spt.Email} selected={spt.Email == sPhysicalTherapyEmail}>{spt.Name}</option>
                                    })
                                }
                            </select>
                        </div>
                        {/* 日期 */}
                        <label className={`col-12 col-xl-1 col-form-label ${styles.fieldTitle} pt-xl-0`}>日期</label>
                        <div className="col-12 col-xl-5">
                            <DatePicker className="form-control" dateFormat="yyyy/MM/dd" selected={sptDate} onChange={setSptDate} readOnly />
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        {/* 評語 */}
                        <label className={`col-12 col-xl-2 col-form-label ${styles.fieldTitle} pt-xl-0 pr-xl-0`}>高級物理治療師評語</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" value={sptComment} onChange={(event) => setSptComment(event.target.value)} disabled={!pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)} />
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        {/* 「意外報告 (二)」交由 */}
                        <label className={`col-4 col-lg-3 col-xl-2 col-form-label ${styles.fieldTitle} pt-xl-0`} >｢意外報告 (二)｣交由</label>
                        <div className="col-6 col-xl-4">
                            {
                                !pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail) ?
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
                                        disabled={!pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail)}
                                    />
                            }
                        </div>
                        <label className={`col col-xl-2 col-form-label ${styles.fieldTitle} px-0 pt-xl-0`}>填寫</label>
                    </div>

                    {
                        pendingSptApproveForSPT(context, currentUserRole, formStatus, formStage, sPhysicalTherapyEmail) &&
                        <div className="form-group row my-2">
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
                {
                    <section className="py-3">
                        <div className="d-flex justify-content-center" style={{ gap: 10 }}>
                            {
                                (
                                    formInitial(currentUserRole, formStatus) ||
                                    pendingSptApproveForSD(context,currentUserRole, formStatus, formStage, sptDate,sdInfo) ||
                                    currentUserRole === Role.ADMIN)
                                &&
                                <button className="btn btn-warning" onClick={submitHandler}>提交</button>
                            }
                            {
                                formInitial(currentUserRole, formStatus) && formStatus !== "SM_VOID" &&
                                <button className="btn btn-success" onClick={draftHandler}>草稿</button>
                            }
                            <button className="btn btn-secondary" onClick={() => cancelHandler()}>取消</button>
                        </div>
                    </section>
                }

            </div>
        </>
    )
}
