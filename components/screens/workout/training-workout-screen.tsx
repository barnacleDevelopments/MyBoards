import React, {useEffect, useRef, useState} from 'react';

// Hooks
import KeepAwake from '@sayem314/react-native-keep-awake';

// Types
import Workout from '../../../types/models/workout';
import RepCompleter from '../../rep-completer';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

// Components
import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Hold} from '../../../types/models/hangboard';
import useTrainer from '../../../hooks/use-trainer';
import {RepStack} from '../../../types/models/rep-stack';
import DescriptionBox from '../../description-box';
import {imageAspectRatio, positionPin} from '../../../functions/hangboard-panel';
import {BoardDimensions} from '../../../types/board-dimensions';

type RootStackParamList = {
    TrainingWorkoutScreen: Workout;
}

type Props = NativeStackScreenProps<RootStackParamList, 'TrainingWorkoutScreen'>;

const TrainingWorkoutScreen = ({navigation, route}: Props) => {
    const workout: Workout = route.params;
    const [workoutComplete, setWorkoutComplete] = useState<boolean>(false);
    const [boardSize, setBoardSize] = useState<BoardDimensions>({width: 0, height: 0});
    const trainer = useTrainer(workout);
    const scrollViewRef = useRef();

    useEffect(() => {
        startWorkout();
        return () => {
            trainer.stopWorkout();
        };
    }, []);
    
    useEffect(() => {
        if(trainer.activeTimerName === "RestTimer") {
            scrollBottom();
        }
    }, [trainer.activeTimerName]);

    useEffect(() => {
        if (trainer.UIRepStack.length === 0 && workoutComplete) {
            navigation.navigate("Dash")
        }

    }, [trainer.UIRepStack.length]);
    
    const scrollBottom = () => {
        scrollViewRef.current.scrollToEnd({
            animated: true
        })
    }

    const startWorkout = () => {
        trainer.startWorkout().then(() => {
            setWorkoutComplete(true)
            trainer.stopWorkout();
        });
    }

    const displayProgressText = () => {
        switch (trainer.activeTimerName) {
            case 'RestTimer':
                return "REST"
            case "WorkoutTimer":
                return "HOLD"
            default:
                return "INTERMISSION"
        }
    }

    const getHandLetter = (hold: Hold) => {
        return trainer?.UISet?.setHolds
            ?.find(sh => sh.holdId === hold.id)?.hand === 0 ? "L" : "R"
    }
    
    const logRep = (data) => {
        scrollViewRef.current.scrollTo({
            y: 0,
            animated: true
        })
        trainer.setUIRepStack(data);
    }

    const aspectRatio = imageAspectRatio(workout.hangboard?.boardWidth, workout.hangboard?.boardHeight);
    
    const pinList = workout.hangboard.holds.filter((hold: Hold, i: number) => 
            trainer?.UISet?.setHolds?.map(setHold => setHold?.hold?.id).includes(hold.id));

    return (
        <View style={styles.container}>
            <KeepAwake/>
            {/* Set and rep switcher */}
            {!workoutComplete && trainer.activeTimerName !== "WorkoutTimer" ?
                <View style={styles.headerContainer}>
                    <View style={styles.headerChanger}>
                        {workout.sets.indexOf(trainer.UISet) !== 0 ?
                            <TouchableOpacity style={styles.headerBtn} onPress={trainer.previousSet}>
                                <Text style={styles.headerArrow}>{"<"}</Text>
                            </TouchableOpacity> : <View style={styles.headerBtn}></View>}
                        <View>
                            <Text style={styles.currentSetNumber}>
                                {workout.sets.indexOf(trainer.UISet) + 1}/{workout.sets.length}
                            </Text>
                            <Text style={styles.headerText}>SET</Text>
                        </View>
                        {workout.sets.indexOf(trainer.UISet) !== workout.sets.length - 1 ?
                            <TouchableOpacity style={styles.headerBtn} onPress={trainer.nextSet}>
                                <Text style={styles.headerArrow}>{">"}</Text>
                            </TouchableOpacity> : <View style={styles.headerBtn}></View>}
                    </View>
                    <View style={styles.headerChanger}>
                        {trainer.UIRemainingReps !== 0 ?
                            <TouchableOpacity style={styles.headerBtn} onPress={trainer.previousRep}>
                                <Text style={styles.headerArrow}>{"<"}</Text>
                            </TouchableOpacity> : <View style={styles.headerBtn}></View>}
                        <View>
                            <Text style={{
                                fontSize: 30,
                                textAlign: "center",
                                fontWeight: "bold",
                                color: '#f5f5f5'
                            }}>{trainer.UIRemainingReps + 1}/{trainer?.UISet?.reps}</Text>
                            <Text style={styles.headerText}>REP</Text>
                        </View>
                        {trainer.UIRemainingReps + 1 !== trainer?.UISet?.reps ?
                            <TouchableOpacity style={styles.headerBtn} onPress={trainer.nextRep}>
                                <Text style={styles.headerArrow}>{">"}</Text>
                            </TouchableOpacity> : <View style={styles.headerBtn}></View>}
                    </View>
                </View>
                : null}

            <ScrollView ref={scrollViewRef} contentContainerStyle={styles.bodyContainer}>
                {/* Hangboard interface  */}
                {!workoutComplete ?
                    <View style={styles.timerContainer}>
                        <View
                            onLayout={({nativeEvent}) => setBoardSize(nativeEvent.layout)}
                            style={{
                                width: "100%",
                                borderRadius: 5,
                            }}>
                            <Image
                                source={{uri: workout.hangboard.imageURL}}
                                style={{...styles.boardImage, aspectRatio}}/>
                            {pinList.map((hold, i) => (
                                <View key={i} style={{
                                    ...styles.pin,
                                    backgroundColor: "#EBB93E",
                                    top: positionPin(hold.baseUIYCoord, workout.hangboard.boardHeight, boardSize.height) - 10 || 0,
                                    left: positionPin(hold.baseUIXCoord, workout.hangboard.boardWidth, boardSize.width) - 10 || 0
                                }}>
                                    {<Text style={styles.pinText}>
                                        {getHandLetter(hold)}
                                    </Text>}
                                </View>
                            ))}
                        </View>

                        {/* Timer progress interface */}
                        <View style={styles.timerBox}>
                            {trainer.UISet?.weight ?
                                <Text style={{color: "white", fontSize: 20}}>{trainer.UISet?.weight}LB
                                    Added</Text> : null}
                            {trainer.UIRepStack.length === 0 ? <Text style={styles.timerText}>
                                {trainer.UIClock?.getMinutes()}:{trainer.UIClock?.getSeconds() < 10 ?
                                `0${trainer.UIClock?.getSeconds()}` :
                                trainer.UIClock?.getSeconds()}
                            </Text> : null}
                            <View style={styles.progressContainer}>
                                <View style={styles.progressBarContainer}>
                                    {trainer.UIProgress ? <View
                                        style={{
                                            ...styles.progressBar,
                                            width: `${trainer.UIProgress}%`,
                                            backgroundColor: trainer.UIColor,
                                        }}></View> : null}
                                </View>
                                <Text style={styles.progressText}>{displayProgressText()}</Text>
                                <Text style={styles.instructions}>{trainer.UISet?.instructions}</Text>
                            </View>
                        </View>
                    </View> : null}
                    <View style={{ width: '100%'}}>
                        {workoutComplete ?
                            <DescriptionBox
                                header="Congrats you've reached the end"
                                text='If you have any remaining reps to confirm
                                      they will appear here. '/>
                            : null}
                        {trainer.UIRepStack.map((rs: RepStack, i) => (
                            <RepCompleter
                                key={i}
                                index={i}
                                onSelection={logRep}
                                repLogger={trainer.logRep}
                                repStack={rs} />
                        ))}
                    </View>
            </ScrollView>
            <View>
                {!workoutComplete ? <View style={styles.timerControlsContainer}>
                    {/* Timer Controls */}
                    {trainer.UITimerState ?
                        <View style={{flex: 1, height: 80}}>
                            <TouchableOpacity style={styles.pauseBtn} onPress={trainer.pauseWorkout}>
                                <Text style={styles.timerBtnText}>PAUSE</Text>
                            </TouchableOpacity>
                        </View>
                        :
                        <View style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'row',
                            width: "100%",
                            height: 80
                        }}>
                            <View style={{flex: 2}}>
                                <TouchableOpacity style={styles.resumeBtn} onPress={trainer.resumeWorkout}>
                                    <Text style={styles.timerBtnText}>RESUME</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{flex: 1}}>
                                <TouchableOpacity style={styles.stopBtn}
                                                  onPress={() => navigation.navigate("Workouts")}>
                                    <Text style={styles.timerBtnText}>STOP</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.resetBtn} onPress={trainer.resetWorkout}>
                                    <Text style={styles.timerBtnText}>RESET</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }
                </View> : null}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: '#212121'
    },
    pin: {
        height: 25,
        width: 25,
        borderRadius: 50,
        position: 'absolute',
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    pinText: {
        fontSize: 15,
        fontWeight: "800"
    },
    boardImage: {
        position: 'relative',
        resizeMode: 'contain',
        width: "100%"
    },
    boardContainier: {
      
    },
    timerBox: {
        marginTop: 15,
        width: "100%",
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center'
    },
    timerContainer: {
        width: "100%",
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center'
    },
    progressContainer: {
        width: "100%",
        flexDirection: 'column',
        alignItems: 'center'
    },
    progressBarContainer: {
        borderWidth: 1,
        borderColor: '#f5f5f5',
        borderStyle: 'solid',
        width: "90%",
        height: 27,
        backgroundColor: '#f5f5f5'
    },
    progressBar: {
        height: 25
    },
    timerText: {
        fontSize: 70,
        fontWeight: "bold",
        color: '#f5f5f5'
    },
    headerContainer: {
        display: 'flex',
        justifyContent: "center",
        flexDirection: "row",
        backgroundColor: "#333333",
        height: 80,
        alignItems: 'center'
    },
    headerChanger: {
        display: 'flex',
        flex: 1,
        justifyContent: "center",
        flexDirection: "row",
        height: "100%",
        alignItems: 'center'
    },
    headerBtn: {
        flex: 1,
        height: "100%",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    currentSetNumber: {
        fontSize: 30,
        textAlign: "center",
        fontWeight: "bold",
        color: '#f5f5f5'
    },
    headerText: {
        fontSize: 15,
        textAlign: "center",
        fontWeight: "bold",
        color: '#f5f5f5'
    },
    headerArrow: {
        color: '#f5f5f5',
        fontSize: 50,
        fontWeight: 'bold'
    },
    bodyContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        alignItems: "center"
    },
    recordRepsText: {
        fontSize: 30,
        color: "#f5f5f5",
        textAlign: 'center'
    },
    progressText: {
        fontSize: 20,
        marginTop: 15,
        color: '#f5f5f5'
    },
    instructions: {
        fontSize: 25,
        paddingLeft: 15,
        paddingRight: 15,
        marginBottom: 15,
        color: '#f5f5f5'
    },
    workoutEndText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: "center"
    },
    workoutEndText2: {
        fontSize: 15,
        textAlign: "center"
    },
    timerControlsContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: "100%"
    },
    pauseBtn: {
        height: "100%",
        backgroundColor: 'blue',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    timerBtnText: {
        color: '#f5f5f5',
        fontSize: 15,
        fontWeight: 'bold'
    },
    resumeBtn: {
        height: "100%",
        backgroundColor: "#EBB93E",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    stopBtn: {
        height: "50%",
        backgroundColor: '#710C10',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    resetBtn: {
        height: "50%",
        backgroundColor: 'blue',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default TrainingWorkoutScreen;