import * as React from 'react'
import { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as moment from 'moment';
import { useServiceUserStats } from '../../../hooks/useServiceUserStats';
import Chart from "react-google-charts";
import useServiceLocation from '../../../hooks/useServiceLocation';
import { getDateFinancialYear } from '../../../utils/DateUtils';
import arraySort from 'array-sort';
import html2canvas from 'html2canvas';
import downloadjs from 'downloadjs';
import "./ServiceUserAccident.css";
//Age interval
interface IDataset {
    lessThanFifteen: number;
    fifteenToTwenty: number;
    twentyOneToThirty: number;
    thirtyOneToforty: number;
    fortyOneTofifty: number;
    fiftyOneToSixty: number;
    greaterThanSixty: number;
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

interface ISampleDataTwoDataset {
    month: string;
    dataset: IDataset;
    mmyyyy: number;
}

interface ISampleSixDataset {
    year: number;
    dataset: IDataset;
}

interface ISampleFiveDataset {
    financialYear: string;
    dataset: IDataset;
}

interface ISampleDataFour {
    year: number;
    dataset: IMonth;
}

interface ISampleThreeDataset {
    financialYear: string;
    dataset: IMonth;
}

const initialDataset: IDataset = {
    lessThanFifteen: 0,
    fifteenToTwenty: 0,
    twentyOneToThirty: 0,
    thirtyOneToforty: 0,
    fortyOneTofifty: 0,
    fiftyOneToSixty: 0,
    greaterThanSixty: 0,
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
    let lessThanFifteen =['<15歲'];
    let fifteenToTwenty =['15-20歲'];
    let twentyOneToThirty =['21-30歲'];
    let thirtyOneToforty =['31-40歲'];
    let fortyOneTofifty =['41-50歲'];
    let fiftyOneToSixty =['51-60歲'];
    let greaterThanSixty =['>60歲'];
    result.map((item) => {
        dataResult.push(item.financialYear);
        lessThanFifteen.push(item.dataset['lessThanFifteen']);
        fifteenToTwenty.push(item.dataset['fifteenToTwenty']);
        twentyOneToThirty.push(item.dataset['twentyOneToThirty']);
        thirtyOneToforty.push(item.dataset['thirtyOneToforty']);
        fortyOneTofifty.push(item.dataset['fortyOneTofifty']);
        fiftyOneToSixty.push(item.dataset['fiftyOneToSixty']);
        greaterThanSixty.push(item.dataset['greaterThanSixty']);
    });
    let data=[
        dataResult,
        lessThanFifteen,
        fifteenToTwenty,
        twentyOneToThirty,
        thirtyOneToforty,
        fortyOneTofifty,
        fiftyOneToSixty,
        greaterThanSixty
    ];
    return data;
}

const yearChartParser = (result) =>{
    let dataResult = ['Year'];
    let lessThanFifteen =['<15歲'];
    let fifteenToTwenty =['15-20歲'];
    let twentyOneToThirty =['21-30歲'];
    let thirtyOneToforty =['31-40歲'];
    let fortyOneTofifty =['41-50歲'];
    let fiftyOneToSixty =['51-60歲'];
    let greaterThanSixty =['>60歲'];
    result.map((item) => {
        dataResult.push(item.year.toString());
        lessThanFifteen.push(item.dataset['lessThanFifteen']);
        fifteenToTwenty.push(item.dataset['fifteenToTwenty']);
        twentyOneToThirty.push(item.dataset['twentyOneToThirty']);
        thirtyOneToforty.push(item.dataset['thirtyOneToforty']);
        fortyOneTofifty.push(item.dataset['fortyOneTofifty']);
        fiftyOneToSixty.push(item.dataset['fiftyOneToSixty']);
        greaterThanSixty.push(item.dataset['greaterThanSixty']);
    });
    let data=[
        dataResult,
        lessThanFifteen,
        fifteenToTwenty,
        twentyOneToThirty,
        thirtyOneToforty,
        fortyOneTofifty,
        fiftyOneToSixty,
        greaterThanSixty
    ];
    return data;
}

const agefilter = (age: number, dataset: IDataset): IDataset => {
    let result = { ...dataset };
    if (age < 15) {
        result.lessThanFifteen = result.lessThanFifteen + 1;
    } else if (age >= 15 && age <= 20) {
        result.fifteenToTwenty = result.fifteenToTwenty + 1;
    } else if (age >= 21 && age <= 30) {
        result.twentyOneToThirty = result.twentyOneToThirty + 1;
    } else if (age >= 31 && age <= 40) {
        result.thirtyOneToforty = result.thirtyOneToforty + 1;
    } else if (age >= 41 && age <= 50) {
        result.fortyOneTofifty = result.fortyOneTofifty + 1;
    } else if (age >= 51 && age <= 60) {
        result.fifteenToTwenty = result.fifteenToTwenty + 1;
    } else {
        result.greaterThanSixty = result.greaterThanSixty + 1;
    }
    return result;
}

const monthZero = (dataset: IMonth = initialDatasetMonth): IMonth => {
    let result = { ...dataset };
    return result;
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

const sampleOneParser = (serviceUserAge: any[]) => {
    let dataset: IDataset = { ...initialDataset };
    serviceUserAge.forEach((item) => {
        dataset = agefilter(item.ServiceUserAge, dataset);
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

const sampleTwoParser = (serviceUserAge: any[], startDate: Date, endDate: Date): ISampleDataTwoDataset[] => {
    let m = new Map<string, IDataset>();
    let result: ISampleDataTwoDataset[] = [];

    const diff = monthDiff(startDate, endDate);
    for (let i = diff; i > -1; i--) {
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
    
    serviceUserAge.forEach((item) => {
        if ((item.AccidentTime || item.IncidentTime) && item.CaseNumber) {
            const formType: string = item.CaseNumber.split("-")[0];
            const date = new Date(item.AccidentTime || item.IncidentTime);
            const formattedDate = moment(date).format("MM/yyyy");
            if (m.has(formattedDate)) {
                let oldDataset = m.get(formattedDate);
                let newDataset = agefilter(item.ServiceUserAge, oldDataset);
                m.set(formattedDate, newDataset);
            } else {
                let newDataset = agefilter(item.ServiceUserAge, initialDataset);
                m.set(formattedDate, newDataset);
            }
        }
    });

    m.forEach((value, key) => {
        let item: ISampleDataTwoDataset = { month: key, dataset: value, mmyyyy:parseInt(key.substr(3,4) + key.substr(0,2)) }
        result.push(item);
    })
    arraySort(result, 'mmyyyy');
    return result;
}

const sampleThreeParser = (serviceUserAge: any[], startDate:Date, endDate:Date): ISampleThreeDataset[] => {
    let result: ISampleThreeDataset[] = [];
    let m = new Map<string, IMonth>();

    serviceUserAge.forEach((item) => {
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

const sampleFourParser = (serviceUserAge: any[], startDate: Date, endDate: Date): ISampleDataFour[] => {
    let result: ISampleDataFour[] = []
    const m = new Map<number, IMonth>();

    const startYear = startDate.getFullYear()
    const endYear = endDate.getFullYear();
    const distance = endYear - startYear;
    for (let i = distance; i > 0; i--) {
        let a = new Date(new Date().setFullYear(endYear - i)).getFullYear();
        m.set(a, { ...initialDatasetMonth });
    }

    serviceUserAge.forEach((item) => {
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
        let item: ISampleDataFour = { year: key, dataset: value }
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
            let item: ISampleDataFour = { year: parseInt(key), dataset: value }
            result.push(item);
        })
    }
    
    arraySort(result, 'year');
    return result;
}

const sampleFiveParser = (serviceUserAge: any[], startDate: Date, endDate: Date): ISampleFiveDataset[] => {
    let result: ISampleFiveDataset[] = []
    let m = new Map<string, IDataset>();

    serviceUserAge.forEach((item) => {
        const d = new Date(item.AccidentTime || item.IncidentTime);
        if (d) {

            const currentFinicailYear = getDateFinancialYear(d);
            if (m.has(currentFinicailYear)) {
                let oldDataset = m.get(currentFinicailYear);
                let newDataset = agefilter(item.ServiceUserAge, oldDataset);
                m.set(currentFinicailYear, newDataset);
            } else {
                let newDataset = agefilter(item.ServiceUserAge, { ...initialDataset });
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

const sampleSixParser = (serviceUserAge: any[], startDate: Date, endDate: Date): ISampleSixDataset[] => {

    let result: ISampleSixDataset[] = []
    let m = new Map<string, IDataset>();

    const startYear = startDate.getFullYear()
    const endYear = endDate.getFullYear();
    const distance = endYear - startYear;
    for (let i = distance; i > 0; i--) {
        let a = new Date(new Date().setFullYear(endYear - i)).getFullYear()
        m.set(a.toString(), { ...initialDataset });
    }

    serviceUserAge.forEach((item) => {
        if ((item.AccidentTime || item.IncidentTime) && item.CaseNumber) {
            const year = new Date(item.AccidentTime || item.IncidentTime).getFullYear().toString();
            const month = new Date(item.AccidentTime || item.IncidentTime).getMonth() + 1;
            const formType: string = item.CaseNumber.split("-")[0];
            if (m.has(year)) {
                let oldDataset = m.get(year);
                let newDataset = agefilter(item.ServiceUserAge, oldDataset);
                m.set(year, newDataset);
            } else {
                let newDataset = agefilter(item.ServiceUserAge, { ...initialDataset });
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

function ServiceUserAccidentAge(siteCollectionUrl) {

    const [groupBy, setGroupBy] = useState("NON");
    const [ageDataset, setAgeDataset] = useState<IDataset>(initialDataset);
    const [serivceLocation] = useServiceLocation(siteCollectionUrl.siteCollectionUrl);
    const [serviceUserAge, startDate, endDate, serviceUnits, setStartDate, setEndDate, setServiceUnits] = useServiceUserStats();

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
                        <th scope="row">&lt;15歲</th>
                        <th>{ageDataset.lessThanFifteen}</th>
                    </tr>
                    <tr>
                        <th scope="row">15-20歲</th>
                        <th>{ageDataset.fifteenToTwenty}</th>
                    </tr>
                    <tr>
                        <th scope="row">21-30歲</th>
                        <th>{ageDataset.twentyOneToThirty}</th>
                    </tr>
                    <tr>
                        <th scope="row">31-40歲</th>
                        <th>{ageDataset.thirtyOneToforty}</th>
                    </tr>
                    <tr>
                        <th scope="row">41-50歲</th>
                        <th>{ageDataset.fortyOneTofifty}</th>
                    </tr>
                    <tr>
                        <th scope="row">51-60歲</th>
                        <th>{ageDataset.fiftyOneToSixty}</th>
                    </tr>
                    <tr>
                        <th scope="row">&gt;60歲</th>
                        <th>{ageDataset.greaterThanSixty}</th>
                    </tr>
                </tbody>
            </table >
        )
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
                setAgeDataset(sampleOneParser(serviceUserAge));
            case "BY_MONTH":
            case "BY_MONTH_FINANCIAL":
            case "BY_MONTH_CALENDAR":
            case "BY_YEAR_FINANCIAL":
            case "BY_YEAR_CALENDAR":
            default:
                console.log("default");
        }
    }, [groupBy, serviceUserAge])

    const downloadScreenshot = async(className) => {
        
        let chart = (document.querySelector("."+className) as HTMLElement);
        const canvas = await html2canvas(chart);
        const dataURL = canvas.toDataURL('image/png');
        downloadjs(dataURL, 'download.png', 'image/png');
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
                            <div className="col-11">
                                <h6>{`${title} - 年齡統計 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
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
                            <div className="col-11">
                                <h6>{`${title} - 年齡統計(每月總數) - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
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
                                            <th scope="col"></th>
                                            <th scope="col">&lt;15歲</th>
                                            <th scope="col">15-20歲</th>
                                            <th scope="col">21-30歲</th>
                                            <th scope="col">31-40歲</th>
                                            <th scope="col">41-50歲</th>
                                            <th scope="col">51-60歲</th>
                                            <th scope="col">&gt;60歲</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            sampleTwoParser(serviceUserAge, startDate, endDate).map((item) => {
                                                return (
                                                    <tr>
                                                        <th scope="row">{item.month}</th>
                                                        <th>{item.dataset.lessThanFifteen}</th>
                                                        <th>{item.dataset.fifteenToTwenty}</th>
                                                        <th>{item.dataset.twentyOneToThirty}</th>
                                                        <th>{item.dataset.thirtyOneToforty}</th>
                                                        <th>{item.dataset.fortyOneTofifty}</th>
                                                        <th>{item.dataset.fiftyOneToSixty}</th>
                                                        <th>{item.dataset.greaterThanSixty}</th>
                                                    </tr>
                                                )
                                            })
                                        }
                                        {
                                            <tr>
                                                <th scope="row">總數</th>
                                                <th>{ageDataset.lessThanFifteen}</th>
                                                <th>{ageDataset.fifteenToTwenty}</th>
                                                <th>{ageDataset.twentyOneToThirty}</th>
                                                <th>{ageDataset.thirtyOneToforty}</th>
                                                <th>{ageDataset.fortyOneTofifty}</th>
                                                <th>{ageDataset.fiftyOneToSixty}</th>
                                                <th>{ageDataset.greaterThanSixty}</th>
                                            </tr>
                                        }
                                    </tbody>
                                </table >
                            </div>
                        </div>
                    </>
                )
            case "BY_MONTH_FINANCIAL":
                let lessThanFifteenMFResult = sampleThreeParser(serviceUserAge.filter((item) => {return item.ServiceUserAge < 15}), startDate, endDate);
                let lessThanFifteenMFChart = financialYearChartParser(lessThanFifteenMFResult);

                let fifteenToTwentyMFResult = sampleThreeParser(serviceUserAge.filter((item) => {return item.ServiceUserAge >= 15 && item.ServiceUserAge <= 20}), startDate, endDate);
                let fifteenToTwentyMFChart = financialYearChartParser(fifteenToTwentyMFResult);

                let twentyOneToThirtyMFResult = sampleThreeParser(serviceUserAge.filter((item) => {return item.ServiceUserAge >= 21 && item.ServiceUserAge <= 30}), startDate, endDate);
                let twentyOneToThirtyMFChart = financialYearChartParser(twentyOneToThirtyMFResult);

                let thirtyOneTofortyMFResult = sampleThreeParser(serviceUserAge.filter((item) => {return item.ServiceUserAge >= 31 && item.ServiceUserAge <= 40}), startDate, endDate);
                let thirtyOneTofortyMFChart = financialYearChartParser(thirtyOneTofortyMFResult);

                let fortyOneTofiftyMFResult = sampleThreeParser(serviceUserAge.filter((item) => {return item.ServiceUserAge >= 41 && item.ServiceUserAge <= 50}), startDate, endDate);
                let fortyOneTofiftyMFChart = financialYearChartParser(fortyOneTofiftyMFResult);

                let fiftyOneToSixtyMFResult = sampleThreeParser(serviceUserAge.filter((item) => {return item.ServiceUserAge >= 51 && item.ServiceUserAge <= 60}), startDate, endDate);
                let fiftyOneToSixtyMFChart = financialYearChartParser(fiftyOneToSixtyMFResult);

                let greaterThanSixtyMFResult = sampleThreeParser(serviceUserAge.filter((item) => {return item.ServiceUserAge >= 61}), startDate, endDate);
                let greaterThanSixtyMFChart = financialYearChartParser(greaterThanSixtyMFResult);
                return (
                    <>
                        <div className="row">
                            <div className="col-1">
                                <h6 style={{ fontWeight: 600 }}>
                                    標題:
                                </h6>
                            </div>
                            <div className="col-11">
                                <h6>{`<15歲 - 年齡統計(每月總數) - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
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
                                            <th scope="col"></th>
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
                                        {
                                            lessThanFifteenMFResult.map((item) => {
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
                                            })
                                        }
                                    </tbody>
                                </table >
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
                                        服務使用者意外 - 年齡統計 (每月總數)
                                    </div>
                                </div>
                                <Chart
                                    width={'100%'}
                                    height={'400px'}
                                    chartType="Line"
                                    loader={<div>Loading Chart</div>}
                                    data={lessThanFifteenMFChart}
                                    options={{
                                        chart: {
                                            title: '財政年度',
                                            subtitle: '<15歲 - 年齡統計(每月總數)',
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
                                        服務使用者意外 - 年齡統計 (每月總數)
                                    </div>
                                </div>
                                <Chart
                                    width={'100%'}
                                    height={'400px'}
                                    chartType="Bar"
                                    loader={<div>Loading Chart</div>}
                                    data={lessThanFifteenMFChart}
                                    options={{
                                        // Material design options
                                        chart: {
                                            title: '財政年度',
                                            subtitle: '<15歲 - 年齡統計(每月總數)',
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
                            <div className="col-11">
                                <h6>{`15-20歲 - 年齡統計(每月總數) - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
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
                                            <th scope="col"></th>
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
                                        {
                                            fifteenToTwentyMFResult.map((item) => {
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
                                            })
                                        }
                                    </tbody>
                                </table >
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
                                    服務使用者意外 - 年齡統計 (每月總數)
                                    </div>
                                </div>
                                <Chart
                                    width={'100%'}
                                    height={'400px'}
                                    chartType="Line"
                                    loader={<div>Loading Chart</div>}
                                    data={fifteenToTwentyMFChart}
                                    options={{
                                        chart: {
                                            title: '財政年度',
                                            subtitle: '15-20歲 - 年齡統計(每月總數)',
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
                                    服務使用者意外 - 年齡統計 (每月總數)
                                    </div>
                                </div>
                                <Chart
                                    width={'100%'}
                                    height={'400px'}
                                    chartType="Bar"
                                    loader={<div>Loading Chart</div>}
                                    data={fifteenToTwentyMFChart}
                                    options={{
                                        // Material design options
                                        chart: {
                                            title: '財政年度',
                                            subtitle: '15-20歲 - 年齡統計(每月總數)',
                                        },
                                    }}
  
                                />
                            </div>
                        </div>
                        <hr/>
                        <div className="row" style={{marginTop:'50px'}}>
                            <div className="col-1">
                                <h6 style={{ fontWeight: 600 }}>
                                    標題:
                                </h6>
                            </div>
                            <div className="col-11">
                                <h6>{`21-30歲 - 年齡統計(每月總數) - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
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
                                            <th scope="col"></th>
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
                                        {
                                            twentyOneToThirtyMFResult.map((item) => {
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
                                            })
                                        }
                                    </tbody>
                                </table >
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthFinancialLineChart3")}>下載圖表</button> 
                            </div>
                            <div className="col-12 byMonthFinancialLineChart3">
                                <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                    <div className="">
                                        {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                    </div>
                                    <div className="">
                                    服務使用者意外 - 年齡統計 (每月總數)
                                    </div>
                                </div>
                                <Chart
                                    width={'100%'}
                                    height={'400px'}
                                    chartType="Line"
                                    loader={<div>Loading Chart</div>}
                                    data={twentyOneToThirtyMFChart}
                                    options={{
                                        chart: {
                                            title: '財政年度',
                                            subtitle: '21-30歲 - 年齡統計(每月總數)',
                                        },
                                    }}

                                />
                            </div>
                            <div className="col-12">
                                <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthFinancialBarChart3")}>下載圖表</button>
                            </div>
                            <div className="col-12 byMonthFinancialBarChart3">
                                <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                    <div className="">
                                        {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                    </div>
                                    <div className="">
                                    服務使用者意外 - 年齡統計 (每月總數)
                                    </div>
                                </div>
                                <Chart
                                    width={'100%'}
                                    height={'400px'}
                                    chartType="Bar"
                                    loader={<div>Loading Chart</div>}
                                    data={twentyOneToThirtyMFChart}
                                    options={{
                                        // Material design options
                                        chart: {
                                            title: '財政年度',
                                            subtitle: '21-30歲 - 年齡統計(每月總數)',
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
                            <div className="col-11">
                                <h6>{`31-40歲 - 年齡統計(每月總數) - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
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
                                            <th scope="col"></th>
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
                                        {
                                            thirtyOneTofortyMFResult.map((item) => {
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
                                            })
                                        }
                                    </tbody>
                                </table >
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthFinancialLineChart4")}>下載圖表</button> 
                            </div>
                            <div className="col-12 byMonthFinancialLineChart4">
                                <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                    <div className="">
                                        {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                    </div>
                                    <div className="">
                                    服務使用者意外 - 年齡統計 (每月總數)
                                    </div>
                                </div>
                                <Chart
                                    width={'100%'}
                                    height={'400px'}
                                    chartType="Line"
                                    loader={<div>Loading Chart</div>}
                                    data={thirtyOneTofortyMFChart}
                                    options={{
                                        chart: {
                                            title: '財政年度',
                                            subtitle: '31-40歲 - 年齡統計(每月總數)',
                                        },
                                    }}

                                />
                            </div>
                            <div className="col-12">
                                <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthFinancialBarChart4")}>下載圖表</button>
                            </div>
                            <div className="col-12 byMonthFinancialBarChart4">
                                <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                    <div className="">
                                        {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                    </div>
                                    <div className="">
                                    服務使用者意外 - 年齡統計 (每月總數)
                                    </div>
                                </div>
                                <Chart
                                    width={'100%'}
                                    height={'400px'}
                                    chartType="Bar"
                                    loader={<div>Loading Chart</div>}
                                    data={thirtyOneTofortyMFChart}
                                    options={{
                                        // Material design options
                                        chart: {
                                            title: '財政年度',
                                            subtitle: '31-40歲 - 年齡統計(每月總數)',
                                        },
                                    }}
  
                                />
                            </div>
                        </div>

                        <div className="row" style={{marginTop:'50px'}}>
                            <div className="col-1">
                                <h6 style={{ fontWeight: 600 }}>
                                    標題:
                                </h6>
                            </div>
                            <div className="col-11">
                                <h6>{`41-50歲 - 年齡統計(每月總數) - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
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
                                            <th scope="col"></th>
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
                                        {
                                            fortyOneTofiftyMFResult.map((item) => {
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
                                            })
                                        }
                                    </tbody>
                                </table >
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthFinancialLineChart5")}>下載圖表</button> 
                            </div>
                            <div className="col-12 byMonthFinancialLineChart5">
                                <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                    <div className="">
                                        {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                    </div>
                                    <div className="">
                                    服務使用者意外 - 年齡統計 (每月總數)
                                    </div>
                                </div>
                                <Chart
                                    width={'100%'}
                                    height={'400px'}
                                    chartType="Line"
                                    loader={<div>Loading Chart</div>}
                                    data={fortyOneTofiftyMFChart}
                                    options={{
                                        chart: {
                                            title: '財政年度',
                                            subtitle: '41-50歲 - 年齡統計(每月總數)',
                                        },
                                    }}

                                />
                            </div>
                            <div className="col-12">
                                <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthFinancialBarChart5")}>下載圖表</button>
                            </div>
                            <div className="col-12 byMonthFinancialBarChart5">
                                <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                    <div className="">
                                        {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                    </div>
                                    <div className="">
                                    服務使用者意外 - 年齡統計 (每月總數)
                                    </div>
                                </div>
                                <Chart
                                    width={'100%'}
                                    height={'400px'}
                                    chartType="Bar"
                                    loader={<div>Loading Chart</div>}
                                    data={fortyOneTofiftyMFChart}
                                    options={{
                                        // Material design options
                                        chart: {
                                            title: '財政年度',
                                            subtitle: '41-50歲 - 年齡統計(每月總數)',
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
                            <div className="col-11">
                                <h6>{`51-60歲 - 年齡統計(每月總數) - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
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
                                            <th scope="col"></th>
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
                                        {
                                            fiftyOneToSixtyMFResult.map((item) => {
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
                                            })
                                        }
                                    </tbody>
                                </table >
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthFinancialLineChart6")}>下載圖表</button> 
                            </div>
                            <div className="col-12 byMonthFinancialLineChart6">
                                <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                    <div className="">
                                        {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                    </div>
                                    <div className="">
                                    服務使用者意外 - 年齡統計 (每月總數)
                                    </div>
                                </div>
                                <Chart
                                    width={'100%'}
                                    height={'400px'}
                                    chartType="Line"
                                    loader={<div>Loading Chart</div>}
                                    data={fiftyOneToSixtyMFChart}
                                    options={{
                                        chart: {
                                            title: '財政年度',
                                            subtitle: '51-60歲 - 年齡統計(每月總數)',
                                        },
                                    }}

                                />
                            </div>
                            <div className="col-12">
                                <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthFinancialBarChart6")}>下載圖表</button>
                            </div>
                            <div className="col-12 byMonthFinancialBarChart6">
                                <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                    <div className="">
                                        {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                    </div>
                                    <div className="">
                                    服務使用者意外 - 年齡統計 (每月總數)
                                    </div>
                                </div>
                                <Chart
                                    width={'100%'}
                                    height={'400px'}
                                    chartType="Bar"
                                    loader={<div>Loading Chart</div>}
                                    data={fiftyOneToSixtyMFChart}
                                    options={{
                                        // Material design options
                                        chart: {
                                            title: '財政年度',
                                            subtitle: '51-60歲 - 年齡統計(每月總數)',
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
                            <div className="col-11">
                                <h6>{`>60歲 - 年齡統計(每月總數) - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
                            </div>
                            <div className="col-12" style={{margin:'5px 0'}}>
                                <button className="btn btn-primary" onClick={() => copyTable('#table9')}>複製到表格</button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <table className="table" id="table9">
                                    <thead>
                                        <tr>
                                            <th scope="col"></th>
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
                                        {
                                            greaterThanSixtyMFResult.map((item) => {
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
                                            })
                                        }
                                    </tbody>
                                </table >
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthFinancialLineChart7")}>下載圖表</button> 
                            </div>
                            <div className="col-12 byMonthFinancialLineChart7">
                                <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                    <div className="">
                                        {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                    </div>
                                    <div className="">
                                    服務使用者意外 - 年齡統計 (每月總數)
                                    </div>
                                </div>
                                <Chart
                                    width={'100%'}
                                    height={'400px'}
                                    chartType="Line"
                                    loader={<div>Loading Chart</div>}
                                    data={greaterThanSixtyMFChart}
                                    options={{
                                        chart: {
                                            title: '財政年度',
                                            subtitle: '>60歲 - 年齡統計(每月總數)',
                                        },
                                    }}

                                />
                            </div>
                            <div className="col-12">
                                <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthFinancialBarChart7")}>下載圖表</button>
                            </div>
                            <div className="col-12 byMonthFinancialBarChart7">
                                <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                    <div className="">
                                        {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                    </div>
                                    <div className="">
                                    服務使用者意外 - 年齡統計 (每月總數)
                                    </div>
                                </div>
                                <Chart
                                    width={'100%'}
                                    height={'400px'}
                                    chartType="Bar"
                                    loader={<div>Loading Chart</div>}
                                    data={greaterThanSixtyMFChart}
                                    options={{
                                        // Material design options
                                        chart: {
                                            title: '財政年度',
                                            subtitle: '>60歲 - 年齡統計(每月總數)',
                                        },
                                    }}
  
                                />
                            </div>
                        </div>
                    </>
                )
            case "BY_MONTH_CALENDAR":
                let titleYear2 = "";
                let lessThanFifteenMCResult = sampleFourParser(serviceUserAge.filter((item) => {return item.ServiceUserAge < 15}), startDate, endDate);
                let lessThanFifteenMCChart = normalChartParser(lessThanFifteenMCResult);

                let fifteenToTwentyMCResult = sampleFourParser(serviceUserAge.filter((item) => {return item.ServiceUserAge >= 15 && item.ServiceUserAge <= 20}), startDate, endDate);
                let fifteenToTwentyMCChart = normalChartParser(fifteenToTwentyMCResult);

                let twentyOneToThirtyMCResult = sampleFourParser(serviceUserAge.filter((item) => {return item.ServiceUserAge >= 21 && item.ServiceUserAge <= 30}), startDate, endDate);
                let twentyOneToThirtyMCChart = normalChartParser(twentyOneToThirtyMCResult);

                let thirtyOneTofortyMCResult = sampleFourParser(serviceUserAge.filter((item) => {return item.ServiceUserAge >= 31 && item.ServiceUserAge <= 40}), startDate, endDate);
                let thirtyOneTofortyMCChart = normalChartParser(thirtyOneTofortyMCResult);

                let fortyOneTofiftyMCResult = sampleFourParser(serviceUserAge.filter((item) => {return item.ServiceUserAge >= 41 && item.ServiceUserAge <= 50}), startDate, endDate);
                let fortyOneTofiftyMCChart = normalChartParser(fortyOneTofiftyMCResult);

                let fiftyOneToSixtyMCResult = sampleFourParser(serviceUserAge.filter((item) => {return item.ServiceUserAge >= 51 && item.ServiceUserAge <= 60}), startDate, endDate);
                let fiftyOneToSixtyMCChart = normalChartParser(fiftyOneToSixtyMCResult);

                let greaterThanSixtyMCResult = sampleFourParser(serviceUserAge.filter((item) => {return item.ServiceUserAge >= 61}), startDate, endDate);
                let greaterThanSixtyMCChart = normalChartParser(greaterThanSixtyMCResult);

                lessThanFifteenMCResult.forEach((item, i) => {
                    titleYear2 += item.year
                    if (i !== lessThanFifteenMCResult.length - 1) {
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
                            <div className="col-11">
                                <h6>{`${titleYear2}年 <15歲 - 年齡統計(每月總數) - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
                            </div>
                            <div className="col-12" style={{margin:'5px 0'}}>
                                <button className="btn btn-primary" onClick={() => copyTable('#table10')}>複製到表格</button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <table className="table" id="table10">
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
                                        {lessThanFifteenMCResult.map((item) => {
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
                                    服務使用者意外 - 年齡統計 (每月總數)
                                    </div>
                                </div>
                                <Chart
                                    width={'100%'}
                                    height={'400px'}
                                    chartType="Line"
                                    loader={<div>Loading Chart</div>}
                                    data={lessThanFifteenMCChart}
                                    options={{
                                        chart: {
                                            title: '日曆年度',
                                            subtitle: '<15歲 - 年齡統計(每月總數)',
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
                                    服務使用者意外 - 年齡統計 (每月總數)
                                    </div>
                                </div>
                                <Chart
                                    width={'100%'}
                                    height={'400px'}
                                    chartType="Bar"
                                    loader={<div>Loading Chart</div>}
                                    data={lessThanFifteenMCChart}
                                    options={{
                                        // Material design options
                                        chart: {
                                            title: '日曆年度',
                                            subtitle: '<15歲 - 年齡統計(每月總數)',
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
                            <div className="col-11">
                                <h6>{`${titleYear2}年 15-20歲 - 年齡統計(每月總數) - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
                            </div>
                            <div className="col-12" style={{margin:'5px 0'}}>
                                <button className="btn btn-primary" onClick={() => copyTable('#table11')}>複製到表格</button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <table className="table" id="table11">
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
                                        {fifteenToTwentyMCResult.map((item) => {
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
                                    服務使用者意外 - 年齡統計 (每月總數)
                                    </div>
                                </div>
                                <Chart
                                    width={'100%'}
                                    height={'400px'}
                                    chartType="Line"
                                    loader={<div>Loading Chart</div>}
                                    data={fifteenToTwentyMCChart}
                                    options={{
                                        chart: {
                                            title: '日曆年度',
                                            subtitle: '15-20歲 - 年齡統計(每月總數)',
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
                                    服務使用者意外 - 年齡統計 (每月總數)
                                    </div>
                                </div>
                                <Chart
                                    width={'100%'}
                                    height={'400px'}
                                    chartType="Bar"
                                    loader={<div>Loading Chart</div>}
                                    data={fifteenToTwentyMCChart}
                                    options={{
                                        // Material design options
                                        chart: {
                                            title: '日曆年度',
                                            subtitle: '15-20歲 - 年齡統計(每月總數)',
                                        },
                                    }}

                                />
                            </div>
                        </div>
                        <hr/>
                        <div className="row" style={{marginTop:'50px'}}>
                            <div className="col-1">
                                <h6 style={{ fontWeight: 600 }}>
                                    標題:
                                </h6>
                            </div>
                            <div className="col-11">
                                <h6>{`${titleYear2}年 21-30歲 - 年齡統計(每月總數) - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
                            </div>
                            <div className="col-12" style={{margin:'5px 0'}}>
                                <button className="btn btn-primary" onClick={() => copyTable('#table12')}>複製到表格</button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <table className="table" id="table12">
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
                                        {twentyOneToThirtyMCResult.map((item) => {
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
                                <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthCalendarLineChart3")}>下載圖表</button>
                            </div>
                            <div className="col-12 byMonthCalendarLineChart3">
                                <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                    <div className="">
                                        {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                    </div>
                                    <div className="">
                                    服務使用者意外 - 年齡統計 (每月總數)
                                    </div>
                                </div>
                                <Chart
                                    width={'100'}
                                    height={'400px'}
                                    chartType="Line"
                                    loader={<div>Loading Chart</div>}
                                    data={twentyOneToThirtyMCChart}
                                    options={{
                                        chart: {
                                            title: '日曆年度',
                                            subtitle: '21-30歲 - 年齡統計(每月總數)',
                                        },
                                    }}
                                />
                            </div>
                            <div className="col-12">
                                <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthCalendarBarChart3")}>下載圖表</button>
                            </div>
                            <div className="col-12 byMonthCalendarBarChart3">
                                <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                    <div className="">
                                        {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                    </div>
                                    <div className="">
                                    服務使用者意外 - 年齡統計 (每月總數)
                                    </div>
                                </div>
                                <Chart
                                    width={'100%'}
                                    height={'400px'}
                                    chartType="Bar"
                                    loader={<div>Loading Chart</div>}
                                    data={twentyOneToThirtyMCChart}
                                    options={{
                                        // Material design options
                                        chart: {
                                            title: '日曆年度',
                                            subtitle: '21-30歲 - 年齡統計(每月總數)',
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
                            <div className="col-11">
                                <h6>{`${titleYear2}年 31-40歲 - 年齡統計(每月總數) - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
                            </div>
                            <div className="col-12" style={{margin:'5px 0'}}>
                                <button className="btn btn-primary" onClick={() => copyTable('#table13')}>複製到表格</button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <table className="table" id="table13">
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
                                        {thirtyOneTofortyMCResult.map((item) => {
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
                                <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthCalendarLineChart4")}>下載圖表</button>
                            </div>
                            <div className="col-12 byMonthCalendarLineChart4">
                                <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                    <div className="">
                                        {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                    </div>
                                    <div className="">
                                    服務使用者意外 - 年齡統計 (每月總數)
                                    </div>
                                </div>
                                <Chart
                                    width={'100%'}
                                    height={'400px'}
                                    chartType="Line"
                                    loader={<div>Loading Chart</div>}
                                    data={thirtyOneTofortyMCChart}
                                    options={{
                                        chart: {
                                            title: '日曆年度',
                                            subtitle: '31-40歲 - 年齡統計(每月總數)',
                                        },
                                    }}
                                />
                            </div>
                            <div className="col-12">
                                <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthCalendarBarChart4")}>下載圖表</button>
                            </div>
                            <div className="col-12 byMonthCalendarBarChart4">
                                <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                    <div className="">
                                        {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                    </div>
                                    <div className="">
                                    服務使用者意外 - 年齡統計 (每月總數)
                                    </div>
                                </div>
                                <Chart
                                    width={'100%'}
                                    height={'300px'}
                                    chartType="Bar"
                                    loader={<div>Loading Chart</div>}
                                    data={thirtyOneTofortyMCChart}
                                    options={{
                                        // Material design options
                                        chart: {
                                            title: '日曆年度',
                                            subtitle: '31-40歲 - 年齡統計(每月總數)',
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
                            <div className="col-11">
                                <h6>{`${titleYear2}年 41-50歲 - 年齡統計(每月總數) - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
                            </div>
                            <div className="col-12" style={{margin:'5px 0'}}>
                                <button className="btn btn-primary" onClick={() => copyTable('#table14')}>複製到表格</button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <table className="table" id="table14">
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
                                        {fortyOneTofiftyMCResult.map((item) => {
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
                                <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthCalendarLineChart5")}>下載圖表</button>
                            </div>
                            <div className="col-12 byMonthCalendarLineChart5">
                                <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                    <div className="">
                                        {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                    </div>
                                    <div className="">
                                    服務使用者意外 - 年齡統計 (每月總數)
                                    </div>
                                </div>
                                <Chart
                                    width={'100%'}
                                    height={'400px'}
                                    chartType="Line"
                                    loader={<div>Loading Chart</div>}
                                    data={fortyOneTofiftyMCChart}
                                    options={{
                                        chart: {
                                            title: '日曆年度',
                                            subtitle: '41-50歲 - 年齡統計(每月總數)',
                                        },
                                    }}
                                />
                            </div>
                            <div className="col-12">
                                <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthCalendarBarChart5")}>下載圖表</button>
                            </div>
                            <div className="col-12 byMonthCalendarBarChart5">
                                <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                    <div className="">
                                        {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                    </div>
                                    <div className="">
                                    服務使用者意外 - 年齡統計 (每月總數)
                                    </div>
                                </div>
                                <Chart
                                    width={'100%'}
                                    height={'300px'}
                                    chartType="Bar"
                                    loader={<div>Loading Chart</div>}
                                    data={fortyOneTofiftyMCChart}
                                    options={{
                                        // Material design options
                                        chart: {
                                            title: '日曆年度',
                                            subtitle: '41-50歲 - 年齡統計(每月總數)',
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
                            <div className="col-11">
                                <h6>{`${titleYear2}年 51-60歲 - 年齡統計(每月總數) - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
                            </div>
                            <div className="col-12" style={{margin:'5px 0'}}>
                                <button className="btn btn-primary" onClick={() => copyTable('#table15')}>複製到表格</button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <table className="table" id="table15">
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
                                        {fiftyOneToSixtyMCResult.map((item) => {
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
                                <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthCalendarLineChart6")}>下載圖表</button>
                            </div>
                            <div className="col-12 byMonthCalendarLineChart6">
                                <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                    <div className="">
                                        {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                    </div>
                                    <div className="">
                                    服務使用者意外 - 年齡統計 (每月總數)
                                    </div>
                                </div>
                                <Chart
                                    width={'100%'}
                                    height={'400px'}
                                    chartType="Line"
                                    loader={<div>Loading Chart</div>}
                                    data={fiftyOneToSixtyMCChart}
                                    options={{
                                        chart: {
                                            title: '日曆年度',
                                            subtitle: '51-60歲 - 年齡統計(每月總數)',
                                        },
                                    }}
                                />
                            </div>
                            <div className="col-12">
                                <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthCalendarBarChart6")}>下載圖表</button>
                            </div>
                            <div className="col-12 byMonthCalendarBarChart6">
                                <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                    <div className="">
                                        {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                    </div>
                                    <div className="">
                                    服務使用者意外 - 年齡統計 (每月總數)
                                    </div>
                                </div>
                                <Chart
                                    width={'100%'}
                                    height={'400px'}
                                    chartType="Bar"
                                    loader={<div>Loading Chart</div>}
                                    data={fiftyOneToSixtyMCChart}
                                    options={{
                                        // Material design options
                                        chart: {
                                            title: '日曆年度',
                                            subtitle: '51-60歲 - 年齡統計(每月總數)',
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
                            <div className="col-11">
                                <h6>{`${titleYear2}年 >60歲 - 年齡統計(每月總數) - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
                            </div>
                            <div className="col-12" style={{margin:'5px 0'}}>
                                <button className="btn btn-primary" onClick={() => copyTable('#table16')}>複製到表格</button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <table className="table" id="table16">
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
                                        {greaterThanSixtyMCResult.map((item) => {
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
                                <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthCalendarLineChart7")}>下載圖表</button>
                            </div>
                            <div className="col-12 byMonthCalendarLineChart7">
                                <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                    <div className="">
                                        {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                    </div>
                                    <div className="">
                                    服務使用者意外 - 年齡統計 (每月總數)
                                    </div>
                                </div>
                                <Chart
                                    width={'100%'}
                                    height={'400px'}
                                    chartType="Line"
                                    loader={<div>Loading Chart</div>}
                                    data={greaterThanSixtyMCChart}
                                    options={{
                                        chart: {
                                            title: '日曆年度',
                                            subtitle: '>60歲 - 年齡統計(每月總數)',
                                        },
                                    }}
                                />
                            </div>
                            <div className="col-12">
                                <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthCalendarBarChart7")}>下載圖表</button>
                            </div>
                            <div className="col-12 byMonthCalendarBarChart7">
                                <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                    <div className="">
                                        {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                    </div>
                                    <div className="">
                                    服務使用者意外 - 年齡統計 (每月總數)
                                    </div>
                                </div>
                                <Chart
                                    width={'100%'}
                                    height={'400px'}
                                    chartType="Bar"
                                    loader={<div>Loading Chart</div>}
                                    data={greaterThanSixtyMCChart}
                                    options={{
                                        // Material design options
                                        chart: {
                                            title: '日曆年度',
                                            subtitle: '>60歲 - 年齡統計(每月總數)',
                                        },
                                    }}

                                />
                            </div>
                        </div>
                    </>
                )
            case "BY_YEAR_FINANCIAL":
                let titleYear3 = "";
                let ageFinancialResult = sampleFiveParser(serviceUserAge, startDate, endDate);
                let ageFinancialChart = financialChartParser(ageFinancialResult);
                ageFinancialResult.forEach((item, i) => {
                    titleYear3 += item.financialYear;
                    if (i !== ageFinancialResult.length - 1) {
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
                        <div className="col-11">
                            <h6>{`${title} - 年齡統計(每月總數) - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
                        </div>
                        <div className="col-12" style={{margin:'5px 0'}}>
                                <button className="btn btn-primary" onClick={() => copyTable('#table17')}>複製到表格</button>
                            </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <table className="table" id="table17">
                                <thead>
                                    <tr>
                                        <th scope="col"></th>
                                        <th scope="col">&lt;15歲</th>
                                        <th scope="col">15-20歲</th>
                                        <th scope="col">21-30歲</th>
                                        <th scope="col">31-40歲</th>
                                        <th scope="col">41-50歲</th>
                                        <th scope="col">51-60歲</th>
                                        <th scope="col">&gt;60歲</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        ageFinancialResult.map((item) => {
                                            return (
                                                <tr>
                                                    <th scope="row">{item.financialYear}</th>
                                                    <th>{item.dataset.lessThanFifteen}</th>
                                                    <th>{item.dataset.fifteenToTwenty}</th>
                                                    <th>{item.dataset.twentyOneToThirty}</th>
                                                    <th>{item.dataset.thirtyOneToforty}</th>
                                                    <th>{item.dataset.fortyOneTofifty}</th>
                                                    <th>{item.dataset.fiftyOneToSixty}</th>
                                                    <th>{item.dataset.greaterThanSixty}</th>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table >
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
                                服務使用者意外 - 年齡統計 (每年總數)
                                </div>
                            </div>
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Line"
                                loader={<div>Loading Chart</div>}
                                data={ageFinancialChart}
                                options={{
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '年齡統計(每年總數)',
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
                                服務使用者意外 - 年齡統計 (每年總數)
                                </div>
                            </div>
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={ageFinancialChart}
                                options={{
                                    // Material design options
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '年齡統計(每年總數)',
                                    },
                                }}
                            />
                        </div>
                    </div>
                </>
            case "BY_YEAR_CALENDAR":
                let titleYear4 = "";
                let ageYearResult = sampleSixParser(serviceUserAge, startDate, endDate);
                let ageYearChart = yearChartParser(ageYearResult);
                ageYearResult.forEach((item, i) => {
                    titleYear4 += item.year;
                    if (i !== ageYearResult.length - 1) {
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
                        <div className="col-11">
                            <h6>{`${titleYear4} - 年齡統計(每年總數) - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
                        </div>
                        <div className="col-12" style={{margin:'5px 0'}}>
                                <button className="btn btn-primary" onClick={() => copyTable('#table18')}>複製到表格</button>
                            </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <table className="table" id="table18">
                                <thead>
                                    <tr>
                                        <th scope="col"></th>
                                        <th scope="col">&lt;15歲</th>
                                        <th scope="col">15-20歲</th>
                                        <th scope="col">21-30歲</th>
                                        <th scope="col">31-40歲</th>
                                        <th scope="col">41-50歲</th>
                                        <th scope="col">51-60歲</th>
                                        <th scope="col">&gt;60歲</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        ageYearResult.map((item) => {
                                            return (
                                                <tr>
                                                    <th scope="row">{item.year}</th>
                                                    <th>{item.dataset.lessThanFifteen}</th>
                                                    <th>{item.dataset.fifteenToTwenty}</th>
                                                    <th>{item.dataset.twentyOneToThirty}</th>
                                                    <th>{item.dataset.thirtyOneToforty}</th>
                                                    <th>{item.dataset.fortyOneTofifty}</th>
                                                    <th>{item.dataset.fiftyOneToSixty}</th>
                                                    <th>{item.dataset.greaterThanSixty}</th>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table >
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
                                <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                    {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                    <div className="">
                                    服務使用者意外 - 年齡統計 (每年總數)
                                    </div>
                                </div>
                            </div>
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Line"
                                loader={<div>Loading Chart</div>}
                                data={ageYearChart}
                                options={{
                                    chart: {
                                        title: '日曆年度',
                                        subtitle: '年齡統計(每年總數)',
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
                                <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                    {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                    <div className="">
                                    服務使用者意外 - 年齡統計 (每年總數)
                                    </div>
                                </div>
                            </div>
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={ageYearChart}
                                options={{
                                    // Material design options
                                    chart: {
                                        title: '日曆年度',
                                        subtitle: '年齡統計(每年總數)',
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
                                            服務使用者意外 - 年齡統計
                                        </div>
                                    </div>
                                    <Chart
                                        chartType={"Bar"}
                                        width={'100%'}
                                        height={'400px'}
                                        loader={<div className="d-flex justify-content-center align-items-center"> <div className="spinner-border text-primary" /></div>}
                                        data={[
                                            ["年齡", "年齡"],
                                            ["<15歲", ageDataset.lessThanFifteen],
                                            ["15-20歲", ageDataset.fifteenToTwenty],
                                            ["21-30歲", ageDataset.twentyOneToThirty],
                                            ["31-40歲", ageDataset.thirtyOneToforty],
                                            ["41-50歲", ageDataset.fortyOneTofifty],
                                            ["51-60歲", ageDataset.fiftyOneToSixty],
                                            [">60歲", ageDataset.greaterThanSixty],
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
                                            服務使用者意外 - 年齡統計
                                        </div>
                                    </div>
                                    <Chart
                                        chartType={"PieChart"}
                                        width={'100%'}
                                        height={'400px'}
                                        loader={<div className="d-flex justify-content-center align-items-center"> <div className="spinner-border text-primary" /></div>}
                                        data={
                                            [
                                                ["年齡", '年齡'],
                                                ["<15歲", ageDataset.lessThanFifteen],
                                                ["15-20歲", ageDataset.fifteenToTwenty],
                                                ["21-30歲", ageDataset.twentyOneToThirty],
                                                ["31-40歲", ageDataset.thirtyOneToforty],
                                                ["41-50歲", ageDataset.fortyOneTofifty],
                                                ["51-60歲", ageDataset.fiftyOneToSixty],
                                                [">60歲", ageDataset.greaterThanSixty],
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
                        <div className="col-12" style={{overflow:'auto'}}>
                            <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthBarChart")}>下載圖表</button>
                            <div className="byMonthBarChart">
                                <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                    <div className="">
                                        {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                    </div>
                                    <div className="">
                                        服務使用者意外 - 年齡統計 (每月總數)
                                    </div>
                                </div>
                                <Chart
                                    width={newWidth}
                                    height={400}
                                    chartType="Bar"
                                    loader={<div>Loading Chart</div>}
                                    data={[['月份', '<15歲', '15-20歲', '21-30歲', '31-40歲', '41-50歲', '51-60歲', '>60歲'],
                                    ...sampleTwoParser(serviceUserAge, startDate, endDate).map((item) => {
                                        return [item.month, item.dataset.lessThanFifteen, item.dataset.fifteenToTwenty, item.dataset.twentyOneToThirty, item.dataset.thirtyOneToforty, item.dataset.fortyOneTofifty, item.dataset.fiftyOneToSixty, item.dataset.greaterThanSixty]
                                    })]
                                }

                                />
                            </div>
                        </div>
                    </div>
                    
                )
            default:
                return null;
        }
    }

    return (
        <div>
            <div className="row mb-3">
                <div className="col">
                    <h6 style={{ fontWeight: 600 }}>統計資料 &gt; 服務使用者意外統計 &gt; 年齡</h6>
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
                    <select multiple className="form-control" onChange={changeGroupHandler} >
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
                        {
                            serivceLocation.map((item) => <option value={item.location}>{item.locationTC}</option>)
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
                {chartSwitch()}
            </div>
        </div >
    )
}

export default ServiceUserAccidentAge
