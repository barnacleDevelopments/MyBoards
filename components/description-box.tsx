import React, {ReactNode} from "react";
import {StyleSheet, Text, View} from "react-native";

const DescriptionBox = ({header, text, children}: { header: string, text: string, children?: ReactNode }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>{header}</Text>
            <Text style={styles.text}>{text}</Text>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#333333",
        borderRadius: 4,
        padding: 20,
        shadowColor: "rgba(99, 99, 99, 0.2)",
        shadowRadius: 50,
        width: '100%'
    },
    header: {
        fontSize: 20,
        color: '#f5f5f5',
        fontWeight: 'bold',
        textAlign: "center",
        marginBottom: 7
    },
    text: {
        fontSize: 15,
        color: '#f5f5f5',
        marginBottom: 12,
        textAlign: "center",
    }
});

export default DescriptionBox;