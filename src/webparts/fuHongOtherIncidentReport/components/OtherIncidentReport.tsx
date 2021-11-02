import * as React from 'react'
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { WebPartContext } from '@microsoft/sp-webpart-base';
import Header from "../../../components/Header/Header";
import AutosizeTextarea from "../../../components/AutosizeTextarea/AutosizeTextarea";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import useServiceUnit from '../../../hooks/useServiceUnits';
import { IOtherIncidentReportProps, IOtherIncidentReportStates } from './IFuHongOtherIncidentReport';
import { createOtherIncidentReport } from '../../../api/PostFuHongList';
import useUserInfoAD from '../../../hooks/useUserInfoAD';
import { IUser } from '../../../interface/IUser';

export default function OtherIncidentReport({ context, styles, formSubmittedHandler }: IOtherIncidentReportProps) {
    const [form, setForm] = useState<IOtherIncidentReportStates>({
        insuranceCaseNo: "",
        incidentLocation: "",
        mediaReports: undefined,
        mediaReportsDescription: "",
        incidentDescription: "",
        guardian: undefined,
        police: undefined,
        policeDescription: "",
        medicalArrangement: undefined,
        carePlan: undefined,
        needResponse: undefined,
        carePlanNoDescription: "",
        carePlanYesDescription: "",
        followUpPlan: "",
        guardianDescription: "",
        guardianRelationship: "",
        guardianStaff: "",
        immediateFollowUp: "",
        medicalArrangmentDetail: "",
        needResponseDetail: "",
        policeReportNumber: "",
        serviceUserAgeOne: 0,
        serviceUserAgeThree: 0,
        serviceUserAgeTwo: 0,
        serviceUserGenderOne: "",
        serviceUserGenderThree: "",
        serviceUserGenderTwo: "",
        staffGenderOne: "",
        staffGenderThree: "",
        staffGenderTwo: "",
        staffPositionOne: "",
        staffPositionThree: "",
        staffPositionTwo: ""
    });

    const [incidentTime, setIncidentTime] = useState(new Date());
    const [policeDatetime, setPoliceDatetime] = useState(new Date());
    const [guardianDatetime, setGuardianDatetime] = useState(new Date());
    //IncidentTime
    const [serviceUnitList, serviceUnit, setServiceUnit] = useServiceUnit();
    const [reporter, setReporter, reporterPickerInfo] = useUserInfoAD(); // 填報人姓名

    const [date, setDate] = useState(new Date());
    const radioButtonHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setForm({ ...form, [name]: value });
    }

    const CURRENT_USER: IUser = {
        email: context.pageContext.legacyPageContext.userEmail,
        name: context.pageContext.legacyPageContext.userDisplayName,
        id: context.pageContext.legacyPageContext.userId,
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

    const dataFactory = () => {
        let body = {};
        let error = {};

        //服務單位
        if (serviceUnit) {
            body["ServiceUnit"] = serviceUnit;
        } else {
            error["ServiceUnit"] = true;
        }

        //事故發生日期和時間
        body["IncidentTime"] = incidentTime.toISOString();

        //事故發生地點
        if (form.incidentLocation) {
            body["IncidentLocation"] = form.incidentLocation;
        } else {
            error["IncidentLocation"] = true;
        }

        //事故被傳媒報導
        body["MediaReports"] = form.mediaReports;
        if (form.mediaReports) {
            if (form.mediaReportsDescription) {
                body["MediaReportsDescription"] = form.mediaReportsDescription;
            } else {
                error["MediaReportsDescription"] = true;
            }
        } else if (form.mediaReports === undefined) {
            error["MediaReports"] = true;
        }

        //(a) 服務使用者 (一)
        if (form.serviceUserGenderOne) {
            body["ServiceUserGenderOne"] = form.serviceUserGenderOne
        } else {
            error["ServiceUserGenderOne"] = true;
        }

        if (form.serviceUserAgeOne) {
            body["ServiceUserAgeOne"] = form.serviceUserAgeOne;
        } else {
            error["ServiceUserAgeOne"] = true;
        }

        //(b) 服務使用者 (二，如有)
        body["ServiceUserGenderTwo"] = form.serviceUserGenderTwo;
        body["ServiceUserAgeTwo"] = form.serviceUserAgeTwo;

        //(c) 服務使用者 (三，如有)
        body["StaffGenderThree"] = form.serviceUserGenderTwo;
        body["ServiceUserAgeThree"] = form.serviceUserAgeTwo;

        //(a) 職員 ( 一 )*
        if (form.staffGenderOne) {
            body["StaffGenderOne"] = form.staffGenderOne;
        } else {
            error["StaffGenderOne"] = true;
        }

        if (form.staffPositionOne) {
            body["StaffPositionOne"] = form.staffPositionOne;
        } else {
            error["StaffPositionOne"] = true;
        }

        //(b) 職員 ( 二，如有 )
        body["StaffGenderTwo"] = form.staffGenderTwo;
        body["StaffPositionTwo"] = form.staffGenderTwo;
        //(c) 職員 ( 三，如有 )
        body["StaffGenderThree"] = form.staffGenderThree;
        body["StaffPositionThree"] = form.staffGenderThree;

        //報警處理
        body["Police"] = form.police;
        if (form.police === true) {
            body["PoliceDatetime"] = policeDatetime.toISOString();
            if (form.policeReportNumber) {
                body["PoliceReportNumber"] = form.policeReportNumber;
            } else {
                error["PoliceReportNumber"] = true;
            }
        } else if (form.police === false) {
            if (form.policeDescription) {
                body["PoliceDescription"] = form.policeDescription;
            } else {
                error["PoliceDescription"] = true;
            }
        } else if (form.police === undefined) {
            error["Police"] = true;
        }

        //通知家人 / 親屬 / 監護人 / 保證人
        body["Guardian"] = form.guardian;
        if (form.guardian) {
            form["GuardianDatetime"] = guardianDatetime.toISOString();

            if (form.guardianRelationship) {
                form["GuardianRelationship"] = form.guardianRelationship;
            } else {
                error["GuardianRelationship"] = true;
            }

        } else if (form.guardian === false) {
            body["GuardianDescription"] = form.guardianDescription;
        } else if (form.guardian === undefined) {
            error["form.guardian"] = true;
        }

        //醫療安排
        body["MedicalArrangement"] = form.medicalArrangement;
        if (form.medicalArrangement === true) {
            if (form.medicalArrangmentDetail) {
                body["MedicalArrangmentDetail"] = form.medicalArrangmentDetail;
            } else {
                error["MedicalArrangmentDetail"] = true;
            }
        } else if (form.medicalArrangement === undefined) {
            error["MedicalArrangement"] = true;
        }

        //舉行專業個案會議 / 為有關服務使用者訂定照顧計劃
        body["CarePlan"] = form.carePlan;
        if (form.carePlan === true) {
            if (form.carePlanYesDescription) {
                body["CarePlanYesDescription"] = form.carePlanYesDescription;
            } else {
                error["CarePlanYesDescription"] = true;
            }
        } else if (form.carePlan === false) {
            if (form.carePlanNoDescription) {
                body["CarePlanNoDescription"] = form.carePlanNoDescription;
            } else {
                error["CarePlanNoDescription"] = true;
            }
        } else if (form.carePlan === undefined) {
            error["CarePlan"] = true;
        }

        //需要回應外界團體(如：關注組、區議會、立法會等)的關注／查詢
        body["NeedResponse"] = form.needResponse;
        if (form.needResponse === true) {
            body["NeedResponseDetail"] = form.needResponseDetail;
        } else if (form.needResponse === undefined) {
            error["NeedResponse"] = true;
        }

        //已作出即時的跟進行動，包括保護其他服務使用者的措施 (如適用)
        body["ImmediateFollowUp"] = form.immediateFollowUp;

        //跟進計劃
        if (form.followUpPlan) {
            body["FollowUpPlan"] = form.followUpPlan;
        } else {
            error['FollowUpPlan'] = true;
        }

        return [body, error]
    }

    const submitHandler = (event) => {
        event.preventDefault();
        const [body, error] = dataFactory()
        console.log(body);
        console.log(error);
        createOtherIncidentReport(body).then(res => {
            console.log(res)
            //formSubmittedHandler();
        }).catch(console.error);
    }

    const draftHandler = (event) => {
        event.preventDefault();
        const [body] = dataFactory()
        console.log(body);
        createOtherIncidentReport(body).then(res => {
            console.log(res)
            formSubmittedHandler();
        }).catch(console.error);
    }

    const cancelHandler = () => {
        //implement 
        const path = context.pageContext.site.absoluteUrl + `/accident-and-incident/SitePages/Home.aspx`;
        window.open(path, "_self");
    }

    useEffect(() => {
        setReporter([{ secondaryText: CURRENT_USER.email, id: CURRENT_USER.id }]);
    }, []);

    return (
        <>
            <div>
                <Header displayName="其他事故呈報表" />
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
                            <select className="form-control" value={serviceUnit} onChange={(event) => setServiceUnit(event.target.value)}>
                                <option>請選擇服務單位</option>
                                {serviceUnitList.map((unit) => {
                                    return <option value={unit.ShortForm}>{`${unit.ShortForm} - ${unit.Title}`}</option>
                                })}
                            </select>
                        </div>
                        {/* 保險公司備案編號 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>保險公司備案編號</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" name="insuranceCaseNo" value={form.insuranceCaseNo} onChange={inputFieldHandler} />
                        </div>
                    </div>
                </section>

                <section className="mb-5">
                    <div className="form-row mb-2">
                        <div className="col-12 font-weight-bold">
                            <h5>事故資料</h5>
                        </div>
                    </div>

                    <div className="form-row mb-2">
                        {/* 事故發生日期 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>事故發生日期和時間</label>
                        <div className="col-12 col-md-4">
                            <DatePicker
                                className="form-control"
                                selected={incidentTime}
                                onChange={(date) => setIncidentTime(date)}
                                showTimeSelect
                                timeFormat="p"
                                timeIntervals={15}
                                dateFormat="yyyy/MM/dd h:mm aa"
                            />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        {/* 事故發生地點 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>事故發生地點</label>
                        <div className="col">
                            <input type="text" className="form-control" name="incidentLocation" value={form.incidentLocation} onChange={inputFieldHandler} />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>事故被傳媒報導</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="reportedByNews" id="reportedByNews_true" onChange={() => setForm({ ...form, mediaReports: true })} checked={form.mediaReports === true} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="reportedByNews_true">是</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="reportedByNews" id="reportedByNews_false" onChange={() => setForm({ ...form, mediaReports: false })} checked={form.mediaReports === false} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="reportedByNews_false">否</label>
                            </div>
                            {
                                form.mediaReports === true &&
                                <AutosizeTextarea className="form-control" placeholder="請註明" name="mediaReportsDescription" value={form.mediaReportsDescription} onChange={inputFieldHandler} />
                            }
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>事故的描述</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" name="incidentDescription" value={form.incidentDescription} onChange={inputFieldHandler} />
                        </div>
                    </div>
                </section>

                <section className="mb-5">
                    <div className="form-row mb-2">
                        <div className="col-12 font-weight-bold mb-2">
                            <h5>有關服務使用者的資料 (如適用)</h5>
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <div className={`col-12 ${styles.fieldTitle} ${styles.staffFieldLabel}`}>(a) 服務使用者 (一)<sup style={{ color: "red" }}>*</sup></div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>性別</label>
                        <div className="col-12 col-md-4 d-flex align-items-center">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="serviceUsers1" id="serviceUserGenderMale1" onChange={() => setForm({ ...form, serviceUserGenderOne: "male" })} checked={form.serviceUserGenderOne === "male"} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="serviceUserGenderMale1">男</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="serviceUsers1" id="serviceUserGenderFemale1" onChange={() => setForm({ ...form, serviceUserGenderOne: "female" })} checked={form.serviceUserGenderOne === "female"} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="serviceUserGenderFemale1">女</label>
                            </div>
                        </div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>年齡</label>
                        <div className="col-12 col-md-4">
                            <input type="number" className="form-control" min={0} value={form.serviceUserAgeOne} onChange={(event) => setForm({ ...form, serviceUserAgeOne: +event.target.value })} />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <div className={`col-12 ${styles.fieldTitle}  ${styles.staffFieldLabel}`}>(b) 服務使用者 (二，如有)</div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`} >性別</label>
                        <div className="col-12 col-md-4 d-flex align-items-center">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="serviceUsers2" id="serviceUserGenderMale2" value="SERVICE_USER_GENDER_MALE_2" onChange={() => setForm({ ...form, serviceUserGenderTwo: "male" })} checked={form.serviceUserGenderTwo === "male"} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="serviceUserGenderMale2">男</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="serviceUsers2" id="serviceUserGenderFemale2" value="SERVICE_USER_GENDER_FEMALE_2" onChange={() => setForm({ ...form, serviceUserGenderTwo: "female" })} checked={form.serviceUserGenderTwo === "female"} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="serviceUserGenderFemale2">女</label>
                            </div>
                        </div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>年齡</label>
                        <div className="col-12 col-md-4">
                            <input type="number" className="form-control" min={0} value={form.serviceUserAgeTwo} onChange={(event) => setForm({ ...form, serviceUserAgeTwo: +event.target.value })} />
                        </div>
                    </div>
                    <div className="form-row mb-2">
                        <div className={`col-12 ${styles.fieldTitle}  ${styles.staffFieldLabel}`}>(c) 服務使用者 (三，如有)</div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`} >性別</label>
                        <div className="col-12 col-md-4 d-flex align-items-center">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="serviceUsers3" id="serviceUserGenderMale3" value="SERVICE_USER_GENDER_MALE_3" onChange={() => setForm({ ...form, serviceUserGenderThree: "male" })} checked={form.serviceUserGenderThree === "male"} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="serviceUserGenderMale3">男</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="serviceUsers3" id="serviceUserGenderFemale3" value="SERVICE_USER_GENDER_MALE_3" onChange={() => setForm({ ...form, serviceUserGenderThree: "female" })} checked={form.serviceUserGenderThree === "female"} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="serviceUserGenderFemale3">女</label>
                            </div>
                        </div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>年齡</label>
                        <div className="col-12 col-md-4">
                            <input type="number" className="form-control" min={0} value={form.serviceUserAgeThree} onChange={(event) => setForm({ ...form, serviceUserAgeThree: +event.target.value })} />
                        </div>
                    </div>
                </section>

                <section className="mb-4">
                    <div className="form-row mb-2">
                        <div className="col-12 font-weight-bold mb-2">
                            <h5>有關職員的資料 (如適用)</h5>
                        </div>
                    </div>
                    <div className="form-row row mb-2">
                        <div className={`col-12 ${styles.fieldTitle} ${styles.staffFieldLabel}`}>(a) 職員 ( 一 )<sup style={{ color: "red" }}>*</sup></div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`} >性別</label>
                        <div className="col-12 col-md-4 d-flex align-items-center">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="staffGender1" id="staffGenderMale1" value="SERVICE_USER_GENDER_MALE_3" onChange={() => setForm({ ...form, staffGenderOne: "male" })} checked={form.staffGenderOne === "male"} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="staffGenderMale1">男</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="staffGender1" id="staffGenderFemale1" value="SERVICE_USER_GENDER_MALE_3" onChange={() => setForm({ ...form, staffGenderOne: "female" })} checked={form.staffGenderOne === "female"} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="staffGenderFemale1">女</label>
                            </div>
                        </div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>職位</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" name="staffPositionOne" value={form.staffPositionOne} onChange={inputFieldHandler} />
                        </div>
                    </div>
                    <div className="form-row row mb-2">
                        <div className={`col-12 ${styles.fieldTitle}  ${styles.staffFieldLabel}`}>(b) 職員 ( 二，如有 )</div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`} >性別</label>
                        <div className="col-12 col-md-4 d-flex align-items-center">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="staffGender2" id="staffGenderMale2" onChange={() => setForm({ ...form, staffGenderTwo: "male" })} checked={form.staffGenderTwo === "male"} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="staffGenderMale2">男</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="staffGender2" id="staffGenderFemale2" onChange={() => setForm({ ...form, staffGenderTwo: "female" })} checked={form.staffGenderTwo === "female"} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="staffGenderFemale2">女</label>
                            </div>
                        </div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>職位</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" name="staffPositionTwo" value={form.staffPositionTwo} onChange={inputFieldHandler} />
                        </div>
                    </div>
                    <div className="form-row row mb-2">
                        <div className={`col-12 ${styles.fieldTitle}  ${styles.staffFieldLabel}`}>(c) 職員 ( 三，如有 )</div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>性別</label>
                        <div className="col-12 col-md-4 d-flex align-items-center">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="staffGender3" id="staffGenderMale3" onChange={() => setForm({ ...form, staffGenderThree: "male" })} checked={form.staffGenderThree === "male"} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="staffGenderMale3">男</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="staffGender3" id="staffGenderFemale3" onChange={() => setForm({ ...form, staffGenderThree: "female" })} checked={form.staffGenderThree === "female"} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="staffGenderFemale3">女</label>
                            </div>
                        </div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>職位</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" name="staffPositionThree" value={form.staffPositionThree} onChange={inputFieldHandler} />
                        </div>
                    </div>
                </section>

                <section className="mb-4">
                    <div className="form-row mb-2">
                        <div className="col-12 font-weight-bold mb-2">
                            <h5>跟進行動</h5>
                        </div>
                    </div>
                    <div className="form-row row mb-4">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>報警處理</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="police" onClick={() => setForm({ ...form, police: true })} checked={form.police === true} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="police-true">有</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="police" onClick={() => setForm({ ...form, police: false })} checked={form.police === false} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="police-false">沒有</label>
                            </div>
                            {
                                form.police === true &&
                                <>
                                    <div>
                                        <label className="form-label">報警日期和時間</label>
                                        <DatePicker
                                            className="form-control"
                                            selected={date}
                                            onChange={(date) => setDate(date)}
                                            showTimeSelect
                                            timeFormat="p"
                                            timeIntervals={15}
                                            dateFormat="yyyy/MM/dd h:mm aa"
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">報案編號</label>
                                        <input type="text" className="form-control" name="policeReportNumber" value={form.policeReportNumber} onChange={inputFieldHandler} />
                                    </div>
                                </>
                            }
                            {
                                form.police === false &&
                                <AutosizeTextarea className="form-control" placeholder="請註明" name="policeDescription" value={form.policeDescription} onChange={inputFieldHandler} />
                            }
                        </div>
                    </div>

                    <div className="form-row row mb-4">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>通知家人 / 親屬 / 監護人 / 保證人</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="notifyFamily" id="notify-family-true" value="NOTIFY_FAMILY_TRUE" checked={form.guardian === true} onClick={() => setForm({ ...form, guardian: true })} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="notify-family-true">有</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="notifyFamily" id="notify-family-false" value="NOTIFY_FAMILY_FALSE" checked={form.guardian === false} onClick={() => setForm({ ...form, guardian: false })} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="notify-family-false">沒有</label>
                            </div>
                            {
                                form.guardian === true &&
                                <>
                                    <div>
                                        <label className="form-label">通知日期和時間</label>
                                        <DatePicker
                                            className="form-control"
                                            selected={guardianDatetime}
                                            onChange={(date) => setGuardianDatetime(date)}
                                            showTimeSelect
                                            timeFormat="p"
                                            timeIntervals={15}
                                            dateFormat="yyyy/MM/dd h:mm aa"
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">與服務使用者的關係</label>
                                        <input type="text" className="form-control" name="guardianRelationship" value={form.guardianRelationship} onChange={inputFieldHandler} />
                                    </div>
                                    <div>
                                        <label className="form-label">負責職員姓名</label>
                                        <input type="text" className="form-control" name="guardianStaff" value={form.guardianStaff} onChange={inputFieldHandler} />
                                    </div>
                                </>
                            }
                            {form.guardian === false &&
                                <div>
                                    <AutosizeTextarea className="form-control" placeholder="請註明" name="guardianDescription" value={form.guardianDescription} onChange={inputFieldHandler} />
                                </div>
                            }
                        </div>
                    </div>

                    <div className="form-row row mb-4">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>醫療安排</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="medical" id="medical-true" checked={form.medicalArrangement === true} onClick={() => setForm({ ...form, medicalArrangement: true })} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="medical-true">有</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="medical" id="medical-false" checked={form.medicalArrangement === false} onClick={() => setForm({ ...form, medicalArrangement: false })} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="medical-false">沒有</label>
                            </div>
                            {
                                form.medicalArrangement === true &&
                                <div>
                                    <AutosizeTextarea className="form-control" placeholder="請註明" name="medicalArrangmentDetail" value={form.medicalArrangmentDetail} onChange={inputFieldHandler} />
                                </div>
                            }
                        </div>
                    </div>

                    <div className="form-row row mb-4">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>舉行專業個案會議 / 為有關服務使用者訂定照顧計劃</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="meeting" id="meeting-true" onChange={() => setForm({ ...form, carePlan: true })} checked={form.carePlan === true} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="meeting-true">有</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="meeting" id="meeting-false" onChange={() => setForm({ ...form, carePlan: false })} checked={form.carePlan === false} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="meeting-false">沒有</label>
                            </div>
                            {
                                form.carePlan === true &&
                                <div>
                                    <AutosizeTextarea className="form-control" placeholder="請註明，包括日期" name="carePlanYesDescription" value={form.carePlanYesDescription} onChange={inputFieldHandler} />
                                </div>
                            }
                            {
                                form.carePlan === false &&
                                <div>
                                    <AutosizeTextarea className="form-control" placeholder="請註明" name="carePlanNoDescription" value={form.carePlanNoDescription} onChange={inputFieldHandler} />
                                </div>
                            }
                        </div>
                    </div>

                    <div className="form-row row mb-4">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>需要回應外界團體(如：關注組、區議會、立法會等)的關注／查詢</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="response" id="response-true" value="RESPONSE_TRUE" onClick={radioButtonHandler} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="response-true">是</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="response" id="response-false" value="RESPONSE_FALSE" onClick={radioButtonHandler} />
                                <label className={`form-check-label ${styles.labelColor}`} htmlFor="response-false">否</label>
                            </div>
                            {
                                form.needResponse &&
                                <div>
                                    <AutosizeTextarea className="form-control" placeholder="請註明" />
                                </div>
                            }
                        </div>
                    </div>

                    <div className="form-row row mb-4">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>已作出即時的跟進行動，包括保護其他服務使用者的措施 (如適用)</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" />
                        </div>
                    </div>

                    <div className="form-row row mb-4">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>跟進計劃</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" />
                        </div>
                    </div>
                </section>


                <hr className="my-4" />

                <section className="mb-4">
                    <div className="row mb-0 mb-md-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>擬備人員</label>
                        {/* <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div> */}

                    </div>
                    <div className="row mb-0 mb-md-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>姓名</label>
                        <div className="col-12 col-md-4">
                            <PeoplePicker
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
                                } />
                        </div>
                        <label className={`col-12 col-md-1 col-form-label ${styles.fieldTitle} pt-xl-0`}>職位</label>
                        <div className="col-12 col-md-5">
                            <input type="text" className="form-control" value={reporter && (reporter.jobTitle || "")} disabled={true} />
                        </div>

                    </div>
                    <div className="row mb-0 mb-md-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>電話</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                        <label className={`col-12 col-md-1 col-form-label ${styles.fieldTitle} pt-xl-0`}>日期</label>
                        <div className="col-12 col-md-5">
                            <DatePicker
                                className="form-control"
                                selected={new Date()}
                                dateFormat="yyyy/MM/dd"
                                readOnly
                            />
                        </div>
                    </div>
                </section>

                <hr className="my-4" />

                <section className="mb-4">
                    <div className="form-row mb-2">
                        <div className="col-12 font-weight-bold mb-2">
                            <span className={styles.fieldTitle}>[此欄由高級服務經理/服務經理填寫]</span>
                        </div>
                    </div>
                    <div className="form-row row mb-2">
                        {/* 高級服務經理/服務經理姓名 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>高級服務經理/<span className="d-sm-inline d-md-block">服務經理姓名</span></label>
                        <div className="col-12 col-md-4">
                            <PeoplePicker
                                context={context}
                                titleText=""
                                showtooltip={false}
                                personSelectionLimit={1}
                                ensureUser={true}
                                isRequired={false}
                                selectedItems={(e) => { console }}
                                showHiddenInUI={false} />
                        </div>
                        <label className={`col-12 col-md-1 col-form-label ${styles.fieldTitle} pt-xl-0`}>日期</label>
                        <div className="col-12 col-md-5">
                            <DatePicker className="form-control" dateFormat="yyyy/MM/dd" selected={date} onChange={(date) => setDate(date)} readOnly />
                        </div>
                    </div>
                    <div className="form-row row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>高級服務經理/<span className="d-sm-inline d-md-block">服務經理評語</span></label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" />
                        </div>
                    </div>
                    <div className="form-row row mb-2">
                        <div className="col-12">
                            <div className="d-flex justify-content-center">
                                <button className="btn btn-warning mr-3">批准</button>
                                <button className="btn btn-danger mr-3">拒絕</button>
                            </div>
                        </div>
                    </div>
                </section>

                <hr className="my-4" />

                <section className="mb-4">
                    <div className="row mb-2">
                        <div className="col-12 font-weight-bold mb-2">
                            <span className={styles.fieldTitle}>[此欄由服務總監填寫]</span>
                        </div>
                    </div>
                    <div className="row mb-0 mb-md-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>批簽人員</label>
                        {/* <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div> */}

                    </div>
                    <div className="row mb-0 mb-md-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>姓名</label>
                        <div className="col-12 col-md-4">
                            <PeoplePicker
                                context={context}
                                titleText=""
                                showtooltip={false}
                                personSelectionLimit={1}
                                ensureUser={true}
                                isRequired={false}
                                selectedItems={(e) => { console }}
                                showHiddenInUI={false} />
                        </div>
                        <label className={`col-12 col-md-1 col-form-label ${styles.fieldTitle} pt-xl-0`}>職位</label>
                        <div className="col-12 col-md-5">
                            <input type="text" className="form-control" />
                        </div>
                    </div>
                    <div className="row mb-0 mb-md-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>電話</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                        <label className={`col-12 col-md-1 col-form-label ${styles.fieldTitle} pt-xl-0`}>日期</label>
                        <div className="col-12 col-md-5">
                            <DatePicker
                                className="form-control"
                                selected={new Date()}
                                dateFormat="yyyy/MM/dd"
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="row mb-0 mb-md-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-xl-0`}>服務總監評語</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" />
                        </div>
                    </div>
                    <div className="row my-2">
                        <div className="col-12">
                            <div className="d-flex justify-content-center">
                                <button className="btn btn-warning mr-3">批准</button>
                                <button className="btn btn-danger mr-3">拒絕</button>
                            </div>
                        </div>
                    </div>
                </section>

                <hr className="my-4" />

                <section className="py-3">
                    <div className="d-flex justify-content-center" style={{ gap: 10 }}>
                        <button className="btn btn-warning" onClick={submitHandler}>提交</button>
                        <button className="btn btn-success" onClick={draftHandler}>草稿</button>
                        <button className="btn btn-secondary" onClick={cancelHandler}>取消</button>
                    </div>
                </section>


            </div>
        </>
    )
}

