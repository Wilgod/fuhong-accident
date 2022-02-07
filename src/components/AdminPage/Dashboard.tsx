import * as React from 'react'
import { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import useServiceUnit2 from '../../hooks/useServiceUser2';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import * as moment from 'moment';
import {getAllServiceUserAccident, getAllAccidentReportForm,  getAllAccidentFollowUpForm} from '../../api/FetchFuHongList';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as fontawesome from '@fortawesome/free-solid-svg-icons';

interface IDashboard {
    item: any;
    index:number;
}

export default function Dashboard({ item,index }: IDashboard) {
    const column = [
        {
            dataField: 'ID',
            text: 'ID',
            hidden: true
        },
        {
            dataField: 'CaseNumber',
            text: '服務單位',
        },
        {
            dataField: 'Status',
            text: '狀態',
        },
        {
            dataField: 'SM',
            text: '高級服務經理姓名',
            formatter: smFormatter.bind(this)
        },
        {
            dataField: 'SD',
            text: '服務總監姓名',
            formatter: sdFormatter.bind(this)
        }
        ,
        {
            dataField: 'SPT',
            text: '高級物理治療師姓名',
            formatter: sptFormatter.bind(this)
        }
    ]

    function smFormatter(cell,rowIndex){
        //debugger;
		let div = [];
		div.push(<div >{cell.Title}</div>
		);
        return div;
    }

    function sdFormatter(cell,rowIndex){
        //debugger;
		let div = [];
		div.push(<div >{cell.Title}</div>
		);
        return div;
    }

    function sptFormatter(cell,rowIndex){
        //debugger;
		let div = [];
		div.push(<div >{cell.Title}</div>
		);
        return div;
    }

    const [selectedItem, setSelectedItem] = useState([]);
    const [groupByServiceUserList, setGroupByServiceUserUnitList] = useState({key: '', child:[], display: false, groupby: ''});

    useEffect(() => {
        setGroupByServiceUserUnitList(item);
    }, []);
    
    const handleOnSelect = (row, isSelect) => {
        let newSelectedItem = [...selectedItem];
        if (isSelect) {
            newSelectedItem.push(row.ID);
            setSelectedItem(newSelectedItem);
        } else {
            newSelectedItem = newSelectedItem.filter(function(elem){
                return elem != row.ID; 
             });
            let selected = newSelectedItem.filter(x => x !== row.ID)
            setSelectedItem(selected);
        }
    }
    const selectRow = {
        mode: 'checkbox',
        clickToSelect: true,
        clickToEdit: true,
        clickToExpand: true,
        selected: selectedItem,
        onSelect: handleOnSelect
    };


    const showGroupByPositionSMUser = (item,index) => {
        let display = item.display;
        let newArr = {...groupByServiceUserList}; // copying the old datas array
        newArr['display'] = !display;
        setGroupByServiceUserUnitList(newArr);
    }

    return (
        <div>

            <div>
                <div style={{cursor:'pointer'}} className="col-sm-12" onClick={() => showGroupByPositionSMUser(groupByServiceUserList,index)}>
                {!groupByServiceUserList.display && <span><span style={{paddingRight:'5px', paddingLeft:'80px'}}><FontAwesomeIcon icon={fontawesome["faChevronRight"]} color="black" size="1x"/></span><span>{groupByServiceUserList['key']}&nbsp;</span></span>}
                {groupByServiceUserList.display && <span><span style={{paddingRight:'5px', paddingLeft:'80px'}}><FontAwesomeIcon icon={fontawesome["faChevronDown"]} color="black" size="1x"/></span><span>{groupByServiceUserList['key']}&nbsp;</span></span>}
                ({groupByServiceUserList.child.length})
                </div>
            </div>
            {groupByServiceUserList.display &&
            <BootstrapTable boot keyField='ID' data={groupByServiceUserList.child} columns={column} selectRow={selectRow} bootstrap4={true} />
            }
        </div>
    )
}