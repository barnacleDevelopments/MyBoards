import React from "react"
import {StyleSheet, Text, View} from "react-native"
import panelStyles from "../../styles/panel"

const NoDataPanel = () => {

    return (
        <View style={{...panelStyles.container, ...styles.container,}}>
            <Text style={styles.header}>No data to display.</Text>
            <Text style={styles.text}>Click <Text style={{color: "#EBB93E"}}>GET STARTED</Text> to start a
                session.</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 4,
        display: 'flex',
        alignItems: "center",
        justifyContent: 'center',
        flexDirection: "column",
        padding: 10,
        paddingTop: 0,
        paddingBottom: 15
    },
    text: {textAlign: "center", color: '#f5f5f5'},
    header: {fontSize: 20, marginBottom: 10, color: '#f5f5f5'}
})

export default NoDataPanel;