import React from "react";
import {ActivityIndicator, StyleSheet, Text, View} from "react-native";

const OfflineLoader = () => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large"/>
            <Text>Hangboards are Currently Unavailable Offline</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {display: "flex", paddingBottom: 15, justifyContent: "center", alignItems: "center"}
});

export default OfflineLoader;
