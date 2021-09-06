import * as React from 'react'
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { WebPartContext } from '@microsoft/sp-webpart-base';
import Header from "../../../components/Header/Header";
import AutosizeTextarea from "../../../components/AutosizeTextarea/AutosizeTextarea";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";

interface IOtherIncidentReportProps {
    context: WebPartContext;
    styles: any;

}

interface IOtherIncidentReportStates {
    reportedByNews: string;
    police: string;
    notifyFamily: string;
    medical: string;
    meeting: string;
    response: string;
}

export default function OtherIncidentReport({ context, styles }: IOtherIncidentReportProps) {
    const [form, setForm] = useState<IOtherIncidentReportStates>({
        reportedByNews: "",
        police: "",
        notifyFamily: "",
        medical: "",
        meeting: "",
        response: ""
    });
    const [date, setDate] = useState(new Date());
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

    const selectionHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setForm({ ...form, [name]: value });
    }

    return (
        <>
            <div className="mb-3">
                <Header displayName="其他事故呈報表" />
            </div>
            <div className="container-fluid px-4">
                <section className="mb-4">
                    {/* <div className="row">
                        <div className="col-12 font-weight-bold">
                            <h5>檔案編號</h5>
                        </div>
                    </div> */}

                    <div className="form-group row mb-2">
                        {/* 服務單位 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-0`}>服務單位</label>
                        <div className="col-12 col-md-4">
                            <select className="form-control">
                                <option>請選擇服務單位</option>
                            </select>
                        </div>
                        {/* 保險公司備案編號 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-0`}>保險公司備案編號</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                    </div>
                </section>
                <section className="mb-4">
                    <div className="row">
                        <div className="col-12 font-weight-bold">
                            <h5>事故資料</h5>
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 事故發生日期 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-0`}>事故發生日期和時間</label>
                        <div className="col-12 col-md-4">
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
                    </div>
                    <div className="form-group row mb-2">
                        {/* 事故發生地點 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-0`}>事故發生地點</label>
                        <div className="col">
                            <input type="text" className="form-control" />
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-0`}>事故被傳媒報導</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="reportedByNews" id="reportedByNews_true" value="REPORTED_BY_NEWS_TRUE" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="reportedByNews_true">是</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="reportedByNews" id="reportedByNews_false" value="REPORTED_BY_NEWS_FALSE" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="reportedByNews_false">否</label>
                            </div>
                            {
                                form.reportedByNews === "REPORTED_BY_NEWS_TRUE" &&
                                <AutosizeTextarea className="form-control" placeholder="請註明" />
                            }
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-0`}>事故的描述</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" placeholder="請註明" />
                        </div>
                    </div>
                </section>

                <section className="mb-4">
                    <div className="row">
                        <div className="col-12 font-weight-bold">
                            <h5>有關服務使用者的資料 (如適用)</h5>
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        <div className={`col-12 ${styles.fieldTitle} ${styles.staffFieldLabel}`}>(a) 服務使用者 (一)<sup style={{ color: "red" }}>*</sup></div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`} >性別</label>
                        <div className="col-12 col-md-4 d-flex align-items-center">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="serviceUsers1" id="serviceUserGenderMale1" value="SERVICE_USER_GENDER_MALE_1" />
                                <label className="form-check-label" htmlFor="serviceUserGenderMale1">男</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="serviceUsers1" id="serviceUserGenderFemale1" value="SERVICE_USER_GENDER_FEMALE_1" />
                                <label className="form-check-label" htmlFor="serviceUserGenderFemale1">女</label>
                            </div>
                        </div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-0`}>年齡</label>
                        <div className="col-12 col-md-4">
                            <input type="number" className="form-control" min={0} />
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        <div className={`col-12 ${styles.fieldTitle}  ${styles.staffFieldLabel}`}>(b) 服務使用者 (二，如有)</div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`} >性別</label>
                        <div className="col-12 col-md-4 d-flex align-items-center">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="serviceUsers2" id="serviceUserGenderMale2" value="SERVICE_USER_GENDER_MALE_2" />
                                <label className="form-check-label" htmlFor="serviceUserGenderMale2">男</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="serviceUsers2" id="serviceUserGenderFemale2" value="SERVICE_USER_GENDER_FEMALE_2" />
                                <label className="form-check-label" htmlFor="serviceUserGenderFemale2">女</label>
                            </div>
                        </div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-0`}>年齡</label>
                        <div className="col-12 col-md-4">
                            <input type="number" className="form-control" min={0} />
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        <div className={`col-12 ${styles.fieldTitle}  ${styles.staffFieldLabel}`}>(c) 服務使用者 (三，如有)</div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`} >性別</label>
                        <div className="col-12 col-md-4 d-flex align-items-center">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="serviceUsers3" id="serviceUserGenderMale3" value="SERVICE_USER_GENDER_MALE_3" />
                                <label className="form-check-label" htmlFor="serviceUserGenderMale3">男</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="serviceUsers3" id="serviceUserGenderFemale3" value="SERVICE_USER_GENDER_MALE_3" />
                                <label className="form-check-label" htmlFor="serviceUserGenderFemale3">女</label>
                            </div>
                        </div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-0`}>年齡</label>
                        <div className="col-12 col-md-4">
                            <input type="number" className="form-control" min={0} />
                        </div>
                    </div>
                </section>

                <section className="mb-4">
                    <div className="row">
                        <div className="col-12 font-weight-bold">
                            <h5>有關職員的資料 (如適用)</h5>
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        <div className={`col-12 ${styles.fieldTitle} ${styles.staffFieldLabel}`}>(a) 職員 ( 一 )<sup style={{ color: "red" }}>*</sup></div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`} >性別</label>
                        <div className="col-12 col-md-4 d-flex align-items-center">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="staffGender1" id="staffGenderMale1" value="STAFF_GENDER_MALE_1" />
                                <label className="form-check-label" htmlFor="staffGenderMale1">男</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="staffGender1" id="staffGenderFemale1" value="STAFF_GENDER_FEMALE_1" />
                                <label className="form-check-label" htmlFor="staffGenderFemale1">女</label>
                            </div>
                        </div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-0`}>職位</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        <div className={`col-12 ${styles.fieldTitle}  ${styles.staffFieldLabel}`}>(b) 職員 ( 二，如有 )</div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`} >性別</label>
                        <div className="col-12 col-md-4 d-flex align-items-center">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="staffGender2" id="staffGenderMale2" value="STAFF_GENDER_MALE_2" />
                                <label className="form-check-label" htmlFor="staffGenderMale2">男</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="staffGender2" id="staffGenderFemale2" value="STAFF_GENDER_FEMALE_2" />
                                <label className="form-check-label" htmlFor="staffGenderFemale2">女</label>
                            </div>
                        </div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-0`}>職位</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        <div className={`col-12 ${styles.fieldTitle}  ${styles.staffFieldLabel}`}>(c) 職員 ( 三，如有 )</div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>性別</label>
                        <div className="col-12 col-md-4 d-flex align-items-center">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="staffGender3" id="staffGenderMale3" value="SERVICE_USER_GENDER_MALE_3" />
                                <label className="form-check-label" htmlFor="staffGenderMale3">男</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="staffGender3" id="staffGenderFemale3" value="SERVICE_USER_GENDER_MALE_3" />
                                <label className="form-check-label" htmlFor="staffGenderFemale3">女</label>
                            </div>
                        </div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-0`}>職位</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                    </div>
                </section>

                <section className="mb-4">
                    <div className="row">
                        <div className="col-12 font-weight-bold">
                            <h5>跟進行動</h5>
                        </div>
                    </div>
                    <div className="form-group row mb-4">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-0`}>報警處理</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="police" id="police-true" value="POLICE_TRUE" onClick={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="police-true">有</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="police" id="police-false" value="POLICE_FALSE" onClick={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="police-false">沒有</label>
                            </div>
                            {
                                form.police === "POLICE_TRUE" &&
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
                                        <input type="text" className="form-control" />
                                    </div>
                                </>
                            }
                            {
                                form.police === "POLICE_FALSE" &&
                                <AutosizeTextarea className="form-control" placeholder="請註明" />
                            }
                        </div>
                    </div>

                    <div className="form-group row mb-4">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-0`}>通知家人 / 親屬 / 監護人 / 保證人</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="notifyFamily" id="notify-family-true" value="NOTIFY_FAMILY_TRUE" onClick={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="notify-family-true">有</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="notifyFamily" id="notify-family-false" value="NOTIFY_FAMILY_FALSE" onClick={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="notify-family-false">沒有</label>
                            </div>
                            {
                                form.notifyFamily === "NOTIFY_FAMILY_TRUE" &&
                                <>
                                    <div>
                                        <label className="form-label">通知日期和時間</label>
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
                                        <label className="form-label">與服務使用者的關係</label>
                                        <input type="text" className="form-control" />
                                    </div>
                                    <div>
                                        <label className="form-label">負責職員姓名</label>
                                        <input type="text" className="form-control" />
                                    </div>
                                </>
                            }
                            {form.notifyFamily === "NOTIFY_FAMILY_FALSE" &&
                                <div>
                                    <AutosizeTextarea className="form-control" placeholder="請註明" />
                                </div>
                            }
                        </div>
                    </div>

                    <div className="form-group row mb-4">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-0`}>醫療安排</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="medical" id="medical-true" value="MEDICAL_TRUE" onClick={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="medical-true">有</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="medical" id="medical-false" value="MEDICAL_FALSE" onClick={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="medical-false">沒有</label>
                            </div>
                            {
                                form.medical === "MEDICAL_TRUE" &&
                                <div>
                                    <AutosizeTextarea className="form-control" placeholder="請註明" />
                                </div>
                            }
                        </div>
                    </div>

                    <div className="form-group row mb-4">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-0`}>舉行專業個案會議 / 為有關服務使用者訂定照顧計劃</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="meeting" id="meeting-true" value="MEETING_TRUE" onClick={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="meeting-true">有</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="meeting" id="meeting-false" value="MEETING_FALSE" onClick={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="meeting-false">沒有</label>
                            </div>
                            {
                                form.meeting === "MEETING_TRUE" &&
                                <div>
                                    <AutosizeTextarea className="form-control" placeholder="請註明，包括日期" />
                                </div>
                            }
                            {
                                form.meeting === "MEETING_FALSE" &&
                                <div>
                                    <AutosizeTextarea className="form-control" placeholder="請註明" />
                                </div>
                            }
                        </div>
                    </div>

                    <div className="form-group row mb-4">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-0`}>需要回應外界團體(如：關注組、區議會、立法會等)的關注／查詢</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="response" id="response-true" value="RESPONSE_TRUE" onClick={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="response-true">是</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="response" id="response-false" value="RESPONSE_FALSE" onClick={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="response-false">否</label>
                            </div>
                            {
                                form.response === "RESPONSE_TRUE" &&
                                <div>
                                    <AutosizeTextarea className="form-control" placeholder="請註明" />
                                </div>
                            }
                        </div>
                    </div>

                    <div className="form-group row mb-4">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-0`}>已作出即時的跟進行動，包括保護其他服務使用者的措施 (如適用)</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" placeholder="請註明" />
                        </div>
                    </div>

                    <div className="form-group row mb-4">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-0`}>跟進計劃</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" placeholder="請註明" />
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
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-0`}>姓名</label>
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
                        <label className={`col-12 col-md-1 col-form-label ${styles.fieldTitle} pt-0`}>職位</label>
                        <div className="col-12 col-md-5">
                            <input type="text" className="form-control" />
                        </div>

                    </div>
                    <div className="row mb-0 mb-md-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-0`}>電話</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                        <label className={`col-12 col-md-1 col-form-label ${styles.fieldTitle} pt-0`}>日期</label>
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
                    <div className="row">
                        <div className="col-12 font-weight-bold mb-2">
                            <span>[此欄由高級服務經理/服務經理填寫]</span>
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        {/* 高級服務經理/服務經理姓名 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-0`}>高級服務經理/<span className="d-sm-inline d-md-block">服務經理姓名</span></label>
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
                        <label className={`col-12 col-md-1 col-form-label ${styles.fieldTitle} pt-0`}>日期</label>
                        <div className="col-12 col-md-5">
                            <DatePicker className="form-control" dateFormat="yyyy/MM/dd" selected={date} onChange={(date) => setDate(date)} readOnly />
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>高級服務經理/<span className="d-sm-inline d-md-block">服務經理評語</span></label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" />
                        </div>
                    </div>
                    <div className="form-group row mb-2">
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
                    <div className="row">
                        <div className="col-12 font-weight-bold mb-2">
                            <span>[此欄由服務總監填寫]</span>
                        </div>
                    </div>
                    <div className="row mb-0 mb-md-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>批簽人員</label>
                        {/* <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div> */}

                    </div>
                    <div className="row mb-0 mb-md-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-0`}>姓名</label>
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
                        <label className={`col-12 col-md-1 col-form-label ${styles.fieldTitle} pt-0`}>職位</label>
                        <div className="col-12 col-md-5">
                            <input type="text" className="form-control" />
                        </div>
                    </div>
                    <div className="row mb-0 mb-md-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-0`}>電話</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                        <label className={`col-12 col-md-1 col-form-label ${styles.fieldTitle} pt-0`}>日期</label>
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
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle} pt-0`}>服務總監評語</label>
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

                <hr className="my-3" />

                <section className="py-3">
                    <div className="d-flex justify-content-center" style={{ gap: 10 }}>
                        <button className="btn btn-warning">提交</button>
                        <button className="btn btn-success">草稿</button>
                        <button className="btn btn-secondary">取消</button>
                    </div>
                </section>


            </div>
        </>
    )
}

