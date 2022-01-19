import { useState, useEffect } from "react";
import { getUserInfoByEmailInUserInfoAD, getDepartmentByShortName, getUserInfoByEmail } from "../api/FetchUser";
import { getSMSDMapping } from "../api/FetchFuHongList"

export default function useUserInfo(siteCollectionUrl) {
    const [email, setEmail] = useState<string>("");
    const [userInfo, setUserInfo] = useState<any>();
    const [spUserInfo, setSpUserInfo] = useState<any>();
    useEffect(() => {

        if (email) {
            // UserInfoAd list
            getUserInfoByEmailInUserInfoAD(siteCollectionUrl,email).then((userInfosRes) => {
                
                if (Array.isArray(userInfosRes) && userInfosRes.length > 0) {
                    getSMSDMapping(siteCollectionUrl,userInfosRes[0].hr_deptid).then((userSMSD) => {
                        userInfosRes[0].hr_deptid = userSMSD[0].su_Eng_name_display;
                        debugger;
                        const [user] = userInfosRes;
                        setUserInfo(user);
                    }).catch((err) => {
                        console.error('getSMSDMapping error')
                        console.error(err)
                    });
        
                }


            }).catch((err) => {
                console.error('getUserInfoByEmailInUserInfoAD error')
                console.error(err)
            });

            // SharePoint 
            getUserInfoByEmail(email).then((getUserInfoByEmailRes) => {
                setSpUserInfo(getUserInfoByEmailRes);
            }).catch((err) => {
                console.error('useUserInfo error')
                console.error(err)
            });

        } else {
            setUserInfo(null);
            setSpUserInfo(null);
        }
    }, [email]);

    return [userInfo, setEmail, spUserInfo];
}