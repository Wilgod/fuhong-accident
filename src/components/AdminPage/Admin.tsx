import * as React from 'react'
import { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import useServiceUnit2 from '../../hooks/useServiceUser2';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import * as moment from 'moment';
import {getAllServiceUserAccident, getAllAccidentReportForm,  getAllAccidentFollowUpForm} from '../../api/FetchFuHongList';
import { WebPartContext } from '@microsoft/sp-webpart-base';

interface IAdmin {
    context: WebPartContext;
    siteCollectionUrl:string;
}
const initialValue = [{}];



export default function Admin({ context,siteCollectionUrl }: IAdmin) {
    const column = [
        {
            dataField: 'ID',
            text: 'ID',
            hidden: true
        },
        {
            dataField: 'ServiceUserUnit',
            text: '服務單位',
        }
    ]
    const [serviceUserAccident, setServiceUserAccident] = useState([]);
    const [accidentReportForm, setAccidentReportForm] = useState([]);
    const [accidentFollowUpForm, setAccidentFollowUpForm] = useState([]);
    const [groupBySM, setGroupBySM] = useState([]);
    const [groupBy1List, setGroupBy1List] = useState([]);
    useEffect(() => {
        async function getAllData() {
            let allServiceUserAccident = await getAllServiceUserAccident();
            let allAccidentReportForm = await getAllAccidentReportForm();
            let allAccidentFollowUpForm = await getAllAccidentFollowUpForm();
            debugger
            for (let sa of allServiceUserAccident) {
                let getARF = allAccidentReportForm.filter(item => {item.ParentFormId == sa.ID});
                let getAFUF = allAccidentFollowUpForm.filter(item => {item.ParentFormId == sa.ID});
                sa['AccidentReportForm'] = getARF;
                sa['AccidentFollowUpForm'] = getAFUF;
            }
            setServiceUserAccident(allServiceUserAccident);
        }
        getAllData()
    }, []);

   
    useEffect(() => {

		return groupBy1List.reduce(function(acc, item) {

			let addItem = true;
			for(let groupItem of groupBy1List) {
				if (groupItem.key == item['SM']) {
					addItem = false;
				}
			}
			if (addItem) {
				groupBy1List.push({key:item['SM'], child:[item], display:false, groupby:'SM'});
			} else {
				for(let i=0; i< groupBy1List.length; i++) {
					if (groupBy1List[i].key == item['SM']) {
						groupBy1List[i].child.push(item);
					}
				}
			}
		  return setGroupBy1List(groupBy1List);
		}, {});
        
    }, [serviceUserAccident]);

    
    //const [data, setData] = useState(initialValue);
    console.log('groupBy1List ',+ groupBy1List)
    return (
        <div>
            <BootstrapTable boot keyField='id' data={serviceUserAccident} columns={column} pagination={paginationFactory()} bootstrap4={true} />
        </div>
    );
}

