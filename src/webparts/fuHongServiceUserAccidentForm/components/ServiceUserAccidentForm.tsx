import * as React from 'react'
import { useState } from 'react';
import DatePicker from "react-datepicker";
import Header from "../../../components/Header/Header";
import "react-datepicker/dist/react-datepicker.css";
import "./custom.css";
export default function ServiceUserAccidentForm() {
    const [date, setDate] = useState(new Date());

    return (
        <>
            <div className="mb-3">
                <Header displayName="服務使用者意外填報表(一)" />
            </div>
            <div className="container">

                <section className="mb-3">
                    <div className="row">
                        <div className="col-12 font-weight-bold">
                            <h5>服務使用者資料</h5>
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 服務單位 */}
                        <label className="col-12 col-md-2 col-form-label">服務單位</label>
                        <div className="col-12 col-md-4">
                            <select className="form-control">
                                <option>請選擇服務單位</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group row ">
                        {/* 保險公司備案偏號 */}
                        <label className="col-12 col-md-2 col-form-label">保險公司備案偏號</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                    </div>


                    <hr className="my-3" />


                    <div className="form-group row mb-2">
                        {/* 服務使用者姓名 (英文)*/}
                        <label className="col-12 col-md-2 col-form-label">服務使用者姓名 (英文)</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                        {/* 服務使用者姓名 (中文)*/}
                        <label className="col-12 col-md-2 col-form-label">服務使用者姓名 (中文)</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 年齡*/}
                        <label className="col-12 col-md-2 col-form-label">年齡</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                        {/* 性別*/}
                        <label className="col-12 col-md-2 col-form-label">性別</label>
                        <div className="col-12 col-md-4 d-flex align-items-center">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="patientGender" id="gender-male" value="male" />
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
                        <label className="col-12 col-md-2 col-form-label">服務使用者檔案號碼</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                        {/* 接受服務類別*/}
                        <label className="col-12 col-md-2 col-form-label">接受服務類別</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 意外發生日期*/}
                        <label className="col-12 col-md-2 col-form-label">意外發生日期</label>
                        <div className="col-12 col-md-4">
                            {/* <input type="date"  /> */}
                            <DatePicker className="form-control" selected={date} onChange={(date) => setDate(date)} />
                        </div>
                        {/* 意外發生時間*/}
                        <label className="col-12 col-md-2 col-form-label">意外發生日期</label>
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
                        <label className="col-12 col-md-2 col-form-label">意外發生地點</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 是否使用輪椅*/}
                        <label className="col-12 col-md-2 col-form-label">是否使用輪椅</label>
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
                        <label className="col-12 col-md-2 col-form-label">智力障礙程度</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 自閉症譜系障礙(ASD) */}
                        <label className="col-12 col-md-2 col-form-label">自閉症譜系障礙(ASD)</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                    </div>
                </section>

                <section className="mb-3">
                    <div className="row">
                        <div className="col-12 font-weight-bold">
                            <h5>意外事件紀錄</h5>
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 服務使用者意外時情況*/}
                        <label className="col-12 col-md-2 col-form-label">服務使用者意外時情況</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="partientAcciedntScenario" id="scenario-sleep" value="sleeping" />
                                <label className="form-check-label" htmlFor="scenario-sleep">睡覺</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="partientAcciedntScenario" id="scenario-dinning" value="dinning" />
                                <label className="form-check-label" htmlFor="scenario-dinning">進食</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="partientAcciedntScenario" id="scenario-wash" value="washing" />
                                <label className="form-check-label" htmlFor="scenario-wash">梳洗</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="partientAcciedntScenario" id="scenario-toliet" value="toliet" />
                                <label className="form-check-label" htmlFor="scenario-toliet">如廁</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="partientAcciedntScenario" id="scenario-bath" value="bathing" />
                                <label className="form-check-label" htmlFor="scenario-bath">洗澡</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="partientAcciedntScenario" id="scenario-walk" value="walking" />
                                <label className="form-check-label" htmlFor="scenario-walk">步行期間</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="partientAcciedntScenario" id="scenario-walk" value="inside_activity" />
                                <label className="form-check-label" htmlFor="scenario-walk">參與服務單位內活動</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="partientAcciedntScenario" id="scenario-walk" value="outside_activity" />
                                <label className="form-check-label" htmlFor="scenario-walk">外出活動期間(請註明地點)</label>
                            </div>
                            <div className="">
                                <textarea className="form-control" />
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="partientAcciedntScenario" id="scenario-walk" value="outside_activity" />
                                <label className="form-check-label" htmlFor="scenario-walk">其他</label>
                            </div>
                            <div className="">
                                <textarea className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 服務使用者受傷部位*/}
                        <label className="col-12 col-md-2 col-form-label">
                            服務使用者受傷部位
                            <br />
                            (請上載相片 - 如有)
                        </label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" id="injury-head" value="injury_head" />
                                <label className="form-check-label" htmlFor="injury-head">頭部</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" id="injury-neck" value="injury_neck" />
                                <label className="form-check-label" htmlFor="injury-neck">頸部</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" id="injury-body" value="injury_body" />
                                <label className="form-check-label" htmlFor="injury-body">軀幹</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" id="injury-upper-limb" value="injury_upper_limb" />
                                <label className="form-check-label" htmlFor="injury-upper-limb">上肢</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" id="injury-lower-limb" value="injury_lower_limb" />
                                <label className="form-check-label" htmlFor="injury-lower-limb">下肢</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" id="injury-other" value="injury-other" />
                                <label className="form-check-label" htmlFor="injury-other">其他(請註明)</label>
                            </div>
                            <div className="">
                                <textarea className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 服務使用者意外後有否身體不適/受傷*/}
                        <label className="col-12 col-md-2 col-form-label">服務使用者意外後有否身體不適/受傷 </label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" id="uncomfortable-bleeding" value="uncomfortable-bleeding" />
                                <label className="form-check-label" htmlFor="uncomfortable-bleeding">流血</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" id="uncomfortable-bruise" value="uncomfortable-bruise" />
                                <label className="form-check-label" htmlFor="uncomfortable-bruise">瘀腫</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" id="uncomfortable-fracture" value="uncomfortable-fracture" />
                                <label className="form-check-label" htmlFor="uncomfortable-fracture">骨折</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" id="uncomfortable-dizzy" value="uncomfortable-dizzy" />
                                <label className="form-check-label" htmlFor="uncomfortable-dizzy">暈眩</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" id="uncomfortable-shock" value="uncomfortable-shock" />
                                <label className="form-check-label" htmlFor="uncomfortable-shock">休克/失去知覺</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="uncomfortable-other" value="uncomfortable-other" />
                                <label className="form-check-label" htmlFor="uncomfortable-other">其他(請註明)</label>
                            </div>
                            <div className="">
                                <textarea className="form-control" />
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="uncomfortable-injury" value="uncomfortable-injury" />
                                <label className="form-check-label" htmlFor="uncomfortable-injury">受傷情況</label>
                            </div>
                            <div className="">
                                <textarea className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 服務使用者有否出現不安全的行為*/}
                        <label className="col-12 col-md-2 col-form-label">服務使用者有否出現不安全的行為 </label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" id="behavior-others" value="behavior-others" />
                                <label className="form-check-label" htmlFor="behavior-others">傷害他人的動作</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" id="behavior-self" value="behavior-self" />
                                <label className="form-check-label" htmlFor="behavior-self">傷害自已的動作</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" id="behavior-getoff" value="behavior-getoff" />
                                <label className="form-check-label" htmlFor="behavior-getoff">除去身上的醫療器材</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" id="behavior-reject" value="behavior-reject" />
                                <label className="form-check-label" htmlFor="behavior-reject">拒絕使用輔助器材</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" id="behavior-other" value="behavior-other" />
                                <label className="form-check-label" htmlFor="behavior-other">其他(請註明)</label>
                            </div>
                            <div className="">
                                <textarea className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 相片及CCTV紀錄*/}
                        <label className="col-12 col-md-2 col-form-label">相片及CCTV紀錄</label>
                        <div className="col">
                            <div className="">
                                相片
                            </div>
                            <div className="">
                                CCTV記錄
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mb-3">
                    <div className="row">
                        <div className="col-12 font-weight-bold">
                            <h5>初步觀察的意外成因</h5>
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        {/* 環境因素 */}
                        <label className="col-12 col-md-2 col-form-label">環境因素</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" id="env-facotr-wet" value="env-facotr-wet" />
                                <label className="form-check-label" htmlFor="env-facotr-wet">地面濕滑</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" id="env-facotr-wet" value="env-facotr-wet" />
                                <label className="form-check-label" htmlFor="env-facotr-wet">地面不平</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" id="env-facotr-wet" value="env-facotr-wet" />
                                <label className="form-check-label" htmlFor="env-facotr-wet">障礙物品</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" id="env-facotr-wet" value="env-facotr-wet" />
                                <label className="form-check-label" htmlFor="env-facotr-wet">光線不足</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" id="env-facotr-wet" value="env-facotr-wet" />
                                <label className="form-check-label" htmlFor="env-facotr-wet">空間不足</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" id="env-facotr-wet" value="env-facotr-wet" />
                                <label className="form-check-label" htmlFor="env-facotr-wet">聲響刺激</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" id="env-facotr-wet" value="env-facotr-wet" />
                                <label className="form-check-label" htmlFor="env-facotr-wet">被別人碰撞</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" id="env-facotr-wet" value="env-facotr-wet" />
                                <label className="form-check-label" htmlFor="env-facotr-wet">被別人傷害</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" id="env-facotr-wet" value="env-facotr-wet" />
                                <label className="form-check-label" htmlFor="env-facotr-wet">輔助器材使用不當 (如輪椅／便椅未上鎖)</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="env-facotr-wet" value="env-facotr-wet" />
                                <label className="form-check-label" htmlFor="env-facotr-wet">其他</label>
                            </div>
                            <div className="">
                                <textarea className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        <label className="col-12 col-md-2 col-form-label">個人因素</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" id="env-facotr-wet" value="env-facotr-wet" />
                                <label className="form-check-label" htmlFor="env-facotr-wet">情緒不穩</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" id="env-facotr-wet" value="env-facotr-wet" />
                                <label className="form-check-label" htmlFor="env-facotr-wet">心急致傷</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" id="env-facotr-wet" value="env-facotr-wet" />
                                <label className="form-check-label" htmlFor="env-facotr-wet">進食時哽塞</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" id="env-facotr-wet" value="env-facotr-wet" />
                                <label className="form-check-label" htmlFor="env-facotr-wet">步履不穩</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" id="env-facotr-wet" value="env-facotr-wet" />
                                <label className="form-check-label" htmlFor="env-facotr-wet">抽搐</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="env-facotr-wet" value="env-facotr-wet" />
                                <label className="form-check-label" htmlFor="env-facotr-wet">其他個人因素</label>
                            </div>
                            <div className="">
                                <textarea className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        <label className="col-12 col-md-2 col-form-label">事發過程</label>
                        <div className="col">
                            <label htmlFor="procedure">(請註明事發地點附近之員工當時執行的職務)</label>
                            <textarea className="form-control" id="procedure" />
                        </div>
                    </div>
                </section>

                <section className="mb-3">
                    <div className="row">
                        <div className="col-12 font-weight-bold">
                            <h5>意外事件後之治療處理</h5>
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        {/* 服務單位即時治療/處理 */}
                        <label className="col-12 col-md-2 col-form-label">服務單位即時治療/處理</label>
                        <div className="col">
                            <textarea className="form-control" id="procedure" />
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 服務使用者意外時情況*/}
                        <label className="col-12 col-md-2 col-form-label">服務使用者意外時情況</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="partientAcciedntScenario" id="scenario-sleep" value="sleeping" />
                                <label className="form-check-label" htmlFor="scenario-sleep">醫生到診</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="partientAcciedntScenario" id="scenario-dinning" value="dinning" />
                                <label className="form-check-label" htmlFor="scenario-dinning">門診</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="partientAcciedntScenario" id="scenario-wash" value="washing" />
                                <label className="form-check-label" htmlFor="scenario-wash">急症室</label>
                            </div>
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
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 是否在醫院留醫 */}
                        <label className="col-12 col-md-2 col-form-label">是否在醫院留醫</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="partientAcciedntScenario" id="scenario-sleep" value="sleeping" />
                                <label className="form-check-label" htmlFor="scenario-sleep">是</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="partientAcciedntScenario" id="scenario-sleep" value="sleeping" />
                                <label className="form-check-label" htmlFor="scenario-sleep">否</label>
                            </div>
                            <div>
                                <label className="form-label">醫院名稱</label>
                                <textarea className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 報警處理 */}
                        <label className="col-12 col-md-2 col-form-label">報警處理</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="partientAcciedntScenario" id="scenario-sleep" value="sleeping" />
                                <label className="form-check-label" htmlFor="scenario-sleep">需要</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="partientAcciedntScenario" id="scenario-sleep" value="sleeping" />
                                <label className="form-check-label" htmlFor="scenario-sleep">不需要</label>
                            </div>
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
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 意外後中心即時應變措施 */}
                        <label className="col-12 col-md-2 col-form-label">意外後中心即時應變措施</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="partientAcciedntScenario" id="scenario-sleep" value="sleeping" />
                                <label className="form-check-label" htmlFor="scenario-sleep">有</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="partientAcciedntScenario" id="scenario-sleep" value="sleeping" />
                                <label className="form-check-label" htmlFor="scenario-sleep">沒有</label>
                            </div>
                            <div>
                                <label className="form-label">警署</label>
                                <textarea className="form-control" />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mb-3">
                    <div className="row">
                        <div className="col-12 font-weight-bold">
                            <h5>家屬聯絡</h5>
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        {/* 通知家屬日期及時間 */}
                        <label className="col-12 col-md-2 col-form-label">通知家屬日期及時間</label>
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
                        <label className="col-12 col-md-2 col-form-label">與服務使用者關係</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 家屬姓名 */}
                        <label className="col-12 col-md-2 col-form-label">家屬姓名</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 負責通知家屬的職員姓名 */}
                        <label className="col-12 col-md-2 col-form-label">負責通知家屬的職員姓名</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                        {/* 職位 */}
                        <label className="col-12 col-md-2 col-form-label">職位</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 服務使用者經治後情況 */}
                        <label className="col-12 col-md-2 col-form-label">服務使用者經治後情況</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                    </div>
                </section>

                <hr className="my-3" />

                <section className="mb-3">

                </section>
            </div>
        </>
    )
}
