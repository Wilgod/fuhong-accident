import { useState, useEffect } from "react";
import { getUserInfoByEmail } from "../api/FetchUser";

export default function useSharePointGroup() {
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState(null);
    
    useEffect(() => {
        if (email) {
            getUserInfoByEmail(email).then(setUser).catch(console.error);
        } else {
            setUser(null);
        }
    }, [email, setUser]);
    console.log(user)
    return [user, setEmail, email];
}
