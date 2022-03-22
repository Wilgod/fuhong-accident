import * as React from 'react'
import { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as moment from 'moment';
import { useServiceUserStats } from '../../../hooks/useServiceUserStats';
import Chart from "react-google-charts";
import useServiceLocation from '../../../hooks/useServiceLocation';
import { getDateFinancialYear } from '../../../utils/DateUtils';

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


const envFactorFilter = (factor: string, dataset: IDataset): IDataset => {
    let result = { ...dataset };
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
            if ((item.AccidentTime || item.IncidentTime) && item.CaseNumber) {
                const formType: string = item.CaseNumber.split("-")[0];
                const date = new Date(item.AccidentTime || item.IncidentTime || item.Created);
                const formattedDate = moment(date).format("MM/yyyy");
                if (m.has(formattedDate)) {
                    let oldDataset = m.get(formattedDate);
                    if (item.ObserveEnvironmentFactor) {
                        let arr = JSON.parse(item.ObserveEnvironmentFactor);
                        if (Array.isArray(arr)) {
                            arr.forEach((factor) => {
                                let newDataset = envFactorFilter(factor, oldDataset);
                                m.set(formattedDate, newDataset);
                            })
                        }
                    }
                } else {
                    if (item.ObserveEnvironmentFactor) {
                        let arr = JSON.parse(item.ObserveEnvironmentFactor);
                        if (Array.isArray(arr)) {
                            arr.forEach((factor) => {
                                let newDataset = envFactorFilter(factor, initialDataset);
                                m.set(formattedDate, newDataset);
                            })
                        }
                    }
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
        const d = new Date(item.AccidentTime || item.IncidentTime);
        if (d) {

            const currentFinicailYear = getDateFinancialYear(d);
            if (m.has(currentFinicailYear)) {

                let oldDataset = m.get(currentFinicailYear);
                if (item.ObserveEnvironmentFactor) {
                    let arr = JSON.parse(item.ObserveEnvironmentFactor);
                    if (Array.isArray(arr)) {
                        arr.forEach((factor) => {
                            let newDataset = envFactorFilter(factor, oldDataset);
                            m.set(currentFinicailYear, newDataset);
                        })
                    }
                }
            } else {
                if (item.ObserveEnvironmentFactor) {
                    let arr = JSON.parse(item.ObserveEnvironmentFactor);
                    if (Array.isArray(arr)) {
                        arr.forEach((factor) => {
                            let newDataset = envFactorFilter(factor, initialDataset);
                            m.set(currentFinicailYear, newDataset);
                        })
                    }
                }
            }
        }
    });

    m.forEach((value, key) => {
        let item: ISampleFiveDataset = { financialYear: key, dataset: value }
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
            const year = new Date(item.AccidentTime || item.IncidentTime).getFullYear().toString();
            const month = new Date(item.AccidentTime || item.IncidentTime).getMonth() + 1;

            if (m.has(year)) {
                let oldDataset = m.get(year);
                if (item.ObserveEnvironmentFactor) {
                    let arr = JSON.parse(item.ObserveEnvironmentFactor);
                    if (Array.isArray(arr)) {
                        arr.forEach((factor) => {
                            let newDataset = envFactorFilter(factor, oldDataset);
                            m.set(year, newDataset);
                        })
                    }
                }
            } else {
                if (item.ObserveEnvironmentFactor) {
                    let arr = JSON.parse(item.ObserveEnvironmentFactor);
                    if (Array.isArray(arr)) {
                        arr.forEach((factor) => {
                            let newDataset = envFactorFilter(factor, initialDataset);
                            m.set(year, newDataset);
                        })
                    }
                }
            }
        }
    })

    m.forEach((value, key) => {
        let item: ISampleSixDataset = { year: +key, dataset: value }
        result.push(item);
    })

    return result;
}

