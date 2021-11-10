import { useState, useEffect } from "react";
import { getUserInfoByEmailInUserInfoAD, getDepartmentByShortName, getUserInfoByEmail } from "../api/FetchUser";

export default function useUserInfo() {
    const [email, setEmail] = useState<string>("");
    const [userInfo, setUserInfo] = useState<any>();
    const [spUserInfo, setSpUserInfo] = useState<any>();
    useEffect(() => {
        if (email) {
            // UserInfoAd list
            getUserInfoByEmailInUserInfoAD(email).then((userInfos) => {
                if (Array.isArray(userInfos) && userInfos.length > 0) {
                    const [user] = userInfos;
                    setUserInfo(user);
                }
            }).catch(console.error);

            // SharePoint 
            getUserInfoByEmail(email).then((res) => {
                setSpUserInfo(res);
            }).catch(console.error);

        } else {
            setUserInfo(null);
            setSpUserInfo(null);
        }
    }, [email]);

    return [userInfo, setEmail, spUserInfo];
}