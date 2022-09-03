import AuthLoadingScreen from "./screens/auth/loading-screen";
import SignInScreen from "./screens/auth/login-screen";
import HomeScreen from "./screens/home-screen";
import CreateWorkoutScreen from "./screens/workout/create-workout-screen";
import CreateHangboardScreen from "./screens/hangboard/create-hangboard-screen";
import EditHangboardScreen from "./screens/hangboard/edit-hangboard-screen";
import ConfigureHangboardScreen from "./screens/hangboard/configure-hangboard-screen";
import DetailsWorkoutScreen from "./screens/workout/details-workout-screen";
import TrainingWorkoutScreen from "./screens/workout/training-workout-screen";
import EditWorkoutScreen from "./screens/workout/edit-workout-screen";
import React, {useContext} from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {AuthContext} from "../contexts/auth-context";

type RootStackParamList = {};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigator = () => {
    const {state} = useContext(AuthContext);

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
        <Stack.Navigator>
            {state.isLoading ? (
                <Stack.Screen
                    options={{headerShown: false}}
                    name='Loading'
                    component={AuthLoadingScreen}/>
            ) : state.userToken == null ? (
                <Stack.Screen
                    options={{headerShown: false}}
                    name='SignIn'
                    component={SignInScreen}
                />
            ) : (
                <Stack.Screen
                    options={{headerShown: false}}
                    name='Main'
                    component={HomeScreen}/>
            )}
            {/* Modals */}
            <Stack.Group
                screenOptions={{presentation: 'modal'}}
            >
                <Stack.Screen
                    options={{...navigationStyle}}
                    name="Create Workout"
                    component={CreateWorkoutScreen}
                />
                <Stack.Screen
                    options={{...navigationStyle}}
                    name="Create Hangboard"
                    component={CreateHangboardScreen}
                />
                <Stack.Screen
                    options={{...navigationStyle}}
                    name="Edit Hangboard"
                    component={EditHangboardScreen}
                />
                <Stack.Screen
                    options={{...navigationStyle, headerShown: false}}
                    name="Configure Hangboard"
                    component={ConfigureHangboardScreen}
                />
                <Stack.Screen
                    options={{...navigationStyle}}
                    name="Details"
                    component={DetailsWorkoutScreen}
                />
                <Stack.Screen
                    options={{...navigationStyle, headerShown: false}}
                    name="TrainingWorkoutScreen"
                    component={TrainingWorkoutScreen}
                />
                <Stack.Screen
                    options={{...navigationStyle}}
                    name="Edit Workout"
                    component={EditWorkoutScreen}
                />
            </Stack.Group>
        </Stack.Navigator>
    )
}

export default Navigator;