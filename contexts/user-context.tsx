import React, { useEffect, useState} from "react";
import {AuthAPIManager} from "../auth/auth_manager";

type UserContext = {
    user: User,
    setUser: () => void,
    updateUser: () => void
}

export const UserContext = React.createContext<UserContext>({
    user: {
        hasCreatedFirstHangboard: false,
        hasCreatedFirstWorkout: false,
        userName: ""
    }, 
    setUser: () => {},
    updateUser: () => {}
});

export default function UserProvider({children}) {
    const [user, setUser] = useState<User | null>(null);
    
    const getUser = async () => {
        const userInfo = await AuthAPIManager.GetUserInfo();
        setUser(userInfo)
    }
    
    const contextValue = {
        user,
        setUser: setUser,
        updateUser: getUser
    }
    
    useEffect(() => {
        (async() => {
            if(!user) {
                await getUser()
            }
        })()
    }, [user])

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
        
    );
}