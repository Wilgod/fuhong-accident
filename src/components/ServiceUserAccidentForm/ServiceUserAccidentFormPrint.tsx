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


interface IServiceUserAccidentFormPrintProps {
    index: number;
    formData: any;
    siteCollectionUrl:string;
    permissionList:any;
}

export default function ServiceUserAccidentFormPrint({ index,  formData, siteCollectionUrl, permissionList}: IServiceUserAccidentFormPrintProps ) {
return <>
    <div style={{color:'black'}}>
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
                            {formData.ServiceUserGender == "Male" && <span>&#9745;</span>}
                            {formData.ServiceUserGender != "Male" && <span>&#9744;</span>}
                            男&nbsp;&nbsp;
                            {formData.ServiceUserGender == "Female" && <span>&#9745;</span>}
                            {formData.ServiceUserGender != "Female" && <span>&#9744;</span>}
                            女
                        </td>
                        <td>服務使用者檔案號碼</td>
                        <td>{formData.ServiceUserId != null ? formData.ServiceUserId : ''}</td>
                    </tr>
                    <tr>
                        <td>接受服務類別</td>
                        <td>{formData.ServiceCategory != null ? formData.ServiceCategory : ''}</td>
                        <td>服務使用者姓名: (中文)</td>
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
                                其他 (請註明&nbsp;&nbsp;
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
                        <td style={{fontSize:'15px',verticalAlign:'top'}}>(請註明事發地點附近之員工當時執行的職務)&nbsp;&nbsp;&nbsp;&nbsp;{formData.AccidentDetail != null ? formData.AccidentDetail : '____________________'}</td>
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
                        <td style={{verticalAlign:'top'}}>3.1 服務單位即時治療/處理&nbsp;&nbsp;&nbsp;&nbsp;{formData.TreatmentAfterAccident != null ? formData.TreatmentAfterAccident : '____________________'}</td>
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
                            {formData.MedicalArrangementHospital != null ? formData.MedicalArrangementHospital : '____________________'})
                        </td>
                        <td>
                            到達時間{formData.MedicalArrangementDate != null && new Date(formData.MedicalArrangementDate).getFullYear() + `-` +(`0`+(new Date(formData.MedicalArrangementDate).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(formData.MedicalArrangementDate).getDate()).slice(-2) + ` ` + (`0`+new Date(formData.MedicalArrangementDate).getHours()).slice(-2) + `:` + + (`0`+new Date(formData.MedicalArrangementDate).getMinutes()).slice(-2)}
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td colSpan={2}>提供予服務使用者的治療{formData.MedicalArrangementTreatment != null ? formData.MedicalArrangementTreatment : '____________________'})</td>
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
                            有&nbsp;&nbsp; {formData.ContingencyMeasureRemark != null ? formData.ContingencyMeasureRemark : '____________________'}
                            
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        <div className="form-row mb-3" style={{fontSize:'18px'}}>
            <div className={`col-12`} style={{fontWeight:'bold'}}>
            6. 家屬聯絡
            </div>
            <div className={`col-12`}>
            <table>
                    <tr>
                        <td>
                            6.1通知家屬日期及時間
                        </td>
                        <td>
                        {formData.ContactFamilyDate != null && new Date(formData.ContactFamilyDate).getFullYear() + `-` +(`0`+(new Date(formData.ContactFamilyDate).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(formData.ContactFamilyDate).getDate()).slice(-2) + ` ` + (`0`+new Date(formData.ContactFamilyDate).getHours()).slice(-2) + `:` + + (`0`+new Date(formData.ContactFamilyDate).getMinutes()).slice(-2)}
                        </td>
                        <td>
                            與服務使用者關係
                        </td>
                        <td>
                        {formData.ContactFamilyRelationship != null ? formData.ContactFamilyRelationship : '____________________'}
                        </td>
                    </tr>
                    <tr>
                        <td>
                        6.2 家屬姓名
                        </td>
                        <td>
                        {formData.ContactFamilyName != null ? formData.ContactFamilyName : '____________________'}
                        </td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>
                        6.3 負責通知家屬的職員姓名
                        </td>
                        <td>
                        {formData.ContactStaff != null ? formData.ContactStaff.displayName : '____________________'}
                        </td>
                        <td>職位</td>
                        <td>{formData.ContactStaff != null  ? formData.ContactStaff.jobTitle : '____________________'}</td>
                    </tr>
                    <tr>
                        <td>
                        6.4 服務使用者經診治後情况
                        </td>
                        <td colSpan={3}>
                        {formData.AfterTreatmentDescription != null ? formData.AfterTreatmentDescription : '____________________'}
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
                        <td>
                        {formData.Author.displayName}&nbsp;&nbsp;{formData.Author.jobTitle}
                        </td>
                        <td>
                        簽署及日期
                        </td>
                        <td>
                        ______________________________
                        </td>
                    </tr>
                    <tr>
                        <td>
                        高級服務經理/服務經理姓名
                        </td>
                        <td>
                        {formData.SM != null && formData.SM.Title}
                        </td>
                        <td>
                        簽署及日期
                        </td>
                        <td>
                        ______________________________
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
            交由 : {formData.Investigator != null ? formData.Investigator.Title : '_______________'}&nbsp;填寫「意外報告 (二)」
            </div>
            <div className={`col-12`} style={{fontWeight:'bold'}}>
            評語 ____________________________________________________
            </div>
        </div>
        <div className="form-row mb-3" style={{fontSize:'18px'}}>
            <div className={`col-12`}>
                <table>
                    <tr>
                        <td>
                        高級物理治療師姓名
                        </td>
                        <td>
                        {formData.SPT.Title}
                        </td>
                        <td>
                        簽署及日期
                        </td>
                        <td>
                        ______________________________
                        </td>
                    </tr>
                    
                </table>
            </div>
        </div>
    </div>
</>
}