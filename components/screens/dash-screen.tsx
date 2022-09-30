import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useContext, useEffect, useState} from 'react';

// COMPONENTS
import { ScrollView, Text, View} from 'react-native';
import globalStyles from '../../styles/global';

import DailyTrainPanel from '../stat-panels/daily-train-panel';
import GripUsagePanel from '../stat-panels/grip-usage-panel';
import SecondsHangedPanel from '../stat-panels/seconds-hanged-panel';
import PrimaryButton from "../buttons/primary-btn";
import {UserContext} from "../../contexts/user-context";
import SecondaryButton from "../buttons/secondary-btn";
import {useNavigation} from "@react-navigation/native";

type RootStackParamList = {
    DashScreen: {};
}

type Props = NativeStackScreenProps<RootStackParamList, 'DashScreen'>;

const DashScreen = ({navigation}: Props) => {
    const [greeting, setGreeting] = useState<string>("")
    const {user} = useContext(UserContext);

    useEffect(() => {
        const greeting = `Hello ${user?.userName || ""}!`;
        setGreeting(greeting);
    }, [user])
   
    return (
        <View style={{height: "100%", paddingTop: 10, backgroundColor: '#212021'}}>
            <ScrollView style={globalStyles.scrollContainer}>
                <Text style={{color: 'white', textAlign: 'center', fontSize: 50}}>{greeting}</Text>
                <View style={{marginTop: 10, marginBottom: 10}}>
                    <SecondaryButton title="View Session Logs" 
                                     color='#EBB93E'
                                     onPress={() => navigation.navigate("SessionsGroups")}/>
                </View>
                <SecondsHangedPanel/>
                <DailyTrainPanel/>
                <GripUsagePanel/>
            </ScrollView>
            <PrimaryButton
                title='get started'
                color='#EBB93E'
                onPress={() => navigation.navigate('Workouts')}
            />
        </View>
    )
}

export default DashScreen;