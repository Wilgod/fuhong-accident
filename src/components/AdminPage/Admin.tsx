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
import Dashboard from './Dashboard';
interface IAdmin {
    context: WebPartContext;
    siteCollectionUrl:string;
}



export default function Admin({ context,siteCollectionUrl }: IAdmin) {
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
    const [serviceUserAccident, setServiceUserAccident] = useState([]);
    const [accidentReportForm, setAccidentReportForm] = useState([]);
    const [accidentFollowUpForm, setAccidentFollowUpForm] = useState([]);
    const [groupByServiceUserList, setGroupByServiceUserUnitList] = useState([]);
    const [groupByPositionList, setGroupByPositionList] = useState([]);
    

    function smFormatter(cell,rowIndex){
        //debugger;
		let div = [];
        if (cell != undefined) {
            div.push(<div >{cell.Title}</div>);
        }
		
        return div;
    }

    function sdFormatter(cell,rowIndex){
        //debugger;
		let div = [];
        if (cell != undefined) {
            div.push(<div >{cell.Title}</div>);
        }
        return div;
    }

    function sptFormatter(cell,rowIndex){
        //debugger;
		let div = [];
        if (cell != undefined) {
            div.push(<div >{cell.Title}</div>);
        }
        return div;
    }

    function groupByServiceUnit() {
        let groupBy = [];
        serviceUserAccident.map(function(item) {
            console.log('CaseNumber', item['CaseNumber'])
			let addItem = true;
			for(let groupItem of groupBy) {
				if (groupItem.key == item['ServiceUserUnit']) {
					addItem = false;
				}
			}
			if (addItem) {
				groupBy.push({key:item['ServiceUserUnit'], child:[item], display:false, displaySD:false, displaySM:false, displaySPT:false, groupby:'ServiceUserUnit'});
			} else {
				for(let i=0; i< groupBy.length; i++) {
					if (groupBy[i].key == item['ServiceUserUnit']) {
						groupBy[i].child.push(item);
					}
				}
			}
		  
        });
        return groupBy;
    }
    function groupByPosition(list, position) {
        let groupBy = [];
        list.map(function(item) {
            if (position == 'CurrentSM') {
                if (item.Stage =='1') {
                    if (item.Status !='DRAFT' && item.Status !='PENDING_SM_APPROVE') {
                        return; 
                    }
                } else if (item.Stage =='2') {
                    debugger
                    if (item.Status !='PENDING_SM_FILL_IN' && item.Status !='PENDING_INVESTIGATE') {
                        return; 
                    }
                } else if (item.Stage =='3') {
                    if (item.Status !='PENDING_SM_FILL_IN') {
                        return;
                    }
                }
            } else if (position == 'CurrentSD') {
                if (item.Stage =='1') {
                    if (item.Status !='DRAFT' && item.Status !='PENDING_SM_APPROVE') {
                        return; 
                    }
                } else if (item.Stage =='2') {
                    return;
                }
            } else if (position == 'CurrentSPT') {
                if (item.Stage =='1') {
                    if (item.Status !='DRAFT' && item.Status !='PENDING_SM_APPROVE') {
                        return; 
                    }
                } else if (item.Stage =='2') {
                    return;
                }
            }
            
			let addItem = true;
			for(let groupItem of groupBy) {
				if (groupItem.key == item[position].Title) {
					addItem = false;
				}
			}
			if (addItem) {
				groupBy.push({key:item[position].Title, child:[item], display:false, groupby:position});
			} else {
				for(let i=0; i< groupBy.length; i++) {
					if (groupBy[i].key == item[position].Title) {
						groupBy[i].child.push(item);
					}
				}
			}
		  
        })
        return groupBy;
    }

    const showGroupBy = (item,index) => {
        let display = item.display;
        let newArr = [...groupByServiceUserList]; // copying the old datas array
        newArr[index].display = !display;

        setGroupByServiceUserUnitList(newArr);
    }
    const showGroupBySD = (item,index) => {
        let display = item.displaySD;
        let newArr = [...groupByServiceUserList]; // copying the old datas array
        newArr[index].displaySD = !display;

        setGroupByServiceUserUnitList(newArr);
    }
    const showGroupBySM = (item,index) => {
        let display = item.displaySM;
        let newArr = [...groupByServiceUserList]; // copying the old datas array
        newArr[index].displaySM = !display;

        setGroupByServiceUserUnitList(newArr);
    }
    const showGroupBySPT = (item,index) => {
        let display = item.displaySPT;
        let newArr = [...groupByServiceUserList]; // copying the old datas array
        newArr[index].displaySPT = !display;

        setGroupByServiceUserUnitList(newArr);
    }


    const showGroupByPositionSDUser = (item,index,index1) => {
        let display = item.display;
        let newArr = [...groupByServiceUserList]; // copying the old datas array
        newArr[index].childSD[index1].display = !display;
        setGroupByServiceUserUnitList(newArr);
    }
    const showGroupByPositionSMUser = (item,index,index1) => {
        let display = item.display;
        let newArr = [...groupByServiceUserList]; // copying the old datas array
        newArr[index].childSM[index1].display = !display;
        setGroupByServiceUserUnitList(newArr);
    }
    const showGroupByPositionSPTUser = (item,index,index1) => {
        let display = item.display;
        let newArr = [...groupByServiceUserList]; // copying the old datas array
        newArr[index].childSPT[index1].display = !display;
        setGroupByServiceUserUnitList(newArr);
    }

    async function getAllData() {
        let allServiceUserAccident = await getAllServiceUserAccident();
        let allAccidentReportForm = await getAllAccidentReportForm();
        let allAccidentFollowUpForm = await getAllAccidentFollowUpForm();
        for (let sa of allServiceUserAccident) {
            console.log('All CaseNumber', sa['CaseNumber'])
            let getARF = allAccidentReportForm.filter(item => {return item.CaseNumber == sa.CaseNumber && item.ParentFormId == sa.ID});
            let getAFUF = allAccidentFollowUpForm.filter(item => {return item.CaseNumber == sa.CaseNumber && item.ParentFormId == sa.ID});
            sa['AccidentReportForm'] = getARF;
            sa['AccidentFollowUpForm'] = getAFUF;
            if (sa['Stage'] == '1') {
                sa['Form'] = '服務使用者意外填報表(一)';
                sa['CurrentSM'] = sa['SM'];
                sa['CurrentSD'] = sa['SD'];
                sa['CurrentSPT'] = sa['SPT'];
            } else if (sa['Stage'] == '2') {
                sa['Form'] = '服務使用者意外報告(二)';
                sa['CurrentSM'] = getARF.length > 0 ? getARF[0]['SM'] : null;
                sa['CurrentSD'] = getARF.length > 0 ? getARF[0]['SD'] : null;
                sa['CurrentSPT'] = getARF.length > 0 ? getARF[0]['SPT'] : null;
            } else if (sa['Stage'] == '3') {
                sa['Form'] = '意外跟進/結束表(三)';
                sa['CurrentSM'] = getAFUF.length > 0 ? getAFUF[0]['SM'] : null;
                sa['CurrentSD'] = getAFUF.length > 0 ? getAFUF[0]['SD'] : null;
                sa['CurrentSPT'] = getAFUF.length > 0 ? getAFUF[0]['SPT'] : null;
            }
        }
        //setGroupBy1List(allServiceUserAccident);
        setServiceUserAccident(allServiceUserAccident);
        
    }
    useEffect(() => {
        getAllData()
    }, []);

   
    useEffect(() => {
        if (Array.isArray(serviceUserAccident) && serviceUserAccident.length > 0) {
            let groupByList = groupByServiceUnit();
            for (let i=0; i<groupByList.length; i++) {
                groupByList[i].childSM = groupByPosition(groupByList[i].child, 'CurrentSM');
                groupByList[i].childSD = groupByPosition(groupByList[i].child, 'CurrentSD');
                groupByList[i].childSPT = groupByPosition(groupByList[i].child, 'CurrentSPT');
            }
            debugger
            setGroupByServiceUserUnitList(groupByList);
        }
        
    }, [serviceUserAccident]);

    console.log('groupByServiceUserList ', groupByServiceUserList)
    /*<BootstrapTable boot keyField='id' data={item.child} columns={column} pagination={paginationFactory()} bootstrap4={true} />*/
    return (
        <div>
            {groupByServiceUserList.map((item, index) => {
                return (
                    <div>
                    <div style={{cursor:'pointer'}} className="col-sm-12" onClick={() => showGroupBy(item,index)}>
							{!item.display && <span><span style={{paddingRight:'5px'}}><FontAwesomeIcon icon={fontawesome["faChevronRight"]} color="black" size="1x"/></span><span>{item['key']}&nbsp;</span></span>}
							{item.display && <span><span style={{paddingRight:'5px'}}><FontAwesomeIcon icon={fontawesome["faChevronDown"]} color="black" size="1x"/></span><span>{item['key']}&nbsp;</span></span>}
							({item.child.length})
					</div>
                    {item.display && 
                     <div>
                        <div style={{cursor:'pointer', paddingLeft:'40px'}} className="col-sm-12" onClick={() => showGroupBySM(item,index)}>
                            {!item.displaySM && <span><span style={{paddingRight:'5px'}}><FontAwesomeIcon icon={fontawesome["faChevronRight"]} color="black" size="1x"/></span><span>高級服務經理&nbsp;</span></span>}
                            {item.displaySM && <span><span style={{paddingRight:'5px'}}><FontAwesomeIcon icon={fontawesome["faChevronDown"]} color="black" size="1x"/></span><span>高級服務經理&nbsp;</span></span>}
					    </div>
                        {item.displaySM && 
                            item.childSM.map((item1, index1) => {
                                debugger
                                return <Dashboard context={context} siteCollectionUrl={siteCollectionUrl} serviceUnit={item['key']} item={item1} index={index1} position={'SM'} getAllData={getAllData}/>
                            })
                        }
                            

                        <div style={{cursor:'pointer', paddingLeft:'40px'}} className="col-sm-12" onClick={() => showGroupBySD(item,index)}>
                            {!item.displaySD && <span><span style={{paddingRight:'5px'}}><FontAwesomeIcon icon={fontawesome["faChevronRight"]} color="black" size="1x"/></span><span>服務總監&nbsp;</span></span>}
                            {item.displaySD && <span><span style={{paddingRight:'5px'}}><FontAwesomeIcon icon={fontawesome["faChevronDown"]} color="black" size="1x"/></span><span>服務總監&nbsp;</span></span>}
					    </div>
                        
                        {item.displaySD && 
                            item.childSD.map((item1, index1) => {
                                debugger
                                return <Dashboard context={context} siteCollectionUrl={siteCollectionUrl} serviceUnit={item['key']} item={item1} index={index1} position={'SD'} getAllData={getAllData}/>
                            })
                            /*item.childSD.map((item1, index1) => {
                                return (
                                    <div style={{paddingLeft:'80px'}}>

                                        <div>
                                            <div style={{cursor:'pointer'}} className="col-sm-12" onClick={() => showGroupByPositionSDUser(item1,index,index1)}>
                                            {!item1.display && <span><span style={{paddingRight:'5px', paddingLeft:'80px'}}><FontAwesomeIcon icon={fontawesome["faChevronRight"]} color="black" size="1x"/></span><span>{item1['key']}&nbsp;</span></span>}
                                            {item1.display && <span><span style={{paddingRight:'5px', paddingLeft:'80px'}}><FontAwesomeIcon icon={fontawesome["faChevronDown"]} color="black" size="1x"/></span><span>{item1['key']}&nbsp;</span></span>}
                                            ({item1.child.length})
                                            </div>
                                        </div>
                                        {item1.display &&
                                        <BootstrapTable boot keyField='id' data={item1.child} columns={column} pagination={paginationFactory()} bootstrap4={true} />
                                        }
                                    </div>
                                )
                            })*/
                        }

                        <div style={{cursor:'pointer', paddingLeft:'40px'}} className="col-sm-12" onClick={() => showGroupBySPT(item,index)}>
                            {!item.displaySPT && <span><span style={{paddingRight:'5px'}}><FontAwesomeIcon icon={fontawesome["faChevronRight"]} color="black" size="1x"/></span><span>高級物理治療師&nbsp;</span></span>}
                            {item.displaySPT && <span><span style={{paddingRight:'5px'}}><FontAwesomeIcon icon={fontawesome["faChevronDown"]} color="black" size="1x"/></span><span>高級物理治療師&nbsp;</span></span>}
					    </div>
                        {item.displaySPT && 
                            item.childSPT.map((item1, index1) => {
                                debugger
                                return <Dashboard context={context} siteCollectionUrl={siteCollectionUrl} serviceUnit={item['key']} item={item1} index={index1}  position={'SPT'} getAllData={getAllData}/>
                            })
                            /*item.childSPT.map((item1, index1) => {
                                return (
                                    <div style={{paddingLeft:'80px'}}>

                                        <div>
                                            <div style={{cursor:'pointer'}} className="col-sm-12" onClick={() => showGroupByPositionSPTUser(item1,index,index1)}>
                                            {!item1.display && <span><span style={{paddingRight:'5px', paddingLeft:'80px'}}><FontAwesomeIcon icon={fontawesome["faChevronRight"]} color="black" size="1x"/></span><span>{item1['key']}&nbsp;</span></span>}
                                            {item1.display && <span><span style={{paddingRight:'5px', paddingLeft:'80px'}}><FontAwesomeIcon icon={fontawesome["faChevronDown"]} color="black" size="1x"/></span><span>{item1['key']}&nbsp;</span></span>}
                                            ({item1.child.length})
                                            </div>
                                        </div>
                                        {item1.display &&
                                        <BootstrapTable boot keyField='id' data={item1.child} columns={column} pagination={paginationFactory()} bootstrap4={true} />
                                        }
                                    </div>
                                )
                            })*/
                        }
                         
                    </div>
                    }
                    </div>
            )}
            )}          
        </div>
    );
}

