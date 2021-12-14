import * as React from 'react'
import { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as moment from 'moment';
import useServiceLocation from '../../../hooks/useServiceLocation';
import Chart from "react-google-charts";
import { useServiceUserStats } from '../../../hooks/useServiceUserStats';

interface IDataset {
    mild: number;
    moderate: number;
    severe: number;
    extremeSevere: number;
    unknown: number;
}

const initialDataset: IDataset = {
    mild: 0,
    moderate: 0,
    severe: 0,
    extremeSevere: 0,
    unknown: 0
}

const intelligenceFilter = (intelligence: string, dataset: IDataset) => {
    let result = dataset;
    intelligence = intelligence.toUpperCase();
    switch (intelligence) {
        case "MILD":
            result.mild += 1;
            return result;
        case "MODERATE":
            result.moderate += 1;
            return result;
        case "SEVERE":
            result.severe += 1;
            return result;
        case "EXTREME_SEVERE":
            result.extremeSevere += 1;
            return result;
        case "UNKNOWN":
            result.unknown += 1;
            return result;
        default:
            return result;
    }

}

const sampleOneParser = (data: any[]): IDataset => {
    try {
        let result: IDataset = { ...initialDataset }
        if (Array.isArray(data)) {
            data.forEach((item) => {
                if (item.Intelligence) {
                    result = intelligenceFilter(item.Intelligence, result);
                }
            })
        }
        return result;
    } catch (err) {
        console.log(err);
        throw new Error("SampleOneParser error");
    }
}

function ServiceUserAccidentIntelligence() {
    const [groupBy, setGroupBy] = useState("NON");
    const [intelligenceDataset, setIntelligenceDataset] = useState<IDataset>(initialDataset);
    const [serivceLocation] = useServiceLocation();
    const [data, startDate, endDate, setStartDate, setEndDate, setServiceUnits] = useServiceUserStats();


    const multipleOptionsSelectParser = (event) => {
        let result = [];
        const selectedOptions = event.target.selectedOptions;
        for (let i = 0; i < selectedOptions.length; i++) {
            result.push(selectedOptions[i].value);
        }
        return result;
    }

    const byMonthTableComponent = () => {
        return (
            <table className="table" >
                <thead>
                    <tr>
                        <th scope="col"></th>
                        <th>總數</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">輕度</th>
                        <th>{intelligenceDataset.mild}</th>
                    </tr>
                    <tr>
                        <th scope="row">中度</th>
                        <th>{intelligenceDataset.moderate}</th>
                    </tr>
                    <tr>
                        <th scope="row">嚴重</th>
                        <th>{intelligenceDataset.severe}</th>
                    </tr>
                    <tr>
                        <th scope="row">極度嚴重</th>
                        <th>{intelligenceDataset.extremeSevere}</th>
                    </tr>
                    <tr>
                        <th scope="row">不知</th>
                        <th>{intelligenceDataset.unknown}</th>
                    </tr>
                </tbody>
            </table >
        )
    }

    const statsTableSwitch = () => {
        let title = `${moment(startDate).format("MM/YYYY")} - ${moment(endDate).format("MM/YYYY")} 服務使用者意外`
        switch (groupBy) {
            case "NON":
                return (
                    <React.Fragment>
                        <div className="row">
                            <div className="col-1">
                                <h6 style={{ fontWeight: 600 }}>
                                    標題:
                                </h6>
                            </div>
                            <div className="col-7">
                                <h6>{`${title} - 智力障礙程度`}</h6>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-7">
                                {byMonthTableComponent()}
                            </div>
                        </div>
                    </React.Fragment>
                )
            case "BY_MONTH":
            case "BY_MONTH_FINICIAL":
            case "BY_MONTH_CALENDAR":
            case "BY_YEAR_FINICIAL":
            case "BY_YEAR_CALENDAR":
            default:
                return null;
        }
    }

    const chartSwitch = () => {
        switch (groupBy) {
            case "NON":
                return (
                    <React.Fragment>
                        <div className="row">
                            <div className="col-6">
                                <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                    <div className="">
                                        {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                    </div>
                                    <div className="">
                                        新發生意外或事故總數
                                    </div>
                                </div>
                                <div className="">
                                    <Chart
                                        chartType={"Bar"}
                                        loader={<div className="d-flex justify-content-center align-items-center"> <div className="spinner-border text-primary" /></div>}
                                        data={[
                                            ["智力障礙程度", "數量"],
                                            ["輕度", intelligenceDataset.mild],
                                            ["中度", intelligenceDataset.moderate],
                                            ["嚴重", intelligenceDataset.severe],
                                            ["極度嚴重", intelligenceDataset.extremeSevere],
                                            ["不知", intelligenceDataset.unknown]
                                        ]}
                                    />

                                </div>
                            </div>
                            <div className="col-6">
                                <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                    <div className="">
                                        {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                    </div>
                                    <div className="">
                                        新發生意外或事故總數
                                    </div>
                                </div>
                                <Chart
                                    chartType={"PieChart"}
                                    loader={<div className="d-flex justify-content-center align-items-center"> <div className="spinner-border text-primary" /></div>}
                                    data={
                                        [
                                            ["智力障礙程度", "數量"],
                                            ["輕度", intelligenceDataset.mild],
                                            ["中度", intelligenceDataset.moderate],
                                            ["嚴重", intelligenceDataset.severe],
                                            ["極度嚴重", intelligenceDataset.extremeSevere],
                                            ["不知", intelligenceDataset.unknown]
                                        ]
                                    }
                                />
                            </div>
                        </div>
                    </React.Fragment>
                )
            case "BY_MONTH":
            case "BY_MONTH_FINICIAL":
            case "BY_MONTH_CALENDAR":
            case "BY_YEAR_FINICIAL":
            case "BY_YEAR_CALENDAR":
            default:
                console.log("default");
        }
    }

    useEffect(() => {
        switch (groupBy) {
            case "NON":
                setIntelligenceDataset(sampleOneParser(data))
            case "BY_MONTH":
            case "BY_MONTH_FINICIAL":
            case "BY_MONTH_CALENDAR":
            case "BY_YEAR_FINICIAL":
            case "BY_YEAR_CALENDAR":
            default:
                console.log("default");
        }
    }, [groupBy, data])

    return (
        <div>
            <div className="row mb-3">
                <div className="col">
                    <h6 style={{ fontWeight: 600 }}>統計資料 &gt; 服務使用者意外統計 &gt; 智力障礙程度</h6>
                </div>
            </div>

            <div className="row">
                <div className="col">
                    <div className="mb-3" style={{ fontWeight: 600 }}>
                        發生日期
                    </div>
                    <div className="d-flex flex-column py-1">
                        <div className="mb-3 d-flex">
                            <div className="mr-3">
                                由
                            </div>
                            <DatePicker className="form-control" dateFormat="yyyy/MM/dd" selected={startDate} onChange={(date) => setStartDate(date)} />
                        </div>
                        <div className="d-flex">
                            <div className="mr-3">
                                至
                            </div>
                            <DatePicker className="form-control" dateFormat="yyyy/MM/dd" selected={endDate} onChange={(date) => setEndDate(date)} />
                        </div>
                    </div>
                </div>
                <div className="col" >
                    <div className="mb-3" style={{ fontWeight: 600 }}>
                        日期分組
                    </div>
                    {/* <div className="" style={{ overflowY: "scroll", border: "1px solid gray", height: 100 }}>

                    </div> */}
                    <select multiple className="form-control" onChange={(event) => {
                        const value = event.target.value;
                        setGroupBy(value);
                    }}>
                        <option value="NON">不需要</option>
                        <option value="BY_MONTH">按月</option>
                        <option value="BY_MONTH_FINICIAL">按月 - 財政年度</option>
                        <option value="BY_MONTH_CALENDAR">按月 - 日曆年度</option>
                        <option value="BY_YEAR_FINICIAL">按年 - 財政年度</option>
                        <option value="BY_YEAR_CALENDAR">按年 - 日曆年度</option>
                    </select>
                </div>
                <div className="col" >
                    <div className="mb-3" style={{ fontWeight: 600 }}>
                        服務單位
                    </div>
                    {/* <div className="" style={{ overflowY: "scroll", border: "1px solid gray", height: 100 }}>

                    </div> */}
                    <select multiple className="form-control" onChange={(event) => {
                        const selectedOptions = multipleOptionsSelectParser(event);
                        setServiceUnits(selectedOptions);
                    }}>
                        <option value="ALL">--- 所有 ---</option>
                        {
                            serivceLocation.map((item) => <option value={item}>{item}</option>)
                        }
                    </select>
                </div>
                <div className="col"></div>
            </div>
            <div className="mb-1" style={{ fontWeight: 600, fontSize: 17 }}>
                統計結果
            </div>
            <div className="mb-2">
                <div className="mb-2" style={{ fontWeight: 600 }}>
                    統計資料
                </div>
                {statsTableSwitch()}
            </div>
            <div className="">
                <div className="" style={{ fontWeight: 600 }}>
                    統計圖表
                </div>
                {chartSwitch()}
            </div>
        </div>
    )
}

export default ServiceUserAccidentIntelligence
