import * as React from 'react'
import { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import useServiceUnit2 from '../../hooks/useServiceUser2';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import * as moment from 'moment';
import {getAllServiceUserAccident, getAllOutsiderAccident, getAllAccidentReportForm,  getAllAccidentFollowUpForm, getAllOtherIncidentReport, getAllSpecialIncidentReportLicense, getAllSpecialIncidentReportAllowance, getAllIncidentFollowUpForm} from '../../api/FetchFuHongList';
import {getUpdateUserWorkflow} from '../../api/FetchFuHongList';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as fontawesome from '@fortawesome/free-solid-svg-icons';
import Dashboard from './Dashboard';
interface IAdmin {
    context: WebPartContext;
    siteCollectionUrl:string;
}



export default function Admin({ context,siteCollectionUrl }: IAdmin) {
    const [serviceUserAccident, setServiceUserAccident] = useState([]);
    const [outsiderAccident, setOutsiderAccident] = useState([]);
    const [otherIncidentReport, setOtherIncidentReport] = useState([]);
    const [specialIncidentReportLicense, setSpecialIncidentReportLicense] = useState([]);
    const [specialIncidentReportAllowance, setSpecialIncidentReportAllowance] = useState([]);
    const [groupServiceUserAccidentByServiceUserList, setGroupServiceUserAccidentByServiceUserList] = useState([]);
    const [groupOutsiderAccidentByServiceUserList, setGroupOutsiderAccidentByServiceUserList] = useState([]);
    const [groupOtherIncidentReportByServiceUserList, setGroupOtherIncidentReportByServiceUserList] = useState([]);
    const [groupSpecialIncidentReportLicenseByServiceUserList, setGroupSpecialIncidentReportLicenseByServiceUserList] = useState([]);
    const [groupSpecialIncidentReportAllowanceByServiceUserList, setGroupSpecialIncidentReportAllowanceByServiceUserList] = useState([]);
    const [updateUserWorkflow, setUpdateUserWorkflow] = useState("");

    function groupByServiceUserAccidentServiceUnit() {
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
				groupBy.push({key:item['ServiceUserUnit'], child:[item], display:false, displaySD:false, displaySM:false, displaySPT:false, displayInv:false, groupby:'ServiceUserUnit'});
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

    function groupByOutsiderAccidentServiceUnit() {
        let groupBy = [];
        outsiderAccident.map(function(item) {
            console.log('CaseNumber', item['CaseNumber'])
			let addItem = true;
			for(let groupItem of groupBy) {
				if (groupItem.key == item['ServiceLocation']) {
					addItem = false;
				}
			}
			if (addItem) {
				groupBy.push({key:item['ServiceLocation'], child:[item], display:false, displaySD:false, displaySM:false, displaySPT:false, displayInv:false, groupby:'ServiceUserUnit'});
			} else {
				for(let i=0; i< groupBy.length; i++) {
					if (groupBy[i].key == item['ServiceLocation']) {
						groupBy[i].child.push(item);
					}
				}
			}
		  
        });
        return groupBy;
    }

    function groupByOtherIncidentReportServiceUnit() {
        let groupBy = [];
        otherIncidentReport.map(function(item) {
            console.log('CaseNumber', item['CaseNumber'])
			let addItem = true;
			for(let groupItem of groupBy) {
				if (groupItem.key == item['ServiceLocation']) {
					addItem = false;
				}
			}
			if (addItem) {
				groupBy.push({key:item['ServiceLocation'], child:[item], display:false, displaySD:false, displaySM:false, displaySPT:false, displayInv:false, groupby:'ServiceUserUnit'});
			} else {
				for(let i=0; i< groupBy.length; i++) {
					if (groupBy[i].key == item['ServiceLocation']) {
						groupBy[i].child.push(item);
					}
				}
			}
		  
        });
        return groupBy;
    }
    function groupBySpecialIncidentReportLicenseServiceUnit() {
        let groupBy = [];
        specialIncidentReportLicense.map(function(item) {
            console.log('CaseNumber', item['CaseNumber'])
			let addItem = true;
			for(let groupItem of groupBy) {
				if (groupItem.key == item['ServiceLocation']) {
					addItem = false;
				}
			}
			if (addItem) {
				groupBy.push({key:item['ServiceLocation'], child:[item], display:false, displaySD:false, displaySM:false, displaySPT:false, displayInv:false, groupby:'ServiceUserUnit'});
			} else {
				for(let i=0; i< groupBy.length; i++) {
					if (groupBy[i].key == item['ServiceLocation']) {
						groupBy[i].child.push(item);
					}
				}
			}
		  
        });
        return groupBy;
    }
    function groupBySpecialIncidentReportAllowanceServiceUnit() {
        let groupBy = [];
        specialIncidentReportAllowance.map(function(item) {
            console.log('CaseNumber', item['CaseNumber'])
			let addItem = true;
			for(let groupItem of groupBy) {
				if (groupItem.key == item['ServiceLocation']) {
					addItem = false;
				}
			}
			if (addItem) {
				groupBy.push({key:item['ServiceLocation'], child:[item], display:false, displaySD:false, displaySM:false, displaySPT:false, displayInv:false, groupby:'ServiceUserUnit'});
			} else {
				for(let i=0; i< groupBy.length; i++) {
					if (groupBy[i].key == item['ServiceLocation']) {
						groupBy[i].child.push(item);
					}
				}
			}
		  
        });
        return groupBy;
    }


    function groupByPosition(list, position, type) {
        let groupBy = [];
        list.map(function(item) {
            if (position == 'CurrentSM') {
                if (item.Stage =='1') {
                    if (item.Status !='DRAFT' && item.Status !='PENDING_SM_APPROVE') {
                        return; 
                    }
                } else if (item.Stage =='2') {
                    if (item.Status !='PENDING_SPT_APPROVE' && item.Status !='PENDING_INVESTIGATE') {
                        return; 
                    }
                } else if (item.Stage =='3') {
                    if (item.Status !='PENDING_SM_FILL_IN') {
                        return;
                    }
                }
            } else if (position == 'CurrentSD') {
                if (item.Stage =='1') {
                    if (item.Status !='DRAFT' && item.Status !='PENDING_SM_APPROVE' && item.Status !='PENDING_SPT_APPROVE') {
                        return; 
                    }
                } else if (item.Stage =='2') {
                    if (type == 'ServiceUserAccident' || type == 'OutsiderAccident') {
                        return;
                    }
                }
            } else if (position == 'CurrentSPT') {
                if (item.Stage =='1') {
                    if (item.Status !='DRAFT' && item.Status !='PENDING_SM_APPROVE' && item.Status !='PENDING_SPT_APPROVE') {
                        return; 
                    }
                } else if (item.Stage =='2') {
                    return;
                }
            } else if (position == 'Investigator') {
                if (item.Stage =='1' || item.Stage =='3') {
                    return; 
                } else if (item.Stage =='2') {
                    if (item.Status !='PENDING_INVESTIGATE') {
                        return; 
                    }
                }
            }
            
			let addItem = true;
			for(let groupItem of groupBy) {
                if (item[position] == null) {
                    debugger
                }
				if (groupItem.key == item[position].Title) {
					addItem = false;
				}
			}
			if (addItem) {

                if (item[position] == null) {
                    debugger
                }
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

    const showGroupBy = (item,index,type) => {
        if (type == 'ServiceUser') {
            let display = item.display;
            let newArr = [...groupServiceUserAccidentByServiceUserList]; // copying the old datas array
            newArr[index].display = !display;
            setGroupServiceUserAccidentByServiceUserList(newArr);
        } else if (type =='OutsiderAccident') {
            let display = item.display;
            let newArr = [...groupOutsiderAccidentByServiceUserList]; // copying the old datas array
            newArr[index].display = !display;
            setGroupOutsiderAccidentByServiceUserList(newArr);
        } else if (type =='SpecialIncidentReportLicense') {
            let display = item.display;
            let newArr = [...groupSpecialIncidentReportLicenseByServiceUserList]; // copying the old datas array
            newArr[index].display = !display;
            setGroupSpecialIncidentReportLicenseByServiceUserList(newArr);
        } else if (type =='SpecialIncidentReportAllowance') {
            let display = item.display;
            let newArr = [...groupSpecialIncidentReportAllowanceByServiceUserList]; // copying the old datas array
            newArr[index].display = !display;
            setGroupSpecialIncidentReportAllowanceByServiceUserList(newArr);
        } else if (type =='OtherIncidentReport') {
            let display = item.display;
            let newArr = [...groupOtherIncidentReportByServiceUserList]; // copying the old datas array
            newArr[index].display = !display;
            setGroupOtherIncidentReportByServiceUserList(newArr);
        }
        
    }
    const showGroupBySD = (item,index,type) => {
        if (type == 'ServiceUser') {
            let display = item.displaySD;
            let newArr = [...groupServiceUserAccidentByServiceUserList]; // copying the old datas array
            newArr[index].displaySD = !display;
            setGroupServiceUserAccidentByServiceUserList(newArr);
        } else if (type =='OutsiderAccident') {
            let display = item.displaySD;
            let newArr = [...groupOutsiderAccidentByServiceUserList]; // copying the old datas array
            newArr[index].displaySD = !display;
            setGroupOutsiderAccidentByServiceUserList(newArr);
        } else if (type =='SpecialIncidentReportLicense') {
            let display = item.displaySD;
            let newArr = [...groupSpecialIncidentReportLicenseByServiceUserList]; // copying the old datas array
            newArr[index].displaySD = !display;
            setGroupSpecialIncidentReportLicenseByServiceUserList(newArr);
        } else if (type =='SpecialIncidentReportAllowance') {
            let display = item.displaySD;
            let newArr = [...groupSpecialIncidentReportAllowanceByServiceUserList]; // copying the old datas array
            newArr[index].displaySD = !display;
            setGroupSpecialIncidentReportAllowanceByServiceUserList(newArr);
        } else if (type =='OtherIncidentReport') {
            let display = item.displaySD;
            let newArr = [...groupOtherIncidentReportByServiceUserList]; // copying the old datas array
            newArr[index].displaySD = !display;
            setGroupOtherIncidentReportByServiceUserList(newArr);
        }
    }
    const showGroupBySM = (item,index,type) => {
        if (type == 'ServiceUser') {
            let display = item.displaySM;
            let newArr = [...groupServiceUserAccidentByServiceUserList]; // copying the old datas array
            newArr[index].displaySM = !display;
            setGroupServiceUserAccidentByServiceUserList(newArr);
        } else if (type =='OutsiderAccident') {
            let display = item.displaySM;
            let newArr = [...groupOutsiderAccidentByServiceUserList]; // copying the old datas array
            newArr[index].displaySM = !display;
            setGroupOutsiderAccidentByServiceUserList(newArr);
        } else if (type =='SpecialIncidentReportLicense') {
            let display = item.displaySM;
            let newArr = [...groupSpecialIncidentReportLicenseByServiceUserList]; // copying the old datas array
            newArr[index].displaySM = !display;
            setGroupSpecialIncidentReportLicenseByServiceUserList(newArr);
        } else if (type =='SpecialIncidentReportAllowance') {
            let display = item.displaySM;
            let newArr = [...groupSpecialIncidentReportAllowanceByServiceUserList]; // copying the old datas array
            newArr[index].displaySM = !display;
            setGroupSpecialIncidentReportAllowanceByServiceUserList(newArr);
        } else if (type =='OtherIncidentReport') {
            let display = item.displaySM;
            let newArr = [...groupOtherIncidentReportByServiceUserList]; // copying the old datas array
            newArr[index].displaySM = !display;
            setGroupOtherIncidentReportByServiceUserList(newArr);
        }
    }
    const showGroupBySPT = (item,index,type) => {
        if (type == 'ServiceUser') {
            let display = item.displaySPT;
            let newArr = [...groupServiceUserAccidentByServiceUserList]; // copying the old datas array
            newArr[index].displaySPT = !display;
            setGroupServiceUserAccidentByServiceUserList(newArr);
        } else if (type =='OutsiderAccident') {
            let display = item.displaySPT;
            let newArr = [...groupOutsiderAccidentByServiceUserList]; // copying the old datas array
            newArr[index].displaySPT = !display;
            setGroupOutsiderAccidentByServiceUserList(newArr);
        }
    }
    const showGroupByInv = (item,index,type) => {
        if (type == 'ServiceUser') {
            let display = item.displayInv;
            let newArr = [...groupServiceUserAccidentByServiceUserList]; // copying the old datas array
            newArr[index].displayInv = !display;
            setGroupServiceUserAccidentByServiceUserList(newArr);
        } else if (type =='OutsiderAccident') {
            let display = item.displayInv;
            let newArr = [...groupOutsiderAccidentByServiceUserList]; // copying the old datas array
            newArr[index].displayInv = !display;
            setGroupOutsiderAccidentByServiceUserList(newArr);
        }
    }
    
    async function getAllData() {
        let allServiceUserAccident = await getAllServiceUserAccident();
        let allOutsiderAccident = await getAllOutsiderAccident();
        let allAccidentReportForm = await getAllAccidentReportForm();
        let allAccidentFollowUpForm = await getAllAccidentFollowUpForm();
        let allOtherIncidentReport = await getAllOtherIncidentReport();
        let allSpecialIncidentReportLicense = await getAllSpecialIncidentReportLicense();
        let allSpecialIncidentReportAllowance = await getAllSpecialIncidentReportAllowance();
        let allIncidentFollowUpForm = await getAllIncidentFollowUpForm();
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
                sa['Form'] = '事故跟進/結束報告(三)';
                sa['CurrentSM'] = getAFUF.length > 0 ? getAFUF[getAFUF.length -1]['SM'] : null;
                sa['CurrentSD'] = getAFUF.length > 0 ? getAFUF[getAFUF.length -1]['SD'] : null;
                sa['CurrentSPT'] = getAFUF.length > 0 ? getAFUF[getAFUF.length -1]['SPT'] : null;
            }
        }
        for (let oa of allOutsiderAccident) {
            console.log('All CaseNumber', oa['CaseNumber'])
            let getARF = allAccidentReportForm.filter(item => {return item.CaseNumber == oa.CaseNumber && item.ParentFormId == oa.ID});
            let getAFUF = allAccidentFollowUpForm.filter(item => {return item.CaseNumber == oa.CaseNumber && item.ParentFormId == oa.ID});
            oa['AccidentReportForm'] = getARF;
            oa['AccidentFollowUpForm'] = getAFUF;
            if (oa['Stage'] == '1') {
                oa['Form'] = '外界人士意外意外填報表(一)';
                oa['CurrentSM'] = oa['SM'];
                oa['CurrentSD'] = oa['SD'];
                oa['CurrentSPT'] = oa['SPT'];
            } else if (oa['Stage'] == '2') {
                oa['Form'] = '外界人士意外意外報告(二)';
                oa['CurrentSM'] = getARF.length > 0 ? getARF[0]['SM'] : null;
                oa['CurrentSD'] = getARF.length > 0 ? getARF[0]['SD'] : null;
                oa['CurrentSPT'] = getARF.length > 0 ? getARF[0]['SPT'] : null;
            } else if (oa['Stage'] == '3') {
                oa['Form'] = '事故跟進/結束報告(三)';
                oa['CurrentSM'] = getAFUF.length > 0 ? getAFUF[getAFUF.length -1]['SM'] : null;
                oa['CurrentSD'] = getAFUF.length > 0 ? getAFUF[getAFUF.length -1]['SD'] : null;
                oa['CurrentSPT'] = getAFUF.length > 0 ? getAFUF[getAFUF.length -1]['SPT'] : null;
            }
        }

        for (let oir of allOtherIncidentReport) {
            let getIFUF = allIncidentFollowUpForm.filter(item => {return item.CaseNumber == oir.CaseNumber && item.ParentFormId == oir.ID});
            if (oir['Stage'] == '1') {
                oir['Form'] = '其他事故呈報表';
                oir['CurrentSM'] = oir['SM'];
                oir['CurrentSD'] = oir['SD'];
            } else if (oir['Stage'] == '2') {
                oir['Form'] = '事故跟進/結束報告';
                oir['CurrentSM'] = getIFUF.length > 0 ? getIFUF[0]['SM'] : null;
                oir['CurrentSD'] = getIFUF.length > 0 ? getIFUF[0]['SD'] : null;
                
            }
        }
        for (let sirl of allSpecialIncidentReportLicense) {
            let getIFUF = allIncidentFollowUpForm.filter(item => {return item.CaseNumber == sirl.CaseNumber && item.ParentFormId == sirl.ID});
            if (sirl['Stage'] == '1') {
                sirl['Form'] = '特別事故(牌照事務處)';
                sirl['CurrentSM'] = sirl['SM'];
                sirl['CurrentSD'] = sirl['SD'];
            } else if (sirl['Stage'] == '2') {
                sirl['Form'] = '事故跟進/結束報告';
                sirl['CurrentSM'] = getIFUF.length > 0 ? getIFUF[0]['SM'] : null;
                sirl['CurrentSD'] = getIFUF.length > 0 ? getIFUF[0]['SD'] : null;
                
            }
        }
        for (let sira of allSpecialIncidentReportAllowance) {
            let getIFUF = allIncidentFollowUpForm.filter(item => {return item.CaseNumber == sira.CaseNumber && item.ParentFormId == sira.ID});
            if (sira['Stage'] == '1') {
                sira['Form'] = '特別事故(津貼科)';
                sira['CurrentSM'] = sira['SM'];
                sira['CurrentSD'] = sira['SD'];
            } else if (sira['Stage'] == '2') {
                
                sira['Form'] = '事故跟進/結束報告';
                sira['CurrentSM'] = getIFUF.length > 0 ? getIFUF[0]['SM'] : null;
                sira['CurrentSD'] = getIFUF.length > 0 ? getIFUF[0]['SD'] : null;
                
            }
        }
        setServiceUserAccident(allServiceUserAccident);
        setOutsiderAccident(allOutsiderAccident);
        setOtherIncidentReport(allOtherIncidentReport);
        setSpecialIncidentReportLicense(allSpecialIncidentReportLicense);
        setSpecialIncidentReportAllowance(allSpecialIncidentReportLicense);
        
    }
    async function getWorkflow() {
        let workflow = await getUpdateUserWorkflow(siteCollectionUrl);
        setUpdateUserWorkflow(workflow);
    }
    useEffect(() => {
        getAllData();
        getWorkflow();
    }, []);

   
    useEffect(() => {
        if (Array.isArray(serviceUserAccident) && serviceUserAccident.length > 0) {
            let groupByList = groupByServiceUserAccidentServiceUnit();
            for (let i=0; i<groupByList.length; i++) {
                groupByList[i].childSM = groupByPosition(groupByList[i].child, 'CurrentSM','ServiceUserAccident');
                groupByList[i].childSD = groupByPosition(groupByList[i].child, 'CurrentSD','ServiceUserAccident');
                groupByList[i].childSPT = groupByPosition(groupByList[i].child, 'CurrentSPT','ServiceUserAccident');
                groupByList[i].childInv = groupByPosition(groupByList[i].child, 'Investigator','ServiceUserAccident');
            }
            setGroupServiceUserAccidentByServiceUserList(groupByList);
        }
        
    }, [serviceUserAccident]);

    useEffect(() => {
        if (Array.isArray(outsiderAccident) && outsiderAccident.length > 0) {
            let groupByList = groupByOutsiderAccidentServiceUnit();
            for (let i=0; i<groupByList.length; i++) {
                groupByList[i].childSM = groupByPosition(groupByList[i].child, 'CurrentSM','OutsiderAccident');
                groupByList[i].childSD = groupByPosition(groupByList[i].child, 'CurrentSD','OutsiderAccident');
                groupByList[i].childSPT = groupByPosition(groupByList[i].child, 'CurrentSPT','OutsiderAccident');
                groupByList[i].childInv = groupByPosition(groupByList[i].child, 'Investigator','OutsiderAccident');
            }
            setGroupOutsiderAccidentByServiceUserList(groupByList);
        }
        
    }, [outsiderAccident]);
    
    useEffect(() => {
        if (Array.isArray(otherIncidentReport) && otherIncidentReport.length > 0) {
            let groupByList = groupByOtherIncidentReportServiceUnit();
            for (let i=0; i<groupByList.length; i++) {
                groupByList[i].childSM = groupByPosition(groupByList[i].child, 'CurrentSM','OtherIncidentReport');
                groupByList[i].childSD = groupByPosition(groupByList[i].child, 'CurrentSD','OtherIncidentReport');
            }
            setGroupOtherIncidentReportByServiceUserList(groupByList);
        }
        
    }, [otherIncidentReport]);

    useEffect(() => {
        if (Array.isArray(specialIncidentReportLicense) && specialIncidentReportLicense.length > 0) {
            let groupByList = groupBySpecialIncidentReportLicenseServiceUnit();
            
            for (let i=0; i<groupByList.length; i++) {
                groupByList[i].childSM = groupByPosition(groupByList[i].child, 'CurrentSM','SpecialIncidentReportLicense');
                groupByList[i].childSD = groupByPosition(groupByList[i].child, 'CurrentSD','SpecialIncidentReportLicense');
            }
            setGroupSpecialIncidentReportLicenseByServiceUserList(groupByList);
        }
        
    }, [specialIncidentReportLicense]);

    useEffect(() => {
        if (Array.isArray(specialIncidentReportAllowance) && specialIncidentReportAllowance.length > 0) {
            let groupByList = groupBySpecialIncidentReportAllowanceServiceUnit();
            for (let i=0; i<groupByList.length; i++) {
                groupByList[i].childSM = groupByPosition(groupByList[i].child, 'CurrentSM','SpecialIncidentReportAllowance');
                groupByList[i].childSD = groupByPosition(groupByList[i].child, 'CurrentSD','SpecialIncidentReportAllowance');
            }
            setGroupSpecialIncidentReportAllowanceByServiceUserList(groupByList);
        }
        
    }, [specialIncidentReportAllowance]);

    console.log('groupServiceUserAccidentByServiceUserList ', groupServiceUserAccidentByServiceUserList)
    /*<BootstrapTable boot keyField='id' data={item.child} columns={column} pagination={paginationFactory()} bootstrap4={true} />*/
    return (
        <div>
            <div>
                服務使用者意外
            </div>
            {groupServiceUserAccidentByServiceUserList.map((item, index) => {
                return (
                    <div>
                        
                    <div style={{cursor:'pointer'}} className="col-sm-12" onClick={() => showGroupBy(item,index,'ServiceUser')}>
							{!item.display && <span><span style={{paddingRight:'5px'}}><FontAwesomeIcon icon={fontawesome["faChevronRight"]} color="black" size="1x"/></span><span>{item['key']}&nbsp;</span></span>}
							{item.display && <span><span style={{paddingRight:'5px'}}><FontAwesomeIcon icon={fontawesome["faChevronDown"]} color="black" size="1x"/></span><span>{item['key']}&nbsp;</span></span>}
							({item.child.length})
					</div>
                    {item.display && 
                     <div>
                        <div style={{cursor:'pointer', paddingLeft:'40px'}} className="col-sm-12" onClick={() => showGroupBySM(item,index,'ServiceUser')}>
                            {!item.displaySM && <span><span style={{paddingRight:'5px'}}><FontAwesomeIcon icon={fontawesome["faChevronRight"]} color="black" size="1x"/></span><span>服務經理/高級服務經理&nbsp;</span></span>}
                            {item.displaySM && <span><span style={{paddingRight:'5px'}}><FontAwesomeIcon icon={fontawesome["faChevronDown"]} color="black" size="1x"/></span><span>服務經理/高級服務經理&nbsp;</span></span>}
					    </div>
                        {item.displaySM && 
                            item.childSM.map((item1, index1) => {
                                return <Dashboard context={context} siteCollectionUrl={siteCollectionUrl} type={'ServiceUser'} serviceUnit={item['key']} item={item1} index={index1} position={'SM'} getAllData={getAllData} workflow={updateUserWorkflow}/>
                            })
                        }
                            

                        <div style={{cursor:'pointer', paddingLeft:'40px'}} className="col-sm-12" onClick={() => showGroupBySD(item,index,'ServiceUser')}>
                            {!item.displaySD && <span><span style={{paddingRight:'5px'}}><FontAwesomeIcon icon={fontawesome["faChevronRight"]} color="black" size="1x"/></span><span>服務總監&nbsp;</span></span>}
                            {item.displaySD && <span><span style={{paddingRight:'5px'}}><FontAwesomeIcon icon={fontawesome["faChevronDown"]} color="black" size="1x"/></span><span>服務總監&nbsp;</span></span>}
					    </div>
                        
                        {item.displaySD && 
                            item.childSD.map((item1, index1) => {
                                return <Dashboard context={context} siteCollectionUrl={siteCollectionUrl} type={'ServiceUser'} serviceUnit={item['key']} item={item1} index={index1} position={'SD'} getAllData={getAllData} workflow={updateUserWorkflow}/>
                            })
                        }

                        <div style={{cursor:'pointer', paddingLeft:'40px'}} className="col-sm-12" onClick={() => showGroupBySPT(item,index,'ServiceUser')}>
                            {!item.displaySPT && <span><span style={{paddingRight:'5px'}}><FontAwesomeIcon icon={fontawesome["faChevronRight"]} color="black" size="1x"/></span><span>高級物理治療師&nbsp;</span></span>}
                            {item.displaySPT && <span><span style={{paddingRight:'5px'}}><FontAwesomeIcon icon={fontawesome["faChevronDown"]} color="black" size="1x"/></span><span>高級物理治療師&nbsp;</span></span>}
					    </div>
                        {item.displaySPT && 
                            item.childSPT.map((item1, index1) => {
                                return <Dashboard context={context} siteCollectionUrl={siteCollectionUrl} type={'ServiceUser'} serviceUnit={item['key']} item={item1} index={index1}  position={'SPT'} getAllData={getAllData} workflow={updateUserWorkflow}/>
                            })
                        }
                        <div style={{cursor:'pointer', paddingLeft:'40px'}} className="col-sm-12" onClick={() => showGroupByInv(item,index,'ServiceUser')}>
                            {!item.displayInv && <span><span style={{paddingRight:'5px'}}><FontAwesomeIcon icon={fontawesome["faChevronRight"]} color="black" size="1x"/></span><span>調查員&nbsp;</span></span>}
                            {item.displayInv && <span><span style={{paddingRight:'5px'}}><FontAwesomeIcon icon={fontawesome["faChevronDown"]} color="black" size="1x"/></span><span>調查員&nbsp;</span></span>}
					    </div>
                        {item.displayInv && 
                            item.childInv.map((item1, index1) => {
                                return <Dashboard context={context} siteCollectionUrl={siteCollectionUrl} type={'ServiceUser'} serviceUnit={item['key']} item={item1} index={index1}  position={'INV'} getAllData={getAllData} workflow={updateUserWorkflow}/>
                            })
                        }
                    </div>
                    }
                    </div>
            )}
            
            )}
            <div>
                外界人士意外
            </div>

            {groupOutsiderAccidentByServiceUserList.map((item, index) => {
                return (
                    <div>
                        
                    <div style={{cursor:'pointer'}} className="col-sm-12" onClick={() => showGroupBy(item,index,'OutsiderAccident')}>
							{!item.display && <span><span style={{paddingRight:'5px'}}><FontAwesomeIcon icon={fontawesome["faChevronRight"]} color="black" size="1x"/></span><span>{item['key']}&nbsp;</span></span>}
							{item.display && <span><span style={{paddingRight:'5px'}}><FontAwesomeIcon icon={fontawesome["faChevronDown"]} color="black" size="1x"/></span><span>{item['key']}&nbsp;</span></span>}
							({item.child.length})
					</div>
                    {item.display && 
                     <div>
                        <div style={{cursor:'pointer', paddingLeft:'40px'}} className="col-sm-12" onClick={() => showGroupBySM(item,index,'OutsiderAccident')}>
                            {!item.displaySM && <span><span style={{paddingRight:'5px'}}><FontAwesomeIcon icon={fontawesome["faChevronRight"]} color="black" size="1x"/></span><span>服務經理/高級服務經理&nbsp;</span></span>}
                            {item.displaySM && <span><span style={{paddingRight:'5px'}}><FontAwesomeIcon icon={fontawesome["faChevronDown"]} color="black" size="1x"/></span><span>服務經理/高級服務經理&nbsp;</span></span>}
					    </div>
                        {item.displaySM && 
                            item.childSM.map((item1, index1) => {
                                return <Dashboard context={context} siteCollectionUrl={siteCollectionUrl} type={'OutsiderAccident'} serviceUnit={item['key']} item={item1} index={index1} position={'SM'} getAllData={getAllData} workflow={updateUserWorkflow}/>
                            })
                        }
                            

                        <div style={{cursor:'pointer', paddingLeft:'40px'}} className="col-sm-12" onClick={() => showGroupBySD(item,index,'OutsiderAccident')}>
                            {!item.displaySD && <span><span style={{paddingRight:'5px'}}><FontAwesomeIcon icon={fontawesome["faChevronRight"]} color="black" size="1x"/></span><span>服務總監&nbsp;</span></span>}
                            {item.displaySD && <span><span style={{paddingRight:'5px'}}><FontAwesomeIcon icon={fontawesome["faChevronDown"]} color="black" size="1x"/></span><span>服務總監&nbsp;</span></span>}
					    </div>
                        
                        {item.displaySD && 
                            item.childSD.map((item1, index1) => {
                                return <Dashboard context={context} siteCollectionUrl={siteCollectionUrl} type={'OutsiderAccident'} serviceUnit={item['key']} item={item1} index={index1} position={'SD'} getAllData={getAllData} workflow={updateUserWorkflow}/>
                            })
                        }

                        <div style={{cursor:'pointer', paddingLeft:'40px'}} className="col-sm-12" onClick={() => showGroupBySPT(item,index,'OutsiderAccident')}>
                            {!item.displaySPT && <span><span style={{paddingRight:'5px'}}><FontAwesomeIcon icon={fontawesome["faChevronRight"]} color="black" size="1x"/></span><span>高級物理治療師&nbsp;</span></span>}
                            {item.displaySPT && <span><span style={{paddingRight:'5px'}}><FontAwesomeIcon icon={fontawesome["faChevronDown"]} color="black" size="1x"/></span><span>高級物理治療師&nbsp;</span></span>}
					    </div>
                        {item.displaySPT && 
                            item.childSPT.map((item1, index1) => {
                                return <Dashboard context={context} siteCollectionUrl={siteCollectionUrl} type={'OutsiderAccident'} serviceUnit={item['key']} item={item1} index={index1}  position={'SPT'} getAllData={getAllData} workflow={updateUserWorkflow}/>
                            })
                        }
                        <div style={{cursor:'pointer', paddingLeft:'40px'}} className="col-sm-12" onClick={() => showGroupByInv(item,index,'OutsiderAccident')}>
                            {!item.displayInv && <span><span style={{paddingRight:'5px'}}><FontAwesomeIcon icon={fontawesome["faChevronRight"]} color="black" size="1x"/></span><span>調查員&nbsp;</span></span>}
                            {item.displayInv && <span><span style={{paddingRight:'5px'}}><FontAwesomeIcon icon={fontawesome["faChevronDown"]} color="black" size="1x"/></span><span>調查員&nbsp;</span></span>}
					    </div>
                        {item.displayInv && 
                            item.childInv.map((item1, index1) => {
                                return <Dashboard context={context} siteCollectionUrl={siteCollectionUrl} type={'OutsiderAccident'} serviceUnit={item['key']} item={item1} index={index1}  position={'INV'} getAllData={getAllData} workflow={updateUserWorkflow}/>
                            })
                        }
                    </div>
                    }
                    </div>
            )}
            
            )} 

            <div>
                特別事故(牌照事務處)
            </div>
            {groupSpecialIncidentReportLicenseByServiceUserList.map((item, index) => {
                return (
                    <div>
                        
                    <div style={{cursor:'pointer'}} className="col-sm-12" onClick={() => showGroupBy(item,index,'SpecialIncidentReportLicense')}>
							{!item.display && <span><span style={{paddingRight:'5px'}}><FontAwesomeIcon icon={fontawesome["faChevronRight"]} color="black" size="1x"/></span><span>{item['key']}&nbsp;</span></span>}
							{item.display && <span><span style={{paddingRight:'5px'}}><FontAwesomeIcon icon={fontawesome["faChevronDown"]} color="black" size="1x"/></span><span>{item['key']}&nbsp;</span></span>}
							({item.child.length})
					</div>
                    {item.display && 
                     <div>
                        <div style={{cursor:'pointer', paddingLeft:'40px'}} className="col-sm-12" onClick={() => showGroupBySM(item,index,'SpecialIncidentReportLicense')}>
                            {!item.displaySM && <span><span style={{paddingRight:'5px'}}><FontAwesomeIcon icon={fontawesome["faChevronRight"]} color="black" size="1x"/></span><span>服務經理/高級服務經理&nbsp;</span></span>}
                            {item.displaySM && <span><span style={{paddingRight:'5px'}}><FontAwesomeIcon icon={fontawesome["faChevronDown"]} color="black" size="1x"/></span><span>服務經理/高級服務經理&nbsp;</span></span>}
					    </div>
                        {item.displaySM && 
                            item.childSM.map((item1, index1) => {
                                return <Dashboard context={context} siteCollectionUrl={siteCollectionUrl} type={'SpecialIncidentReportLicense'} serviceUnit={item['key']} item={item1} index={index1} position={'SM'} getAllData={getAllData} workflow={updateUserWorkflow}/>
                            })
                        }
                            

                        <div style={{cursor:'pointer', paddingLeft:'40px'}} className="col-sm-12" onClick={() => showGroupBySD(item,index,'SpecialIncidentReportLicense')}>
                            {!item.displaySD && <span><span style={{paddingRight:'5px'}}><FontAwesomeIcon icon={fontawesome["faChevronRight"]} color="black" size="1x"/></span><span>服務總監&nbsp;</span></span>}
                            {item.displaySD && <span><span style={{paddingRight:'5px'}}><FontAwesomeIcon icon={fontawesome["faChevronDown"]} color="black" size="1x"/></span><span>服務總監&nbsp;</span></span>}
					    </div>
                        
                        {item.displaySD && 
                            item.childSD.map((item1, index1) => {
                                return <Dashboard context={context} siteCollectionUrl={siteCollectionUrl} type={'SpecialIncidentReportLicense'} serviceUnit={item['key']} item={item1} index={index1} position={'SD'} getAllData={getAllData} workflow={updateUserWorkflow}/>
                            })
                        }
                    </div>
                    }
                    </div>
            )}
            
            )}
            <div>
                特別事故(津貼科)
            </div>
            {groupSpecialIncidentReportAllowanceByServiceUserList.map((item, index) => {
                return (
                    <div>
                        
                    <div style={{cursor:'pointer'}} className="col-sm-12" onClick={() => showGroupBy(item,index,'SpecialIncidentReportAllowance')}>
							{!item.display && <span><span style={{paddingRight:'5px'}}><FontAwesomeIcon icon={fontawesome["faChevronRight"]} color="black" size="1x"/></span><span>{item['key']}&nbsp;</span></span>}
							{item.display && <span><span style={{paddingRight:'5px'}}><FontAwesomeIcon icon={fontawesome["faChevronDown"]} color="black" size="1x"/></span><span>{item['key']}&nbsp;</span></span>}
							({item.child.length})
					</div>
                    {item.display && 
                     <div>
                        <div style={{cursor:'pointer', paddingLeft:'40px'}} className="col-sm-12" onClick={() => showGroupBySM(item,index,'SpecialIncidentReportAllowance')}>
                            {!item.displaySM && <span><span style={{paddingRight:'5px'}}><FontAwesomeIcon icon={fontawesome["faChevronRight"]} color="black" size="1x"/></span><span>服務經理/高級服務經理&nbsp;</span></span>}
                            {item.displaySM && <span><span style={{paddingRight:'5px'}}><FontAwesomeIcon icon={fontawesome["faChevronDown"]} color="black" size="1x"/></span><span>服務經理/高級服務經理&nbsp;</span></span>}
					    </div>
                        {item.displaySM && 
                            item.childSM.map((item1, index1) => {
                                return <Dashboard context={context} siteCollectionUrl={siteCollectionUrl} type={'SpecialIncidentReportAllowance'} serviceUnit={item['key']} item={item1} index={index1} position={'SM'} getAllData={getAllData} workflow={updateUserWorkflow}/>
                            })
                        }
                            

                        <div style={{cursor:'pointer', paddingLeft:'40px'}} className="col-sm-12" onClick={() => showGroupBySD(item,index,'SpecialIncidentReportAllowance')}>
                            {!item.displaySD && <span><span style={{paddingRight:'5px'}}><FontAwesomeIcon icon={fontawesome["faChevronRight"]} color="black" size="1x"/></span><span>服務總監&nbsp;</span></span>}
                            {item.displaySD && <span><span style={{paddingRight:'5px'}}><FontAwesomeIcon icon={fontawesome["faChevronDown"]} color="black" size="1x"/></span><span>服務總監&nbsp;</span></span>}
					    </div>
                        
                        {item.displaySD && 
                            item.childSD.map((item1, index1) => {
                                return <Dashboard context={context} siteCollectionUrl={siteCollectionUrl} type={'SpecialIncidentReportAllowance'} serviceUnit={item['key']} item={item1} index={index1} position={'SD'} getAllData={getAllData} workflow={updateUserWorkflow}/>
                            })
                        }
                    </div>
                    }
                    </div>
            )}
            )}
            <div>
                其他事故
            </div>
            {groupOtherIncidentReportByServiceUserList.map((item, index) => {
                return (
                    <div>
                        
                    <div style={{cursor:'pointer'}} className="col-sm-12" onClick={() => showGroupBy(item,index,'OtherIncidentReport')}>
							{!item.display && <span><span style={{paddingRight:'5px'}}><FontAwesomeIcon icon={fontawesome["faChevronRight"]} color="black" size="1x"/></span><span>{item['key']}&nbsp;</span></span>}
							{item.display && <span><span style={{paddingRight:'5px'}}><FontAwesomeIcon icon={fontawesome["faChevronDown"]} color="black" size="1x"/></span><span>{item['key']}&nbsp;</span></span>}
							({item.child.length})
					</div>
                    {item.display && 
                     <div>
                        <div style={{cursor:'pointer', paddingLeft:'40px'}} className="col-sm-12" onClick={() => showGroupBySM(item,index,'OtherIncidentReport')}>
                            {!item.displaySM && <span><span style={{paddingRight:'5px'}}><FontAwesomeIcon icon={fontawesome["faChevronRight"]} color="black" size="1x"/></span><span>服務經理/高級服務經理&nbsp;</span></span>}
                            {item.displaySM && <span><span style={{paddingRight:'5px'}}><FontAwesomeIcon icon={fontawesome["faChevronDown"]} color="black" size="1x"/></span><span>服務經理/高級服務經理&nbsp;</span></span>}
					    </div>
                        {item.displaySM && 
                            item.childSM.map((item1, index1) => {
                                return <Dashboard context={context} siteCollectionUrl={siteCollectionUrl} type={'OtherIncidentReport'} serviceUnit={item['key']} item={item1} index={index1} position={'SM'} getAllData={getAllData} workflow={updateUserWorkflow}/>
                            })
                        }
                            

                        <div style={{cursor:'pointer', paddingLeft:'40px'}} className="col-sm-12" onClick={() => showGroupBySD(item,index,'OtherIncidentReport')}>
                            {!item.displaySD && <span><span style={{paddingRight:'5px'}}><FontAwesomeIcon icon={fontawesome["faChevronRight"]} color="black" size="1x"/></span><span>服務總監&nbsp;</span></span>}
                            {item.displaySD && <span><span style={{paddingRight:'5px'}}><FontAwesomeIcon icon={fontawesome["faChevronDown"]} color="black" size="1x"/></span><span>服務總監&nbsp;</span></span>}
					    </div>
                        
                        {item.displaySD && 
                            item.childSD.map((item1, index1) => {
                                return <Dashboard context={context} siteCollectionUrl={siteCollectionUrl} type={'OtherIncidentReport'} serviceUnit={item['key']} item={item1} index={index1} position={'SD'} getAllData={getAllData} workflow={updateUserWorkflow}/>
                            })
                        }
                    </div>
                    }
                    </div>
            )}
            )}
        </div>
    );
}

