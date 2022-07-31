import React from "react"
import {ActivityIndicator, StyleSheet, Text, View} from "react-native"

const TextLoader = ({text}: { text: string }) => {
    return (
        <View style={{...styles.container}}>
            <ActivityIndicator size="large" color='#f5f5f5'/>
            <Text style={{color: '#f5f5f5', marginTop: 10}}>{text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        width: "100%",
        height: "100%",
        paddingTop: 15,
        paddingBottom: 15,
        justifyContent: "center",
        alignItems: "center"
    }
})

export default TextLoader;