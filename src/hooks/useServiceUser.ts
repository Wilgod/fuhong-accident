import { useState, useEffect } from "react";
import { getServiceUserByID, getServiceUserByServiceNumber, getServiceUserList } from "../api/FetchServiceUser";

export default function useServiceUser() {
    const [serviceUserList, setServiceUserList] = useState([]);
    const [serviceUserRecordId, setServiceUserRecordId] = useState();
    const [serviceUser, setServiceUser] = useState(null);

    useEffect(() => {
        getServiceUserList().then((datas) => {
            setServiceUserList(datas);
        }).catch(console.error);
    }, []);

    useEffect(() => {
        getServiceUserByID(serviceUserRecordId).then((user) => {
            setServiceUser(user);
        }).catch(console.error);
    }, [serviceUserRecordId]);

    return [serviceUserList, serviceUser, serviceUserRecordId, setServiceUserRecordId]
}
