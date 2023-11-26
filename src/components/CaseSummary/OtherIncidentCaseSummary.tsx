import * as React from 'react'
import { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import useServiceUnit2 from '../../hooks/useServiceUser2';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import * as moment from 'moment';
import { caseNumberToFormNameParser, caseNumberToSitePageParser } from '../../utils/FormNameUtils';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import useServiceLocation from '../../hooks/useServiceLocation';
import { getAllOtherIncidentReportWithClosed, getAllIncidentFollowUpFormWithClosed } from '../../api/FetchFuHongList';
import './Summary.css';
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import 'bootstrap/dist/css/bootstrap.css';
import * as XLSX from 'xlsx';
import * as XLSXStyle from 'xlsx-style';
import * as FileSaver from 'file-saver';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as fontawesome from '@fortawesome/free-solid-svg-icons';
interface IOtherIncidentCaseSummary {
    context: WebPartContext;
    siteCollectionUrl: string;
    permission: any;
}

function OtherIncidentCaseSummary({ context, siteCollectionUrl, permission }: IOtherIncidentCaseSummary) {
    const [startDate, setStartDate] = useState(new Date(new Date().setFullYear(new Date().getFullYear() - 1)));
    const [endDate, setEndDate] = useState(new Date());
    const [serviceLocation] = useServiceLocation(siteCollectionUrl);
    const [data, setData] = useState([]);
    const [displayData, setDisplayData] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [status, setStatus] = useState('');
    const [keyword, setKeyword] = useState('');
    const column = [
        {
            dataField: 'ID',
            text: 'ID',
            hidden: true
        },
        {
            dataField: 'Id',
            text: "Action",
            sort: true,
            headerStyle: {textAlign: 'center', verticalAlign: 'middle',width:'80px'},
            style: {justifyContent: "center",textAlign: "center"},
            formatter: actionFormatter.bind(this)
        },
        {
            dataField: 'ServiceLocationTC',
            text: '服務單位',
            sort: true,
            headerStyle: { width: '100px' }
        }, {
            dataField: 'IncidentTime',
            text: '意外發生日期及時間',
            sort: true,
            headerStyle: { width: '180px' },
            formatter: dateFormatter.bind(this)
        }, {
            dataField: 'IncidentLocation',
            text: '事故發生地點',
            sort: true,
            headerStyle: { width: '180px' }
        },
        {
            dataField: 'IncidentDescription',
            text: '事故的描述',
            sort: true,
            headerStyle: { width: '200px' }
        },
        {
            dataField: 'ImmediateFollowUp',
            text: '即時跟進行動',
            sort: true,
            headerStyle: { width: '200px' }
        },
        {
            dataField: 'FollowUpPlan',
            text: '跟進計劃',
            sort: true,
            headerStyle: { width: '200px' }
        }
    ]

    function actionFormatter(cell, rowIndex) {
    
        debugger
        let divButton = [];
        
        divButton.push(
            <span onClick={() => window.open(context.pageContext.site.absoluteUrl + `/accident-and-incident/SitePages/Home.aspx?formId=`+ cell + `&navScreen=OtherIncidentReport`, '_blank')} >
                <FontAwesomeIcon icon={fontawesome["faPen"]} size="lg" style={{ marginRight:'15px', fontSize: '15px', color: '#656262', cursor:'pointer' }} />
            </span>
            
        );
        return divButton
    }

    const multipleOptionsSelectParser = (event) => {
        let result = [];
        const selectedOptions = event.target.selectedOptions;
        for (let i = 0; i < selectedOptions.length; i++) {
            result.push(selectedOptions[i].value);
        }
        return result;
    }
    let lineBreakColumnIndex = "";
    useEffect(() => {
        if (Array.isArray(serviceLocation) && serviceLocation.length > 0) {
            getAllData();
        }

    }, [serviceLocation]);
    async function getAllData() {
        let allSpecialIncidentReportLicense = await getAllOtherIncidentReportWithClosed();
        let allIncidentFollowUpForm = await getAllIncidentFollowUpFormWithClosed();
        let allDate = [];
        for (let sa of allSpecialIncidentReportLicense) {
            let add = false;
            if (permission.indexOf('All') >= 0) {
                add = true;
            } else {
                for (let p of permission) {
                    if (sa.ServiceUnit == p) {
                        add = true;
                    }
                }
            }
            if (add) {
                let unit = serviceLocation.filter(o => { return o.su_Eng_name_display == sa.ServiceLocation });
                sa['ServiceLocationTC'] = unit.length > 0 ? unit[0].su_name_tc : '';
                let getARF = allIncidentFollowUpForm.filter(item => { return item.CaseNumber == sa.CaseNumber && item.ParentFormId == sa.ID });
                let residentAbuse = "";
                if (sa['RA_Body']) {
                    residentAbuse = "身體虐待"
                }
                if (sa['RA_Mental']) {
                    if (residentAbuse != "") { residentAbuse += ","; }
                    residentAbuse += "精神虐待"
                }
                if (sa['RA_Negligent']) {
                    if (residentAbuse != "") { residentAbuse += ","; }
                    residentAbuse += "疏忽照顧"
                }
                if (sa['RA_EmbezzleProperty']) {
                    if (residentAbuse != "") { residentAbuse += ","; }
                    residentAbuse += "侵吞財產"
                }
                if (sa['RA_Abandoned']) {
                    if (residentAbuse != "") { residentAbuse += ","; }
                    residentAbuse += "遺棄"
                }
                if (sa['RA_SexualAssault']) {
                    if (residentAbuse != "") { residentAbuse += ","; }
                    residentAbuse += "非禮／性侵犯"
                }
                if (sa['RA_Other']) {
                    if (residentAbuse != "") { residentAbuse += ","; }
                    residentAbuse += sa['RA_OtherDescription']
                }
                sa['ResidentAbuse'] = residentAbuse;
                sa['AccidentReportForm'] = getARF;
                if (sa['Stage'] == '1') {
                    sa['Form'] = '其他事故報告';
                    sa['CurrentSM'] = sa['SM'];
                    sa['CurrentSD'] = sa['SD'];
                } else if (sa['Stage'] == '2') {
                    sa['Form'] = '事故跟進/結束報告';
                    sa['CurrentSM'] = getARF.length > 0 ? getARF[0]['SM'] : null;
                    sa['CurrentSD'] = getARF.length > 0 ? getARF[0]['SD'] : null;
                    sa['CurrentSPT'] = getARF.length > 0 ? getARF[0]['SPT'] : null;
                }
                allDate.push(sa);
            }
        }

        setData(allDate);
        setDisplayData(allDate)
    }

    const inputFieldHandler = (event) => {
        const value = event.target.value;
        setKeyword(value);
    }

    function filter() {
        let filterData = data;
        if (selectedOptions.length > 0) {
            if (selectedOptions[0] != 'ALL') {
                let dataLists = [];
                for (let option of selectedOptions) {
                    let newDataList = filterData.filter(item => { return item.ServiceLocation == option });
                    for (let dataList of newDataList) {
                        dataLists.push(dataList);
                    }
                }
                filterData = dataLists;
            }

        }
        if (startDate != null) {
            let newStartDate = new Date(startDate).setHours(0,0,0);
            filterData = filterData.filter(item => { return new Date(item.IncidentTime).getTime() >= new Date(newStartDate).getTime() });
        }
        if (endDate != null) {
            let newEndDate = new Date(endDate).setHours(23,59,59);
            filterData = filterData.filter(item => { return new Date(item.IncidentTime).getTime() <= new Date(newEndDate).getTime() });
        }

        if (status != '' && status != 'ALL') {
            if (status == 'Apply') {
                filterData = filterData.filter(item => { return item.Stage == '1' });
            } else if (status == 'Confirm') {
                filterData = filterData.filter(item => { return item.Stage == '2' });
            }
        }
        filterData = filterData.filter(item => {
            return ((item.HomesName != null && item.HomesName.indexOf(keyword) >= 0) ||
                (item.ServiceLocation != null && item.ServiceLocation.indexOf(keyword) >= 0) ||
                (item.CaseNumber != null && item.CaseNumber.indexOf(keyword) >= 0) ||
                (item.InsuranceCaseNo != null && item.InsuranceCaseNo.indexOf(keyword) >= 0))
        });

        setDisplayData(filterData);
    }

    async function exportExcel() {
        let exportList = [];
        for (let results of displayData) {
            let IncidentTime = '';

            if (results.IncidentTime != undefined && results.IncidentTime != null) {
                IncidentTime = moment(results.IncidentTime).format("YYYY-MM-DD hh:mm");
                //IncidentTime = new Date(results.IncidentTime).getFullYear() + `-` +(`0`+(new Date(results.IncidentTime).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(results.IncidentTime).getDate()).slice(-2) + ` ` + (`0`+new Date(results.IncidentTime).getHours()).slice(-2) + `:` + + (`0`+new Date(results.IncidentTime).getMinutes()).slice(-2)
            }

            exportList.push({
                ServiceLocationTC: results.ServiceLocationTC,
                IncidentTime: IncidentTime,
                IncidentLocation: results.IncidentLocation,
                IncidentDescription: results.IncidentDescription,
                ImmediateFollowUp: results.ImmediateFollowUp,
                FollowUpPlan: results.FollowUpPlan
            })
        }
        let resultMax = flattenArray(exportList)[1];
        let flattenedResult = flattenArray(exportList)[0];
        let ws = {};
        let col = 0; //A
        let row = 2;

        for (let i = 0; i < exportList.length; i++) {
            ws["A" + (i + row)] = { t: 's', v: exportList[i].ServiceLocationTC, s: { alignment: { wrapText: true, vertical: 'center', horizontal: 'center' } } };
            ws["B" + (i + row)] = { t: 's', v: exportList[i].IncidentTime, s: { alignment: { wrapText: true, vertical: 'center', horizontal: 'center' } } };
            ws["C" + (i + row)] = { t: 's', v: exportList[i].IncidentLocation, s: { alignment: { wrapText: true, vertical: 'center', horizontal: 'center' } } };
            ws["D" + (i + row)] = { t: 's', v: exportList[i].IncidentDescription, s: { alignment: { wrapText: true, vertical: 'center', horizontal: 'center' } } };
            ws["E" + (i + row)] = { t: 's', v: exportList[i].ImmediateFollowUp, s: { alignment: { wrapText: true, vertical: 'center', horizontal: 'center' } } };
            ws["F" + (i + row)] = { t: 's', v: exportList[i].FollowUpPlan, s: { alignment: { wrapText: true, vertical: 'center', horizontal: 'center' } } };
        }
        XLSX.utils.sheet_add_json(ws, flattenedResult, { origin: "A3" });
        ws = styleArray(ws, col, row, exportList, resultMax);
        ws["A1"] = { t: 's', v: "扶康會", s: { alignment: { wrapText: true, vertical: 'center', horizontal: 'center' }, font: { bold: true } } };
        ws["A2"] = { t: 's', v: "其他事故報告", s: { alignment: { wrapText: true, vertical: 'center', horizontal: 'center' }, font: { bold: true } } };
        ws["A3"] = { t: 's', v: "服務單位", s: { alignment: { wrapText: true, vertical: 'center', horizontal: 'center' }, border: { top: { style: 'thick', color: { rgb: "000000" } }, bottom: { style: 'thick', color: { rgb: "000000" } }, screenLeft: { style: 'thick', color: { rgb: "000000" } }, right: { style: 'thick', color: { rgb: "000000" } } } } };
        ws["B3"] = { t: 's', v: "意外日期及時間", s: { alignment: { wrapText: true, vertical: 'center', horizontal: 'center' }, border: { top: { style: 'thick', color: { rgb: "000000" } }, bottom: { style: 'thick', color: { rgb: "000000" } }, screenLeft: { style: 'thick', color: { rgb: "000000" } }, right: { style: 'thick', color: { rgb: "000000" } } } } };
        ws["C3"] = { t: 's', v: "事故發生地點", s: { alignment: { wrapText: true, vertical: 'center', horizontal: 'center' }, border: { top: { style: 'thick', color: { rgb: "000000" } }, bottom: { style: 'thick', color: { rgb: "000000" } }, screenLeft: { style: 'thick', color: { rgb: "000000" } }, right: { style: 'thick', color: { rgb: "000000" } } } } };
        ws["D3"] = { t: 's', v: "事故的描述", s: { alignment: { wrapText: true, vertical: 'center', horizontal: 'center' }, border: { top: { style: 'thick', color: { rgb: "000000" } }, bottom: { style: 'thick', color: { rgb: "000000" } }, screenLeft: { style: 'thick', color: { rgb: "000000" } }, right: { style: 'thick', color: { rgb: "000000" } } } } };
        ws["E3"] = { t: 's', v: "即時跟進行動", s: { alignment: { wrapText: true, vertical: 'center', horizontal: 'center' }, border: { top: { style: 'thick', color: { rgb: "000000" } }, bottom: { style: 'thick', color: { rgb: "000000" } }, screenLeft: { style: 'thick', color: { rgb: "000000" } }, right: { style: 'thick', color: { rgb: "000000" } } } } };
        ws["F3"] = { t: 's', v: "跟進計劃", s: { alignment: { wrapText: true, vertical: 'center', horizontal: 'center' }, border: { top: { style: 'thick', color: { rgb: "000000" } }, bottom: { style: 'thick', color: { rgb: "000000" } }, screenLeft: { style: 'thick', color: { rgb: "000000" } }, right: { style: 'thick', color: { rgb: "000000" } } } } };

        ws = convertMessageWithLineBreak(ws);
        ws["!merges"] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 9 } },
            { s: { r: 1, c: 0 }, e: { r: 1, c: 9 } }
        ]
        var wscols = [
            { wch: 10 },
            { wch: 20 },
            { wch: 10 },
            { wch: 10 }
        ];
        ws['!cols'] = wscols;
        let wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Dashboard");
        const excelBuffer: any = XLSXStyle.write(wb, { bookType: 'xlsx', type: 'buffer' });
        saveAsExcelFile(excelBuffer, "Dashboard");
    }

    function saveAsExcelFile(buffer: any, fileName: string): void {
        const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
    }

    function flattenArray(src) {
        let flattenResult = [];
        let attributeLayer = [];
        var maxLayer = 0;
        var tempMaxLayer = 0;
        var totalCol = 0;
        var masterLayer = "";
        var currentLayer = 1;
        var maxChildren = 0;
        let maxLayerSet: boolean = false;
        //var attributeLayer: Map<any, any> = new Map<any, any>();
        var t = [];
        let flatten = function (arr, master, index) {
            if (arr != null && arr.constructor.name === "Object") {
                ++currentLayer;
                ++tempMaxLayer;
                Object.keys(arr).map(item => {
                    flatten(arr[item], master, index);
                });
                ++maxChildren;
                ++totalCol;
                t[master + totalCol] = arr.Title == null ? "" : arr.Title;
            } else if (master.indexOf("@") == -1) {
                ++maxChildren;
                ++totalCol;
                t[master + totalCol] = arr == null ? "" : arr;
            }
        };
        for (let result in src) {
            t = [];
            totalCol = 0;
            Object.keys(src[result]).map(item => {
                maxLayer = tempMaxLayer > maxLayer ? tempMaxLayer : maxLayer;
                currentLayer = 1;
                maxChildren = 0;
                flatten(src[result][item], item, 0);
                !maxLayerSet ? attributeLayer.push(maxChildren) : true;
            });
            maxLayerSet = true;
            flattenResult.push(t);
        }

        return [flattenResult, attributeLayer];
    }

    function styleArray(ws, col, row, src, maxLayer) {
        let lineBreakColumn = [];
        //set header
        if (src.length > 0) {
            Object.keys(src[0]).map((item, index) => {
                if (item.indexOf("CheckList") == -1) {

                    lineBreakColumnIndex = String.fromCharCode(97 + index).toUpperCase();
                    lineBreakColumn.push(String.fromCharCode(97 + index).toUpperCase());
                    var cell = "";
                    if (col >= 26) {
                        cell = String.fromCharCode(97 + 0).toUpperCase() + String.fromCharCode(97 + col - 26).toUpperCase();
                    } else {
                        cell = String.fromCharCode(97 + col).toUpperCase();
                    }
                    if (maxLayer[index] > 1) { //hv children
                        //ws["!merges"].push({s:{r:row,c:col},e:{r:row,c:col+maxLayer[index]-1}}); //horizontally merge
                        ws[cell + (row + 2)] = { t: "s", v: item };
                        for (let i = 0; i < maxLayer[index]; ++i) {
                            if (col >= 26) {
                                ws[String.fromCharCode(97 + 0).toUpperCase() + String.fromCharCode(97 + col - 26 + i).toUpperCase() + (row + 1)].s = { font: { bold: true }, alignment: { wrapText: true, vertical: 'center', horizontal: 'center' } };
                                ws[String.fromCharCode(97 + 0).toUpperCase() + String.fromCharCode(97 + col - 26 + i).toUpperCase() + (row + 2)] = { t: "s", v: Object.keys(src[0][item])[i] };
                                //ws[String.fromCharCode(97 + 0).toUpperCase() + String.fromCharCode(97 + col - 26  + i).toUpperCase() + (row+2)].s = {font:{bold: true},alignment: { wrapText: true, vertical: 'center', horizontal: 'center' }, border: { top: { style: 'thick', color: { rgb: "000000"}}, left: { style: 'thick', color: { rgb: "000000"}}, bottom: { style: 'thick', color: { rgb: "000000"}}, right: { style: 'thick', color: { rgb: "000000"}}}};
                            } else {
                                ws[String.fromCharCode(97 + col + i).toUpperCase() + (row + 1)].s = { font: { bold: true, sz: 11 }, alignment: { wrapText: true, vertical: 'center', horizontal: 'center' } };
                                ws[String.fromCharCode(97 + col + i).toUpperCase() + (row + 2)] = { t: "s", v: Object.keys(src[0][item])[i] };
                                //ws[String.fromCharCode(97 + col + i).toUpperCase() + (row+2)].s = {font:{bold: true,sz:11},alignment: { wrapText: true, vertical: 'center', horizontal: 'center' }, border: { top: { style: 'thick', color: { rgb: "000000"}}, left: { style: 'thick', color: { rgb: "000000"}}, bottom: { style: 'thick', color: { rgb: "000000"}}, right: { style: 'thick', color: { rgb: "000000"}}}};
                            }

                        }
                        col += maxLayer[index];
                    } else {
                        //ws["!merges"].push({s:{r:row,c:col},e:{r:row+1,c:col}}); //only vertically merge
                        ws[String.fromCharCode(97 + col).toUpperCase() + (row + 1)] = { t: "s", v: item };
                        //ws[String.fromCharCode(97 + col).toUpperCase() + (row+2)] = {t:"s",v:item};
                        ws[String.fromCharCode(97 + col).toUpperCase() + (row + 1)].s = { font: { bold: true, sz: 11 }, alignment: { wrapText: true, vertical: 'center', horizontal: 'center' }, border: { top: { style: 'thick', color: { rgb: "000000" } }, left: { style: 'thick', color: { rgb: "000000" } }, bottom: { style: 'thick', color: { rgb: "000000" } }, right: { style: 'thick', color: { rgb: "000000" } } } };
                        //ws[String.fromCharCode(97 + col).toUpperCase() + (row+2)].s = {font:{bold: true,sz:11},alignment: { wrapText: true, vertical: 'center', horizontal: 'center' },border: { top: { style: 'thick', color: { rgb: "000000"}}, left: { style: 'thick', color: { rgb: "000000"}}, bottom: { style: 'thick', color: { rgb: "000000"}}, right: { style: 'thick', color: { rgb: "000000"}}}};
                        col += maxLayer[index];
                    }
                }

            });
        }
        let wscols = [];
        for (let i = 0; i < col; ++i) {
            if (lineBreakColumn.indexOf(String.fromCharCode(97 + i).toUpperCase()) != -1) {
                wscols.push({ wpx: 350 });
            } else {
                wscols.push({ wpx: 350 });
            }
        }
        ws['!cols'] = wscols;
        var wsrows = [
            { hpt: 50 },
            { hpt: 15 }
        ];
        ws['!rows'] = wsrows; // ws - worksheet
        return ws;
    }

    function convertMessageWithLineBreak(ws) {
        Object.keys(ws).map(item => {
            if (item.indexOf("!") == -1 && item.indexOf(lineBreakColumnIndex) != -1) {
                if (ws[item]["s"] == undefined) {
                    ws[item]["s"] = { alignment: { wrapText: true } };
                }
            }
        });
        return ws;
    }
    return (
        <div>
            <div className="row mb-3">
                <div className="col">
                    <h6 style={{ fontWeight: 600 }}>報告 &gt; 個案概要 &gt; 其他事故</h6>
                </div>
            </div>
            <div className="row">
                <div className="col-xl-4 col-md-6 col-12 mb-3" >
                    <div style={{ fontWeight: 600 }}>
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
                <div className="col-xl-4 col-md-6 col-12 mb-3" >
                    <div style={{ fontWeight: 600 }}>
                        服務單位
                    </div>
                    {/* <div className="" style={{ overflowY: "scroll", border: "1px solid gray", height: 100 }}>

                    </div> */}
                    <select multiple className="form-control" onChange={(event) => {
                        const selectedOptions = multipleOptionsSelectParser(event);
                        setSelectedOptions(selectedOptions);
                    }}>
                        <option value="ALL">--- 所有 ---</option>
                        {permission.indexOf('All') >= 0 && serviceLocation.length > 0 &&
                            serviceLocation.map((item) => {
                                return <option value={item.su_Eng_name_display}>{item.su_name_tc}</option>
                            })
                        }
                        {permission.indexOf('All') < 0 && serviceLocation.length > 0 &&
                            permission.map((item) => {
                                let ser = serviceLocation.filter(o => { return o.su_Eng_name_display == item });

                                if (ser.length > 0) {
                                    return <option value={ser[0].su_Eng_name_display}>{ser[0].su_name_tc}</option>
                                }

                            })
                        }
                        {/*
                            serviceLocation.map((item) => {
                                return <option value={item.su_Eng_name_display}>{item.su_name_tc}</option>
                            })
                        */}
                    </select>
                </div>
                <div className="col-xl-4 col-md-6 col-12 mb-3" >
                    <div style={{ fontWeight: 600 }}>
                        顯示狀態
                    </div>
                    <select multiple className="form-control" onChange={(event) => {
                        setStatus(event.target.selectedOptions[0].value);
                    }}>
                        <option value="ALL">所有狀態</option>
                        <option value="Apply">遞交檔案</option>
                        <option value="Confirm">確認檔案</option>
                    </select>
                </div>
            </div>
            <div className="mb-3">
                <div style={{ fontSize: "1.05rem", fontWeight: 600 }} >
                    關鍵字
                </div>
                <div className="row">
                    <div className="col-md-8 col-12 mt-1">
                        <input className="form-control" placeholder="(可搜尋：事主姓名 / 檔案編號 / 保險公司備案編號)" onChange={inputFieldHandler} />
                    </div>
                    <div className="col-md-2 col-6 mt-1">
                        <button type="button" className="btn btn-primary w-100" onClick={() => filter()}  >搜尋</button>
                    </div>
                    <div className="col-md-2 col-6 mt-1">
                        <button type="button" className="btn btn-success w-100" onClick={() => exportExcel()} >Excel</button>
                    </div>
                </div>
            </div>
            <div>
                <div className="mb-1" style={{ fontSize: "1.05rem", fontWeight: 600 }}>
                    搜尋結果 [{`${displayData.length} 筆記錄`}]
                </div>
                <div className="summaryDashboard">
                    <BootstrapTable boot keyField='id' data={displayData || []} columns={column} pagination={paginationFactory()} bootstrap4={true} />
                </div>

            </div>
        </div>
    )
}

export default OtherIncidentCaseSummary



function dateFormatter(cell, rowIndex) {
    let div = [];
    if (cell != undefined && cell != null) {
        div.push(<div >{moment(cell).format("YYYY-MM-DD hh:mm")}</div>);
        //div.push(<div >{new Date(cell).getFullYear() + `-` +(`0`+(new Date(cell).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(cell).getDate()).slice(-2) + ` ` + (`0`+new Date(cell).getHours()).slice(-2) + `:` + + (`0`+new Date(cell).getMinutes()).slice(-2)}</div>);
    }
    return div;
}