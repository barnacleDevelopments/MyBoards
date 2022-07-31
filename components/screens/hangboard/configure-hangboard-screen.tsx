import {NativeStackScreenProps} from "@react-navigation/native-stack";
import React, {useEffect, useState} from "react";

// Components
import {Button, Image, NativeTouchEvent, Pressable, StyleSheet, Text, View} from "react-native";
import {positionPin} from "../../../functions/hangboard-panel";

// Types 
import {Hangboard, Hold} from "../../../types/models/hangboard";
import {ImageData} from "../../../types/image-data";
import {isPortrait} from "../../../functions/utility";
import {BoardDimensions} from "../../../types/board-dimensions";

type RootStackParamList = {
    ConfigureHangboardScreen: {
        hangboard: Hangboard,
        image: ImageData,
        screenSize: BoardDimensions
    };
}

type Props = NativeStackScreenProps<RootStackParamList, 'ConfigureHangboardScreen'>;

const ConfigureHangboardScreen = ({navigation, route}: Props) => {

    const [hangboard, setHangboard] = useState<any>(route.params.hangboard);
    const [screenSize, setScreenSize] = useState({width: 0, height: 0});
    const [screenSizeHistory, setScreenSizeHistory] = useState<{ width: number, height: number }[]>([]);
    const [orientedScreenWidth, setOrientationScreenWidth] = useState<number>(0);
    const [orientedScreenHeight, setOrientationScreenHeight] = useState<number>(0);

    // keep history of orientation 
    useEffect(() => {
        setScreenSizeHistory(history => {
            let screenSizes = history;

            if (screenSizes.length > 1) {
                return screenSizes;
            }
            screenSizes.unshift(screenSize);

            return screenSizes;
        });

    }, [screenSize.width]);


    useEffect(() => {

        
        
        
        
        const width = screenSizeHistory[screenSizeHistory[1]?.width ? screenSizeHistory[0]?.width >= screenSizeHistory[1]?.width ? 1 : 0 : 0]?.width
        const height = screenSizeHistory[screenSizeHistory[1]?.height ? screenSizeHistory[0]?.height >= screenSizeHistory[1]?.height ? 1 : 0 : 0]?.height
        
        
        
        
        
        setOrientationScreenHeight(height)
        setOrientationScreenWidth(width)
    },[screenSize.width]);
    
    /**
     * @description adds new hold to hangboard state.
     */
    const addHold = ({nativeEvent}: { nativeEvent: NativeTouchEvent }) => {
        let hold = {
            baseUIXCoord: nativeEvent.locationX,
            baseUIYCoord: nativeEvent.locationY
        }

        if (hangboard.boardWidth === 0) {
            hold.baseUIXCoord = positionPin(nativeEvent.locationX, screenSize.width, screenSizeHistory[0]?.width || screenSize.width);
            hold.baseUIYCoord = positionPin(nativeEvent.locationY, screenSize.height, screenSizeHistory[0]?.height || screenSize.height);
        }

        if (hangboard.boardWidth > 0) {
            hold.baseUIXCoord = positionPin(nativeEvent.locationX, screenSize.width, hangboard.boardWidth);
            hold.baseUIYCoord = positionPin(nativeEvent.locationY, screenSize.height, hangboard.boardHeight);
        }

        setHangboard((hangboard: { holds: any; }) => {
            return ({
                ...hangboard,
                holds: [...hangboard.holds, hold]
            });
        });
    }

    /**
     *
     * @description removes the most recently placed hold.
     */
    const removeLastHold = () =>
        setHangboard((hangboard: Hangboard) => ({
            ...hangboard,
            holds: hangboard.holds
                .filter((h, i) => i !== hangboard.holds.length - 1)
        }));

    /**
     *
     * @description wipes all holds from board.
     */
    const removeAllHolds = () => setHangboard((hangboard: Hangboard) => ({
        ...hangboard,
        holds: []
    }));

    /**
     *
     * @description display different navigation button if edit or create hangboard.
     */
    const FinishButton = () => {
        if (hangboard?.id) {
            return (
                <Button
                    title="update"
                    color="#EBB93E"
                    onPress={() => {
                        navigation.navigate("Edit Hangboard", {
                            hangboard: {
                                ...hangboard
                            }
                        });
                    }}
                />
            )
        } else {
            return (
                <Button
                    title="done"
                    color="#EBB93E"
                    onPress={() => {
                        navigation.navigate("Create Hangboard", {
                            hangboard: {
                                ...hangboard,
                                boardHeight: screenSize.height,
                                boardWidth: screenSize.width
                            }
                        })
                    }}
                />
            );
        }
    }

    const imageAspectRatio = (width: number, height: number) => {

        let antecedent, consequent, largestNumber;

        largestNumber = width > height ? width : height;

        antecedent = width / largestNumber;

        consequent = height / largestNumber;

        return antecedent / consequent;
    }

    const aspectRatio = imageAspectRatio(route.params.screenSize.width, route.params.screenSize.height);
    



    return (
        <View style={styles.container}>
            {/* Pin placement panel */}
            <Pressable
                style={styles.panel}
                onPress={addHold}>
                <Image
                    source={{uri: route.params.image.path}}
                    style={{...styles.image, aspectRatio: aspectRatio}}
                    onLayout={({nativeEvent}) => setScreenSize(nativeEvent.layout)}
                />
                {hangboard.holds.map((hold: Hold, i: number) =>
                    <Pressable
                        key={i}
                        style={{
                            ...styles.pin,
                            top: positionPin(
                                hold.baseUIYCoord,
                                hangboard.boardHeight || orientedScreenHeight || screenSize.height,
                                screenSize.height
                            ) - 15 || 0,
                            left: positionPin(
                                hold.baseUIXCoord,
                                hangboard.boardWidth || orientedScreenWidth || screenSize.width,
                                screenSize.width
                            ) - 15 || 0
                        }}
                    >
                        <Text style={{color: '#f5f5f5'}}>{i + 1}</Text>
                    </Pressable>
                )}
            </Pressable>
            {/* Buttons */}
            {isPortrait() ?
                <View style={styles.buttonContainer}>
                    <View>
                        <FinishButton/>
                    </View>
                    <View style={{marginLeft: 10, marginRight: 10}}>
                        <Button
                            title="remove last"
                            color='#333333'
                            onPress={removeLastHold}
                        />
                    </View>
                    <Button
                        title="reset"
                        color='#710C10'
                        onPress={removeAllHolds}
                    />
                </View> : null
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
        backgroundColor: '#212121'
    },
    buttonContainer: {
        display: "flex",
        flexDirection: "row",
        marginTop: 10
    },
    panel: {
        width: "100%",
        borderRadius: 5,
        backgroundColor: '#333333'
    },
    image: {
        position: 'relative',
        borderColor: '#b4b1ac',
        borderWidth: 3,
    },
    pin: {
        backgroundColor: '#84a6ff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 30,
        width: 30,
        borderRadius: 50,
        position: 'absolute',
    }
})

export default ConfigureHangboardScreen;

