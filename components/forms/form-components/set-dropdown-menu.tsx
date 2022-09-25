import React, {useEffect, useState} from 'react';

// Components
import {Image, Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import {ListItem} from 'react-native-elements';
import SelectDropdown from 'react-native-select-dropdown';

// Types
import Set from "../../../types/models/set";
import {Hangboard, Hold} from '../../../types/models/hangboard';
import {BoardDimensions} from '../../../types/board-dimensions';
import {imageAspectRatio, positionPin} from '../../../functions/hangboard-panel';
import Slider from '@react-native-community/slider';
import {secondsToMinutes} from '../../../functions/utility';
import SecondaryButton from "../../buttons/secondary-btn";

interface SetDropDownProps {
    onInstructionInput: (setIndex: number, value: string) => void,
    onFieldUpdate: (index: number, prop: string, value: number) => void,
    onGripSelect: (setIndex: number, hand: string, itemIndex: number) => void,
    onHoldPress: (hold: Hold, setIndex: number) => void,
    onDuplicate: (setIndex: number) => void,
    onRemove: (setIndex: number) => void,
    onMove: (setIndex: number, direction: "up" | "down") => void,
    set: Set,
    setIndex: number,
    hangboard: Hangboard,
    isLastSet: boolean
}

let timerId;

const SetDropownMenu = ({
                            onHoldPress,
                            onInstructionInput,
                            onFieldUpdate,
                            onGripSelect,
                            onRemove,
                            onMove,
                            onDuplicate,
                            set,
                            setIndex,
                            hangboard,
                            isLastSet
                        }: SetDropDownProps) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [screenSize, setScreenSize] = useState<BoardDimensions>({width: 0, height: 0});
    const [holdsSelected, setHoldsSelected] = useState<boolean>();
    const [instructionsValid, setInstructionsValid] = useState<boolean>(true);
    const gripTypes = ['full crimp', 'half crimp', 'open hand'];

    useEffect(() => {
        validateHolds();
    }, [set.setHolds]);

    const aspectRatio = imageAspectRatio(hangboard?.boardWidth, hangboard?.boardHeight);

    const validateHolds = () =>
        setHoldsSelected(set.setHolds.length < 1);

    const handleInstructions = (value: string) => {
        onInstructionInput(setIndex, value);
        setInstructionsValid(value.length <= 50);
    }

    const toggleExpanded = () =>
        isExpanded ? setIsExpanded(false) : setIsExpanded(true);

    const handleFieldHold = (setIndex: number, fieldName: string, currentValue: number, direction: "down" | "up") => {
        let cap = 1;
        if(fieldName === "weight") cap = 0;
        switch (direction) {
            case "down":
                if (timerId) break;
                    timerId = setInterval(() => {
                        onFieldUpdate(setIndex, fieldName, set[fieldName] > cap ? 
                            set[fieldName] - 1 : set[fieldName]);
                    }, 50);
                    
                break;
            case "up":
                if (timerId) break;
                    timerId = setInterval(() => {
                        onFieldUpdate(setIndex, fieldName, set[fieldName] >= cap ? 
                            set[fieldName] + 1 : set[fieldName]);
                    }, 50);
                break
        }
    }

    const onFieldOut = () => {
        clearInterval(timerId);
        timerId = null;
    }

    return (
        <ListItem.Accordion
            containerStyle={{...styles.container}}
            theme={{colors: {text: '#f5f5f5'}}}
            content={
                <ListItem.Content>
                    <ListItem.Title style={styles.title}>
                        <View style={styles.titleTextContainer}>
                            <View style={styles.moveSetBtnContainer}>
                                {!(setIndex - 1 < 0) ? <Pressable onPress={() => onMove(setIndex, "up")} 
                                           style={[{marginBottom: 3, transform: [{rotate: "90deg"}] }, styles.moveSetBtn]}>
                                    <Text style={styles.moveSetBtnText}>{"<"}</Text>
                                </Pressable> : null}
                                {!isLastSet ? <Pressable onPress={() => onMove(setIndex, "down")} 
                                           style={styles.moveSetBtn}>
                                    <Text style={styles.moveSetBtnText}>{">"}</Text>
                                </Pressable> : null}
                            </View>
                            <Text style={styles.headerText}>Set {setIndex + 1}</Text>
                            <View style={styles.setHeaderButtons}>
                                <View style={{marginRight: 10}}>
                                    {setIndex !== 0 ? <SecondaryButton title="remove"
                                                                       color={'#710C10'}
                                                                       onPress={() => onRemove(setIndex)}/> : null}
                                </View>
                                <SecondaryButton
                                    title="duplicate"
                                    onPress={() => onDuplicate(setIndex)}
                                    color={'black'}
                                />
                            </View>
                        </View>
                    </ListItem.Title>
                </ListItem.Content>
            }
            onPress={toggleExpanded}
            isExpanded={isExpanded}
        >
            {/* Hangboard configuration panel */}
            <View
                onLayout={({nativeEvent}) => setScreenSize(nativeEvent.layout)}
                style={{
                    width: "100%",
                    borderRadius: 5,
                }
                }>
                <Image
                    source={{uri: hangboard.imageURL}}
                    style={{
                        position: 'relative',
                        aspectRatio: aspectRatio,
                        backgroundColor: '#710C10',
                        resizeMode: 'contain'
                    }}
                />
                {hangboard.holds.map((hold: Hold, i: number) => {

                    const holdIds = set.setHolds && set?.setHolds
                        .map(h => h.holdId);

                    const includedInSet = holdIds && holdIds
                        .includes(hold.id);

                    const setHold = set.setHolds?.find(setHold => {
                        return setHold.holdId === hold.id
                    })

                    return (includedInSet ?
                        <Pressable
                            onPress={() => onHoldPress(hold, setIndex)}
                            key={i}
                            style={{
                                ...styles.pin,
                                backgroundColor: "#EBB93E",
                                top: positionPin(
                                    hold.baseUIYCoord,
                                    hangboard.boardHeight,
                                    screenSize.height
                                ) - 10 || 0,
                                left: positionPin(
                                    hold.baseUIXCoord,
                                    hangboard.boardWidth,
                                    screenSize.width
                                ) - 10 || 0
                            }}>
                            <Text style={{fontWeight: '900', fontSize: 10}}>{setHold?.hand === 0 ? 'L' : 'R'}</Text>
                        </Pressable>
                        :
                        <Pressable
                            onPress={() => onHoldPress(hold, setIndex)}
                            key={i}
                            style={{
                                ...styles.pin,
                                backgroundColor: '#710C10',
                                top: positionPin(hold.baseUIYCoord, hangboard.boardHeight, screenSize.height) - 10 || 0,
                                left: positionPin(hold.baseUIXCoord, hangboard.boardWidth, screenSize.width) - 10 || 0
                            }}>
                        </Pressable>)
                })}
            </View>
            {/* Left and right hand grip configuration */}
            <View style={styles.gripContainer}>
                {set.setHolds.length >= 1 ?
                    set.setHolds
                        .sort((a, b) => a.hand < b.hand ? -1 : 1)
                        .map((setHold, i) => {
                            const hand = setHold.hand === 0 ? 'LEFT' : 'RIGHT';
                            const gripType = setHold.hand === 0 ? set.leftGripType : set.rightGripType;

                            return (
                                <View key={i} style={{width: '48%', padding: 10}}>
                                    <Text style={styles.gripSelectHeader}>
                                        {hand}
                                    </Text>
                                    <Text style={styles.gripSubHeader}>
                                        hand
                                    </Text>
                                    <SelectDropdown
                                        defaultValue={gripType}
                                        defaultButtonText={gripTypes[gripType]}
                                        buttonStyle={{...styles.selectButton}}
                                        data={gripTypes}
                                        onSelect={(selectedItem, i) =>
                                            onGripSelect(setIndex, setHold.hand === 0 ? 'left' : 'right', i)}
                                        buttonTextAfterSelection={(selectedItem) => selectedItem}
                                        rowTextForSelection={(item) => item}
                                    />
                                    <View style={styles.holdTextContainer}>
                                        <Text style={styles.holdText}>{setHold.hold.depthMM} mm</Text>
                                        <Text style={styles.holdText}>{setHold.hold.fingerCount} fingers</Text>
                                    </View>
                                </View>
                            )
                        })
                    : null}
            </View>
            {/* Set details configuration */}
            {holdsSelected ?
                <Text style={styles.validationText}>
                    one hold must be selected.
                </Text> : null}

            {set ? <View style={styles.setContainer}>
                <View style={styles.setInstructionContainer}>
                    <Text style={{...styles.text, marginBottom: 8, fontSize: 20}}>Instructions</Text>
                    <TextInput
                        multiline={true}
                        maxLength={51}
                        style={styles.textInput}
                        placeholder="write instructions..."
                        autoCapitalize="none"
                        defaultValue={set.instructions || ""}
                        onChangeText={handleInstructions}
                    />
                    {!instructionsValid ? (
                        <Text style={styles.validationMessage}>length cannot exceed 50 characters</Text>
                    ) : null}
                </View>
                <View style={styles.incrementerContainer}>
                    <View style={styles.sliderContainer}>
                        <View style={styles.sliderTextBox}>
                            <Text style={styles.adjusterText}>HANG TIME</Text>
                            <View style={styles.incrementer}>
                                <Pressable style={styles.updateBtn}
                                           onPress={() => onFieldUpdate(setIndex, "hangTime", set.hangTime - 1)}
                                           onLongPress={() => handleFieldHold(setIndex, "hangTime", set.hangTime, "down")}
                                           onPressOut={onFieldOut}>
                                    <Text style={styles.updateBtnText}>-</Text>
                                </Pressable>
                                <Text style={styles.timeText}>{secondsToMinutes(set.hangTime)}</Text>
                                <Pressable style={styles.updateBtn}
                                           onPress={() => onFieldUpdate(setIndex, "hangTime", set.hangTime + 1)}
                                           onLongPress={() => handleFieldHold(setIndex, "hangTime", set.hangTime, "up")}
                                           onPressOut={onFieldOut}>
                                    <Text style={styles.updateBtnText}>+</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.incrementerContainer}>
                    <View style={styles.sliderContainer}>
                        <View style={styles.sliderTextBox}>
                            <Text style={styles.adjusterText}>REST TIME</Text>
                            <View style={styles.incrementer}>
                                <Pressable style={styles.updateBtn}
                                           onPress={() => onFieldUpdate(setIndex, "restTime", set.restTime - 1)}
                                           onLongPress={() => handleFieldHold(setIndex, "restTime", set.restTime, "down")}
                                           onPressOut={onFieldOut}>
                                    <Text style={styles.updateBtnText}>-</Text>
                                </Pressable>
                                <Text style={styles.timeText}>{secondsToMinutes(set.restTime)}</Text>
                                <Pressable style={styles.updateBtn}
                                           onPress={() => onFieldUpdate(setIndex, "restTime", set.restTime + 1)}
                                           onLongPress={() => handleFieldHold(setIndex, "restTime", set.restTime, "up")}
                                           onPressOut={onFieldOut}>
                                    <Text style={styles.updateBtnText}>+</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.incrementerContainer}>
                    <View style={styles.sliderContainer}>
                        <View style={styles.sliderTextBox}>
                            <Text style={styles.adjusterText}>REPS</Text>
                            <Text style={styles.sliderText}>{set.reps}</Text>
                        </View>
                        <Slider
                            style={{width: "100%"}}
                            minimumValue={1}
                            maximumValue={10}
                            minimumTrackTintColor="#FFFFFF"
                            maximumTrackTintColor="#000000"
                            thumbTintColor="#EBB93E"
                            value={set.reps}
                            onValueChange={value => onFieldUpdate(setIndex, "reps", value)}
                            onLayout={e => e.preventDefault()}
                        />
                    </View>
                </View>
                <View style={styles.incrementerContainer}>
                    <View style={styles.sliderContainer}>
                        <View style={styles.sliderTextBox}>
                            <Text style={styles.adjusterText}>EXTRA WEIGHT</Text>
                            <View style={styles.incrementer}>
                                <Pressable style={styles.updateBtn}
                                           onPress={() => onFieldUpdate(setIndex, "weight", set.weight - 1)}
                                           onLongPress={() => handleFieldHold(setIndex, "weight", set.weight, "down")}
                                           onPressOut={onFieldOut}>
                                    <Text style={styles.updateBtnText}>-</Text>
                                </Pressable>
                                <Text style={styles.timeText}>{set.weight}lb</Text>
                                <Pressable style={styles.updateBtn}
                                           onPress={() => onFieldUpdate(setIndex, "weight", set.weight + 1)}
                                           onLongPress={() => handleFieldHold(setIndex, "weight", set.weight, "up")}
                                           onPressOut={onFieldOut}>
                                    <Text style={styles.updateBtnText}>+</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </View>
                {!isLastSet ? <View style={styles.incrementerContainer}>
                    <View style={styles.sliderContainer}>
                        <View style={styles.sliderTextBox}>
                            <Text style={styles.adjusterText}>REST BEFORE NEXT SET</Text>
                            <View style={styles.incrementer}>
                                <Pressable style={styles.updateBtn}
                                           onLongPress={() => handleFieldHold(setIndex, "restBeforeNextSet", set.restBeforeNextSet, "down")}
                                           onPressOut={onFieldOut}
                                           onPress={() => onFieldUpdate(setIndex, "restBeforeNextSet", set.restBeforeNextSet - 1)}>
                                    <Text style={styles.updateBtnText}>-</Text>
                                </Pressable>
                                <Text style={styles.timeText}>{secondsToMinutes(set.restBeforeNextSet)}</Text>
                                <Pressable style={styles.updateBtn}
                                           onLongPress={() => handleFieldHold(setIndex, "restBeforeNextSet", set.restBeforeNextSet, "up")}
                                           onPressOut={onFieldOut}
                                           onPress={() => onFieldUpdate(setIndex, "restBeforeNextSet", set.restBeforeNextSet + 1)}>
                                    <Text style={styles.updateBtnText}>+</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </View> : null}
            </View> : null}
        </ListItem.Accordion>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#333333'
    },
    adjusterText: {
      fontWeight: 'bold',
      fontSize: 20  
    },
    moveSetBtn: {
        backgroundColor: "white", 
        width: 35, 
        height: 35, 
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        transform: [{rotate: "90deg"}]
    },
    moveSetBtnText: {
        color: "black",
        fontWeight: "bold"
    },
    moveSetBtnContainer: {
        marginRight: 10
    },
    incrementer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%"
    },
    updateBtn: {
        backgroundColor: "white",
        height: 40,
        width: 40,
        borderRadius: 4,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    updateBtnText: {
        fontSize: 20,
        color: "black",
        fontWeight: "bold",
        textAlignVertical: 'center',
    },
    timeText: {
        fontSize: 20,
        marginRight: 15,
        marginLeft: 15
    },
    setHeaderButtons: {
        display: 'flex',
        flexDirection: 'row'
    },
    incrementerContainer: {
        display: "flex",
        marginBottom: 15,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between',
        width: "100%",
        backgroundColor: '#b4b1ac',
        borderRadius: 7,
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 10,
        paddingBottom: 10
    },
    sliderContainer: {
        flex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
        
    },
    sliderText: {
        marginBottom: 5,
    },
    sliderTextBox: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: "center",
        width: '100%',
        paddingRight: 14,
        paddingLeft: 14,
    },
    title: {
        fontSize: 15,
        fontWeight: 'bold',

    },
    titleTextContainer: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row'
    },
    gripSelectHeader: {
        fontSize: 23,
        textAlign: 'center',
        marginBottom: 10,
        marginTop: 10,
        color: '#f5f5f5'
    },
    gripSubHeader: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 10,
        marginTop: -10,
        color: '#f5f5f5'
    },
    gripContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 15,
        width: '100%'
    },
    holdTextContainer: {
        marginTop: 10
    },
    holdText: {
        textAlign: 'center',
        color: '#f5f5f5',
        fontSize: 20
    },
    selectButton: {
        borderStyle: 'solid',
        borderColor: 'grey',
        borderRadius: 4,
        borderWidth: 1,
        width: '100%',
        backgroundColor: '#b4b1ac'
    },
    headerText: {
        marginRight: 20,
        fontSize: 20,
        color: '#f5f5f5'
    },
    textInput: {
        color: 'black',
        backgroundColor: '#b4b1ac',
        paddingLeft: 10,
        borderRadius: 4,
    },

    setContainer: {
        paddingLeft: 15,
        paddingRight: 15
    },
    setInstructionContainer: {
        marginBottom: 15,
        flexDirection: "column",
        width: "100%",
        paddingTop: 10
    },
    text: {
        color: '#f5f5f5',
        flex: 1,
        marginRight: 15,
        fontSize: 16
    },
    validationText: {
        color: 'red',
        marginTop: 10,
        textAlign: 'center',
        marginBottom: 25
    },
    pin: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 20,
        width: 20,
        borderRadius: 50,
        position: 'absolute',
        borderColor: 'black',
        borderStyle: 'solid',
        borderWidth: 1
    },
    validationMessage: {
        color: 'red',
        marginTop: 8
    }
});

export default SetDropownMenu;
