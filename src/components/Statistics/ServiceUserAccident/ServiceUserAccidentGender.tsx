import * as React from 'react'
import { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as moment from 'moment';
import useServiceLocation from '../../../hooks/useServiceLocation';
import Chart from "react-google-charts";
import { useServiceUserStats } from '../../../hooks/useServiceUserStats';
import { getDateFinancialYear } from '../../../utils/DateUtils';
import arraySort from 'array-sort';
import html2canvas from 'html2canvas';
import downloadjs from 'downloadjs';
import "./ServiceUserAccident.css";
interface IDataset {
    male: number;
    female: number;
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

const initialDataset: IDataset = {
    male: 0,
    female: 0
}

interface ISampleTwoDataset {
    month: string;
    dataset: IDataset
    mmyyyy: number;
}

interface ISampleThreeDataset {
    financialYear: string;
    dataset: IMonth;
}

interface ISampleFourDataset {
    year: number;
    dataset: IMonth;
}

interface ISampleFiveDataset {
    financialYear: string;
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

const sexFilter = (sex: string, dataset: IDataset) => {
    let result = dataset;
    if (sex != null) {
        if (sex.toLocaleLowerCase() === "female") {
            result.female += 1;
        } else if (sex.toLocaleLowerCase() === "male") {
            result.male += 1;
        }
    }
    
    return result;
}


const financialYearChartParser = (result) =>{
    let dataResult = ['Month'];
    let jan =['JAN'];
    let feb =['FEB'];
    let mar =['MAR'];
    let apr =['APR'];
    let may =['MAY'];
    let jun =['JUN'];
    let jul =['JUL'];
    let aug =['AUG'];
    let sep =['SEP'];
    let oct =['OCT'];
    let nov =['NOV'];
    let dec =['DEC'];
    result.map((item) => {
        dataResult.push(item.financialYear);
        jan.push(item.dataset['jan']);
        feb.push(item.dataset['feb']);
        mar.push(item.dataset['mar']);
        apr.push(item.dataset['apr']);
        may.push(item.dataset['may']);
        jun.push(item.dataset['jun']);
        jul.push(item.dataset['jul']);
        aug.push(item.dataset['aug']);
        sep.push(item.dataset['sep']);
        oct.push(item.dataset['oct']);
        nov.push(item.dataset['nov']);
        dec.push(item.dataset['dec']);
    });
    let data=[
        dataResult,
        apr,
        may,
        jun,
        jul,
        aug,
        sep,
        oct,
        nov,
        dec,
        jan,
        feb,
        mar
        
    ];
    return data;
}

const normalChartParser = (result) =>{
    let dataResult = ['Month'];
    let jan =['JAN'];
    let feb =['FEB'];
    let mar =['MAR'];
    let apr =['APR'];
    let may =['MAY'];
    let jun =['JUN'];
    let jul =['JUL'];
    let aug =['AUG'];
    let sep =['SEP'];
    let oct =['OCT'];
    let nov =['NOV'];
    let dec =['DEC'];
    result.map((item) => {
        dataResult.push(item.year.toString());
        jan.push(item.dataset['jan']);
        feb.push(item.dataset['feb']);
        mar.push(item.dataset['mar']);
        apr.push(item.dataset['apr']);
        may.push(item.dataset['may']);
        jun.push(item.dataset['jun']);
        jul.push(item.dataset['jul']);
        aug.push(item.dataset['aug']);
        sep.push(item.dataset['sep']);
        oct.push(item.dataset['oct']);
        nov.push(item.dataset['nov']);
        dec.push(item.dataset['dec']);
    });
    let data=[
        dataResult,
        jan,
        feb,
        mar,
        apr,
        may,
        jun,
        jul,
        aug,
        sep,
        oct,
        nov,
        dec
    ];
    return data;
}

const financialChartParser = (result) =>{
    let dataResult = ['Year'];
    let male =['男'];
    let female =['女'];
    result.map((item) => {
        dataResult.push(item.financialYear);
        male.push(item.dataset['male']);
        female.push(item.dataset['female']);
    });
    let data=[
        dataResult,
        male,
        female
    ];
    return data;
}

const yearChartParser = (result) =>{
    let dataResult = ['Year'];
    let male =['男'];
    let female =['女'];
    result.map((item) => {
        dataResult.push(item.year.toString());
        male.push(item.dataset['male']);
        female.push(item.dataset['female']);
    });
    let data=[
        dataResult,
        male,
        female
    ];
    return data;
}

const sampleOneParser = (serviceUserGender: any[]) => {
    let dataset: IDataset = { ...initialDataset };
    serviceUserGender.forEach((item) => {
        dataset = sexFilter(item.ServiceUserGender, dataset);
    });
    return dataset;
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

const monthZero = (dataset: IMonth = initialDatasetMonth): IMonth => {
    let result = { ...dataset };
    return result;
}

const sampleTwoParser = (data: any[], startDate: Date, endDate: Date): ISampleTwoDataset[] => {
    let m = new Map<string, IDataset>();
    let result: ISampleTwoDataset[] = [];

    const diff = monthDiff(startDate, endDate);
    for (let i = diff; i > -1; i--) {
        //new Date(endDate).setMonth(new Date(endDate).getMonth() - i)
        let currentMonth = new Date(endDate).getMonth();
        let currentYear = new Date(endDate).getFullYear();
        let calMonth;
        let calYear;
        if (currentMonth - i < 0) {
            if (i > 12) {
                let moreYear = Math.floor(i/12);
                let remainMonth = i % 12;
                if (currentMonth - remainMonth < 0) {
                    calMonth = 12 - (remainMonth - currentMonth) ;
                    calYear = currentYear - (moreYear + 1);
                } else {
                    calMonth = currentMonth - remainMonth
                    calYear = currentYear - moreYear
                }
            } else {
                calMonth = 12 - (i - currentMonth);
                calYear = currentYear - 1;
            }
        } else {
            calMonth = currentMonth - i
            calYear = currentYear;
        }
        const d = moment(new Date(calYear,calMonth,1)).format("MM/yyyy");
        m.set(d, { ...initialDataset });
    }
    /*for (let i = diff; i > -1; i--) {
        const d = moment(new Date(new Date(endDate.toISOString()).setMonth(new Date(endDate.toISOString()).getMonth() - i))).format("MM/yyyy");
        m.set(d, { ...initialDataset });
    }*/

    data.forEach((item) => {
        if ((item.AccidentTime || item.IncidentTime) && item.CaseNumber) {
            const formType: string = item.CaseNumber.split("-")[0];
            const date = new Date(item.AccidentTime || item.IncidentTime);
            const formattedDate = moment(date).format("MM/yyyy");
            if (m.has(formattedDate)) {
                let oldDataset = m.get(formattedDate);
                let newDataset = sexFilter(item.ServiceUserGender, oldDataset);
                m.set(formattedDate, newDataset);
            } else {
                let newDataset = sexFilter(item.ServiceUserGender, initialDataset);
                m.set(formattedDate, newDataset);
            }
        }
    });

    m.forEach((value, key) => {
        let item: ISampleTwoDataset = { month: key, dataset: value, mmyyyy:parseInt(key.substr(3,4) + key.substr(0,2)) }
        result.push(item);
    })
    arraySort(result, 'mmyyyy');
    return result;
}

const sampleThreeParser = (data: any[], startDate:Date, endDate:Date): ISampleThreeDataset[] => {
    let result: ISampleThreeDataset[] = [];
    let m = new Map<string, IMonth>();

    data.forEach((item) => {
        const d = new Date(item.AccidentTime || item.IncidentTime);
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
        let item: ISampleThreeDataset = { financialYear: key, dataset: value }
        result.push(item);
    })

    let temp = new Date(startDate.getFullYear(),startDate.getMonth(),startDate.getDate());
    for (let d = temp; d <= endDate; d.setFullYear(d.getFullYear() + 1)) {
        const financialYear =  getDateFinancialYear(d);
        let m1 = new Map<string, IMonth>();
        const filterResult = result.filter(item => {return item.financialYear == financialYear});
        if (filterResult.length == 0) {
            let newDataset = monthZero();
            m1.set(financialYear, newDataset);
        }
        m1.forEach((value, key) => {
            let item: ISampleThreeDataset = { financialYear: key, dataset: value }
            result.push(item);
        })
    }
    
    arraySort(result, 'financialYear');
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

    let temp = new Date(startDate.getFullYear(),startDate.getMonth(),startDate.getDate());
    for (let d = temp; d <= endDate; d.setFullYear(d.getFullYear() + 1)) {
        const year =  d.getFullYear()
        let m1 = new Map<string, IMonth>();
        const filterResult = result.filter(item => {return item.year == year});
        if (filterResult.length == 0) {
            let newDataset = monthZero();
            m1.set(year.toString(), newDataset);
        }
        m1.forEach((value, key) => {
            let item: ISampleFourDataset = { year: parseInt(key), dataset: value }
            result.push(item);
        })
    }
    
    arraySort(result, 'year');
    return result
}

const sampleFiveParser = (data: any[], startDate: Date, endDate: Date): ISampleFiveDataset[] => {
    let result: ISampleFiveDataset[] = []
    let m = new Map<string, IDataset>();

    data.forEach((item) => {
        const d = new Date(item.AccidentTime || item.IncidentTime);
        if (d) {

            const currentFinicailYear = getDateFinancialYear(d);
            if (m.has(currentFinicailYear)) {
                let oldDataset = m.get(currentFinicailYear);
                let newDataset = sexFilter(item.ServiceUserGender, oldDataset);
                m.set(currentFinicailYear, newDataset);
            } else {
                let newDataset = sexFilter(item.ServiceUserGender, { ...initialDataset });
                m.set(currentFinicailYear, newDataset);
            }
        }
    });

    m.forEach((value, key) => {
        let item: ISampleFiveDataset = { financialYear: key, dataset: value }
        result.push(item);
    })

    let temp = new Date(startDate.getFullYear(),startDate.getMonth(),startDate.getDate());
    for (let d = temp; d <= endDate; d.setFullYear(d.getFullYear() + 1)) {

        const financialYear =  getDateFinancialYear(d);
        let m1 = new Map<string, IDataset>();
        const filterResult = result.filter(item => {return item.financialYear == financialYear});
        if (filterResult.length == 0) {
            //let newDataset = unitFilter(formType, { ...initialDataset });
            m1.set(financialYear, initialDataset);
        }
        m1.forEach((value, key) => {
            let item: ISampleFiveDataset = { financialYear: key, dataset: value }
            result.push(item);
        })
    }
    arraySort(result, 'financialYear');
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

            if (m.has(year)) {
                let oldDataset = m.get(year);
                let newDataset = sexFilter(item.ServiceUserGender, oldDataset);
                m.set(year, newDataset);
            } else {
                let newDataset = sexFilter(item.ServiceUserGender, { ...initialDataset });
                m.set(year, newDataset);
            }
        }
    })

    m.forEach((value, key) => {
        let item: ISampleSixDataset = { year: +key, dataset: value }
        result.push(item);
    })

    let temp = new Date(startDate.getFullYear(),startDate.getMonth(),startDate.getDate());
    for (let d = temp; d <= endDate; d.setFullYear(d.getFullYear() + 1)) {

        const year =  d.getFullYear()
        let m1 = new Map<string, IDataset>();
        const filterResult = result.filter(item => {return item.year == year});
        if (filterResult.length == 0) {
            //let newDataset = unitFilter(formType, { ...initialDataset });
            m1.set(year.toString(), initialDataset);
        }
        m1.forEach((value, key) => {
            let item: ISampleSixDataset = { year: parseInt(key), dataset: value }
            result.push(item);
        })
    }
    arraySort(result, 'year');
    return result;
}

function ServiceUserAccidentGender(props) {
    const [groupBy, setGroupBy] = useState("NON");
    const [genderDataset, setGenderDataset] = useState<IDataset>(initialDataset);
    const [serviceLocation] = useServiceLocation(props.siteCollectionUrl);
    const [data, startDate, endDate,serviceUnits, setStartDate, setEndDate, setServiceUnits] = useServiceUserStats(props.permission);


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
            <table className="table" id="table1">
                <thead>
                    <tr>
                        <th scope="col"></th>
                        <th>總數</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">男</th>
                        <th>{genderDataset.male}</th>
                    </tr>
                    <tr>
                        <th scope="row">女</th>
                        <th>{genderDataset.female}</th>
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
                            <div className="col-12">
                                <h6>{`${title} - 性別統計 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
                            </div>
                            <div className="col-12" style={{margin:'5px 0'}}>
                                <button className="btn btn-primary" onClick={() => copyTable('#table1')}>複製到表格</button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
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
                            <div className="col-12">
                                <h6>{`${title} - 性別統計 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
                            </div>
                            <div className="col-12" style={{margin:'5px 0'}}>
                                <button className="btn btn-primary" onClick={() => copyTable('#table2')}>複製到表格</button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <table className="table" id="table2">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">男</th>
                                            <th scope="col">女</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sampleTwoParser(data, startDate, endDate).map((item) => {
                                            return (
                                                <tr>
                                                    <th scope="row">{item.month}</th>
                                                    <td>{item.dataset.male}</td>
                                                    <td>{item.dataset.female}</td>
                                                </tr>
                                            )
                                        })}
                                        {
                                            <tr style={{ color: "red" }}>
                                                <th scope="row">總數</th>
                                                <td>{genderDataset.male}</td>
                                                <td>{genderDataset.female}</td>

                                            </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )
            case "BY_MONTH_FINANCIAL":
                let maleResult = sampleThreeParser(data.filter((item) => {return item.ServiceUserGender == 'male'}), startDate, endDate);
                let maleMFChart = financialYearChartParser(maleResult);

                let femaleResult = sampleThreeParser(data.filter((item) => {return item.ServiceUserGender == 'female'}), startDate, endDate);
                let femaleMFChart = financialYearChartParser(femaleResult);
                return <>
                    <div className="row">
                        <div className="col-1">
                            <h6 style={{ fontWeight: 600 }}>
                                標題:
                            </h6>
                        </div>
                        <div className="col-12">
                            <h6>{`${title} - 性別統計 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
                        </div>
                        <div className="col-12" style={{margin:'5px 0'}}>
                                <button className="btn btn-primary" onClick={() => copyTable('#table3')}>複製到表格</button>
                            </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <table className="table" id="table3">
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
                                    {maleResult.map((item) => {
                                        return (
                                            <tr>
                                                <th scope="row">{item.financialYear}</th>
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
                    <div className="row">
                        <div className="col-12">
                            <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthFinancialLineChart1")}>下載圖表</button>
                        </div>
                        <div className="col-12 byMonthFinancialLineChart1">
                            <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                <div className="">
                                    {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                </div>
                                <div className="">
                                    服務使用者意外 - 性別統計 (每月總數)
                                </div>
                            </div>
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Line"
                                loader={<div>Loading Chart</div>}
                                data={maleMFChart}
                                options={{
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '性別 - 男統計(每月總數)',
                                    },
                                }}
                            />
                        </div>
                        <div className="col-12">
                            <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthFinancialBarChart1")}>下載圖表</button>
                        </div>
                        <div className="col-12 byMonthFinancialBarChart1">
                            <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                <div className="">
                                    {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                </div>
                                <div className="">
                                    服務使用者意外 - 性別統計 (每月總數)
                                </div>
                            </div>
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={maleMFChart}
                                options={{
                                    // Material design options
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '性別 - 男統計(每月總數)',
                                    },
                                }}
                            />
                        </div>
                    </div>
                    <hr/>
                    <div className="row">
                        <div className="col-1">
                            <h6 style={{ fontWeight: 600 }}>
                                標題:
                            </h6>
                        </div>
                        <div className="col-12">
                            <h6>{`${title} - 性別統計 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
                        </div>
                        <div className="col-12" style={{margin:'5px 0'}}>
                                <button className="btn btn-primary" onClick={() => copyTable('#table4')}>複製到表格</button>
                            </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <table className="table" id="table4">
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
                                    {femaleResult.map((item) => {
                                        return (
                                            <tr>
                                                <th scope="row">{item.financialYear}</th>
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
                    <div className="row">
                        <div className="col-12">
                            <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthFinancialLineChart2")}>下載圖表</button>
                        </div>
                        <div className="col-12 byMonthFinancialLineChart2">
                            <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                <div className="">
                                    {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                </div>
                                <div className="">
                                服務使用者意外 - 性別統計 (每月總數)
                                </div>
                            </div>
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Line"
                                loader={<div>Loading Chart</div>}
                                data={femaleMFChart}
                                options={{
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '性別 - 女統計(每月總數)',
                                    },
                                }}
                            />
                        </div>
                        <div className="col-12">
                            <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthFinancialBarChart2")}>下載圖表</button>
                        </div>
                        <div className="col-12 byMonthFinancialBarChart2">
                            <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                <div className="">
                                    {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                </div>
                                <div className="">
                                服務使用者意外 - 性別統計 (每月總數)
                                </div>
                            </div>
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={femaleMFChart}
                                options={{
                                    // Material design options
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '性別 - 女統計(每月總數)',
                                    },
                                }}
                            />
                        </div>
                    </div>
                </>
            case "BY_MONTH_CALENDAR":
                let titleYear2 = "";
                let maleMCResult = sampleFourParser(data.filter((item) => {return item.ServiceUserGender == 'male'}), startDate, endDate);
                let maleMCChart = normalChartParser(maleMCResult);

                let femaleMCResult = sampleFourParser(data.filter((item) => {return item.ServiceUserGender == 'female'}), startDate, endDate);
                let femaleMCChart = normalChartParser(femaleMCResult);

                maleMCResult.forEach((item, i) => {
                    titleYear2 += item.year
                    if (i !== maleMCResult.length - 1) {
                        titleYear2 += ", "
                    }
                })
                return <>
                    <div className="row">
                        <div className="col-1">
                            <h6 style={{ fontWeight: 600 }}>
                                標題:
                            </h6>
                        </div>
                        <div className="col-12">
                            <h6>{`${titleYear2} - 性別統計 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
                        </div>
                        <div className="col-12" style={{margin:'5px 0'}}>
                                <button className="btn btn-primary" onClick={() => copyTable('#table5')}>複製到表格</button>
                            </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <table className="table" id="table5">
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
                                    {maleMCResult.map((item) => {
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
                    <div className="row">
                        <div className="col-12">
                            <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthCalendarLineChart1")}>下載圖表</button>
                        </div>
                        <div className="col-12 byMonthCalendarLineChart1">
                            <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                <div className="">
                                    {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                </div>
                                <div className="">
                                服務使用者意外 - 性別統計 (每月總數)
                                </div>
                            </div>
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Line"
                                loader={<div>Loading Chart</div>}
                                data={maleMCChart}
                                options={{
                                    chart: {
                                        title: '日曆年度',
                                        subtitle: '性別 - 男統計(每月總數)',
                                    },
                                }}
                            />
                        </div>
                        <div className="col-12">
                            <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthCalendarBarChart1")}>下載圖表</button>
                        </div>
                        <div className="col-12 byMonthCalendarBarChart1">
                            <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                <div className="">
                                    {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                </div>
                                <div className="">
                                服務使用者意外 - 性別統計 (每月總數)
                                </div>
                            </div>
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={maleMCChart}
                                options={{
                                    // Material design options
                                    chart: {
                                        title: '日曆年度',
                                        subtitle: '性別 - 男統計(每月總數)',
                                    },
                                }}

                            />
                        </div>
                    </div>
                    <hr/>
                    <div className="row">
                        <div className="col-1">
                            <h6 style={{ fontWeight: 600 }}>
                                標題:
                            </h6>
                        </div>
                        <div className="col-12">
                            <h6>{`${titleYear2} - 性別統計 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
                        </div>
                        <div className="col-12" style={{margin:'5px 0'}}>
                                <button className="btn btn-primary" onClick={() => copyTable('#table6')}>複製到表格</button>
                            </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <table className="table" id="table6">
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
                                    {femaleMCResult.map((item) => {
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
                    <div className="row">
                        <div className="col-12">
                            <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthCalendarLineChart2")}>下載圖表</button>
                        </div>
                        <div className="col-12 byMonthCalendarLineChart2">
                            <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                <div className="">
                                    {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                </div>
                                <div className="">
                                服務使用者意外 - 性別統計 (每月總數)
                                </div>
                            </div>
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Line"
                                loader={<div>Loading Chart</div>}
                                data={femaleMCChart}
                                options={{
                                    chart: {
                                        title: '日曆年度',
                                        subtitle: '性別 - 女統計(每月總數)',
                                    },
                                }}
                            />
                        </div>
                        <div className="col-12">
                            <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthCalendarBarChart2")}>下載圖表</button>
                        </div>
                        <div className="col-12 byMonthCalendarBarChart2">
                            <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                <div className="">
                                    {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                </div>
                                <div className="">
                                服務使用者意外 - 性別統計 (每月總數)
                                </div>
                            </div>
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={femaleMCChart}
                                options={{
                                    // Material design options
                                    chart: {
                                        title: '日曆年度',
                                        subtitle: '性別 - 女統計(每月總數)',
                                    },
                                }}

                            />
                        </div>
                    </div>
                </>
            case "BY_YEAR_FINANCIAL":
                let titleYear3 = "";
                let genderFinancialResult = sampleFiveParser(data, startDate, endDate);
                let genderFinancialChart = financialChartParser(genderFinancialResult);
                genderFinancialResult.forEach((item, i) => {
                    titleYear3 += item.financialYear;
                    if (i !== genderFinancialResult.length - 1) {
                        titleYear3 += ", "
                    }
                })
                return <>
                    <div className="row">
                        <div className="col-1">
                            <h6 style={{ fontWeight: 600 }}>
                                標題:
                            </h6>
                        </div>
                        <div className="col-12">
                            <h6>{`${titleYear3} - 性別統計 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
                        </div>
                        <div className="col-12" style={{margin:'5px 0'}}>
                                <button className="btn btn-primary" onClick={() => copyTable('#table7')}>複製到表格</button>
                            </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <table className="table" id="table7">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">男</th>
                                        <th scope="col">女</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {genderFinancialResult.map((item) => {
                                        return (
                                            <tr>
                                                <th scope="row">{item.financialYear}</th>
                                                <td>{item.dataset.male}</td>
                                                <td>{item.dataset.female}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <button className="btn btn-primary" onClick={()=>downloadScreenshot("byYearFinancialLineChart")}>下載圖表</button>
                        </div>
                        <div className="col-12 byYearFinancialLineChart">
                            <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                <div className="">
                                    {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                </div>
                                <div className="">
                                服務使用者意外 - 性別統計 (每年總數)
                                </div>
                            </div>
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Line"
                                loader={<div>Loading Chart</div>}
                                data={genderFinancialChart}
                                options={{
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '性別統計(每年總數)',
                                    },
                                }}
                            />
                        </div>
                        <div className="col-12">
                            <button className="btn btn-primary" onClick={()=>downloadScreenshot("byYearFinancialBarChart")}>下載圖表</button>
                        </div>
                        <div className="col-12 byYearFinancialBarChart">
                            <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                <div className="">
                                    {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                </div>
                                <div className="">
                                服務使用者意外 - 性別統計 (每年總數)
                                </div>
                            </div>
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={genderFinancialChart}
                                options={{
                                    // Material design options
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '性別統計(每年總數)',
                                    },
                                }}
                            />
                        </div>
                    </div>
                </>
            case "BY_YEAR_CALENDAR":
                let titleYear4 = "";
                let genderYearResult = sampleSixParser(data, startDate, endDate);
                let genderYearChart = yearChartParser(genderYearResult);
                genderYearResult.forEach((item, i) => {
                    titleYear4 += item.year;
                    if (i !== genderYearResult.length - 1) {
                        titleYear4 += ", "
                    }
                })
                return <>
                    <div className="row">
                        <div className="col-1">
                            <h6 style={{ fontWeight: 600 }}>
                                標題:
                            </h6>
                        </div>
                        <div className="col-12">
                            <h6>{`${titleYear4} - 性別統計 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
                        </div>
                        <div className="col-12" style={{margin:'5px 0'}}>
                                <button className="btn btn-primary" onClick={() => copyTable('#table8')}>複製到表格</button>
                            </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <table className="table" id="table8">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">男</th>
                                        <th scope="col">女</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sampleSixParser(data, startDate, endDate).map((item) => {
                                        return (
                                            <tr>
                                                <th scope="row">{item.year}</th>
                                                <td>{item.dataset.male}</td>
                                                <td>{item.dataset.female}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <button className="btn btn-primary" onClick={()=>downloadScreenshot("byYearCalendarLineChart")}>下載圖表</button>
                        </div>
                        <div className="col-12 byYearCalendarLineChart">
                            <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                <div className="">
                                    {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                </div>
                                <div className="">
                                服務使用者意外 - 性別統計 (每年總數)
                                </div>
                            </div>
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Line"
                                loader={<div>Loading Chart</div>}
                                data={genderYearChart}
                                options={{
                                    chart: {
                                        title: '日曆年度',
                                        subtitle: '性別統計(每年總數)',
                                    },
                                }}
                            />
                        </div>
                        <div className="col-12">
                            <button className="btn btn-primary" onClick={()=>downloadScreenshot("byYearCalendarBarChart")}>下載圖表</button>
                        </div>
                        <div className="col-12 byYearCalendarBarChart">
                            <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                <div className="">
                                    {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                </div>
                                <div className="">
                                服務使用者意外 - 性別統計 (每年總數)
                                </div>
                            </div>
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={genderYearChart}
                                options={{
                                    // Material design options
                                    chart: {
                                        title: '日曆年度',
                                        subtitle: '性別統計(每年總數)',
                                    },
                                }}

                            />
                        </div>
                    </div>
                </>
            default:
                return null;
        }
    }

    const chartSwitch = () => {
        let title = `${moment(startDate).format("MM/YYYY")} - ${moment(endDate).format("MM/YYYY")} 服務使用者意外`

        switch (groupBy) {
            case "NON":
                return (
                    <React.Fragment>
                        <div className="row">
                            <div className="col-12">
                                <button className="btn btn-primary" onClick={()=>downloadScreenshot("nonBarChart")}>下載圖表</button>
                                <div className="nonBarChart">
                                    <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                        <div className="">
                                            {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                        </div>
                                        <div className="">
                                            服務使用者意外 - 性別統計 (每月總數)
                                        </div>
                                    </div>
                                    <Chart
                                        width={'100%'}
                                        height={'400px'}
                                        chartType={"Bar"}
                                        loader={<div className="d-flex justify-content-center align-items-center"> <div className="spinner-border text-primary" /></div>}
                                        data={[
                                            ["性別", "數量"],
                                            ["男", genderDataset.male],
                                            ["女", genderDataset.female],
                                        ]}
                                    />

                                </div>
                            </div>
                            <div className="col-12">
                                <button className="btn btn-primary" onClick={()=>downloadScreenshot("nonPieChart")}>下載圖表</button>
                                <div className="nonPieChart">
                                    <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                        
                                        <div className="">
                                            {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                        </div>
                                        <div className="">
                                            服務使用者意外 - 性別統計 (每月總數)
                                        </div>
                                    </div>
                                    <Chart
                                        width={'100%'}
                                        height={'600px'}
                                        chartType={"PieChart"}
                                        loader={<div className="d-flex justify-content-center align-items-center"> <div className="spinner-border text-primary" /></div>}
                                        options={{
                                            legend: {
                                                position: 'labeled',
                                                textStyle: {
                                                  fontName: 'monospace',
                                                  fontSize: 9
                                                }
                                              },
                                              pieSliceTextStyle: {
                                                fontSize: 8
                                              },
                                              sliceVisibilityThreshold: 0

                                        }}
                                        data={
                                            [
                                                ["性別", "數量"],
                                                ["男", genderDataset.male],
                                                ["女", genderDataset.female],
                                            ]
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                )
            case "BY_MONTH":
                let months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
                months -= startDate.getMonth();
                months += endDate.getMonth();
                let newWidth = (200 * months) + 200;
                return (
                    <div className="row">
                        <div className="col-12">
                            <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthBarChart")}>下載圖表</button>
                            
                        </div>
                        <div className="col-12 byMonthBarChart" style={{overflow:'auto'}}>
                            <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                <div className="">
                                    {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                </div>
                                <div className="">
                                    服務使用者意外 - 性別統計 (每月總數)
                                </div>
                            </div>
                            <Chart
                                width={newWidth}
                                height={400}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={[['月份', '男', '女'],
                                ...sampleTwoParser(data, startDate, endDate).map((item) => {
                                    return [item.month, item.dataset.male, item.dataset.female]
                                })]
                            }

                            />
                        </div>
                    </div>
                    
                )
            default:
                return null;
        }
    }

    const changeGroupHandler = (event) => {
        const value = event.target.value;
        if (value == 'BY_MONTH_FINANCIAL') {
            setStartDate(new Date(new Date().getFullYear()-1, 3, 1));
            setEndDate(new Date(new Date().getFullYear(),2,31));
        } else if (value == 'BY_MONTH_CALENDAR') {
            setStartDate(new Date(new Date().getFullYear(), 0, 1));
            setEndDate(new Date(new Date().getFullYear(),11,31));
        } else if (value == 'BY_YEAR_FINANCIAL') {
            setStartDate(new Date(new Date().getFullYear()-3, 3, 1));
            setEndDate(new Date(new Date().getFullYear(),2,31));
        } else if (value == 'BY_YEAR_FINANCIAL') {
            setStartDate(new Date(new Date().getFullYear()-3, 0, 1));
            setEndDate(new Date(new Date().getFullYear(),11,31));
        }
        setGroupBy(value);
    }

    function copyTable(id) {
        var urlField = document.querySelector(id);
        let range, sel;
        range = document.createRange();
        sel = window.getSelection();
        // unselect any element in the page
        sel.removeAllRanges();

        try {
            range.selectNodeContents(urlField);
            sel.addRange(range);
        } catch (e) {
            range.selectNode(urlField);
            sel.addRange(range);
        }

        document.execCommand('copy');
        sel.removeAllRanges();
    }

    useEffect(() => {
        switch (groupBy) {
            case "NON":
                console.log(data);
                setGenderDataset(sampleOneParser(data));
            case "BY_MONTH":
            case "BY_MONTH_FINANCIAL":
            case "BY_MONTH_CALENDAR":
            case "BY_YEAR_FINANCIAL":
            case "BY_YEAR_CALENDAR":
            default:
                console.log("default");
        }
    }, [groupBy, data])

    const downloadScreenshot = async(className) => {
        
        let chart = (document.querySelector("."+className) as HTMLElement);
        const canvas = await html2canvas(chart);
        const dataURL = canvas.toDataURL('image/png');
        downloadjs(dataURL, 'download.png', 'image/png');
    }
    
    return (
        <div>
            <div className="row mb-3">
                <div className="col">
                    <h6 style={{ fontWeight: 600 }}>統計資料 &gt; 服務使用者意外統計 &gt; 性別</h6>
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
                    <select multiple className="form-control" onChange={changeGroupHandler}>
                        <option value="NON">不需要</option>
                        <option value="BY_MONTH">按月</option>
                        <option value="BY_MONTH_FINANCIAL">按月 - 財政年度</option>
                        <option value="BY_MONTH_CALENDAR">按月 - 日曆年度</option>
                        <option value="BY_YEAR_FINANCIAL">按年 - 財政年度</option>
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
                        {props.permission.indexOf('All') >=0 && serviceLocation.length > 0 &&
                            serviceLocation.map((item) => {
                                return <option value={item.su_Eng_name_display}>{item.su_name_tc}</option>
                            })
                        }
                        {props.permission.indexOf('All') < 0 &&  serviceLocation.length > 0 &&
                          props.permission.map((item) => {
                              let ser = serviceLocation.filter(o => {return o.su_Eng_name_display == item});

                              if (ser.length > 0) {
                                  return <option value={ser[0].su_Eng_name_display}>{ser[0].su_name_tc}</option>
                              }
                              
                          })
                        }
                        {/*
                            serivceLocation.map((item) => <option value={item.su_Eng_name_display}>{item.su_name_tc}</option>)
                        */}
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
                {chartSwitch()}
            </div>
        </div>
    )
}

export default ServiceUserAccidentGender
