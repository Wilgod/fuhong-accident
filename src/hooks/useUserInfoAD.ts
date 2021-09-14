import { useState, useEffect } from "react";
import { getUserAdByGraph } from "../api/FetchUser";

export default function useUserInfoAD() {
    const [user, setUser] = useState(null);
    const [peoplePicker, setPeoplePicker] = useState(null);

    useEffect(() => {
        if (peoplePicker) {
            if (Array.isArray(peoplePicker) && peoplePicker.length > 0) {
                const email = peoplePicker[0].secondaryText;
                getUserAdByGraph(email).then(setUser).catch(console.error);
            }
        }
    }, [peoplePicker, setUser]);

    return [user, setPeoplePicker, peoplePicker];
}
