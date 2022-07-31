import React from "react";
import {StyleSheet, Text, View} from "react-native";
import globalStyles from "../styles/global";
import SecondaryButton from "./buttons/secondary-btn";

const CustomFallback = (props: { error: Error, resetError: Function }) => (
    <View style={styles.container}>
        <View style={{
            backgroundColor: 'grey',
            padding: 10
        }}>
            <Text style={globalStyles.textBoxHeading}>Error Occured!</Text>
            <SecondaryButton onPress={props.resetError} color={"#EBB93E"} title='Back to Home Screen'/>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        height: "100%",
        display: 'flex',
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#212021'
    }
})

export default CustomFallback;