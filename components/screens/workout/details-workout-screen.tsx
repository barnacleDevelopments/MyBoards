import React, {useEffect, useState} from 'react';
import {Button, ScrollView, StyleSheet, Text, View,} from 'react-native';

// types
import Workout from '../../../types/models/workout';
import globalStyles from '../../../styles/global';
import WorkoutDetailsItem from './workout-details-item';
import LoadingPanel from '../../stat-panels/loading-panel';

// HOOKS
import useAPIError from '../../../hooks/use-api-error';
import useMyBoardsAPI from "../../../hooks/use-myboards-api";

const DetailsWorkoutScreen = ({navigation, route}) => {
    const [workout, setWorkout] = useState<Workout>();
    const {addError} = useAPIError();
    const {getWorkout} = useMyBoardsAPI();

    useEffect(() => {
        (async () => {
            try {
                const workout = await getWorkout(route.params.id);
                setWorkout(workout);
            } catch (ex: any) {
                addError("ERROR RETRIEVING WORKOUT. PLEASE TRY AGAIN.", ex.status)
                navigation.navigate("Workouts");
            }
        })();
    }, []);

    return (
        <View style={globalStyles.container}>
            <View style={styles.workoutHeaderContainer}>
                <Text style={styles.workoutHeader}>{workout?.name}</Text>
                <Text style={styles.workoutDescription}>{workout?.description ? workout.description : null}</Text>
                <Button
                    title='train'
                    color={"#EBB93E"}
                    disabled={!workout}
                    onPress={() => navigation.navigate("TrainingWorkoutScreen", workout)}
                />
            </View>
            {workout ?
                <ScrollView contentContainerStyle={styles.setList}>
                    {workout?.sets.map((s, i) => (
                        <WorkoutDetailsItem set={s} key={i}/>
                    ))}
                </ScrollView>
                :
                <LoadingPanel/>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    setList: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5
    },
    workoutHeaderContainer: {
        padding: 20,
        backgroundColor: '#333333'
    },
    workoutHeader: {
        fontSize: 50,
        fontWeight: "bold",
        color: "#f5f5f5"
    },
    workoutDescription: {
        fontSize: 23,
        color: "#f5f5f5",
        marginBottom: 10
    },

})

export default DetailsWorkoutScreen;