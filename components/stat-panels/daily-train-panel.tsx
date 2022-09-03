import {useFocusEffect} from "@react-navigation/native";
import React, {useState} from "react"
import {Text, View} from "react-native"
import {VictoryBar, VictoryChart, VictoryTheme} from 'victory-native';
import LoadingPanel from "./loading-panel";
import NoDataPanel from "./no-data-panel";
import panelStyles from "../../styles/panel";
import {Coordinates} from "../../types/coordinates";

// HOOKS
import useMyBoardsAPI from "../../hooks/use-myboards-api";

const DailyTrainPanel = () => {
    const [dailySeconds, setDailySeconds] = useState<Array<Coordinates>>([]);
    const [retrievingData, setRetrievingData] = useState(true);
    const {getTrainingTime} = useMyBoardsAPI()
    useFocusEffect(
        React.useCallback(() => {
            (async () => {
                try {
                    const dailySeconds = await getTrainingTime();
                    setDailySeconds(dailySeconds);
                } catch {

                } finally {
                    setRetrievingData(false);
                }
            })()
        }, [])
    )

    return (
        <View style={panelStyles.container}>
            {retrievingData ?
                <LoadingPanel/>
                :
                dailySeconds?.some((ds) => ds.y !== 0) ?
                    <View style={{
                        borderRadius: 4,
                        paddingTop: 15,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <Text style={panelStyles.header}>Daily Training Seconds</Text>
                        <VictoryChart
                            domainPadding={{x: 20, y: 20}}
                            theme={{
                                ...VictoryTheme.material,
                                axis: {
                                    ...VictoryTheme.material.axis,
                                    style: {
                                        tickLabels: {
                                            fill: '#f5f5f5',
                                            fontSize: 15,

                                        },
                                        grid: {
                                            display: 'none'
                                        },
                                    },
                                }
                            }}
                        >
                            <VictoryBar
                                style={{
                                    data: {
                                        color: '#f5f5f5',
                                        borderColor: '#f5f5f5',
                                        width: 10,
                                        fill: '#EBB93E'
                                    }
                                }}
                                animate={{
                                    duration: 2000,
                                    onLoad: {duration: 1000}
                                }}
                                categories={{x: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']}}
                                data={dailySeconds}
                                x="day"
                                y="seconds"
                            />
                        </VictoryChart>
                    </View>
                    :
                    <NoDataPanel/>
            }
        </View>
    )
}

export default DailyTrainPanel;