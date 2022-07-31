import React, { useEffect, useMemo, useReducer } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ErrorBoundary from 'react-native-error-boundary'

// Screens
import HomeScreen from './components/screens/home-screen';
import DetailsWorkoutScreen from './components/screens/workout/details-workout-screen';
import TrainingWorkoutScreen from './components/screens/workout/training-workout-screen';
import CreateWorkoutScreen from './components/screens/workout/create-workout-screen';
import EditWorkoutScreen from './components/screens/workout/edit-workout-screen';

// AUTH
import { AuthAPIManager } from './auth/auth_manager';
import { AuthContext } from './auth/auth_context';
import AuthLoadingScreen from './components/screens/auth/loading-screen';
import SignInScreen from './components/screens/auth/login-screen';
import CreateHangboardScreen from './components/screens/hangboard/create-hangboard-screen';
import ConfigureHangboardScreen from './components/screens/hangboard/configure-hangboard-screen';
import EditHangboardScreen from './components/screens/hangboard/edit-hangboard-screen';
import CustomFallback from './components/fallback-ui';
import APIErrorProvider from './contexts/error-context';

type RootStackParamList = {

};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
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
      let userToken = await AuthAPIManager.getAccessTokenAsync();
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = useMemo(
    () => ({
      signIn: async (username: string, password: string) => {
        const response = await AuthAPIManager.signInAsync(username, password);
        const token = await AuthAPIManager.getAccessTokenAsync();
        dispatch({ type: 'SIGN_IN', token: token });
        return response;
      },
      signOut: async () => {
        await AuthAPIManager.signOutAsync();
        dispatch({ type: 'SIGN_OUT' });
      },
      register: async (username: string, password: string, email: string) => {
        const response = await AuthAPIManager.registerAsync(username, password, email);
        dispatch({ type: 'REGISTER' });
        return response;
      }
    }), []);

  const navigationStyle = {
    headerStyle: {
      backgroundColor: "#333333",
    },
    headerTitleStyle: {
      color: '#f5f5f5'
    },
    headerTintColor: '#f5f5f5'
  }

  return (
    <ErrorBoundary FallbackComponent={CustomFallback}>
      <SafeAreaProvider>
        <APIErrorProvider>
          <AuthContext.Provider value={authContext}>
            <NavigationContainer>
              <Stack.Navigator>
                {state.isLoading ? (
                  <Stack.Screen
                    options={{ headerShown: false }}
                    name='Loading'
                    component={AuthLoadingScreen} />
                ) : state.userToken == null ? (
                  <Stack.Screen
                    options={{ headerShown: false }}
                    name='SignIn'
                    component={SignInScreen}
                  />
                ) : (
                  <Stack.Screen
                    options={{ headerShown: false }}
                    name='Main'
                    component={HomeScreen} />
                )}
                {/* Modals */}
                <Stack.Group
                  screenOptions={{ presentation: 'modal' }}
                >
                  <Stack.Screen
                    options={{ ...navigationStyle }}
                    name="Create Workout"
                    component={CreateWorkoutScreen}
                  />
                  <Stack.Screen
                    options={{ ...navigationStyle }}
                    name="Create Hangboard"
                    component={CreateHangboardScreen}
                  />
                  <Stack.Screen
                    options={{ ...navigationStyle }}
                    name="Edit Hangboard"
                    component={EditHangboardScreen}
                  />
                  <Stack.Screen
                    options={{ ...navigationStyle, headerShown: false }}
                    name="Configure Hangboard"
                    component={ConfigureHangboardScreen}
                  />
                  <Stack.Screen
                    options={{ ...navigationStyle }}
                    name="Details"
                    component={DetailsWorkoutScreen}
                  />
                  <Stack.Screen
                    options={{ ...navigationStyle, headerShown: false }}
                    name="TrainingWorkoutScreen"
                    component={TrainingWorkoutScreen}
                  />
                  <Stack.Screen
                    options={{ ...navigationStyle }}
                    name="Edit Workout"
                    component={EditWorkoutScreen}
                  />
                </Stack.Group>
              </Stack.Navigator>
            </NavigationContainer>
          </AuthContext.Provider>
        </APIErrorProvider>
      </SafeAreaProvider>
    </ErrorBoundary >
  );
};

export default App;
