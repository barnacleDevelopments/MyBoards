import {useFocusEffect,} from "@react-navigation/native";
import React, {useState} from "react"
import {Button, StyleSheet, Text, View} from "react-native"
import {VictoryPie} from "victory-native";
import LoadingPanel from "./loading-panel";
import NoDataPanel from "./no-data-panel";
import panelStyles from "../../styles/panel";

// HOOKS
import useMyBoardsAPI, { YearFraction } from "../../hooks/use-myboards-api";

const GripUsagePanel = () => {
    const [gripUsage, setGripUsage] = useState();
    const [chartData, setChartData] = useState([]);
    const [retrievingData, setRetrievingData] = useState(true);
    const [yearFraction, setYearFraction] = useState<YearFraction>(YearFraction.week);
    const {getGripUsage} = useMyBoardsAPI();

    useFocusEffect(
        React.useCallback(() => {
            (async () => {
                try {
                    const data = await getGripUsage(yearFraction);
                    const chartDataArr = [];

                    if (data.fullCrimp > 0) {
                        chartDataArr.push({
                            x: "Full-Crimp",
                            y: data.fullCrimp
                        });
                    }

                    if (data.halfCrimp > 0) {
                        chartDataArr.push({
                            x: "Half-Crimp",
                            y: data.halfCrimp
                        });
                    }

                    if (data.openHand > 0) {
                        chartDataArr.push({
                            x: "Open-Hand",
                            y: data.openHand
                        });
                    }

                    setRetrievingData(false);
                    setChartData(chartDataArr);
                    setGripUsage(data);
                } catch (ex) {

                } finally {
                    setRetrievingData(false);
                }

            })();
        }, [yearFraction])
    )

    return (
        <View style={{...panelStyles.container, borderRadius: 4, marginBottom: 30}}>
            {retrievingData ?
                <LoadingPanel/>
                :
                <View>
                    <Text style={styles.mainHeader}>Grip Usage</Text>
                    {chartData.length > 0 ?
                        <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <VictoryPie
                                colorScale={["#d25330", "#2c6c49", "#0f3f91"]}
                                padding={{top: 0, left: 80, right: 80, bottom: 0}}
                                style={{
                                    labels: {fill: "white", display: 'none', fontSize: 20, fontWeight: "bold"},
                                    data: {fillOpacity: 0.9, stroke: "#EBB93E", strokeWidth: 2}
                                }}
                                data={chartData}
                                labelRadius={({innerRadius}) => innerRadius + 20}
                            />
                        </View> : <NoDataPanel/>}
                    <View style={styles.percentContainer}>
                        <View style={{...styles.percentItem, backgroundColor: "#d25330"}}>
                            <Text style={styles.percentHeader}>Full - Crimp</Text>
                            <Text
                                style={styles.percentText}>{gripUsage?.fullCrimp ? gripUsage?.fullCrimp.toFixed(2) : 0}%</Text>
                        </View>
                        <View style={{...styles.percentItem, backgroundColor: "#2c6c49"}}>
                            <Text style={styles.percentHeader}>Half - Crimp</Text>
                            <Text
                                style={styles.percentText}>{gripUsage?.halfCrimp ? gripUsage?.halfCrimp.toFixed(2) : 0}%</Text>
                        </View>
                        <View style={{...styles.percentItem, backgroundColor: "#0f3f91"}}>
                            <Text style={styles.percentHeader}>Open - Hand</Text>
                            <Text
                                style={styles.percentText}>{gripUsage?.openHand ? gripUsage?.openHand.toFixed(2) : 0}%</Text>
                        </View>
                    </View>
                    <View>
                        <View style={{
                            display: 'flex',
                            flexDirection: 'row',
                            width: "100%",
                            paddingLeft: 15,
                            paddingRight: 15,
                            paddingBottom: 10
                        }}>
                            <View style={{flex: 1, marginRight: 8}}>
                                <Button color='#EBB93E' title='week'
                                        onPress={() => setYearFraction(YearFraction.week)}></Button>
                            </View>
                            <View style={{flex: 1}}>
                                <Button color='#EBB93E' title='month'
                                        onPress={() => setYearFraction(YearFraction.month)}></Button>
                            </View>
                            <View style={{flex: 1, marginLeft: 8}}>
                                <Button color='#EBB93E' title='quarter'
                                        onPress={() => setYearFraction(YearFraction.quarter)}></Button>
                            </View>
                        </View>
                    </View>
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    percentContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginBottom: 10,
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 10,
    },
    mainHeader: {
        fontSize: 25,
        textAlign: 'center',
        marginTop: 15,
        color: '#f5f5f5'
    },
    percentItem: {
        flex: 1,
        borderRadius: 4,
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10,
        display: "flex",
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        marginBottom: 5
    },
    percentHeader: {
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: "center",
        color: '#f5f5f5'
    },
    percentText: {
        textAlign: "center",
        fontSize: 16,
        color: '#f5f5f5'
    }
});

export default GripUsagePanel;