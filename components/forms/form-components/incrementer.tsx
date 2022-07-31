import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

interface IncrementerProps {
    onIncrement: () => void,
    onDecrement: () => void,
    displayValue: string
}

const Incrementer = ({onIncrement, onDecrement, displayValue}: IncrementerProps) => {

    const handleDescrementInput = (callback) => {
        if (parseInt(displayValue) > 0) {
            onDecrement();
        }
    }

    return (
        <View style={styles.container}>
            <Pressable
                style={{
                    ...styles.button,
                    backgroundColor: parseInt(displayValue) > 0 ? "#EBB93E" : 'grey'
                }}
                onPress={handleDescrementInput}>
                <Text style={styles.buttonText}>-</Text>
            </Pressable>
            <Text style={styles.text}>{displayValue}</Text>
            <Pressable style={styles.button} onPress={onIncrement}>
                <Text style={styles.buttonText}>+</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%"
    },
    button: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#EBB93E",
        borderRadius: 3,
        width: 30,
        height: 30
    },
    text: {
        fontSize: 15,
        marginLeft: 10,
        marginRight: 10,
        color: '#f5f5f5',
        fontWeight: 'bold'
    },
    buttonText: {
        fontWeight: 'bold',
        color: '#f5f5f5',
        fontSize: 20
    }
})
export default Incrementer;
