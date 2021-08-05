import * as React from 'react'
import { useState } from 'react';
import DatePicker from "react-datepicker";
import Header from "../../../components/Header/Header";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./FuHongServiceUserAccidentForm.module.scss";
import "./custom.css";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as moment from 'moment';
import TextareaAutosize from 'react-textarea-autosize';
import StyledDropzone from "../../../components/Dropzone/Dropzone";
if (document.getElementById('workbenchPageContent') != null) {
    document.getElementById('workbenchPageContent').style.maxWidth = '1920px';
}

if (document.querySelector('.CanvasZone') != null) {
    (document.querySelector('.CanvasZone') as HTMLElement).style.maxWidth = '1920px';
}

interface IServiceUserAccidentForm {
    context: WebPartContext;
}

interface IState {
    partientAcciedntScenario: string;
    injury: string[];
    uncomfortable: string[];
    behavior: string[];
    envFactor: string[];
    personalFactor: string[];
    arrangement: string;
    isStayInHospital: string;
    police: string;
    contingencyMeasure: string;
    cctv: string;
    photo: string;
}

export default function ServiceUserAccidentForm({ context }: IServiceUserAccidentForm) {
    const [date, setDate] = useState(new Date());
    const [form, setForm] = useState<IState>({
        partientAcciedntScenario: "",
        injury: [],
        uncomfortable: [],
        behavior: [],
        envFactor: [],
        personalFactor: [],
        arrangement: "",
        isStayInHospital: "",
        police: "",
        contingencyMeasure: "",
        cctv: "",
        photo: ""
    });

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

    return (
        <>
            <div className="mb-3">
                <Header displayName="服務使用者意外填報表(一)" />
            </div>
            <div className="container px-4">

                <section className="mb-4">
                    <div className="row">
                        <div className="col-12 font-weight-bold">
                            <h5>服務使用者資料</h5>
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 服務單位 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>服務單位</label>
                        <div className="col-12 col-md-4">
                            <select className="form-control">
                                <option>請選擇服務單位</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group row ">
                        {/* 保險公司備案偏號 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>保險公司備案偏號</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                    </div>


                    <hr className="my-3" />


                    <div className="form-group row mb-2">
                        {/* 服務使用者姓名 (英文)*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>服務使用者姓名 (英文)</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                        {/* 服務使用者姓名 (中文)*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>服務使用者姓名 (中文)</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 年齡*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>年齡</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                        {/* 性別*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>性別</label>
                        <div className="col-12 col-md-4 d-flex align-items-center">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input form-check-lg" type="radio" name="patientGender" id="gender-male" value="male" />
                                <label className="form-check-label" htmlFor="gender-male">男</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="patientGender" id="gender-female" value="female" />
                                <label className="form-check-label" htmlFor="gender-female">女</label>
                            </div>
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 服務使用者檔案號碼*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>服務使用者檔案號碼</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                        {/* 接受服務類別*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>接受服務類別</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 意外發生日期*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>意外發生日期</label>
                        <div className="col-12 col-md-4">
                            {/* <input type="date"  /> */}
                            <DatePicker className="form-control" selected={date} onChange={(date) => setDate(date)} />
                        </div>
                        {/* 意外發生時間*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>意外發生日期</label>
                        <div className="col-12 col-md-4">
                            {/* <input type="time" className="form-control" /> */}
                            <DatePicker
                                className="form-control"
                                selected={date}
                                onChange={(date) => setDate(date)}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="Time"
                                dateFormat="h:mm aa"
                            />
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 意外發生地點*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>意外發生地點</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 是否使用輪椅*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>是否使用輪椅</label>
                        <div className="col-12 col-md-4 d-flex align-items-center">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="patientWheelchair" id="wheelchair-true" value="true" />
                                <label className="form-check-label" htmlFor="wheelchair-true">是</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="patientWheelchair" id="wheelchair-false" value="false" />
                                <label className="form-check-label" htmlFor="wheelchair-false">否</label>
                            </div>
                        </div>

                        {/* 智力障礙程度 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>智力障礙程度</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 自閉症譜系障礙(ASD) */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>自閉症譜系障礙(ASD)</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                    </div>
                </section>

                <section className="mb-4">
                    <div className="row">
                        <div className="col-12 font-weight-bold">
                            <h5>意外事件紀錄</h5>
                        </div>
                    </div>

                    <div className="form-group row mb-4">
                        {/* 服務使用者意外時情況*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>服務使用者意外時情況</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="partientAcciedntScenario" id="scenario-sleep" value="SCENARIO_SLEEPING" onClick={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="scenario-sleep">睡覺</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="partientAcciedntScenario" id="scenario-dinning" value="SCENARIO_DINNING" onClick={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="scenario-dinning">進食</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="partientAcciedntScenario" id="scenario-wash" value="SCENARIO_WASHING" onClick={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="scenario-wash">梳洗</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="partientAcciedntScenario" id="scenario-toliet" value="SCENARIO_TOLIET" onClick={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="scenario-toliet">如廁</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="partientAcciedntScenario" id="scenario-bath" value="SCENARIO_BATHING" onClick={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="scenario-bath">洗澡</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="partientAcciedntScenario" id="scenario-walk" value="SCENARIO_WALKING" onClick={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="scenario-walk">步行期間</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="partientAcciedntScenario" id="scenario_inside_activity" value="SCENARIO_INSIDE_ACTIVITY" onClick={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="scenario_inside_activity">參與服務單位內活動</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="partientAcciedntScenario" id="scenario_outside_activity" value="SCENARIO_OUTSIDE_ACTIVITY" onClick={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="scenario_outside_activity">外出活動期間(請註明地點)</label>
                            </div>
                            {
                                form.partientAcciedntScenario === "SCENARIO_OUTSIDE_ACTIVITY" &&
                                <div className="">
                                    <textarea className="form-control" placeholder={"請註明"} />
                                </div>
                            }
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="partientAcciedntScenario" id="scenario_other" value="SCENARIO_OTHER" onClick={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="scenario_other">其他</label>
                            </div>
                            {
                                form.partientAcciedntScenario === "SCENARIO_OTHER" &&
                                <div className="">
                                    <textarea className="form-control" placeholder={"請註明"} />
                                </div>
                            }
                        </div>
                    </div>

                    <div className="form-group row mb-4">
                        {/* 服務使用者受傷部位*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>
                            服務使用者受傷部位
                            <br />
                            (請上載相片 - 如有)
                        </label>
                        <div className="col">
                            <div className="form-check form-check-inline mr-0 mr-md-3">
                                <input className="form-check-input" type="checkbox" name="injury" id="injury-head" value="INJURY_HEAD" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="injury-head">頭部</label>
                            </div>
                            <div className="form-check form-check-inline mr-0 mr-md-3">
                                <input className="form-check-input" type="checkbox" name="injury" id="injury-neck" value="INJURY_NECK" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="injury-neck">頸部</label>
                            </div>
                            <div className="form-check form-check-inline mr-0 mr-md-3">
                                <input className="form-check-input" type="checkbox" name="injury" id="injury-body" value="INJURY_BODY" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="injury-body">軀幹</label>
                            </div>
                            <div className="form-check form-check-inline  mr-0 mr-md-3">
                                <input className="form-check-input" type="checkbox" name="injury" id="injury-upper-limb" value="INJURY_UPPER_LIMB" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="injury-upper-limb">上肢</label>
                            </div>
                            <div className="form-check form-check-inline  mr-0 mr-md-3">
                                <input className="form-check-input" type="checkbox" name="injury" id="injury-lower-limb" value="INJURY_LOWER_LIMB" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="injury-lower-limb">下肢</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" name="injury" id="injury-other" value="INJURY_OTHER" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="injury-other">其他(請註明)</label>
                            </div>
                            {
                                form.injury.indexOf("INJURY_OTHER") > -1 &&
                                <div className="">
                                    <textarea className="form-control" placeholder="請註明" />
                                </div>
                            }
                        </div>
                    </div>

                    <div className="form-group row mb-4">
                        {/* 服務使用者意外後有否身體不適/受傷*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>服務使用者意外後有否身體不適/受傷 </label>
                        <div className="col">
                            <div className="form-check form-check-inline  mr-0 mr-md-3">
                                <input className="form-check-input" type="checkbox" name="uncomfortable" id="uncomfortable-bleeding" value="UNCOMFORTABLE_BLEEDING" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="uncomfortable-bleeding">流血</label>
                            </div>
                            <div className="form-check form-check-inline  mr-0 mr-md-3">
                                <input className="form-check-input" type="checkbox" name="uncomfortable" id="uncomfortable-bruise" value="UNCOMFORTABLE_BRUISE" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="uncomfortable-bruise">瘀腫</label>
                            </div>
                            <div className="form-check form-check-inline  mr-0 mr-md-3">
                                <input className="form-check-input" type="checkbox" name="uncomfortable" id="uncomfortable-fracture" value="UNCOMFORTABLE_FRACTURE" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="uncomfortable-fracture">骨折</label>
                            </div>
                            <div className="form-check form-check-inline  mr-0 mr-md-3">
                                <input className="form-check-input" type="checkbox" name="uncomfortable" id="uncomfortable-dizzy" value="UNCOMFORTABLE_DIZZY" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="uncomfortable-dizzy">暈眩</label>
                            </div>
                            <div className="form-check form-check-inline  mr-0 mr-md-3">
                                <input className="form-check-input" type="checkbox" name="uncomfortable" id="uncomfortable-shock" value="UNCOMFORTABLE_SHOCK" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="uncomfortable-shock">休克/失去知覺</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" name="uncomfortable" id="uncomfortable-other" value="UNCOMFORTABLE_OTHER" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="uncomfortable-other">其他(請註明)</label>
                            </div>
                            {
                                form.uncomfortable.indexOf("UNCOMFORTABLE_OTHER") > -1 &&
                                <div className="">
                                    <textarea className="form-control" placeholder="請註明" />
                                </div>
                            }
                            <div className="my-2">
                                <label className={`form-check-label ${styles.buttonLabel}`} htmlFor="uncomfortable-injury">受傷情況</label>
                            </div>
                            <div className="">
                                <textarea className="form-control" placeholder="請註明" />
                            </div>

                        </div>
                    </div>

                    <div className="form-group row mb-4">
                        {/* 服務使用者有否出現不安全的行為*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>服務使用者有否出現不安全的行為 </label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="behavior" id="behavior-others" value="BEHAVIOR_OTHERS" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="behavior-others">傷害他人的動作</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="behavior" id="behavior-self" value="BEHAVIOR_SELF" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="behavior-self">傷害自已的動作</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="behavior" id="behavior-getoff" value="BEHAVIOR_GETOFF" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="behavior-getoff">除去身上的醫療器材</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="behavior" id="behavior-reject" value="BEHAVIOR_REJECT" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="behavior-reject">拒絕使用輔助器材</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="behavior" id="behavior-other" value="BEHAVIOR_OTHER" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="behavior-other">其他(請註明)</label>
                            </div>
                            {
                                form.behavior.indexOf("BEHAVIOR_OTHER") > -1 &&
                                <div className="">
                                    <textarea className="form-control" placeholder="請註明" />
                                </div>
                            }
                        </div>
                    </div>

                    <div className="form-group row mb-4">
                        {/* 相片及CCTV紀錄*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>相片及CCTV紀錄</label>
                        <div className="col">
                            <div className={styles.buttonLabel}>相片</div>
                            <div className="pl-2">
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="photo" id="photo-true" value="PHOTO_TRUE" onClick={radioButtonHandler} />
                                    <label className="form-check-label" htmlFor="photo-true">有 (上載照片)</label>
                                </div>
                                {
                                    form.photo === "PHOTO_TRUE" &&
                                    <StyledDropzone />
                                }
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="photo" id="photo-false" value="PHOTO_FALSE" onClick={radioButtonHandler} />
                                    <label className="form-check-label" htmlFor="photo-false">未能提供</label>
                                </div>

                            </div>
                            <div className={styles.buttonLabel}>CCTV記錄</div>
                            <div className="pl-2">
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="cctv" id="cctv-true" value="CCTV_TRUE" onClick={radioButtonHandler} />
                                    <label className="form-check-label" htmlFor="cctv-true">有 (註: 三個工作天交總辦事處)</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="cctv" id="cctv-false" value="CCTV_FALSE" onClick={radioButtonHandler} />
                                    <label className="form-check-label" htmlFor="cctv-false">未能提供</label>
                                </div>
                                {
                                    form.cctv === "CCTV_TRUE" &&
                                    <DatePicker className="form-control" selected={date} onChange={(date) => setDate(date)} />
                                }
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mb-4">
                    <div className="row">
                        <div className="col-12 font-weight-bold">
                            <h5>初步觀察的意外成因</h5>
                        </div>
                    </div>
                    <div className="form-group row mb-4">
                        {/* 環境因素 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>環境因素</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="envFactor" id="ENV-SLIPPERY-GROUND" value="ENV_SLIPPERY_GROUND" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="ENV-SLIPPERY-GROUND">地面濕滑</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="envFactor" id="ENV-UNEVEN-GROUND" value="ENV_UNEVEN_GROUND" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="ENV-UNEVEN-GROUND">地面不平</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="envFactor" id="ENV-OBSTACLE-ITEMS" value="ENV_OBSTACLE_ITEMS" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="ENV-OBSTACLE-ITEMS">障礙物品</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="envFactor" id="ENV-INSUFFICIENT-LIGHT" value="ENV_INSUFFICIENT_LIGHT" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="ENV-INSUFFICIENT-LIGHT">光線不足</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="envFactor" id="ENV-NOT-ENOUGH-SPACE" value="ENV_NOT_ENOUGH_SPACE" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="ENV-NOT-ENOUGH-SPACE">空間不足</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="envFactor" id="ENV-ACOUSTIC-STIMULATION" value="ENV_ACOUSTIC_STIMULATION" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="ENV-ACOUSTIC-STIMULATION">聲響刺激</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="envFactor" id="ENV-COLLIDED-BY-OTHERS" value="ENV_COLLIDED_BY_OTHERS" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="ENV-COLLIDED-BY-OTHERS">被別人碰撞</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="envFactor" id="ENV-HURT-BY-OTHERS" value="ENV_HURT_BY_OTHERS" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="ENV-HURT-BY-OTHERS">被別人傷害</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="envFactor" id="ENV-IMPROPER-USE-OF-ASSISTIVE-EQUIPMENT" value="ENV_IMPROPER_USE_OF_ASSISTIVE_EQUIPMENT" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="ENV-IMPROPER-USE-OF-ASSISTIVE-EQUIPMENT">輔助器材使用不當 (如輪椅／便椅未上鎖)</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" name="envFactor" id="ENV-OTHER" value="ENV_OTHER" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="ENV-OTHER">其他</label>
                            </div>
                            {
                                form.envFactor.indexOf("ENV_OTHER") > -1 &&
                                <div className="">
                                    <textarea className="form-control" placeholder="請註明" />
                                </div>
                            }
                        </div>
                    </div>

                    <div className="form-group row mb-4">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>個人因素</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="personalFactor" id="PERSONAL-EMOTIONAL-INSTABILITY" value="PERSONAL_EMOTIONAL_INSTABILITY" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="PERSONAL-EMOTIONAL-INSTABILITY">情緒不穩</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="personalFactor" id="PERSONAL-HEARTBROKEN" value="PERSONAL_HEARTBROKEN" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="PERSONAL-HEARTBROKEN">心急致傷</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="personalFactor" id="PERSONAL-CHOKING" value="PERSONAL_CHOKING" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="PERSONAL-CHOKING">進食時哽塞</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="personalFactor" id="PERSONAL-UNSTEADY-WALKING" value="PERSONAL_UNSTEADY_WALKING" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="PERSONAL-UNSTEADY-WALKING">步履不穩</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" name="personalFactor" id="PERSONAL-TWITCH" value="PERSONAL_TWITCH" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="PERSONAL-TWITCH">抽搐</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" name="personalFactor" id="PERSONAL-OTHER" value="PERSONAL_OTHER" onClick={checkboxHandler} />
                                <label className="form-check-label" htmlFor="PERSONAL-OTHER">其他個人因素</label>
                            </div>
                            {
                                form.personalFactor.indexOf("PERSONAL_OTHER") > -1 &&
                                <div className="">
                                    <textarea className="form-control" placeholder="請註明" />
                                </div>
                            }
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>事發過程</label>
                        <div className="col">
                            <label htmlFor="procedure">(請註明事發地點附近之員工當時執行的職務)</label>
                            <textarea className="form-control" id="procedure" placeholder="請註明" />
                        </div>
                    </div>
                </section>

                <section className="mb-4">
                    <div className="row">
                        <div className="col-12 font-weight-bold">
                            <h5>意外事件後之治療處理</h5>
                        </div>
                    </div>
                    <div className="form-group row mb-4">
                        {/* 服務單位即時治療/處理 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>服務單位即時治療/處理</label>
                        <div className="col">
                            <textarea className="form-control" id="procedure" />
                        </div>
                    </div>

                    <div className="form-group row mb-4">
                        {/* 就診安排*/}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>就診安排</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="arrangement" id="ARRANGEMENT_DOCTOR_VISIT" value="ARRANGEMENT_DOCTOR_VISIT" onClick={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="ARRANGEMENT_DOCTOR_VISIT">醫生到診</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="arrangement" id="ARRANGEMENT_OUTPATIENT" value="ARRANGEMENT_OUTPATIENT" onClick={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="ARRANGEMENT_OUTPATIENT">門診</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="arrangement" id="ARRANGEMENT_EMERGENCY_DEPARTMENT" value="ARRANGEMENT_EMERGENCY_DEPARTMENT" onClick={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="ARRANGEMENT_EMERGENCY_DEPARTMENT">急症室</label>
                            </div>
                            {
                                form.arrangement === "ARRANGEMENT_EMERGENCY_DEPARTMENT" &&
                                <>
                                    <div className="">
                                        <label className="form-label">醫院名稱</label>
                                        <input type="text" className="form-control" />
                                    </div>
                                    <div className="">
                                        <label className="form-label">到達時間</label>
                                        {/* <input className="form-control" type="time" /> */}
                                        <DatePicker className="form-control" selected={date} onChange={(date) => setDate(date)} />
                                    </div>
                                    <div className="">
                                        <label className="form-label">提供對服務使用者的治療</label>
                                        <textarea className="form-control" />
                                    </div>
                                </>
                            }

                        </div>
                    </div>

                    <div className="form-group row mb-4">
                        {/* 是否在醫院留醫 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>是否在醫院留醫</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="isStayInHospital" id="isStayInHospital-true" value="IS_STAY_IN_HOSPITAL_TRUE" onClick={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="isStayInHospital-true">是</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="isStayInHospital" id="isStayInHospital-false" value="IS_STAY_IN_HOSPITAL_FALSE" onClick={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="isStayInHospital-false">否</label>
                            </div>
                            {
                                form.isStayInHospital === "IS_STAY_IN_HOSPITAL_TRUE" &&
                                <div>
                                    <label className="form-label">醫院名稱</label>
                                    <input type="text" className="form-control" />
                                </div>
                            }
                        </div>
                    </div>

                    <div className="form-group row mb-4">
                        {/* 報警處理 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>報警處理</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="police" id="police-true" value="POLICE_TRUE" onClick={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="police-true">需要</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="police" id="police-false" value="POLICE_FALSE" onClick={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="police-false">不需要</label>
                            </div>
                            {
                                form.police === "POLICE_TRUE" &&
                                <>
                                    <div>
                                        <label className="form-label">日期及時間</label>
                                        {/* <input type="datetime-local" className="form-control" /> */}

                                        <DatePicker
                                            className="form-control"
                                            selected={date}
                                            onChange={(date) => setDate(date)}
                                            timeInputLabel="Time:"
                                            dateFormat="MM/dd/yyyy h:mm aa"
                                            showTimeInput
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">報案編號</label>
                                        <input type="text" className="form-control" />
                                    </div>
                                    <div>
                                        <label className="form-label">警署</label>
                                        <input type="text" className="form-control" />
                                    </div>
                                </>
                            }
                        </div>
                    </div>

                    <div className="form-group row mb-4">
                        {/* 意外後中心即時應變措施 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>意外後中心即時應變措施</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="contingencyMeasure" id="contingency-measure-true" value="CONTINGENCY_MEASURE_TRUE" onClick={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="contingency-measure-true">有</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="contingencyMeasure" id="contingency-measure-false" value="CONTINGENCY_MEASURE_FALSE" onClick={radioButtonHandler} />
                                <label className="form-check-label" htmlFor="contingency-measure-false">沒有</label>
                            </div>
                            {
                                form.contingencyMeasure === "CONTINGENCY_MEASURE_TRUE" &&
                                <div>
                                    <textarea className="form-control" placeholder="請註明" />
                                </div>
                            }
                        </div>
                    </div>
                </section>

                <section className="mb-4">
                    <div className="row">
                        <div className="col-12 font-weight-bold">
                            <h5>家屬聯絡</h5>
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        {/* 通知家屬日期及時間 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>通知家屬日期及時間</label>
                        <div className="col-12 col-md-4">
                            <DatePicker
                                className="form-control"
                                selected={date}
                                onChange={(date) => setDate(date)}
                                showTimeSelect
                                timeFormat="p"
                                timeIntervals={15}
                                dateFormat="Pp"
                            />
                        </div>
                        {/* 與服務使用者關係 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>與服務使用者關係</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                    </div>

                    <div className="form-group row mb-4">
                        {/* 家屬姓名 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>家屬姓名</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 負責通知家屬的職員姓名 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>負責通知家屬的職員姓名</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                        {/* 職位 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>職位</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 服務使用者經治後情況 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>服務使用者經診治後情況</label>
                        <div className="col-12 col-md-4">
                            <textarea className="form-control" />
                        </div>
                    </div>
                </section>

                <hr className="my-3" />

                <section className="mb-4">
                    <div className="form-group row mb-2">
                        {/* 填報人姓名 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>填報人姓名</label>
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
                        {/* 職級 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>日期</label>
                        <div className="col-12 col-md-4">
                            <DatePicker className="form-control" selected={date} onChange={(date) => setDate(date)} />
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>職級</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                    </div>
                </section>

                <hr className="my-3" />

                <section className="mb-4">
                    <div className="form-group row mb-2">
                        {/* 服務經理姓名 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>服務經理姓名</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>日期</label>
                        <div className="col-12 col-md-4">
                            <DatePicker className="form-control" selected={date} onChange={(date) => setDate(date)} />
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>服務經理評語</label>
                        <div className="col">
                            <textarea className="form-control" />
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        <div className="col-12">
                            <button className="btn btn-warning mr-3">批准</button>
                            <button className="btn btn-danger mr-3">拒絕</button>
                        </div>
                    </div>
                </section>

                <hr className="my-3" />

                <section className="mb-4">
                    <div className="form-group row mb-2">
                        {/* SD */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>SD姓名</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>SD評語</label>
                        <div className="col">
                            <textarea className="form-control" />
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        <div className="col-12">
                            <button className="btn btn-primary">儲存評語</button>
                        </div>
                    </div>
                </section>

                <hr className="my-3" />

                <section className="mb-4">
                    <div className="form-group row mb-2">
                        {/* SD */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>SPT姓名</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>SPT評語</label>
                        <div className="col-12 col-md-4">
                            <textarea className="form-control" />
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>指派調查員</label>
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
                    </div>
                    <div className="form-group row mb-2">
                        <div className="col-12">
                            <button className="btn btn-warning mr-3">批准</button>
                            <button className="btn btn-danger mr-3">拒絕</button>
                        </div>
                    </div>
                </section>

                <hr className="my-3" />

                <section className="mb-4">
                    <div className="row">
                        <div className="col-12 font-weight-bold">
                            <span>[此欄由高級物理治療師填寫]</span>
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 「意外報告 (二)」交由 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>「意外報告 (二)」交由</label>
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
                    </div>

                    <div className="form-group row mb-2">
                        {/* 評語 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>評語</label>
                        <div className="col">
                            <textarea className="form-control" placeholder="請註明" />
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 高級物理治療師姓名 */}
                        <label className={`col-12 col-md-2 col-form-label ${styles.fieldTitle}`}>高級物理治療師姓名</label>
                        <div className="col-12 col-md-4">
                            <PeoplePicker
                                context={context}
                                personSelectionLimit={1}
                                showtooltip={true}
                                principalTypes={[PrincipalType.User]}
                                resolveDelay={1000} />
                        </div>
                        {/* 日期 */}
                        <label className="col-2 col-form-label">日期</label>
                        <label className="col-4 col-form-label">
                            {`${moment(new Date()).format("DD-MMM-YYYY")}`}
                        </label>
                    </div>
                </section>

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
