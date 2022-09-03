import React, {useContext, useEffect, useMemo, useReducer} from "react";
import {AuthAPIManager} from "../auth/auth_manager";
import {UserContext} from "./user-context";

type AuthContextType = {
    signIn: (username: string, password: string) => Promise<Response>;
    register: (username: string, password: string, email: string) => Promise<Response>;
    signOut: () => void;
    state: {
        isLoading: boolean,
        isSignOut: boolean,
        userToken: string | null
    }
};

export const AuthContext = React.createContext<AuthContextType>({
    signIn: async () => {
        return new Response()
    },
    signOut: () => {
    },
    register: async () => {
        return new Response()
    },
    state: {
        isLoading: true,
        isSignOut: false,
        userToken: null
    }
});

export default function AuthProvider({children}) {  
    const {updateUser, setUser} = useContext(UserContext)
    const [state, dispatch] = useReducer(
        (prevState: any, action: any) => {

            switch (action.type) {
                case 'RESTORE_TOKEN':
                    return {
                        ...prevState,
                        userToken: action.token,
                        isLoading: false,
                    };
                case 'SIGN_IN':
                    return {
                        ...prevState,
                        isSignOut: false,
                        userToken: action.token,
                        isLoading: false
                    };

                case 'SIGN_OUT':
                    return {
                        ...prevState,
                        isSignOut: true,
                        userToken: null
                    };
                case 'REGISTER':
                    return {
                        ...prevState,
                        isSignOut: false,
                        userToken: null,
                        isLoading: false
                    };
            }
        },
        {
            isLoading: true,
            isSignOut: false,
            userToken: null
        },
    );

    useEffect(() => {
        const bootstrapAsync = async () => {
            const token = await AuthAPIManager.getAccessTokenAsync();
            dispatch({type: 'RESTORE_TOKEN', token});
        };

        bootstrapAsync();

    }, []);

    const contextValue = useMemo(
        () => ({
            signIn: async (username: string, password: string) => {
                const response = await AuthAPIManager.signInAsync(username, password);
                const token = await AuthAPIManager.getAccessTokenAsync();
                dispatch({type: 'SIGN_IN', token: token});
                await updateUser()
                return response;
            },
            signOut: async () => {
                await AuthAPIManager.signOutAsync();
                dispatch({type: 'SIGN_OUT'});
                setUser(null)
            },
            register: async (username: string, password: string, email: string) => {
                const response = await AuthAPIManager.registerAsync(username, password, email);
                dispatch({type: 'REGISTER'});
                await updateUser()
                return response;
            }
        }), []);
    
    return (
        <AuthContext.Provider value={{state, ...contextValue}}>
            {children}
        </AuthContext.Provider>

    );
}