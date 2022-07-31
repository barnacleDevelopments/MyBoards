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
    onSliderUpdate: (index: number, prop: string, value: number) => void,
    onGripSelect: (setIndex: number, hand: string, itemIndex: number) => void,
    onHoldPress: (hold: Hold, setIndex: number) => void,
    onDuplicate: (setIndex: number) => void,
    onRemove: (setIndex: number) => void,
    set: Set,
    setIndex: number,
    hangboard: Hangboard,
    isLastSet: boolean
}

const SetDropownMenu = ({
                            onHoldPress,
                            onInstructionInput,
                            onSliderUpdate,
                            onGripSelect,
                            onRemove,
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

    return (
        <ListItem.Accordion
            containerStyle={{...styles.container}}
            theme={{colors: {text: '#f5f5f5'}}}
            content={
                <ListItem.Content>
                    <ListItem.Title style={styles.title}>
                        <View style={styles.titleTextContainer}>
                            <Text style={styles.headerText}>Set {setIndex + 1}</Text>
                            <View style={styles.setHeaderButtons}>
                                <View style={{marginRight: 10}}>
                                    {setIndex !== 0 ?
                                        <SecondaryButton
                                            title="remove"
                                            color={'#710C10'}
                                            onPress={() => onRemove(setIndex)}/> : null}
                                </View>
                                <SecondaryButton
                                    title="duplicate"
                                    onPress={() => onDuplicate(setIndex)}
                                    color={'#710C10'}
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

            {set ?
                <View style={styles.setContainer}>
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
                                <Text>HANG TIME</Text>
                                <Text style={styles.sliderText}>{secondsToMinutes(set.hangTime)}</Text>
                            </View>
                            <Slider
                                style={{width: "100%"}}
                                minimumValue={1}
                                maximumValue={50}
                                minimumTrackTintColor="#FFFFFF"
                                maximumTrackTintColor="#000000"
                                thumbTintColor="#EBB93E"
                                value={set.hangTime}
                                onValueChange={value => onSliderUpdate(setIndex, "hangTime", value)}
                                onLayout={e => e.preventDefault()}
                            />
                        </View>
                    </View>
                    <View style={styles.incrementerContainer}>
                        <View style={styles.sliderContainer}>
                            <View style={styles.sliderTextBox}>
                                <Text>REPS</Text>
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
                                onValueChange={value => onSliderUpdate(setIndex, "reps", value)}
                                onLayout={e => e.preventDefault()}
                            />
                        </View>
                    </View>
                    <View style={styles.incrementerContainer}>
                        <View style={styles.sliderContainer}>
                            <View style={styles.sliderTextBox}>
                                <Text>REST TIME</Text>
                                <Text style={styles.sliderText}>{secondsToMinutes(set.restTime)}</Text>
                            </View>
                            <Slider
                                style={{width: "100%"}}
                                minimumValue={1}
                                maximumValue={1200}
                                minimumTrackTintColor="#FFFFFF"
                                maximumTrackTintColor="#000000"
                                thumbTintColor="#EBB93E"
                                value={set.restTime}
                                onValueChange={value => onSliderUpdate(setIndex, "restTime", value)}
                                onLayout={e => e.preventDefault()}
                            />
                        </View>
                    </View>
                    {!isLastSet ? <View style={styles.incrementerContainer}>
                        <View style={styles.sliderContainer}>
                            <View style={styles.sliderTextBox}>
                                <Text> REST BEFORE NEXT SET</Text>
                                <Text style={styles.sliderText}>{secondsToMinutes(set.restBeforeNextSet)}</Text>
                            </View>
                            <Slider
                                style={{width: "100%"}}
                                minimumValue={1}
                                maximumValue={1200}
                                minimumTrackTintColor="#FFFFFF"
                                maximumTrackTintColor="#000000"
                                thumbTintColor="#EBB93E"
                                value={set.restBeforeNextSet}
                                onValueChange={value => onSliderUpdate(setIndex, "restBeforeNextSet", value)}
                                onLayout={e => e.preventDefault()}
                            />
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
        flexDirection: 'row',
        justifyContent: 'space-between',
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