function ServiceUserAccidentEnv(siteCollectionUrl) {
    const [groupBy, setGroupBy] = useState("NON");
    const [envFactorDataset, setEnvFactorDataset] = useState<IDataset>(initialDataset);
    const [serivceLocation] = useServiceLocation(siteCollectionUrl);
    const [data, startDate, endDate, setStartDate, setEndDate, setServiceUnits] = useServiceUserStats();

    const multipleOptionsSelectParser = (event) => {
        let result = [];
        const selectedOptions = event.target.selectedOptions;
        for (let i = 0; i < selectedOptions.length; i++) {
            result.push(selectedOptions[i].value);
        }
        return result;
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
                                            <th scope="col">地面濕滑</th>
                                            <th scope="col">地面不平</th>
                                            <th scope="col">障礙物品</th>
                                            <th scope="col">光線不足</th>
                                            <th scope="col">空間不足</th>
                                            <th scope="col">聲響刺激</th>
                                            <th scope="col">被別人碰撞</th>
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
                                                    <td>{item.dataset.envAcousticStimulation}</td>
                                                    <td>{item.dataset.envCollidedByOthers}</td>
                                                    <td>{item.dataset.envHurtByOthers}</td>
                                                    <td>{item.dataset.envImproperUseOfAssistiveEquipment}</td>
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
                                                <td>{envFactorDataset.envAcousticStimulation}</td>
                                                <td>{envFactorDataset.envCollidedByOthers}</td>
                                                <td>{envFactorDataset.envHurtByOthers}</td>
                                                <td>{envFactorDataset.envImproperUseOfAssistiveEquipment}</td>
                                                <td>{envFactorDataset.envOther}</td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>)
            case "BY_MONTH_FINANCIAL":
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
            case "BY_YEAR_FINANCIAL":
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
                                        <th scope="col">地面濕滑</th>
                                        <th scope="col">地面不平</th>
                                        <th scope="col">障礙物品</th>
                                        <th scope="col">光線不足</th>
                                        <th scope="col">空間不足</th>
                                        <th scope="col">聲響刺激</th>
                                        <th scope="col">被別人碰撞</th>
                                        <th scope="col">輔助器材使用不當 (如輪椅／便椅未上鎖)</th>
                                        <th scope="col">其他</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sampleFiveParser(data).map((item) => {
                                        return (
                                            <tr>
                                                <th scope="row">{item.financialYear}</th>
                                                <td>{item.dataset.envSlipperyGround}</td>
                                                <td>{item.dataset.envUnevenGround}</td>
                                                <td>{item.dataset.envObstacleItems}</td>
                                                <td>{item.dataset.envNotEnoughSpace}</td>
                                                <td>{item.dataset.envAcousticStimulation}</td>
                                                <td>{item.dataset.envCollidedByOthers}</td>
                                                <td>{item.dataset.envHurtByOthers}</td>
                                                <td>{item.dataset.envImproperUseOfAssistiveEquipment}</td>
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
                                            <td>{envFactorDataset.envObstacleItems}</td>
                                            <td>{envFactorDataset.envAcousticStimulation}</td>
                                            <td>{envFactorDataset.envCollidedByOthers}</td>
                                            <td>{envFactorDataset.envHurtByOthers}</td>
                                            <td>{envFactorDataset.envImproperUseOfAssistiveEquipment}</td>
                                            <td>{envFactorDataset.envOther}</td>
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
                                        <th scope="col">地面濕滑</th>
                                        <th scope="col">地面不平</th>
                                        <th scope="col">障礙物品</th>
                                        <th scope="col">光線不足</th>
                                        <th scope="col">空間不足</th>
                                        <th scope="col">聲響刺激</th>
                                        <th scope="col">被別人碰撞</th>
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
                                                <td>{item.dataset.envNotEnoughSpace}</td>
                                                <td>{item.dataset.envObstacleItems}</td>
                                                <td>{item.dataset.envAcousticStimulation}</td>
                                                <td>{item.dataset.envCollidedByOthers}</td>
                                                <td>{item.dataset.envHurtByOthers}</td>
                                                <td>{item.dataset.envImproperUseOfAssistiveEquipment}</td>
                                                <td>{item.dataset.envOther}</td>
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
                        <th>{envFactorDataset.envObstacleItems}</th>
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
            case "BY_MONTH_FINANCIAL":
            case "BY_MONTH_CALENDAR":
            case "BY_YEAR_FINANCIAL":
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
            case "BY_MONTH_FINANCIAL":
            case "BY_MONTH_CALENDAR":
            case "BY_YEAR_FINANCIAL":
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

