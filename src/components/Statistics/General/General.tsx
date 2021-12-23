import * as React from 'react'
import { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as moment from 'moment';
import Chart from "react-google-charts";
import useServiceLocation from '../../../hooks/useServiceLocation';
import useGeneralStats from '../../../hooks/useGeneralStats';

interface IDataset {
    sui: number;
    pui: number;
    sih: number;
    sid: number;
    oin: number;
}

interface ISampleTwoDataset {
    month: string;
    dataset: IDataset
}

interface ISampleFourDataset {
    year: number;
    dataset: IMonth;
}

interface ISampleFiveDataset {
    year: number;
    dataset: IDataset;
}

interface ISampleSixDataset {
    year: number;
    dataset: IDataset;
}

interface IMonth {
    jan: number;
    feb: number;
    mar: number;
    apr: number;
    may: number;
    jun: number;
    jul: number;
    aug: number;
    sep: number;
    oct: number;
    nov: number;
    dec: number;
}

const initialDataset: IDataset = {
    sui: 0,
    pui: 0,
    sih: 0,
    sid: 0,
    oin: 0
}

const initialDatasetMonth: IMonth = {
    apr: 0,
    aug: 0,
    dec: 0,
    feb: 0,
    jan: 0,
    jul: 0,
    jun: 0,
    mar: 0,
    may: 0,
    nov: 0,
    oct: 0,
    sep: 0
}

const unitFilter = (formType: string, dataset: IDataset) => {
    let result = { ...dataset };

    switch (formType) {
        case "SUI":
            result.sui = result.sui + 1;
            return result;
        case "PUI":
            result.pui = result.pui + 1;
            return result;
        case "SIH":
            result.sih = result.sih + 1;
            return result;
        case "SID":
            result.sid = result.sid + 1;
            return result;
        case "OIN":
            result.oin = result.oin + 1;
            return result;
        default:
            return result;
    }
}

const monthFilter = (month: number, dataset: IMonth = initialDatasetMonth): IMonth => {
    let result = { ...dataset };
    switch (month) {
        case 1:
            result.jan = result.jan + 1;
            return result;
        case 2:
            result.feb = result.feb + 1;
            return result;
        case 3:
            result.mar = result.mar + 1;
            return result;
        case 4:
            result.apr = result.apr + 1;
            return result;
        case 5:
            result.may = result.may + 1;
            return result;
        case 6:
            result.jun = result.jun + 1;
            return result;
        case 7:
            result.jul = result.jul + 1;
            return result;
        case 8:
            result.aug = result.aug + 1;
            return result;
        case 9:
            result.sep = result.sep + 1;
            return result;
        case 10:
            result.oct = result.oct + 1;
            return result;
        case 11:
            result.nov = result.nov + 1;
            return result;
        case 12:
            result.dec = result.dec + 1;
            return result;
        default: return;
    }
}

const sampleOneParser = (data: any[]): IDataset => {
    try {
        let result: IDataset = { ...initialDataset }
        if (Array.isArray(data)) {
            data.forEach((item) => {
                if (item.CaseNumber) {
                    const formType: string = item.CaseNumber.split("-")[0];
                    result = unitFilter(formType, result);
                }
            })
        }
        return result;
    } catch (err) {
        console.error(err);
        throw new Error("sampleOneParser error");
    }
}

const sampleTwoParser = (data: any[]): ISampleTwoDataset[] => {
    let m = new Map<string, IDataset>();
    let result: ISampleTwoDataset[] = [];
    data.forEach((item) => {
        if ((item.AccidentTime || item.IncidentTime) && item.CaseNumber) {
            const formType: string = item.CaseNumber.split("-")[0];
            const date = new Date(item.AccidentTime || item.IncidentTime);
            const formattedDate = moment(date).format("MM/yyyy");
            if (m.has(formattedDate)) {
                let oldDataset = m.get(formattedDate);
                let newDataset = unitFilter(formType, oldDataset);
                m.set(formattedDate, newDataset);
            } else {
                let newDataset = unitFilter(formType, initialDataset);
                m.set(formattedDate, newDataset);
            }
        }
    });

    m.forEach((value, key) => {
        let item: ISampleTwoDataset = { month: key, dataset: value }
        result.push(item);
    })

    return result;
}

const sampleThreeParser = (data: any[]) => {

}

const sampleFourParser = (data: any[], startDate: Date, endDate: Date): ISampleFourDataset[] => {
    let result: ISampleFourDataset[] = [];
    let m = new Map<number, IMonth>();

    const startYear = startDate.getFullYear()
    const endYear = endDate.getFullYear();
    const distance = endYear - startYear;
    for (let i = distance; i > 0; i--) {
        let a = new Date(new Date().setFullYear(endYear - i)).getFullYear()
        m.set(a, { ...initialDatasetMonth });
    }

    data.forEach((item) => {
        if (item.AccidentTime || item.IncidentTime) {
            const year = new Date(item.AccidentTime || item.IncidentTime).getFullYear();
            const month = new Date(item.AccidentTime || item.IncidentTime).getMonth() + 1;
            if (m.has(year)) {
                let oldDataset = m.get(year);
                let newDataset = monthFilter(month, oldDataset);
                m.set(year, newDataset);
            } else {
                let newDataset = monthFilter(month);
                m.set(year, newDataset);
            }
        }
    })

    m.forEach((value, key) => {
        let item: ISampleFourDataset = { year: key, dataset: value }
        result.push(item);
    })

    return result
}
const sampleFiveParser = (data: any[], startDate: Date, endDate: Date): ISampleFiveDataset[] => {
    let result: ISampleFiveDataset[] = []
    let m = new Map<string, IDataset>();

    const startYear = startDate.getFullYear()
    const endYear = endDate.getFullYear();
    const distance = endYear - startYear;
    for (let i = distance; i > 0; i--) {
        let a = new Date(new Date().setFullYear(endYear - i)).getFullYear()
        m.set(a + "", { ...initialDataset });
    }

    return result;
}
const sampleSixParser = (data: any[], startDate: Date, endDate: Date): ISampleSixDataset[] => {
    let result: ISampleSixDataset[] = []
    let m = new Map<string, IDataset>();

    const startYear = startDate.getFullYear()
    const endYear = endDate.getFullYear();
    const distance = endYear - startYear;
    for (let i = distance; i > 0; i--) {
        let a = new Date(new Date().setFullYear(endYear - i)).getFullYear()
        m.set(a.toString(), { ...initialDataset });
    }

    data.forEach((item) => {
        if ((item.AccidentTime || item.IncidentTime) && item.CaseNumber) {
            const year = new Date(item.AccidentTime || item.IncidentTime).getFullYear().toString();
            const month = new Date(item.AccidentTime || item.IncidentTime).getMonth() + 1;
            const formType: string = item.CaseNumber.split("-")[0];
            if (m.has(year)) {
                let oldDataset = m.get(year);
                let newDataset = unitFilter(formType, oldDataset);
                m.set(year, newDataset);
            } else {
                let newDataset = unitFilter(formType, { ...initialDataset });
                m.set(year, newDataset);
            }
        }
    })

    m.forEach((value, key) => {
        let item: ISampleSixDataset = { year: +key, dataset: value }
        result.push(item);
    })

    return result;
}

function General() {
    const [groupBy, setGroupBy] = useState("NON");
    const [serivceLocation] = useServiceLocation();
    const [data, startDate, endDate, setStartDate, setEndDate, setServiceUnits] = useGeneralStats();
    const [unitDataset, setUnitDataset] = useState<IDataset>(initialDataset);
    const multipleOptionsSelectParser = (event) => {
        let result = [];
        const selectedOptions = event.target.selectedOptions;
        for (let i = 0; i < selectedOptions.length; i++) {
            result.push(selectedOptions[i].value);
        }
        return result;
    }
    console.log(sampleTwoParser(data))
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
                        <th scope="row">服務使用者意外</th>
                        <th>{unitDataset.sui}</th>
                    </tr>
                    <tr>
                        <th scope="row">外界人士意外</th>
                        <th>{unitDataset.pui}</th>
                    </tr>
                    <tr>
                        <th scope="row">特別事故(牌照事務處)</th>
                        <th>{unitDataset.sih}</th>
                    </tr>
                    <tr>
                        <th scope="row">特別事故(津貼科)</th>
                        <th>{unitDataset.sid}</th>
                    </tr>
                    <tr>
                        <th scope="row">其他事故</th>
                        <th>{unitDataset.oin}</th>
                    </tr>
                </tbody>
            </table >
        )
    }

    useEffect(() => {
        switch (groupBy) {
            case "NON":
                setUnitDataset(sampleOneParser(data))
            case "BY_MONTH":
            case "BY_MONTH_FINICIAL":
            case "BY_MONTH_CALENDAR":
            case "BY_YEAR_FINICIAL":
            case "BY_YEAR_CALENDAR":
            default:
                console.log("default");
        }
    }, [groupBy, data])

    const statsTableSwitch = () => {
        let title = `${moment(startDate).format("MM/YYYY")} - ${moment(endDate).format("MM/YYYY")}`
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
                                <h6>{`${title} - 新發生意外或事故總數`}</h6>
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
                return (
                    <>
                        <div className="row">
                            <div className="col-1">
                                <h6 style={{ fontWeight: 600 }}>
                                    標題:
                                </h6>
                            </div>
                            <div className="col-7">
                                <h6>{`${title} - 新發生意外或事故 (每月總數)`}</h6>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">服務使用者意外</th>
                                            <th scope="col">外界人士意外</th>
                                            <th scope="col">特別事故 (牌照事務處)</th>
                                            <th scope="col">特別事故 (津貼科)</th>
                                            <th scope="col">其他事故</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sampleTwoParser(data).map((item) => {
                                            return (
                                                <tr>
                                                    <th scope="row">{item.month}</th>
                                                    <td>{item.dataset.sui}</td>
                                                    <td>{item.dataset.pui}</td>
                                                    <td>{item.dataset.sih}</td>
                                                    <td>{item.dataset.sid}</td>
                                                    <td>{item.dataset.oin}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )
            case "BY_MONTH_FINICIAL":
                return (
                    <>
                        <>
                            <div className="row">
                                <div className="col-1">
                                    <h6 style={{ fontWeight: 600 }}>
                                        標題:
                                    </h6>
                                </div>
                                <div className="col-7">
                                    <h6>{`${title} - 新發生意外或事故`}</h6>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Jan</th>
                                                <th scope="col">Feb</th>
                                                <th scope="col">Mar</th>
                                                <th scope="col">Apr</th>
                                                <th scope="col">May</th>
                                                <th scope="col">Jun</th>
                                                <th scope="col">Jul</th>
                                                <th scope="col">Aug</th>
                                                <th scope="col">Sep</th>
                                                <th scope="col">Oct</th>
                                                <th scope="col">Nov</th>
                                                <th scope="col">Dec</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sampleFourParser(data, startDate, endDate).map((item) => {
                                                return (
                                                    <tr>
                                                        <th scope="row">{item.year}</th>
                                                        <td>{item.dataset.jan}</td>
                                                        <td>{item.dataset.feb}</td>
                                                        <td>{item.dataset.mar}</td>
                                                        <td>{item.dataset.apr}</td>
                                                        <td>{item.dataset.may}</td>
                                                        <td>{item.dataset.jun}</td>
                                                        <td>{item.dataset.jun}</td>
                                                        <td>{item.dataset.aug}</td>
                                                        <td>{item.dataset.sep}</td>
                                                        <td>{item.dataset.oct}</td>
                                                        <td>{item.dataset.nov}</td>
                                                        <td>{item.dataset.dec}</td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    </>
                )
            case "BY_MONTH_CALENDAR":
                let titleYear2 = "";
                let c = sampleFourParser(data, startDate, endDate);
                c.forEach((item, i) => {
                    titleYear2 += item.year
                    if (i !== c.length - 1) {
                        titleYear2 += ", "
                    }
                })
                return (
                    <>
                        <div className="row">
                            <div className="col-1">
                                <h6 style={{ fontWeight: 600 }}>
                                    標題:
                                </h6>
                            </div>
                            <div className="col-7">
                                <h6>{`${titleYear2}年 - 新發生意外或事故`}</h6>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Jan</th>
                                            <th scope="col">Feb</th>
                                            <th scope="col">Mar</th>
                                            <th scope="col">Apr</th>
                                            <th scope="col">May</th>
                                            <th scope="col">Jun</th>
                                            <th scope="col">Jul</th>
                                            <th scope="col">Aug</th>
                                            <th scope="col">Sep</th>
                                            <th scope="col">Oct</th>
                                            <th scope="col">Nov</th>
                                            <th scope="col">Dec</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {c.map((item) => {
                                            return (
                                                <tr>
                                                    <th scope="row">{item.year}</th>
                                                    <td>{item.dataset.jan}</td>
                                                    <td>{item.dataset.feb}</td>
                                                    <td>{item.dataset.mar}</td>
                                                    <td>{item.dataset.apr}</td>
                                                    <td>{item.dataset.may}</td>
                                                    <td>{item.dataset.jun}</td>
                                                    <td>{item.dataset.jun}</td>
                                                    <td>{item.dataset.aug}</td>
                                                    <td>{item.dataset.sep}</td>
                                                    <td>{item.dataset.oct}</td>
                                                    <td>{item.dataset.nov}</td>
                                                    <td>{item.dataset.dec}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )
            case "BY_YEAR_FINICIAL":
            case "BY_YEAR_CALENDAR":
                let titleYear = "";
                let d = sampleSixParser(data, startDate, endDate);
                d.forEach((item, i) => {
                    titleYear += item.year
                    if (i !== d.length - 1) {
                        titleYear += ", "
                    }
                })
                return <>
                    <div className="row">
                        <div className="col-1">
                            <h6 style={{ fontWeight: 600 }}>
                                標題:
                            </h6>
                        </div>
                        <div className="col-7">
                            <h6>{`${titleYear}年 - 新發生意外或事故總數`}</h6>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">服務使用者意外</th>
                                        <th scope="col">外界人士意外</th>
                                        <th scope="col">特別事故 (牌照事務處)</th>
                                        <th scope="col">特別事故 (津貼科)</th>
                                        <th scope="col">其他事故</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {d.map((item) => {
                                        return (
                                            <tr>
                                                <th scope="row">{item.year}</th>
                                                <td>{item.dataset.sui}</td>
                                                <td>{item.dataset.pui}</td>
                                                <td>{item.dataset.sih}</td>
                                                <td>{item.dataset.sid}</td>
                                                <td>{item.dataset.oin}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
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
                                            ["服務單位", "數量"],
                                            ["服務使用者意外", unitDataset.sui],
                                            ["外界人士意外", unitDataset.pui],
                                            ["特別事故(牌照事務處)", unitDataset.sih],
                                            ["特別事故(津貼科)", unitDataset.sid],
                                            ["其他事故", unitDataset.oin]
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
                                            ["服務單位", '數量'],
                                            ["服務使用者意外", unitDataset.sui],
                                            ["外界人士意外", unitDataset.pui],
                                            ["特別事故(牌照事務處)", unitDataset.sih],
                                            ["特別事故(津貼科)", unitDataset.sid],
                                            ["其他事故", unitDataset.oin]
                                        ]
                                    }
                                />
                            </div>
                        </div>
                    </React.Fragment>
                )
            case "BY_MONTH":
                return (
                    <>

                    </>
                )
            case "BY_MONTH_FINICIAL":
            case "BY_MONTH_CALENDAR":
            case "BY_YEAR_FINICIAL":
            case "BY_YEAR_CALENDAR":
            default:
                console.log("default");
        }
    }

    return (
        <div>
            <div className="row mb-3">
                <div className="col">
                    <h6 style={{ fontWeight: 600 }}>統計資料 &gt; 一般統計 &gt; 新發生意外或事故</h6>
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
                            <DatePicker className="form-control" dateFormat="yyyy/MM/dd" selected={startDate} onChange={setStartDate} />
                        </div>
                        <div className="d-flex">
                            <div className="mr-3">
                                至
                            </div>
                            <DatePicker className="form-control" dateFormat="yyyy/MM/dd" selected={endDate} onChange={setEndDate} />
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
                {/* <BootstrapTable boot keyField='id' data={[]} columns={columns()} pagination={paginationFactory()} bootstrap4={true} /> */}
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

export default General
