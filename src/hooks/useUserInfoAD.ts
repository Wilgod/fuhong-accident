import { useState, useEffect } from "react";
import { getUserAdByGraph } from "../api/FetchUser";


// PeoplePicker

export default function useUserInfoAD() {
    const [user, setUser] = useState(null);
    const [peoplePicker, setPeoplePicker] = useState(null);

    useEffect(() => {
        if (peoplePicker) {
            if (Array.isArray(peoplePicker)) {
                debugger
                if (peoplePicker.length > 0) {
                    const email = peoplePicker[0].EMail != undefined ? peoplePicker[0].EMail : peoplePicker[0].secondaryText || peoplePicker[0];
                    getUserAdByGraph(email).then(setUser).catch(console.error);
                }
            }
        } else {
            setUser(null);
        }
    }, [peoplePicker, setUser]);

    return [user, setPeoplePicker, peoplePicker];
}

