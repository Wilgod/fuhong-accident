
//import { Bookmark, Document, Packer, Paragraph, SimpleField, TextRun } from "../build";
import { saveAs } from "file-saver";
import { asBlob } from 'html-docx-js-typescript';
import * as moment from 'moment';
export async function generate(form) {
    let UNUSAL_INCIDENT_GENERAL_CHECK = `&#9744;`;
    let UNUSAL_INCIDENT_SUICIDE_CHECK = `&#9744;`;
    let UNUSAL_INCIDENT_OTHER_CHECK = `&#9744;`;
    let UNUSAL_INCIDENT_COURT_CHECK = `&#9744;`;
    let unusalIncideintGeneral = ``;
    let unusalIncideintIncident = ``;
    let policeFalse = `&#9744;`;
    let policeTrue = `&#9744;`;
    let policeReportNumber = ``;
    let policeDatetime = ``;

    let RESIDENT_MISSING_INSIDE_CHECK = `&#9744;`;
    let RESIDENT_MISSING_OUTSIDE_CHECK = `&#9744;`;
    let RESIDENT_MISSING_REASON_VACATION_CHECK = `&#9744;`;
    let RESIDENT_MISSING_REASON_VOLUNTARILY_CHECK = `&#9744;`;
    let RESIDENT_MISSING_REASON_HOME_OUT_CHECK = `&#9744;`;
    let missingPoliceReportNo = ``;
    let found = `&#9744;`;
    let notFound = `&#9744;`;
    let foundDate = ``;
    let notYetFoundDayCount = `____`;
    let medicalRecords = ``;
    let ra_body = `&#9744;`;
    let ra_mental = `&#9744;`;
    let ra_negligent = `&#9744;`;
    let ra_embezzleProperty = `&#9744;`;
    let ra_abandoned = `&#9744;`;
    let ra_sexualAssault = `&#9744;`;
    let ra_other = `&#9744;`;
    let ra_otherDescription =  `________`;
    let ABUSER_STAFF =  `&#9744;`;
    let ABUSER_TENANT =  `&#9744;`;
    let ABUSER_GUEST =  `&#9744;`;
    let ABUSER_OTHER =  `&#9744;`;
    let abuserDescription = `________`;
    let referSocialWorkerFalse = `&#9744;`;
    let referSocialWorkerTrue = `&#9744;`;
    let referServiceUnit = `________`;
    let abuser_policeTrue = `&#9744;`;
    let abuser_policeFalse = `&#9744;`;
    let abuser_policeCaseNo = `________`;

    let DISPUTE_POLICE_TENANT_AND_TENANT = `&#9744;`;
    let DISPUTE_POLICE_TENANT_AND_STAFF = `&#9744;`;
    let DISPUTE_POLICE_TENANT_AND_GUEST = `&#9744;`;
    let DISPUTE_POLICE_STAFF_AND_STAFF = `&#9744;`;
    let DISPUTE_POLICE_STAFF_AND_GUEST = `&#9744;`;
    let DISPUTE_POLICE_GUEST_AND_GUEST = `&#9744;`;
    let DISPUTE_POLICE_OTHER = `&#9744;`;
    let conflictDescription = `________`;
    let conflict_policeCaseNo = `________`;
    let SERIOUS_MEDICAL_INCIDENT_MISTAKE = `&#9744;`;
    let SERIOUS_MEDICAL_INCIDENT_OVER_OR_MISSED = `&#9744;`;
    let SERIOUS_MEDICAL_INCIDENT_COUNTER_DRUG = `&#9744;`;
    let SERIOUS_MEDICAL_INCIDENT_OTHER = `&#9744;`;
    let mi_description = `________`;
    let OTHER_INCIDENT_POWER_SUPPLY = `&#9744;`;
    let OTHER_INCIDENT_BUILDING = `&#9744;`;
    let OTHER_INCIDENT_FIRE = `&#9744;`;
    let OTHER_INCIDENT_WATER_SUPPLY = `&#9744;`;
    let OTHER_INCIDENT_OTHER = `&#9744;`;
    let other = `&#9744;`;
    let otherDescription = `________`;
    let residentName = `________`;
    let residentGender = `<span style="text-decoration: underline;">女</span>`;
    let residentAge = `________`;
    let residentRoomNo = `________`;
    let guardianTrue = `&#9744;`;
    let guardianFalse = `&#9744;`;
    let guardianName = `________`;
    let guardianRelation = `________`;
    let guardianStaffName = `________`;
    let guardianStaffJobTitle = `________`;
    let guardianDate = `________`;
    let guardianReason = `________`;
    let reporterName = `________`;
    let reporterJobTitle = `________`;
    let reporterDate = `________`;
    if (form.unusalIncident == "UNUSAL_INCIDENT_GENERAL") {
        UNUSAL_INCIDENT_GENERAL_CHECK = `&#9745;`;
    }
    if (form.unusalIncident == "UNUSAL_INCIDENT_SUICIDE") {
        UNUSAL_INCIDENT_SUICIDE_CHECK = `&#9745;`;
    }
    if (form.unusalIncident == "UNUSAL_INCIDENT_OTHER") {
        UNUSAL_INCIDENT_OTHER_CHECK = `&#9745;`;
    }
    if (form.unusalIncident == "UNUSAL_INCIDENT_COURT") {
        UNUSAL_INCIDENT_COURT_CHECK = `&#9745;`;
    }
    if (form.unusalIncideintGeneral != null) {
        unusalIncideintGeneral = form.unusalIncideintGeneral
    }
    if (form.unusalIncideintIncident != null) {
        unusalIncideintIncident = form.unusalIncideintIncident
    }
    if (form.police) {
        policeTrue = `&#9745;`;
    } else {
        policeFalse = `&#9745;`;
    }
    if (form.policeReportNumber) {
        policeReportNumber = form.policeReportNumber;
    }
    if (form.policeDatetime != null) {
        policeDatetime = new Date(form.policeDatetime).getFullYear() + `-` +(`0`+(new Date(form.policeDatetime).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(form.policeDatetime).getDate()).slice(-2)
    }
    if (form.residentMissing == "RESIDENT_MISSING_INSIDE") {
        RESIDENT_MISSING_INSIDE_CHECK = `&#9745;`;
    }
    if (form.residentMissing == "RESIDENT_MISSING_OUTSIDE") {
        RESIDENT_MISSING_OUTSIDE_CHECK = `&#9745;`;
    }
    if (form.residentMissingReason == "RESIDENT_MISSING_REASON_VACATION") {
        RESIDENT_MISSING_REASON_VACATION_CHECK = `&#9745;`;
    }
    if (form.residentMissingReason == "RESIDENT_MISSING_REASON_VOLUNTARILY") {
        RESIDENT_MISSING_REASON_VOLUNTARILY_CHECK = `&#9745;`;
    }
    if (form.residentMissingReason == "RESIDENT_MISSING_REASON_HOME_OUT") {
        RESIDENT_MISSING_REASON_HOME_OUT_CHECK = `&#9745;`;
    }
    if (form.missingPoliceReportNo) {
        missingPoliceReportNo = form.missingPoliceReportNo;
    }
    if (form.found) {
        found = `&#9745;`;
    } else {
        notFound = `&#9745;`;
    }
    if (form.foundDate != null) {
        foundDate = new Date(form.foundDate).getFullYear() + `-` +(`0`+(new Date(form.foundDate).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(form.foundDate).getDate()).slice(-2)
    }
    if (form.notYetFoundDayCount != null) {
        notYetFoundDayCount = form.notYetFoundDayCount
    }
    if (form.medicalRecords != null) {
        medicalRecords = form.medicalRecords
    }
    if (form.ra_body) {
        ra_body = `&#9745;`;
    }
    if (form.ra_mental) {
        ra_mental = `&#9745;`;
    }
    if (form.ra_negligent) {
        ra_negligent = `&#9745;`;
    }
    if (form.ra_embezzleProperty) {
        ra_embezzleProperty = `&#9745;`;
    }
    if (form.ra_abandoned) {
        ra_abandoned = `&#9745;`;
    }
    if (form.ra_sexualAssault) {
        ra_sexualAssault = `&#9745;`;
    }
    if (form.ra_other) {
        ra_other = `&#9745;`;
    }
    if (form.ra_otherDescription != null) {
        ra_otherDescription = `<span style="text-decoration: underline;">` + form.ra_otherDescription + `</span>`
    }
    if (form.abuser == "ABUSER_STAFF") {
        ABUSER_STAFF =  `&#9745;`;
    }
    if (form.abuser == "ABUSER_TENANT") {
        ABUSER_TENANT =  `&#9745;`;
    }
    if (form.abuser == "ABUSER_GUEST") {
        ABUSER_GUEST =  `&#9745;`;
    }
    if (form.abuser == "ABUSER_OTHER") {
        ABUSER_OTHER =  `&#9745;`;
    }
    if (form.abuserDescription != null) {
        abuserDescription = form.abuserDescription
    }
    if (form.referSocialWorker) {
        referSocialWorkerTrue =`&#9745;`;
    } else {
        referSocialWorkerFalse =`&#9745;`;
    }
    if (form.referServiceUnit != null) {
        referServiceUnit = form.referServiceUnit
    }
    if (form.abuser_police) {
        abuser_policeTrue =`&#9745;`;
    } else {
        abuser_policeFalse =`&#9745;`;
    }
    if (form.abuser_policeCaseNo != null) {
        abuser_policeCaseNo = form.abuser_policeCaseNo
    }
    if (form.conflict == "DISPUTE_POLICE_TENANT_AND_TENANT") {
        DISPUTE_POLICE_TENANT_AND_TENANT =  `&#9745;`;
    }
    if (form.conflict == "DISPUTE_POLICE_TENANT_AND_STAFF") {
        DISPUTE_POLICE_TENANT_AND_STAFF =  `&#9745;`;
    }
    if (form.conflict == "DISPUTE_POLICE_TENANT_AND_GUEST") {
        DISPUTE_POLICE_TENANT_AND_GUEST =  `&#9745;`;
    }
    if (form.conflict == "DISPUTE_POLICE_STAFF_AND_STAFF") {
        DISPUTE_POLICE_STAFF_AND_STAFF =  `&#9745;`;
    }
    if (form.conflict == "DISPUTE_POLICE_STAFF_AND_GUEST") {
        DISPUTE_POLICE_STAFF_AND_GUEST =  `&#9745;`;
    }
    if (form.conflict == "DISPUTE_POLICE_GUEST_AND_GUEST") {
        DISPUTE_POLICE_GUEST_AND_GUEST =  `&#9745;`;
    }
    if (form.conflict == "DISPUTE_POLICE_OTHER") {
        DISPUTE_POLICE_OTHER =  `&#9745;`;
    }
    if (form.conflictDescription != null) {
        conflictDescription = `<span style="text-decoration: underline;">` +  form.conflictDescription + `</span>`
    }
    if (form.conflict_policeCaseNo != null) {
        conflict_policeCaseNo = `<span style="text-decoration: underline;">` +  form.conflict_policeCaseNo + `</span>`
    }
    if (form.medicalIncident == "SERIOUS_MEDICAL_INCIDENT_MISTAKE") {
        SERIOUS_MEDICAL_INCIDENT_MISTAKE =  `&#9745;`;
    }
    if (form.medicalIncident == "SERIOUS_MEDICAL_INCIDENT_OVER_OR_MISSED") {
        SERIOUS_MEDICAL_INCIDENT_OVER_OR_MISSED =  `&#9745;`;
    }
    if (form.medicalIncident == "SERIOUS_MEDICAL_INCIDENT_COUNTER_DRUG") {
        SERIOUS_MEDICAL_INCIDENT_COUNTER_DRUG =  `&#9745;`;
    }
    if (form.medicalIncident == "SERIOUS_MEDICAL_INCIDENT_OTHER") {
        SERIOUS_MEDICAL_INCIDENT_OTHER =  `&#9745;`;
    }
    if (form.mi_description != null) {
        mi_description = `<span style="text-decoration: underline;">` +  form.mi_description +`</span>`
    }
    if (form.otherIncident == "OTHER_INCIDENT_POWER_SUPPLY") {
        OTHER_INCIDENT_POWER_SUPPLY =  `&#9745;`;
    }
    if (form.otherIncident == "OTHER_INCIDENT_BUILDING") {
        OTHER_INCIDENT_BUILDING =  `&#9745;`;
    }
    if (form.otherIncident == "OTHER_INCIDENT_FIRE") {
        OTHER_INCIDENT_FIRE =  `&#9745;`;
    }
    if (form.otherIncident == "OTHER_INCIDENT_WATER_SUPPLY") {
        OTHER_INCIDENT_WATER_SUPPLY =  `&#9745;`;
    }
    if (form.otherIncident == "OTHER_INCIDENT_OTHER") {
        OTHER_INCIDENT_OTHER =  `&#9745;`;
    }
    if (form.other) {
        other  =  `&#9745;`;
    }
    if (form.otherDescription != null) {
        otherDescription = `<span style="text-decoration: underline;">` +  form.otherDescription + `</span>`;
    }
    if (form.residentName != null) {
        residentName = `<span style="text-decoration: underline;">` +  form.residentName + `</span>`;
    }
    if (form.residentAge != null) {
        residentAge = `<span style="text-decoration: underline;">` +  form.residentAge + `</span>`;
    }
    if (form.residentGender == 'female') {
        residentGender = `<span style="text-decoration: underline;">女</span>`;
    }
    if (form.residentRoomNo != null) {
        residentRoomNo = `<span style="text-decoration: underline;">` +  form.residentRoomNo + `</span>`;
    }
    if (form.guardian) {
        guardianTrue  =  `&#9745;`;
    } else {
        guardianFalse  =  `&#9745;`;
    }
    if (form.guardianName != null) {
        guardianName = `<span style="text-decoration: underline;">` +  form.guardianName + `</span>`;
    }
    if (form.guardianRelation != null) {
        guardianRelation = `<span style="text-decoration: underline;">` +  form.guardianRelation + `</span>`;
    }
    if (form.guardianName != null) {
        guardianName = `<span style="text-decoration: underline;">` +  form.guardianName + `</span>`;
    }
    if (form.guardianStaffName != null) {
        guardianStaffName = `<span style="text-decoration: underline;">` +  form.guardianStaffName + `</span>`;
    }
    if (form.guardianStaffJobTitle != null) {
        guardianStaffJobTitle = `<span style="text-decoration: underline;">` +  form.guardianStaffJobTitle + `</span>`;
    }
    if (form.guardianDate != null) {
        guardianDate = `<span style="text-decoration: underline;">` + new Date(form.guardianDate).getFullYear() + `-` +(`0`+(new Date(form.guardianDate).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(form.guardianDate).getDate()).slice(-2) + `</span>`;
    }
    if (form.guardianReason != null) {
        guardianReason = `<span style="text-decoration: underline;">` +  form.guardianReason + `</span>`;
    }
    if (form.reporterName != null) {
        reporterName = `<span style="text-decoration: underline;">` +  form.reporterName + `</span>`;
    }
    if (form.reporterJobTitle != null) {
        reporterJobTitle = `<span style="text-decoration: underline;">` +  form.reporterJobTitle + `</span>`;
    }
    if (form.reporterDate != null) {
        reporterDate = `<span style="text-decoration: underline;">` +  new Date(form.reporterDate).getFullYear() + `-` +(`0`+(new Date(form.reporterDate).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(form.reporterDate).getDate()).slice(-2) + `</span>`;
    }
    const content = `
    <div>
        <div style="text-decoration: underline; font-weight:bold; text-align:center; font-size:20px;">
            殘疾人士院舍特別事故報告
        </div>
        <div style="text-align:center; font-size:20px;">
            ［須在事件發生後的3個曆日（包括公眾假期）內提交］
        </div>
        <br />
        <div style="font-size:14px;">
            注意：請在合適方格內加上「」號，並連同附頁／載有相關資料的自訂報告一併呈交
        </div>
        <br />
        <div style="font-size:16px;">
            <div style="font-weight:bold; margin-bottom:5px">
                致：	社會福利署殘疾人士院舍牌照事務處 <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;（傳真：2153 0071／查詢電話：2891 6379）
            </div>
            <div>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;［經辦人: `+form.responsibleName+` （負責督察姓名）］
            </div>
            <br />
            <div style="margin-bottom:10px">
                殘疾人士院舍名稱 <span style="text-decoration: underline;">`+form.homesName+`</span>
            </div>
            <table style="width:100%;margin-bottom:10px">
                <tr>
                    <td style="width:50%">
                    殘疾人士院舍主管姓名 <span style="text-decoration: underline;">`+form.homesManagerName+`</span>
                    </td>
                    <td style="width:50%">
                    聯絡電話 <span style="text-decoration: underline;">`+form.homesManagerTel+`</span>
                    </td>
                </tr>
            </table>
            <div style="margin-bottom:10px">
                事故發生日期 <span style="text-decoration: underline;">`+new Date(form.incidentTime).getFullYear() + `-` +(`0`+(new Date(form.incidentTime).getMonth()+ 1)).slice(-2) + `-` +(`0`+new Date(form.incidentTime).getDate()).slice(-2)+`</span>
            </div>
            <div style="margin-bottom:10px">
            特別事故類別
            </div>
            <div style="border: 1px solid black;">
                <div style="border-bottom: 1px solid black; padding:10px;">
                    <div style="margin-bottom:10px">
                    (1)	住客不尋常死亡／事故導致住客嚴重受傷或死亡
                    </div>
                    <div style="margin-bottom:10px; margin-left:25px;">
                        `+UNUSAL_INCIDENT_GENERAL_CHECK+`
                        在院舍內發生事故及送院後死亡
                    </div>
                    <div style="margin-bottom:10px; margin-left:50px;">
                        請註明事件：<span style="text-decoration: underline;">`+unusalIncideintGeneral+`</span>
                    </div>
                    <div style="margin-bottom:10px; margin-left:25px;">
                        `+UNUSAL_INCIDENT_SUICIDE_CHECK+`
                        在院舍內自殺及送院後死亡
                    </div>
                    <div style="margin-bottom:10px; margin-left:25px;">
                        `+UNUSAL_INCIDENT_OTHER_CHECK+`
                        其他不尋常死亡／事故，請說明 :<span style="text-decoration: underline;">`+unusalIncideintIncident+`</span>
                    </div>
                    <div style="margin-bottom:10px; margin-left:25px;">
                        `+UNUSAL_INCIDENT_COURT_CHECK+`
                        接獲死因裁判法庭要求出庭的傳票（請夾附傳票副本並在附頁說明詳情）
                    </div>
                    <div style="margin-bottom:10px;">
                    (a) `+policeFalse+` 沒有 / `+policeTrue+`已報警求助
                    </div>
                    <div style="margin-bottom:10px; margin-left:30px;">
                    報警日期及報案編號 :<span style="text-decoration: underline;">`+policeReportNumber+`</span>
                    </div>
                    <div style="margin-bottom:10px;">
                    (b)	<span style="margin-left:25px;">如適用，警方到院舍調查日期及時間 :</span><span style="text-decoration: underline;">`+policeDatetime+`</span>
                    </div>
                </div>

                <div style="border-bottom: 1px solid black; padding:10px;">
                    <div style="margin-bottom:10px">
                    (2)	住客失蹤以致需要報警求助
                    </div>
                    <div style="margin-bottom:10px; margin-left:25px;">
                        `+RESIDENT_MISSING_INSIDE_CHECK+`
                        住客擅自／在員工不知情下離開院舍
                    </div>
                    <div style="margin-bottom:10px; margin-left:25px;">
                        `+RESIDENT_MISSING_OUTSIDE_CHECK+`
                        院外活動期間失蹤
                    </div>
                    <div style="margin-bottom:10px; margin-left:100px;">
                        `+RESIDENT_MISSING_REASON_VACATION_CHECK+`
                        回家度假期間 / 
                        `+RESIDENT_MISSING_REASON_VOLUNTARILY_CHECK+`
                        自行外出活動 / 
                        `+RESIDENT_MISSING_REASON_HOME_OUT_CHECK+`
                        院舍外出活動
                    </div>
                    <div style="margin-bottom:10px; margin-left:30px;">
                        報警日期及報案編號 :<span style="text-decoration: underline;">`+missingPoliceReportNo+`</span>
                    </div>
                    <div style="margin-bottom:10px;">
                        (a)`+found+`
                        已尋回（尋回日期：`+foundDate+`）
                    </div>
                    <div style="margin-bottom:10px; margin-left:25px;">
                        `+notFound+`
                        仍未尋回（由失蹤日計起至呈報日，已失蹤`+notYetFoundDayCount+`日）
                    </div>
                    <div style="margin-bottom:10px;">
                        (b)失蹤住客病歷（請註明 :`+medicalRecords+`）
                    </div>
                </div>
                <div style="border-bottom: 1px solid black; padding:10px;">
                    <div style="margin-bottom:10px">
                    (3)	院舍內證實／懷疑有住客受虐待／被侵犯私隱
                    </div>
                    <div style="margin-bottom:10px; margin-left:25px;">
                        `+ra_body+`
                        身體虐待
                        `+ra_mental+`
                        精神虐待
                        `+ra_negligent+`
                        疏忽照顧
                        `+ra_embezzleProperty+`
                        侵吞財產
                        `+ra_abandoned+`
                        遺棄
                        `+ra_sexualAssault+`
                        非禮／性侵犯
                    </div>
                    <div style="margin-bottom:10px; margin-left:25px;">
                    `+ra_other+`其他（請註明 : `+ra_otherDescription+`）
                    </div>
                    <div style="margin-bottom:10px;">
                        (a)施虐者／懷疑施虐者的身份 :`+medicalRecords+`）
                    </div>
                    <div style="margin-bottom:10px; margin-left:25px;">
                        `+ABUSER_STAFF+`
                        員工
                        `+ABUSER_TENANT+`
                        住客
                        `+ABUSER_GUEST+`
                        訪客
                    </div>
                    <div style="margin-bottom:10px; margin-left:25px;">
                    `+ABUSER_OTHER+`其他（請註明 : `+abuserDescription+`）
                    </div>
                    <div style="margin-bottom:10px;">
                        (b) `+referSocialWorkerFalse+`
                        沒有 /
                        `+referSocialWorkerTrue+`
                        已轉介社工
                    </div>
                    <div style="margin-bottom:10px; margin-left:25px;">
                    轉介日期及服務單位 : `+referServiceUnit+`）
                    </div>
                    <div style="margin-bottom:10px;">
                        (c) `+abuser_policeFalse+`
                        沒有 /
                        `+abuser_policeTrue+`
                        已報警求助
                    </div>
                    <div style="margin-bottom:10px; margin-left:25px;">
                    報警日期及報案編號 : `+abuser_policeCaseNo+`）
                    </div>
                </div>
                <div style="border-bottom: 1px solid black; padding:10px;">
                    <div style="margin-bottom:10px">
                    (4)	院舍內有爭執事件以致需要報警求助
                    </div>
                    <div style="margin-bottom:10px; margin-left:25px;">
                        `+DISPUTE_POLICE_TENANT_AND_TENANT+`
                        住客與住客
                        `+DISPUTE_POLICE_TENANT_AND_STAFF+`
                        住客與員工
                        `+DISPUTE_POLICE_TENANT_AND_GUEST+`
                        住客與訪客
                        `+DISPUTE_POLICE_STAFF_AND_STAFF+`
                        員工與員工
                    </div>
                    <div style="margin-bottom:10px; margin-left:25px;">
                        `+DISPUTE_POLICE_STAFF_AND_GUEST+`
                        員工與訪客
                        `+DISPUTE_POLICE_GUEST_AND_GUEST+`
                        訪客與訪客
                        `+DISPUTE_POLICE_OTHER+`
                        其他（請註明 : `+conflictDescription+`）
                    </div>
                    <div style="margin-bottom:10px; margin-left:25px;">
                        報警日期及報案編號 `+conflict_policeCaseNo+`
                    </div>
                </div>
                <div style="border-bottom: 1px solid black; padding:10px;">
                    <div style="margin-bottom:10px">
                    (5)	嚴重醫療／藥物事故（須同時提交「藥物風險管理報告」）
                    </div>
                    <div style="margin-bottom:10px; margin-left:25px;">
                        `+SERIOUS_MEDICAL_INCIDENT_MISTAKE+`
                        住客誤服藥物引致入院接受檢查或治療
                    </div>
                    <div style="margin-bottom:10px; margin-left:25px;">
                        `+SERIOUS_MEDICAL_INCIDENT_OVER_OR_MISSED+`
                        住客漏服或多服藥物引致入院接受檢查或治療
                    </div>
                    <div style="margin-bottom:10px; margin-left:25px;">
                        `+SERIOUS_MEDICAL_INCIDENT_COUNTER_DRUG+`
                        住客服用成藥或非處方藥物引致入院接受檢查或治療
                    </div>
                    <div style="margin-bottom:10px; margin-left:25px;">
                        `+SERIOUS_MEDICAL_INCIDENT_OTHER+`
                        其他（請註明 `+mi_description+`）
                    </div>
                </div>
                <div style="border-bottom: 1px solid black; padding:10px;">
                    <div style="margin-bottom:10px">
                    (6)	其他重大特別事故以致影響院舍日常運作
                    </div>
                    <div style="margin-bottom:10px; margin-left:25px;">
                        `+OTHER_INCIDENT_POWER_SUPPLY+`
                        停止電力供應
                        `+OTHER_INCIDENT_BUILDING+`
                        樓宇破損或結構問題
                        `+OTHER_INCIDENT_FIRE+`
                        火警
                    </div>
                    <div style="margin-bottom:10px; margin-left:25px;">
                        `+OTHER_INCIDENT_WATER_SUPPLY+`
                        停止食水供應
                        `+OTHER_INCIDENT_OTHER+`
                        水浸／山泥傾瀉／其他天災意外
                    </div>
                </div>
                <div style="padding:10px;">
                    <div style="margin-bottom:10px">
                    (7)	其他
                    </div>
                    <div style="margin-bottom:10px; margin-left:25px;">
                        `+other+`
                        請註明 :`+otherDescription+`
                    </div>
                    
                </div>
            </div>
            <div style="margin-bottom:10px">
            住客及家屬情況
            </div>
            <div style="border: 1px solid black;">
                <div style="margin-bottom:10px; margin-left:25px;">
                住客姓名 : `+residentName+` 年齡 : `+residentGender+` 性別 : `+residentAge+` 房及／或床號 : `+residentRoomNo+`
                </div>
                <div style="margin-bottom:10px; margin-left:25px;">
                    `+guardianTrue+`
                    已通知住客監護人／保證人／家人／親屬
                </div>
                <div style="margin-bottom:10px; margin-left:25px;">
                姓名 : `+guardianName+`及關係 : `+guardianRelation+`
                </div>
                <div style="margin-bottom:10px; margin-left:25px;">
                日期及時間 : `+guardianDate +`
                </div>
                <div style="margin-bottom:10px; margin-left:25px;">
                負責通知的員工姓名 : `+guardianStaffName+`及職位 `+guardianStaffJobTitle+`
                </div>
                
                <div style="margin-bottom:10px; margin-left:25px;">
                    `+guardianFalse+`
                    沒有通知住客監護人／保證人／家人／親屬
                </div>
                <div style="margin-bottom:10px; margin-left:25px;">
                    原因 : `+guardianReason+`
                </div>
            </div>

            <table style="width:100%;margin-bottom:10px">
                <tr>
                    <td style="width:50%">
                    填報人簽署 <span style="text-decoration: underline;">__________________</span>
                    </td>
                    <td style="width:50%">
                    填報人職位 <span style="text-decoration: underline;">`+reporterJobTitle+`</span>
                    </td>
                </tr>
                <tr>
                    <td style="width:50%">
                    填報人姓名 <span style="text-decoration: underline;">`+reporterName+`</span>
                    </td>
                    <td style="width:50%">
                    填報日期 <span style="text-decoration: underline;">`+reporterDate+`</span>
                    </td>
                </tr>
            </table>
        </div>
    </div>`;
    let r = [];
    for (var i = 0; i < content.length; i++) {
        if(content.charCodeAt(i)>255){
            var asc = content.charCodeAt(i);
            r.push("&#" + asc + ";");
        } else {
            r.push(content[i]);
        }
    }
    let output = r.join("");
      //await asBlob(content, { orientation: 'landscape', margins: { top: 100 } })
      asBlob(output).then(data => {
        saveAs(data, 'file.docx') // save as docx file
      })
}

