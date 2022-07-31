import React from "react"
import {ActivityIndicator, StyleSheet, View} from "react-native"
import panelStyles from "../../styles/panel"

const LoadingPanel = () => {
    return (
        <View style={{...styles.container, ...panelStyles.container}}>
            <ActivityIndicator size="large"/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        ...panelStyles.container,
        display: "flex",
        width: "100%",
        paddingTop: 15,
        paddingBottom: 15,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#f5f5f5'
    }
})

export default LoadingPanel;