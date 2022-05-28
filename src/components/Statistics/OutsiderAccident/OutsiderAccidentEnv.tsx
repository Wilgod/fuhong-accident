import * as React from 'react'
import { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as moment from 'moment';
import Chart from "react-google-charts";
import useServiceLocation from '../../../hooks/useServiceLocation';
import { useOutsiderStats } from '../../../hooks/useOutsiderStats';
import { useOutsidersAccidentReportStats } from '../../../hooks/useOutsidersAccidentReportStats';
import { getDateFinancialYear } from '../../../utils/DateUtils';
import arraySort from 'array-sort';
import html2canvas from 'html2canvas';
import downloadjs from 'downloadjs';
import "./OutsiderAccident.css";
interface IDataset {
    "envSlipperyGround": number;
    "envUnevenGround": number;
    "envObstacleItems": number;
    "envInsufficientLight": number;
    "envNotEnoughSpace": number;
    "envAcousticStimulation": number;
    "envCollidedByOthers": number;
    "envHurtByOthers": number;
    "envImproperEquip": number;
    "envOther": number;

}

const initialDataset: IDataset = {
    envAcousticStimulation: 0,
    envCollidedByOthers: 0,
    envHurtByOthers: 0,
    envImproperEquip: 0,
    envInsufficientLight: 0,
    envNotEnoughSpace: 0,
    envObstacleItems: 0,
    envOther: 0,
    envSlipperyGround: 0,
    envUnevenGround: 0
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
    dataset: IDataset;
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


const envFactorFilter = (item: any, dataset: IDataset): IDataset => {
    let result = dataset;
    if (item.EnvSlipperyGround === true) {
        result.envSlipperyGround += 1;
    }

    if (item.EnvUnevenGround === true) {
        result.envUnevenGround += 1;
    }

    if (item.EnvObstacleItems === true) {
        result.envObstacleItems += 1;
    }

    if (item.EnvInsufficientLight === true) {
        result.envInsufficientLight += 1;
    }

    if (item.EnvNotEnoughSpace === true) {
        result.envNotEnoughSpace += 1;
    }

    if (item.EnvAcousticStimulation === true) {
        result.envAcousticStimulation += 1;
    }

    if (item.EnvCollision === true) {
        result.envCollidedByOthers += 1;
    }

    if (item.EnvHurtByOthers === true) {
        result.envHurtByOthers += 1;
    }

    if (item.EnvAssistiveEquipment === true) {
        result.envImproperEquip += 1;
    }

    if (item.EnvOther === true) {
        result.envOther += 1;
    }

    return result;
}

const financialChartParser = (result) =>{
    let dataResult = ['Year'];
    let envSlipperyGround =['地面濕滑'];
    let envUnevenGround =['地面不平'];
    let envObstacleItems =['障礙物品'];
    let envInsufficientLight =['光線不足'];
    let envNotEnoughSpace =['空間不足'];
    let envAcousticStimulation =['聲響刺激'];
    let envCollidedByOthers =['被別人碰撞'];
    let envHurtByOthers =['被別人傷害'];
    let envImproperEquip =['輔助器材使用不當 (如輪椅／便椅未上鎖)'];
    let envOther =['其他'];
    result.map((item) => {
        dataResult.push(item.financialYear);
        envSlipperyGround.push(item.dataset['envSlipperyGround']);
        envUnevenGround.push(item.dataset['envUnevenGround']);
        envObstacleItems.push(item.dataset['envObstacleItems']);
        envInsufficientLight.push(item.dataset['envInsufficientLight']);
        envNotEnoughSpace.push(item.dataset['envNotEnoughSpace']);
        envAcousticStimulation.push(item.dataset['envAcousticStimulation']);
        envCollidedByOthers.push(item.dataset['envCollidedByOthers']);
        envHurtByOthers.push(item.dataset['envHurtByOthers']);
        envImproperEquip.push(item.dataset['envImproperEquip']);
        envOther.push(item.dataset['envOther']);
    });
    let data=[
        dataResult,
        envSlipperyGround,
        envUnevenGround,
        envObstacleItems,
        envInsufficientLight,
        envNotEnoughSpace,
        envAcousticStimulation,
        envCollidedByOthers,
        envHurtByOthers,
        envImproperEquip,
        envOther
    ];
    return data;
}

const yearChartParser = (result) =>{
    let dataResult = ['Year'];
    let envSlipperyGround =['地面濕滑'];
    let envUnevenGround =['地面不平'];
    let envObstacleItems =['障礙物品'];
    let envInsufficientLight =['光線不足'];
    let envNotEnoughSpace =['空間不足'];
    let envAcousticStimulation =['聲響刺激'];
    let envCollidedByOthers =['被別人碰撞'];
    let envHurtByOthers =['被別人傷害'];
    let envImproperEquip =['輔助器材使用不當 (如輪椅／便椅未上鎖)'];
    let envOther =['其他'];
    result.map((item) => {
        dataResult.push(item.year.toString());
        envSlipperyGround.push(item.dataset['envSlipperyGround']);
        envUnevenGround.push(item.dataset['envUnevenGround']);
        envObstacleItems.push(item.dataset['envObstacleItems']);
        envInsufficientLight.push(item.dataset['envInsufficientLight']);
        envNotEnoughSpace.push(item.dataset['envNotEnoughSpace']);
        envAcousticStimulation.push(item.dataset['envAcousticStimulation']);
        envCollidedByOthers.push(item.dataset['envCollidedByOthers']);
        envHurtByOthers.push(item.dataset['envHurtByOthers']);
        envImproperEquip.push(item.dataset['envImproperUseOfAssistiveEquipment']);
        envOther.push(item.dataset['envOther']);
    });
    let data=[
        dataResult,
        envSlipperyGround,
        envUnevenGround,
        envObstacleItems,
        envInsufficientLight,
        envNotEnoughSpace,
        envAcousticStimulation,
        envCollidedByOthers,
        envHurtByOthers,
        envImproperEquip,
        envOther
    ];
    return data;
}

const sampleOneParser = (envFactor: any[]): IDataset => {
    let dataset: IDataset = { ...initialDataset };
    envFactor.forEach((item) => {
        dataset = envFactorFilter(item, dataset);
    })
    return dataset
}

const sampleTwoParser = (data: any[], startDate: Date, endDate: Date): ISampleTwoDataset[] => {
    let m = new Map<string, IDataset>();
    let result: ISampleTwoDataset[] = [];

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

    data.forEach((item) => {
        if ((item.AccidentTime || item.IncidentTime || item.Created) && item.CaseNumber) {
            const formType: string = item.CaseNumber.split("-")[0];
            const date = new Date(item.AccidentTime || item.IncidentTime || item.Created);
            const formattedDate = moment(date).format("MM/yyyy");
            if (m.has(formattedDate)) {
                let oldDataset = m.get(formattedDate);
                let newDataset = envFactorFilter(item, oldDataset);
                m.set(formattedDate, newDataset);
            } else {
                let newDataset = envFactorFilter(item, initialDataset);
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
        const d = new Date(item.AccidentTime || item.IncidentTime || item.Created);
        if (d) {

            const currentFinicailYear = getDateFinancialYear(d);
            if (m.has(currentFinicailYear)) {
                let oldDataset = m.get(currentFinicailYear);
                let newDataset = envFactorFilter(item, oldDataset);
                m.set(currentFinicailYear, newDataset);
            } else {
                let newDataset = envFactorFilter(item, { ...initialDataset });
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
        if ((item.AccidentTime || item.IncidentTime || item.Created) && item.CaseNumber) {
            const year = new Date(item.AccidentTime || item.IncidentTime || item.Created).getFullYear().toString();
            const month = new Date(item.AccidentTime || item.IncidentTime || item.Created).getMonth() + 1;

            if (m.has(year)) {
                let oldDataset = m.get(year);
                let newDataset = envFactorFilter(item, oldDataset);
                m.set(year, newDataset);
            } else {
                let newDataset = envFactorFilter(item, { ...initialDataset });
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

function OutsiderAccidentEnv(siteCollectionUrl) {
    const [groupBy, setGroupBy] = useState("NON");
    const [envFactorDataset, setEnvFactorDataset] = useState<IDataset>(initialDataset);
    const [serivceLocation] = useServiceLocation(siteCollectionUrl.siteCollectionUrl);
    const [data, startDate, endDate, serviceUnits, setStartDate, setEndDate, setServiceUnits] = useOutsidersAccidentReportStats();

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
                            <div className="col-12">
                                <h6>{`${title} - 意外成因 - 環境因素統計 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
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
                                <h6>{`${title} - 意外成因-環境因素 統計 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
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
                                            <th scope="col">地面濕滑</th>
                                            <th scope="col">地面不平</th>
                                            <th scope="col">障礙物品</th>
                                            <th scope="col">光線不足</th>
                                            <th scope="col">空間不足</th>
                                            <th scope="col">聲響刺激</th>
                                            <th scope="col">被別人碰撞</th>
                                            <th scope="col">被別人傷害</th>
                                            <th scope="col">輔助器材使用不當 (如輪椅／便椅未上鎖)</th>
                                            <th scope="col">其他</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sampleTwoParser(data, startDate, endDate).map((item) => {
                                            return (
                                                <tr>
                                                    <th scope="row">{item.month}</th>
                                                    <td>{item.dataset.envSlipperyGround}</td>
                                                    <td>{item.dataset.envUnevenGround}</td>
                                                    <td>{item.dataset.envNotEnoughSpace}</td>
                                                    <td>{item.dataset.envInsufficientLight}</td>
                                                    <td>{item.dataset.envNotEnoughSpace}</td>
                                                    <td>{item.dataset.envAcousticStimulation}</td>
                                                    <td>{item.dataset.envCollidedByOthers}</td>
                                                    <td>{item.dataset.envHurtByOthers}</td>
                                                    <td>{item.dataset.envImproperEquip}</td>
                                                    <td>{item.dataset.envOther}</td>
                                                </tr>
                                            )
                                        })}
                                        {
                                            <tr style={{ color: "red" }}>
                                                <th scope="row">總數</th>
                                                <td>{envFactorDataset.envSlipperyGround}</td>
                                                <td>{envFactorDataset.envUnevenGround}</td>
                                                <td>{envFactorDataset.envNotEnoughSpace}</td>
                                                <td>{envFactorDataset.envInsufficientLight}</td>
                                                <td>{envFactorDataset.envNotEnoughSpace}</td>
                                                <td>{envFactorDataset.envAcousticStimulation}</td>
                                                <td>{envFactorDataset.envCollidedByOthers}</td>
                                                <td>{envFactorDataset.envHurtByOthers}</td>
                                                <td>{envFactorDataset.envImproperEquip}</td>
                                                <td>{envFactorDataset.envOther}</td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>)
            case "BY_MONTH_FINANCIAL":
                let a = data.filter((item) => { debugger;return item.EnvSlipperyGround});
                let envSlipperyGroundResult = sampleThreeParser(data.filter((item) => { return item.EnvSlipperyGround}), startDate, endDate);
                let envSlipperyGroundMFChart = financialYearChartParser(envSlipperyGroundResult);

                let envUnevenGroundResult = sampleThreeParser(data.filter((item) => {return item.EnvUnevenGround}), startDate, endDate);
                let envUnevenGroundMFChart = financialYearChartParser(envUnevenGroundResult);

                let envObstacleItemsResult = sampleThreeParser(data.filter((item) => {return item.EnvObstacleItems}), startDate, endDate);
                let envObstacleItemsMFChart = financialYearChartParser(envObstacleItemsResult);

                let envInsufficientLightResult = sampleThreeParser(data.filter((item) => {return item.EnvInsufficientLight}), startDate, endDate);
                let envInsufficientLightMFChart = financialYearChartParser(envInsufficientLightResult);

                let envNotEnoughSpaceResult = sampleThreeParser(data.filter((item) => {return item.EnvNotEnoughSpace}), startDate, endDate);
                let envNotEnoughSpaceMFChart = financialYearChartParser(envNotEnoughSpaceResult);

                let envAcousticStimulationResult = sampleThreeParser(data.filter((item) => {return item.EnvAcousticStimulation}), startDate, endDate);
                let envAcousticStimulationMFChart = financialYearChartParser(envAcousticStimulationResult);

                let envCollidedByOthersResult = sampleThreeParser(data.filter((item) => {return item.EnvCollidedByOthers}), startDate, endDate);
                let envCollidedByOthersMFChart = financialYearChartParser(envCollidedByOthersResult);

                let envHurtByOthersResult = sampleThreeParser(data.filter((item) => {return item.EnvHurtByOthers}), startDate, endDate);
                let envHurtByOthersMFChart = financialYearChartParser(envHurtByOthersResult);

                let envImproperUseOfAssistiveEquipmentResult = sampleThreeParser(data.filter((item) => {return item.EnvImproperEquip}), startDate, endDate);
                let envImproperUseOfAssistiveEquipmentMFChart = financialYearChartParser(envImproperUseOfAssistiveEquipmentResult);

                let envOtherResult = sampleThreeParser(data.filter((item) => {return item.EnvOther}), startDate, endDate);
                let envOtherMFChart = financialYearChartParser(envOtherResult);
                debugger
                return <>
                    <div className="row">
                        <div className="col-1">
                            <h6 style={{ fontWeight: 600 }}>
                                標題:
                            </h6>
                        </div>
                        <div className="col-12">
                            <h6>{`${title} - 意外成因 - 環境因素 - 地面濕滑 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
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
                                    {envSlipperyGroundResult.map((item) => {
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
                            <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                <div className="">
                                    {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                </div>
                                <div className="">
                                    新發生意外或事故 意外成因 - 環境因素 - 地面濕滑 總數(每月總數)
                                </div>
                            </div>
                        </div>
                        <div className="col-12 byMonthFinancialLineChart1">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Line"
                                loader={<div>Loading Chart</div>}
                                data={envSlipperyGroundMFChart}
                                options={{
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '意外成因 - 環境因素 - 地面濕滑(每月總數)',
                                    },
                                }}
                            />
                        </div>
                        <div className="col-12">
                            <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthFinancialBarChart1")}>下載圖表</button>
                        </div>
                        <div className="col-12 byMonthFinancialBarChart1">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={envSlipperyGroundMFChart}
                                options={{
                                    // Material design options
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '意外成因 - 環境因素 - 地面濕滑(每月總數)',
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
                            <h6>{`${title} - 意外成因 - 環境因素 - 地面不平 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
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
                                    {envUnevenGroundResult.map((item) => {
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
                            <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                <div className="">
                                    {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                </div>
                                <div className="">
                                    新發生意外或事故 意外成因 - 環境因素 - 地面濕滑 總數(每月總數)
                                </div>
                            </div>
                        </div>
                        <div className="col-12 byMonthFinancialLineChart2">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Line"
                                loader={<div>Loading Chart</div>}
                                data={envUnevenGroundMFChart}
                                options={{
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '意外成因 - 環境因素 - 地面不平(每月總數)',
                                    },
                                }}
                            />
                        </div>
                        <div className="col-12">
                            <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthFinancialBarChart2")}>下載圖表</button>
                        </div>
                        <div className="col-12 byMonthFinancialBarChart2">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={envUnevenGroundMFChart}
                                options={{
                                    // Material design options
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '意外成因 - 環境因素 - 地面不平(每月總數)',
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
                            <h6>{`${title} - 意外成因 - 環境因素 - 障礙物品 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
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
                                    {envObstacleItemsResult.map((item) => {
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
                            <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthFinancialLineChart3")}>下載圖表</button>
                            <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                <div className="">
                                    {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                </div>
                                <div className="">
                                    新發生意外或事故 意外成因 - 環境因素 - 障礙物品 總數(每月總數)
                                </div>
                            </div>
                        </div>
                        <div className="col-12 byMonthFinancialLineChart3">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Line"
                                loader={<div>Loading Chart</div>}
                                data={envObstacleItemsMFChart}
                                options={{
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '意外成因 - 環境因素 - 障礙物品(每月總數)',
                                    },
                                }}
                            />
                        </div>
                        <div className="col-12">
                            <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthFinancialBarChart3")}>下載圖表</button>
                        </div>
                        <div className="col-12 byMonthFinancialBarChart3">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={envObstacleItemsMFChart}
                                options={{
                                    // Material design options
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '意外成因 - 環境因素 - 障礙物品(每月總數)',
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
                            <h6>{`${title} - 意外成因 - 環境因素 - 光線不足 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
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
                                    {envInsufficientLightResult.map((item) => {
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
                            <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthFinancialLineChart4")}>下載圖表</button>
                            <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                <div className="">
                                    {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                </div>
                                <div className="">
                                    新發生意外或事故 意外成因 - 環境因素 - 光線不足 總數(每月總數)
                                </div>
                            </div>
                        </div>
                        <div className="col-12 byMonthFinancialLineChart4">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Line"
                                loader={<div>Loading Chart</div>}
                                data={envInsufficientLightMFChart}
                                options={{
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '意外成因 - 環境因素 - 光線不足(每月總數)',
                                    },
                                }}
                            />
                        </div>
                        <div className="col-12">
                            <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthFinancialBarChart4")}>下載圖表</button>
                        </div>
                        <div className="col-12 byMonthFinancialBarChart4">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={envInsufficientLightMFChart}
                                options={{
                                    // Material design options
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '意外成因 - 環境因素 - 光線不足(每月總數)',
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
                            <h6>{`${title} - 意外成因 - 環境因素 - 空間不足 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
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
                                    {envNotEnoughSpaceResult.map((item) => {
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
                            <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthFinancialLineChart5")}>下載圖表</button>
                            <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                <div className="">
                                    {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                </div>
                                <div className="">
                                    新發生意外或事故 意外成因 - 環境因素 - 空間不足 總數(每月總數)
                                </div>
                            </div>
                        </div>
                        <div className="col-12 byMonthFinancialLineChart5">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Line"
                                loader={<div>Loading Chart</div>}
                                data={envNotEnoughSpaceMFChart}
                                options={{
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '意外成因 - 環境因素 - 空間不足(每月總數)',
                                    },
                                }}
                            />
                        </div>
                        <div className="col-12">
                            <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthFinancialBarChart5")}>下載圖表</button>
                        </div>
                        <div className="col-12 byMonthFinancialBarChart5">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={envNotEnoughSpaceMFChart}
                                options={{
                                    // Material design options
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '意外成因 - 環境因素 - 空間不足(每月總數)',
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
                            <h6>{`${title} - 意外成因 - 環境因素 - 聲響刺激 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
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
                                    {envAcousticStimulationResult.map((item) => {
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
                            <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthFinancialLineChart6")}>下載圖表</button>
                            <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                <div className="">
                                    {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                </div>
                                <div className="">
                                    新發生意外或事故 意外成因 - 環境因素 - 聲響刺激 總數(每月總數)
                                </div>
                            </div>
                        </div>
                        <div className="col-12 byMonthFinancialLineChart6">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Line"
                                loader={<div>Loading Chart</div>}
                                data={envAcousticStimulationMFChart}
                                options={{
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '意外成因 - 環境因素 - 聲響刺激(每月總數)',
                                    },
                                }}
                            />
                        </div>
                        <div className="col-12">
                            <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthFinancialBarChart6")}>下載圖表</button>
                        </div>
                        <div className="col-12 byMonthFinancialBarChart6">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={envAcousticStimulationMFChart}
                                options={{
                                    // Material design options
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '意外成因 - 環境因素 - 聲響刺激(每月總數)',
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
                            <h6>{`${title} - 意外成因 - 環境因素 - 被別人碰撞 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
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
                                    {envCollidedByOthersResult.map((item) => {
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
                            <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthFinancialLineChart7")}>下載圖表</button>
                            <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                <div className="">
                                    {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                </div>
                                <div className="">
                                    新發生意外或事故 意外成因 - 環境因素 - 被別人碰撞 總數(每月總數)
                                </div>
                            </div>
                        </div>
                        <div className="col-12 byMonthFinancialLineChart7">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Line"
                                loader={<div>Loading Chart</div>}
                                data={envCollidedByOthersMFChart}
                                options={{
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '意外成因 - 環境因素 - 被別人碰撞(每月總數)',
                                    },
                                }}
                            />
                        </div>
                        <div className="col-12">
                            <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthFinancialBarChart7")}>下載圖表</button>
                        </div>
                        <div className="col-12 byMonthFinancialBarChart7">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={envCollidedByOthersMFChart}
                                options={{
                                    // Material design options
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '意外成因 - 環境因素 - 被別人碰撞(每月總數)',
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
                            <h6>{`${title} - 意外成因 - 環境因素 - 被別人傷害 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
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
                                    {envHurtByOthersResult.map((item) => {
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
                            <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthFinancialLineChart8")}>下載圖表</button>
                            <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                <div className="">
                                    {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                </div>
                                <div className="">
                                    新發生意外或事故 意外成因 - 環境因素 - 被別人傷害 總數(每月總數)
                                </div>
                            </div>
                        </div>
                        <div className="col-12 byMonthFinancialLineChart8">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Line"
                                loader={<div>Loading Chart</div>}
                                data={envHurtByOthersMFChart}
                                options={{
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '意外成因 - 環境因素 - 被別人傷害(每月總數)',
                                    },
                                }}
                            />
                        </div>
                        <div className="col-12">
                            <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthFinancialBarChart8")}>下載圖表</button>
                        </div>
                        <div className="col-12 byMonthFinancialBarChart8">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={envHurtByOthersMFChart}
                                options={{
                                    // Material design options
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '意外成因 - 環境因素 - 被別人傷害(每月總數)',
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
                            <h6>{`${title} - 意外成因 - 環境因素 - 被別人傷害 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
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
                                    {envImproperUseOfAssistiveEquipmentResult.map((item) => {
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
                            <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthFinancialLineChart9")}>下載圖表</button>
                            <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                <div className="">
                                    {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                </div>
                                <div className="">
                                    新發生意外或事故 意外成因 - 環境因素 - 輔助器材使用不當 (如輪椅／便椅未上鎖) 總數(每月總數)
                                </div>
                            </div>
                        </div>
                        <div className="col-12 byMonthFinancialLineChart9">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Line"
                                loader={<div>Loading Chart</div>}
                                data={envImproperUseOfAssistiveEquipmentMFChart}
                                options={{
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '意外成因 - 環境因素 - 輔助器材使用不當 (如輪椅／便椅未上鎖)(每月總數)',
                                    },
                                }}
                            />
                        </div>
                        <div className="col-12">
                            <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthFinancialBarChart9")}>下載圖表</button>
                        </div>
                        <div className="col-12 byMonthFinancialBarChart9">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={envImproperUseOfAssistiveEquipmentMFChart}
                                options={{
                                    // Material design options
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '意外成因 - 環境因素 - 輔助器材使用不當 (如輪椅／便椅未上鎖)(每月總數)',
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
                            <h6>{`${title} - 意外成因 - 環境因素 - 被別人傷害 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
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
                                    {envOtherResult.map((item) => {
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
                            <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthFinancialLineChart10")}>下載圖表</button>
                            <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                <div className="">
                                    {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                </div>
                                <div className="">
                                    新發生意外或事故 意外成因 - 環境因素 - 其他 總數(每月總數)
                                </div>
                            </div>
                        </div>
                        <div className="col-12 byMonthFinancialLineChart10">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Line"
                                loader={<div>Loading Chart</div>}
                                data={envOtherMFChart}
                                options={{
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '意外成因 - 環境因素 - 其他(每月總數)',
                                    },
                                }}
                            />
                        </div>
                        <div className="col-12">
                            <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthFinancialBarChart10")}>下載圖表</button>
                        </div>
                        <div className="col-12 byMonthFinancialBarChart10">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={envOtherMFChart}
                                options={{
                                    // Material design options
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '意外成因 - 環境因素 - 其他(每月總數)',
                                    },
                                }}
                            />
                        </div>
                    </div>
                </>
            case "BY_MONTH_CALENDAR":
                let titleYear2 = "";
                let envSlipperyGroundMCResult = sampleFourParser(data.filter((item) => {return item.ObserveEnvironmentFactor != null && item.ObserveEnvironmentFactor.indexOf('ENV_SLIPPERY_GROUND') >= 0}), startDate, endDate);
                let envSlipperyGroundMCChart = normalChartParser(envSlipperyGroundMCResult);

                let envUnevenGroundMCResult = sampleFourParser(data.filter((item) => {return item.ObserveEnvironmentFactor != null && item.ObserveEnvironmentFactor.indexOf('ENV_UNEVEN_GROUND') >= 0}), startDate, endDate);
                let envUnevenGroundMCChart = normalChartParser(envUnevenGroundMCResult);

                let envObstacleItemsMCResult = sampleFourParser(data.filter((item) => {return item.ObserveEnvironmentFactor != null && item.ObserveEnvironmentFactor.indexOf('ENV_OBSTACLE_ITEMS') >= 0}), startDate, endDate);
                let envObstacleItemsMCChart = normalChartParser(envObstacleItemsMCResult);

                let envInsufficientLightMCResult = sampleFourParser(data.filter((item) => {return item.ObserveEnvironmentFactor != null && item.ObserveEnvironmentFactor.indexOf('ENV_INSUFFICIENT_LIGHT') >= 0}), startDate, endDate);
                let envInsufficientLightMCChart = normalChartParser(envInsufficientLightMCResult);

                let envNotEnoughSpaceMCResult = sampleFourParser(data.filter((item) => {return item.ObserveEnvironmentFactor != null && item.ObserveEnvironmentFactor.indexOf('ENV_NOT_ENOUGH_SPACE') >= 0}), startDate, endDate);
                let envNotEnoughSpaceMCChart = normalChartParser(envNotEnoughSpaceMCResult);

                let envAcousticStimulationMCResult = sampleFourParser(data.filter((item) => {return item.ObserveEnvironmentFactor != null && item.ObserveEnvironmentFactor.indexOf('ENV_ACOUSTIC_STIMULATION') >= 0}), startDate, endDate);
                let envAcousticStimulationMCChart = normalChartParser(envAcousticStimulationMCResult);

                let envCollidedByOthersMCResult = sampleFourParser(data.filter((item) => {return item.ObserveEnvironmentFactor != null && item.ObserveEnvironmentFactor.indexOf('ENV_COLLIDED_BY_OTHERS') >= 0}), startDate, endDate);
                let envCollidedByOthersMCChart = normalChartParser(envCollidedByOthersMCResult);

                let envHurtByOthersMCResult = sampleFourParser(data.filter((item) => {return item.ObserveEnvironmentFactor != null && item.ObserveEnvironmentFactor.indexOf('ENV_HURT_BY_OTHERS') >= 0}), startDate, endDate);
                let envHurtByOthersMCChart = normalChartParser(envHurtByOthersMCResult);

                let envImproperUseOfAssistiveEquipmentMCResult = sampleFourParser(data.filter((item) => {return item.ObserveEnvironmentFactor != null && item.ObserveEnvironmentFactor.indexOf('ENV_IMPROPER_USE_OF_ASSISTIVE_EQUIPMENT') >= 0}), startDate, endDate);
                let envImproperUseOfAssistiveEquipmentMCChart = normalChartParser(envImproperUseOfAssistiveEquipmentMCResult);

                let envOtherMCResult = sampleFourParser(data.filter((item) => {return item.ObserveEnvironmentFactor != null && item.ObserveEnvironmentFactor.indexOf('ENV_OTHER') >= 0}), startDate, endDate);
                let envOtherMCChart = normalChartParser(envOtherMCResult);
                envSlipperyGroundMCResult.forEach((item, i) => {
                    titleYear2 += item.year
                    if (i !== envSlipperyGroundMCResult.length - 1) {
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
                            <h6>{`${titleYear2} - 意外成因 - 環境因素 - 地面濕滑 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
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
                                    {envSlipperyGroundMCResult.map((item) => {
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
                            <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                <div className="">
                                    {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                </div>
                                <div className="">
                                    新發生意外或事故總數 (每月總數)
                                </div>
                            </div>
                        </div>
                        <div className="col-12 byMonthCalendarLineChart1">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Line"
                                loader={<div>Loading Chart</div>}
                                data={envSlipperyGroundMCChart}
                                options={{
                                    chart: {
                                        title: '日曆年度',
                                        subtitle: '意外成因 - 環境因素 - 地面濕滑(每月總數)',
                                    },
                                }}
                            />
                        </div>
                        <div className="col-12">
                            <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthCalendarBarChart1")}>下載圖表</button>
                        </div>
                        <div className="col-12 byMonthCalendarBarChart1">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={envSlipperyGroundMCChart}
                                options={{
                                    // Material design options
                                    chart: {
                                        title: '日曆年度',
                                        subtitle: '意外成因 - 環境因素 - 地面濕滑(每月總數)',
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
                            <h6>{`${titleYear2} - 意外成因 - 環境因素 - 地面不平 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
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
                                    {envUnevenGroundMCResult.map((item) => {
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
                            <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                <div className="">
                                    {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                </div>
                                <div className="">
                                    新發生意外或事故總數 (每月總數)
                                </div>
                            </div>
                        </div>
                        <div className="col-12 byMonthCalendarLineChart2">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Line"
                                loader={<div>Loading Chart</div>}
                                data={envUnevenGroundMCChart}
                                options={{
                                    chart: {
                                        title: '日曆年度',
                                        subtitle: '意外成因 - 環境因素 - 地面不平(每月總數)',
                                    },
                                }}
                            />
                        </div>
                        <div className="col-12">
                            <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthCalendarBarChart2")}>下載圖表</button>
                        </div>
                        <div className="col-12 byMonthCalendarBarChart2">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={envUnevenGroundMCChart}
                                options={{
                                    // Material design options
                                    chart: {
                                        title: '日曆年度',
                                        subtitle: '意外成因 - 環境因素 - 地面不平(每月總數)',
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
                            <h6>{`${titleYear2} - 意外成因 - 環境因素 - 障礙物品 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
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
                                    {envObstacleItemsMCResult.map((item) => {
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
                            <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                <div className="">
                                    {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                </div>
                                <div className="">
                                    新發生意外或事故總數 (每月總數)
                                </div>
                            </div>
                        </div>
                        <div className="col-12 byMonthCalendarLineChart3">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Line"
                                loader={<div>Loading Chart</div>}
                                data={envObstacleItemsMCChart}
                                options={{
                                    chart: {
                                        title: '日曆年度',
                                        subtitle: '意外成因 - 環境因素 - 障礙物品(每月總數)',
                                    },
                                }}
                            />
                        </div>
                        <div className="col-12">
                            <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthCalendarBarChart3")}>下載圖表</button>
                        </div>
                        <div className="col-12 byMonthCalendarBarChart3">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={envObstacleItemsMCChart}
                                options={{
                                    // Material design options
                                    chart: {
                                        title: '日曆年度',
                                        subtitle: '意外成因 - 環境因素 - 障礙物品(每月總數)',
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
                            <h6>{`${titleYear2} - 意外成因 - 環境因素 - 光線不足 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
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
                                    {envInsufficientLightMCResult.map((item) => {
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
                            <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthCalendarLineChart4")}>下載圖表</button>
                                <div className="">
                                    {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                </div>
                                <div className="">
                                    新發生意外或事故總數 (每月總數)
                                </div>
                            </div>
                        </div>
                        <div className="col-12 byMonthCalendarLineChart4">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Line"
                                loader={<div>Loading Chart</div>}
                                data={envInsufficientLightMCChart}
                                options={{
                                    chart: {
                                        title: '日曆年度',
                                        subtitle: '意外成因 - 環境因素 - 光線不足(每月總數)',
                                    },
                                }}
                            />
                        </div>
                        <div className="col-12">
                            <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthCalendarBarChart4")}>下載圖表</button>
                        </div>
                        <div className="col-12 byMonthCalendarBarChart4">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={envInsufficientLightMCChart}
                                options={{
                                    // Material design options
                                    chart: {
                                        title: '日曆年度',
                                        subtitle: '意外成因 - 環境因素 - 光線不足(每月總數)',
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
                            <h6>{`${titleYear2} - 意外成因 - 環境因素 - 空間不足 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
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
                                    {envNotEnoughSpaceMCResult.map((item) => {
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
                            <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                <div className="">
                                    {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                </div>
                                <div className="">
                                    新發生意外或事故總數 (每月總數)
                                </div>
                            </div>
                        </div>
                        <div className="col-12 byMonthCalendarLineChart5">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Line"
                                loader={<div>Loading Chart</div>}
                                data={envNotEnoughSpaceMCChart}
                                options={{
                                    chart: {
                                        title: '日曆年度',
                                        subtitle: '意外成因 - 環境因素 - 空間不足(每月總數)',
                                    },
                                }}
                            />
                        </div>
                        <div className="col-12">
                            <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthCalendarBarChart5")}>下載圖表</button>
                        </div>
                        <div className="col-12 byMonthCalendarBarChart5">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={envNotEnoughSpaceMCChart}
                                options={{
                                    // Material design options
                                    chart: {
                                        title: '日曆年度',
                                        subtitle: '意外成因 - 環境因素 - 空間不足(每月總數)',
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
                            <h6>{`${titleYear2} - 意外成因 - 環境因素 - 聲響刺激 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
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
                                    {envAcousticStimulationMCResult.map((item) => {
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
                            <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                <div className="">
                                    {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                </div>
                                <div className="">
                                    新發生意外或事故總數 (每月總數)
                                </div>
                            </div>
                        </div>
                        <div className="col-12 byMonthCalendarLineChart6">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Line"
                                loader={<div>Loading Chart</div>}
                                data={envAcousticStimulationMCChart}
                                options={{
                                    chart: {
                                        title: '日曆年度',
                                        subtitle: '意外成因 - 環境因素 - 聲響刺激(每月總數)',
                                    },
                                }}
                            />
                        </div>
                        <div className="col-12">
                            <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthCalendarBarChart6")}>下載圖表</button>
                        </div>
                        <div className="col-12 byMonthCalendarBarChart6">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={envAcousticStimulationMCChart}
                                options={{
                                    // Material design options
                                    chart: {
                                        title: '日曆年度',
                                        subtitle: '意外成因 - 環境因素 - 聲響刺激(每月總數)',
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
                            <h6>{`${titleYear2} - 意外成因 - 環境因素 - 被別人碰撞 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
                        </div>
                        <div className="col-12" style={{margin:'5px 0'}}>
                                <button className="btn btn-primary" onClick={() => copyTable('#table19')}>複製到表格</button>
                            </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <table className="table" id="table19">
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
                                    {envCollidedByOthersMCResult.map((item) => {
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
                            <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                <div className="">
                                    {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                </div>
                                <div className="">
                                    新發生意外或事故總數 (每月總數)
                                </div>
                            </div>
                        </div>
                        <div className="col-12 byMonthCalendarLineChart7">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Line"
                                loader={<div>Loading Chart</div>}
                                data={envCollidedByOthersMCChart}
                                options={{
                                    chart: {
                                        title: '日曆年度',
                                        subtitle: '意外成因 - 環境因素 - 被別人碰撞(每月總數)',
                                    },
                                }}
                            />
                        </div>
                        <div className="col-12">
                            <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthCalendarBarChart7")}>下載圖表</button>
                        </div>
                        <div className="col-12 byMonthCalendarBarChart7">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={envCollidedByOthersMCChart}
                                options={{
                                    // Material design options
                                    chart: {
                                        title: '日曆年度',
                                        subtitle: '意外成因 - 環境因素 - 被別人碰撞(每月總數)',
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
                            <h6>{`${titleYear2} - 意外成因 - 環境因素 - 被別人傷害 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
                        </div>
                        <div className="col-12" style={{margin:'5px 0'}}>
                                <button className="btn btn-primary" onClick={() => copyTable('#table20')}>複製到表格</button>
                            </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <table className="table" id="table20">
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
                                    {envHurtByOthersMCResult.map((item) => {
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
                            <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthCalendarLineChart8")}>下載圖表</button>
                            <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                <div className="">
                                    {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                </div>
                                <div className="">
                                    新發生意外或事故總數 (每月總數)
                                </div>
                            </div>
                        </div>
                        <div className="col-12 byMonthCalendarLineChart8">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Line"
                                loader={<div>Loading Chart</div>}
                                data={envHurtByOthersMCChart}
                                options={{
                                    chart: {
                                        title: '日曆年度',
                                        subtitle: '意外成因 - 環境因素 - 被別人傷害(每月總數)',
                                    },
                                }}
                            />
                        </div>
                        <div className="col-12">
                            <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthCalendarBarChart8")}>下載圖表</button>
                        </div>
                        <div className="col-12 byMonthCalendarBarChart8">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={envHurtByOthersMCChart}
                                options={{
                                    // Material design options
                                    chart: {
                                        title: '日曆年度',
                                        subtitle: '意外成因 - 環境因素 - 被別人傷害(每月總數)',
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
                            <h6>{`${titleYear2} - 意外成因 - 環境因素 - 輔助器材使用不當 (如輪椅／便椅未上鎖) - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
                        </div>
                        <div className="col-12" style={{margin:'5px 0'}}>
                                <button className="btn btn-primary" onClick={() => copyTable('#table21')}>複製到表格</button>
                            </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <table className="table" id="table21">
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
                                    {envImproperUseOfAssistiveEquipmentMCResult.map((item) => {
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
                            <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthCalendarLineChart9")}>下載圖表</button>
                            <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                <div className="">
                                    {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                </div>
                                <div className="">
                                    新發生意外或事故總數 (每月總數)
                                </div>
                            </div>
                        </div>
                        <div className="col-12 byMonthCalendarLineChart9">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Line"
                                loader={<div>Loading Chart</div>}
                                data={envImproperUseOfAssistiveEquipmentMCChart}
                                options={{
                                    chart: {
                                        title: '日曆年度',
                                        subtitle: '意外成因 - 環境因素 - 輔助器材使用不當 (如輪椅／便椅未上鎖)(每月總數)',
                                    },
                                }}
                            />
                        </div>
                        <div className="col-12">
                            <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthCalendarBarChart9")}>下載圖表</button>
                        </div>
                        <div className="col-12 byMonthCalendarBarChart9">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={envImproperUseOfAssistiveEquipmentMCChart}
                                options={{
                                    // Material design options
                                    chart: {
                                        title: '日曆年度',
                                        subtitle: '意外成因 - 環境因素 - 輔助器材使用不當 (如輪椅／便椅未上鎖)(每月總數)',
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
                            <h6>{`${titleYear2} - 意外成因 - 環境因素 - 其他 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
                        </div>
                        <div className="col-12" style={{margin:'5px 0'}}>
                                <button className="btn btn-primary" onClick={() => copyTable('#table22')}>複製到表格</button>
                            </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <table className="table" id="table22">
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
                                    {envOtherMCResult.map((item) => {
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
                            <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthCalendarLineChart10")}>下載圖表</button>
                            <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                <div className="">
                                    {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                </div>
                                <div className="">
                                    新發生意外或事故總數 (每月總數)
                                </div>
                            </div>
                        </div>
                        <div className="col-12 byMonthCalendarLineChart10">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Line"
                                loader={<div>Loading Chart</div>}
                                data={envOtherMCChart}
                                options={{
                                    chart: {
                                        title: '日曆年度',
                                        subtitle: '意外成因 - 環境因素 - 其他(每月總數)',
                                    },
                                }}
                            />
                        </div>
                        <div className="col-12">
                            <button className="btn btn-primary" onClick={()=>downloadScreenshot("byMonthCalendarBarChart10")}>下載圖表</button>
                        </div>
                        <div className="col-12">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={envOtherMCChart}
                                options={{
                                    // Material design options
                                    chart: {
                                        title: '日曆年度',
                                        subtitle: '意外成因 - 環境因素 - 其他(每月總數)',
                                    },
                                }}

                            />
                        </div>
                    </div>
                </>
            case "BY_YEAR_FINANCIAL":
                let titleYear3 = "";
                let accidentEnvFinancialResult = sampleFiveParser(data, startDate, endDate);
                let accidentEnvFinancialChart = financialChartParser(accidentEnvFinancialResult);
                accidentEnvFinancialResult.forEach((item, i) => {
                    titleYear3 += item.financialYear;
                    if (i !== accidentEnvFinancialResult.length - 1) {
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
                            <h6>{`${titleYear3} - 意外成因 - 環境因素統計 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
                        </div>
                        <div className="col-12" style={{margin:'5px 0'}}>
                                <button className="btn btn-primary" onClick={() => copyTable('#table23')}>複製到表格</button>
                            </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <table className="table" id="table23">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">地面濕滑</th>
                                        <th scope="col">地面不平</th>
                                        <th scope="col">障礙物品</th>
                                        <th scope="col">光線不足</th>
                                        <th scope="col">空間不足</th>
                                        <th scope="col">聲響刺激</th>
                                        <th scope="col">被別人碰撞</th>
                                        <th scope="col">被別人傷害</th>
                                        <th scope="col">輔助器材使用不當 (如輪椅／便椅未上鎖)</th>
                                        <th scope="col">其他</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {accidentEnvFinancialResult.map((item) => {
                                        return (
                                            <tr>
                                                <th scope="row">{item.financialYear}</th>
                                                <td>{item.dataset.envSlipperyGround}</td>
                                                <td>{item.dataset.envUnevenGround}</td>
                                                <td>{item.dataset.envObstacleItems}</td>
                                                <td>{item.dataset.envInsufficientLight}</td>
                                                <td>{item.dataset.envNotEnoughSpace}</td>
                                                <td>{item.dataset.envAcousticStimulation}</td>
                                                <td>{item.dataset.envCollidedByOthers}</td>
                                                <td>{item.dataset.envHurtByOthers}</td>
                                                <td>{item.dataset.envImproperEquip}</td>
                                                <td>{item.dataset.envOther}</td>
                                            </tr>
                                        )
                                    })}
                                    {
                                        <tr style={{ color: "red" }}>
                                            <th scope="row">總數</th>
                                            <td>{envFactorDataset.envSlipperyGround}</td>
                                            <td>{envFactorDataset.envUnevenGround}</td>
                                            <td>{envFactorDataset.envObstacleItems}</td>
                                            <td>{envFactorDataset.envInsufficientLight}</td>
                                            <td>{envFactorDataset.envNotEnoughSpace}</td> 
                                            <td>{envFactorDataset.envAcousticStimulation}</td>
                                            <td>{envFactorDataset.envCollidedByOthers}</td>
                                            <td>{envFactorDataset.envHurtByOthers}</td>
                                            <td>{envFactorDataset.envImproperEquip}</td>
                                            <td>{envFactorDataset.envOther}</td>
                                        </tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <button className="btn btn-primary" onClick={()=>downloadScreenshot("byYearFinancialLineChart")}>下載圖表</button>
                            <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                <div className="">
                                    {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                </div>
                                <div className="">
                                新發生意外或事故總數
                                </div>
                            </div>
                        </div>
                        <div className="col-12 byYearFinancialLineChart">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Line"
                                loader={<div>Loading Chart</div>}
                                data={accidentEnvFinancialChart}
                                options={{
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '意外成因 - 環境因素統計(每年總數)',
                                    },
                                }}
                            />
                        </div>
                        <div className="col-12">
                            <button className="btn btn-primary" onClick={()=>downloadScreenshot("byYearFinancialBarChart")}>下載圖表</button>
                        </div>
                        <div className="col-12 byYearFinancialBarChart">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={accidentEnvFinancialChart}
                                options={{
                                    // Material design options
                                    chart: {
                                        title: '財政年度',
                                        subtitle: '意外成因 - 環境因素統計(每年總數)',
                                    },
                                }}
                            />
                        </div>
                    </div>
                </>
            case "BY_YEAR_CALENDAR":
                let titleYear4 = "";
                let accidentYearResult = sampleSixParser(data, startDate, endDate);
                let accidentYearChart = yearChartParser(accidentYearResult);
                accidentYearResult.forEach((item, i) => {
                    titleYear4 += item.year;
                    if (i !== accidentYearResult.length - 1) {
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
                            <h6>{`${titleYear4} - 意外成因 - 環境因素統計 - ${serviceUnits.length == 0 ? 'ALL' : serviceUnits}`}</h6>
                        </div>
                        <div className="col-12" style={{margin:'5px 0'}}>
                                <button className="btn btn-primary" onClick={() => copyTable('#table24')}>複製到表格</button>
                            </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <table className="table" id="table24">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">地面濕滑</th>
                                        <th scope="col">地面不平</th>
                                        <th scope="col">障礙物品</th>
                                        <th scope="col">光線不足</th>
                                        <th scope="col">空間不足</th>
                                        <th scope="col">聲響刺激</th>
                                        <th scope="col">被別人碰撞</th>
                                        <th scope="col">被別人傷害</th>
                                        <th scope="col">輔助器材使用不當 (如輪椅／便椅未上鎖)</th>
                                        <th scope="col">其他</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sampleSixParser(data, startDate, endDate).map((item) => {
                                        return (
                                            <tr>
                                                <th scope="row">{item.year}</th>
                                                <td>{item.dataset.envSlipperyGround}</td>
                                                <td>{item.dataset.envUnevenGround}</td>
                                                <td>{item.dataset.envObstacleItems}</td>
                                                <td>{item.dataset.envInsufficientLight}</td>
                                                <td>{item.dataset.envNotEnoughSpace}</td>
                                                <td>{item.dataset.envAcousticStimulation}</td>
                                                <td>{item.dataset.envCollidedByOthers}</td>
                                                <td>{item.dataset.envHurtByOthers}</td>
                                                <td>{item.dataset.envImproperEquip}</td>
                                                <td>{item.dataset.envOther}</td>
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
                            <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                <div className="">
                                    {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                </div>
                                <div className="">
                                新發生意外或事故總數
                                </div>
                            </div>
                        </div>
                        <div className="col-12 byYearCalendarLineChart">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Line"
                                loader={<div>Loading Chart</div>}
                                data={accidentYearChart}
                                options={{
                                    chart: {
                                        title: '日曆年度',
                                        subtitle: '意外性質 - 環境因素 統計(每年總數)',
                                    },
                                }}
                            />
                        </div>
                        <div className="col-12">
                            <button className="btn btn-primary" onClick={()=>downloadScreenshot("byYearCalendarBarChart")}>下載圖表</button>
                        </div>
                        <div className="col-12 byYearCalendarBarChart">
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="Bar"
                                loader={<div>Loading Chart</div>}
                                data={accidentYearChart}
                                options={{
                                    // Material design options
                                    chart: {
                                        title: '日曆年度',
                                        subtitle: '意外性質 - 環境因素 統計(每年總數)',
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
                        <th>{envFactorDataset.envImproperEquip}</th>
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
                            <div className="col-12">
                                <button className="btn btn-primary" onClick={()=>downloadScreenshot("nonBarChart")}>下載圖表</button>
                                <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                    <div className="">
                                        {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                    </div>
                                    <div className="">
                                        外界人士意外 - 意外成因-環境因素統計
                                    </div>
                                </div>
                                <div className="nonBarChart">
                                    <Chart
                                        chartType={"Bar"}
                                        width={'100%'}
                                        height={'400px'}
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
                                            ["輔助器材使用不當", envFactorDataset.envImproperEquip],
                                            ["其他", envFactorDataset.envOther],
                                        ]}
                                    />

                                </div>
                            </div>
                            <div className="col-12">
                                <button className="btn btn-primary" onClick={()=>downloadScreenshot("nonPieChart")}>下載圖表</button>
                                <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                    <div className="">
                                        {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                    </div>
                                    <div className="">
                                        外界人士意外 - 意外成因-環境因素統計
                                    </div>
                                </div>
                                <div className="nonPieChart">
                                    <Chart
                                        chartType={"PieChart"}
                                        width={'100%'}
                                        height={'400px'}
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
                                                ["輔助器材使用不當 (如輪椅／便椅未上鎖)", envFactorDataset.envImproperEquip],
                                                ["其他", envFactorDataset.envOther],
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
                            <div className="text-center mb-2" style={{ fontSize: 16 }}>
                                <div className="">
                                    {moment(startDate).format("MM/YYYY")} - {moment(endDate).format("MM/YYYY")}
                                </div>
                                <div className="">
                                    新發生意外或事故總數 (每月總數)
                                </div>
                            </div>
                        </div>
                        <div className="col-12 byMonthBarChart" style={{overflow:'auto'}}>
                            <Chart
                                width={newWidth}
                                height={400}
                                chartType="ColumnChart"
                                loader={<div>Loading Chart</div>}
                                data={
                                    [['月份', '地面濕滑', '地面不平', '障礙物品', '光線不足', '空間不足', '聲響刺激', '被別人碰撞', '被別人傷害', '輔助器材使用不當 (如輪椅／便椅未上鎖)', '其他'],
                                    ...sampleTwoParser(data, startDate, endDate).map((item) => {
                                        return [item.month, item.dataset.envSlipperyGround, item.dataset.envUnevenGround, item.dataset.envNotEnoughSpace, item.dataset.envInsufficientLight, item.dataset.envNotEnoughSpace
                                            , item.dataset.envAcousticStimulation, item.dataset.envCollidedByOthers, item.dataset.envHurtByOthers, item.dataset.envImproperEquip, item.dataset.envOther]
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
                setEnvFactorDataset(sampleOneParser(data));
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
            </div>
            <div className="">
                {chartSwitch()}
            </div>
        </div>
    )
}

export default OutsiderAccidentEnv

