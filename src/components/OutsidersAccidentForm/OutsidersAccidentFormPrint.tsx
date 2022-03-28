import * as React from 'react'
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { Role } from '../../utils/RoleParser';
import useUserInfoAD from '../../hooks/useUserInfoAD';
import useUserInfo from '../../hooks/useUserInfo';
import { IUser } from '../../interface/IUser';
import useSharePointGroup from '../../hooks/useSharePointGroup';
import styles from './OutsidersAccidentFormPrint.module.scss';
import { JSONParser } from '@pnp/pnpjs';
import { getUserInfoByEmailInUserInfoAD } from '../../api/FetchUser';

interface IServiceUserAccidentFormPrintProps {
    index: number;
    formData: any;
    formTwentyData :any;
    formTwentyOneDataPrint :any;
    formTwentyOneDataSelected:number;
    siteCollectionUrl:string;
    permissionList:any;
}

export default function ServiceUserAccidentFormPrint({ index,  formData, formTwentyData, formTwentyOneDataPrint, formTwentyOneDataSelected, siteCollectionUrl, permissionList}: IServiceUserAccidentFormPrintProps ) {
    const [reporterJobTitle, setReporterJobTitle] = useState("");
    const [reporterName, setReporterName] = useState("");
    const [investigatorName, setInvestigatorName] = useState("");
    const [investigatorJobTitle, setInvestigatorJobTitle] = useState("");
    let EstimatedPart2CompletionDate = null;
    if (formData.SubmitDate != null) {
        let SubmitDate = new Date(formData.SubmitDate);
        EstimatedPart2CompletionDate = SubmitDate.setMonth(SubmitDate.getMonth() + 1);
    }
    let followUpActions = null;
    let formTwentyOneData = null;
    if (formTwentyOneDataPrint != null) {
        
        formTwentyOneData = formTwentyOneDataPrint.filter(item => {return item.Id == formTwentyOneDataSelected});
        if (Array.isArray(formTwentyOneData) && formTwentyOneData.length > 0 && formTwentyOneData[0].FollowUpActions != null) {
            followUpActions = JSON.parse(formTwentyOneData[0].FollowUpActions);
        }
    }
    console.log('formData :',formData);

    useEffect(() => {
        if (formData) {
            getUserInfoByEmailInUserInfoAD(siteCollectionUrl,formData.Author.EMail).then((userInfosRes) => {
                if (Array.isArray(userInfosRes) && userInfosRes.length > 0) {
                    setReporterJobTitle(userInfosRes[0].hr_jobcode);
                    setReporterName(userInfosRes[0].Name);
                }
            }).catch((err) => {
                console.error('getUserInfoByEmailInUserInfoAD error')
                console.error(err)
            });
            if (formData.Investigator) {
                getUserInfoByEmailInUserInfoAD(siteCollectionUrl,formData.Investigator.EMail).then((userInfosRes) => {
                    if (Array.isArray(userInfosRes) && userInfosRes.length > 0) {
                        setInvestigatorName(userInfosRes[0].hr_jobcode);
                        setInvestigatorJobTitle(formData.Author.Title);
                    }
                }).catch((err) => {
                    console.error('getUserInfoByEmailInUserInfoAD error')
                    console.error(err)
                });
            }
            
        }
    }, [formData])
return <>
    <div style={{color:'black'}}>
        {index == 0 &&
            <div style={{width:'1000px', margin:'0 auto'}}>
                <div className="form-row mb-3">
                    <div style={{position:'absolute', width:'160px'}}>
                        <img src={require('./image/fuhongLogo.png')} style={{ width: '100%' }} />
                    </div>
                    
                    <div className={`col-12 font-weight-bold ${styles.header}`}>
                        外界人士意外填報表(一)
                    </div>
                    <div className={`col-12 ${styles.header}`}>
                        服務單位 {formData.ServiceLocation != null ? formData.ServiceLocation : ''}
                    </div>
                </div>
                <div className="form-row mb-3" style={{fontSize:'18px', fontWeight:'bold'}}>
                    <div className={`col-12`}>
                    1.	基本資料
                    </div>
                </div>
                <div className="form-row mb-3" style={{fontSize:'18px'}}>
                    <div className={`col-12`}>
                        <table style={{width:'900px', margin:'0 auto'}}>
                            <tr>
                                <td style={{width:'200px'}}>姓名: (英文)</td>
                                <td style={{borderBottom:'1px solid', width:'250px'}}>{formData.ServiceUserNameEN != null ? formData.ServiceUserNameEN : ''}</td>
                                <td>&nbsp;&nbsp;(中文)</td>
                                <td style={{borderBottom:'1px solid', width:'250px'}}>{formData.ServiceUserNameTC != null ? formData.ServiceUserNameTC : ''}</td>
                            </tr>
                            <tr>
                                <td style={{width:'200px'}}>年齡: </td>
                                <td style={{borderBottom:'1px solid', width:'250px'}}>
                                {formData.ServiceUserAge != null ? formData.ServiceUserAge : ''}
                                </td>
                                <td style={{width:'200px'}}>&nbsp;&nbsp;性別:</td>
                                <td style={{borderBottom:'1px solid', width:'250px'}}>
                                    {formData.ServiceUserGender == "male" && <span>男</span>}
                                    {formData.ServiceUserGender == "female" && <span>女</span>}

                                </td>
                            </tr>
                            <tr>
                                <td style={{width:'200px'}}>身份： </td>
                                <td colSpan={3}>
                                    {formData.ServiceUserIdentity == "visitor"  && <span>&#9745;</span>}
                                    {formData.ServiceUserIdentity != "visitor" && <span>&#9744;</span>}
                                    訪客&nbsp;&nbsp;
                                    {formData.ServiceUserIdentity == "family"  && <span>&#9745;</span>}
                                    {formData.ServiceUserIdentity != "family" && <span>&#9744;</span>}
                                    家屬&nbsp;&nbsp;
                                    {formData.ServiceUserIdentity == "volunter"  && <span>&#9745;</span>}
                                    {formData.ServiceUserIdentity != "volunter" && <span>&#9744;</span>}
                                    義工&nbsp;&nbsp;
                                    {formData.ServiceUserIdentity == "intern"  && <span>&#9745;</span>}
                                    {formData.ServiceUserIdentity != "intern" && <span>&#9744;</span>}
                                    實習學生&nbsp;&nbsp;
                                    {formData.ServiceUserIdentity == "others"  && <span>&#9745;</span>}
                                    {formData.ServiceUserIdentity != "others" && <span>&#9744;</span>}
                                    其他 (請註明&nbsp;&nbsp;
                                    {formData.ServiceUserIdentityOther != null ? formData.ServiceUserIdentityOther : '____________________'})
                                </td>
                            </tr>
                            <tr>
                                <td style={{width:'200px'}}>意外發生日期及時間</td>
                                <td style={{borderBottom:'1px solid', width:'250px'}}>{formData.AccidentTime != null && new Date(formData.AccidentTime).getFullYear() + `-` +(`0`+(new Date(formData.AccidentTime).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(formData.AccidentTime).getDate()).slice(-2) + ` ` + (`0`+new Date(formData.AccidentTime).getHours()).slice(-2) + `:` + (`0`+new Date(formData.AccidentTime).getMinutes()).slice(-2)}
                                </td>
                                <td style={{width:'200px'}}>&nbsp;&nbsp;地點</td>
                                <td style={{borderBottom:'1px solid', width:'250px'}}>{formData.AccidentLocation != null ? formData.AccidentLocation : ''}</td>
                            </tr>
                        </table>
                    </div>
                    
                </div>
                <div className="form-row mb-3" style={{fontSize:'18px', fontWeight:'bold'}}>
                    <div className={`col-12`}>
                    2.	意外事件記錄
                    </div>
                </div>
                <div className="form-row mb-3" style={{fontSize:'18px', fontWeight:'bold', width:'1000px', margin:'0 auto'}}>
                    <div className={`col-12`} style={{padding:'0'}}>
                    2.1初步觀察的意外成因
                    </div>
                </div>
                <div className="form-row mb-3"  style={{fontSize:'18px'}}>
                    <table style={{width:'1000px', margin:'0 auto'}}>
                        <tr>
                            <td colSpan={2} style={{verticalAlign:'top', fontWeight:'bold'}}>
                            2.1.1環境因素（可選擇多項）
                            </td>
                            <td colSpan={2} style={{verticalAlign:'top', fontWeight:'bold'}}>
                            2.1.2其他因素
                            </td>
                        </tr>
                        <tr>
                            <td style={{width:'250px'}}>
                                {formData.EnvSlipperyGround  && <span>&#9745;</span>}
                                 {!formData.EnvSlipperyGround && <span>&#9744;</span>}
                                1.地面濕滑&nbsp;&nbsp;
                            </td>
                            <td style={{width:'250px'}}>
                                {formData.EnvUnevenGround && <span>&#9745;</span>}
                                {!formData.EnvUnevenGround && <span>&#9744;</span>}
                                2.地面不平&nbsp;&nbsp;
                            </td>
                            <td style={{width:'150px'}}>
                                請註明：
                            </td>
                            <td style={{width:'350px',borderBottom:'1px solid'}}>
                                {formData.OtherFactor != null ? formData.OtherFactor : ''}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {formData.EnvObstacleItems  && <span>&#9745;</span>}
                                 {!formData.EnvObstacleItems && <span>&#9744;</span>}
                                3.障礙物品&nbsp;&nbsp;
                            </td>
                            <td>
                                {formData.EnvInsufficientLight && <span>&#9745;</span>}
                                {!formData.EnvInsufficientLight && <span>&#9744;</span>}
                                4.光線不足&nbsp;&nbsp;
                            </td>
                            <td>
                            </td>
                            <td>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {formData.EnvNotEnoughSpace  && <span>&#9745;</span>}
                                {!formData.EnvNotEnoughSpace && <span>&#9744;</span>}
                                5.空間不足&nbsp;&nbsp;
                            </td>
                            <td>
                                {formData.EnvAcousticStimulation && <span>&#9745;</span>}
                                {!formData.EnvAcousticStimulation && <span>&#9744;</span>}
                                6.聲響刺激&nbsp;&nbsp;
                            </td>
                            <td>
                            </td>
                            <td>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {formData.EnvCollidedByOthers  && <span>&#9745;</span>}
                                {!formData.EnvCollidedByOthers && <span>&#9744;</span>}
                                7.被別人碰撞&nbsp;&nbsp;
                            </td>
                            <td>
                                {formData.EnvHurtByOthers  && <span>&#9745;</span>}
                                {!formData.EnvHurtByOthers  && <span>&#9744;</span>}
                                8.被別人傷害&nbsp;&nbsp;
                            </td>
                            <td>
                            </td>
                            <td>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                {formData.EnvImproperEquip  && <span>&#9745;</span>}
                                {!formData.EnvImproperEquip && <span>&#9744;</span>}
                                9.輔助器材使用不當 (如輪椅／便椅未上鎖)&nbsp;&nbsp;
                            </td>
                            <td>
                            </td>
                            <td>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {formData.EnvOther && <span>&#9745;</span>}
                                {!formData.EnvOther && <span>&#9744;</span>}
                                10.其他&nbsp;&nbsp;
                            </td>
                            <td style={{borderBottom:'1px solid'}}>
                                {formData.EnvOtherDescription != null ? <span style={{borderBottom:'1px solid',display: 'inline-block', width:'200px'}}>{formData.EnvOtherDescription}</span> : ''}
                            </td>
                            <td>
                            </td>
                        </tr>
                    </table>
                </div>
                <div className="form-row mb-3" style={{fontSize:'18px'}}>
                    <div className={`col-12`} style={{fontWeight:'bold'}}>
                    2.2事發過程:
                    </div>
                    <div className={`col-12`} >
                        <table>
                            <tr>
                                <td style={{verticalAlign:'top', borderBottom:'1px solid'}}>{formData.AccidentDetail != null ? formData.AccidentDetail : ''}</td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div className="form-row mb-3" style={{fontSize:'18px'}}>
                    <div className={`col-12`} style={{fontWeight:'bold'}}>
                    2.3	意外事件有否證人目擊事故發生經過? 
                    </div>
                    <div className={`col-12`} >
                        {!formData.Witness && <span>&#9745;</span>}
                        {formData.Witness && <span>&#9744;</span>}
                        沒有
                        
                    </div>
                    <div className={`col-12`} >
                        {formData.Witness && <span>&#9745;</span>}
                        {!formData.Witness && <span>&#9744;</span>}
                        有&nbsp;&nbsp;&nbsp;&nbsp;如有證人，請提供以下資料
                    </div>
                    <div className={`col-12`} style={{paddingLeft:'68px'}}>
                    證人姓名:&nbsp;&nbsp;{formData.WitnessName != null ? <span style={{borderBottom:'1px solid',display: 'inline-block', width:'200px'}}>{formData.WitnessName}</span> : '__________________'}
                    聯絡電話:&nbsp;&nbsp;{formData.WitnessPhone != null ? <span style={{borderBottom:'1px solid',display: 'inline-block', width:'200px'}}>{formData.WitnessPhone}</span> : '__________________'}
                    </div>
                </div>
                <div className="form-row mb-3" style={{fontSize:'18px'}}>
                    <div className={`col-12`}>
                        <table>
                            <tr>
                                <td style={{verticalAlign:'top', width:'380px', fontWeight:'bold'}}>
                                2.4 相片及CCTV記錄
                                </td>
                            </tr>
                            <tr>
                                <td style={{verticalAlign:'top'}}>
                                    <div>
                                    相片&nbsp;&nbsp;
                                    {formData.PhotoRecord && <span>&#9745;</span>}
                                    {!formData.PhotoRecord && <span>&#9744;</span>}
                                    有 (上載相片) &nbsp;&nbsp;
                                    {!formData.PhotoRecord && <span>&#9745;</span>}
                                    {formData.PhotoRecord && <span>&#9744;</span>}
                                    未能提供 &nbsp;&nbsp;
                                    </div>
                                    <div>
                                    CCTV記錄&nbsp;&nbsp;
                                    {formData.CctvRecord && <span>&#9745;</span>}
                                    {!formData.CctvRecord && <span>&#9744;</span>}
                                    有(註: 三個工作天內交總辦事處) &nbsp;&nbsp;
                                    {!formData.CctvRecord && <span>&#9745;</span>}
                                    {formData.CctvRecord && <span>&#9744;</span>}
                                    未能提供 &nbsp;&nbsp;
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div className="form-row mb-3" style={{fontSize:'18px'}}>
                    <div className={`col-12`} style={{fontWeight:'bold'}}>
                    3. 意外事件後之處理
                    </div>
                    <div className={`col-12`}> 
                        <table>
                            <tr style={{fontWeight:'bold'}}>
                                <td>
                                3.1 就診安排:
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={4}>
                                {formData.MedicalArrangement == "ARRANGEMENT_DOCTOR_VISIT" && <span>&#9745;</span>}
                                {formData.MedicalArrangement != "ARRANGEMENT_DOCTOR_VISIT" && <span>&#9744;</span>}
                                醫生到診&nbsp;&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={4}>
                                {formData.MedicalArrangement == "ARRANGEMENT_OUTPATIENT" && <span>&#9745;</span>}
                                {formData.MedicalArrangement != "ARRANGEMENT_OUTPATIENT" && <span>&#9744;</span>}
                                門診&nbsp;&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td>
                                {formData.MedicalArrangement == "ARRANGEMENT_EMERGENCY_DEPARTMENT" && <span>&#9745;</span>}
                                {formData.MedicalArrangement != "ARRANGEMENT_EMERGENCY_DEPARTMENT" && <span>&#9744;</span>}
                                急症室&nbsp;&nbsp;
                                </td>
                                <td>
                                醫院名稱&nbsp;&nbsp;
                                {formData.MedicalArrangementHospital != null ? <span style={{borderBottom:'1px solid',display: 'inline-block', width:'150px'}}>{formData.MedicalArrangementHospital}</span> : '__________________'}
                                </td>
                                <td>
                                到達時間:&nbsp;&nbsp;
                                {formData.HospitalArriveTime != null ? <span style={{borderBottom:'1px solid',display: 'inline-block', width:'150px'}}>
                                    {new Date(formData.HospitalArriveTime).getFullYear() + `-` +(`0`+(new Date(formData.HospitalArriveTime).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(formData.HospitalArriveTime).getDate()).slice(-2) + ` ` + (`0`+new Date(formData.HospitalArriveTime).getHours()).slice(-2) + `:` + + (`0`+new Date(formData.HospitalArriveTime).getMinutes()).slice(-2)}</span> : '__________________'}
                                </td>
                                <td>
                                離開時間:&nbsp;&nbsp;
                                {formData.HospitalLeaveTime != null ? <span style={{borderBottom:'1px solid',display: 'inline-block', width:'150px'}}>
                                    {new Date(formData.HospitalLeaveTime).getFullYear() + `-` +(`0`+(new Date(formData.HospitalLeaveTime).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(formData.HospitalLeaveTime).getDate()).slice(-2) + ` ` + (`0`+new Date(formData.HospitalLeaveTime).getHours()).slice(-2) + `:` + + (`0`+new Date(formData.HospitalLeaveTime).getMinutes()).slice(-2)}</span> : '__________________'}
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={4}>
                                {formData.MedicalArrangement == "ARRANGEMENT_EMERGENCY_REJECT" && <span>&#9745;</span>}
                                {formData.MedicalArrangement != "ARRANGEMENT_EMERGENCY_REJECT" && <span>&#9744;</span>}
                                拒絕就診&nbsp;&nbsp;
                                </td>
                            </tr>
                        </table>                   
                    </div>
                </div>
                <div className="form-row mb-3" style={{fontSize:'18px'}}>
                    <div className={`col-12`} >
                        <table>
                        <tr style={{fontWeight:'bold'}}>
                                <td>
                                3.2 報警處理:
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                {!formData.Police&& <span>&#9745;</span>}
                                {formData.Police && <span>&#9744;</span>}
                                沒有&nbsp;&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td >
                                {formData.Police && <span>&#9745;</span>}
                                {!formData.Police && <span>&#9744;</span>}
                                有&nbsp;&nbsp;
                                </td>
                                <td>
                                若有:日期及時間:&nbsp;&nbsp;
                                {formData.PoliceDateTime != null ? <span style={{borderBottom:'1px solid',display: 'inline-block', width:'150px'}}>
                                    {new Date(formData.PoliceDateTime).getFullYear() + `-` +(`0`+(new Date(formData.PoliceDateTime).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(formData.PoliceDateTime).getDate()).slice(-2) + ` ` + (`0`+new Date(formData.PoliceDateTime).getHours()).slice(-2) + `:` + + (`0`+new Date(formData.PoliceDateTime).getMinutes()).slice(-2)}</span> : '__________________'}
                                </td>
                                <td>
                                警署名稱:&nbsp;&nbsp;
                                {formData.PoliceStation != null ? <span style={{borderBottom:'1px solid',display: 'inline-block', width:'150px'}}>{formData.PoliceStation}</span> : '__________________'}
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>

                <div className="form-row mb-3" style={{fontSize:'18px'}}>
                    <div className={`col-12`} >
                        <table>
                        <tr style={{fontWeight:'bold'}}>
                                <td>
                                3.3家屬聯絡
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                {!formData.FamilyContact&& <span>&#9745;</span>}
                                {formData.FamilyContact && <span>&#9744;</span>}
                                沒有&nbsp;&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td >
                                {formData.FamilyContact && <span>&#9745;</span>}
                                {!formData.FamilyContact && <span>&#9744;</span>}
                                有&nbsp;&nbsp;
                                </td>
                                <td>
                                若有，通知家屬日期及時間:&nbsp;&nbsp;
                                {formData.FamilyContactDate != null ? <span style={{borderBottom:'1px solid',display: 'inline-block', width:'150px'}}>
                                    {new Date(formData.FamilyContactDate).getFullYear() + `-` +(`0`+(new Date(formData.FamilyContactDate).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(formData.FamilyContactDate).getDate()).slice(-2) + ` ` + (`0`+new Date(formData.FamilyContactDate).getHours()).slice(-2) + `:` + + (`0`+new Date(formData.FamilyContactDate).getMinutes()).slice(-2)}</span> : '__________________'}
                                </td>
                                <td>
                                與傷者關係:&nbsp;&nbsp;
                                {formData.FamilyRelationship != null ? <span style={{borderBottom:'1px solid',display: 'inline-block', width:'150px'}}>{formData.FamilyRelationship}</span> : '__________________'}
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                
                <div className="form-row mb-3" style={{fontSize:'18px'}}>
                    <div className={`col-12`}>
                        <table style={{width:'800px'}}>
                            <tr>
                                <td style={{width:'200px'}}>
                                填報人姓名及職級
                                </td>
                                <td style={{borderBottom:'1px solid', width:'200px'}}>
                                {reporterName} &nbsp;&nbsp;{reporterJobTitle}
                                </td>
                                <td style={{width:'200px'}}>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日期
                                </td>
                                <td style={{borderBottom:'1px solid', width:'200px'}}>
                                {new Date(formData.Created).getFullYear() + `-` +(`0`+(new Date(formData.Created).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(formData.Created).getDate()).slice(-2) + ` ` + (`0`+new Date(formData.Created).getHours()).slice(-2) + `:` + + (`0`+new Date(formData.Created).getMinutes()).slice(-2)}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                服務經理姓名
                                </td>
                                <td style={{borderBottom:'1px solid'}}>
                                {formData.SM != null && formData.SM.Title}
                                </td>
                                <td>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日期
                                </td>
                                <td style={{borderBottom:'1px solid'}}>
                                {new Date(formData.SMDate).getFullYear() + `-` +(`0`+(new Date(formData.SMDate).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(formData.SMDate).getDate()).slice(-2) + ` ` + (`0`+new Date(formData.SMDate).getHours()).slice(-2) + `:` + + (`0`+new Date(formData.SMDate).getMinutes()).slice(-2)}
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div className={`col-12`} style={{fontWeight:'bold'}}>
                    [此欄由高級物理治療師填寫]
                    </div>
                </div>
                <div className="form-row mb-3" style={{fontSize:'18px'}}>
                    <div className={`col-12`}>
                    交由 : <span style={{borderBottom:'1px solid',display: 'inline-block', width:'150px'}}>{formData.Investigator != null ? formData.Investigator.Title : '_________________'}&nbsp;</span>填寫「意外報告 (二)」
                    </div>
                </div>
                <div className="form-row mb-3" style={{fontSize:'18px'}}>
                    <div className={`col-12`}>
                        <table style={{width:'800px'}}>
                            <tr>
                                <td style={{width:'200px'}}>
                                高級物理治療師姓名
                                </td>
                                <td style={{borderBottom:'1px solid',width:'200px'}}>
                                {formData.SPT.Title}
                                </td>
                                <td style={{width:'200px'}}>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日期
                                </td>
                                <td style={{borderBottom:'1px solid',width:'200px'}}>
                                {new Date(formData.SPTDate).getFullYear() + `-` +(`0`+(new Date(formData.SPTDate).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(formData.SPTDate).getDate()).slice(-2) + ` ` + (`0`+new Date(formData.SPTDate).getHours()).slice(-2) + `:` + + (`0`+new Date(formData.SPTDate).getMinutes()).slice(-2)}
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        }
        {index == 1 &&
            <div>
                <div className="form-row mb-3">
                    <div style={{position:'absolute', width:'160px'}}>
                        <img src={require('./image/fuhongLogo.png')} style={{ width: '100%' }} />
                    </div>
                    <div className={`col-12 ${styles.header}`}>
                        扶康會 {formData.ServiceUserUnit != null ? formData.ServiceUserUnit : ''}
                    </div>
                    <div className={`col-12 font-weight-bold ${styles.header}`}>
                    外界人士意外填報表(二)
                    </div>
                    <div className={`col-12 font-weight-bold`} style={{textAlign:'right', fontSize:'15px'}}>
                        保險公司備案編號: {formData.InsuranceCaseNo != null ? <span style={{borderBottom:'1px solid'}}>{formData.InsuranceCaseNo}</span> : '____________'}
                    </div>
                    <div className={`col-12 font-weight-bold`} style={{textAlign:'right',fontSize:'18px'}}>
                        檔案編號: {formData.CaseNumber != null ? <span style={{borderBottom:'1px solid'}}>{formData.CaseNumber}</span> : '____________'}
                    </div>
                </div>
                <div className="form-row mb-3" style={{fontSize:'18px'}}>
                    <div className={`col-12`}>
                        意外性質&nbsp;&nbsp;&nbsp;&nbsp;
                        <span>&#9744;</span>
                        服務使用者意外&nbsp;&nbsp;&nbsp;&nbsp;
                        <span>&#9745;</span>
                        外界人士意外
                    </div>
                </div>
                <div className="form-row mb-3" style={{fontSize:'18px'}}>
                    <div className={`col-12 mb-2`} style={{fontSize:'18px'}}>
                        <table style={{width:'850px'}}>
                            <tr>
                                <td style={{width:'150px'}}>服務使用者姓名: (中文)</td>
                                <td style={{width:'200px', borderBottom:'1px solid'}}>{formData.ServiceUserNameCN != null ? formData.ServiceUserNameCN : ''}</td>
                                <td style={{width:'100px'}}>(英文)</td>
                                <td style={{width:'200px', borderBottom:'1px solid'}}>{formData.ServiceUserNameEN != null ? formData.ServiceUserNameEN : ''}</td>
                            </tr>
                        </table>
                    </div>
                    <div className={`col-12 mb-2`}>
                        <table style={{width:'750px'}}>
                            <tr>
                                <td style={{width:'50px'}}>年齡: </td>
                                <td style={{width:'150px',borderBottom:'1px solid'}}>{formData.ServiceUserAge != null ? formData.ServiceUserAge : ''}</td>
                                <td style={{width:'50px'}}>性別:</td>
                                <td style={{width:'200px'}}>{formData.ServiceUserGender == "male" && <span>男</span>}
                                    {formData.ServiceUserGender == "female" && <span>女</span>}</td>
                                <td style={{width:'100px'}}>服務單位</td>
                                <td style={{width:'200px',borderBottom:'1px solid'}}>{formData.ServiceUserUnit != null ? formData.ServiceUserUnit : ''}</td>
                            </tr>
                        </table>
                    </div>
                    <div className={`col-12 mb-2`}>
                        <table style={{width:'700px'}}>
                            <tr>
                                <td style={{width:'180px'}}>意外發生日期及時間</td>
                                <td style={{width:'200px',borderBottom:'1px solid'}}>{formData.AccidentTime != null && new Date(formData.AccidentTime).getFullYear() + `-` +(`0`+(new Date(formData.AccidentTime).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(formData.AccidentTime).getDate()).slice(-2) + ` ` + (`0`+new Date(formData.AccidentTime).getHours()).slice(-2) + `:` + + (`0`+new Date(formData.AccidentTime).getMinutes()).slice(-2)}
                                </td>
                                <td style={{width:'80px'}}>地點</td>
                                <td style={{width:'200px',borderBottom:'1px solid'}}>{formData.AccidentLocation != null ? formData.AccidentLocation : ''}</td>
                            </tr>
                        </table>
                    </div>
                    <div className={`col-12 mb-2`}>
                        <table style={{width:'500px'}}>
                            <tr>
                                <td style={{width:'200px'}}>收到「意外填報表」日期</td>
                                <td style={{width:'200px',borderBottom:'1px solid'}}>{formData.SubmitDate != null && new Date(formData.SubmitDate).getFullYear() + `-` +(`0`+(new Date(formData.SubmitDate).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(formData.SubmitDate).getDate()).slice(-2)}
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div className={`col-12 mb-2`}>
                        <table style={{width:'600px'}}>
                            <tr>
                                <td style={{width:'400px'}}>預計意外分析完成日期：(意外發生日期+1個月)</td>
                                <td style={{width:'200px', borderBottom:'1px solid'}}>{EstimatedPart2CompletionDate != null && new Date(EstimatedPart2CompletionDate).getFullYear() + `-` +(`0`+(new Date(EstimatedPart2CompletionDate).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(EstimatedPart2CompletionDate).getDate()).slice(-2)}
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div className="form-row" style={{fontSize:'18px'}}>
                    <div className={`col-12 mb-2`}>
                    意外性質
                    </div>
                </div>
                <div className="form-row mb-3" style={{fontSize:'18px'}}>
                    <div className={`col-12 mb-2`}>
                        <table>
                            <tr>
                                <td>
                                    {formTwentyData != null && formTwentyData.AccidentNatureFall  && <span>&#9745;</span>}
                                    {(formTwentyData == null|| !formTwentyData.AccidentNatureFall) && <span>&#9744;</span>}
                                    1 跌倒&nbsp;&nbsp;
                                    {formTwentyData != null && formTwentyData.AccidentNatureChok  && <span>&#9745;</span>}
                                    {(formTwentyData == null || !formTwentyData.AccidentNatureChok) && <span>&#9744;</span>}
                                    2 哽塞&nbsp;&nbsp;
                                    {formTwentyData != null && formTwentyData.AccidentNatureBehavior  && <span>&#9745;</span>}
                                    {(formTwentyData == null|| !formTwentyData.AccidentNatureBehavior) && <span>&#9744;</span>}
                                    3 服務使用者行為問題&nbsp;&nbsp;
                                    {formTwentyData != null && formTwentyData.AccidentNatureEnvFactor  && <span>&#9745;</span>}
                                    {(formTwentyData == null|| !formTwentyData.AccidentNatureEnvFactor) && <span>&#9744;</span>}
                                    4 環境因素&nbsp;&nbsp;
                                    {formTwentyData != null && formTwentyData.AccidentNatureOther  && <span>&#9745;</span>}
                                    {(formTwentyData == null|| !formTwentyData.AccidentNatureOther) && <span>&#9744;</span>}
                                    5 其他 : &nbsp;&nbsp;
                                    {formTwentyData != null && formTwentyData.AccidentNatureOtherRemark != null ? <span style={{borderBottom:'1px solid',display: 'inline-block', width:'150px'}}>{formTwentyData.AccidentNatureOtherRemark}</span> : '____________________'}
                                </td>    
                            </tr>
                        </table>
                    </div>
                </div>
                <div className="form-row" style={{fontSize:'18px'}}>
                    <div className={`col-12 mb-2`} style={{fontSize:'22px'}}>
                    意外成因
                    </div>
                    <div className={`col-12`}>
                    <span style={{borderBottom:'1px solid'}}>環境因素</span>
                    </div>
                    <div className={`col-12 mb-2`}>
                        <table>
                            <tr>
                                <td>
                                    {formTwentyData != null && formTwentyData.EnvFactorSlipperyGround  && <span>&#9745;</span>}
                                    {(formTwentyData == null|| !formTwentyData.EnvFactorSlipperyGround) && <span>&#9744;</span>}
                                    1 地面濕滑&nbsp;&nbsp;
                                    {formTwentyData != null && formTwentyData.EnvFactorUnevenGround  && <span>&#9745;</span>}
                                    {(formTwentyData == null|| !formTwentyData.EnvFactorUnevenGround) && <span>&#9744;</span>}
                                    2 地面不平&nbsp;&nbsp;
                                    {formTwentyData != null && formTwentyData.EnvFactorObstacleItems  && <span>&#9745;</span>}
                                    {(formTwentyData == null|| !formTwentyData.EnvFactorObstacleItems) && <span>&#9744;</span>}
                                    3 障礙物品&nbsp;&nbsp;
                                    {formTwentyData != null && formTwentyData.EnvFactorInsufficientLight  && <span>&#9745;</span>}
                                    {(formTwentyData == null|| !formTwentyData.EnvFactorInsufficientLight) && <span>&#9744;</span>}
                                    4 光線不足&nbsp;&nbsp;
                                    {formTwentyData != null && formTwentyData.EnvFactorNotEnoughSpace  && <span>&#9745;</span>}
                                    {(formTwentyData == null|| !formTwentyData.EnvFactorNotEnoughSpace) && <span>&#9744;</span>}
                                    5 空間不足&nbsp;&nbsp;
                                    {formTwentyData != null && formTwentyData.EnvFactorNoise  && <span>&#9745;</span>}
                                    {(formTwentyData == null|| !formTwentyData.EnvFactorNoise) && <span>&#9744;</span>}
                                    6 聲響刺激&nbsp;&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    {formTwentyData != null && formTwentyData.EnvFactorCollision  && <span>&#9745;</span>}
                                    {(formTwentyData == null|| !formTwentyData.EnvFactorCollision) && <span>&#9744;</span>}
                                    7 被別人碰撞&nbsp;&nbsp;
                                    {formTwentyData != null && formTwentyData.EnvFactorHurtByOthers  && <span>&#9745;</span>}
                                    {(formTwentyData == null|| !formTwentyData.EnvFactorHurtByOthers) && <span>&#9744;</span>}
                                    8 被別人傷害&nbsp;&nbsp;
                                    {formTwentyData != null && formTwentyData.EnvFactorAssistiveEquipment  && <span>&#9745;</span>}
                                    {(formTwentyData == null|| !formTwentyData.EnvFactorAssistiveEquipment) && <span>&#9744;</span>}
                                    9 輔助器材使用不當 (如輪椅／便椅未上鎖)&nbsp;&nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    {formTwentyData != null && formTwentyData.EnvFactorOther  && <span>&#9745;</span>}
                                    {(formTwentyData == null || !formTwentyData.EnvFactorOther) && <span>&#9744;</span>}
                                    10 其他&nbsp;&nbsp; (請註明
                                    {formTwentyData.EnvFactorOtherRemark != null ? <span style={{borderBottom:'1px solid',display: 'inline-block', width:'150px'}}>{formTwentyData.EnvFactorOtherRemark}</span> : '____________________'})
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div className={`col-12`}>
                    <span style={{borderBottom:'1px solid'}}>個人因素</span>
                    </div>
                    <div className={`col-12 mb-2`}>
                    <table>
                            <tr>
                                <td>
                                    {formTwentyData != null && formTwentyData.PersonalFactorEmotional  && <span>&#9745;</span>}
                                    {(formTwentyData == null || !formTwentyData.PersonalFactorEmotional) && <span>&#9744;</span>}
                                    1 情緒不穩&nbsp;&nbsp;
                                    {formTwentyData != null && formTwentyData.PersonalFactorImpatient  && <span>&#9745;</span>}
                                    {(formTwentyData == null || !formTwentyData.PersonalFactorImpatient) && <span>&#9744;</span>}
                                    2 心急致傷&nbsp;&nbsp;
                                    {formTwentyData != null && formTwentyData.PersonalFactorChok  && <span>&#9745;</span>}
                                    {(formTwentyData == null || !formTwentyData.PersonalFactorChok) && <span>&#9744;</span>}
                                    3 進食時哽塞&nbsp;&nbsp;
                                    {formTwentyData != null && formTwentyData.PersonalFactorUnsteadyWalk  && <span>&#9745;</span>}
                                    {(formTwentyData == null || !formTwentyData.PersonalFactorUnsteadyWalk) && <span>&#9744;</span>}
                                    4 步履不穩&nbsp;&nbsp;
                                    {formTwentyData != null && formTwentyData.PersonalFactorTwitch  && <span>&#9745;</span>}
                                    {(formTwentyData == null || !formTwentyData.PersonalFactorTwitch) && <span>&#9744;</span>}
                                    5 抽搐&nbsp;&nbsp;
                                    
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    {formTwentyData != null && formTwentyData.PersonalFactorOther  && <span>&#9745;</span>}
                                    {!formTwentyData.PersonalFactorOther && <span>&#9744;</span>}
                                    6 其他&nbsp;&nbsp;(請註明
                                    {formTwentyData != null && formTwentyData.PersonalFactorOtherRemark != null ? <span style={{borderBottom:'1px solid',display: 'inline-block', width:'150px'}}>{formTwentyData.PersonalFactorOtherRemark}</span> : '____________________'})
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div className="form-row" style={{fontSize:'18px', marginBottom:'20px'}}>
                    <div className={`col-12 mb-2`} >
                    意外發現之經過
                    </div>
                    <div className={`col-12`}>
                        <table>
                            <tr>
                                <td style={{borderBottom:'1px solid', padding:'0 10px'}}>
                                &nbsp;&nbsp;{formTwentyData != null && formTwentyData.AccidentalDiscovery != null ? formTwentyData.AccidentalDiscovery : ''}
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div className="form-row" style={{fontSize:'18px', marginBottom:'20px'}}>
                    <div className={`col-12 mb-2`} >
                    可能引致意外之因素
                    </div>
                    <div className={`col-12`}>
                        <table>
                            <tr>
                                <td style={{borderBottom:'1px solid', padding:'0 10px'}}>
                                &nbsp;&nbsp;{formTwentyData != null && formTwentyData.AccidentCauseFactor != null ? formTwentyData.AccidentCauseFactor : ''}
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div className="form-row" style={{fontSize:'18px', marginBottom:'20px'}}>
                    <div className={`col-12 mb-2`} >
                    建議
                    </div>
                    <div className={`col-12`}>
                        <table>
                            <tr>
                                <td style={{borderBottom:'1px solid', padding:'0 10px'}}>
                                &nbsp;&nbsp;{formTwentyData != null && formTwentyData.Suggestion != null ? formTwentyData.Suggestion: ''}
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div className="form-row" style={{fontSize:'18px'}}>
                    <div className={`col-12`}>
                        <table style={{width:'820px',margin:'80px 0 20px'}}>
                            <tr>
                                <td  style={{width:'200px'}}>
                                調查員姓名及職級
                                </td>
                                <td style={{width:'200px',borderBottom:'1px solid'}}>
                                {investigatorName},&nbsp;&nbsp;{investigatorJobTitle}
                                </td>
                                <td  style={{width:'200px'}}>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日期
                                </td>
                                <td style={{width:'200px', borderBottom:'1px solid'}}>
                                {formTwentyData != null && new Date(formTwentyData.Created).getFullYear() + `-` +(`0`+(new Date(formTwentyData.Created).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(formTwentyData.Created).getDate()).slice(-2)}
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div className={`col-12`}>
                    高級物理治療師建議
                    </div>
                    <div className={`col-12`}>
                        <table>
                            <tr>
                                <td style={{borderBottom:'1px solid'}}>
                                &nbsp;&nbsp;{formTwentyData != null && formTwentyData.SPTComment != null ? formTwentyData.SPTComment : ''}
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div className={`col-12`} style={{margin:'80px 0 20px'}}>
                        <table  style={{width:'820px',margin:'80px 0 20px'}}>
                            <tr>
                                <td  style={{width:'200px'}}>
                                高級物理治療師簽署
                                </td>
                                <td style={{width:'200px', borderBottom:'1px solid'}}>
                                {formTwentyData != null && formTwentyData.SPT.Title != null ? formTwentyData.SPT.Title : ''}
                                </td>
                                <td  style={{width:'200px'}}>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日期
                                </td>
                                <td style={{width:'200px', borderBottom:'1px solid'}}>
                                {formTwentyData != null && formTwentyData.SPTDate != null ? new Date(formTwentyData.SPTDate).getFullYear() + `-` +(`0`+(new Date(formTwentyData.SPTDate).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(formTwentyData.SPTDate).getDate()).slice(-2) : ''}
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        }
        {index == 2 &&
        <div>
            <div className="form-row mb-3">
                <div style={{position:'absolute', width:'160px'}}>
                    <img src={require('./image/fuhongLogo.png')} style={{ width: '100%' }} />
                </div>
                
                <div className={`col-12 font-weight-bold ${styles.header}`}>
                外界人士意外填報表(三)
                </div>
                <div className={`col-12 ${styles.header}`}>
                    服務單位 {formData.ServiceUserUnit != null ? formData.ServiceUserUnit : ''}
                </div>
                <div className={`col-12 font-weight-bold`} style={{textAlign:'right', fontSize:'15px'}}>
                    保險公司備案編號: {formData.InsuranceCaseNo != null ? <span style={{borderBottom:'1px solid',display: 'inline-block', width:'150px'}}>{formData.InsuranceCaseNo}</span> : '____________'}
                </div>
                <div className={`col-12 font-weight-bold`} style={{textAlign:'right',fontSize:'18px'}}>
                    檔案編號: {formData.CaseNumber != null ? <span style={{borderBottom:'1px solid',display: 'inline-block', width:'200px'}}>{formData.CaseNumber}</span> : '____________'}
                </div>
            </div>
            <div className="form-row mb-3" style={{fontSize:'18px'}}>
                <div className={`col-12`}>
                    意外性質&nbsp;&nbsp;&nbsp;&nbsp;
                    <span>&#9744;</span>
                    服務使用者意外&nbsp;&nbsp;&nbsp;&nbsp;
                    <span>&#9745;</span>
                    外界人士意外
                </div>
            </div>
            <div className="form-row mb-3" style={{fontSize:'18px'}}>
                <div className={`col-12 mb-2`} style={{fontSize:'18px'}}>
                    <table style={{width:'850px'}}>
                        <tr>
                            <td style={{width:'150px'}}>發生意外者姓名</td>
                            <td style={{width:'200px', borderBottom:'1px solid'}}>{formData.ServiceUserNameCN != null ? formData.ServiceUserNameCN : ''}</td>
                            <td style={{width:'100px'}}>發生意外日期</td>
                            <td style={{width:'200px', borderBottom:'1px solid'}}>
                            {formData.AccidentTime != null && new Date(formData.AccidentTime).getFullYear() + `-` +(`0`+(new Date(formData.AccidentTime).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(formData.AccidentTime).getDate()).slice(-2) + ` ` + (`0`+new Date(formData.AccidentTime).getHours()).slice(-2) + `:` + + (`0`+new Date(formData.AccidentTime).getMinutes()).slice(-2)}
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            <div className="form-row mb-3" style={{fontSize:'18px'}}>
                <div className={`col-12 mb-2 ${styles.tableBorder}`}>
                    <table >
                        <tr>
                            <td colSpan={3} style={{textAlign:'center'}}>意外跟進行動表</td>
                        </tr>
                        <tr>
                            <td>意外報告的跟進措施</td>
                            <td>執行時段</td>
                            <td>備註</td>
                        </tr>
                        {followUpActions != null && followUpActions.map(function(item, i){
                            return (<tr>
                            <td>{item.action}</td>
                            <td>{new Date(item.date).getFullYear() + `-` +(`0`+(new Date(item.date).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(item.date).getDate()).slice(-2)}</td>
                            <td>{item.remark}</td>
                            </tr>)
                            })
                        }
                    </table>
                </div>
            </div>
            <div className="form-row mb-3" style={{fontSize:'18px'}}>
                <div className={`col-12`}>
                    {formTwentyOneData != null && formTwentyOneData[0].AccidentalFollowUpContinue && <span>&#9745;</span>}
                    {formTwentyOneData != null && !formTwentyOneData[0].AccidentalFollowUpContinue && <span>&#9744;</span>}
                    意外跟進繼續&nbsp;&nbsp;
                    {formTwentyOneData != null && !formTwentyOneData[0].AccidentalFollowUpContinue && <span>&#9745;</span>}
                    {formTwentyOneData != null && formTwentyOneData[0].AccidentalFollowUpContinue && <span>&#9744;</span>}
                    意外跟進結束
                </div>
            </div>
            <div className="form-row" style={{fontSize:'18px'}}>
                <div className={`col-12`}>
                    <table style={{width:'870px',margin:'40px 0 20px'}}>
                        <tr>
                            <td  style={{width:'250px'}}>
                            高級服務經理/服務經理姓名
                            </td>
                            <td style={{width:'200px',borderBottom:'1px solid'}}>
                            {formTwentyOneData != null && formTwentyOneData[0].SM.Title}
                            </td>
                            <td  style={{width:'200px'}}>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日期
                            </td>
                            <td style={{width:'200px',borderBottom:'1px solid'}}>
                            {formTwentyOneData != null && formTwentyOneData[0].SMDate != null && new Date(formTwentyOneData[0].SMDate).getFullYear() + `-` +(`0`+(new Date(formTwentyOneData[0].SMDate).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(formTwentyOneData[0].SMDate).getDate()).slice(-2)}
                            </td>
                        </tr>
                    </table>
                </div>
                <div className={`col-12`}>
                    評語
                </div>
                <div className={`col-12`}>
                    <table>
                        <tr>
                            <td style={{borderBottom:'1px solid'}}>
                            {formTwentyOneData != null && formTwentyOneData[0].SMComment != null ? formTwentyOneData[0].SMComment : ''}
                            </td>
                        </tr>
                    </table>
                </div>
                <div className={`col-12`}>
                    <table style={{width:'870px',margin:'40px 0 20px'}}>
                        <tr>
                            <td  style={{width:'250px'}}>
                            服務總監姓名
                            </td>
                            <td style={{width:'200px',borderBottom:'1px solid'}}>
                            {formTwentyOneData != null && formTwentyOneData[0].SD.Title}
                            </td>
                            <td  style={{width:'200px'}}>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日期
                            </td>
                            <td style={{width:'200px',borderBottom:'1px solid'}}>
                            {formTwentyOneData != null && formTwentyOneData[0].SDDate != null && new Date(formTwentyOneData[0].SDDate).getFullYear() + `-` +(`0`+(new Date(formTwentyOneData[0].SDDate).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(formTwentyOneData[0].SDDate).getDate()).slice(-2)}
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        }
    </div>
</>
}