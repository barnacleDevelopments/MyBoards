import React, {useEffect, useState} from 'react';

// COMPONENTS
import WorkoutForm from '../../forms/workout-form';
import {View} from "react-native"

// TYPES
import Set from '../../../types/models/Set';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Hangboard} from '../../../types/models/hangboard';
import globalStyles from '../../../styles/global';
import Workout from '../../../types/models/workout';
import TextLoader from "../../text-loader";
import useMyBoardsAPI from '../../../hooks/use-myboards-api';

// HOOKS

export type RootStackParamList = {
    CreateWorkoutScreen: {};
}

type Props = NativeStackScreenProps<RootStackParamList, 'CreateWorkoutScreen'>;

const CreateWorkoutScreen = ({navigation}: Props) => {
    let submited = false;
    const [submitedUI, setSubmitedUI] = useState(false);
    const {createWorkout} = useMyBoardsAPI();
    const [sets, setSets] = useState<Array<Set>>([{
        instructions: "",
        reps: 3,
        restTime: 10,
        hangTime: 10,
        restBeforeNextSet: 10,
        instructionAudioURL: "",
        rightGripType: 0,
        leftGripType: 0,
        indexPosition: 0,
        setHolds: [],
        weight: 0
    }]);

    const addSet = () => {
        setSets([...sets, {
            instructions: "",
            reps: 3,
            restTime: 10,
            hangTime: 10,
            restBeforeNextSet: 10,
            instructionAudioURL: "",
            rightGripType: 0,
            leftGripType: 0,
            indexPosition: 0,
            setHolds: [],
            weight: 0
        }]);
    }

    useEffect(() => {
        submited = false;
        setSubmitedUI(false);
    }, []);

    const handleForm = async (values: Workout, hangboard: Hangboard, sets: Array<Set>) => {
        if (!submited) {
            submited = true;
            setSubmitedUI(true);
            navigation.setOptions({
                headerShown: false
            });

            const formData = {
                name: values.name,
                description: values.description,
                sets: sets.map((set, i) => ({...set, indexPosition: i})),
                hangboardId: hangboard.id
            }

            try {
                const newWorkout = await createWorkout(formData);
                navigation.navigate("Workouts", {
                    data: {
                        name: newWorkout.name,
                        id: newWorkout.id
                    },
                    error: {
                        status: false,
                        message: ""
                    }
                });
            } catch (ex: any) {
                navigation.navigate("Workouts")
            }
        }
    }

    return (
        <View style={globalStyles.container}>
            {!submitedUI ?
                <WorkoutForm
                    formHandler={handleForm}
                    setHandler={setSets}
                    sets={sets}
                    onAddSet={addSet}
                /> :
                <TextLoader text={'Creating Workout...'}/>}
        </View>
    )
}

export default CreateWorkoutScreen;
