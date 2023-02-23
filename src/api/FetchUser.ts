import { MSGraphClient } from '@microsoft/sp-http';
import { sp, extractWebUrl } from "@pnp/sp";
import { Web } from "@pnp/sp/webs"
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { graph } from "@pnp/graph";
import "@pnp/graph/users";
import { getAccessRight,getAdminRight,getSMSDMapping,getAllSMSDMapping } from './FetchFuHongList';
import { IContextInfo } from "@pnp/sp/sites";
import arraySort from 'array-sort';
export async function getUserInfoByEmail(email: string) {
    try {
        const result = await sp.web.siteUsers.getByEmail(email).get();
        return result;
    } catch (err) {
        console.error(err);
        throw new Error("getUserInfoByEmail error");
    }
}

export async function getUserInfoByEmailInUserInfoAD(siteCollectionUrl:string, email: string) {
    try {
        const LIST_NAME = "UserInfoAD";
        const URL = siteCollectionUrl;
        const result = await Web(URL).lists.getByTitle(LIST_NAME).items.filter(`Email eq '${email}'`).top(1).get();
        return result;
    } catch (err) {
        console.error(err);
        throw new Error("getUserInfoByEmailInUserInfoAD error");
    }
}

export async function getDepartmentByShortName(shortName: string, siteCollectionUrl:string) {
    try {
        const LIST_NAME = "SM SD Mapping";
        const URL = siteCollectionUrl;
        const result = await Web(URL).lists.getByTitle(LIST_NAME).items.filter(`Title eq '${shortName}'`).top(1).orderBy("Modified", false).get();
        return result;
    } catch (err) {
        console.error(err);
        throw new Error("getDepartmentByShortName error");
    }
}

export async function getDepartmentBySuEngNameDisplay(shortName: string, siteCollectionUrl:string) {
    try {
        const LIST_NAME = "SM SD Mapping";
        const URL = siteCollectionUrl;
        const result = await Web(URL).lists.getByTitle(LIST_NAME).items.filter(`su_Eng_name_display eq '${shortName}'`).top(1).orderBy("Modified", false).get();
        return result;
    } catch (err) {
        console.error(err);
        throw new Error("getDepartmentBySuEngNameDisplay error");
    }
}

export async function getAllServiceUnit(siteCollectionUrl) {
    try {
        const LIST_NAME = "SM SD Mapping";
        const URL = siteCollectionUrl;
        const result = await Web(URL).lists.getByTitle(LIST_NAME).items.select("Title", "su_name_tc", "location", "su_Eng_name_display", "Accident_SM_backup").filter("Accident_SU_dropdown eq 1").getAll();
        arraySort(result, 'su_Eng_name_display');
        let units = [];
        for (let item of result) {
            let addUnit = true;
            if (units.length > 0) {
                for (let unit of units) {
                    if (unit.su_Eng_name_display == item.su_Eng_name_display) {
                        addUnit = false;
                    }
                }
                if (addUnit) {
                    units.push(item);
                }
            } else {
                units.push(item);
            }
        }
        return units;
    } catch (err) {
        console.error(err);
        throw new Error("getAllServiceUnit error");
    }
}


export async function getUserAdByGraph(email: string) {
    try {
        const matchingUser = await graph.users.getById(email)();
        return matchingUser;
    } catch (err) {
        console.log(email + " not in AD")
        console.error(err);
        return null;
        //throw new Error("Get User AD By Graph error");
    }
}

// SM
export async function getServiceManagersByGraph() {
    try {
        const result = await graph.users.filter(`jobTitle eq 'Service Manager' or jobTitle eq 'Senior Service Manager'`).get();

        return result;
    } catch (err) {
        console.error(err);
        throw new Error("Get User AD By Graph error");
    }
}

// SD
export async function getServiceDirectorsByGraph() {
    try {
        const result = await graph.users.filter(`jobTitle eq 'Service Director'`).get();

        return result;
    } catch (err) {
        console.error(err);
        throw new Error("getServiceDirectorsByGraph error");
    }
}

// SPT
export async function getSeniorPhysiotherapistByGraph(siteCollectionUrl) {
    try {
        const web = Web(siteCollectionUrl);
        const LIST_NAME = "UserInfoAD";
        const item = await web.lists.getByTitle(LIST_NAME).items.filter("hr_jobcode eq 'SPT'").getAll();
        return item;
    } catch (err) {
        console.error(err);
        throw new Error("getLastCaseNo failed");
    }
    /*try {
        let query = `jobTitle eq 'Senior Physiotherapist'`

        // Testing account
        if (true) {
            query += ` or mail eq 't_cms_spt@fuhong.org'`;
        }
        const result = await graph.users.filter(query).get();
        return result;
    } catch (err) {
        console.error(err);
        throw new Error("getSeniorPhysiotherapistByGraph error");
    }*/
}


