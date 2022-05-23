import * as React from 'react'
import { useEffect, useState } from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { ITodoListComponentProps } from './ITodoListComponent';
import { caseNumberToFormNameParser, caseNumberToSitePageParser } from '../../utils/FormNameUtils';
import * as moment from 'moment';
import { IUser } from '../../interface/IUser';
import useFetchUserJob from '../../hooks/useFetchUserJob';

const options = {
    paginationSize: 4,
    pageStartIndex: 1,
    // alwaysShowAllBtns: true, // Always show next and previous button
    // withFirstAndLast: false, // Hide the going to First and Last page button
    //hideSizePerPage: true, // Hide the sizePerPage dropdown always
    hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
    firstPageText: 'First',
    prePageText: 'Back',
    nextPageText: 'Next',
    lastPageText: 'Last',
    nextPageTitle: 'First page',
    prePageTitle: 'Pre page',
    firstPageTitle: 'Next page',
    lastPageTitle: 'Last page',
    showTotal: true,
    sizePerPageList: [{
        text: '5', value: 5
        },{
        text: '10', value: 20
        }, {
        text: '20', value: 20
        }, {
        text: '50', value: 50
        }, {
        text: '100', value: 100
    }]
}

export default function TodoListComponent({ context, permissionList }: ITodoListComponentProps) {
    const CURRENT_USER: IUser = {
        email: context.pageContext.legacyPageContext.userEmail,
        name: context.pageContext.legacyPageContext.userDisplayName,
        id: context.pageContext.legacyPageContext.userId,
    }
    let siteCollectionName = context.pageContext.web.absoluteUrl.substring(context.pageContext.web.absoluteUrl.indexOf("/sites/") + 7, context.pageContext.web.absoluteUrl.length).substring(0, 14);
	let siteCollecitonOrigin = context.pageContext.web.absoluteUrl.indexOf("/sites/") > -1 ? context.pageContext.web.absoluteUrl.substring(0, context.pageContext.web.absoluteUrl.indexOf("/sites/")) : context.pageContext.web.absoluteUrl.substring(0, context.pageContext.web.absoluteUrl.indexOf(".com" + 4));
	let siteCollectionUrl = context.pageContext.web.absoluteUrl.indexOf("/sites/") > -1 ? siteCollecitonOrigin + "/sites/" + siteCollectionName : siteCollecitonOrigin;
	
    const [data] = useFetchUserJob(CURRENT_USER.id, permissionList,siteCollectionUrl);

    console.log('data',data);
    return (
        <div>
            <div className="mb-1" style={{ fontSize: "1.05rem", fontWeight: 600 }}>
                待辦事項
            </div>
            <BootstrapTable boot keyField='id' data={data || []} columns={columns(context)} pagination={paginationFactory(options)} bootstrap4={true} />
        </div>
    )
}

const columns = (context) => {
    const path = context.pageContext.site.absoluteUrl + `/accident-and-incident/SitePages/`;
    return [
        {
            dataField: 'CaseNumber',
            text: '意外/事故',
            sort: true,
            headerStyle: {width:'130px'},
            formatter: (value, data) => {
                if (value) {
                    const [caseType] = value.split("-");
                    return caseNumberToFormNameParser(caseType);
                } else if (data && data.Title) {
                    return caseNumberToFormNameParser(data.Title);
                }
            }
        },
        {
            dataField: 'CaseNumber',
            text: '案件編號',
            headerStyle: {width:'150px'},
            sort: true
        },
        {
            dataField: 'ServiceLocationTC',
            text: '服務單位',
            headerStyle: {width:'150px'},
            sort: true
        },
        {
            dataField: 'ServiceUserNameCN',
            text: '姓名',
            headerStyle: {width:'100px'},
            sort: true
        },
        {
            dataField: 'AccidentTime',
            text: '發生日期',
            headerStyle: {width:'120px'},
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
            dataField: 'StatusTC',
            text: '狀態',
            headerStyle: {width:'180px'},
            sort: true
        },
        {
            dataField: 'Id',
            text: '[按鈕]',
            headerStyle: {width:'100px'},
            formatter: (value, data) => {
                let formLink = "";
                if (data && data.CaseNumber) {
                    const [caseType] = data.CaseNumber.split("-");
                    formLink = path + caseNumberToSitePageParser(caseType) + `?formId=${value}`;
                } else if (data && data.Title) {
                    formLink = path + caseNumberToSitePageParser(data.Title.toUpperCase()) + `?formId=${value}`;
                } else {
                    return null;
                }

                return <div className="d-flex justify-content-center">
                    <button className="btn btn-sm btn-primary" onClick={() => window.open(formLink, "_blank")} disabled={value === null}>
                        檢視
                    </button>
                </div>
            }
        }
    ]
};

