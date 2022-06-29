import * as React from 'react'
import { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import useServiceUnit2 from '../../hooks/useServiceUser2';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import * as moment from 'moment';
import { caseNumberToFormNameParser, caseNumberToSitePageParser } from '../../utils/FormNameUtils';
import {getAllOutsiderAccidentWithClosed, getAllAccidentReportForm} from '../../api/FetchFuHongList';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import useServiceLocation from '../../hooks/useServiceLocation';
import './Summary.css';
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import 'bootstrap/dist/css/bootstrap.css';
import * as XLSX from 'xlsx';
import * as XLSXStyle from 'xlsx-style';
import * as FileSaver from 'file-saver';
interface IOutsiderAccidentCaseSummary {
    context: WebPartContext;
    siteCollectionUrl:string;
}

function OutsiderAccidentCaseSummary({ context,siteCollectionUrl }: IOutsiderAccidentCaseSummary) {
    const [startDate, setStartDate] = useState(new Date(new Date().setFullYear(new Date().getFullYear() - 3)));
    const [endDate, setEndDate] = useState(new Date());
    const [serviceLocation] = useServiceLocation(siteCollectionUrl);
    const [data, setData] = useState([]);
    const [displayData, setDisplayData] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [status, setStatus] = useState('');
    const [keyword, setKeyword] = useState('');
    const multipleOptionsSelectParser = (event) => {
        let result = [];
        const selectedOptions1 = event.target.selectedOptions;
        for (let i = 0; i < selectedOptions1.length; i++) {
            result.push(selectedOptions1[i].value);
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
        let allOutsiderUserAccident = await getAllOutsiderAccidentWithClosed();
        let allAccidentReportForm = await getAllAccidentReportForm();
        for (let sa of allOutsiderUserAccident) {
            let unit = serviceLocation.filter(o => {return o.su_Eng_name_display == sa.ServiceLocation});
            sa['ServiceLocationTC'] = unit.length > 0 ? unit[0].su_name_tc : '';
            let getARF = allAccidentReportForm.filter(item => {return item.CaseNumber == sa.CaseNumber && item.ParentFormId == sa.ID});
            sa['AccidentReportForm'] = getARF;
            if (sa['Stage'] == '1') {
                sa['Form'] = '外界人士意外填報表(一)';
                sa['CurrentSM'] = sa['SM'];
                sa['CurrentSD'] = sa['SD'];
                sa['CurrentSPT'] = sa['SPT'];
            } else if (sa['Stage'] == '2') {
                sa['Form'] = '外界人士意外報告(二)';
                sa['CurrentSM'] = getARF.length > 0 ? getARF[0]['SM'] : null;
                sa['CurrentSD'] = getARF.length > 0 ? getARF[0]['SD'] : null;
                sa['CurrentSPT'] = getARF.length > 0 ? getARF[0]['SPT'] : null;
            }
        }
        setData(allOutsiderUserAccident);
        setDisplayData(allOutsiderUserAccident)
    }

    const inputFieldHandler = (event) => {
        const value = event.target.value;
        setKeyword(value);
    }

    function filter() {
        let filterData = data;
        if (selectedOptions.length > 0) {
            let dataLists = [];
            for (let option of selectedOptions) {
                let newDataList = filterData.filter(item => { return item.ServiceLocation == option });
                for (let dataList of newDataList) {
                    dataLists.push(dataList);
                }
            }
            filterData = dataLists;
        }
        if (startDate != null) {
            filterData = filterData.filter(item => {return new Date(item.AccidentTime).getTime() >= new Date(startDate).getTime()});
        }
        if (endDate != null) {
            filterData = filterData.filter(item => {return new Date(item.AccidentTime).getTime() <= new Date(endDate).getTime()});
        }

        if (status != '' && status != 'ALL') {
            if (status == 'Apply') {
                filterData = filterData.filter(item => {return item.Stage == '1'});
            } else if (status == 'Confirm') {
                filterData = filterData.filter(item => {return item.Stage == '2' || item.Stage == '3'});
            }
        }
        /*if (status != '' && status != 'ALL') {
            if (status == 'CLOSED') {
                filterData = filterData.filter(item => {return item.Status == 'CLOSED'});
            } else if (status == 'PROCESSING') {
                filterData = filterData.filter(item => {return item.Status != 'CLOSED'});
            }
            
        }*/
        filterData = filterData.filter(item => {
            return ((item.ServiceLocationTC != null &&item.ServiceLocationTC.indexOf(keyword) >= 0) || 
            (item.ServiceLocation != null && item.ServiceLocation.indexOf(keyword) >= 0) || 
            (item.CaseNumber != null && item.CaseNumber.indexOf(keyword) >= 0) || 
            (item.InsuranceCaseNo != null && item.InsuranceCaseNo.indexOf(keyword) >= 0))
        });
        
        setDisplayData(filterData);
    }

    async function exportExcel() {
        let exportList = [];
        for (let results of displayData) {
            let AccidentTime = '';
            let AccidentNature = '';
            let AccidentDetail = '';
            let AccidentCauseFactor = '';
            let Suggestion = '';
            if (results.AccidentTime != undefined &&results.AccidentTime != null) {
                AccidentTime = moment(results.AccidentTime).format("YYYY-MM-DD hh:mm");
                //AccidentTime = new Date(results.AccidentTime).getFullYear() + `-` +(`0`+(new Date(results.AccidentTime).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(results.AccidentTime).getDate()).slice(-2) + ` ` + (`0`+new Date(results.AccidentTime).getHours()).slice(-2) + `:` + + (`0`+new Date(results.AccidentTime).getMinutes()).slice(-2)
            }

            if (results.AccidentReportForm != undefined && results.AccidentReportForm.length > 0) {
                if (results.AccidentReportForm[0].AccidentNatureFall) {
                    AccidentNature += '跌倒';
                }
                if (results.AccidentReportForm[0].AccidentNatureChok) {
                    if (AccidentNature != '') {
                        AccidentNature += ','
                    }
                    AccidentNature = '哽塞';
                }
                if (results.AccidentReportForm[0].AccidentNatureBehavior) {
                    if (AccidentNature != '') {
                        AccidentNature += ','
                    }
                    AccidentNature = '服務使用者行為問題';
                }
                if (results.AccidentReportForm[0].AccidentNatureEnvFactor) {
                    if (AccidentNature != '') {
                        AccidentNature += ','
                    }
                    AccidentNature = '環境因素';
                }
                if (results.AccidentReportForm[0].AccidentNatureOther) {
                    if (AccidentNature != '') {
                        AccidentNature += ','
                    }
                    AccidentNature = results.AccidentReportForm[0].AccidentNatureOtherRemark;
                }
            }
            if (results.AccidentReportForm != undefined && results.AccidentReportForm.length > 0) {
                if (results.AccidentReportForm[0].AccidentalDiscovery != null) {
                    AccidentDetail = results.AccidentReportForm[0].AccidentalDiscovery;
                }
            }
            if (results.AccidentReportForm != undefined && results.AccidentReportForm.length > 0) {
                if (results.AccidentReportForm[0].AccidentCauseFactor != null) {
                    AccidentCauseFactor = results.AccidentReportForm[0].AccidentCauseFactor;
                }
            }
            if (results.AccidentReportForm != undefined && results.AccidentReportForm.length > 0) {
                if (results.AccidentReportForm[0].Suggestion != null) {
                    Suggestion = results.AccidentReportForm[0].Suggestion;
                }
            }
            exportList.push({
                ServiceLocation: results.ServiceLocation,
                AccidentTime: AccidentTime,
                ServiceUserGender: results.ServiceUserGender,
                ServiceUserAge: results.ServiceUserAge,
                AccidentLocation: results.AccidentLocation,
                AccidentNature: AccidentNature,
                AccidentDetail: AccidentDetail,
                AccidentCauseFactor: AccidentCauseFactor,
                Suggestion:Suggestion
                
            })
        }
        let resultMax = flattenArray(exportList)[1];
        let flattenedResult = flattenArray(exportList)[0];
        let ws = {};
        let col = 0; //A
        let row = 2;
        
        for (let i= 0; i<exportList.length; i++) {
            ws["A"+ (i+row)] = { t: 's', v: exportList[i].ServiceLocation, s: { alignment: { wrapText: true, vertical: 'center', horizontal: 'center'} } };
            ws["B"+ (i+row)] = { t: 's', v: exportList[i].AccidentTime, s: { alignment: { wrapText: true, vertical: 'center', horizontal: 'center'} } };
            ws["C"+ (i+row)] = { t: 's', v: exportList[i].ServiceUserGender, s: { alignment: { wrapText: true, vertical: 'center', horizontal: 'center'} } };
            ws["D"+ (i+row)] = { t: 's', v: exportList[i].ServiceUserAge, s: { alignment: { wrapText: true, vertical: 'center', horizontal: 'center'} } };
            ws["E"+ (i+row)] = { t: 's', v: exportList[i].AccidentLocation, s: { alignment: { wrapText: true, vertical: 'center', horizontal: 'center'} } };
            ws["F"+ (i+row)] = { t: 's', v: exportList[i].AccidentNature, s: { alignment: { wrapText: true, vertical: 'center', horizontal: 'center'} } };
            ws["G"+ (i+row)] = { t: 's', v: exportList[i].AccidentDetail, s: { alignment: { wrapText: true, vertical: 'center', horizontal: 'center'} } };
            ws["H"+ (i+row)] = { t: 's', v: exportList[i].AccidentCauseFactor, s: { alignment: { wrapText: true, vertical: 'center', horizontal: 'center'} } };
            ws["I"+ (i+row)] = { t: 's', v: exportList[i].Suggestion, s: { alignment: { wrapText: true, vertical: 'center', horizontal: 'center'} } };
        }
        XLSX.utils.sheet_add_json(ws, flattenedResult, {origin:"A3"});
        ws = styleArray(ws,col,row,exportList,resultMax);
        ws["A1"] = { t: 's', v: "扶康會", s: { alignment: { wrapText: true, vertical: 'center', horizontal: 'center' }, font: { bold: true }  } };
        ws["A2"] = { t: 's', v: "外界人士意外", s: { alignment: { wrapText: true, vertical: 'center', horizontal: 'center'}, font: { bold: true }  } };
        ws["A3"] = { t: 's', v: "服務單位", s: { alignment: { wrapText: true, vertical: 'center', horizontal: 'center' }, border: { top : { style: 'thick', color: { rgb: "000000" } },bottom: { style: 'thick', color: { rgb: "000000" } },screenLeft : { style: 'thick', color: { rgb: "000000" } },right : { style: 'thick', color: { rgb: "000000" } } } } };
        ws["B3"] = { t: 's', v: "意外日期及時間", s: { alignment: { wrapText: true, vertical: 'center', horizontal: 'center'}, border: { top : { style: 'thick', color: { rgb: "000000" } },bottom: { style: 'thick', color: { rgb: "000000" } },screenLeft : { style: 'thick', color: { rgb: "000000" } },right : { style: 'thick', color: { rgb: "000000" } } } } };
        ws["C3"] = { t: 's', v: "性別", s: { alignment: { wrapText: true, vertical: 'center', horizontal: 'center'}, border: { top : { style: 'thick', color: { rgb: "000000" } },bottom: { style: 'thick', color: { rgb: "000000" } },screenLeft : { style: 'thick', color: { rgb: "000000" } },right : { style: 'thick', color: { rgb: "000000" } } } } };
        ws["D3"] = { t: 's', v: "年齡", s: { alignment: { wrapText: true, vertical: 'center', horizontal: 'center'}, border: { top : { style: 'thick', color: { rgb: "000000" } },bottom: { style: 'thick', color: { rgb: "000000" } },screenLeft : { style: 'thick', color: { rgb: "000000" } },right : { style: 'thick', color: { rgb: "000000" } } } } };
        ws["E3"] = { t: 's', v: "地點", s: { alignment: { wrapText: true, vertical: 'center', horizontal: 'center'}, border: { top : { style: 'thick', color: { rgb: "000000" } },bottom: { style: 'thick', color: { rgb: "000000" } },screenLeft : { style: 'thick', color: { rgb: "000000" } },right : { style: 'thick', color: { rgb: "000000" } } } } };
        ws["F3"] = { t: 's', v: "意外性質", s: { alignment: { wrapText: true, vertical: 'center', horizontal: 'center'}, border: { top : { style: 'thick', color: { rgb: "000000" } },bottom: { style: 'thick', color: { rgb: "000000" } },screenLeft : { style: 'thick', color: { rgb: "000000" } },right : { style: 'thick', color: { rgb: "000000" } } } } };
        ws["G3"] = { t: 's', v: "意外詳情", s: { alignment: { wrapText: true, vertical: 'center', horizontal: 'center'}, border: { top : { style: 'thick', color: { rgb: "000000" } },bottom: { style: 'thick', color: { rgb: "000000" } },screenLeft : { style: 'thick', color: { rgb: "000000" } },right : { style: 'thick', color: { rgb: "000000" } } } } };
        ws["H3"] = { t: 's', v: "成因", s: { alignment: { wrapText: true, vertical: 'center', horizontal: 'center'}, border: { top : { style: 'thick', color: { rgb: "000000" } },bottom: { style: 'thick', color: { rgb: "000000" } },screenLeft : { style: 'thick', color: { rgb: "000000" } },right : { style: 'thick', color: { rgb: "000000" } } } } };
        ws["I3"] = { t: 's', v: "跟進工作及報告建議", s: { alignment: { wrapText: true, vertical: 'center', horizontal: 'center'}, border: { top : { style: 'thick', color: { rgb: "000000" } },bottom: { style: 'thick', color: { rgb: "000000" } },screenLeft : { style: 'thick', color: { rgb: "000000" } },right : { style: 'thick', color: { rgb: "000000" } } } } };
        ws = convertMessageWithLineBreak(ws);
        ws["!merges"] = [
			{ s: { r: 0, c: 0 }, e: { r: 0, c: 9 } },
			{ s: { r: 1, c: 0 }, e: { r: 1, c: 9 } }
        ]
        var wscols = [
            {wch:10},
            {wch:20},
            {wch:10},
            {wch:10},
            {wch:30},
            {wch:50},
            {wch:50},
            {wch:50},
            {wch:50}
        ];
        ws['!cols'] = wscols;
        let wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws,"Dashboard");
        const excelBuffer: any = XLSXStyle.write(wb, { bookType: 'xlsx', type: 'buffer' });
        saveAsExcelFile(excelBuffer, "Dashboard");
    }

    function saveAsExcelFile(buffer: any, fileName: string): void {
        const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
          type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName+EXCEL_EXTENSION);
    }

    function flattenArray(src){
        let flattenResult = [];
        let attributeLayer = [];
        var maxLayer = 0;
        var tempMaxLayer = 0;
        var totalCol = 0;
        var masterLayer = "";
        var currentLayer = 1;
        var maxChildren = 0;
        let maxLayerSet:boolean = false;
        //var attributeLayer: Map<any, any> = new Map<any, any>();
        var t = [];
        let flatten = function(arr,master,index){
          if(arr!=null && arr.constructor.name === "Object"){
            ++currentLayer;
            ++tempMaxLayer;
            Object.keys(arr).map(item=>{
              flatten(arr[item],master,index);
            });
            ++maxChildren;
            ++totalCol;
            t[master+totalCol] = arr.Title == null ? "" : arr.Title;
          }else if(master.indexOf("@") == -1){
            ++maxChildren;
            ++totalCol;
            t[master+totalCol] = arr == null ? "" : arr;
          }
        }; 
        for(let result in src){
          t = [];
          totalCol = 0;
          Object.keys(src[result]).map(item=>{
              maxLayer = tempMaxLayer > maxLayer ? tempMaxLayer : maxLayer;
              currentLayer = 1;
              maxChildren = 0;
              flatten(src[result][item],item,0);
              !maxLayerSet ? attributeLayer.push(maxChildren) : true;
          });
          maxLayerSet = true;
          flattenResult.push(t);
        }
        
        return [flattenResult,attributeLayer];
    }

    function styleArray(ws,col,row,src,maxLayer){
        let lineBreakColumn = [];
        //set header
        if(src.length > 0){
                Object.keys(src[0]).map((item, index)=>{
          if(item.indexOf("CheckList") == -1){
            
          lineBreakColumnIndex = String.fromCharCode(97 + index).toUpperCase();
          lineBreakColumn.push(String.fromCharCode(97 + index).toUpperCase());
          var cell = "";
          if(col>=26){
            cell = String.fromCharCode(97 + 0).toUpperCase() + String.fromCharCode(97 + col - 26).toUpperCase();
          }else{
            cell = String.fromCharCode(97 + col).toUpperCase();
          }
          if(maxLayer[index] > 1){ //hv children
            //ws["!merges"].push({s:{r:row,c:col},e:{r:row,c:col+maxLayer[index]-1}}); //horizontally merge
            ws[cell + (row+2)] = {t:"s",v:item};
            for(let i = 0; i < maxLayer[index]; ++i){
              if(col >= 26){
              ws[String.fromCharCode(97 + 0).toUpperCase() + String.fromCharCode(97 + col - 26  + i).toUpperCase() + (row+1)].s = {font:{bold: true}, alignment: { wrapText: true, vertical: 'center', horizontal: 'center' }};
              ws[String.fromCharCode(97 + 0).toUpperCase() + String.fromCharCode(97 + col - 26  + i).toUpperCase() + (row+2)] = {t:"s",v:Object.keys(src[0][item])[i]};
              //ws[String.fromCharCode(97 + 0).toUpperCase() + String.fromCharCode(97 + col - 26  + i).toUpperCase() + (row+2)].s = {font:{bold: true},alignment: { wrapText: true, vertical: 'center', horizontal: 'center' }, border: { top: { style: 'thick', color: { rgb: "000000"}}, left: { style: 'thick', color: { rgb: "000000"}}, bottom: { style: 'thick', color: { rgb: "000000"}}, right: { style: 'thick', color: { rgb: "000000"}}}};
              }else{
              ws[String.fromCharCode(97 + col + i).toUpperCase() + (row+1)].s = {font:{bold: true,sz:11},alignment: { wrapText: true, vertical: 'center', horizontal: 'center'}};
              ws[String.fromCharCode(97 + col + i).toUpperCase() + (row+2)] = {t:"s",v:Object.keys(src[0][item])[i]};
              //ws[String.fromCharCode(97 + col + i).toUpperCase() + (row+2)].s = {font:{bold: true,sz:11},alignment: { wrapText: true, vertical: 'center', horizontal: 'center' }, border: { top: { style: 'thick', color: { rgb: "000000"}}, left: { style: 'thick', color: { rgb: "000000"}}, bottom: { style: 'thick', color: { rgb: "000000"}}, right: { style: 'thick', color: { rgb: "000000"}}}};
              }
              
            }
            col += maxLayer[index];
            }else{
            //ws["!merges"].push({s:{r:row,c:col},e:{r:row+1,c:col}}); //only vertically merge
            ws[String.fromCharCode(97 + col).toUpperCase() + (row+1)] = {t:"s",v:item};
            //ws[String.fromCharCode(97 + col).toUpperCase() + (row+2)] = {t:"s",v:item};
            ws[String.fromCharCode(97 + col).toUpperCase() + (row+1)].s = {font:{bold: true,sz:11},alignment: { wrapText: true, vertical: 'center', horizontal: 'center' },border: { top: { style: 'thick', color: { rgb: "000000"}}, left: { style: 'thick', color: { rgb: "000000"}}, bottom: { style: 'thick', color: { rgb: "000000"}}, right: { style: 'thick', color: { rgb: "000000"}}}};
            //ws[String.fromCharCode(97 + col).toUpperCase() + (row+2)].s = {font:{bold: true,sz:11},alignment: { wrapText: true, vertical: 'center', horizontal: 'center' },border: { top: { style: 'thick', color: { rgb: "000000"}}, left: { style: 'thick', color: { rgb: "000000"}}, bottom: { style: 'thick', color: { rgb: "000000"}}, right: { style: 'thick', color: { rgb: "000000"}}}};
            col += maxLayer[index];
            }
        }
        
          });
        }
        let wscols = [];
        for(let i = 0;i < col;++i){
          if(lineBreakColumn.indexOf(String.fromCharCode(97 + i).toUpperCase()) != -1){
            wscols.push({wpx:350});
          }else{
            wscols.push({wpx:350});
          }
        }
        ws['!cols'] = wscols;
        var wsrows =  [
          {hpt: 50}, 
          {hpt: 15}
        ];
        ws['!rows'] = wsrows; // ws - worksheet
        return ws;
      }
    
      function convertMessageWithLineBreak(ws){
        Object.keys(ws).map(item=>{
          if(item.indexOf("!") == -1 && item.indexOf(lineBreakColumnIndex) != -1){
            if(ws[item]["s"] == undefined){
              ws[item]["s"] = {alignment: { wrapText: true}};
            }
          }
        });
        return ws;
      }
    return (
        <div>
            <div className="row mb-3">
                <div className="col">
                    <h6 style={{ fontWeight: 600 }}>報告 &gt; 個案概要 &gt; 外界人士意外</h6>
                </div>
            </div>
            <div className="row">
                <div className="col-2" >
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
                <div className="col-4" >
                    <div className="mb-3" style={{ fontWeight: 600 }}>
                        服務單位
                    </div>
                    {/* <div className="" style={{ overflowY: "scroll", border: "1px solid gray", height: 100 }}>

                    </div> */}
                    <select multiple className="form-control" onChange={(event) => {
                        const selectedOptions = multipleOptionsSelectParser(event);
                        setSelectedOptions(selectedOptions);
                    }}>
                        <option value="ALL">--- 所有 ---</option>
                        {
                            serviceLocation.map((item) => {
                                return <option value={item.su_Eng_name_display}>{item.su_name_tc}</option>
                            })
                        }
                    </select>
                </div>
                <div className="col-4" >
                    <div className="mb-3" style={{ fontWeight: 600 }}>
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
                <div className="mb-3" style={{ fontSize: "1.05rem", fontWeight: 600 }} >
                    關鍵字
                </div>
                <div className="row">
                    <div className="col-10">
                        <input className="form-control" placeholder="(可搜尋：事主姓名 / 檔案編號 / 保險公司備案編號)" onChange={inputFieldHandler}/>
                    </div>
                    <div className="col">
                        <button type="button" className="btn btn-primary" onClick={() => filter()}  >搜尋</button>
                    </div>
                    <div className="col">
                        <button type="button" className="btn btn-success" onClick={() => exportExcel()} >Excel</button>
                    </div>
                </div>
            </div>
            <div>
                <div className="mb-1" style={{ fontSize: "1.05rem", fontWeight: 600 }}>
                    搜尋結果 [{`${displayData.length} 筆記錄`}]
                </div>
                <BootstrapTable boot keyField='id' data={displayData || []} columns={columns(context)} pagination={paginationFactory()} bootstrap4={true} />
            </div>
        </div>
    )
}

