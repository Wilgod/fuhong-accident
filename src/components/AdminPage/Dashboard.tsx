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
import Modal from 'react-modal';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import useDepartmentMangers from '../../hooks/useDepartmentManagers';
import useUserInfo from '../../hooks/useUserInfo';
import useSPT from '../../hooks/useSPT';
import useSharePointGroup from '../../hooks/useSharePointGroup';
import { updateAccidentReportFormById, updateServiceUserAccidentById, updateAccidentFollowUpRepotFormById } from '../../api/PostFuHongList';
import { notifyServiceUserAccidentUpdate, notifyServiceUserAccidentInvestigatorUpdate } from '../../api/Notification';
import useUserInfoAD from '../../hooks/useUserInfoAD';
interface IDashboard {
    item: any;
    index:number;
    position:string;
    context: WebPartContext;
    serviceUnit:string;
    siteCollectionUrl:string;
    getAllData:any;
    workflow:string
}

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      //minWidth: '500px',
      width: '80vw',
      //maxWidth: '1000px',
      animation: 'fadeMe 0.5s'
    }
  };
export default function Dashboard({ context, siteCollectionUrl, serviceUnit, item,index, position,getAllData, workflow }: IDashboard) {
    const [investigator, setInvestigator, investigatorPickerInfo] = useUserInfoAD();
    const column = [
        {
            dataField: 'ID',
            text: 'ID',
            hidden: true
        },
        {
            dataField: 'CaseNumber',
            text: '案件編號',
        },
        {
            dataField: 'Form',
            text: '表格',
        },
        {
            dataField: 'Status',
            text: '狀態',
        },
        {
            dataField: 'CurrentSM',
            text: '高級服務經理姓名',
            formatter: smFormatter.bind(this)
        },
        {
            dataField: 'CurrentSD',
            text: '服務總監姓名',
            formatter: sdFormatter.bind(this)
        },
        {
            dataField: 'CurrentSPT',
            text: '高級物理治療師姓名',
            formatter: sptFormatter.bind(this)
        }
    ]
    const [sptList] = useSPT(siteCollectionUrl);
    const [sPhysicalTherapy, setSPhysicalTherapyEmail, sPhysicalTherapyEmail] = useSharePointGroup();
    const { departments, setHrDepartment } = useDepartmentMangers();
    const [openModel, setOpenModel] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState([]);
    const [selectedItem, setSelectedItem] = useState([]);
    const [groupByServiceUserList, setGroupByServiceUserUnitList] = useState({key: '', child:[], display: false, groupby: ''});
    const [smInfo, setSMEmail, spSmInfo] = useUserInfo(siteCollectionUrl);
    const [sdInfo, setSDEmail, spSdInfo] = useUserInfo(siteCollectionUrl);
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

    function openDialog() {
        setHrDepartment(serviceUnit);
        setOpenModel(true);
    }
    

    

    useEffect(() => {
        setGroupByServiceUserUnitList(item);
    }, []);
    
    const handleOnSelect = (row, isSelect) => {
        let newSelectedItemId = [...selectedItemId];
        let newSelectedItem = [...selectedItem];
        if (isSelect) {
            newSelectedItemId.push(row.ID);
            newSelectedItem.push({Id:row.ID, stage:row.Stage, status:row.Status});
            setSelectedItemId(newSelectedItemId);
            setSelectedItem(newSelectedItem);
        } else {
            newSelectedItemId = newSelectedItemId.filter(function(elem){
                return elem != row.ID; 
             });
            let selectedId = newSelectedItemId.filter(x => x !== row.ID);
            let selected = newSelectedItem.filter(x => x.Id !== row.ID)

            setSelectedItemId(selectedId);
            setSelectedItem(selected);
        }
    }

    const handleOnSelectAll = (isSelect, rows) => {
		const ids = rows.map(r => r.ID);
        let newSelectedItemId = [];
        let newSelectedItem = [];
        debugger
		if (isSelect) {
			for (let i=0; i<rows.length; i++) {
				newSelectedItemId.push(rows[i].ID)
                newSelectedItem.push({Id:rows[i].ID, stage:rows[i].Stage, status:rows[i].Status});
			}
			setSelectedItemId(newSelectedItemId);
            setSelectedItem(newSelectedItem);
		} else {
			setSelectedItemId(newSelectedItemId);
            setSelectedItem(newSelectedItem);
		}
	}

    const selectRow = {
        mode: 'checkbox',
        clickToSelect: true,
        clickToEdit: true,
        clickToExpand: true,
        selected: selectedItemId,
        onSelect: handleOnSelect,
        onSelectAll: handleOnSelectAll
    };


    const showGroupByPositionSMUser = (item,index) => {
        let display = item.display;
        let newArr = {...groupByServiceUserList}; // copying the old datas array
        newArr['display'] = !display;
        setGroupByServiceUserUnitList(newArr);
    }

    const  update = async() => {
        console.log('smInfo : ', smInfo)
        console.log('spSmInfo : ', spSmInfo)
        console.log('investigator : ', investigator)
        console.log('investigatorPickerInfo : ', investigatorPickerInfo)
        debugger
        if (item.groupby == 'CurrentSM') {
            for (let selected of selectedItem) {
                if (selected.stage == '1') {
                    await updateServiceUserAccidentById(selected.Id, {
                        "SMId": spSmInfo.Id
                    });
                } else if (selected.stage == '2') {
                    const arf = item.child.filter(item => item.Id == selected.Id);
                    if (arf.length > 0 ) {
                        await updateAccidentReportFormById(arf[0].AccidentReportForm[0].Id, {
                            "SMId": spSmInfo.Id
                        });
                    }
                } else if (selected.stage == '3') {
                    const afur = item.child.filter(item => item.Id == selected.Id);
                    if (afur.length > 0 ) {
                        let idList = afur[0].AccidentFollowUpFormId;
                        await updateAccidentFollowUpRepotFormById(afur[0].AccidentFollowUpFormId[idList.length - 1], {
                            "SMId": spSmInfo.Id
                        });
                    }
                    
                }
            }
            let notif = await notifyServiceUserAccidentUpdate(context, workflow, serviceUnit, item.groupby, smInfo);
            debugger
        } else if (item.groupby == 'CurrentSD') {
            for (let selected of selectedItem) {
                if (selected.stage == '1') {
                    await updateServiceUserAccidentById(selected.Id, {
                        "SDId": spSdInfo.Id
                    });
                } else if (selected.stage == '3') {
                    const afur = item.child.filter(item => item.Id == selected.Id);
                    if (afur.length > 0 ) {
                        let idList = afur[0].AccidentFollowUpFormId
                        await updateAccidentFollowUpRepotFormById(afur[0].AccidentFollowUpFormId[idList.length - 1], {
                            "SDId": spSdInfo.Id
                        });
                    }
                    
                }
            }
            let notif = await notifyServiceUserAccidentUpdate(context, workflow, serviceUnit, item.groupby, spSdInfo);
        } else if (item.groupby == 'CurrentSPT') {
            for (let selected of selectedItem) {
                if (selected.stage == '1') {
                    await updateServiceUserAccidentById(selected.Id, {
                        "SPTId": sPhysicalTherapy.Id
                    });
                } else if (selected.stage == '3') {
                    const afur = item.child.filter(item => item.Id == selected.Id);
                    if (afur.length > 0 ) {
                        let idList = afur[0].AccidentFollowUpFormId
                        await updateAccidentFollowUpRepotFormById(afur[0].AccidentFollowUpFormId[idList.length - 1], {
                            "SPTId": sPhysicalTherapy.Id
                        });
                    }
                    
                }
            }
            let notif = await notifyServiceUserAccidentUpdate(context, workflow, serviceUnit, item.groupby, sPhysicalTherapy);
        } else if (item.groupby == 'Investigator') {
            if (investigatorPickerInfo.length >0) {
                for (let selected of selectedItem) {
                    if (selected.stage == '2') {
                        const arf = await item.child.filter(item => {return item.Id == selected.Id});
                        if (arf.length > 0 ) {
                            await updateAccidentReportFormById(arf[0].AccidentReportForm[0].Id, {
                                "InvestigatorId": investigatorPickerInfo[0].id
                            });
                        }
                        await updateServiceUserAccidentById(selected.Id, {
                            "InvestigatorId": investigatorPickerInfo[0].id
                        });
                    }
                }
                debugger
                let notif = await notifyServiceUserAccidentInvestigatorUpdate(context, workflow, serviceUnit, item.groupby, investigator);
            }
            
        }
        getAllData();
    }
    console.log("groupByServiceUserList",groupByServiceUserList);
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
            <div>
                <div className="form-group row mt-3 mb-2">
                    <div className="col-12">
                        <div className="d-flex">
                            <button className="btn btn-warning mr-3" onClick={() => openDialog()}>更改</button>
                        </div>
                    </div>
                </div>
                <BootstrapTable boot keyField='ID' data={groupByServiceUserList.child} columns={column} selectRow={selectRow} bootstrap4={true} />
            </div>
            }
            {
              openModel && <Modal
                isOpen={openModel}
                style={customStyles}
                onClick={() => { setOpenModel(false) }}
              >
                <div style={{ maxHeight: '500px', padding: '5px', width: '95%' }} >
                  <div >
                    <FontAwesomeIcon icon={fontawesome["faTimes"]} size="2x" style={{ float: 'right', cursor: 'pointer', position: 'absolute', top: '10px', right: '10px' }} onClick={() => setOpenModel(false) } />
                  </div>
                  <div style={{ marginTop: '15px', overflowX: 'hidden' }}>
                      {position == 'SM' && '更改高級服務經理'}
                      {position == 'SD' && '更改服務總監 '}
                      {position == 'SPT' && '更改高級物理治療師 '}
                  </div>
                  <div className="form-row mb-2">

                        <div className="col-6 col-xl-4">
                            {item.groupby == 'CurrentSM' && Array.isArray(departments) && departments.length > 0 &&
                                <select className={`custom-select`} onChange={(event => setSMEmail(event.target.value))}>
                                    <option value=""></option>
                                    <option value={departments[0].hr_deptmgr}>{departments[0].hr_deptmgr}</option>
                                    <option value={departments[0].new_deptmgr}>{departments[0].new_deptmgr}</option>
                                </select>
                            }
                            {item.groupby == 'CurrentSD' && Array.isArray(departments) && departments.length > 0 &&
                                <select className={`custom-select`} onChange={(event => setSDEmail(event.target.value))}>
                                    <option value=""></option>
                                    <option value={departments[0].hr_sd}>{departments[0].hr_sd}</option>
                                    <option value={departments[0].new_sd}>{departments[0].new_sd}</option>
                                </select>
                            }
                            {item.groupby == 'CurrentSPT' && 
                                    <select className={`custom-select`} onChange={(event) => setSPhysicalTherapyEmail(event.target.value)}>
                                        <option value={""} ></option>
                                    {
                                        sptList.map((spt) => {
                                            //console.log('spt mail :'+ spt.mail + ', ' + (spt.mail == sPhysicalTherapyEmail));
                                            return <option value={spt.Email} selected={spt.Email == sPhysicalTherapyEmail}>{spt.Name}</option>
                                        })
                                    }
                                </select>
                            }
                            {item.groupby == 'Investigator' && 
                            <PeoplePicker
                                context={context}
                                titleText=""
                                showtooltip={false}
                                personSelectionLimit={1}
                                ensureUser={true}
                                isRequired={false}
                                showHiddenInUI={false}
                                selectedItems={setInvestigator}
                            />
                            }
                        </div>
                    </div>
                  <div><button className="btn btn-warning mr-3" onClick={() => update()}>更改</button></div>
                </div>
              </Modal>
            }
        </div>
    )
}