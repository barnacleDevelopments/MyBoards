/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon} from 'react-native-elements/dist/icons/Icon';

// SCREENS 
import DashScreen from './dash-screen';
import WorkoutsScreen from './workout/workouts-screen';
import SettingsScreen from './settings-screen';
import HangboardScreen from './hangboard/hanboards-screen';

const Tab = createBottomTabNavigator();

const HomeScreen = () => {

    return (
        <Tab.Navigator
            screenOptions={({route}) => ({
                tabBarStyle: {
                    backgroundColor: '#212021',
                },
                tabBarActiveTintColor: "#EBB93E",
                tabBarIcon: ({focused}) => {
                    let iconName = '';
                    if (route.name === 'Settings') {
                        iconName = focused ? 'settings' : 'settings';
                    } else if (route.name === 'Dash') {
                        iconName = focused ? 'dashboard' : 'dashboard';
                    } else if (route.name === 'Workouts' || route.name === 'Hangboards') {
                        iconName = focused ? 'toc' : 'toc'
                    }
                    return <Icon
                        color={'#f5f5f5'}
                        selectionColor={"#710C10"}
                        reverseColor={"#710C10"}
                        underlayColor={"#710C10"}
                        name={iconName}
                    />
                }
            })}>
            <Tab.Screen name="Dash" options={{headerShown: false}} component={DashScreen}/>
            <Tab.Screen name="Workouts" options={{headerShown: false}} component={WorkoutsScreen}/>
            <Tab.Screen name="Hangboards" options={{headerShown: false}} component={HangboardScreen}/>
            <Tab.Screen name="Settings" options={{headerShown: false}} component={SettingsScreen}/>
        </Tab.Navigator>
    )
}

export default HomeScreen;