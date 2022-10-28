import React, {useEffect, useState} from 'react';
import * as Yup from 'yup';

// Components
import {Pressable, ScrollView, StyleSheet, Text, TextInput, View,} from 'react-native';
import {Formik} from 'formik';
import SetDropownMenu from './form-components/set-dropdown-menu';

// Types
import Set, {gripType} from '../../types/models/set';
import SelectDropdown from 'react-native-select-dropdown';
import Workout from '../../types/models/workout';
import {Hangboard, Hold} from '../../types/models/hangboard';

import {SetHold} from '../../types/models/set-hold';
import SecondaryBtn from "../buttons/secondary-btn";

// HOOKS
import useMyBoardsAPI from "../../hooks/use-myboards-api";
import useAPIError from '../../hooks/use-api-error';
import useKeyboardVisible from '../../hooks/use-keyboard-visible';
import {useNavigation} from '@react-navigation/native';

const workoutSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'name must be at least 2 characters long')
        .max(50, 'name has a maximum of 50 characters')
        .required('name is required'),
    description: Yup.string()
        .min(2, 'description must be at least 2 characters long')
        .max(100, 'description has a maximum of 50 characters')
        .required('description is required'),
});

interface WorkoutFormProps {
    workout: Workout,
    sets: Set[],
    hangboard?: Hangboard,
    formHandler: (values: Workout, hangboard: Hangboard, sets: Array<Set>) => void,
    setHandler: (callback: (sets: Set[]) => Set[]) => void,
    onAddSet: () => void,
    onDeletePress: () => void
}

