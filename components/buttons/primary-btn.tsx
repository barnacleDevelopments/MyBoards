import React from 'react';
import {GestureResponderEvent, Pressable, StyleSheet, Text, View} from "react-native";

const PrimaryButton = ({
                             title,
                             color,
                             onPress,
                             disabled
                         }: { title: string, color: string, disabled?: boolean, onPress?: (event: GestureResponderEvent) => void }) => {
    return (
            <Pressable disabled={disabled} style={{...styles.button, backgroundColor: color}} onPress={onPress}>
                <Text style={styles.text}>{title}</Text>
            </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingLeft: 18,
        paddingRight: 18,
        paddingBottom: 14,
        paddingTop: 14,
        borderRadius: 7,
        position: "absolute",
        bottom: 10,
        left: 10,
    },
    text: {
        fontSize: 16,
        fontWeight: "700",
        color: '#F5F5F5',
        textTransform: "uppercase",
        textAlign: "center"

    }
});

export default PrimaryButton;