import React from "react";
import {Button, StyleSheet, Text, View} from "react-native";

interface WarningProps {
    onConfirm: () => void,
    onClose: () => void,
    text: string
}

const Warning = ({
                     onConfirm,
                     onClose,
                     text
                 }: WarningProps) => {
    return (
        <View style={{
            position: "absolute",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: "100%",
            width: "100%",
            bottom: 0,
            backgroundColor: "#00000090",
            zIndex: 100000000
        }}>
            {
                <View style={styles.container}>
                    <Text style={styles.text}>{text}</Text>
                    <View style={styles.buttonGroup}>
                        <View style={{flex: 2, marginRight: 10}}>
                            <Button title='cancle' onPress={onClose} color="grey"></Button>
                        </View>
                        <View style={{flex: 2}}>
                            <Button title='Continue' color='#710C10' onPress={onConfirm}></Button>
                        </View>
                    </View>
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "95%",
        backgroundColor: '#333333',
        padding: 15,
        borderRadius: 4
    },
    text: {
        marginBottom: 15,
        fontSize: 22,
        color: '#f5f5f5'
    },
    buttonGroup: {
        display: "flex",
        flexDirection: 'row',
        width: "100%"
    }
})

export default Warning;