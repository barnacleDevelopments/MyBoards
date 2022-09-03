import React, {useEffect, useLayoutEffect, useState} from 'react';

// COMPONENTS
import WorkoutForm from '../../forms/workout-form';
import {View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Workout from '../../../types/models/workout';
import {Hangboard} from '../../../types/models/hangboard';
import globalStyles from '../../../styles/global';
import Warning from '../../forms/form-components/warning';
import useAPIError from '../../../hooks/use-api-error';

// TYPES
import Set from "../../../types/set";
import TextLoader from "../../text-loader";

// HOOKS
import useMyBoardsAPI from "../../../hooks/use-myboards-api";

type RootStackParamList = {
    EditWorkoutScreen: Workout;
}

type Props = NativeStackScreenProps<RootStackParamList, 'EditWorkoutScreen'>;

const EditWorkoutScreen = ({navigation, route}: Props) => {
    const [deleteMenuOpen, setDeleteMenuOpen] = useState(false);
    const [submitedUI, setSubmitedUI] = useState(false);
    const [workoutLoading, setWorkoutLoading] = useState(true);
    const [sets, setSets] = useState<Array<Set>>([]);
    const [workout] = useState<Workout>(route.params);
    const {addError} = useAPIError();
    const {getWorkoutSets, updateWorkout, deleteWorkout} = useMyBoardsAPI();

    let submited = false;

    const defaultSet: Set = {
        instructions: "",
        reps: 3,
        restTime: 10,
        hangTime: 10,
        restBeforeNextSet: 10,
        instructionAudioURL: "",
        rightGripType: 0,
        leftGripType: 0,
        indexPosition: 0,
        setHolds: []
    }

    useEffect(() => {
        (async () => {
            submited = false;
            setSubmitedUI(false);
            const workout: Workout = route.params;
            if (!workout.id) return;
            try {
                const result = await getWorkoutSets(workout.id);
                setSets(result)
                setWorkoutLoading(false);
            } catch (ex: any) {
                navigation.navigate("Workouts")
                addError("ERROR GETTING SETS. PLEASE TRY AGAIN.", ex.status);
            }
        })();
    }, []);

    useEffect(() => {
        navigation.setOptions({
            headerShown: !workoutLoading
        });
    }, [workoutLoading]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: !deleteMenuOpen
        });
    }, [navigation, deleteMenuOpen])

    const addSet = () => {
        setSets([...sets, defaultSet]);
    }

    const handleForm = async (values: Workout, hangboard: Hangboard, sets: Array<Set>) => {
        if (!submited) {
            try {
                submited = true;
                setSubmitedUI(true);
                navigation.setOptions({
                    headerShown: false
                });
                const formData: Workout = {
                    id: workout.id,
                    name: values.name,
                    description: values.description,
                    sets: sets.map((set, i) => ({...set, indexPosition: i})),
                    hangboardId: hangboard.id,
                    userId: workout.userId
                }

                const updatedWorkout = await updateWorkout(formData);
                navigation.navigate("Workouts", {
                    data: updatedWorkout
                });

            } catch (ex: any) {
                navigation.navigate("Workouts");
                addError("ERROR UPDATING WORKOUT. PLEASE TRY AGAIN.", ex.status);
            }
        }
    }

    const handleDelete = async () => {
        if (!submited) {
            submited = true;
            setSubmitedUI(true);
            if (workout.id) {
                try {
                    await deleteWorkout(workout.id);
                    navigation.navigate("Workouts", workout.id);
                } catch (ex: any) {
                    addError("ERROR DELETING WORKOUT. PLEASE TRY AGAIN.", ex.status);
                    navigation.navigate("Workouts");
                }
            }
        }
    }

    return (
        <View style={globalStyles.container}>
            {!workoutLoading && !submitedUI ?
                <WorkoutForm
                    formHandler={handleForm}
                    setHandler={setSets}
                    sets={sets}
                    hangboard={workout.hangboard}
                    onAddSet={addSet}
                    workout={workout}
                    onDeletePress={() => setDeleteMenuOpen(true)}
                /> : null}

            {workoutLoading ? <TextLoader text={`Retrieving your workout.`}/> : null}

            {submitedUI ? <TextLoader text={`Updating your ${workout.name} workout.`}/> : null}

            {deleteMenuOpen && !submitedUI ?
                <Warning
                    onConfirm={handleDelete}
                    onClose={() => setDeleteMenuOpen(false)}
                    text={'Are you sure you want to delete this workout?'}
                    loading={false}
                /> : null}
        </View>
    )
}

export default EditWorkoutScreen;