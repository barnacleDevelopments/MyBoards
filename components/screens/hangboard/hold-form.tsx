import Slider from "@react-native-community/slider";
import React from "react";
import {StyleSheet, Text, View} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import {Hold} from "../../../types/models/hangboard";

interface HoldFormProps {
    hold: Hold,
    holdIndex: number,
    onDepthUpdate: (holdIndex: number, value: number) => void,
    onFingerSelect: (holdIndex: number, fingerCount: number) => void
}

const HoldForm = ({hold, holdIndex, onDepthUpdate, onFingerSelect}: HoldFormProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.pinNumberContainer}>
                <Text style={styles.pinNumberText}>{holdIndex + 1}</Text>
            </View>
            <View style={styles.inputContainer}>
                <SelectDropdown
                    defaultValue={hold.fingerCount || 4}
                    defaultButtonText={"Finger Count"}
                    buttonStyle={styles.selectButton}
                    data={[1, 2, 3, 4]}
                    onSelect={(selectedItem) => onFingerSelect(holdIndex, selectedItem)}
                    buttonTextAfterSelection={(selectedItem) => `${selectedItem} Fingers`}
                    rowTextForSelection={(item) => item}
                />
                <View style={styles.sliderContainer}>
                    <View style={styles.sliderTextBox}>
                        <Text style={styles.sliderText}>DEPTH</Text>
                        <Text style={styles.sliderText}>{hold.depthMM}mm</Text>
                    </View>
                    <Slider
                        style={{width: "100%"}}
                        minimumValue={1}
                        maximumValue={50}
                        minimumTrackTintColor="#FFFFFF"
                        maximumTrackTintColor="#000000"
                        thumbTintColor="#EBB93E"
                        value={hold.depthMM || 1}
                        onValueChange={value => onDepthUpdate(holdIndex, value)}
                        onLayout={e => e.preventDefault()}
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    selectButton: {
        borderStyle: 'solid',
        borderColor: 'grey',
        width: "100%",
        marginBottom: 10,
        borderRadius: 4,
        borderWidth: 1,
        backgroundColor: '#b4b1ac'
    },
    sliderContainer: {
        flex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    sliderText: {
        marginBottom: 5,
        color: '#f5f5f5'
    },
    sliderTextBox: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingRight: 14,
        paddingLeft: 14,

    },
    container: {
        display: 'flex',
        flexDirection: 'row',
        padding: 15,
        alignItems: 'center',
        width: "100%",
        backgroundColor: '#333333',
        marginTop: 10,
    },
    pinNumberContainer: {
        width: 60,
        height: 60,
        borderRadius: 50,
        backgroundColor: '#84a6ff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15
    },
    pinNumberText: {
        color: '#f5f5f5',
        fontWeight: 'bold',
        fontSize: 25,
    },
    inputContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
    },
});

export default HoldForm;