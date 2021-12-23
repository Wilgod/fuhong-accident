import * as React from 'react'
import { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as moment from 'moment';
import { useServiceUserStats } from '../../../hooks/useServiceUserStats';
import Chart from "react-google-charts";
import useServiceLocation from '../../../hooks/useServiceLocation';
import { useAllowanceStats } from '../../../hooks/useAllowanceStats';
import { getDateFinancialYear } from '../../../utils/DateUtils';


//Age interval
interface IDataset {
    accidentCategoryUnusualDeath: number;
    accidentCategoryMissing: number;
    accidentCategoryAbuse: number;
    accidentCategoryConflict: number;
    accidentCategoryOther: number;
}

const initialDataset: IDataset = {
    accidentCategoryUnusualDeath: 0,
    accidentCategoryAbuse: 0,
    accidentCategoryConflict: 0,
    accidentCategoryMissing: 0,
    accidentCategoryOther: 0
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

interface ISampleTwoDataset {
    month: string;
    dataset: IDataset
}

interface ISampleThreeDataset {
    finicalYear: string;
    dataset: IMonth;
}

interface ISampleFourDataset {
    year: number;
    dataset: IMonth;
}

interface ISampleFiveDataset {
    finicialYear: string;
    dataset: IDataset;
}

interface ISampleSixDataset {
    year: number;
    dataset: IDataset;
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

const monthDiff = (d1: Date, d2: Date) => {
    try {
        let months: number;
        months = (d2.getFullYear() - d1.getFullYear()) * 12;
        months -= d1.getMonth();
        months += d2.getMonth();
        return months <= 0 ? 0 : months;
    } catch (err) {
        console.error(err);
    }
}

const categoryFilter = (type: string, dataset: IDataset): IDataset => {
    let result = dataset;

    switch (type) {
        case "ACCIDENT_CATEGORY_UNUSUAL_DEATH":
            result.accidentCategoryUnusualDeath += 1;
            return result;
        case "ACCIDENT_CATEGORY_MISSING":
            result.accidentCategoryMissing += 1;
            return result;
        case "ACCIDENT_CATEGORY_ABUSE":
            result.accidentCategoryAbuse += 1;
            return result;
        case "ACCIDENT_CATEGORY_CONFLICT":
            result.accidentCategoryConflict += 1;
            return result;
        case "ACCIDENT_CATEGORY_OTHER":
            result.accidentCategoryOther += 1;
            return result;
        default: return result;
    }
}

const sampleOneParser = (serviceUserAge: any[]) => {
    let dataset: IDataset = { ...initialDataset };
    serviceUserAge.forEach((item) => {
        if (item.IncidentCategory) {
            dataset = categoryFilter(item.IncidentCategory, dataset);
        }
    });
    return dataset;
}

const sampleTwoParser = (data: any[], startDate: Date, endDate: Date): ISampleTwoDataset[] => {
    try {


        let m = new Map<string, IDataset>();
        let result: ISampleTwoDataset[] = [];

        const diff = monthDiff(startDate, endDate);
        for (let i = diff; i > -1; i--) {
            const d = moment(new Date(new Date(endDate.toISOString()).setMonth(new Date(endDate.toISOString()).getMonth() - i))).format("MM/yyyy");
            m.set(d, { ...initialDataset });
        }

        data.forEach((item) => {
            if ((item.AccidentTime || item.IncidentTime || item.Created) && item.CaseNumber) {
                const formType: string = item.CaseNumber.split("-")[0];
                const date = new Date(item.AccidentTime || item.IncidentTime || item.Created);
                const formattedDate = moment(date).format("MM/yyyy");
                if (m.has(formattedDate)) {
                    let oldDataset = m.get(formattedDate);
                    let newDataset = categoryFilter(item.IncidentCategory, oldDataset);
                    m.set(formattedDate, newDataset);
                } else {
                    let newDataset = categoryFilter(item.IncidentCategory, { ...initialDataset });
                    m.set(formattedDate, newDataset);
                }
            }
        });

        m.forEach((value, key) => {
            let item: ISampleTwoDataset = { month: key, dataset: value }
            result.push(item);
        })

        return result;
    } catch (err) {
        console.error(err);
    }
}

const sampleThreeParser = (data: any[]): ISampleThreeDataset[] => {
    let result: ISampleThreeDataset[] = [];
    let m = new Map<string, IMonth>();

    data.forEach((item) => {
        const d = new Date(item.AccidentTime || item.IncidentTime || item.Created);
        if (d) {
            const currentFinicailYear = getDateFinancialYear(d);
            if (m.has(currentFinicailYear)) {
                let oldDataset = m.get(currentFinicailYear);
                let newDataset = monthFilter(d.getMonth() + 1, oldDataset);
                m.set(currentFinicailYear, newDataset);
            } else {
                let newDataset = monthFilter(d.getMonth() + 1);
                m.set(currentFinicailYear, newDataset);
            }
        }
    });

    m.forEach((value, key) => {
        let item: ISampleThreeDataset = { finicalYear: key, dataset: value }
        result.push(item);
    })

    return result;
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
        if (item.AccidentTime || item.IncidentTime || item.Created) {
            const year = new Date(item.AccidentTime || item.IncidentTime || item.Created).getFullYear();
            const month = new Date(item.AccidentTime || item.IncidentTime || item.Created).getMonth() + 1;
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

const sampleFiveParser = (data: any[]): ISampleFiveDataset[] => {
    let result: ISampleFiveDataset[] = []
    let m = new Map<string, IDataset>();

    data.forEach((item) => {
        const d = new Date(item.AccidentTime || item.IncidentTime || item.Created);
        if (d) {

            const currentFinicailYear = getDateFinancialYear(d);
            if (m.has(currentFinicailYear)) {

                let oldDataset = m.get(currentFinicailYear);
                let newDataset = categoryFilter(item.IncidentCategory, oldDataset);
                m.set(currentFinicailYear, newDataset);

            } else {
                let newDataset = categoryFilter(item.IncidentCategory, { ...initialDataset });
                m.set(currentFinicailYear, newDataset);
            }
        }
    });

    m.forEach((value, key) => {
        let item: ISampleFiveDataset = { finicialYear: key, dataset: value }
        result.push(item);
    })

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
            const year = new Date(item.AccidentTime || item.IncidentTime || item.Created).getFullYear().toString();
            const month = new Date(item.AccidentTime || item.IncidentTime || item.Created).getMonth() + 1;

            if (m.has(year)) {
                let oldDataset = m.get(year);
                let newDataset = categoryFilter(item.IncidentCategory, oldDataset);
                m.set(year, newDataset);
            } else {
                let newDataset = categoryFilter(item.IncidentCategory, { ...initialDataset });
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




function AllowanceCategory() {

    const [groupBy, setGroupBy] = useState("NON");
    const [categoryDataset, setCategoryDataset] = useState<IDataset>(initialDataset);
    const [serivceLocation] = useServiceLocation();
    const [data, startDate, endDate, setStartDate, setEndDate, setServiceUnits] = useAllowanceStats();
    console.log(data);
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
                        <th scope="row">服務使用者不尋常死亡／嚴重受傷導致死亡</th>
                        <th>{categoryDataset.accidentCategoryUnusualDeath}</th>
                    </tr>
                    <tr>
                        <th scope="row">服務使用者失踪而需要報警求助</th>
                        <th>{categoryDataset.accidentCategoryMissing}</th>
                    </tr>
                    <tr>
                        <th scope="row">已確立／懷疑有服務使用者被職員／其他服務使用者虐待</th>
                        <th>{categoryDataset.accidentCategoryAbuse}</th>
                    </tr>
                    <tr>
                        <th scope="row">爭執以致有人身體受傷而需要報警求助</th>
                        <th>{categoryDataset.accidentCategoryConflict}</th>
                    </tr>
                    <tr>
                        <th scope="row">其他嚴重事故以致影響服務單位的日常運作超過24小時／引起傳媒關注</th>
                        <th>{categoryDataset.accidentCategoryOther}</th>
                    </tr>
                </tbody>
            </table >
        )
    }

    useEffect(() => {
        switch (groupBy) {
            case "NON":
                setCategoryDataset(sampleOneParser(data));
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
        let title = `${moment(startDate).format("MM/YYYY")} - ${moment(endDate).format("MM/YYYY")} 特別事故統計 (津貼科)`
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
                                <h6>{`${title} - 特別事故類別`}</h6>
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
                                <h6>{`${title} - 智力障礙程度統計`}</h6>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">服務使用者不尋常死亡／嚴重受傷導致死亡</th>
                                            <th scope="col">服務使用者失踪而需要報警求助</th>
                                            <th scope="col">已確立／懷疑有服務使用者被職員／其他服務使用者虐待</th>
                                            <th scope="col">爭執以致有人身體受傷而需要報警求助</th>
                                            <th scope="col">其他嚴重事故以致影響服務單位的日常運作超過24小時／引起傳媒關注</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sampleTwoParser(data, startDate, endDate).map((item) => {
                                            return (
                                                <tr>
                                                    <th scope="row">{item.month}</th>
                                                    <td>{item.dataset.accidentCategoryUnusualDeath}</td>
                                                    <td>{item.dataset.accidentCategoryMissing}</td>
                                                    <td>{item.dataset.accidentCategoryAbuse}</td>
                                                    <td>{item.dataset.accidentCategoryConflict}</td>
                                                    <td>{item.dataset.accidentCategoryOther}</td>

                                                </tr>
                                            )
                                        })}
                                        {
                                            <tr style={{ color: "red" }}>
                                                <th scope="row">總數</th>
                                                <td>{categoryDataset.accidentCategoryUnusualDeath}</td>
                                                <td>{categoryDataset.accidentCategoryMissing}</td>
                                                <td>{categoryDataset.accidentCategoryAbuse}</td>
                                                <td>{categoryDataset.accidentCategoryConflict}</td>
                                                <td>{categoryDataset.accidentCategoryOther}</td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>)
            case "BY_MONTH_FINICIAL":
                return <>
                    <div className="row">
                        <div className="col-1">
                            <h6 style={{ fontWeight: 600 }}>
                                標題:
                            </h6>
                        </div>
                        <div className="col-7">
                            <h6>{`${title} - 智力障礙程度統計`}</h6>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Apr</th>
                                        <th scope="col">May</th>
                                        <th scope="col">Jun</th>
                                        <th scope="col">Jul</th>
                                        <th scope="col">Aug</th>
                                        <th scope="col">Sep</th>
                                        <th scope="col">Oct</th>
                                        <th scope="col">Nov</th>
                                        <th scope="col">Dec</th>
                                        <th scope="col">Jan</th>
                                        <th scope="col">Feb</th>
                                        <th scope="col">Mar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sampleThreeParser(data).map((item) => {
                                        return (
                                            <tr>
                                                <th scope="row">{item.finicalYear}</th>
                                                <td>{item.dataset.apr}</td>
                                                <td>{item.dataset.may}</td>
                                                <td>{item.dataset.jun}</td>
                                                <td>{item.dataset.jun}</td>
                                                <td>{item.dataset.aug}</td>
                                                <td>{item.dataset.sep}</td>
                                                <td>{item.dataset.oct}</td>
                                                <td>{item.dataset.nov}</td>
                                                <td>{item.dataset.dec}</td>
                                                <td>{item.dataset.jan}</td>
                                                <td>{item.dataset.feb}</td>
                                                <td>{item.dataset.mar}</td>
                                            </tr>
                                        )
                                    })}

                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            case "BY_MONTH_CALENDAR":
                return <>
                    <div className="row">
                        <div className="col-1">
                            <h6 style={{ fontWeight: 600 }}>
                                標題:
                            </h6>
                        </div>
                        <div className="col-7">
                            <h6>{`${title} - 性別統計`}</h6>
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
            case "BY_YEAR_FINICIAL":
                return <>
                    <div className="row">
                        <div className="col-1">
                            <h6 style={{ fontWeight: 600 }}>
                                標題:
                            </h6>
                        </div>
                        <div className="col-7">
                            <h6>{`${title} - 性別統計`}</h6>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">服務使用者不尋常死亡／嚴重受傷導致死亡</th>
                                        <th scope="col">服務使用者失踪而需要報警求助</th>
                                        <th scope="col">已確立／懷疑有服務使用者被職員／其他服務使用者虐待</th>
                                        <th scope="col">爭執以致有人身體受傷而需要報警求助</th>
                                        <th scope="col">其他嚴重事故以致影響服務單位的日常運作超過24小時／引起傳媒關注</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sampleFiveParser(data).map((item) => {
                                        return (
                                            <tr>
                                                <th scope="row">{item.finicialYear}</th>
                                                <td>{item.dataset.accidentCategoryUnusualDeath}</td>
                                                <td>{item.dataset.accidentCategoryMissing}</td>
                                                <td>{item.dataset.accidentCategoryAbuse}</td>
                                                <td>{item.dataset.accidentCategoryConflict}</td>
                                                <td>{item.dataset.accidentCategoryOther}</td>
                                            </tr>
                                        )
                                    })}
                                    {
                                        <tr style={{ color: "red" }}>
                                            <th scope="row">總數</th>
                                            <td>{categoryDataset.accidentCategoryUnusualDeath}</td>
                                            <td>{categoryDataset.accidentCategoryMissing}</td>
                                            <td>{categoryDataset.accidentCategoryAbuse}</td>
                                            <td>{categoryDataset.accidentCategoryConflict}</td>
                                            <td>{categoryDataset.accidentCategoryOther}</td>
                                        </tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            case "BY_YEAR_CALENDAR":
                return <>
                    <div className="row">
                        <div className="col-1">
                            <h6 style={{ fontWeight: 600 }}>
                                標題:
                            </h6>
                        </div>
                        <div className="col-7">
                            <h6>{`${title} - 性別統計`}</h6>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">服務使用者不尋常死亡／嚴重受傷導致死亡</th>
                                        <th scope="col">服務使用者失踪而需要報警求助</th>
                                        <th scope="col">已確立／懷疑有服務使用者被職員／其他服務使用者虐待</th>
                                        <th scope="col">爭執以致有人身體受傷而需要報警求助</th>
                                        <th scope="col">其他嚴重事故以致影響服務單位的日常運作超過24小時／引起傳媒關注</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sampleSixParser(data, startDate, endDate).map((item) => {
                                        return (
                                            <tr>
                                                <th scope="row">{item.year}</th>
                                                <td>{item.dataset.accidentCategoryUnusualDeath}</td>
                                                <td>{item.dataset.accidentCategoryMissing}</td>
                                                <td>{item.dataset.accidentCategoryAbuse}</td>
                                                <td>{item.dataset.accidentCategoryConflict}</td>
                                                <td>{item.dataset.accidentCategoryOther}</td>
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
        let title = `${moment(startDate).format("MM/YYYY")} - ${moment(endDate).format("MM/YYYY")} 特別事故統計 (津貼科)`

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
                                        特別事故統計 (津貼科) - 特別事故類別
                                    </div>
                                </div>
                                <div className="">
                                    <Chart
                                        chartType={"Bar"}
                                        loader={<div className="d-flex justify-content-center align-items-center"> <div className="spinner-border text-primary" /></div>}
                                        data={[
                                            ["事故類別", "數量"],
                                            ["服務使用者不尋常死亡／嚴重受傷導致死亡", categoryDataset.accidentCategoryUnusualDeath],
                                            ["服務使用者失踪而需要報警求助", categoryDataset.accidentCategoryMissing],
                                            ["已確立／懷疑有服務使用者被職員／其他服務使用者虐待", categoryDataset.accidentCategoryAbuse],
                                            ["爭執以致有人身體受傷而需要報警求助", categoryDataset.accidentCategoryConflict],
                                            ["其他嚴重事故以致影響服務單位的日常運作超過24小時／引起傳媒關注", categoryDataset.accidentCategoryOther],
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
                                        特別事故統計 (津貼科) - 特別事故類別
                                    </div>
                                </div>
                                <Chart
                                    chartType={"PieChart"}
                                    loader={<div className="d-flex justify-content-center align-items-center"> <div className="spinner-border text-primary" /></div>}
                                    data={[
                                        ["事故類別", "數量"],
                                        ["服務使用者不尋常死亡／嚴重受傷導致死亡", categoryDataset.accidentCategoryUnusualDeath],
                                        ["服務使用者失踪而需要報警求助", categoryDataset.accidentCategoryMissing],
                                        ["已確立／懷疑有服務使用者被職員／其他服務使用者虐待", categoryDataset.accidentCategoryAbuse],
                                        ["爭執以致有人身體受傷而需要報警求助", categoryDataset.accidentCategoryConflict],
                                        ["其他嚴重事故以致影響服務單位的日常運作超過24小時／引起傳媒關注", categoryDataset.accidentCategoryOther],
                                    ]}
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

    return (
        <div>
            <div className="row mb-3">
                <div className="col">
                    <h6 style={{ fontWeight: 600 }}>統計資料 &gt; 特別事故統計 (津貼科) &gt; 特別事故類別</h6>
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
                {/* <BootstrapTable boot keyField='id' data={[]} columns={columns()} pagination={paginationFactory()} bootstrap4={true} /> */}
            </div>
            <div className="">
                <div className="" style={{ fontWeight: 600 }}>
                    統計圖表
                </div>
                {chartSwitch()}
            </div>
        </div >
    )
}

export default AllowanceCategory
