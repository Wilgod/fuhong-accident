import * as React from 'react'
import { useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import useServiceUnit from '../../hooks/useServiceUnits';
import { IMainTableComponentProps } from './IMainTableComponent';
import * as moment from 'moment';
import { caseNumberToFormNameParser, caseNumberToSitePageParser } from '../../utils/FormNameUtils';
import useFetchAllForms from '../../hooks/useFetchAllForms';
import { IUser } from '../../interface/IUser';
import { getQueryParameterString } from './../../utils/UrlQueryHelper';
export default function MainTableComponent({ context, dateRange, searchExpired, searchFormStatus, searchFormType, searchServiceUnit, searchKeyword, adminPermissionBoolean, serviceUnitList,permissionList, siteCollectionUrl, screenType }: IMainTableComponentProps) {
    const type: string = getQueryParameterString("type");
    const CURRENT_USER: IUser = {
        email: context.pageContext.legacyPageContext.userEmail,
        name: context.pageContext.legacyPageContext.userDisplayName,
        id: context.pageContext.legacyPageContext.userId,
    }

    const [iframeLink, setIframeLink] = useState('');
    const [data] = useFetchAllForms(CURRENT_USER.id, serviceUnitList, screenType, {
        startDate: dateRange.start,
        endDate: dateRange.end,
        expired: searchExpired,
        formStatus: searchFormStatus,
        formTypes: searchFormType,
        serviceUnits: searchServiceUnit,
        keyword: searchKeyword,
        adminPermissionBoolean:adminPermissionBoolean,
        permissionList:permissionList
    }, siteCollectionUrl);
    // const [data, setStartDate, setEndDate, setSearchServiceUnit, setSearchFormTypes, setSearchFormStatus, setSearchExpired] = useFetchAllForms(CURRENT_USER.id);

    console.log("iframeLink", iframeLink)

    return (
        <div>
            {iframeLink == "" &&
            <>
                <div className="mb-1" style={{ fontSize: "1.05rem", fontWeight: 600 }}>
                    搜尋結果 [{`${data.length} 筆記錄`}]
                </div>
                <BootstrapTable boot keyField='id' data={data || []} columns={columns(context, type, setIframeLink)} pagination={paginationFactory()} bootstrap4={true}/>
            </>
            }
            {iframeLink != "" &&
            <>
                <button onClick={() => setIframeLink("")} className="btn btn-primary">上一頁</button>
                <iframe src={iframeLink} width={'100%'} height={'1100px'} frameBorder="0"></iframe>
                <button className="btn btn-warning" onClick={() => setIframeLink("")}>返回</button>
            </>
            }
        </div>
    )
}

const openPage = (type, formLink, setIframeLink) => {
    if (type == 'cms') {
        setIframeLink(formLink)
    } else {
        window.open(formLink, "_self")
    }
    
}
const columns = (context, type, setIframeLink) => {
    const path = context.pageContext.site.absoluteUrl + `/accident-and-incident/SitePages/`;
    return [
        {
            dataField: 'CaseNumber',
            text: '檔案編號',
            sort: true,
            headerStyle: {width:'150px'}
        },
        {
            dataField: 'AccidentTime',
            text: '發生日期',
            headerStyle: {width:'100px'},
            formatter: (value, data) => {
                let date = value;
                if (data.AccidentTime) {
                    date = data.AccidentTime;
                } else {
                    date = data.IncidentTime;
                }
                return <div>{moment(new Date(date)).format("YYYY-MM-DD")}</div>
            },
            sort: true,
            sortFunc: (a, b, order, dataField, rowA, rowB) => {
                let aTime = new Date().getTime();
                let bTime = new Date().getTime();

                if (rowA.AccidentTime) {
                    aTime = new Date(rowA.AccidentTime).getTime();
                } else {
                    aTime = new Date(rowA.IncidentTime).getTime();
                }


                if (rowB.AccidentTime) {
                    bTime = new Date(rowB.AccidentTime).getTime();
                } else {
                    bTime = new Date(rowB.IncidentTime).getTime();
                }

                if (order === 'asc') {
                    return bTime - aTime;
                }
                return aTime - bTime; // desc
            }
        },
        {
            dataField: 'ServiceLocationTC',
            text: '服務單位',
            sort: true,
            headerStyle: {width:'150px'}
        },
        {
            dataField: 'CaseNumber',
            text: '意外/事故',
            sort: true,
            headerStyle: {width:'130px'},
            formatter: (value, data) => {
                if (value) {
                    const [caseType] = value.split("-");
                    return caseNumberToFormNameParser(caseType);
                }
            }
        },
        {
            dataField: 'StatusTC',
            text: '狀態',
            headerStyle: {width:'180px'},
            sort: true
        },
        {
            dataField: 'Modified',
            text: '最後更新報告',
            headerStyle: {width:'130px'},
            formatter: (value, data) => {
                return <div> {moment(new Date(value)).format("YYYY-MM-DD")}</div>
            },
            sort: true,
            sortFunc: (a, b, order, dataField, rowA, rowB) => {
                let aTime = new Date(rowA.Modified).getTime();
                let bTime = new Date(rowB.Modified).getTime();


                if (order === 'asc') {
                    return bTime - aTime;
                }
                return aTime - bTime; // desc
            }
        },
        {
            dataField: 'NextDeadline',
            text: '下個報告到期日',
            headerStyle: {width:'140px'},
            formatter: (value, data) => {
                if (data && (data.Status === "CLOSED" || data.Status === "DRAFT")) {
                    return <div>沒有</div>
                } else {
                    return <div>{moment(new Date(value)).format("YYYY-MM-DD")}</div>
                }
            },
            sort: true,
            sortFunc: (a, b, order, dataField, rowA, rowB) => {
                let aTime = new Date(rowA.NextDeadline || new Date().getTime()).getTime();
                let bTime = new Date(rowB.NextDeadline || new Date().getTime()).getTime();

                if (rowA.Status === "CLOSED") {
                    aTime = new Date(new Date().setFullYear(1970)).getTime();
                }

                if (rowA.Status === "CLOSED") {
                    bTime = new Date(new Date().setFullYear(1970)).getTime();
                }


                if (order === 'asc') {
                    return bTime - aTime;
                }
                return aTime - bTime; // desc
            }
        },
        {
            dataField: 'Id',
            text: '[按鈕]',
            headerStyle: {width:'100px'},
            formatter: (value, data) => {
                let formLink = "";
                if (data && data.CaseNumber) {
                    const [caseType] = data.CaseNumber.split("-");
                    //formLink = path + caseNumberToSitePageParser(caseType) + `?formId=${value}`;
                    let navPage = caseNumberToSitePageParser(caseType)
                    if (type == 'cms') {
                        formLink = path +`Home.aspx?formId=${value}&navScreen=${navPage}&type=cms`;
                    } else {
                        formLink = path +`Home.aspx?formId=${value}&navScreen=${navPage}`;
                    }
                    
                } else if (data && data.Title) {
                    //formLink = path + caseNumberToSitePageParser(data.Title.toUpperCase()) + `?formId=${value}`;
                    let navPage = caseNumberToSitePageParser(data.Title.toUpperCase());
                    if (type == 'cms') {
                        formLink = path +`Home.aspx?formId=${value}&navScreen=${navPage}&type=cms`;
                    } else {
                        formLink = path +`Home.aspx?formId=${value}&navScreen=${navPage}`;
                    }
                } else {
                    return null;
                }

                return <div className="d-flex justify-content-center">
                    <button className="btn btn-sm btn-primary" onClick={() => openPage(type, formLink, setIframeLink) } disabled={value === null}>
                        檢視
                    </button>
                </div>
            }
        }
    ]
};