export default OutsiderAccidentCaseSummary

const columns = (context) => {
    const path = context.pageContext.site.absoluteUrl + `/accident-and-incident/SitePages/`;
    return [
        {
            dataField: 'ID',
            text: 'ID',
            hidden: true
        },
        {
            dataField: 'ServiceLocationTC',
            text: '服務單位',
            sort: true,
            headerStyle: {width: '100px'}
        },
        {
            dataField: 'AccidentTime',
            text: '意外發生日期及時間',
            sort: true,
            headerStyle: {width: '180px'},
            formatter: dateFormatter.bind(this)
        },
        {
            dataField: 'ServiceUserGender',
            text: '性別',
            sort: true,
            headerStyle: {width: '80px'},
            formatter: genderFormatter.bind(this)
        },
        {
            dataField: 'ServiceUserAge',
            text: '年齡',
            sort: true,
            headerStyle: {width: '80px'}
        },
        {
            dataField: 'AccidentLocation',
            text: '意外發生地點',
            sort: true,
            headerStyle: {width: '130px'}
        },{
            dataField: 'AccidentNature',
            text: '意外性質',
            sort: true,
            headerStyle: {width: '300px'},
            formatter: accidentNatureFormatter.bind(this)
        },
        {
            dataField: 'AccidentDetail',
            text: '意外詳情',
            sort: true,
            headerStyle: {width: '300px'},
            formatter: accidentDetailFormatter.bind(this)
        },
        {
            dataField: 'AccidentCauseFactor',
            text: '成因',
            sort: true,
            headerStyle: {width: '300px'},
            formatter: accidentCauseFactorFormatter.bind(this)
        },
        {
            dataField: 'Suggestion',
            text: '跟進工作及報告建議',
            sort: true,
            headerStyle: {width: '300px'},
            formatter: suggestionFactorFormatter.bind(this)
        }
    ]
};

