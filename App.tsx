import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import ErrorBoundary from 'react-native-error-boundary'

import CustomFallback from './components/fallback-ui';
import APIErrorProvider from './contexts/error-context';
import UserProvider from './contexts/user-context';
import AuthProvider from './contexts/auth-context';
import Navigator from "./components/Navigator";

const App = () => {
    return (
        <ErrorBoundary FallbackComponent={CustomFallback}>
            <SafeAreaProvider>
                <APIErrorProvider>
                    <UserProvider>
                        <AuthProvider>
                            <NavigationContainer>
                                <Navigator />
                            </NavigationContainer>
                        </AuthProvider>
                    </UserProvider>
                </APIErrorProvider>
            </SafeAreaProvider>
        </ErrorBoundary>
    );
};

export default App;
