import * as React from 'react'
import { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as moment from 'moment';
import Chart from "react-google-charts";
import useServiceLocation from '../../../hooks/useServiceLocation';
import { useOutsiderStats } from '../../../hooks/useOutsiderStats';
import { useOutsidersAccidentReportStats } from '../../../hooks/useOutsidersAccidentReportStats';

interface IDataset {
    "personalFactorEmotional": number;
    "personalFactorImpatient": number;
    "personalFactorChok": number;
    "personalFactorUnsteadyWalk": number;
    "personalFactorTwitch": number;
    "personalFactorOther": number;

}

const initialDataset: IDataset = {
    personalFactorEmotional: 0,
    personalFactorImpatient: 0,
    personalFactorChok: 0,
    personalFactorUnsteadyWalk: 0,
    personalFactorTwitch: 0,
    personalFactorOther: 0
}

const envFactorFilter = (item: any, dataset: IDataset): IDataset => {
    let result = dataset;
    if (item.PersonalFactorEmotional === true) {
        result.personalFactorEmotional += 1;
    }

    if (item.PersonalFactorImpatient === true) {
        result.personalFactorImpatient += 1;
    }

    if (item.PersonalFactorChok === true) {
        result.personalFactorChok += 1;
    }

    if (item.PersonalFactorUnsteadyWalk === true) {
        result.personalFactorUnsteadyWalk += 1;
    }

    if (item.PersonalFactorTwitch === true) {
        result.personalFactorTwitch += 1;
    }

    if (item.PersonalFactorOther === true) {
        result.personalFactorOther += 1;
    }


    return result;
}

const sampleOneParser = (envFactor: any[]): IDataset => {
    let dataset: IDataset = { ...initialDataset };
    envFactor.forEach((item) => {
        dataset = envFactorFilter(item, dataset);
    })
    return dataset
}


function OutsiderAccidentPersonal() {
    const [groupBy, setGroupBy] = useState("NON");
    const [personalFactorDataset, setPersonalFactorDataset] = useState<IDataset>(initialDataset);
    const [serivceLocation] = useServiceLocation();
    const [data, startDate, endDate, setStartDate, setEndDate, setServiceUnits] = useOutsidersAccidentReportStats();

    const multipleOptionsSelectParser = (event) => {
        let result = [];
        const selectedOptions = event.target.selectedOptions;
        for (let i = 0; i < selectedOptions.length; i++) {
            result.push(selectedOptions[i].value);
        }
        return result;
    }

    const statsTableSwitch = () => {
        let title = `${moment(startDate).format("MM/YYYY")} - ${moment(endDate).format("MM/YYYY")} 外界人士意外`
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
                                <h6>{`${title} - 意外成因-環境因素統計`}</h6>
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
                        <th scope="row">情緒不穩</th>
                        <th>{personalFactorDataset.personalFactorEmotional}</th>
                    </tr>
                    <tr>
                        <th scope="row">心急致傷</th>
                        <th>{personalFactorDataset.personalFactorImpatient}</th>
                    </tr>
                    <tr>
                        <th scope="row">進食時哽塞</th>
                        <th>{personalFactorDataset.personalFactorChok}</th>
                    </tr>
                    <tr>
                        <th scope="row">步履不穩</th>
                        <th>{personalFactorDataset.personalFactorUnsteadyWalk}</th>
                    </tr>
                    <tr>
                        <th scope="row">抽搐</th>
                        <th>{personalFactorDataset.personalFactorTwitch}</th>
                    </tr>
                    <tr>
                        <th scope="row">其他</th>
                        <th>{personalFactorDataset.personalFactorOther}</th>
                    </tr>
                </tbody>
            </table >
        )
    }

    const chartSwitch = () => {
        let title = `${moment(startDate).format("MM/YYYY")} - ${moment(endDate).format("MM/YYYY")} 外界人士意外`

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
                                        外界人士意外 - 意外成因-個人因素統計
                                    </div>
                                </div>
                                <div className="">
                                    <Chart
                                        chartType={"Bar"}
                                        loader={<div className="d-flex justify-content-center align-items-center"> <div className="spinner-border text-primary" /></div>}
                                        data={[
                                            ["個人因素", "數量"],
                                            ["情緒不穩", personalFactorDataset.personalFactorEmotional],
                                            ["心急致傷", personalFactorDataset.personalFactorImpatient],
                                            ["進食時哽塞", personalFactorDataset.personalFactorChok],
                                            ["步履不穩", personalFactorDataset.personalFactorUnsteadyWalk],
                                            ["抽搐", personalFactorDataset.personalFactorTwitch],
                                            ["其他", personalFactorDataset.personalFactorOther],
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
                                        外界人士意外 - 意外成因-個人因素統計
                                    </div>
                                </div>
                                <Chart
                                    chartType={"PieChart"}
                                    loader={<div className="d-flex justify-content-center align-items-center"> <div className="spinner-border text-primary" /></div>}
                                    data={
                                        [
                                            ["個人因素", "數量"],
                                            ["情緒不穩", personalFactorDataset.personalFactorEmotional],
                                            ["心急致傷", personalFactorDataset.personalFactorImpatient],
                                            ["進食時哽塞", personalFactorDataset.personalFactorChok],
                                            ["步履不穩", personalFactorDataset.personalFactorUnsteadyWalk],
                                            ["抽搐", personalFactorDataset.personalFactorTwitch],
                                            ["其他", personalFactorDataset.personalFactorOther],
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
                return null;
        }
    }

    useEffect(() => {
        switch (groupBy) {
            case "NON":
                setPersonalFactorDataset(sampleOneParser(data));
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
                    <h6 style={{ fontWeight: 600 }}>統計資料 &gt; 服務使用者意外統計 &gt; 意外成因 - 個人因素</h6>
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

export default OutsiderAccidentPersonal

