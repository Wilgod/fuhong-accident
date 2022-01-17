import { MSGraphClient } from '@microsoft/sp-http';
import { sp, extractWebUrl } from "@pnp/sp";
import { Web } from "@pnp/sp/webs"
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { graph } from "@pnp/graph";
import "@pnp/graph/users";
import { getAccessRight,getSMSDMapping } from './FetchFuHongList';
import { IContextInfo } from "@pnp/sp/sites";

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

export async function getDepartmentByShortName(shortName: string) {
    try {
        const LIST_NAME = "SM SD Mapping";
        const URL = "https://fuhongsociety.sharepoint.com/sites/FHS.Portal.dev";
        const result = await Web(URL).lists.getByTitle(LIST_NAME).items.filter(`Title eq '${shortName}'`).top(1).orderBy("Modified", false).get();
        return result;
    } catch (err) {
        console.error(err);
        throw new Error("getDepartmentByShortName error");
    }
}

export async function getAllServiceUnit(siteCollectionUrl) {
    try {
        const LIST_NAME = "SM SD Mapping";
        const URL = siteCollectionUrl//"https://fuhongsociety.sharepoint.com/sites/FHS.Portal.dev";
        const result = await Web(URL).lists.getByTitle(LIST_NAME).items.select("Title", "su_name_tc", "location", "su_Eng_name_display").orderBy("Title", true).getAll();
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
        throw new Error("getDepartmentByShortName error");
    }
}


export async function getUserAdByGraph(email: string) {
    try {
        const matchingUser = await graph.users.getById(email)();
        return matchingUser;
    } catch (err) {
        console.error(err);
        throw new Error("Get User AD By Graph error");
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
export async function getSeniorPhysiotherapistByGraph() {
    try {
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
    }
}

export async function checkPermissionList(siteCollectionUrl,userEmail) {
    let user = await getUserInfoByEmailInUserInfoAD(siteCollectionUrl,userEmail);
    let dept = [];
    if (user.length > 0) {
      let access = await getAccessRight();
      console.log('user hr_jobcode : ' +  user[0].hr_jobcode);
      let getSMSD = await getSMSDMapping(siteCollectionUrl, user[0].hr_deptid);
      access.forEach(async(item) => {
          console.log('item.JobCode : ' + item.JobCode + ', item.CMS : ' + item.CMS);
        
        if (item.JobCode == user[0].hr_jobcode && item.DeptId == user[0].hr_deptid && item.AllServiceUser) {
          dept.push('All');
        } else if (item.JobCode == user[0].hr_jobcode && (!item.CMS || item.CMS == undefined)) {
          debugger
          if (getSMSD.length > 0) {
            dept.push(getSMSD[0].su_Eng_name_display);
          }
        } else if (item.JobCode == user[0].hr_jobcode && item.CMS) {
            debugger
          let groups = user[0].Group.split(',')
          for (let group of groups) {
            if (group.indexOf('_CMS_SU_') >=0 ) {
              dept.push(group.trim().replace('_CMS_SU_', ''));
            }
          }
        }
      })
      return dept;
    } else {
      return dept;
    }
  }