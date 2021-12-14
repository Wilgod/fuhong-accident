import * as React from 'react'
import { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as moment from 'moment';
import { useServiceUserStats } from '../../../hooks/useServiceUserStats';
import Chart from "react-google-charts";
import useServiceLocation from '../../../hooks/useServiceLocation';

interface IDataset {
    "envSlipperyGround": number;
    "envUnevenGround": number;
    "envObstacleItems": number;
    "envInsufficientLight": number;
    "envNotEnoughSpace": number;
    "envAcousticStimulation": number;
    "envCollidedByOthers": number;
    "envHurtByOthers": number;
    "envImproperUseOfAssistiveEquipment": number;
    "envOther": number;

}

const initialDataset: IDataset = {
    envAcousticStimulation: 0,
    envCollidedByOthers: 0,
    envHurtByOthers: 0,
    envImproperUseOfAssistiveEquipment: 0,
    envInsufficientLight: 0,
    envNotEnoughSpace: 0,
    envObstacleItems: 0,
    envOther: 0,
    envSlipperyGround: 0,
    envUnevenGround: 0
}

const envFactorFilter = (factor: string, dataset: IDataset): IDataset => {
    let result = dataset;
    switch (factor) {
        case "ENV_SLIPPERY_GROUND":
            result.envSlipperyGround += 1;
            return result;
        case "ENV_UNEVEN_GROUND":
            result.envUnevenGround += 1;
            return result;
        case "ENV_OBSTACLE_ITEMS":
            result.envObstacleItems += 1;
            return result;
        case "ENV_INSUFFICIENT_LIGHT":
            result.envInsufficientLight += 1;
            return result;
        case "ENV_NOT_ENOUGH_SPACE":
            result.envNotEnoughSpace += 1;
            return result;
        case "ENV_ACOUSTIC_STIMULATION":
            result.envAcousticStimulation += 1;
            return result;
        case "ENV_COLLIDED_BY_OTHERS":
            result.envCollidedByOthers += 1;
            return result;
        case "ENV_HURT_BY_OTHERS":
            result.envCollidedByOthers += 1;
            return result;
        case "ENV_IMPROPER_USE_OF_ASSISTIVE_EQUIPMENT":
            result.envImproperUseOfAssistiveEquipment += 1;
            return result;
        case "ENV_OTHER":
            result.envOther += 1;
            return result;
        default: return result;
    }
}

const sampleOneParser = (envFactor: any[]): IDataset => {
    let dataset: IDataset = { ...initialDataset };
    envFactor.forEach((item) => {
        if (item.ObserveEnvironmentFactor) {
            let arr = JSON.parse(item.ObserveEnvironmentFactor);
            if (Array.isArray(arr)) {
                arr.forEach((factor) => {
                    dataset = envFactorFilter(factor, dataset);
                })
            }
        }
    })
    return dataset
}


function ServiceUserAccidentEnv() {
    const [groupBy, setGroupBy] = useState("NON");
    const [envFactorDataset, setEnvFactorDataset] = useState<IDataset>(initialDataset);
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
    console.log(data);
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
                        <th scope="row">地面濕滑</th>
                        <th>{envFactorDataset.envSlipperyGround}</th>
                    </tr>
                    <tr>
                        <th scope="row">地面不平</th>
                        <th>{envFactorDataset.envUnevenGround}</th>
                    </tr>
                    <tr>
                        <th scope="row">障礙物品</th>
                        <th>{envFactorDataset.envNotEnoughSpace}</th>
                    </tr>
                    <tr>
                        <th scope="row">光線不足</th>
                        <th>{envFactorDataset.envInsufficientLight}</th>
                    </tr>
                    <tr>
                        <th scope="row">空間不足</th>
                        <th>{envFactorDataset.envNotEnoughSpace}</th>
                    </tr>
                    <tr>
                        <th scope="row">聲響刺激</th>
                        <th>{envFactorDataset.envAcousticStimulation}</th>
                    </tr>
                    <tr>
                        <th scope="row">被別人碰撞</th>
                        <th>{envFactorDataset.envCollidedByOthers}</th>
                    </tr>
                    <tr>
                        <th scope="row">被別人傷害</th>
                        <th>{envFactorDataset.envHurtByOthers}</th>
                    </tr>
                    <tr>
                        <th scope="row">輔助器材使用不當 (如輪椅／便椅未上鎖)</th>
                        <th>{envFactorDataset.envImproperUseOfAssistiveEquipment}</th>
                    </tr>
                    <tr>
                        <th scope="row">其他</th>
                        <th>{envFactorDataset.envOther}</th>
                    </tr>
                </tbody>
            </table >
        )
    }

    const chartSwitch = () => {
        let title = `${moment(startDate).format("MM/YYYY")} - ${moment(endDate).format("MM/YYYY")} 服務使用者意外`

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
                                        服務使用者意外 - 意外成因-環境因素統計
                                    </div>
                                </div>
                                <div className="">
                                    <Chart
                                        chartType={"Bar"}
                                        loader={<div className="d-flex justify-content-center align-items-center"> <div className="spinner-border text-primary" /></div>}
                                        data={[
                                            ["環境因素", "數量"],
                                            ["地面濕滑", envFactorDataset.envSlipperyGround],
                                            ["地面不平", envFactorDataset.envUnevenGround],
                                            ["障礙物品", envFactorDataset.envNotEnoughSpace],
                                            ["光線不足", envFactorDataset.envInsufficientLight],
                                            ["空間不足", envFactorDataset.envNotEnoughSpace],
                                            ["聲響刺激", envFactorDataset.envAcousticStimulation],
                                            ["被別人碰撞", envFactorDataset.envCollidedByOthers],
                                            ["被別人傷害", envFactorDataset.envHurtByOthers],
                                            ["輔助器材使用不當 (如輪椅／便椅未上鎖)", envFactorDataset.envImproperUseOfAssistiveEquipment],
                                            ["其他", envFactorDataset.envOther],
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
                                        服務使用者意外 - 意外成因-環境因素統計
                                    </div>
                                </div>
                                <Chart
                                    chartType={"PieChart"}
                                    loader={<div className="d-flex justify-content-center align-items-center"> <div className="spinner-border text-primary" /></div>}
                                    data={
                                        [
                                            ["環境因素", "數量"],
                                            ["地面濕滑", envFactorDataset.envSlipperyGround],
                                            ["地面不平", envFactorDataset.envUnevenGround],
                                            ["障礙物品", envFactorDataset.envNotEnoughSpace],
                                            ["光線不足", envFactorDataset.envInsufficientLight],
                                            ["空間不足", envFactorDataset.envNotEnoughSpace],
                                            ["聲響刺激", envFactorDataset.envAcousticStimulation],
                                            ["被別人碰撞", envFactorDataset.envCollidedByOthers],
                                            ["被別人傷害", envFactorDataset.envHurtByOthers],
                                            ["輔助器材使用不當 (如輪椅／便椅未上鎖)", envFactorDataset.envImproperUseOfAssistiveEquipment],
                                            ["其他", envFactorDataset.envOther],
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
                setEnvFactorDataset(sampleOneParser(data));
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
                    <h6 style={{ fontWeight: 600 }}>統計資料 &gt; 服務使用者意外統計 &gt; 意外成因 - 環境因素</h6>
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

export default ServiceUserAccidentEnv

