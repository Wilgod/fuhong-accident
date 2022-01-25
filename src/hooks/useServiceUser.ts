import { useState, useEffect } from "react";
import { getServiceUserByID, getServiceUserList } from "../api/FetchServiceUser";

export default function useServiceUser() {
    const [serviceUserList, setServiceUserList] = useState([]);
    const [serviceUserRecordId, setServiceUserRecordId] = useState(null);
    const [serviceUser, setServiceUser] = useState(null);

    useEffect(() => {
        debugger
        getServiceUserList().then((datas) => {
            setServiceUserList(datas);
        }).catch(console.error);
    }, []);

    useEffect(() => {
        debugger
        if (serviceUserRecordId === -1) return;
        
        if (serviceUserRecordId) {
            getServiceUserByID(parseInt(serviceUserRecordId)).then((user) => {
                setServiceUser(user);
            }).catch(console.error);
        } else {
            setServiceUser(null);
        }
    }, [serviceUserRecordId]);

    return [serviceUserList, serviceUser, serviceUserRecordId, setServiceUserRecordId]
}
