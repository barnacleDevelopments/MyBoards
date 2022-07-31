import React from 'react';
import {GestureResponderEvent, Pressable, StyleSheet, Text} from "react-native";

const SecondaryButton = ({
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
        paddingLeft: 14,
        paddingRight: 14,
        paddingBottom: 10,
        paddingTop: 10,
        borderRadius: 7
    },
    text: {
        fontSize: 16,
        fontWeight: "700",
        color: '#F5F5F5',
        textTransform: "uppercase",
        textAlign: 'center',
    }
});

export default SecondaryButton;