export async function checkDepartmentList(siteCollectionUrl,userEmail) {
    let user = await getUserInfoByEmailInUserInfoAD(siteCollectionUrl,userEmail);
    let dept = [];
    if (user.length > 0) {
      let access = await getAccessRight();
      console.log('user hr_jobcode2 : ' +  user[0].hr_jobcode);
      let getAllSMSD = await getAllSMSDMapping(siteCollectionUrl);
      access.forEach(async(item) => {
         // console.log('item.JobCode : ' + item.JobCode + ', item.CMS : ' + item.CMS);
        if (item.JobCode == user[0].hr_jobcode && item.DeptId == user[0].hr_deptid && item.AllServiceUser) {
          dept.push({"All":true});
        } else if (item.JobCode == user[0].hr_jobcode && (!item.CMS || item.CMS == undefined)) {
          let getSMSD = getAllSMSD.filter(item => {return item.Title == user[0].hr_deptid})
          if (getSMSD.length > 0) {
            dept.push({"location":getSMSD[0].location,"hr_deptid":getSMSD[0].hr_deptid,"su_Eng_name_display" : getSMSD[0].su_Eng_name_display,"su_name_tc" : getSMSD[0].su_name_tc});
          }
        } else if (item.JobCode == user[0].hr_jobcode && item.CMS) {
          let groups = user[0].Group == null ? [] :user[0].Group.split(',')
          for (let group of groups) {
            if (group.indexOf('_CMS_SU_') >=0 ) {
                let deptName = group.trim().replace('_CMS_SU_', '')
                let getSMSD = getAllSMSD.filter(item => {return item.su_Eng_name_display == deptName});
                if (getSMSD.length > 0) {
                    dept.push({"location":getSMSD[0].su_Eng_name_display,"hr_deptid":getSMSD[0].Title,"su_Eng_name_display" : getSMSD[0].su_Eng_name_display,"su_name_tc" : getSMSD[0].su_name_tc});
                }
            }
          }
        }
      })
      return dept;
    } else {
      return dept;
    }
  }
export async function checkPermissionList(siteCollectionUrl,userEmail) {
    let user = await getUserInfoByEmailInUserInfoAD(siteCollectionUrl,userEmail);
    let dept = [];
    if (user.length > 0) {
      let access = await getAccessRight();
      let adminList = await getAdminRight();
      console.log('user hr_jobcode1 : ' +  user[0].hr_jobcode);
      console.log('user access : ' +  access);
      let admin = adminList.filter(a => {return a.Admin.EMail.toLowerCase() == userEmail.toLowerCase()});
      debugger
      if (admin.length > 0) {
        dept.push('All');
      } else {
        let getSMSD = await getSMSDMapping(siteCollectionUrl, user[0].hr_deptid);
        access.forEach(async(item) => {
            console.log('item.JobCode : ' + item.JobCode + ', hr_jobcode : ' + user[0].hr_jobcode);
            console.log('item.DeptId : ' + item.DeptId + ', user[0].hr_deptid : ' + user[0].hr_deptid);
            console.log('item.AllServiceUser : ' + item.AllServiceUser);
            if (item.JobCode == 'CLK-C' && user[0].hr_jobcode == 'CLK-C') {
                //
            }
            if (item.JobCode == user[0].hr_jobcode && item.AllServiceUser) {
                dept.push('All');
            }else if (item.JobCode == user[0].hr_jobcode && (item.DeptId == null || item.DeptId == '')&& (!item.CMS || item.CMS == undefined)) {
                console.log('444 : ');
                if (getSMSD.length > 0) {
                    console.log('222 : ' +  getSMSD[0].su_Eng_name_display);
                    dept.push(getSMSD[0].su_Eng_name_display);
                }
            } else if (item.JobCode == user[0].hr_jobcode && item.CMS) {
                let groups = user[0].Group == null ? [] :user[0].Group.split(',')
                for (let group of groups) {
                    if (group.indexOf('_CMS_SU_') >=0 ) {
                        console.log('333 : ');
                        dept.push(group.trim().replace('_CMS_SU_', ''));
                        }
                }
            } else if (item.JobCode == user[0].hr_jobcode && item.DeptId == user[0].hr_deptid) {
                console.log('111 : ');
                dept.push(getSMSD[0].su_Eng_name_display);
            } 
        })
      }
      debugger
      return dept;
    } else {
      return dept;
    }
  }