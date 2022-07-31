import React, {useState} from 'react';

// Hooks
import {useNetInfo} from '@react-native-community/netinfo';

// Types
import Workout from '../../../types/models/workout';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

// Components
import {Button, ScrollView, Text, View} from 'react-native';
import LoadingPanel from '../../stat-panels/loading-panel';
import WorkoutItem from './workout-item';
import useMyBoardsAPI from '../../../functions/api';
import {useFocusEffect} from '@react-navigation/native';
import DescriptionBox from '../../description-box';
import globalStyles from '../../../styles/global';
import OfflineLoader from '../../offline-loader';
import useAPIError from '../../../hooks/use-api-error';
import APIErrorNotification from '../../error-notification';
import PrimaryButton from "../../buttons/primary-btn";

type RootStackParamList = {
    data: Workout;
}

type Props = NativeStackScreenProps<RootStackParamList, 'WorkoutsScreen'>;

const WorkoutsScreen = ({navigation, route}: Props) => {
    const [workouts, setWorkouts] = useState<Array<Workout>>([]);
    const [loading, setLoading] = useState(true);
    const netInfo = useNetInfo();
    const [hangboardCount, setHangboardCount] = useState<number>(0);
    const [isFirstWorkout, setIsFirstWorkout] = useState(false);
    const {addError, error} = useAPIError();
    const {getHangboardCount, getWorkouts} = useMyBoardsAPI();

    useFocusEffect(
        React.useCallback(() => {
            (async () => {
                try {
                    const result = Number.parseInt(await getHangboardCount());
                    setHangboardCount(result);

                    if (result === 0) {
                        setLoading(false);
                        return;
                    }

                    const workouts = await getWorkouts();
                    setWorkouts(workouts);

                    if (workouts.length === 0) {
                        setIsFirstWorkout(true);
                        return;
                    }

                    setLoading(false);

                } catch (ex: any) {
                    addError(`ERROR RETRIEVING WORKOUTS. PLEASE TRY AGAIN.`, ex.status);
                }
            })();
        }, [netInfo.isConnected])
    );


    return (
        <View style={globalStyles.container}>
            {error ? <APIErrorNotification/> : null}
            {hangboardCount <= 0 ?
                <DescriptionBox
                    header="Workout List"
                    text="Here you can create and train workouts of your 
                  choosing but first you will need hangboard."
                >
                    <Button
                        color={"#EBB93E"}
                        title='create first hangboard'
                        onPress={() => navigation.navigate("Hangboards")}
                    />
                </DescriptionBox>
                : null}

            {isFirstWorkout ?
                <DescriptionBox
                    header="Nice!"
                    text="You've got yourself a hangboard configured. Time to create your first workout!"
                />
                : null}

            <ScrollView style={globalStyles.scrollContainer}>
                {/* If not connected to the internet, show loader */}
                {loading && netInfo.isConnected ? <LoadingPanel/> : null}

                {/* Offline Loader */}
                {!netInfo.isConnected ? <OfflineLoader/> : null}

                {/* Workouts list */}
                {workouts?.length > 0 && netInfo.isConnected ?
                    <View>
                        <Text style={globalStyles.pageHeading}>Workouts</Text>
                        {workouts?.map((w, i) => {
                            if (isFirstWorkout) {
                                return (
                                    <View key={i}>
                                        <DescriptionBox
                                            header="Epic!"
                                            text="Your first workout is created. Press the 
                          TRAIN button on your workout to begin."
                                        />
                                        <WorkoutItem workout={w}/>
                                    </View>
                                )
                            }
                            return <WorkoutItem key={i} workout={w}/>
                        })}
                        <View style={{marginBottom: 15}}></View>
                    </View>
                    : null}
            </ScrollView>
            <PrimaryButton
                title='create workout'
                disabled={!netInfo.isConnected || hangboardCount <= 0}
                onPress={() => navigation.navigate("Create Workout")}
                color={"#EBB93E"}
            />
        </View>
    )
}

export default WorkoutsScreen;
