import { useState, useEffect } from "react";
import { getUserInfoByEmailInUserInfoAD, getDepartmentByShortName } from "../api/FetchUser";

export default function useUserInfo() {
    const [currentUserEmail, setCurrentUserEmail] = useState<string>("");
    const [userInfo, setUserInfo] = useState<any>();

    useEffect(() => {
        getUserInfoByEmailInUserInfoAD(currentUserEmail).then((userInfos) => {
            if (Array.isArray(userInfos) && userInfos.length > 0) {
                const [user] = userInfos;
                console.log(user);
                setUserInfo(user);
            }
        }).catch(console.error);
    }, [currentUserEmail]);

    return [userInfo, setCurrentUserEmail];
}