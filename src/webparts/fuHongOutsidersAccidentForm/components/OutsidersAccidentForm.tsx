import * as React from 'react'
import { useState } from 'react';
import DatePicker from "react-datepicker";
import Header from "../../../components/Header/Header";
import "react-datepicker/dist/react-datepicker.css";
import "./custom.css";

export default function OutsidersAccidentForm() {
    const [date, setDate] = useState(new Date());
    return (
        <>
            <div className="mb-3">
                <Header displayName="外界人士意外填報表(一)" />
            </div>
            <div className="container">
                <section className="mb-3">
                    <div className="row">
                        <div className="col-12 font-weight-bold">
                            <h5>檔案編號</h5>
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
                </section>

                <section className="mb-3">
                    <div className="form-group row mb-2">
                        {/* 服務使用者姓名 (中文)*/}
                        <label className="col-12 col-md-2 col-form-label">姓名 (中文)</label>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" />
                        </div>
                        {/* 服務使用者姓名 (英文)*/}
                        <label className="col-12 col-md-2 col-form-label">姓名 (英文)</label>
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
                        {/* 身份*/}
                        <label className="col-12 col-md-2 col-form-label">身份</label>
                        <div className="col-12 col-md-4">
                            <select className="form-control" >
                                <option>請選擇</option>
                                <option>訪客</option>
                            </select>
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
                                timeCaption="Time"
                                dateFormat="h:mm aa"
                            />
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 地點 */}
                        <label className="col-12 col-md-2 col-form-label">地點</label>
                        <div className="col">
                            <textarea className="form-control" />
                        </div>
                    </div>
                </section>

                <section className="mb-3">
                    <div className="row">
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
                            {/* 其他因素 */}
                            <label className="col-12 col-md-2 col-form-label">其他因素</label>
                            <div className="col">
                                <textarea className="form-control" />
                            </div>
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        {/* 事發過程 */}
                        <label className="col-12 col-md-2 col-form-label">事發過程</label>
                        <div className="col">
                            <textarea className="form-control" />
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        {/* 意外事件有否證人證人目擊事故發生經過? */}
                        <label className="col-12 col-md-2 col-form-label">意外事件有否證人證人目擊事故發生經過?</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="partientAcciedntScenario" id="scenario-sleep" value="sleeping" />
                                <label className="form-check-label" htmlFor="scenario-sleep">有</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="partientAcciedntScenario" id="scenario-dinning" value="dinning" />
                                <label className="form-check-label" htmlFor="scenario-dinning">沒有</label>
                            </div>
                            <div>
                                <label className="form-label">證人姓名</label>
                                <input type="text" className="form-control" />
                            </div>
                            <div>
                                <label className="form-label">聯絡電話</label>
                                <input type="text" className="form-control" />
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
                            <h5>意外事件後之處理</h5>
                        </div>
                    </div>
                    <div className="form-group row mb-2">
                        <label className="col-12 col-md-2 col-form-label">就診安排</label>
                        <div className="col">
                            <select className="form-control">
                                <option>急症室</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        <label className="col-12 col-md-2 col-form-label">報警處理</label>
                        <div className="col">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="patientGender" id="gender-male" value="male" />
                                <label className="form-check-label" htmlFor="gender-male">有</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="patientGender" id="gender-female" value="female" />
                                <label className="form-check-label" htmlFor="gender-female">沒有</label>
                            </div>
                            <div>
                                <label className="form-label">日期及時間</label>
                                <DatePicker
                                    className="form-control"
                                    selected={date}
                                    onChange={(date) => setDate(date)}
                                    timeInputLabel="Time:"
                                    dateFormat="MM/dd/yyyy h:mm aa"
                                    showTimeInput
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-group row mb-2">
                        <label className="col-12 col-md-2 col-form-label">家屬聯絡</label>
                        <div className="col-12 col-md-4 d-flex align-items-center">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="patientGender" id="gender-male" value="male" />
                                <label className="form-check-label" htmlFor="gender-male">有</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="patientGender" id="gender-female" value="female" />
                                <label className="form-check-label" htmlFor="gender-female">沒有</label>
                            </div>
                        </div>
                    </div>


                </section>
            </div>
        </>
    )
}
