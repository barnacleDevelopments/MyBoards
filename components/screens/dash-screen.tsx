import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';

// COMPONENTS
import {Button, ScrollView, View} from 'react-native';
import globalStyles from '../../styles/global';

import DailyTrainPanel from '../stat-panels/daily-train-panel';
import GripUsagePanel from '../stat-panels/grip-usage-panel';
import SecondsHangedPanel from '../stat-panels/seconds-hanged-panel';
import PrimaryButton from "../buttons/primary-btn";

type RootStackParamList = {
    DashScreen: {};
}

type Props = NativeStackScreenProps<RootStackParamList, 'DashScreen'>;

const DashScreen = ({navigation}: Props) => {

    return (
        <View style={{height: "100%", backgroundColor: '#212021'}}>
            <ScrollView style={globalStyles.scrollContainer}>
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