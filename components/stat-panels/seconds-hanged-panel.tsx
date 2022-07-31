import Config from "react-native-config";
import {useFocusEffect} from "@react-navigation/native";
import React, {useState} from "react"
import {StyleSheet, Text, View} from "react-native"
import {AuthAPIManager} from "../../auth/auth_manager";
import {cacheIt} from "../../utility/cache";
import LoadingPanel from "./loading-panel";
import NoDataPanel from "./no-data-panel";
import panelStyles from "../../styles/panel";

const SecondsHangedPanel = () => {
    const [totalPerformedTime, setTotalPerformedTime] = useState<number>();
    const [retrievingData, setRetrievingData] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            (async () => {
                await getTotalPerformedTime();
            })();
        }, [])
    )

    const getTotalPerformedTime = async () => {
        const accessToken = await AuthAPIManager.getAccessTokenAsync()
        const URL = `${Config.API_URL}/api/Statistic/PerformedTime`;
        fetch(URL, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(response => cacheIt(response, URL))
            .then((data: string) => {
                setRetrievingData(false);
                setTotalPerformedTime(Number.parseInt(data));
            })
    }

    return (
        <View style={panelStyles.container}>
            {retrievingData ?
                <LoadingPanel/>
                :
                totalPerformedTime ?
                    <View style={styles.container}>
                        <Text style={styles.header}>{totalPerformedTime}</Text>
                        <Text style={styles.text}>Seconds Hanged This Week</Text>
                    </View>
                    :
                    <NoDataPanel/>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 4,
        padding: 20,
        shadowColor: "rgba(99, 99, 99, 0.2)",
        shadowRadius: 50
    },
    header: {
        fontSize: 60,
        textAlign: 'center',
        fontWeight: "bold",
        color: '#f5f5f5'
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        color: '#f5f5f5'
    }

});

export default SecondsHangedPanel;