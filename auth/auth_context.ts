import * as React from 'react';

type AuthContextType = {
    signIn: (username: string, password: string) => Promise<Response>;
    register: (username: string, password: string, email: string) => Promise<Response>;
    signOut: () => void;
};

export const AuthContext = React.createContext<AuthContextType>({
    signIn: async () => {
        return new Response()
    },
    signOut: () => {
    },
    register: async () => {
        return new Response()
    }
});
