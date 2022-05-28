import * as React from 'react'
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { Role } from '../../utils/RoleParser';
import useUserInfoAD from '../../hooks/useUserInfoAD';
import useUserInfo from '../../hooks/useUserInfo';
import { IUser } from '../../interface/IUser';
import useSharePointGroup from '../../hooks/useSharePointGroup';
import styles from './ServiceUserAccidentFormPrint.module.scss';
import { JSONParser } from '@pnp/pnpjs';


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
    console.log('index :', index);
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
return <>
    <div style={{color:'black'}}>
        {index == 0 &&
            <div>
                <div className="form-row mb-3">
                    <div style={{position:'absolute', width:'160px'}}>
                        <img src={require('./image/fuhongLogo.png')} style={{ width: '100%' }} />
                    </div>
                    
                    <div className={`col-12 font-weight-bold ${styles.header}`}>
                        服務使用者意外填報表(一)
                    </div>
                    <div className={`col-12 ${styles.header}`}>
                        服務單位 {formData.ServiceUserUnit != null ? formData.ServiceUserUnit : ''}
                    </div>
                </div>
                <div className="form-row mb-3" style={{fontSize:'18px'}}>
                    <div className={`col-12 ${styles.tableBorder}`}>
                        <table>
                            <tr>
                                <td>服務使用者姓名: (英文)</td>
                                <td>{formData.ServiceUserNameEN != null ? formData.ServiceUserNameEN : ''}</td>
                                <td>服務使用者姓名: (中文)</td>
                                <td>{formData.ServiceUserNameCN != null ? formData.ServiceUserNameCN : ''}</td>
                            </tr>
                            <tr>
                                <td>年齡: {formData.ServiceUserAge != null ? formData.ServiceUserAge : ''}</td>
                                <td>性別:
                                    {formData.ServiceUserGender == "male" && <span>&#9745;</span>}
                                    {formData.ServiceUserGender != "male" && <span>&#9744;</span>}
                                    男&nbsp;&nbsp;
                                    {formData.ServiceUserGender == "female" && <span>&#9745;</span>}
                                    {formData.ServiceUserGender != "female" && <span>&#9744;</span>}
                                    女
                                </td>
                                <td>服務使用者檔案號碼</td>
                                <td>{formData.ServiceUserId != null ? formData.ServiceUserId : ''}</td>
                            </tr>
                            <tr>
                                <td>接受服務類別</td>
                                <td>{formData.ServiceCategory != null ? formData.ServiceCategory : ''}</td>
                                <td>接受服務類別</td>
                                <td>
                                    {formData.ServiceCategory == "住宿" && <span>&#9745;</span>}
                                    {formData.ServiceCategory != "住宿" && <span>&#9744;</span>}
                                    住宿&nbsp;&nbsp;
                                    {formData.ServiceCategory == "日間" && <span>&#9745;</span>}
                                    {formData.ServiceCategory != "日間" && <span>&#9744;</span>}
                                    日間&nbsp;&nbsp;
                                    {formData.ServiceCategory == "暫宿" && <span>&#9745;</span>}
                                    {formData.ServiceCategory != "暫宿" && <span>&#9744;</span>}
                                    暫宿&nbsp;&nbsp;
                                    {formData.ServiceCategory == "其他" && <span>&#9745;</span>}
                                    {formData.ServiceCategory != "其他" && <span>&#9744;</span>}
                                    其他
                                </td>
                            </tr>
                            <tr>
                                <td>意外發生日期及時間</td>
                                <td>{formData.AccidentTime != null && new Date(formData.AccidentTime).getFullYear() + `-` +(`0`+(new Date(formData.AccidentTime).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(formData.AccidentTime).getDate()).slice(-2) + ` ` + (`0`+new Date(formData.AccidentTime).getHours()).slice(-2) + `:` + + (`0`+new Date(formData.AccidentTime).getMinutes()).slice(-2)}
                                </td>
                                <td>地點</td>
                                <td>{formData.AccidentLocation != null ? formData.AccidentLocation : ''}</td>
                            </tr>
                            <tr>
                                <td>是否使用輪椅</td>
                                <td>
                                    {formData.Wheelchair && <span>&#9745;</span>}
                                    {!formData.Wheelchair && <span>&#9744;</span>}
                                    是&nbsp;&nbsp;
                                    {!formData.Wheelchair && <span>&#9745;</span>}
                                    {formData.Wheelchair && <span>&#9744;</span>}
                                    否
                                    </td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>智力障礙程度</td>
                                <td>
                                
                                    {formData.Intelligence == "MILD"&& "輕度"}
                                    {formData.Intelligence == "MODERATE"&& "中度"}
                                    {formData.Intelligence == "SEVERE"&& "嚴重"}
                                    {formData.Intelligence == "EXTREME_SEVERE"&& "極度嚴重"}
                                    {formData.Intelligence == "UNKNOWN"&& "不知"}
                                    </td>
                                <td>自閉症譜系障礙 (ASD)</td>
                                <td>
                                    {formData.ASD && <span>&#9745;</span>}
                                    {!formData.ASD && <span>&#9744;</span>}
                                    是&nbsp;&nbsp;
                                    {!formData.ASD && <span>&#9745;</span>}
                                    {formData.ASD && <span>&#9744;</span>}
                                    否
                                </td>
                            </tr>
                        </table>
                    </div>
                    
                </div>
                <div className="form-row mb-3" style={{fontSize:'18px', fontWeight:'bold'}}>
                    <div className={`col-12`}>
                    1.	意外事件紀錄
                    </div>
                    
                </div>
                <div style={{fontSize:'18px'}}>
                    <table>
                        <tr>
                            <td style={{verticalAlign:'top'}}>
                            1.1服務使用者意外時情況
                            </td>
                            <td>
                                <div>
                                    {formData.Circumstance == "SCENARIO_SLEEPING"  && <span>&#9745;</span>}
                                    {formData.Circumstance != "SCENARIO_SLEEPING" && <span>&#9744;</span>}
                                    睡覺&nbsp;&nbsp;
                                    {formData.Circumstance == "SCENARIO_DINNING" && <span>&#9745;</span>}
                                    {formData.Circumstance != "SCENARIO_DINNING" && <span>&#9744;</span>}
                                    進食&nbsp;&nbsp;
                                    {formData.Circumstance == "SCENARIO_WASHING" && <span>&#9745;</span>}
                                    {formData.Circumstance != "SCENARIO_WASHING" && <span>&#9744;</span>}
                                    梳洗&nbsp;&nbsp;
                                    {formData.Circumstance == "SCENARIO_TOLIET" && <span>&#9745;</span>}
                                    {formData.Circumstance != "SCENARIO_TOLIET" && <span>&#9744;</span>}
                                    如廁&nbsp;&nbsp;
                                    {formData.Circumstance == "SCENARIO_BATHING" && <span>&#9745;</span>}
                                    {formData.Circumstance != "SCENARIO_BATHING" && <span>&#9744;</span>}
                                    洗澡&nbsp;&nbsp;
                                    {formData.Circumstance == "SCENARIO_WALKING" && <span>&#9745;</span>}
                                    {formData.Circumstance != "SCENARIO_WALKING" && <span>&#9744;</span>}
                                    步行期間&nbsp;&nbsp;
                                </div>
                                <div>
                                    {formData.Circumstance == "SCENARIO_INSIDE_ACTIVITY"  && <span>&#9745;</span>}
                                    {formData.Circumstance != "SCENARIO_INSIDE_ACTIVITY" && <span>&#9744;</span>}
                                    參與服務單位內活動&nbsp;&nbsp;
                                    {formData.Circumstance == "SCENARIO_OUTSIDE_ACTIVITY"  && <span>&#9745;</span>}
                                    {formData.Circumstance != "SCENARIO_OUTSIDE_ACTIVITY" && <span>&#9744;</span>}
                                    外出活動期間(請註明地點 :&nbsp;&nbsp;
                                    {formData.CircumstanceLocation != null ? formData.CircumstanceLocation : '____________________'})
                                </div>
                                <div>
                                    {formData.Circumstance == "SCENARIO_OTHER"  && <span>&#9745;</span>}
                                    {formData.Circumstance != "SCENARIO_OTHER" && <span>&#9744;</span>}
                                    其他 (請註明&nbsp;&nbsp;
                                    {formData.CircumstanceOtherRemark != null ? formData.CircumstanceOtherRemark : '____________________'})
                                </div>
                            </td>
                        </tr>
                    </table>
                    <table>
                        <tr>
                            <td style={{verticalAlign:'top', width:'380px'}}>
                            1.2 服務使用者受傷部位<span style={{fontSize:'14px'}}>（如有受傷，可選擇多項）</span>
                            </td>
                            <td>
                                <div>
                                    {formData.InjuredArea == "INJURY_HEAD"  && <span>&#9745;</span>}
                                    {formData.InjuredArea != "INJURY_HEAD" && <span>&#9744;</span>}
                                    頭部&nbsp;&nbsp;
                                    {formData.InjuredArea == "INJURY_NECK" && <span>&#9745;</span>}
                                    {formData.InjuredArea != "INJURY_NECK" && <span>&#9744;</span>}
                                    頸部&nbsp;&nbsp;
                                    {formData.InjuredArea == "INJURY_BODY" && <span>&#9745;</span>}
                                    {formData.InjuredArea != "INJURY_BODY" && <span>&#9744;</span>}
                                    軀幹&nbsp;&nbsp;
                                    {formData.InjuredArea == "INJURY_UPPER_LIMB" && <span>&#9745;</span>}
                                    {formData.InjuredArea != "INJURY_UPPER_LIMB" && <span>&#9744;</span>}
                                    上肢&nbsp;&nbsp;
                                    {formData.InjuredArea == "INJURY_LOWER_LIMB" && <span>&#9745;</span>}
                                    {formData.InjuredArea != "INJURY_LOWER_LIMB" && <span>&#9744;</span>}
                                    下肢&nbsp;&nbsp;
                                </div>
                                <div>
                                    {formData.InjuredArea == "INJURY_OTHER"  && <span>&#9745;</span>}
                                    {formData.InjuredArea != "INJURY_OTHER" && <span>&#9744;</span>}
                                    其他 (請註明&nbsp;&nbsp;
                                    {formData.InjuredAreaOtherRemark != null ? formData.InjuredAreaOtherRemark : '____________________'})
                                </div>
                            </td>
                        </tr>
                    </table>
                    <table>
                        <tr>
                            <td rowSpan={2} style={{verticalAlign:'top', width:'380px'}}>
                            1.3 服務使用者意外後有否身體不適／受傷：<div style={{fontSize:'14px'}}>可選擇多項</div>
                            </td>
                            <td style={{verticalAlign:'top'}}>
                                {formData.UnwellAfterInjured == 'SERVICE_USER_UNCOMFORT_TRUE' && <span>&#9745;</span>}
                                {formData.UnwellAfterInjured == 'SERVICE_USER_UNCOMFORT_FALSE' && <span>&#9744;</span>}
                                是&nbsp;&nbsp;
                            </td>
                            <td>
                                <div>
                                    {formData.UnwellAfterInjuredOther == "UNCOMFORTABLE_BLEEDING"  && <span>&#9745;</span>}
                                    {formData.UnwellAfterInjuredOther != "UNCOMFORTABLE_BLEEDING" && <span>&#9744;</span>}
                                    流血&nbsp;&nbsp;
                                    {formData.UnwellAfterInjuredOther == "UNCOMFORTABLE_BRUISE"  && <span>&#9745;</span>}
                                    {formData.UnwellAfterInjuredOther != "UNCOMFORTABLE_BRUISE" && <span>&#9744;</span>}
                                    瘀腫&nbsp;&nbsp;
                                    {formData.UnwellAfterInjuredOther == "UNCOMFORTABLE_FRACTURE"  && <span>&#9745;</span>}
                                    {formData.UnwellAfterInjuredOther != "UNCOMFORTABLE_FRACTURE" && <span>&#9744;</span>}
                                    骨折&nbsp;&nbsp;
                                    {formData.UnwellAfterInjuredOther == "UNCOMFORTABLE_DIZZY"  && <span>&#9745;</span>}
                                    {formData.UnwellAfterInjuredOther != "UNCOMFORTABLE_DIZZY" && <span>&#9744;</span>}
                                    暈眩&nbsp;&nbsp;
                                    {formData.UnwellAfterInjuredOther == "UNCOMFORTABLE_SHOCK"  && <span>&#9745;</span>}
                                    {formData.UnwellAfterInjuredOther != "UNCOMFORTABLE_SHOCK" && <span>&#9744;</span>}
                                    休克/失去知覺&nbsp;&nbsp;
                                </div>
                                <div>
                                    {formData.UnwellAfterInjuredOther == "UNCOMFORTABLE_OTHER"  && <span>&#9745;</span>}
                                    {formData.UnwellAfterInjuredOther != "UNCOMFORTABLE_OTHER" && <span>&#9744;</span>}
                                    其他 (請註明&nbsp;&nbsp;
                                    {formData.InjuredAreaOtherRemark != null ? formData.InjuredAreaOtherRemark : '____________________'})
                                </div>
                                <div>
                                    受傷情況 : &nbsp;&nbsp;
                                    {formData.UnwellAfterInjuredDescription != null ? formData.UnwellAfterInjuredDescription : '____________________'})
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td style={{verticalAlign:'top'}}>
                                {formData.UnwellAfterInjured == 'SERVICE_USER_UNCOMFORT_FALSE' && <span>&#9745;</span>}
                                {formData.UnwellAfterInjured == 'SERVICE_USER_UNCOMFORT_TRUE' && <span>&#9744;</span>}
                                否&nbsp;&nbsp;
                            </td>
                            <td></td>
                        </tr>
                    </table>
                    <table>
                        <tr>
                            <td rowSpan={2} style={{verticalAlign:'top', width:'380px'}}>
                            1.4 服務使用者有否出現不安全的行為：<div style={{fontSize:'14px'}}>可選擇多項</div>
                            </td>
                            <td style={{verticalAlign:'top'}}>
                                {formData.UnsafeBehaviors == 'BEHAVIOR_SWITCH_TRUE' && <span>&#9745;</span>}
                                {formData.UnsafeBehaviors == 'BEHAVIOR_SWITCH_FALSE' && <span>&#9744;</span>}
                                是&nbsp;&nbsp;
                            </td>
                            <td>
                                <div>
                                    {formData.UnsafeBehaviorsChoices != null && formData.UnsafeBehaviorsChoices.indexOf("BEHAVIOR_OTHERS") > -1  && <span>&#9745;</span>}
                                    {(formData.UnsafeBehaviorsChoices == null || (formData.UnsafeBehaviorsChoices != null && formData.UnsafeBehaviorsChoices.indexOf("BEHAVIOR_OTHERS") == -1)) && <span>&#9744;</span>}
                                    傷害他人的動作&nbsp;&nbsp;
                                    {formData.UnsafeBehaviorsChoices != null && formData.UnsafeBehaviorsChoices.indexOf("BEHAVIOR_SELF") > -1  && <span>&#9745;</span>}
                                    {(formData.UnsafeBehaviorsChoices == null || (formData.UnsafeBehaviorsChoices != null && formData.UnsafeBehaviorsChoices.indexOf("BEHAVIOR_SELF") == -1)) && <span>&#9744;</span>}
                                    傷害自已的動作&nbsp;&nbsp;
                                </div>
                                <div>
                                    {formData.UnsafeBehaviorsChoices != null && formData.UnsafeBehaviorsChoices.indexOf("BEHAVIOR_GETOFF") > -1  && <span>&#9745;</span>}
                                    {(formData.UnsafeBehaviorsChoices == null || (formData.UnsafeBehaviorsChoices != null && formData.UnsafeBehaviorsChoices.indexOf("BEHAVIOR_GETOFF") == -1)) && <span>&#9744;</span>}
                                    除去身上的醫療器材&nbsp;&nbsp;
                                    {formData.UnsafeBehaviorsChoices != null && formData.UnsafeBehaviorsChoices.indexOf("BEHAVIOR_REJECT") > -1  && <span>&#9745;</span>}
                                    {(formData.UnsafeBehaviorsChoices == null || (formData.UnsafeBehaviorsChoices != null && formData.UnsafeBehaviorsChoices.indexOf("BEHAVIOR_REJECT") == -1)) && <span>&#9744;</span>}
                                    拒絕使用輔助器材&nbsp;&nbsp;
                                </div>
                                <div>
                                    {formData.UnsafeBehaviorsChoices != null && formData.UnwellAfterInjuredOther == "UNCOMFORTABLE_OTHER"  && <span>&#9745;</span>}
                                    {(formData.UnsafeBehaviorsChoices == null || (formData.UnsafeBehaviorsChoices != null && formData.UnsafeBehaviorsChoices.indexOf("BEHAVIOR_OTHER") == -1)) && <span>&#9744;</span>}
                                    其他 (請註明&nbsp;&nbsp;
                                    {formData.InjuredAreaOtherRemark != null ? formData.InjuredAreaOtherRemark : '____________________'})
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td style={{verticalAlign:'top'}}>
                                {formData.UnsafeBehaviors == "BEHAVIOR_SWITCH_FALSE" && <span>&#9745;</span>}
                                {formData.UnsafeBehaviors == "BEHAVIOR_SWITCH_TRUE" && <span>&#9744;</span>}
                                否&nbsp;&nbsp;
                            </td>
                            <td></td>
                        </tr>
                    </table>
                    <table>
                        <tr>
                            <td rowSpan={2} style={{verticalAlign:'top', width:'380px'}}>
                            1.5 相片及CCTV記錄
                            </td>
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
                <div className="form-row mb-3" style={{fontSize:'18px'}}>
                    <div className={`col-12`} style={{fontWeight:'bold'}}>
                    2. 初步觀察的意外成因<span style={{fontWeight:'normal'}}>（可選擇多項）</span>
                    </div>
                    <div className={`col-12`}> 
                        <table>
                            <tr style={{fontWeight:'bold'}}>
                                <td>
                                2.1 (a) 環境因素：
                                </td>
                                <td>
                                (b) 個人因素：
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div>
                                        {formData.ObserveEnvironmentFactor != null && formData.ObserveEnvironmentFactor.indexOf("ENV_SLIPPERY_GROUND") > -1  && <span>&#9745;</span>}
                                        {(formData.ObserveEnvironmentFactor == null || (formData.ObserveEnvironmentFactor != null && formData.ObserveEnvironmentFactor.indexOf("ENV_SLIPPERY_GROUND") == -1)) && <span>&#9744;</span>}
                                        1 地面濕滑&nbsp;&nbsp;
                                        {formData.ObserveEnvironmentFactor != null && formData.ObserveEnvironmentFactor.indexOf("ENV_UNEVEN_GROUND") > -1  && <span>&#9745;</span>}
                                        {(formData.ObserveEnvironmentFactor == null || (formData.ObserveEnvironmentFactor != null && formData.ObserveEnvironmentFactor.indexOf("ENV_UNEVEN_GROUND") == -1)) && <span>&#9744;</span>}
                                        2 地面不平&nbsp;&nbsp;
                                        {formData.ObserveEnvironmentFactor != null && formData.ObserveEnvironmentFactor.indexOf("ENV_OBSTACLE_ITEMS") > -1  && <span>&#9745;</span>}
                                        {(formData.ObserveEnvironmentFactor == null || (formData.ObserveEnvironmentFactor != null && formData.ObserveEnvironmentFactor.indexOf("ENV_OBSTACLE_ITEMS") == -1)) && <span>&#9744;</span>}
                                        3 障礙物品&nbsp;&nbsp;
                                    </div>
                                    <div>
                                        {formData.ObserveEnvironmentFactor != null && formData.ObserveEnvironmentFactor.indexOf("ENV_INSUFFICIENT_LIGHT") > -1  && <span>&#9745;</span>}
                                        {(formData.ObserveEnvironmentFactor == null || (formData.ObserveEnvironmentFactor != null && formData.ObserveEnvironmentFactor.indexOf("ENV_INSUFFICIENT_LIGHT") == -1)) && <span>&#9744;</span>}
                                        4 光線不足&nbsp;&nbsp;
                                        {formData.ObserveEnvironmentFactor != null && formData.ObserveEnvironmentFactor.indexOf("ENV_NOT_ENOUGH_SPACE") > -1  && <span>&#9745;</span>}
                                        {(formData.ObserveEnvironmentFactor == null || (formData.ObserveEnvironmentFactor != null && formData.ObserveEnvironmentFactor.indexOf("ENV_NOT_ENOUGH_SPACE") == -1)) && <span>&#9744;</span>}
                                        5 空間不足&nbsp;&nbsp;
                                        {formData.ObserveEnvironmentFactor != null && formData.ObserveEnvironmentFactor.indexOf("ENV_ACOUSTIC_STIMULATION") > -1  && <span>&#9745;</span>}
                                        {(formData.ObserveEnvironmentFactor == null || (formData.ObserveEnvironmentFactor != null && formData.ObserveEnvironmentFactor.indexOf("ENV_ACOUSTIC_STIMULATION") == -1)) && <span>&#9744;</span>}
                                        6 聲響刺激&nbsp;&nbsp;
                                    </div>
                                    <div>
                                        {formData.ObserveEnvironmentFactor != null && formData.ObserveEnvironmentFactor.indexOf("ENV_COLLIDED_BY_OTHERS") > -1  && <span>&#9745;</span>}
                                        {(formData.ObserveEnvironmentFactor == null || (formData.ObserveEnvironmentFactor != null && formData.ObserveEnvironmentFactor.indexOf("ENV_COLLIDED_BY_OTHERS") == -1)) && <span>&#9744;</span>}
                                        7 被別人碰撞&nbsp;&nbsp;
                                        {formData.ObserveEnvironmentFactor != null && formData.ObserveEnvironmentFactor.indexOf("ENV_HURT_BY_OTHERS") > -1  && <span>&#9745;</span>}
                                        {(formData.ObserveEnvironmentFactor == null || (formData.ObserveEnvironmentFactor != null && formData.ObserveEnvironmentFactor.indexOf("ENV_HURT_BY_OTHERS") == -1)) && <span>&#9744;</span>}
                                        8 被別人傷害&nbsp;&nbsp;
                                    </div>
                                    <div>
                                        {formData.ObserveEnvironmentFactor != null && formData.ObserveEnvironmentFactor.indexOf("ENV_IMPROPER_USE_OF_ASSISTIVE_EQUIPMENT") > -1  && <span>&#9745;</span>}
                                        {(formData.ObserveEnvironmentFactor == null || (formData.ObserveEnvironmentFactor != null && formData.ObserveEnvironmentFactor.indexOf("ENV_IMPROPER_USE_OF_ASSISTIVE_EQUIPMENT") == -1)) && <span>&#9744;</span>}
                                        9 輔助器材使用不當 (如輪椅／便椅未上鎖)&nbsp;&nbsp;
                                    </div>
                                    <div>
                                        {formData.ObserveEnvironmentFactor != null && formData.ObserveEnvironmentFactor.indexOf("ENV_OTHER") > -1  && <span>&#9745;</span>}
                                        {(formData.ObserveEnvironmentFactor == null || (formData.ObserveEnvironmentFactor != null && formData.ObserveEnvironmentFactor.indexOf("ENV_OTHER") == -1)) && <span>&#9744;</span>}
                                        10 其他 (請註明&nbsp;&nbsp;
                                        {formData.ObserveEnvironmentFactorOther != null ? formData.ObserveEnvironmentFactorOther : '____________________'})
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        {formData.ObservePersonalFactor != null && formData.ObservePersonalFactor.indexOf("PERSONAL_EMOTIONAL_INSTABILITY") > -1  && <span>&#9745;</span>}
                                        {(formData.ObservePersonalFactor == null || (formData.ObservePersonalFactor != null && formData.ObservePersonalFactor.indexOf("PERSONAL_EMOTIONAL_INSTABILITY") == -1)) && <span>&#9744;</span>}
                                        1 情緒不穩&nbsp;&nbsp;
                                        {formData.ObservePersonalFactor != null && formData.ObservePersonalFactor.indexOf("PERSONAL_HEARTBROKEN") > -1  && <span>&#9745;</span>}
                                        {(formData.ObservePersonalFactor == null || (formData.ObservePersonalFactor != null && formData.ObservePersonalFactor.indexOf("PERSONAL_HEARTBROKEN") == -1)) && <span>&#9744;</span>}
                                        2 心急致傷&nbsp;&nbsp;
                                        {formData.ObservePersonalFactor != null && formData.ObservePersonalFactor.indexOf("PERSONAL_CHOKING") > -1  && <span>&#9745;</span>}
                                        {(formData.ObservePersonalFactor == null || (formData.ObservePersonalFactor != null && formData.ObservePersonalFactor.indexOf("PERSONAL_CHOKING") == -1)) && <span>&#9744;</span>}
                                        3 進食時哽塞&nbsp;&nbsp;
                                    </div>
                                    <div>
                                        {formData.ObservePersonalFactor != null && formData.ObservePersonalFactor.indexOf("PERSONAL_UNSTEADY_WALKING") > -1  && <span>&#9745;</span>}
                                        {(formData.ObservePersonalFactor == null || (formData.ObservePersonalFactor != null && formData.ObservePersonalFactor.indexOf("PERSONAL_UNSTEADY_WALKING") == -1)) && <span>&#9744;</span>}
                                        4 步履不穩&nbsp;&nbsp;
                                        {formData.ObservePersonalFactor != null && formData.ObservePersonalFactor.indexOf("PERSONAL_TWITCH") > -1  && <span>&#9745;</span>}
                                        {(formData.ObservePersonalFactor == null || (formData.ObservePersonalFactor != null && formData.ObservePersonalFactor.indexOf("PERSONAL_TWITCH") == -1)) && <span>&#9744;</span>}
                                        5 抽搐&nbsp;&nbsp;
                                    </div>
                                    <div>
                                        {formData.ObservePersonalFactor != null && formData.ObservePersonalFactor.indexOf("PERSONAL_OTHER") > -1  && <span>&#9745;</span>}
                                        {(formData.ObservePersonalFactor == null || (formData.ObservePersonalFactor != null && formData.ObservePersonalFactor.indexOf("PERSONAL_OTHER") == -1)) && <span>&#9744;</span>}
                                        6 其他個人因素 (請註明 :&nbsp;&nbsp;
                                        {formData.ObservePersonalFactorOther != null ? formData.ObservePersonalFactorOther : '____________________'})
                                    </div>
                                </td>
                            </tr>
                        </table>                   
                    </div>
                </div>
                <div className="form-row mb-3" style={{fontSize:'18px'}}>
                    <div className={`col-12`} style={{fontWeight:'bold'}}>
                    2.2事發過程
                    </div>
                    <div className={`col-12`} >
                        <table>
                            <tr>
                                <td style={{verticalAlign:'top', width:'380px'}}>(請註明事發地點附近之員工當時執行的職務)</td>
                                <td style={{verticalAlign:'top', borderBottom:'1px solid'}}>{formData.AccidentDetail != null ? formData.AccidentDetail : ''}</td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div className="form-row mb-3" style={{fontSize:'18px'}}>
                    <div className={`col-12`} style={{fontWeight:'bold'}}>
                    3.	意外事件後之治療處理
                    </div>
                    <div className={`col-12`} >
                        <table>
                            <tr>
                                <td style={{verticalAlign:'top', width:'330px'}}>3.1 服務單位即時治療/處理</td>
                                <td style={{fontSize:'15px',verticalAlign:'top', borderBottom:'1px solid'}}>{formData.TreatmentAfterAccident != null ? formData.TreatmentAfterAccident : ''}</td>
                            </tr>
                        </table>
                    </div>
                    <div className={`col-12`} >
                        <table>
                            <tr>
                                <td style={{verticalAlign:'top'}}>3.2 就診安排</td>
                                <td>
                                    {formData.MedicalArrangement == "ARRANGEMENT_DOCTOR_VISIT" && <span>&#9745;</span>}
                                    {formData.MedicalArrangement != "ARRANGEMENT_DOCTOR_VISIT" && <span>&#9744;</span>}
                                    醫生到診&nbsp;&nbsp;
                                    {formData.MedicalArrangement == "ARRANGEMENT_OUTPATIENT" && <span>&#9745;</span>}
                                    {formData.MedicalArrangement != "ARRANGEMENT_OUTPATIENT" && <span>&#9744;</span>}
                                    門診&nbsp;&nbsp;
                                    {formData.MedicalArrangement == "ARRANGEMENT_EMERGENCY_DEPARTMENT" && <span>&#9745;</span>}
                                    {formData.MedicalArrangement != "ARRANGEMENT_EMERGENCY_DEPARTMENT" && <span>&#9744;</span>}
                                    急症室&nbsp;&nbsp;(醫院名稱 :
                                    {formData.MedicalArrangementHospital != null ? <span style={{borderBottom:'1px solid',display: 'inline-block', width:'200px'}}>{formData.MedicalArrangementHospital}</span> : '____________________'})
                                </td>
                                <td>
                                    到達時間
                                </td>
                                <td style={{borderBottom:'1px solid'}}>
                                    {formData.MedicalArrangementDate != null && new Date(formData.MedicalArrangementDate).getFullYear() + `-` +(`0`+(new Date(formData.MedicalArrangementDate).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(formData.MedicalArrangementDate).getDate()).slice(-2) + ` ` + (`0`+new Date(formData.MedicalArrangementDate).getHours()).slice(-2) + `:` + + (`0`+new Date(formData.MedicalArrangementDate).getMinutes()).slice(-2)}
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td >提供予服務使用者的治療</td>
                                <td colSpan={2} style={{borderBottom:'1px solid'}}>
                                {formData.MedicalArrangementTreatment != null ? formData.MedicalArrangementTreatment : ''})
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div className={`col-12`} >
                        <table>
                            <tr>
                                <td style={{verticalAlign:'top'}}>3.3 是否在醫院留醫</td>
                                <td>
                                    {formData.StayInHospital == "IS_STAY_IN_HOSPITAL_TRUE" && <span>&#9745;</span>}
                                    {formData.StayInHospital != "IS_STAY_IN_HOSPITAL_TRUE" && <span>&#9744;</span>}
                                    是&nbsp;&nbsp; (醫院名稱：
                                    {formData.StayInHospitalName != null ? formData.StayInHospitalName : '____________________'})&nbsp;&nbsp;
                                    {formData.StayInHospital == "IS_STAY_IN_HOSPITAL_FALSE" && <span>&#9745;</span>}
                                    {formData.StayInHospital != "IS_STAY_IN_HOSPITAL_FALSE" && <span>&#9744;</span>}
                                    否&nbsp;&nbsp;
                                    {formData.StayInHospital == "IS_STAY_IN_HOSPITAL_FALSE" && <span>&#9745;</span>}
                                    {formData.StayInHospital != "IS_STAY_IN_HOSPITAL_FALSE" && <span>&#9744;</span>}
                                    不適用
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div className="form-row mb-3" style={{fontSize:'18px'}}>
                    <div className={`col-12`}>
                    <table>
                            <tr>
                                <td rowSpan={2} style={{verticalAlign:'top',fontWeight:'bold', width:'100px'}}>4.	報警處理</td>
                                <td style={{verticalAlign:'top'}}>
                                    {formData.CalledPolice && <span>&#9745;</span>}
                                    {!formData.CalledPolice && <span>&#9744;</span>}
                                    需要
                                </td>
                                <td style={{verticalAlign:'top'}}>
                                    <div>日期及時間&nbsp;&nbsp; {formData.CalledPoliceDate != null ? formData.CalledPoliceDate : '____________________'}</div>
                                    <div>報案編號&nbsp;&nbsp; {formData.CalledPoliceReportNumber != null ? formData.CalledPoliceReportNumber : '____________________'}&nbsp;&nbsp;&nbsp;&nbsp;
                                    警署&nbsp;&nbsp; {formData.CalledPoliceStation != null ? formData.CalledPoliceStation : '____________________'}</div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    {!formData.CalledPolice && <span>&#9745;</span>}
                                    {formData.CalledPolice && <span>&#9744;</span>}
                                    不需要
                                </td>
                            </tr>
                        </table>
                    
                    </div>
                </div>
                <div className="form-row mb-3" style={{fontSize:'18px'}}>
                    <div className={`col-12`}>
                    <table>
                            <tr>
                                <td style={{verticalAlign:'top',fontWeight:'bold', width:'400px'}}>5.   意外後中心即時應變措施</td>
                                <td style={{verticalAlign:'top'}}>
                                    {formData.ContingencyMeasure == "CONTINGENCY_MEASURE_FALSE" && <span>&#9745;</span>}
                                    {formData.ContingencyMeasure == "CONTINGENCY_MEASURE_TRUE" && <span>&#9744;</span>}
                                    沒有
                                </td>
                                <td style={{verticalAlign:'top'}}>
                                    {formData.ContingencyMeasure == "CONTINGENCY_MEASURE_TRUE" && <span>&#9745;</span>}
                                    {formData.ContingencyMeasure == "CONTINGENCY_MEASURE_FALSE" && <span>&#9744;</span>}
                                    有 
                                    
                                </td>
                                <td style={{verticalAlign:'top', borderBottom:'1px solidb'}}>
                                {formData.ContingencyMeasureRemark != null ? formData.ContingencyMeasureRemark : ''}
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div className={`${styles.pagebreak}`} ></div>
                <div className="form-row mb-3" style={{marginTop:'150px', fontSize:'18px'}}>
                    <div className={`col-12`} style={{fontWeight:'bold'}}>
                    6. 家屬聯絡
                    </div>
                    <div className={`col-12`}>
                    <table>
                            <tr>
                                <td>
                                    6.1通知家屬日期及時間
                                </td>
                                <td style={{borderBottom:'1px solid'}}>
                                {formData.ContactFamilyDate != null && new Date(formData.ContactFamilyDate).getFullYear() + `-` +(`0`+(new Date(formData.ContactFamilyDate).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(formData.ContactFamilyDate).getDate()).slice(-2) + ` ` + (`0`+new Date(formData.ContactFamilyDate).getHours()).slice(-2) + `:` + + (`0`+new Date(formData.ContactFamilyDate).getMinutes()).slice(-2)}
                                </td>
                                <td>
                                    與服務使用者關係
                                </td>
                                <td style={{borderBottom:'1px solid'}}>
                                {formData.ContactFamilyRelationship != null ? formData.ContactFamilyRelationship : ''}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                6.2 家屬姓名
                                </td>
                                <td style={{borderBottom:'1px solid'}}>
                                {formData.ContactFamilyName != null ? formData.ContactFamilyName : ''}
                                </td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>
                                6.3 負責通知家屬的職員姓名
                                </td>
                                <td style={{borderBottom:'1px solid'}}>
                                {formData.ContactStaff != null ? formData.ContactStaff.displayName : ''}
                                </td>
                                <td>職位</td>
                                <td style={{borderBottom:'1px solid'}}>{formData.ContactStaff != null  ? formData.ContactStaff.jobTitle : ''}</td>
                            </tr>
                            <tr>
                                <td>
                                6.4 服務使用者經診治後情况
                                </td>
                                <td colSpan={3} style={{borderBottom:'1px solid'}}>
                                {formData.AfterTreatmentDescription != null ? formData.AfterTreatmentDescription : ''}
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div className="form-row mb-3" style={{fontSize:'18px'}}>
                    <div className={`col-12`}>
                        <table>
                            <tr>
                                <td>
                                填報人姓名及職級
                                </td>
                                <td style={{borderBottom:'1px solid'}}>
                                {formData.Author.displayName}&nbsp;&nbsp;{formData.Author.jobTitle}
                                </td>
                                <td>
                                日期
                                </td>
                                <td style={{borderBottom:'1px solid'}}>
                                {formData.Created != null && new Date(formData.Created).getFullYear() + `-` +(`0`+(new Date(formData.Created).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(formData.Created).getDate()).slice(-2)}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                高級服務經理/服務經理姓名
                                </td>
                                <td style={{borderBottom:'1px solid'}}>
                                {formData.SM != null && formData.SM.Title}
                                </td>
                                <td>
                                日期
                                </td>
                                <td style={{borderBottom:'1px solid'}}>
                                {formData.SMDate != null && new Date(formData.SMDate).getFullYear() + `-` +(`0`+(new Date(formData.SMDate).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(formData.SMDate).getDate()).slice(-2)}
                                
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
                    交由 : <span style={{borderBottom:'1px solid',display: 'inline-block', width:'200px'}}>{formData.Investigator != null ? formData.Investigator.Title : ''}&nbsp;</span>填寫「意外報告 (二)」
                    </div>
                    <div className={`col-12`}>
                    <table>
                        <tr>
                            <td style={{width:'60px'}}>
                            評語 :
                            </td>
                            <td style={{borderBottom:'1px solid'}}>
                            &nbsp;&nbsp;{formTwentyData != null && formData.SPTComment != null ? formData.SPTComment : ''}
                            </td>
                        </tr>
                    </table>
                    </div>
                </div>
                
                <div className="form-row mb-3" style={{fontSize:'18px'}}>
                    <div className={`col-12`}>
                        <table>
                            <tr>
                                <td>
                                高級物理治療師姓名
                                </td>
                                <td style={{borderBottom:'1px solid'}}>
                                {formData.SPT.Title}
                                </td>
                                <td>
                                日期
                                </td>
                                <td style={{borderBottom:'1px solid'}}>
                                {formData.SPTDate != null && new Date(formData.SPTDate).getFullYear() + `-` +(`0`+(new Date(formData.SPTDate).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(formData.SPTDate).getDate()).slice(-2)}
                                
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
                        服務使用者意外填報表(二)
                    </div>
                    <div className={`col-12 font-weight-bold`} style={{textAlign:'right', fontSize:'15px'}}>
                        保險公司備案編號: {formData.InsuranceCaseNo != null ? <span style={{borderBottom:'1px solid',display: 'inline-block', width:'200px'}}>{formData.InsuranceCaseNo}</span> : '____________'}
                    </div>
                    <div className={`col-12 font-weight-bold`} style={{textAlign:'right',fontSize:'18px'}}>
                        檔案編號: {formData.CaseNumber != null ? <span style={{borderBottom:'1px solid',display: 'inline-block', width:'200px'}}>{formData.CaseNumber}</span> : '____________'}
                    </div>
                </div>
                <div className="form-row mb-3" style={{fontSize:'18px'}}>
                    <div className={`col-12`}>
                        意外性質&nbsp;&nbsp;&nbsp;&nbsp;
                        <span>&#9745;</span>
                        服務使用者意外&nbsp;&nbsp;&nbsp;&nbsp;
                        <span>&#9744;</span>
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
                                <td style={{width:'200px'}}>{formData.ServiceUserGender == "male" && <span>&#9745;</span>}
                                    {formData.ServiceUserGender != "male" && <span>&#9744;</span>}
                                    男&nbsp;&nbsp;
                                    {formData.ServiceUserGender == "female" && <span>&#9745;</span>}
                                    {formData.ServiceUserGender != "female" && <span>&#9744;</span>}
                                    女</td>
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
                                    {formTwentyData != null && formTwentyData.AccidentNatureOtherRemark != null ? <span style={{borderBottom:'1px solid',display: 'inline-block', width:'200px'}}>{formTwentyData.AccidentNatureOtherRemark}</span> : '____________________'}
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
                                    {formTwentyData.EnvFactorOtherRemark != null ? <span style={{borderBottom:'1px solid',display: 'inline-block', width:'200px'}}>{formTwentyData.EnvFactorOtherRemark}</span> : '____________________'})
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
                                    {formTwentyData != null && formTwentyData.PersonalFactorOtherRemark != null ? <span style={{borderBottom:'1px solid',display: 'inline-block', width:'200px'}}>{formTwentyData.PersonalFactorOtherRemark}</span> : '____________________'})
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
                                {formData.InvestigatorAD.displayName},&nbsp;&nbsp;{formData.InvestigatorAD.jobTitle}
                                </td>
                                <td  style={{width:'200px'}}>
                                日期
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
                                日期
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
                    意外跟進/結束表(三)
                </div>
                <div className={`col-12 ${styles.header}`}>
                    服務單位 {formData.ServiceUserUnit != null ? formData.ServiceUserUnit : ''}
                </div>
                <div className={`col-12 font-weight-bold`} style={{textAlign:'right', fontSize:'15px'}}>
                    保險公司備案編號: {formData.InsuranceCaseNo != null ? <span style={{borderBottom:'1px solid',display: 'inline-block', width:'200px'}}>{formData.InsuranceCaseNo}</span> : '____________'}
                </div>
                <div className={`col-12 font-weight-bold`} style={{textAlign:'right',fontSize:'18px'}}>
                    檔案編號: {formData.CaseNumber != null ? <span style={{borderBottom:'1px solid',display: 'inline-block', width:'200px'}}>{formData.CaseNumber}</span> : '____________'}
                </div>
            </div>
            <div className="form-row mb-3" style={{fontSize:'18px'}}>
                <div className={`col-12`}>
                    意外性質&nbsp;&nbsp;&nbsp;&nbsp;
                    <span>&#9745;</span>
                    服務使用者意外&nbsp;&nbsp;&nbsp;&nbsp;
                    <span>&#9744;</span>
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
                            日期
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
                            日期
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