const WorkoutForm = ({
                         formHandler,
                         setHandler,
                         onAddSet,
                         sets,
                         workout,
                         hangboard,
                         onDeletePress
                     }: WorkoutFormProps) => {
    const navigation = useNavigation();
    const [hangboards, setHangboards] = useState<Hangboard[]>([]);
    const [selectedBoard, setSelectedBoard] = useState<Hangboard>();
    const [holdsSelected, setHoldsSelected] = useState<boolean>();
    const [allInstructionsValid, setAllInstructionsValid] = useState<boolean>(true);
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const isKeyboardVisible = useKeyboardVisible();
    const {addError} = useAPIError();
    const {getAllHangboards} = useMyBoardsAPI();

    useEffect(() => {
        (async () => {
            try {
                const result = await getAllHangboards();
                setHangboards(result);
            } catch (ex: any) {
                addError("ERROR RETRIEVING HANGBOARDS. PLEASE TRY AGAIN.", ex.status);
                navigation.navigate("Workouts");
            }
        })();
    }, []);

    useEffect(() => {
        setHoldsSelected(false)
        validateHolds();
    }, [sets]);

    const validateHolds = () => {
        setHoldsSelected(sets.some(s => s?.setHolds?.length < 1));
    }

    const updateProp = (setIndex: number, propName: string, value: string) => {
        if (Number.parseInt(value) > 0 || (propName === "weight" && Number.parseInt(value) >= 0)) {
            setHandler((sets) => sets.map((set, i) => {
                if (i === setIndex) {
                    set[propName] = Number.parseInt(value);
                    return set;
                }
                return set;
            }));
        }
    }

    const handleSetInstructions = (setIndex: number, value: string) => {
        setAllInstructionsValid(value.length <= 50);
        setHandler(sets => sets.map((set, i) => {
            if (i === setIndex) set.instructions = value;
            return set;
        }))
    }

    const handleSetGrip = (setIndex: number, hand: string, grip: gripType) => {
        switch (hand) {
            case "left":
                sets[setIndex].leftGripType = grip;
                break;
            case 'right':
                sets[setIndex].rightGripType = grip
                break;
        }
    }

    const handleHoldPress = (hold: Hold, setIndex: number) => {
        const selectedSet: Set = sets[setIndex];
        if (!selectedSet.setHolds) return;

        const holdExists = selectedSet.setHolds
            .map(x => x.hold.id)
            .includes(hold.id);

        if (holdExists) {
            setHandler((sets) =>
                [...sets.map((set, i) => {
                    if (i === setIndex) {
                        set.setHolds = set.setHolds ? set.setHolds.filter((holdSet: SetHold) =>
                            holdSet.holdId !== hold.id
                        ) : [];
                    }
                    return set;
                })]
            )
        } else if (selectedSet?.setHolds.length > 1) {
            return
        } else {
            setHandler((sets) =>
                [...sets.map((set, i) => {
                    if (i === setIndex && set.setHolds && hold.id) {
                        let selectedHold: SetHold = {
                            holdId: hold.id,
                            hold,
                            setId: set.id || 0,
                            hand: set.setHolds[0]?.hand === 0 ? 1 : 0
                        }
                        set.setHolds = [...set.setHolds, selectedHold];
                    }
                    return set;

                })]
            )
        }
    }

    const handleHangboardSelect = (selectedItem) => {
        // clear sets if selected board is different then the current board.
        if (selectedBoard && selectedBoard.id !== selectedItem.id) {
            setHandler([{
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
            }]);
        }
        setSelectedBoard(selectedItem);
    }

    const duplicateSet = (setIndex: number) => {
        // create copy of set at index
        const duplicateSet: Set = JSON.parse(JSON.stringify(sets[setIndex]));

        if (!duplicateSet.setHolds) return;
        // remove set id from set holds 
        duplicateSet.setHolds.map(setHold => {
            setHold.setId = 0;
            return setHold;
        });

        duplicateSet.id = undefined;
        // create copy of set list and insert new set
        const setListCopy = JSON.parse(JSON.stringify(sets));
        setListCopy.splice(setIndex, 0, duplicateSet);
        setHandler(setListCopy);
    }

    const removeSet = (setIndex: number) => {
        const setListCopy = JSON.parse(JSON.stringify(sets));
        setListCopy.splice(setIndex, 1);
        setHandler(setListCopy);
    }

    const moveSet = (setIndex: number, direction: "up" | "down") => {
        setHandler(sets => {
            console.log(sets)
            switch (direction) {
                case "up":
                    if(sets.indexOf(sets[setIndex - 1]) < 0) break;
                    const tmp1 = sets[setIndex];
                    sets[setIndex] = sets[setIndex - 1]
                    sets[setIndex - 1] = tmp1;
                    break;
                case "down":
                    if(sets.indexOf(sets[setIndex + 1]) < 0) break;
                    const tmp2 = sets[setIndex];
                    sets[setIndex] = sets[setIndex + 1]
                    sets[setIndex + 1] = tmp2;
                    break;

            }
            console.log(sets)
            return [...sets];
        })
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <Formik
                    validationSchema={workoutSchema}
                    initialValues={{
                        id: workout?.id,
                        name: workout?.name,
                        description: workout?.description
                    }}
                    onSubmit={(values) => {
                        if (!holdsSelected) {
                            formHandler(values, selectedBoard ?? hangboard, sets)
                        }
                    }}
                >
                    {/* Form Handling */}
                    {({handleChange, handleSubmit, touched, values, errors, isValid}) => {
                        useEffect(() => {
                            navigation.setOptions({
                                headerRight: () => {
                                    return <SecondaryBtn
                                        disabled={!allInstructionsValid}
                                        color={"#EBB93E"}
                                        title='Finished'
                                        onPress={(data) => {
                                            if (allInstructionsValid) {
                                                handleSubmit(data);
                                            }
                                        }}/>
                                }
                            });
                        }, [allInstructionsValid]);

                        useEffect(() => setIsFormValid(isValid), [isValid]);

                        return (
                            <View>
                                <View style={styles.innerContainer}>
                                    {/* Workout name input */}
                                    <View>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="workout name..."
                                            autoCapitalize="none"
                                            onChangeText={handleChange('name')}
                                            value={values.name}
                                        />
                                        {errors.name && touched.name ? (
                                            <Text style={styles.validationMessage}>{errors.name}</Text>
                                        ) : null}
                                    </View>
                                    {/* Workout description input */}
                                    <View>
                                        <TextInput
                                            style={{...styles.input, top: 15, marginBottom: 20}}
                                            placeholder="describe the workout..."
                                            autoCapitalize="none"
                                            onChangeText={handleChange('description')}
                                            value={values.description}
                                            multiline={true}
                                        />
                                        {errors.description && touched.description ? (
                                            <Text style={styles.validationMessage}>{errors.description}</Text>
                                        ) : null}
                                    </View>
                                    {/* Hangboard select input */}
                                    {!hangboard ?
                                        <View>
                                            <SelectDropdown
                                                defaultValue={selectedBoard ?? hangboard ?? null}
                                                defaultButtonText={selectedBoard?.name ?? "Select Hangboard"}
                                                buttonStyle={styles.selectInput}
                                                data={hangboards || []}
                                                onSelect={handleHangboardSelect}
                                                buttonTextAfterSelection={(selectedItem) => selectedItem.name}
                                                rowTextForSelection={(item) => item.name}
                                            />
                                        </View>
                                        : null}
                                </View>
                                <View>
                                    {/* check if a board is selected then display set configuration */}
                                    {(hangboard ?? selectedBoard)
                                    && Object.keys(hangboard ?? selectedBoard).length !== 0
                                    && Object.getPrototypeOf(hangboard ?? selectedBoard) === Object.prototype
                                        ? sets.map((s: Set, i: number) => (
                                            <SetDropownMenu
                                                key={i}
                                                onMove={moveSet}
                                                hangboard={selectedBoard ?? hangboard}
                                                onInstructionInput={handleSetInstructions}
                                                onFieldUpdate={updateProp}
                                                onGripSelect={handleSetGrip}
                                                onHoldPress={handleHoldPress}
                                                onDuplicate={duplicateSet}
                                                onRemove={removeSet}
                                                set={s}
                                                setIndex={i}
                                                isLastSet={sets.length - 1 === i}
                                            />
                                        ))
                                        : null}
                                    <View>
                                        {hangboard || selectedBoard ? <Pressable
                                            style={{
                                                borderColor: "#EBB93E",
                                                borderStyle: "dotted",
                                                borderWidth: 2,
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                padding: 10,
                                                marginLeft: 15,
                                                marginRight: 15,
                                                marginTop: 20,
                                                marginBottom: 20
                                            }}
                                            onPress={onAddSet}
                                        ><Text style={{color: "#EBB93E",}}>ADD SET</Text>
                                        </Pressable> : null}
                                        {workout?.id ? <Pressable
                                            style={{
                                                borderColor: "red",
                                                borderStyle: "dotted",
                                                borderWidth: 2,
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                padding: 10,
                                                marginLeft: 15,
                                                marginRight: 15,
                                                marginBottom: 20
                                            }}
                                            onPress={onDeletePress}
                                        ><Text style={{color: "red",}}>DELETE WORKOUT</Text>
                                        </Pressable> : null}
                                    </View>
                                </View>
                            </View>
                        )
                    }}
                </Formik>
            </ScrollView>
            {(!allInstructionsValid && !isKeyboardVisible) || !isFormValid ? <View style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                backgroundColor: 'red',
                padding: 10
            }}><Text style={{color: '#f5f5f5'}}>Some fields aren't valid.</Text>
            </View> : null}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: 'column',
        height: '100%'
    },
    selectInput: {
        backgroundColor: '#f5f5f5',
        width: "100%",
        borderRadius: 4,
        marginTop: 10,
        marginBottom: 8,
    },
    innerContainer: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
        paddingBottom: 7,
    },
    input: {
        backgroundColor: '#b4b1ac',
        borderRadius: 4,
        paddingLeft: 15,
        paddingRight: 15,
        color: 'black'
    },
    chipListRow: {
        marginBottom: 20
    },
    chipListScroller: {
        display: "flex",
        flexDirection: 'row'
    },
    chipListLabel: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 10
    },
    chip: {
        marginHorizontal: 5
    },
    validationMessage: {
        color: 'red',
        marginTop: 4
    }
});

export default WorkoutForm;