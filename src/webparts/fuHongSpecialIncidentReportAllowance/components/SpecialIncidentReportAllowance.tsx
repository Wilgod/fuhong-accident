import * as React from 'react'
import { useState, useEffect } from 'react'
import DatePicker from "react-datepicker";
import Header from "../../../components/Header/Header";
import "react-datepicker/dist/react-datepicker.css";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { WebPartContext } from '@microsoft/sp-webpart-base';
import AutosizeTextarea from "../../../components/AutosizeTextarea/AutosizeTextarea";


interface ISpecialIncidentReportAllowanceProps {
    context: WebPartContext;
    styles: any;
}

interface IAccidentCategoryAbuseDetails {
    status: string;
    person: string;
}
interface ISpecialIncidentReportAllowanceStates {
    accidentCategory: string;

    abusiveNature: string[];
    police: string;
    medical: string;
    notifyFamily: string;
    meeting: string;
    response: string;
    toDepartment: string;
}

const footNoteOne = "指在服務單位內及／或在其他地方提供服務時所發生的特別事故";
const footNoteTwo = "包括寄養家庭的寄養家長及兒童之家的家舍家長及其家庭成員";



export default function SpecialIncidentReportAllowance({ context, styles }: ISpecialIncidentReportAllowanceProps) {
    const [form, setForm] = useState<ISpecialIncidentReportAllowanceStates>({
        accidentCategory: "",
        abusiveNature: [],
        police: "",
        medical: "",
        notifyFamily: "",
        meeting: "",
        response: "",
        toDepartment: ""
    });
    const [accidentCategoryAbuseDetails, setAccidentCategoryAbuseDetails] = useState<IAccidentCategoryAbuseDetails>({
        status: "",
        person: ""
    });

    const [date, setDate] = useState(new Date());

    const radioButtonHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setForm({ ...form, [name]: value });
    }

    const accidentCategoryAbuseDetailsRadioButtonHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setAccidentCategoryAbuseDetails({ ...accidentCategoryAbuseDetails, [name]: value });
    }

    const selectionHandler = (event) => {
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

    const accidentCategoryHandler = () => {
        if (form.accidentCategory !== "ACCIDENT_CATEGORY_ABUSE") {
            setAccidentCategoryAbuseDetails({ status: "", person: "" });
        }
    }

    const accidentCategoryAbuseHandler = () => {
        const { status, person } = accidentCategoryAbuseDetails;
        if (status || person) setForm({ ...form, accidentCategory: "ACCIDENT_CATEGORY_ABUSE" })
    }

    useEffect(() => {
        accidentCategoryHandler()
    }, [form.accidentCategory])

    useEffect(() => {
        accidentCategoryAbuseHandler()
    }, [accidentCategoryAbuseDetails.status, accidentCategoryAbuseDetails.person])

    return (
        <>
            <div className="mb-3">
                <Header displayName="殘疾人士院舍特別事故報告" />
            </div>
            <div className="container px-4">
                <section className="mb-4">
                    {/* <div className="row">
                        <div className="col-12 font-weight-bold">
                            <h5>報告資料</h5>
                        </div>
                    </div> */}
                    <div className="row my-3">
                        <div className="col-12 fontweight-bold">
                            <span className={`font-weight-bold`} style={{ fontSize: 15, cursor: "help" }} title={footNoteOne}>( 特別事故<sup>1</sup> 發生後三個工作天內提交社會福利署津貼組及相關服務科 )</span>
                        </div>
                    </div>

                    <hr className="my-3" />

                    <div className="form-group row">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>致部門</label>
                        <div className="col">
                            <select className="form-control" name={"toDepartment"} onChange={selectionHandler} >
                                <option value="">請選擇部門</option>
                                <option value="ALLOWANCE_SECTION">津貼科</option>
                                <option value="ELDERLY_SERVICES_DIVISION">安老服務科</option>
                                <option value="FAMILY_AND_CHILD_WELFARE_DIVISION">家庭及兒童福利科</option>
                                <option value="REHABILITATION_AND_MEDICAL_SOCIAL_SERVICES_DIVISION">康復及醫務社會服務科</option>
                                <option value="YOUTH_AND_PROBATION_SERVICES_BRANCH_PROBATION_SERVICE_GROUP">青年及感化服務科 - 感化服務組</option>
                                <option value="YOUTH_AND_PROBATION_SERVICES_DIVISION_YOUTH_AFFAIRS_SECTION">青年及感化服務科 - 青年事務組</option>
                            </select>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-1">
                            致:
                        </div>
                        <div className="col" >
                            <div className="row" style={{ textDecoration: `${form.toDepartment === "ALLOWANCE_SECTION" || !form.toDepartment ? "none" : "line-through"}` }}>
                                <div className="col-auto mr-auto">
                                    津貼科
                                </div>
                                <div className="col-auto">
                                    (傳真: 2575 5632)
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row" style={{ textDecoration: `${form.toDepartment === "ELDERLY_SERVICES_DIVISION" || !form.toDepartment ? "none" : "line-through"}` }}>
                        <div className="offset-1 col-auto mr-auto">
                            <div>安老服務科</div>
                        </div>
                        <div className="col-auto">
                            <div>(傳真: 2575 5632)</div>
                        </div>
                    </div>
                    <div className="row" style={{ textDecoration: `${form.toDepartment === "FAMILY_AND_CHILD_WELFARE_DIVISION" || !form.toDepartment ? "none" : "line-through"}` }}>
                        <div className="offset-1 col-auto mr-auto">
                            <div>家庭及兒童福利科</div>
                        </div>
                        <div className="col-auto">
                            <div>(傳真: 2833 5840)</div>
                        </div>
                    </div>
                    <div className="row" style={{ textDecoration: `${form.toDepartment === "REHABILITATION_AND_MEDICAL_SOCIAL_SERVICES_DIVISION" || !form.toDepartment ? "none" : "line-through"}` }}>
                        <div className="offset-1 col-auto mr-auto">
                            <div>康復及醫務社會服務科</div>
                        </div>
                        <div className="col-auto">
                            <div>(傳真: 2893 6983)</div>
                        </div>
                    </div>
                    <div className="row" >
                        <div className="offset-1 col-auto mr-auto">
                            <div style={{ textDecoration: `${form.toDepartment === "YOUTH_AND_PROBATION_SERVICES_BRANCH_PROBATION_SERVICE_GROUP" || form.toDepartment === "YOUTH_AND_PROBATION_SERVICES_DIVISION_YOUTH_AFFAIRS_SECTION" || !form.toDepartment ? "none" : "line-through"}` }}>青年及感化服務科</div>
                        </div>
                    </div>
                    <div className="row" style={{ textDecoration: `${form.toDepartment === "YOUTH_AND_PROBATION_SERVICES_BRANCH_PROBATION_SERVICE_GROUP" || !form.toDepartment ? "none" : "line-through"}` }}>
                        <div className="offset-2 col-auto mr-auto">
                            <div>感化服務組</div>
                        </div>
                        <div className="col-auto">
                            <div>(傳真: 2833 5861)</div>
                        </div>
                    </div>
                    <div className="row" style={{ textDecoration: `${form.toDepartment === "YOUTH_AND_PROBATION_SERVICES_DIVISION_YOUTH_AFFAIRS_SECTION" || !form.toDepartment ? "none" : "line-through"}` }}>
                        <div className="offset-2 col-auto mr-auto">
                            <div>青年事務組</div>
                        </div>
                        <div className="col-auto">
                            <div>(傳真: 2838 7021)</div>
                        </div>
                    </div>

                    <hr className="my-3" />
                </section>

                <section className="mb-4">
                    <div className="row">
                        <div className="col-12 font-weight-bold">
                            <h5>報告單位資料</h5>
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        {/* 事故性質 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>機構名稱</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" readOnly />
                        </div>
                        {/* 單位名稱 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>單位名稱</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" readOnly />
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        {/* 聯絡電話 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>聯絡電話</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                        {/* 負責職員姓名 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>負責職員姓名</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" readOnly />
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        {/* 單位地址 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>單位地址</label>
                        <div className="col">
                            <input type="text" className="form-control" readOnly />
                        </div>
                    </div>
                </section>

                <section className="mb-4">
                    <div className="row">
                        <div className="col-12 font-weight-bold">
                            <h5>特別事故資料</h5>
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>事故發生日期和時間</label>
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
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>事故發生地點</label>
                        <div className="col">
                            <input type="text" className="form-control" />
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>事故類別</label>
                        <div className="col">
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="accidentCategory" id="accident-category-unusual-death" value="ACCIDENT_CATEGORY_UNUSUAL_DEATH" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="accident-category-unusual-death">服務使用者不尋常死亡／嚴重受傷導致死亡</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="accidentCategory" id="accident-category-missing" value="ACCIDENT_CATEGORY_MISSING" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="accident-category-missing">服務使用者失踪而需要報警求助</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="accidentCategory" id="accident-category-abuse" value="ACCIDENT_CATEGORY_ABUSE" onChange={radioButtonHandler} checked={form.accidentCategory === "ACCIDENT_CATEGORY_ABUSE"} />
                                <label className="form-check-label" htmlFor="accident-category-abuse" >
                                    已
                                    <span className="pl-4">
                                        <input className="form-check-input" type="radio" name="status" id="accident-category-status-establish" value="ACCIDENT_CATEGORY_STATUS_ESTABLISH" onChange={accidentCategoryAbuseDetailsRadioButtonHandler} checked={accidentCategoryAbuseDetails.status === "ACCIDENT_CATEGORY_STATUS_ESTABLISH"} />
                                        <label className="form-check-label" htmlFor="accident-category-status-establish" style={{ textDecoration: `${accidentCategoryAbuseDetails.status === "ACCIDENT_CATEGORY_STATUS_ESTABLISH" || !accidentCategoryAbuseDetails.status ? "none" : "line-through"}` }}>確立</label>
                                    </span>
                                    ／
                                    <span className="pl-4">
                                        <input className="form-check-input" type="radio" name="status" id="accident-category-status-doubt" value="ACCIDENT_CATEGORY_STATUS_DOUBT" onChange={accidentCategoryAbuseDetailsRadioButtonHandler} checked={accidentCategoryAbuseDetails.status === "ACCIDENT_CATEGORY_STATUS_DOUBT"} />
                                        <label className="form-check-label" htmlFor="accident-category-status-doubt" style={{ textDecoration: `${accidentCategoryAbuseDetails.status === "ACCIDENT_CATEGORY_STATUS_DOUBT" || !accidentCategoryAbuseDetails.status ? "none" : "line-through"}` }}>懷疑</label>
                                    </span>
                                    &nbsp;

                                    有服務使用者被
                                    <span className="pl-4">
                                        <input className="form-check-input" type="radio" name="person" id="accident-category-person-staff" value="ACCIDENT_CATEGORY_PERSON_STAFF" onChange={accidentCategoryAbuseDetailsRadioButtonHandler} checked={accidentCategoryAbuseDetails.person === "ACCIDENT_CATEGORY_PERSON_STAFF"} />
                                        <label className="form-check-label" htmlFor="accident-category-person-staff">
                                            <span style={{ cursor: "help", textDecoration: `${accidentCategoryAbuseDetails.person === "ACCIDENT_CATEGORY_PERSON_STAFF" || !accidentCategoryAbuseDetails.person ? "none" : "line-through"}` }} title={footNoteTwo}>職員<sup>2</sup></span>
                                        </label>
                                    </span>

                                    ／
                                    <span className="pl-4">
                                        <input className="form-check-input" type="radio" name="person" id="accident-category-person-other" value="ACCIDENT_CATEGORY_PERSON_OTHER" onChange={accidentCategoryAbuseDetailsRadioButtonHandler} checked={accidentCategoryAbuseDetails.person === "ACCIDENT_CATEGORY_PERSON_OTHER"} />
                                        <label className="form-check-label" htmlFor="accident-category-person-other" style={{ textDecoration: `${accidentCategoryAbuseDetails.person === "ACCIDENT_CATEGORY_PERSON_OTHER" || !accidentCategoryAbuseDetails.person ? "none" : "line-through"}` }}>其他服務使用者</label>
                                    </span>

                                    &nbsp;
                                    虐待
                                </label>
                            </div>
                            {
                                form.accidentCategory === "ACCIDENT_CATEGORY_ABUSE" &&
                                <div className="px-4">
                                    <div className="row ">
                                        <label className={`col-12 col-form-label ${styles.fieldTitle}`}>虐待性質</label>
                                        <div className="col">
                                            <div className="form-check form-check-inline mr-3">
                                                <input className="form-check-input" type="checkbox" name="abusiveNature" id="abusive-nature-body" value="ABUSIVE_NATURE_BODY" onClick={checkboxHandler} />
                                                <label className="form-check-label" htmlFor="abusive-nature-body">身體虐待</label>
                                            </div>
                                            <div className="form-check form-check-inline mr-3">
                                                <input className="form-check-input" type="checkbox" name="abusiveNature" id="abusive-nature-sexual-assault" value="ABUSIVE_NATURE_SEXUAL_ASSAULT" onClick={checkboxHandler} />
                                                <label className="form-check-label" htmlFor="abusive-nature-sexual-assault">性侵犯</label>
                                            </div>
                                            <div className="form-check form-check-inline mr-3">
                                                <input className="form-check-input" type="checkbox" name="abusiveNature" id="abusive-nature-mental" value="ABUSIVE_NATURE_MENTAL" onClick={checkboxHandler} />
                                                <label className="form-check-label" htmlFor="abusive-nature-mental">精神虐待</label>
                                            </div>
                                            <div className="form-check form-check-inline mr-3">
                                                <input className="form-check-input" type="checkbox" name="abusiveNature" id="abusive-nature-negligent-care" value="ABUSIVE_NATURE_NEGLIGENT_CARE" onClick={checkboxHandler} />
                                                <label className="form-check-label" htmlFor="abusive-nature-negligent-care">疏忽照顧</label>
                                            </div>
                                            <div className="form-check mb-2">
                                                <input className="form-check-input" type="checkbox" name="abusiveNature" id="abusive-nature-other" value="ABUSIVE_NATURE_OTHER" onClick={checkboxHandler} />
                                                <label className="form-check-label" htmlFor="abusive-nature-other">其他 (請註明)</label>
                                            </div>
                                            {
                                                form.abusiveNature.indexOf("ABUSIVE_NATURE_OTHER") > -1 &&
                                                <AutosizeTextarea className="form-control" placeholder="請註明" />
                                            }
                                        </div>
                                    </div>
                                </div>
                            }
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="accidentCategory" id="accident-category-conflict" value="ACCIDENT_CATEGORY_CONFLICT" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="accident-category-conflict">爭執以致有人身體受傷而需要報警求助</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="accidentCategory" id="accident-category-other" value="ACCIDENT_CATEGORY_OTHER" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="accident-category-other">其他嚴重事故以致影響服務單位的日常運作超過24小時／引起傳媒關注</label>
                            </div>

                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>事故被傳媒報導</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="mediaReported" id="media-reported-true" value="MEDIA_REPORTED_TRUE" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="media-reported-true">是</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="mediaReported" id="media-reported-false" value="MEDIA_REPORTED_FALSE" onChange={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="media-reported-false">否</label>
                            </div>
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>特別事故描述</label>
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
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>年齡</label>
                        <div className="col-12 col-md-4">
                            <input type="number" className="form-control" min={0} />
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        <div className={`col-12 ${styles.fieldTitle} ${styles.staffFieldLabel}`}>(b) 服務使用者 (二，如有)</div>
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
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>年齡</label>
                        <div className="col-12 col-md-4">
                            <input type="number" className="form-control" min={0} />
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        <div className={`col-12 ${styles.fieldTitle} ${styles.staffFieldLabel}`}>(c) 服務使用者 (三，如有)</div>
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
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>年齡</label>
                        <div className="col-12 col-md-4">
                            <input type="number" className="form-control" min={0} />
                        </div>
                    </div>
                </section>

                <section className="mb-4">
                    <div className="row">
                        <div className="col-12 font-weight-bold">
                            <h5><span style={{ cursor: "help" }} title={footNoteTwo}>有關職員<sup>2</sup></span>的資料 (如適用)</h5>
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
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>職位</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        <div className={`col-12 ${styles.fieldTitle} ${styles.staffFieldLabel}`}>(b) 職員 ( 二，如有 )</div>
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
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>職位</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        <div className={`col-12 ${styles.fieldTitle} ${styles.staffFieldLabel}`}>(c) 職員 ( 三，如有 )</div>
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
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>職位</label>
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
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>報警處理</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="police" id="police-true" value="POLICE_TRUE" onClick={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="police-true">有</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="police" id="police-false" value="POLICE_FALSE" onClick={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="police-false">沒有 (請註明)</label>
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
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>通知家人 / 親屬 / 監護人 / 保證人</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="notifyFamily" id="notify-family-true" value="NOTIFY_FAMILY_TRUE" onClick={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="notify-family-true">有</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="notifyFamily" id="notify-family-false" value="NOTIFY_FAMILY_FALSE" onClick={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="notify-family-false">沒有 (請註明)</label>
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
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>醫療安排</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="medical" id="medical-true" value="MEDICAL_TRUE" onClick={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="medical-true">有 (請註明)</label>
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
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>舉行多專業個案會議 / 為有關服務使用者訂定照顧計劃</label>
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
                                    <AutosizeTextarea className="form-control" placeholder="請註明，包括時間" />
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
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>需要回應外界團體(如：關注組、區議會、立法會等)的關注／查詢</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="response" id="response-true" value="RESPONSE_TRUE" onClick={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="response-true">有</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="response" id="response-false" value="RESPONSE_FALSE" onClick={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="response-false">沒有</label>
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
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>已作出即時的跟進行動，包括保護其他服務使用者的措施 (如適用)</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" placeholder="請註明" />
                        </div>
                    </div>

                    <div className="form-group row mb-4">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>跟進計劃</label>
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
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>姓名</label>
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
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>職位</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>

                    </div>
                    <div className="row mb-0 mb-md-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>電話</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>日期</label>
                        <div className="col-12 col-md-4">
                            <DatePicker
                                className="form-control"
                                selected={new Date()}
                                dateFormat="yyyy/MM/dd"
                                readOnly
                            />
                        </div>
                    </div>
                    {/* <div className="row">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>評語</label>
                        <div className="col">
                            <AutosizeTextarea className="form-control" />
                        </div>
                    </div> */}
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
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>高級服務經理/服務經理<br />姓名</label>
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
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>日期</label>
                        <div className="col-12 col-md-4">
                            <DatePicker className="form-control" dateFormat="yyyy/MM/dd" selected={date} onChange={(date) => setDate(date)} readOnly />
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>高級服務經理/<br />服務經理評語</label>
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
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>姓名</label>
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
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>職位</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                    </div>
                    <div className="row mb-0 mb-md-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>電話</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>日期</label>
                        <div className="col-12 col-md-4">
                            <DatePicker
                                className="form-control"
                                selected={new Date()}
                                dateFormat="yyyy/MM/dd"
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="row mb-0 mb-md-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>服務總監評語</label>
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

                <hr className="my-3" />

                <div>
                    <ol>
                        <li>{footNoteOne}</li>
                        <li>{footNoteTwo}</li>
                    </ol>
                </div>
            </div>
        </>
    )
}
