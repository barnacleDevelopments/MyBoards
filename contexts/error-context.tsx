import React, {useCallback, useState} from 'react';

type APIErrorContext = {
    error: any,
    addError: (message: string, status: number) => void,
    removeError: () => void
}

export const APIErrorContext = React.createContext<APIErrorContext>({
    error: null,
    addError: () => {
    },
    removeError: () => {
    }
});

export default function APIErrorProvider({children}) {
    const [error, setError] = useState<{ message: string, status: number } | null>(null);

    const removeError = () => setError(null);

    const addError = (message: string, status: number) => setError({message, status});

    const contextValue = {
        error,
        addError: useCallback((message, status) => addError(message, status), []),
        removeError: useCallback(() => removeError(), [])
    };

    return (
        <APIErrorContext.Provider value={contextValue}>
            {children}
        </APIErrorContext.Provider>
    );
}