function genderFormatter(cell, rowIndex) {
    let div = [];
    if (cell == 'male') {
        div.push(<div>男</div>);
    } else if (cell == 'female') {
        div.push(<div>女</div>);
    }
    return div;
}

function dateFormatter(cell,rowIndex){
    let div = [];
    if (cell != undefined && cell != null) {
        div.push(<div >{moment(cell.IncidentTime).format("YYYY-MM-DD hh:mm")}</div>);
        //div.push(<div >{new Date(cell).getFullYear() + `-` +(`0`+(new Date(cell).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(cell).getDate()).slice(-2) + ` ` + (`0`+new Date(cell).getHours()).slice(-2) + `:` + + (`0`+new Date(cell).getMinutes()).slice(-2)}</div>);
    }
    return div;
}

function accidentNatureFormatter(cell,rowIndex){
    let div = [];
    
    if (rowIndex.AccidentReportForm != undefined && rowIndex.AccidentReportForm.length > 0) {
        if (rowIndex.AccidentReportForm[0].AccidentNatureFall) {
            div.push(<div>跌倒</div>);
        }
        if (rowIndex.AccidentReportForm[0].AccidentNatureChok) {
            div.push(<div>哽塞</div>);
        }
        if (rowIndex.AccidentReportForm[0].AccidentNatureBehavior) {
            div.push(<div>服務使用者行為問題</div>);
        }
        if (rowIndex.AccidentReportForm[0].AccidentNatureEnvFactor) {
            div.push(<div>環境因素</div>);
        }
        if (rowIndex.AccidentReportForm[0].AccidentNatureOther) {
            div.push(<div>{rowIndex.AccidentReportForm[0].AccidentNatureOtherRemark}</div>);
        }
    }
    return div;
}

function accidentDetailFormatter(cell,rowIndex){
    let div = [];
    if (rowIndex.AccidentReportForm != undefined && rowIndex.AccidentReportForm.length > 0) {
        if (rowIndex.AccidentReportForm[0].AccidentalDiscovery != null) {
            div.push(<div>{rowIndex.AccidentReportForm[0].AccidentalDiscovery}</div>);
        }
    }
    return div;
}
function accidentCauseFactorFormatter(cell,rowIndex){
    let div = [];
    if (rowIndex.AccidentReportForm != undefined && rowIndex.AccidentReportForm.length > 0) {
        if (rowIndex.AccidentReportForm[0].AccidentCauseFactor != null) {
            div.push(<div>{rowIndex.AccidentReportForm[0].AccidentCauseFactor}</div>);
        }
    }
    return div;
}

function suggestionFactorFormatter(cell,rowIndex){
    let div = [];
    if (rowIndex.AccidentReportForm != undefined && rowIndex.AccidentReportForm.length > 0) {
        if (rowIndex.AccidentReportForm[0].Suggestion != null) {
            div.push(<div>{rowIndex.AccidentReportForm[0].Suggestion}</div>);
        }
    }
    return div;
}